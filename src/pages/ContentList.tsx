import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Home, Image, LayoutGrid } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnimatedDice } from '@/components/ui/animated-dice';
import { Pagination } from '@/components/ui/pagination';
import type { ProcessedGame } from '@/lib/types';
import { GameCard } from '@/components/GameCard';
import { Footer } from '@/components/Footer';

interface ContentListProps {
  games: ProcessedGame[];
  loading: boolean;
  nameInput: string;
  tidInput: string;
  filterType: 'all' | 'base' | 'update' | 'dlc';
  sortBy: 'name' | 'size' | 'date';
  sortOrder: 'asc' | 'desc';
  viewMode: 'banner' | 'grid';
  currentPage: number;
  totalPages: number;
  paginatedGames: ProcessedGame[];
  filteredGames: ProcessedGame[];
  onNameInputChange: (value: string) => void;
  onTidInputChange: (value: string) => void;
  updateSearchParams: (params: Record<string, string>) => void;
  getRandomBaseGame: () => ProcessedGame | null;
}

export function ContentList({
  games,
  loading,
  nameInput,
  tidInput,
  filterType,
  sortBy,
  sortOrder,
  viewMode,
  currentPage,
  totalPages,
  paginatedGames,
  filteredGames,
  onNameInputChange,
  onTidInputChange,
  updateSearchParams,
  getRandomBaseGame,
}: ContentListProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={contentRef} className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="card-glass p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                <span className="text-red-500">NX</span> <span className="text-gradient">Database</span>
              </h1>
              <p className="text-lg text-white/70 mt-2">Browse and search through {games.length.toLocaleString()} available contents</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={() => {
                  const randomGame = getRandomBaseGame();
                  if (randomGame) {
                    updateSearchParams({ game: randomGame.tid });
                  }
                  // Force button re-render to trigger dice animation
                  const btn = document.activeElement as HTMLButtonElement;
                  btn?.blur();
                }}
                className="flex-1 sm:flex-initial btn-orange glass group"
              >
                <div className="relative flex items-center justify-center">
                  <AnimatedDice className="w-5 h-5 mr-2 transition-transform group-hover:rotate-180 group-active:rotate-0" />
                  <span className="font-medium">Random</span>
                </div>
              </button>
              <Link 
                to="/" 
                className="flex-1 sm:flex-initial btn-orange glass"
              >
                <div className="relative flex items-center justify-center">
                  <Home className="w-5 h-5 mr-2" />
                  <span className="font-medium">Home</span>
                </div>
              </Link>
            </div>
          </div>
        </header>

        <div className="card-glass p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-white/80 font-medium">Search by Name</label>
                <div className="flex items-center gap-2 bg-white/[0.03] rounded-lg p-2">
                  <Search className="w-5 h-5 text-white/60 ml-2" />
                  <input
                    type="search"
                    placeholder="Enter game name..."
                    value={nameInput}
                    onChange={(e) => onNameInputChange(e.target.value)}
                    className="bg-transparent border-none w-full focus:outline-none text-white placeholder:text-white/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-white/80 font-medium">Search by TID</label>
                <div className="flex items-center gap-2 bg-white/[0.03] rounded-lg p-2">
                  <Search className="w-5 h-5 text-white/60 ml-2" />
                  <input
                    type="search"
                    placeholder="Enter Title ID..."
                    value={tidInput}
                    onChange={(e) => onTidInputChange(e.target.value)}
                    className="bg-transparent border-none w-full focus:outline-none text-white placeholder:text-white/50"
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-white/10">
              {/* Mobile Filters */}
              <div className="sm:hidden space-y-4">
                <div className="grid grid-cols-4 gap-1 p-1 bg-white/[0.03] rounded-lg">
                  {['all', 'base', 'update', 'dlc'].map((type) => (
                    <button
                      key={type}
                      onClick={() => updateSearchParams({ type, page: '1' })}
                      className={`py-2 px-3 rounded-md text-sm font-medium transition-all ${
                        filterType === type
                          ? 'bg-orange-500/20 text-orange-300'
                          : 'text-white/70 hover:text-white/90 hover:bg-white/[0.05]'
                      }`}
                    >
                      {type === 'all' ? 'All' : type === 'base' ? 'Games' : type === 'update' ? 'Updates' : 'DLC'}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-1 p-1 bg-white/[0.03] rounded-lg">
                  {['name', 'size'].map((sort) => (
                    <button
                      key={sort}
                      onClick={() => updateSearchParams({ sort })}
                      className={`py-2 px-3 rounded-md text-sm font-medium transition-all ${
                        sortBy === sort
                          ? 'bg-orange-500/20 text-orange-300'
                          : 'text-white/70 hover:text-white/90 hover:bg-white/[0.05]'
                      }`}
                    >
                      {sort === 'name' ? 'By Name' : 'By Size'}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-1 p-1 bg-white/[0.03] rounded-lg">
                  {['asc', 'desc'].map((order) => (
                    <button
                      key={order}
                      onClick={() => updateSearchParams({ order })}
                      className={`py-2 px-3 rounded-md text-sm font-medium transition-all ${
                        sortOrder === order
                          ? 'bg-orange-500/20 text-orange-300'
                          : 'text-white/70 hover:text-white/90 hover:bg-white/[0.05]'
                      }`}
                    >
                      {order === 'asc' ? '↑ Ascending' : '↓ Descending'}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-1 p-1 bg-white/[0.03] rounded-lg">
                  <button
                    onClick={() => updateSearchParams({ display: 'banner' })}
                    className={`py-2 px-3 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                      viewMode === 'banner'
                        ? 'bg-orange-500/20 text-orange-300'
                        : 'text-white/70 hover:text-white/90 hover:bg-white/[0.05]'
                    }`}
                  >
                    <Image className="w-4 h-4" />
                    <span>Banner</span>
                  </button>
                  <button
                    onClick={() => updateSearchParams({ display: 'grid' })}
                    className={`py-2 px-3 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                      viewMode === 'grid'
                        ? 'bg-orange-500/20 text-orange-300'
                        : 'text-white/70 hover:text-white/90 hover:bg-white/[0.05]'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                    <span>Grid</span>
                  </button>
                </div>
              </div>

              {/* Desktop Filters */}
              <div className="hidden sm:grid sm:grid-cols-4 gap-4">
                <div>
                  <Select
                    value={filterType}
                    onValueChange={(value) => updateSearchParams({ type: value, page: '1' })}
                  >
                    <SelectTrigger className="w-full bg-white/[0.03] border-none text-white h-10 px-3 rounded-lg">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg border-none min-w-[8rem] p-1">
                      <SelectItem value="all">All Content</SelectItem>
                      <SelectItem value="base">Base Games</SelectItem>
                      <SelectItem value="update">Updates</SelectItem>
                      <SelectItem value="dlc">DLC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Select
                    value={sortBy}
                    onValueChange={(value) => updateSearchParams({ sort: value })}
                  >
                    <SelectTrigger className="w-full bg-white/[0.03] border-none text-white h-10 px-3 rounded-lg">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg border-none min-w-[8rem] p-1">
                      <SelectItem value="name">Sort by Name</SelectItem>
                      <SelectItem value="size">Sort by Size</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Select
                    value={sortOrder}
                    onValueChange={(value) => updateSearchParams({ order: value })}
                  >
                    <SelectTrigger className="w-full bg-white/[0.03] border-none text-white h-10 px-3 rounded-lg">
                      <SelectValue placeholder="Order" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg border-none min-w-[8rem] p-1">
                      <SelectItem value="asc">Ascending</SelectItem>
                      <SelectItem value="desc">Descending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-shrink-0">
                  <div className="flex items-center gap-1 bg-white/[0.03] rounded-lg p-1 h-full">
                    <button
                      onClick={() => updateSearchParams({ display: 'banner' })}
                      className={`p-1.5 rounded-md transition-all ${
                        viewMode === 'banner'
                          ? 'bg-orange-500/20 text-orange-300'
                          : 'text-white/60 hover:text-white/90 hover:bg-white/[0.05]'
                      }`}
                      title="Banner view"
                    >
                      <Image className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => updateSearchParams({ display: 'grid' })}
                      className={`p-1.5 rounded-md transition-all ${
                        viewMode === 'grid'
                          ? 'bg-orange-500/20 text-orange-300'
                          : 'text-white/60 hover:text-white/90 hover:bg-white/[0.05]'
                      }`}
                      title="Grid view"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-sm text-white/70 mt-4">
                Showing {paginatedGames.length} of {filteredGames.length} results
              </div>
            </div>
          </div>
        </div>

        <div className="card-glass p-6">
          {loading ? (
            <div className="text-center py-24 space-y-4">
              <div className="w-10 h-10 text-orange-400 animate-spin mx-auto" />
              <p className="text-white/70">Loading content...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedGames.map((game) => (
                <GameCard
                  key={game.tid}
                  game={game}
                  viewMode={viewMode}
                  onClick={() => updateSearchParams({ game: game.tid })}
                  games={games}
                />
              ))}
              
              {totalPages > 1 && (
                <div className="col-span-full mt-8 mb-8 card-glass p-3 sm:p-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => updateSearchParams({ page: page.toString() })}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}