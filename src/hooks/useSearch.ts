import { useMemo, useState, useCallback } from 'react';
import Fuse from 'fuse.js';
import { ContentItem, SearchOptions, SortField, SortDirection } from '../types';
import { useUserPreferences } from '../store/userPreferences';

const getSearchOptions = (precision: number): SearchOptions => ({
  threshold: precision,
  distance: Math.floor(100 * (1 + precision)),
  minMatchCharLength: Math.max(2, Math.floor(4 * (1 - precision))),
});

function parseDate(dateStr: string | undefined): number {
  if (!dateStr) return 0;
  try {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? 0 : date.getTime();
  } catch {
    return 0;
  }
}

function sortItems(items: ContentItem[], field: SortField, direction: SortDirection): ContentItem[] {
  return [...items].sort((a, b) => {
    let comparison = 0;
    
    switch (field) {
      case 'id':
        comparison = (a.id || '').localeCompare(b.id || '');
        break;
        
      case 'name': {
        const nameA = a.name || 'Unknown Title';
        const nameB = b.name || 'Unknown Title';
        
        // Always put Unknown at the end regardless of sort direction
        if (nameA === 'Unknown Title' && nameB !== 'Unknown Title') return 1;
        if (nameB === 'Unknown Title' && nameA !== 'Unknown Title') return -1;
        
        comparison = nameA.localeCompare(nameB);
        break;
      }
        
      case 'releaseDate': {
        const dateA = parseDate(a.releaseDate);
        const dateB = parseDate(b.releaseDate);
        
        // Always put items without dates at the end
        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return 1;
        
        // Sort by date
        if (dateA !== dateB) {
          comparison = dateA - dateB;
        } else {
          // If dates are equal, sort by name as secondary criteria
          const nameA = a.name || 'Unknown Title';
          const nameB = b.name || 'Unknown Title';
          comparison = nameA.localeCompare(nameB);
        }
        break;
      }
        
      case 'size': {
        const sizeA = a.size || 0;
        const sizeB = b.size || 0;
        
        // Always put items without size at the end
        if (sizeA === 0 && sizeB !== 0) return 1;
        if (sizeB === 0 && sizeA !== 0) return -1;
        
        comparison = sizeA - sizeB;
        break;
      }
    }

    return direction === 'asc' ? comparison : -comparison;
  });
}

export function useSearch(items: ContentItem[]) {
  const [query, setQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('releaseDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const { searchPrecision } = useUserPreferences();
  
  const searchOptions = useMemo(() => getSearchOptions(searchPrecision), [searchPrecision]);
  
  const fuse = useMemo(() => new Fuse(items, {
    keys: [
      { name: 'id', weight: 2 },
      { name: 'name', weight: 1 }
    ],
    ...searchOptions,
    shouldSort: false,
    includeScore: true,
    ignoreLocation: true,
    useExtendedSearch: true,
    getFn: (obj, path) => {
      const value = obj[path as keyof ContentItem];
      return value?.toString() || '';
    }
  }), [items, searchOptions]);
  
  const search = useCallback((searchQuery: string) => {
    if (!searchQuery) return items;
    return fuse.search(searchQuery).map(result => result.item);
  }, [fuse, items]);

  const toggleSort = useCallback((field: SortField) => {
    if (field === sortField) {
      setSortDirection(current => current === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  }, [sortField]);

  const results = useMemo(() => {
    const searchResults = search(query);
    return sortItems(searchResults, sortField, sortDirection);
  }, [search, query, sortField, sortDirection]);

  return {
    query,
    setQuery,
    results,
    sortField,
    sortDirection,
    toggleSort,
  };
}