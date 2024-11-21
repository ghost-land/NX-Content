import { TabNavigationProps } from '../types';
import { Database, Download, Package } from 'lucide-react';

export function TabNavigation({ activeTab, onTabChange, counts }: TabNavigationProps) {
  const tabs = [
    { id: 'base' as const, name: 'Base Games', icon: Database, count: counts.base },
    { id: 'update' as const, name: 'Updates', icon: Download, count: counts.update },
    { id: 'dlc' as const, name: 'DLC', icon: Package, count: counts.dlc },
  ];

  return (
    <div className="bg-card rounded-lg p-1 border border-border">
      <nav className="flex space-x-1">
        {tabs.map(({ id, name, icon: Icon, count }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`
              flex-1 flex items-center justify-center py-3 px-4 rounded-md text-sm font-medium transition-all
              ${activeTab === id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }
            `}
          >
            <Icon className="h-5 w-5 mr-2" />
            <span>{name}</span>
            <span className="ml-2 text-xs opacity-75">({count.toLocaleString()})</span>
          </button>
        ))}
      </nav>
    </div>
  );
}