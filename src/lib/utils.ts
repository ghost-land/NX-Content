import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge class names with Tailwind CSS
 * Combines clsx and twMerge for optimal class name handling
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extracts the base Title ID from any game Title ID
 * Base games end with '000', updates with '800', and DLCs have other endings
 * Handles both 15 and 16 character TIDs
 * For DLCs: decrement 13th character and append '30' to get base TID
 * 
 * @param tid - The Title ID to process
 * @returns The base Title ID
 */
export function getBaseTidForUpdate(tid: string): string {
  // Base games already end with '000'
  if (tid.endsWith('000')) {
    return tid;
  }
  
  // Updates end with '800'
  if (tid.endsWith('800')) {
    if (tid.length === 16) {
      return tid.slice(0, 13) + '000';
    }
    if (tid.length === 15) {
      return tid.slice(0, 12) + '000';
    }
  }
  
  // For 16-character TIDs
  if (tid.length === 16) {
    const last3 = tid.slice(-3);
    // If last 3 characters are hex but not '000' or '800', treat as base game
    if (last3.match(/^[0-9A-Fa-f]{3}$/) && last3 !== '000' && last3 !== '800') {
      // For base games with different endings, decrement 13th character and append '000'
      const first13 = tid.slice(0, 13);
      const lastChar = first13.charAt(12);
      const decrementedChar = (parseInt(lastChar, 16) - 1).toString(16).toUpperCase();
      return first13.slice(0, 12) + decrementedChar + '000';
    }
    
    // Otherwise treat as DLC: decrement 13th character and append '30'
    const first13 = tid.slice(0, 13);
    const lastChar = first13.charAt(12);
    const decrementedChar = (parseInt(lastChar, 16) - 1).toString(16).toUpperCase();
    return first13.slice(0, 12) + decrementedChar + '30';
  }
  
  // For 15-character TIDs
  if (tid.length === 15) {
    const last3 = tid.slice(-3);
    // If last 3 characters are hex but not '000' or '800', treat as base game
    if (last3.match(/^[0-9A-Fa-f]{3}$/) && last3 !== '000' && last3 !== '800') {
      // For base games with different endings, decrement 12th character and append '000'
      const first12 = tid.slice(0, 12);
      const lastChar = first12.charAt(11);
      const decrementedChar = (parseInt(lastChar, 16) - 1).toString(16).toUpperCase();
      return first12.slice(0, 11) + decrementedChar + '000';
    }
    
    // Otherwise treat as DLC: decrement 12th character and append '30'
    const first12 = tid.slice(0, 12);
    const lastChar = first12.charAt(11);
    const decrementedChar = (parseInt(lastChar, 16) - 1).toString(16).toUpperCase();
    return first12.slice(0, 11) + decrementedChar + '30';
  }
  
  // Fallback
  return tid.slice(0, 12) + '000';
}

/**
 * Generates fallback URLs for game icons from tinfoil.media
 * 
 * @param baseTid - The base Title ID of the game
 * @returns Array of fallback icon URLs
 */
export function getIconFallbackUrls(baseTid: string): string[] {
  return [
    `https://tinfoil.media/ti/${baseTid}/256/256/`
  ];
}

/**
 * Generates fallback URLs for game banners from tinfoil.media
 * 
 * @param baseTid - The base Title ID of the game
 * @returns Array of fallback banner URLs
 */
export function getBannerFallbackUrls(baseTid: string): string[] {
  return [
    `https://tinfoil.media/thi/${baseTid}/0/0/`
  ];
}