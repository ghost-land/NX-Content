import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  resultCount?: number;
  totalCount?: number;
}

export function SearchBar({ value, onChange, resultCount, totalCount }: SearchBarProps) {
  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-muted-foreground group-hover:text-primary/80 transition-colors" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-10 pr-24 py-3 bg-card border border-border rounded-lg 
                 text-foreground placeholder-muted-foreground 
                 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent 
                 hover:border-primary/50 transition-all duration-200"
        placeholder="Search by Title ID or Name..."
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-2">
        {resultCount !== undefined && totalCount !== undefined && (
          <span className="text-sm text-muted-foreground px-2 py-1 bg-muted rounded-md">
            {resultCount.toLocaleString()} / {totalCount.toLocaleString()}
          </span>
        )}
        {value && (
          <button
            onClick={() => onChange('')}
            className="p-1.5 rounded-full hover:bg-muted transition-colors group"
          >
            <X className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>
        )}
      </div>
    </div>
  );
}