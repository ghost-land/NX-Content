export interface ContentItem {
  id: string;
  uniqueId: string;
  type: 'base' | 'update' | 'dlc';
  version?: string;
  name?: string;
  size?: number;
  releaseDate?: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export type SortField = 'id' | 'name' | 'releaseDate' | 'size';
export type SortDirection = 'asc' | 'desc';

export interface SearchOptions {
  threshold: number;
  distance: number;
  minMatchCharLength: number;
}

export interface SortOptions {
  field: SortField;
  direction: SortDirection;
}

export interface GameInfo {
  id: string;
  name: string;
  publisher: string;
  description: string;
  size: number | null;
  version: string;
  releaseDate: string | null;
  rating: string | null;
  categories: string[];
  languages: string[];
  screenshots: string[];
}

export interface TabNavigationProps {
  activeTab: 'base' | 'update' | 'dlc';
  onTabChange: (tab: 'base' | 'update' | 'dlc') => void;
  counts: {
    base: number;
    update: number;
    dlc: number;
  };
}