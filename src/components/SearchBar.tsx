import { Search, X } from 'lucide-react';

interface SearchBarProps {
  nameQuery: string;
  tidQuery: string;
  onNameChange: (value: string) => void;
  onTidChange: (value: string) => void;
  resultCount?: number;
  totalCount?: number;
}

export function SearchBar({ 
  nameQuery, 
  tidQuery, 
  onNameChange, 
  onTidChange, 
  resultCount, 
  totalCount 
}: SearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Name search */}
      <div className="relative group flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground group-hover:text-primary/80 transition-colors" />
        </div>
        <input
          type="text"
          value={nameQuery}
          onChange={(e) => onNameChange(e.target.value)}
          className={`
            block w-full pl-10 pr-10 py-3 bg-card border border-border rounded-lg 
            text-foreground placeholder-muted-foreground 
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent 
            hover:border-primary/50 transition-all duration-200
            ${nameQuery ? 'ring-2 ring-primary' : ''}
          `}
          placeholder="Search by name..."
        />
        {nameQuery && (
          <button
            onClick={() => onNameChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
          </button>
        )}
      </div>

      {/* Title ID search */}
      <div className="relative group flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground group-hover:text-primary/80 transition-colors" />
        </div>
        <input
          type="text"
          value={tidQuery}
          onChange={(e) => {
            const newValue = e.target.value.toUpperCase();
            if (newValue === '' || /^[0-9A-F]*$/.test(newValue)) {
              onTidChange(newValue);
            }
          }}
          maxLength={16}
          className={`
            block w-full pl-10 pr-10 py-3 bg-card border border-border rounded-lg 
            text-foreground placeholder-muted-foreground font-mono uppercase
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent 
            hover:border-primary/50 transition-all duration-200
            ${tidQuery ? 'ring-2 ring-primary' : ''}
          `}
          placeholder="Search by Title ID..."
        />
        {tidQuery && (
          <button
            onClick={() => onTidChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
          </button>
        )}
      </div>

      {/* Results counter */}
      {resultCount !== undefined && totalCount !== undefined && (
        <div className="hidden sm:flex items-center justify-center px-4 py-2 bg-muted rounded-lg min-w-[120px]">
          <span className="text-sm text-muted-foreground">
            {resultCount.toLocaleString()} / {totalCount.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
}