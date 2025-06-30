import type { ProcessedGame } from '@/lib/types';
import { getBaseTidForUpdate, getIconFallbackUrls, getBannerFallbackUrls } from '@/lib/utils';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';

interface GameCardProps {
  game: ProcessedGame;
  viewMode: 'banner' | 'grid';
  onClick: () => void;
  games: ProcessedGame[];
}

/**
 * GameCard component displays game information in either banner or grid view
 * Shows game images, metadata, and availability indicators
 * Supports lazy loading and fallback images for better performance
 * 
 * @param game - Game data to display
 * @param viewMode - Display mode: 'banner' for large cards, 'grid' for compact view
 * @param onClick - Callback function when card is clicked
 * @param games - Array of all games for availability checking
 */
export function GameCard({ game, viewMode, onClick, games }: GameCardProps) {
  const baseTid = getBaseTidForUpdate(game.tid);
  
  // Banner view: Large card with banner image and overlay information
  if (viewMode === 'banner') {
    return (
      <div
        className="group rounded-lg overflow-hidden bg-white/[0.03] hover:bg-white/[0.06] transition-all cursor-pointer border border-white/5 hover:border-orange-500/20"
        onClick={onClick}
      >
        <div className="aspect-[16/9] relative bg-black/20">
          <ImageWithFallback
            src={`https://api.nlib.cc/nx/${baseTid}/banner/720p`}
            fallbackSrc={`https://api.nlib.cc/nx/${baseTid}/icon/256/256`}
            fallbackSrcs={getBannerFallbackUrls(baseTid)}
            alt={game.name}
            className="w-full h-full object-cover"
            fallbackClassName="w-full h-full object-contain p-8"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          {/* Content type indicators (Update/DLC/Available) */}
          <div className="absolute top-2 right-2 flex flex-wrap justify-end gap-2 max-w-[calc(100%-1rem)]">
            {game.type !== 'base' && (
              <span className="bg-orange-500/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                {game.type === 'update' ? 'Update' : 'DLC'}
              </span>
            )}
            {game.type === 'base' && (
              <>
                {games.some(g => g.tid.startsWith(game.tid.slice(0, 12)) && g.type === 'update') && (
                  <span className="bg-orange-500/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
                    Update Available
                  </span>
                )}
                {games.some(g => g.tid.startsWith(game.tid.slice(0, 12)) && g.type === 'dlc') && (
                  <span className="bg-orange-500/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
                    DLC Available
                  </span>
                )}
              </>
            )}
          </div>
          
          {/* Game information overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4">
            <h3 className="font-medium text-lg text-white mb-2">{game.name}</h3>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs px-2 py-0.5 sm:py-1 rounded-full bg-orange-500/30 text-orange-200">
                {game.type.toUpperCase()}
              </span>
              {game.type === 'base' && game.version !== "0" && (
                <span className="text-xs px-2 py-0.5 sm:py-1 rounded-full bg-orange-500/30 text-orange-200">
                  v{game.version}
                </span>
              )}
              {game.type === 'update' && game.updateVersion && (
                <span className="text-xs px-2 py-0.5 sm:py-1 rounded-full bg-orange-500/30 text-orange-200">
                  v{game.updateVersion}
                </span>
              )}
              {game.type === 'base' && <span className="text-xs px-2 py-0.5 sm:py-1 rounded-full bg-orange-500/30 text-orange-200">
                {game.sizeFormatted}
              </span>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view: Compact card with icon and side information
  return (
    <div
      className="group rounded-lg overflow-hidden bg-white/[0.03] hover:bg-white/[0.06] transition-all cursor-pointer border border-white/5 hover:border-orange-500/20 flex gap-4 p-4"
      onClick={onClick}
    >
      <div className="w-24 h-24 flex-shrink-0 bg-black/20 rounded-lg overflow-hidden">
        <ImageWithFallback
          src={`https://api.nlib.cc/nx/${baseTid}/icon/256/256`}
          fallbackSrcs={getIconFallbackUrls(baseTid)}
          alt={game.name}
          className="w-full h-full object-contain p-2"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col flex-grow">
        <h3 className="font-medium text-lg text-white mb-2">{game.name}</h3>
        <div className="flex flex-wrap items-center gap-2 mt-auto">
          <span className="text-xs px-2 py-0.5 sm:py-1 rounded-full bg-orange-500/30 text-orange-200">
            {game.type.toUpperCase()}
          </span>
          {game.type === 'base' && game.version !== "0" && (
            <span className="text-xs px-2 py-0.5 sm:py-1 rounded-full bg-orange-500/30 text-orange-200">
              v{game.version}
            </span>
          )}
          {game.type === 'update' && game.updateVersion && (
            <span className="text-xs px-2 py-0.5 sm:py-1 rounded-full bg-orange-500/30 text-orange-200">
              v{game.updateVersion}
            </span>
          )}
          {game.type === 'base' && <span className="text-xs px-2 py-0.5 sm:py-1 rounded-full bg-orange-500/30 text-orange-200">
            {game.sizeFormatted}
          </span>}
        </div>
      </div>
    </div>
  );
}