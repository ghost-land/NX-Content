import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: typeof LucideIcon;
  title: string;
  value: number | string;
}

/**
 * StatsCard component displays a single statistic with icon, title, and value
 * Used to show database metrics like game counts and total sizes
 * 
 * @param icon - Lucide icon component to display
 * @param title - Title/label for the statistic
 * @param value - Numeric or string value to display
 */
export function StatsCard({ icon: Icon, title, value }: StatsCardProps) {
  return (
    <div className="card-glass p-6">
      <div className="flex items-center gap-3 mb-4">
        <Icon className="w-5 h-5 text-orange-400" />
        <h3 className="heading-2 text-white">{title}</h3>
      </div>
      <p className="text-3xl font-semibold text-white/90">
        {value}
      </p>
    </div>
  );
}