import { type MouseEventHandler } from 'react';

interface StatsCardProps {
  title: string;
  count: number;
  isActive?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function StatsCard({ title, count, isActive = false, onClick }: StatsCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full rounded-lg p-4 border transition-colors text-left
        ${isActive
          ? 'bg-primary border-primary/50 text-primary-foreground'
          : 'bg-card border-border text-foreground hover:bg-muted/50'
        }
      `}
    >
      <h3 className={`text-sm font-medium ${isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
        {title}
      </h3>
      <p className="mt-2 text-3xl font-bold">{count.toLocaleString()}</p>
    </button>
  );
}