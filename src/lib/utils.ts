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
 * 
 * @param tid - The Title ID to process
 * @returns The base Title ID (first 12 characters + '000')
 */
export function getBaseTidForUpdate(tid: string): string {
  if (tid.endsWith('000')) {
    return tid;
  }
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