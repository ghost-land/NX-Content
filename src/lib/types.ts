/**
 * Raw game data structure from JSON database
 */
export interface GameData {
  "Game Name": string;
  Version: string;
  "Update Version"?: number;
  Size: number;
}

/**
 * Complete games database structure
 */
export interface GamesData {
  [tid: string]: GameData;
}

/**
 * Content type classification
 */
export type ContentType = 'base' | 'update' | 'dlc';

/**
 * Processed game information with formatted data
 */
export interface ProcessedGame {
  tid: string;
  name: string;
  version: string;
  updateVersion?: number;
  size: number;
  type: ContentType;
  sizeFormatted: string;
}

/**
 * Recent content information from RSS feeds
 */
export interface RecentGame {
  title: string;
  tid: string;
  size: string;
  version: string;
  type: string;
  format: string;
  date: Date;
  iconUrl: string;
}

/**
 * Detailed game information from external API
 */
export interface GameDetails {
  publisher: string;
  releaseDate: string;
  description: string;
  numberOfPlayers: string;
  languages: string[];
  category: string[];
  screens: {
    screenshots: string[];
  };
}