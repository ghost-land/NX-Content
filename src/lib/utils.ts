import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBaseTidForUpdate(tid: string): string {
  // For updates (ending in 800)
  if (tid.endsWith('800')) {
    return tid.slice(0, -3) + '000';
  }
  
  // For DLCs (13th character is incremented)
  if (tid.length === 16 && !tid.endsWith('000')) {
    const char13 = tid.charAt(12);
    const prevChar = String.fromCharCode(char13.charCodeAt(0) - 1);
    return tid.slice(0, 12) + prevChar + '000';
  }
  
  // Return as is for base games
  return tid;
}