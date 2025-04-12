import type { ProcessedGame } from '@/lib/types';
import { getBaseTidForUpdate } from '@/lib/utils';

interface GameCardProps {
  game: ProcessedGame;
  viewMode: 'banner' | 'grid';
  onClick: () => void;
  games: ProcessedGame[];
}

export function GameCard({ game, viewMode, onClick, games }: GameCardProps) {
  if (viewMode === 'banner') {
    return (
      <div
        className="group rounded-lg overflow-hidden bg-white/[0.03] hover:bg-white/[0.06] transition-all cursor-pointer border border-white/5 hover:border-orange-500/20"
        onClick={onClick}
      >
        <div className="aspect-[16/9] relative bg-black/20">
          <img
            src={`https://api.nlib.cc/nx/${getBaseTidForUpdate(game.tid)}/banner/720p`}
            alt={game.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://api.nlib.cc/nx/${getBaseTidForUpdate(game.tid)}/icon/256/256`;
              (e.target as HTMLImageElement).className = "w-full h-full object-contain p-8";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          {/* Update/DLC Indicators */}
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

  return (
    <div
      className="group rounded-lg overflow-hidden bg-white/[0.03] hover:bg-white/[0.06] transition-all cursor-pointer border border-white/5 hover:border-orange-500/20 flex gap-4 p-4"
      onClick={onClick}
    >
      <div className="w-24 h-24 flex-shrink-0 bg-black/20 rounded-lg overflow-hidden">
        <img
          src={`https://api.nlib.cc/nx/${getBaseTidForUpdate(game.tid)}/icon/256/256`}
          alt={game.name}
          className="w-full h-full object-contain p-2"
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