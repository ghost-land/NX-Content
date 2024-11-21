import { ContentItem, SortField, SortDirection } from '../types';

function isValidDate(dateStr?: string): boolean {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

function getDateValue(item: ContentItem): number {
  if (!item.releaseDate || !isValidDate(item.releaseDate)) return 0;
  return new Date(item.releaseDate).getTime();
}

function compareItems(a: ContentItem, b: ContentItem, field: SortField): number {
  switch (field) {
    case 'releaseDate': {
      // Only sort base games by release date
      if (a.type !== 'base' || b.type !== 'base') {
        return a.id.localeCompare(b.id);
      }

      const dateA = getDateValue(a);
      const dateB = getDateValue(b);

      // Both unknown dates - sort by ID
      if (dateA === 0 && dateB === 0) {
        return a.id.localeCompare(b.id);
      }

      // Unknown dates go to the end
      if (dateA === 0) return 1;
      if (dateB === 0) return -1;

      // Sort by date, then by name if dates are equal
      return dateA === dateB 
        ? (a.name || '').localeCompare(b.name || '')
        : dateB - dateA;
    }

    case 'name': {
      const nameA = a.name || 'Unknown Title';
      const nameB = b.name || 'Unknown Title';

      // Always put Unknown Title at the end
      if (nameA === 'Unknown Title' && nameB !== 'Unknown Title') return 1;
      if (nameB === 'Unknown Title' && nameA !== 'Unknown Title') return -1;

      return nameA.localeCompare(nameB);
    }

    case 'size': {
      const sizeA = a.size || 0;
      const sizeB = b.size || 0;

      // Items without size go to the end
      if (sizeA === 0 && sizeB !== 0) return 1;
      if (sizeB === 0 && sizeA !== 0) return -1;

      return sizeB - sizeA;
    }

    case 'id':
    default:
      return a.id.localeCompare(b.id);
  }
}

export function sortItems(items: ContentItem[], field: SortField, direction: SortDirection): ContentItem[] {
  const sorted = [...items].sort((a, b) => {
    const comparison = compareItems(a, b, field);
    return direction === 'asc' ? comparison : -comparison;
  });

  // For release date sorting, ensure unknown dates are always at the end
  if (field === 'releaseDate') {
    const withDates = sorted.filter(item => isValidDate(item.releaseDate));
    const withoutDates = sorted.filter(item => !isValidDate(item.releaseDate));
    return direction === 'asc' 
      ? [...withDates, ...withoutDates]
      : [...withDates, ...withoutDates];
  }

  return sorted;
}

export function sortByReleaseDate(items: ContentItem[]): ContentItem[] {
  // Separate items into base games with dates, base games without dates, and others
  const baseWithDates = items.filter(item => 
    item.type === 'base' && isValidDate(item.releaseDate)
  );
  const baseWithoutDates = items.filter(item => 
    item.type === 'base' && !isValidDate(item.releaseDate)
  );
  const nonBaseItems = items.filter(item => item.type !== 'base');

  // Sort base games with dates by date
  const sortedBaseWithDates = baseWithDates.sort((a, b) => {
    const dateA = getDateValue(a);
    const dateB = getDateValue(b);
    return dateA === dateB
      ? (a.name || '').localeCompare(b.name || '')
      : dateB - dateA;
  });

  // Sort other items by ID
  const sortedBaseWithoutDates = baseWithoutDates.sort((a, b) => 
    a.id.localeCompare(b.id)
  );
  const sortedNonBaseItems = nonBaseItems.sort((a, b) => 
    a.id.localeCompare(b.id)
  );

  // Combine all sorted arrays
  return [
    ...sortedBaseWithDates,
    ...sortedBaseWithoutDates,
    ...sortedNonBaseItems
  ];
}