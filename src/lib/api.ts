import type { RecentGame, GameDetails } from './types';

export async function fetchRecentUpdates(): Promise<RecentGame[]> {
  try {
    const response = await fetch('https://corsproxy.io/?url=https://data.ghostland.at/rss_feed_updates.xml');
    if (!response.ok) {
      throw new Error('Failed to fetch recent updates');
    }
    return parseRSSFeed(await response.text());
  } catch (error) {
    console.error('Error fetching recent updates:', error);
    return [];
  }
}

export async function fetchRecentDLCs(): Promise<RecentGame[]> {
  try {
    const response = await fetch('https://corsproxy.io/?url=https://data.ghostland.at/rss_feed_dlc.xml');
    if (!response.ok) {
      throw new Error('Failed to fetch recent DLCs');
    }
    return parseRSSFeed(await response.text());
  } catch (error) {
    console.error('Error fetching recent DLCs:', error);
    return [];
  }
}

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
  
  return games.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export async function fetchRecentGames(): Promise<RecentGame[]> {
  try {
    const response = await fetch('https://corsproxy.io/?url=https://data.ghostland.at/rss_feed_base.xml');
    if (!response.ok) {
      throw new Error('Failed to fetch recent games');
    }
    return parseRSSFeed(await response.text());
  } catch (error) {
    console.error('Error fetching recent games:', error);
    return [];
  }
}

export async function fetchGameDetails(tid: string): Promise<GameDetails> {
  try {
    const response = await fetch(`https://api.nlib.cc/nx/${tid}/info`);
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