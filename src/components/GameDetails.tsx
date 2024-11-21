import { useState } from 'react';
import { X, Package, Download, ExternalLink } from 'lucide-react';
import { ContentItem } from '../types';
import { getVisualAssets } from '../utils/contentGrouping';
import { ScreenshotGallery } from './ScreenshotGallery';
import { formatFileSize, formatDate } from '../utils/formatters';
import { useUserPreferences } from '../store/userPreferences';

interface ContentListProps {
  items: ContentItem[];
  maxVisible?: number;
  type: 'update' | 'dlc';
}

function ContentList({ items, maxVisible = 5, type }: ContentListProps) {
  const [showAll, setShowAll] = useState(false);
  const visibleItems = showAll ? items : items.slice(0, maxVisible);
  const hasMore = items.length > maxVisible;

  return (
    <div className="space-y-3">
      {visibleItems.map(item => (
        <div key={item.uniqueId} className="text-sm">
          <p className="font-mono text-xs text-muted-foreground">
            {item.id}
          </p>
          {item.name && <p className="text-sm">{item.name}</p>}
          {item.version && type === 'update' && (
            <p className="text-xs text-muted-foreground mt-1">
              Version {item.version}
            </p>
          )}
          {item.size && (
            <p className="text-xs text-muted-foreground">
              Size: {formatFileSize(item.size)}
            </p>
          )}
        </div>
      ))}
      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs text-primary hover:text-primary/80 transition-colors"
        >
          {showAll ? 'Show Less' : `Show ${items.length - maxVisible} More`}
        </button>
      )}
    </div>
  );
}

interface GameDetailsProps {
  content: {
    base: ContentItem | null;
    updates: ContentItem[];
    dlcs: ContentItem[];
  };
  onClose: () => void;
}

export function GameDetails({ content, onClose }: GameDetailsProps) {
  const { base, updates, dlcs } = content;
  const { maxDlcDisplay, maxUpdateDisplay } = useUserPreferences();

  if (!base) return null;

  const assets = getVisualAssets(base.id);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Content Details</h2>
        <div className="flex items-center space-x-3">
          <a
            href={`https://stats.ghostland.at/${base.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            <span>View Stats</span>
          </a>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
            aria-label="Close details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Banner */}
      <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
        <img
          src={assets.banner}
          alt="Game Banner"
          className="w-full h-full object-cover"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.style.display = 'none';
          }}
        />
      </div>

      {/* Content Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border p-4 rounded-lg">
          <div className="flex items-center space-x-3 mb-3">
            <img
              src={assets.icon}
              alt="Game Icon"
              className="w-12 h-12 rounded"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.style.display = 'none';
              }}
            />
            <div>
              <h3 className="text-sm font-medium">Base Game</h3>
              <p className="text-xs text-muted-foreground font-mono">{base.id}</p>
            </div>
          </div>
          {base.name && <p className="text-sm mb-2">{base.name}</p>}
          {base.size && (
            <p className="text-sm text-muted-foreground">
              Size: {formatFileSize(base.size)}
            </p>
          )}
          {base.releaseDate && (
            <p className="text-sm text-muted-foreground">
              Released: {formatDate(base.releaseDate)}
            </p>
          )}
        </div>

        {updates.length > 0 && (
          <div className="bg-card border border-border p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Download className="h-5 w-5 text-blue-500" />
              <h3 className="text-sm font-medium">Updates ({updates.length})</h3>
            </div>
            <ContentList 
              items={updates} 
              maxVisible={maxUpdateDisplay} 
              type="update"
            />
          </div>
        )}

        {dlcs.length > 0 && (
          <div className="bg-card border border-border p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Package className="h-5 w-5 text-purple-500" />
              <h3 className="text-sm font-medium">DLCs ({dlcs.length})</h3>
            </div>
            <ContentList 
              items={dlcs} 
              maxVisible={maxDlcDisplay} 
              type="dlc"
            />
          </div>
        )}
      </div>

      {/* Screenshots */}
      <ScreenshotGallery screenshots={assets.screenshots} />
    </div>
  );
}