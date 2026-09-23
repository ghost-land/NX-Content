import type { RecentGame, GameDetails } from './types';

const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours
const CACHE_PREFIX = 'nx-rss-cache:';

const FEED_URLS = {
  updates: 'https://data.ghostland.at/rss_feed_updates.xml',
  dlc: 'https://data.ghostland.at/rss_feed_dlc.xml',
  base: 'https://data.ghostland.at/rss_feed_base.xml',
} as const;

interface CachedFeed {
  timestamp: number;
  games: Array<Omit<RecentGame, 'date'> & { date: string }>;
}

/**
 * Reads a cached RSS feed from localStorage if still within the TTL.
 */
function getCachedFeed(url: string): RecentGame[] | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + url);
    if (!raw) return null;

    const cached: CachedFeed = JSON.parse(raw);
    if (Date.now() - cached.timestamp > CACHE_TTL_MS) {
      localStorage.removeItem(CACHE_PREFIX + url);
      return null;
    }

    return cached.games.map((game) => ({
      ...game,
      date: new Date(game.date),
    }));
  } catch {
    localStorage.removeItem(CACHE_PREFIX + url);
    return null;
  }
}

/**
 * Persists a parsed RSS feed in localStorage with a fresh timestamp.
 */
function setCachedFeed(url: string, games: RecentGame[]): void {
  try {
    const payload: CachedFeed = {
      timestamp: Date.now(),
      games: games.map((game) => ({
        ...game,
        date: game.date.toISOString(),
      })),
    };
    localStorage.setItem(CACHE_PREFIX + url, JSON.stringify(payload));
  } catch (error) {
    // Quota exceeded or private browsing — fail open without cache
    console.warn('Unable to cache RSS feed:', error);
  }
}

/**
 * Fetches an RSS feed, preferring a client-side cache (max 6h) to avoid spam.
 */
async function fetchRSSFeed(url: string): Promise<RecentGame[]> {
  const cached = getCachedFeed(url);
  if (cached) return cached;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch RSS feed: ${url}`);
  }

  const games = parseRSSFeed(await response.text());
  setCachedFeed(url, games);
  return games;
}

/**
 * Fetches recent game updates from the RSS feed
 *
 * @returns Promise resolving to an array of recent game updates
 */
export async function fetchRecentUpdates(): Promise<RecentGame[]> {
  try {
    return await fetchRSSFeed(FEED_URLS.updates);
  } catch (error) {
    console.error('Error fetching recent updates:', error);
    return [];
  }
}

/**
 * Fetches recent DLC content from the RSS feed
 *
 * @returns Promise resolving to an array of recent DLC content
 */
export async function fetchRecentDLCs(): Promise<RecentGame[]> {
  try {
    return await fetchRSSFeed(FEED_URLS.dlc);
  } catch (error) {
    console.error('Error fetching recent DLCs:', error);
    return [];
  }
}

/**
 * Fetches recent base games from the RSS feed
 *
 * @returns Promise resolving to an array of recent base games
 */
export async function fetchRecentGames(): Promise<RecentGame[]> {
  try {
    return await fetchRSSFeed(FEED_URLS.base);
  } catch (error) {
    console.error('Error fetching recent games:', error);
    return [];
  }
}

/**
 * Fetches detailed information for a specific game
 *
 * @param tid - The Title ID of the game
 * @returns Promise resolving to game details
 */
export async function fetchGameDetails(tid: string): Promise<GameDetails> {
  try {
    const response = await fetch(`https://api.nlib.cc/nx/${tid}`);
    if (!response.ok) {
      throw new Error('Failed to fetch game details');
    }
    const data = await response.json();

    return {
      publisher: data.publisher || '',
      releaseDate: data.releaseDate || '',
      description: data.description || '',
      numberOfPlayers: data.numberOfPlayers || '',
      languages: data.languages || [],
      category: data.category || [],
      screens: {
        screenshots: data.screens?.screenshots || []
      }
    };
  } catch (error) {
    console.error('Error fetching game details:', error);
    throw error;
  }
}

/**
 * Parses RSS feed XML and extracts game information
 *
 * @param xmlText - The RSS feed XML content
 * @returns Array of parsed game information
 */
function parseRSSFeed(xmlText: string): RecentGame[] {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
  const items = xmlDoc.getElementsByTagName('item');

  const games: RecentGame[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const title = item.getElementsByTagName('title')[0]?.textContent || '';
    const description = item.getElementsByTagName('description')[0]?.textContent || '';
    const pubDate = item.getElementsByTagName('pubDate')[0]?.textContent || '';

    // Extract information using regex patterns
    const tidMatch = description.match(/Title ID: ([0-9A-Fa-f]+)/);
    const sizeMatch = description.match(/Size: ([0-9.]+ [KMGT]iB)/i);
    const versionMatch = description.match(/Version: v([0-9.]+)/);
    const typeMatch = description.match(/Type: ([^\[]+)/);
    const formatMatch = description.match(/Format: ([A-Z]+)/);

    games.push({
      title: title.replace(/\[.*?\]/, '').trim(),
      tid: tidMatch?.[1] || '',
      size: sizeMatch?.[1] || '',
      version: versionMatch?.[1] || '',
      type: typeMatch?.[1]?.trim() || '',
      format: formatMatch?.[1] || '',
      date: new Date(pubDate),
      iconUrl: `https://nx-missing.ghostland.at/icons/${tidMatch?.[1]}.jpg`
    });
  }

  // Sort by date, most recent first
  return games.sort((a, b) => b.date.getTime() - a.date.getTime());
}
