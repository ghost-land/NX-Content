import { useState } from 'react';
import { Info, ArrowUp, ArrowDown } from 'lucide-react';
import { ContentItem, PaginationProps, SortField, SortDirection } from '../types';
import { getIconUrl } from '../utils/formatters';
import { getBaseTitleId, getRelatedContent } from '../utils/contentGrouping';
import { GameDetails } from './GameDetails';
import { Pagination } from './Pagination';
import { formatFileSize, formatDate } from '../utils/formatters';

interface ContentTableProps extends PaginationProps {
  items: ContentItem[];
  allItems: ContentItem[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

export function ContentTable({ 
  items, 
  allItems,
  currentPage, 
  totalPages, 
  onPageChange,
  sortField,
  sortDirection,
  onSort
}: ContentTableProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleDetails = (titleId: string) => {
    const baseId = getBaseTitleId(titleId);
    setSelectedId(baseId);
  };

  const getContentBadges = (titleId: string) => {
    const baseId = getBaseTitleId(titleId);
    const { updates, dlcs } = getRelatedContent(allItems, baseId);
    
    return (
      <div className="flex gap-2">
        {updates.length > 0 && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-500">
            {updates.length} Update{updates.length !== 1 ? 's' : ''}
          </span>
        )}
        {dlcs.length > 0 && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-500/10 text-purple-500">
            {dlcs.length} DLC{dlcs.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    );
  };

  const renderSortHeader = (field: SortField, label: string) => (
    <th className="px-6 py-3 text-left">
      <button
        onClick={() => onSort(field)}
        className="flex items-center space-x-2 group w-full"
      >
        <span className={`
          text-xs font-medium uppercase tracking-wider
          ${sortField === field ? 'text-primary' : 'text-muted-foreground'}
          group-hover:text-primary transition-colors
        `}>
          {label}
        </span>
        <span className={`
          transition-all duration-200
          ${sortField === field ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}
        `}>
          {sortField === field ? (
            sortDirection === 'asc' ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )
          ) : (
            <ArrowUp className="h-4 w-4" />
          )}
        </span>
      </button>
    </th>
  );

  return (
    <div className="bg-card rounded-lg shadow-lg overflow-hidden border border-border">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-24">
                Icon
              </th>
              {renderSortHeader('id', 'Title ID')}
              {renderSortHeader('name', 'Name')}
              {renderSortHeader('size', 'Size')}
              {renderSortHeader('releaseDate', 'Release Date')}
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Related Content
              </th>
              <th className="px-6 py-3 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((item) => (
              <tr 
                key={`${item.id}_${item.version}`} 
                onClick={() => handleDetails(item.id)}
                className="group hover:bg-muted/50 active:bg-muted transition-colors cursor-pointer"
              >
                <td className="px-6 py-4">
                  <div className="icon-container transform group-hover:scale-105 transition-transform duration-200">
                    <img
                      src={getIconUrl(item.id)}
                      alt="Game Icon"
                      className="rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="%23666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3E%3Crect x="3" y="3" width="18" height="18" rx="2" ry="2"%3E%3C/rect%3E%3Ccircle cx="8.5" cy="8.5" r="1.5"%3E%3C/circle%3E%3Cpolyline points="21 15 16 10 5 21"%3E%3C/polyline%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-mono text-sm group-hover:text-primary transition-colors">
                    {item.id}
                  </div>
                  {item.version && (
                    <div className="text-xs text-muted-foreground mt-1">
                      v{item.version}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm group-hover:text-primary transition-colors">
                    {item.name || 'Unknown Title'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-muted-foreground">
                    {formatFileSize(item.size)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-muted-foreground">
                    {formatDate(item.releaseDate)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getContentBadges(item.id)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Info className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {items.length > 0 ? (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          No items found
        </div>
      )}

      {selectedId && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-border">
            <GameDetails
              content={getRelatedContent(allItems, selectedId)}
              onClose={() => setSelectedId(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}