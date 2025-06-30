import { useState, useEffect, useRef } from 'react';
import { useLocation, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Download, FileUp, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';
import type { GameDetails } from '@/lib/types';
import type { ProcessedGame } from '@/lib/types';
import { fetchGameDetails } from '@/lib/api';
import { getRelatedContent } from '@/lib/format';
import { getBaseTidForUpdate, getIconFallbackUrls, getBannerFallbackUrls } from '@/lib/utils';
import { Footer } from '@/components/Footer';
import { AnimatedDice } from '@/components/ui/animated-dice';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { LazyImage } from '@/components/ui/lazy-image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface GameDetailsProps {
  games: ProcessedGame[];
  tid: string;
}

/**
 * GameDetails component displays comprehensive information about a specific game
 * Shows game banner, screenshots, details, and related content (updates/DLCs)
 * Handles error states for invalid TIDs and missing games
 * 
 * @param games - Array of all available games
 * @param tid - Title ID of the game to display
 */
export function GameDetails({ games, tid }: GameDetailsProps) {
  // State for game details and loading
  const [details, setDetails] = useState<GameDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI state for content display
  const [showAllUpdates, setShowAllUpdates] = useState(false);
  const [showAllDLCs, setShowAllDLCs] = useState(false);
  const [showBackText, setShowBackText] = useState(true);
  
  // Navigation and routing
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [isHovering, setIsHovering] = useState(false);

  // Extract base TID for related content lookup
  const baseTid = getBaseTidForUpdate(tid);

  // Validate TID format (16 hex characters)
  const isValidTid = /^[0-9A-Fa-f]{16}$/.test(tid);

  /**
   * Updates URL search parameters while preserving existing ones
   */
  const updateSearchParams = (updates: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  };

  // Find the target game and its related content
  const game = games.find(g => g.tid === tid);
  const relatedContent = game ? getRelatedContent(games, game.tid) : null;

  // Handle scroll behavior for back button text visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowBackText(window.scrollY < 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top when component mounts or location changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Load game details from external API
  useEffect(() => {
    async function loadDetails() {
      if (!tid || !isValidTid) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await fetchGameDetails(tid);
        setDetails(data);
      } catch (err) {
        setError('Failed to load game details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadDetails();
  }, [tid, isValidTid]);

  // Render error page for invalid TID format
  if (!isValidTid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card-glass p-8 max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Invalid Title ID</h2>
            <p className="text-white/70 mb-4">
              The Title ID <code className="bg-white/10 px-2 py-1 rounded text-sm">{tid}</code> is not in the correct format.
            </p>
            <p className="text-white/60 text-sm">
              A valid Title ID should be 16 hexadecimal characters (0-9, A-F).
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link 
              to="/" 
              className="btn-orange flex-1 flex items-center justify-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <button
              onClick={() => {
                const baseGames = games.filter(g => g.tid.endsWith('000'));
                if (baseGames.length === 0) return;
                const randomIndex = Math.floor(Math.random() * baseGames.length);
                const randomGame = baseGames[randomIndex];
                updateSearchParams({ game: randomGame.tid });
              }}
              className="btn-orange flex-1 flex items-center justify-center gap-2"
            >
              <AnimatedDice className="w-4 h-4" />
              Random Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card-glass p-8 max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-orange-500/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Game Not Found</h2>
            <p className="text-white/70 mb-4">
              The game with TID <code className="bg-white/10 px-2 py-1 rounded text-sm">{tid}</code> could not be found in the database.
            </p>
            <p className="text-white/60 text-sm">
              This might be because the game hasn't been added yet or the TID is incorrect.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link 
              to="/" 
              className="btn-orange flex-1 flex items-center justify-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <button
              onClick={() => {
                const baseGames = games.filter(g => g.tid.endsWith('000'));
                if (baseGames.length === 0) return;
                const randomIndex = Math.floor(Math.random() * baseGames.length);
                const randomGame = baseGames[randomIndex];
                updateSearchParams({ game: randomGame.tid });
              }}
              className="btn-orange flex-1 flex items-center justify-center gap-2"
            >
              <AnimatedDice className="w-4 h-4" />
              Random Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="relative py-8 sm:py-10 md:py-12 lg:py-16">
          <button
            onClick={() => {
              if (location.search.includes('view=content')) {
                updateSearchParams({ view: 'content', game: '' });
              } else {
                updateSearchParams({ game: '' });
              }
            }}
            className="absolute z-10 top-4 left-4 text-white/90 hover:text-white transition-colors flex items-center justify-center w-10 h-10 sm:w-auto sm:h-auto sm:px-3 sm:py-2 bg-black/30 backdrop-blur-[2px] rounded-full sm:rounded-lg shadow-lg"
          >
            <ChevronLeft className="w-6 h-6" />
            <span className="hidden sm:inline ml-1">Go back</span>
          </button>
          <button
            onClick={() => {
              const baseGames = games.filter(g => g.tid.endsWith('000'));
              if (baseGames.length === 0) return;
              const randomIndex = Math.floor(Math.random() * baseGames.length);
              const randomGame = baseGames[randomIndex];
              updateSearchParams({ game: randomGame.tid });
            }}
            className="absolute z-10 top-4 right-4 text-white/90 hover:text-white transition-colors group"
            title="View random game"
          >
            <AnimatedDice className="w-6 h-6" />
          </button>
          <h1 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg px-12 sm:px-0 leading-tight">{game.name}</h1>
          <p className="hidden sm:block text-center text-white/80 mt-2 text-sm">TID: {game.tid}</p>
        </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Banner with Screenshots */}
          <Carousel
            className="card-glass overflow-hidden"
            opts={{
              align: "start",
              loop: true,
              dragFree: true,
              containScroll: false,
              watchDrag: false,
              skipSnaps: true,
              inViewThreshold: 0.7,
            }}
            plugins={[
              Autoplay({
                delay: 3000,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
              }),
            ] as any}
          >
            <CarouselContent>
              {/* Banner as first slide */}
              <CarouselItem>
                <div className="relative aspect-video">
                  <ImageWithFallback
                    src={`https://api.nlib.cc/nx/${baseTid}/banner/720p`}
                    fallbackSrc={`https://api.nlib.cc/nx/${baseTid}/icon/256/256`}
                    fallbackSrcs={getBannerFallbackUrls(baseTid)}
                    alt={`${game.name} banner`}
                    className="w-full h-full object-cover"
                    fallbackClassName="w-full h-full object-contain p-4 sm:p-8"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>
              </CarouselItem>
              
              {/* Screenshots */}
              {!loading && !error && details?.screens.screenshots.map((url: string, index: number) => (
                <CarouselItem key={index}>
                  <div className="relative aspect-video">
                    <LazyImage
                      src={url}
                      alt={`${game.name} screenshot ${index + 1}`}
                      className="w-full h-full object-cover"
                      placeholder={
                        <div className="flex items-center justify-center">
                          <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
                        </div>
                      }
                      threshold={0.1}
                      rootMargin="100px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Game Info */}
          <div className="card-glass p-4 sm:p-6 space-y-4">
            {loading ? (
              <div className="animate-pulse space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-white/10 rounded-lg"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-white/10 rounded w-3/4"></div>
                    <div className="h-4 bg-white/10 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-white/10 rounded w-full"></div>
                  <div className="h-4 bg-white/10 rounded w-5/6"></div>
                  <div className="h-4 bg-white/10 rounded w-4/6"></div>
                </div>
              </div>
            ) : error ? (
              <p className="text-red-400">{error}</p>
            ) : details && (
              <>
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <ImageWithFallback
                      src={`https://api.nlib.cc/nx/${baseTid}/icon/256/256`}
                      fallbackSrcs={getIconFallbackUrls(baseTid)}
                      alt="Game icon"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-white/5"
                      loading="eager"
                    />
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-lg"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80 mb-1">TID: {game.tid}</p>
                    {details.publisher && (
                      <p className="text-sm text-white/80 mb-1">Publisher: {details.publisher}</p>
                    )}
                    {details.releaseDate && (
                      <p className="text-sm text-white/80">
                        Release Date: {new Date(details.releaseDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                {details.description && (
                  <div>
                    <h3 className="text-base sm:text-lg font-medium mb-3 text-white/90">Description</h3>
                    <p className="text-white/80 whitespace-pre-line leading-relaxed text-sm md:text-base">{details.description}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Available Content */}
          <div className="card-glass p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-white/90">Available Content</h3>
            <div className="space-y-6">
              {/* Base Game */}
              <div className="space-y-3">
                <h4 className="text-base sm:text-lg font-medium text-orange-400">Base Game</h4>
                <div className="p-4 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors border border-white/5">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <span className="font-medium text-white">{game.name}</span>
                    <span className="text-sm text-white/80">{game.sizeFormatted}</span>
                  </div>
                  <p className="text-sm text-white/80 mt-1">TID: {game.tid}</p>
                </div>
              </div>
              
              {/* Updates Section */}
              {relatedContent?.updates && relatedContent.updates.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-base sm:text-lg font-medium text-orange-400 mb-4">
                    Updates ({relatedContent.updates.length})
                  </h4>
                  {(showAllUpdates ? relatedContent.updates : relatedContent.updates.slice(0, 4)).map((update, index) => (
                    <div 
                      key={update.tid} 
                      className={`p-4 rounded-lg transition-colors border ${
                        index === 0 
                          ? 'bg-orange-500/10 hover:bg-orange-500/15 border-orange-500/20' 
                          : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/5'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <div>
                          <span className={`font-medium ${index === 0 ? 'text-orange-200' : 'text-white'}`}>
                            Version {update.updateVersion}
                          </span>
                          <span className="ml-2 text-sm text-white/60">
                            (Update {Math.floor((update.updateVersion || 0) / 65536)})
                          </span>
                          {index === 0 && (
                            <span className="ml-2 text-xs bg-orange-500/30 text-orange-200 px-2 py-0.5 rounded-full">
                              Latest
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-white/80 mt-1">TID: {update.tid}</p>
                    </div>
                  ))}
                  {relatedContent.updates.length > 4 && (
                    <button
                      onClick={() => setShowAllUpdates(!showAllUpdates)}
                      className="w-full mt-2 py-2 px-4 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors text-white/90 hover:text-white flex items-center justify-center gap-2"
                    >
                      {showAllUpdates ? (
                        <>
                          Show Less <ChevronUp className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          View {relatedContent.updates.length - 4} More <ChevronDown className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
              
              {/* DLCs Section */}
              {relatedContent?.dlcs && relatedContent.dlcs.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-base sm:text-lg font-medium text-orange-400 mb-4">
                    DLC Content ({relatedContent.dlcs.length})
                  </h4>
                  {(showAllDLCs ? relatedContent.dlcs : relatedContent.dlcs.slice(0, 4)).map(dlc => (
                    <div key={dlc.tid} className="p-4 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors border border-white/5">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <span className="font-medium text-white">{dlc.name}</span>
                      </div>
                      <p className="text-sm text-white/80 mt-1">TID: {dlc.tid}</p>
                    </div>
                  ))}
                  {relatedContent.dlcs.length > 4 && (
                    <button
                      onClick={() => setShowAllDLCs(!showAllDLCs)}
                      className="w-full mt-2 py-2 px-4 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors text-white/90 hover:text-white flex items-center justify-center gap-2"
                    >
                      {showAllDLCs ? (
                        <>
                          Show Less <ChevronUp className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          View {relatedContent.dlcs.length - 4} More <ChevronDown className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Additional Info */}
          {!loading && !error && details && (
            <div className="card-glass p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-white/90">Additional Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {details.numberOfPlayers && (
                  <div className="p-4 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors border border-white/5">
                    <h4 className="text-sm font-medium text-orange-400 mb-1">Players</h4>
                    <p className="text-white">{details.numberOfPlayers}</p>
                  </div>
                )}
                {details.languages.length > 0 && (
                  <div className="p-4 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors border border-white/5">
                    <h4 className="text-sm font-medium text-orange-400 mb-1">Languages</h4>
                    <p className="text-white">{details.languages.join(', ').toUpperCase()}</p>
                  </div>
                )}
                {details.category.length > 0 && (
                  <div className="p-4 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors border border-white/5">
                    <h4 className="text-sm font-medium text-orange-400 mb-1">Categories</h4>
                    <p className="text-white">{details.category.join(', ')}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}