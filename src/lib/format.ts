import type { ProcessedGame, GamesData } from './types';

/**
 * Formats bytes into human-readable string with appropriate units
 * 
 * @param bytes - Number of bytes to format
 * @returns Formatted string (e.g., "1.25 GB")
 */
export function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * Determines the content type based on Title ID pattern
 * 
 * @param tid - Title ID to analyze
 * @returns Content type: 'base' for games ending in '000', 'update' for '800', 'dlc' for others
 */
export function getContentType(tid: string): 'base' | 'update' | 'dlc' {
  if (tid.endsWith('000')) return 'base';
  if (tid.endsWith('800')) return 'update';
  return 'dlc';
}

/**
 * Filters games array to return only base games
 * 
 * @param games - Array of processed games
 * @returns Array containing only base games
 */
export function filterBaseGames(games: ProcessedGame[]): ProcessedGame[] {
  return games.filter(game => game.type === 'base');
}

/**
 * Retrieves related content (updates and DLCs) for a specific base game
 * 
 * @param games - Array of all processed games
 * @param baseTid - Base Title ID to find related content for
 * @returns Object containing arrays of updates and DLCs, sorted appropriately
 */
export function getRelatedContent(games: ProcessedGame[], baseTid: string) {
  const baseId = baseTid.slice(0, 12);
  
  // Filter updates that have an updateVersion (from TXT file)
  const updates = games.filter(game => 
    game.tid.startsWith(baseId) && 
    game.type === 'update' &&
    game.updateVersion !== undefined
  )
    .sort((a, b) => (b.updateVersion || 0) - (a.updateVersion || 0));
  
  // Filter DLCs for the same base game
  const dlcs = games.filter(game => 
    game.tid.slice(0, 12) === baseId && 
    game.tid !== baseTid && 
    game.type === 'dlc'
  ).sort((a, b) => a.name.localeCompare(b.name));
  
  return {
    updates,
    dlcs
  };
}

/**
 * Processes raw game data into structured ProcessedGame objects
 * Handles different content types and formats data appropriately
 * 
 * @param data - Raw games data from JSON database
 * @returns Array of processed game objects
 */
export function processGameData(data: GamesData): ProcessedGame[] {
  const entries = Object.entries(data);
  const result: ProcessedGame[] = [];
  
  for (let i = 0; i < entries.length; i++) {
    const [tid, game] = entries[i];
    const cleanTid = tid.split('_')[0]; // Remove index for update TIDs
    const type = getContentType(cleanTid);
    
    result.push({
      tid: cleanTid,
      name: game["Game Name"],
      version: type === 'update' ? game["Update Version"]?.toString() || game.Version : game.Version,
      updateVersion: game["Update Version"],
      size: game.Size,
      type,
      sizeFormatted: type === 'base' ? formatBytes(game.Size) : ''
    });
  }
  
  return result;
}

/**
 * Merges JSON and TXT data sources into a unified dataset
 * Handles multiple update versions from TXT file and creates unique entries
 * 
 * @param jsonData - Game data from JSON source
 * @param txtEntries - Update data from TXT source
 * @returns Merged and processed game data
 */
export function mergeGameData(jsonData: GamesData, txtEntries: { tid: string; version: string }[]): GamesData {
  const mergedData = { ...jsonData };
  
  // Group updates by TID to handle multiple versions
  const updatesByTid = new Map<string, string[]>();
  
  // Process TXT entries and group by TID
  txtEntries.forEach(({ tid, version }) => {
    if (tid.endsWith('800')) {
      if (!updatesByTid.has(tid)) {
        updatesByTid.set(tid, []);
      }
      updatesByTid.get(tid)!.push(version);
    }
  });
  
  // Add all updates to merged data with unique identifiers
  updatesByTid.forEach((versions, tid) => {
    // Sort versions in descending order (newest first)
    versions.sort((a, b) => {
      const vA = parseInt(a) || 0;
      const vB = parseInt(b) || 0;
      return vB - vA;
    });
    
    // Create an entry for each version with unique TID
    versions.forEach((version, index) => {
      const updateTid = `${tid}_${index}`; // Add index to make unique TIDs
      mergedData[updateTid] = {
        "Game Name": "Update",
        "Version": version,
        "Update Version": parseInt(version) || 0,
        "Size": 0
      };
    });
  });
  
  return mergedData;
}

/**
 * Processes game data in chunks to prevent UI blocking during large dataset processing
 * Reports progress to allow for progress indicators
 * 
 * @param data - Raw games data to process
 * @param onProgress - Callback function to report processing progress (0-100)
 * @returns Promise resolving to array of processed games
 */
export async function processGameDataInChunks(data: GamesData, onProgress: (progress: number) => void): Promise<ProcessedGame[]> {
  const entries = Object.entries(data);
  const chunkSize = 500;
  const processedGames: ProcessedGame[] = [];
  const totalEntries = entries.length;
  let lastProgressReport = Date.now();

  for (let i = 0; i < entries.length; i += chunkSize) {
    const chunk = entries.slice(i, i + chunkSize);
    
    // Process current chunk
    for (const [tid, game] of chunk) {
      processedGames.push({
        tid,
        name: game["Game Name"],
        version: game.Version,
        size: game.Size,
        type: getContentType(tid),
        sizeFormatted: formatBytes(game.Size)
      });
    }
    
    // Report progress with throttling to prevent excessive UI updates
    const now = Date.now();
    if (now - lastProgressReport > 100) { // Update every 100ms max
      const progress = Math.min((i + chunkSize) / totalEntries * 100, 100);
      onProgress(progress);
      lastProgressReport = now;
      // Allow UI to update
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }

  return processedGames;
}