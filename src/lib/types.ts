export interface GameData {
  "Game Name": string;
  Version: string;
  "Update Version"?: number;
  Size: number;
}

export interface GamesData {
  [tid: string]: GameData;
}

export type ContentType = 'base' | 'update' | 'dlc';

export interface ProcessedGame {
  tid: string;
  name: string;
  version: string;
  updateVersion?: number;
  size: number;
  type: ContentType;
  sizeFormatted: string;
}

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