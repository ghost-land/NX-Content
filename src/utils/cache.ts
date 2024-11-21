import { logger } from './logger';

const CACHE_PREFIX = 'nx-working-';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

export async function getCachedData<T>(key: string): Promise<T | null> {
  try {
    const item = localStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!item) return null;

    const { value, timestamp } = JSON.parse(item);
    if (Date.now() - timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(`${CACHE_PREFIX}${key}`);
      return null;
    }

    return value as T;
  } catch (error) {
    logger.error('Cache read error', { 
      key,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });
    return null;
  }
}

export function setCachedData(key: string, value: unknown): void {
  try {
    const item = {
      value,
      timestamp: Date.now(),
    };
    localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(item));
  } catch (error) {
    logger.error('Cache write error', { 
      key,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export function clearCache(): void {
  try {
    Object.keys(localStorage)
      .filter(key => key.startsWith(CACHE_PREFIX))
      .forEach(key => localStorage.removeItem(key));
  } catch (error) {
    logger.error('Cache clear error', { 
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}