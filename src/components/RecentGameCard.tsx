import type { RecentGame } from '@/lib/types';

interface RecentGameCardProps {
  game: RecentGame;
  onClick: () => void;
}

export function RecentGameCard({ game, onClick }: RecentGameCardProps) {
  return (
    <div
      className="card-glass overflow-hidden hover:ring-2 hover:ring-orange-500/30 transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-[16/9] relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
        <img
          src={`https://api.nlib.cc/nx/${game.tid}/banner/720p`}
          alt={game.title}
          className="absolute inset-0 w-full h-full object-cover bg-black/20"
          onError={(e) => {
            (e.target as HTMLImageElement).src = game.iconUrl;
            (e.target as HTMLImageElement).className = "absolute inset-0 w-full h-full object-contain p-8 bg-black/20";
          }}
        />
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