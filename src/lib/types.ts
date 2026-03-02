// src/lib/types.ts

// TypeScript types for extended game metadata

export interface GameMetadata {
    id: number;
    title: string;
    releaseDate: string;
    platforms: string[];
    genres: string[];
    description: string;
    igdb: IGDBData;
    howLongToBeat: HowLongToBeatData;
}

export interface IGDBData {
    rating: number;
    ratingCount: number;
    screenshots: string[];
}

export interface HowLongToBeatData {
    main: number; // Main story hours
    extras: number; // Extras hours
    completionist: number; // Completionist hours
}