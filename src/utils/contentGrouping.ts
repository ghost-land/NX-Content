import { ContentItem } from '../types';

export function getBaseTitleId(titleId: string): string {
  // For base titles (ending in 000), return as is
  if (titleId.endsWith('000')) {
    return titleId;
  }

  // For updates (ending in 800), use the base title ID
  if (titleId.endsWith('800')) {
    return titleId.slice(0, -3) + '000';
  }

  // For DLCs, change the fourth-to-last digit and set last 3 digits to 000
  const fourthFromEnd = titleId.charAt(titleId.length - 4);
  const prevChar = (char: string): string => {
    if (char >= '1' && char <= '9') return String(parseInt(char) - 1);
    if (char >= 'b' && char <= 'z') return String.fromCharCode(char.charCodeAt(0) - 1);
    if (char >= 'B' && char <= 'Z') return String.fromCharCode(char.charCodeAt(0) - 1);
    return char;
  };
  return titleId.slice(0, -4) + prevChar(fourthFromEnd) + '000';
}

export function getBasePrefix(titleId: string): string {
  return titleId.slice(0, 12);
}

export function getRelatedContent(items: ContentItem[], baseId: string): {
  base: ContentItem | null;
  updates: ContentItem[];
  dlcs: ContentItem[];
} {
  // Get base prefix for finding related content
  const basePrefix = getBasePrefix(baseId);
  
  // Find all related items
  const relatedItems = items.filter(item => getBasePrefix(item.id) === basePrefix);

  // Get base game (should be the one matching baseId)
  const base = relatedItems.find(item => item.id === baseId) || null;

  // Get updates (ending with 800)
  const updates = relatedItems.filter(item => item.id.endsWith('800'))
    .sort((a, b) => (b.version || '0').localeCompare(a.version || '0'));

  // Get DLCs (not base and not updates)
  const dlcs = relatedItems.filter(item => 
    !item.id.endsWith('000') && !item.id.endsWith('800')
  ).sort((a, b) => a.id.localeCompare(b.id));

  return { base, updates, dlcs };
}

export function getVisualAssets(titleId: string) {
  const baseId = getBaseTitleId(titleId);
  const baseUrl = 'https://api.nlib.cc/nx';
  
  return {
    icon: `${baseUrl}/${baseId}/icon/128/128`,
    banner: `${baseUrl}/${baseId}/banner/1280/720`,
    screenshots: Array.from({ length: 6 }, (_, i) => 
      `${baseUrl}/${baseId}/screen/${i + 1}`
    )
  };
}