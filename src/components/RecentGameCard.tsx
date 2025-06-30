import type { RecentGame } from '@/lib/types';
import { getBaseTidForUpdate, getBannerFallbackUrls } from '@/lib/utils';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';

interface RecentGameCardProps {
  game: RecentGame;
  onClick: () => void;
}

/**
 * RecentGameCard component displays a card for recently added games
 * Shows game banner, title, metadata, and date added
 * Handles image fallbacks and provides click interaction
 * 
 * @param game - Recent game data to display
 * @param onClick - Callback function when card is clicked
 */
export function RecentGameCard({ game, onClick }: RecentGameCardProps) {
  const baseTid = getBaseTidForUpdate(game.tid);
  
  return (
    <div
      className="card-glass overflow-hidden hover:ring-2 hover:ring-orange-500/30 transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-[16/9] relative">
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
        <ImageWithFallback
          src={`https://api.nlib.cc/nx/${baseTid}/banner/720p`}
          fallbackSrc={game.iconUrl}
          fallbackSrcs={getBannerFallbackUrls(baseTid)}
          alt={game.title}
          className="absolute inset-0 w-full h-full object-cover bg-black/20"
          fallbackClassName="absolute inset-0 w-full h-full object-contain p-8 bg-black/20"
          loading="lazy"
        />
        {/* Game information overlay */}
        <div className="absolute inset-0 flex items-end p-4 z-20">
          <div>
            <h3 className="font-medium text-lg text-white mb-2">{game.title}</h3>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-300">
                {game.size}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-300">
                {game.version}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-300">
                {game.format}
              </span>
            </div>
            <p className="text-sm text-white/60 mt-2">
              Added {game.date.toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}