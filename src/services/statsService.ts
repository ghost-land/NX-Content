import { logger } from '../utils/logger';

interface StatsResponse {
  total_downloads: number;
}

export async function getDownloadStats(titleId: string): Promise<number | null> {
  try {
    const response = await fetch(`https://stats.ghostland.at/${titleId}/json`);
    if (!response.ok) return null;
    
    const data: StatsResponse = await response.json();
    return data.total_downloads;
  } catch (error) {
    logger.error('Failed to fetch download stats', { 
      titleId,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });
    return null;
  }
}