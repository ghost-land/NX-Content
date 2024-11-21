export function parseDate(dateStr: string | undefined): number {
  if (!dateStr) return 0;
  
  try {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? 0 : date.getTime();
  } catch {
    return 0;
  }
}

export function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return 'Unknown';
  
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Unknown';
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  } catch {
    return 'Unknown';
  }
}

export function isValidDate(dateStr: string | undefined): boolean {
  if (!dateStr) return false;
  
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return false;
    
    // Ensure date is between 2000 and current year + 2
    const year = date.getFullYear();
    const currentYear = new Date().getFullYear();
    return year >= 2000 && year <= currentYear + 2;
  } catch {
    return false;
  }
}