import { GameInfo } from '../types';
import { logger } from '../utils/logger';

const API_CONFIG = {
  baseUrls: [
    'https://api.nlib.cc',
    'https://api-nlib.vercel.app',
    'https://nlib-api.vercel.app'
  ],
  timeout: 5000,
  retryDelay: 1000,
  maxRetries: 2,
  cacheExpiry: 24 * 60 * 60 * 1000 // 24 hours
};

// IndexedDB configuration
const DB_CONFIG = {
  name: 'NXWorkingDB',
  version: 1,
  storeName: 'gameData'
};

class GameDataService {
  private db: IDBDatabase | null = null;

  constructor() {
    this.initDB().catch(error => {
      logger.error('Failed to initialize IndexedDB', { error });
    });
  }

  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);

      request.onerror = () => {
        logger.error('IndexedDB access denied');
        reject(new Error('IndexedDB access denied'));
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(DB_CONFIG.storeName)) {
          db.createObjectStore(DB_CONFIG.storeName, { keyPath: 'id' });
        }
      };
    });
  }

  private async getCachedData(titleId: string): Promise<GameInfo | null> {
    if (!this.db) return null;

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([DB_CONFIG.storeName], 'readonly');
      const store = transaction.objectStore(DB_CONFIG.storeName);
      const request = store.get(titleId);

      request.onsuccess = () => {
        const data = request.result;
        if (!data || Date.now() - data.timestamp > API_CONFIG.cacheExpiry) {
          resolve(null);
          return;
        }
        resolve(data.gameInfo);
      };

      request.onerror = () => {
        logger.warn('Failed to read from cache', { titleId });
        resolve(null);
      };
    });
  }

  private async setCachedData(titleId: string, gameInfo: GameInfo): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([DB_CONFIG.storeName], 'readwrite');
      const store = transaction.objectStore(DB_CONFIG.storeName);
      const request = store.put({
        id: titleId,
        gameInfo,
        timestamp: Date.now()
      });

      request.onsuccess = () => resolve();
      request.onerror = () => {
        logger.warn('Failed to write to cache', { titleId });
        resolve();
      };
    });
  }

  private async fetchWithTimeout(url: string): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private normalizeGameData(rawData: any, titleId: string): GameInfo {
    return {
      id: titleId,
      name: rawData.name || 'Unknown Title',
      publisher: rawData.publisher || 'Unknown Publisher',
      description: rawData.description || 'No description available',
      size: typeof rawData.size === 'number' ? rawData.size : null,
      version: rawData.version || 'Unknown',
      releaseDate: rawData.release_date || null,
      rating: rawData.rating || null,
      categories: Array.isArray(rawData.categories) ? rawData.categories : [],
      languages: Array.isArray(rawData.languages) ? rawData.languages : [],
      screenshots: Array.isArray(rawData.screenshots) ? rawData.screenshots : []
    };
  }

  async getGameData(titleId: string): Promise<GameInfo> {
    try {
      // Try to get from cache first
      const cachedData = await this.getCachedData(titleId);
      if (cachedData) {
        logger.info('Cache hit', { titleId });
        return cachedData;
      }

      logger.info('Fetching game data', { titleId });

      // Try each API endpoint
      for (const baseUrl of API_CONFIG.baseUrls) {
        for (let retry = 0; retry <= API_CONFIG.maxRetries; retry++) {
          try {
            if (retry > 0) {
              await new Promise(resolve => setTimeout(resolve, API_CONFIG.retryDelay));
            }

            const response = await this.fetchWithTimeout(`${baseUrl}/nx/${titleId}`);
            
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const gameInfo = this.normalizeGameData(data, titleId);
            
            // Cache the successful response
            await this.setCachedData(titleId, gameInfo);
            
            logger.info('Successfully fetched and cached game data', { titleId });
            return gameInfo;
          } catch (error) {
            logger.warn(`Attempt ${retry + 1} failed for ${baseUrl}`, { 
              titleId,
              error: error instanceof Error ? error.message : 'Unknown error'
            });

            if (retry === API_CONFIG.maxRetries) {
              continue; // Try next API endpoint
            }
          }
        }
      }

      // If all attempts failed, throw error
      throw new Error('All API endpoints failed');
    } catch (error) {
      logger.error('Failed to fetch game data', {
        titleId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      // Return fallback data
      return {
        id: titleId,
        name: 'Title Information Unavailable',
        publisher: 'Unknown Publisher',
        description: 'Game information is currently unavailable.',
        size: null,
        version: 'Unknown',
        releaseDate: null,
        rating: null,
        categories: [],
        languages: [],
        screenshots: []
      };
    }
  }

  async clearCache(): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([DB_CONFIG.storeName], 'readwrite');
      const store = transaction.objectStore(DB_CONFIG.storeName);
      const request = store.clear();

      request.onsuccess = () => {
        logger.info('Cache cleared successfully');
        resolve();
      };

      request.onerror = () => {
        logger.warn('Failed to clear cache');
        resolve();
      };
    });
  }
}

export const gameDataService = new GameDataService();