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

export function getContentType(tid: string): 'base' | 'update' | 'dlc' {
  if (tid.endsWith('000')) return 'base';
  if (tid.endsWith('800')) return 'update';
  return 'dlc';
}

export function filterBaseGames(games: ProcessedGame[]): ProcessedGame[] {
  return games.filter(game => game.type === 'base');
}

export function getRelatedContent(games: ProcessedGame[], baseTid: string) {
  const baseId = baseTid.slice(0, 12);
  
  // Only get updates that have an updateVersion (from TXT file)
  const updates = games.filter(game => 
    game.tid.startsWith(baseId) && 
    game.type === 'update' &&
    game.updateVersion !== undefined
  )
    .sort((a, b) => (b.updateVersion || 0) - (a.updateVersion || 0));
  
  // Get DLCs from games array
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

export function processGameData(data: GamesData): ProcessedGame[] {
  const entries = Object.entries(data);
  const result: ProcessedGame[] = [];
  
  for (let i = 0; i < entries.length; i++) {
    const [tid, game] = entries[i];
    const type = getContentType(tid.split('_')[0]); // Remove index for update TIDs
    
    result.push({
      tid: tid.split('_')[0], // Remove index for update TIDs
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

export function mergeGameData(jsonData: GamesData, txtEntries: { tid: string; version: string }[]): GamesData {
  const mergedData = { ...jsonData };
  
  // Group updates by TID to handle multiple versions
  const updatesByTid = new Map<string, string[]>();
  
  // Process TXT entries
  txtEntries.forEach(({ tid, version }) => {
    if (tid.endsWith('800')) {
      if (!updatesByTid.has(tid)) {
        updatesByTid.set(tid, []);
      }
      updatesByTid.get(tid)!.push(version);
    }
  });
  
  // Add all updates to merged data
  updatesByTid.forEach((versions, tid) => {
    // Sort versions in descending order
    versions.sort((a, b) => {
      const vA = parseInt(a) || 0;
      const vB = parseInt(b) || 0;
      return vB - vA;
    });
    
    // Create an entry for each version
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

export async function processGameDataInChunks(data: GamesData, onProgress: (progress: number) => void): Promise<ProcessedGame[]> {
  const entries = Object.entries(data);
  const chunkSize = 500;
  const processedGames: ProcessedGame[] = [];
  const totalEntries = entries.length;
  let lastProgressReport = Date.now();

  for (let i = 0; i < entries.length; i += chunkSize) {
    const chunk = entries.slice(i, i + chunkSize);
    
    // Process chunk
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
    
    // Report progress less frequently to reduce UI updates
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