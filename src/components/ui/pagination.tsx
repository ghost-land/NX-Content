import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // Show fewer buttons on mobile
  const isMobile = window.innerWidth < 640;
  const maxButtons = isMobile ? 3 : 5;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxButtons - 1);
  
  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }
  
  const visiblePages = pages.slice(startPage - 1, endPage);

  const buttonClass = "flex items-center justify-center min-w-[2.25rem] h-9 sm:min-w-[2.5rem] sm:h-10 px-2 sm:px-3 rounded-lg transition-all duration-200 text-sm font-medium";
  const activeClass = "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25";
  const inactiveClass = "text-white/70 hover:text-white hover:bg-white/[0.08]";
  const disabledClass = "opacity-50 cursor-not-allowed pointer-events-none";

  return (
    <nav className="flex justify-center items-center gap-1 sm:gap-2">
      <div className="flex sm:hidden">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={`${buttonClass} ${currentPage === 1 ? disabledClass : inactiveClass} rounded-r-none border-r border-white/10`}
          aria-label="First page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${buttonClass} ${currentPage === 1 ? disabledClass : inactiveClass} rounded-l-none`}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      <div className="hidden sm:flex">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={`${buttonClass} ${currentPage === 1 ? disabledClass : inactiveClass}`}
          aria-label="First page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${buttonClass} ${currentPage === 1 ? disabledClass : inactiveClass}`}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center">
        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className={`${buttonClass} ${inactiveClass}`}
            >
              1
            </button>
            {startPage > 2 && (
              <span className="px-1 sm:px-2 text-white/40">...</span>
            )}
          </>
        )}

        {visiblePages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`${buttonClass} ${page === currentPage ? activeClass : inactiveClass}`}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="px-1 sm:px-2 text-white/40">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className={`${buttonClass} ${inactiveClass}`}
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <div className="flex sm:hidden">
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${buttonClass} ${currentPage === totalPages ? disabledClass : inactiveClass} rounded-r-none border-r border-white/10`}
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`${buttonClass} ${currentPage === totalPages ? disabledClass : inactiveClass} rounded-l-none`}
          aria-label="Last page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>

      <div className="hidden sm:flex">
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${buttonClass} ${currentPage === totalPages ? disabledClass : inactiveClass}`}
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`${buttonClass} ${currentPage === totalPages ? disabledClass : inactiveClass}`}
          aria-label="Last page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
}