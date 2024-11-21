import { getBaseTitleId } from './contentGrouping';

export function getIconUrl(titleId: string): string {
  return `https://api.nlib.cc/nx/${getBaseTitleId(titleId)}/icon/128/128`;
}

export function formatFileSize(bytes?: number): string {
  if (!bytes) return 'Unknown';
  
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

export function formatDate(dateStr?: string): string {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
    return 'Unknown';
  }
  
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return 'Unknown';
    }
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  } catch {
    return 'Unknown';
  }
}