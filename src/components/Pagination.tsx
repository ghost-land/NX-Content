import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationProps } from '../types';
import { useUserPreferences } from '../store/userPreferences';

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const { itemsPerPage, setItemsPerPage } = useUserPreferences();
  const showPages = 5;
  const halfShowPages = Math.floor(showPages / 2);
  let startPage = Math.max(currentPage - halfShowPages, 1);
  let endPage = Math.min(startPage + showPages - 1, totalPages);

  if (endPage - startPage + 1 < showPages) {
    startPage = Math.max(endPage - showPages + 1, 1);
  }

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-card border-t border-border">
      <div className="flex items-center text-sm">
        <select
          className="bg-muted border border-border rounded-lg px-3 py-1.5 mr-2 text-foreground hover:border-primary/50 transition-colors"
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
        >
          <option value={10}>10 per page</option>
          <option value={25}>25 per page</option>
          <option value={50}>50 per page</option>
          <option value={100}>100 per page</option>
        </select>
        <span className="text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            >
              1
            </button>
            {startPage > 2 && (
              <span className="text-muted-foreground">...</span>
            )}
          </>
        )}

        {pages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              currentPage === page
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
            }`}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="text-muted-foreground">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}