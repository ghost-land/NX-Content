import { TabNavigationProps } from '../types';
import { Database, Download, Package } from 'lucide-react';

export function TabNavigation({ activeTab, onTabChange, counts }: TabNavigationProps) {
  const tabs = [
    { id: 'base' as const, name: 'Base Games', icon: Database, count: counts?.base ?? 0 },
    { id: 'update' as const, name: 'Updates', icon: Download, count: counts?.update ?? 0 },
    { id: 'dlc' as const, name: 'DLC', icon: Package, count: counts?.dlc ?? 0 },
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
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }
            `}
          >
            <Icon className="h-5 w-5 mr-2" />
            <span>{name}</span>
            <span className={`
              ml-2 px-2 py-0.5 rounded-full text-xs
              ${activeTab === id
                ? 'bg-primary-foreground/20 text-primary-foreground'
                : 'bg-muted-foreground/10 text-muted-foreground'
              }
            `}>
              {count.toLocaleString()}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}