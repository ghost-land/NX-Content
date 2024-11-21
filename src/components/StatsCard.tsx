interface StatsCardProps {
  title: string;
  count: number;
}

export function StatsCard({ title, count }: StatsCardProps) {
  return (
    <div className="w-full rounded-lg p-4 border bg-card border-border text-foreground select-none">
      <h3 className="text-sm font-medium text-muted-foreground">
        {title}
      </h3>
      <p className="mt-2 text-3xl font-bold">{count.toLocaleString()}</p>
    </div>
  );
}