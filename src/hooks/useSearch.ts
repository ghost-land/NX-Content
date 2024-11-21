import { useMemo, useState, useCallback } from 'react';
import Fuse from 'fuse.js';
import { ContentItem, SortField, SortDirection } from '../types';
import { useUserPreferences } from '../store/userPreferences';
import { sortItems } from '../utils/sorting';

function getSearchOptions(precision: number) {
  return {
    threshold: Math.max(0.1, 1 - precision), // Invert precision for better control
    distance: Math.floor(30 * (1 - precision)),
    minMatchCharLength: Math.max(2, Math.floor(4 * precision)),
    location: 0,
    ignoreLocation: false,
    findAllMatches: true,
    includeMatches: true,
    useExtendedSearch: false,
    isCaseSensitive: false,
    tokenize: true,
    matchAllTokens: false,
  };
}

export function useSearch(items: ContentItem[]) {
  const [nameQuery, setNameQuery] = useState('');
  const [tidQuery, setTidQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const { namePrecision } = useUserPreferences();

  const fuse = useMemo(() => new Fuse(items, {
    keys: ['name'],
    ...getSearchOptions(namePrecision)
  }), [items, namePrecision]);

  const search = useCallback(() => {
    let results = items;

    // Apply TID filter (exact match, case-insensitive)
    if (tidQuery) {
      const normalizedTid = tidQuery.toLowerCase();
      results = results.filter(item => 
        item.id.toLowerCase().includes(normalizedTid)
      );
    }

    // Apply name filter
    if (nameQuery.trim()) {
      const fuseResults = fuse.search(nameQuery);
      const matchedItems = fuseResults.map(result => result.item);
      
      // If we already filtered by TID, intersect the results
      if (tidQuery) {
        const matchedIds = new Set(matchedItems.map(item => item.id));
        results = results.filter(item => matchedIds.has(item.id));
      } else {
        results = matchedItems;
      }
    }

    return results;
  }, [fuse, items, nameQuery, tidQuery]);

  const toggleSort = useCallback((field: SortField) => {
    setSortField(field);
    setSortDirection(current => 
      field === sortField ? (current === 'asc' ? 'desc' : 'asc') : 'asc'
    );
  }, [sortField]);

  const results = useMemo(() => {
    const searchResults = search();
    return sortItems(searchResults, sortField, sortDirection);
  }, [search, sortField, sortDirection]);

  return {
    nameQuery,
    setNameQuery,
    tidQuery,
    setTidQuery,
    results,
    sortField,
    sortDirection,
    toggleSort,
  };
}