import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Database, Download, HardDrive, Loader2, Search, Package, RefreshCw, Github } from 'lucide-react';
import { AnimatedDice } from '@/components/ui/animated-dice';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { ProcessedGame, RecentGame } from '@/lib/types';
import { formatBytes } from '@/lib/format';
import { RecentGameCard } from '@/components/RecentGameCard';
import { StatsCard } from '@/components/StatsCard';
import { Footer } from '@/components/Footer';

interface HomePageProps {
  loading: boolean;
  loadingText: string;
  stage: 'downloading' | 'processing';
  progress: number;
  processingProgress: number;
  downloadSize: string;
  games: ProcessedGame[];
  recentGames: RecentGame[];
  recentUpdates: RecentGame[];
  recentDLCs: RecentGame[];
  showAllUpdates: boolean;
  showAllDLCs: boolean;
  updatesSortConfig: { key: keyof RecentGame; direction: 'asc' | 'desc' };
  dlcsSortConfig: { key: keyof RecentGame; direction: 'asc' | 'desc' };
  onUpdatesSortChange: (key: keyof RecentGame) => void;
  onDLCSortChange: (key: keyof RecentGame) => void;
  onShowAllUpdatesChange: (show: boolean) => void;
  onShowAllDLCsChange: (show: boolean) => void;
  onGameSelect: (tid: string) => void;
}

/**
 * HomePage component displays the main landing page of the application
 * Shows database statistics, recent content, and navigation options
 * Handles loading states and provides access to different sections
 * 
 * @param loading - Whether the database is currently loading
 * @param loadingText - Text to display during loading
 * @param stage - Current loading stage (downloading/processing)
 * @param progress - Download progress percentage
 * @param processingProgress - Data processing progress percentage
 * @param downloadSize - Size of data being downloaded
 * @param games - Array of all available games
 * @param recentGames - Recently added base games
 * @param recentUpdates - Recently added updates
 * @param recentDLCs - Recently added DLC content
 * @param showAllUpdates - Whether to show all updates or just recent ones
 * @param showAllDLCs - Whether to show all DLCs or just recent ones
 * @param updatesSortConfig - Sorting configuration for updates table
 * @param dlcsSortConfig - Sorting configuration for DLCs table
 * @param onUpdatesSortChange - Callback for updates table sorting
 * @param onDLCSortChange - Callback for DLCs table sorting
 * @param onShowAllUpdatesChange - Callback to toggle updates display
 * @param onShowAllDLCsChange - Callback to toggle DLCs display
 * @param onGameSelect - Callback when a game is selected
 */
export function HomePage({
  loading,
  loadingText,
  stage,
  progress,
  processingProgress,
  downloadSize,
  games,
  recentGames,
  recentUpdates,
  recentDLCs,
  showAllUpdates,
  showAllDLCs,
  updatesSortConfig,
  dlcsSortConfig,
  onUpdatesSortChange,
  onDLCSortChange,
  onShowAllUpdatesChange,
  onShowAllDLCsChange,
  onGameSelect,
}: HomePageProps) {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero section with title and call-to-action buttons */}
        <header className="text-center space-y-6 py-16">
          <h1 className="text-4xl md:text-5xl font-bold">
            <span className="text-red-500">NX</span> <span className="text-gradient">Content Database</span>
          </h1>
          <div className="max-w-3xl mx-auto px-4">
            <p className="text-lg md:text-xl text-white/80 leading-relaxed">
              Track and discover Nintendo Switch content that has been successfully preserved and is available online.
            </p>
            <p className="text-base md:text-lg text-white/60 mt-3">
              This database serves as a reference tool to help you keep track of available content.
              <br className="hidden sm:block" />
              No content is hosted or distributed through this platform.
            </p>
          </div>
          <div className="mt-12">
            <div className="flex flex-col sm:flex-row justify-center items-stretch gap-3 max-w-2xl mx-auto px-4 sm:px-0">
              <button
                onClick={() => window.location.href = '/?view=content'}
                className="w-full sm:flex-1 btn-orange"
              >
                <div className="relative flex items-center justify-center">
                  <Database className="w-5 h-5 mr-2" />
                  <span className="font-medium">Browse Database</span>
                </div>
              </button>
              <button
                onClick={() => window.open('https://nx-missing.ghostland.at', '_blank')}
                className="w-full sm:flex-1 btn-orange glass"
              >
                <div className="relative flex items-center justify-center">
                  <Search className="w-5 h-5 mr-2" />
                  <span className="font-medium">Find Missing Content</span>
                </div>
              </button>
              <button
                onClick={() => {
                  const baseGames = games.filter(g => g.tid.endsWith('000'));
                  if (baseGames.length === 0) return;
                  const randomIndex = Math.floor(Math.random() * baseGames.length);
                  const randomGame = baseGames[randomIndex];
                  onGameSelect(randomGame.tid);
                }}
                className="w-full sm:flex-1 btn-orange glass"
              >
                <div className="relative flex items-center justify-center">
                  <AnimatedDice className="w-5 h-5 mr-2" />
                  <span className="font-medium">View Random Game</span>
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Loading state with progress indicators */}
        {loading ? (
          <div className="text-center py-24 space-y-4">
            <Loader2 className="w-10 h-10 text-orange-400 animate-spin mx-auto" />
            <p className="text-white/70">{loadingText}</p>
            {stage === 'downloading' && progress > 0 && (
              <div className="max-w-xs mx-auto space-y-2">
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-white/50">
                  {Math.round(progress)}% • {downloadSize}
                </p>
              </div>
            )}
            {stage === 'processing' && processingProgress > 0 && (
              <div className="max-w-xs mx-auto space-y-2">
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-500 transition-all duration-300"
                    style={{ width: `${processingProgress}%` }}
                  />
                </div>
                <p className="text-sm text-white/50">
                  Processing: {Math.round(processingProgress)}%
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Database statistics cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
            <StatsCard
              icon={Package}
              title="Base Games"
              value={games.filter(g => g.tid.endsWith('000')).length}
            />
            <StatsCard
              icon={RefreshCw}
              title="Updates"
              value={games.filter(g => g.tid.endsWith('800')).length}
            />
            <StatsCard
              icon={Download}
              title="DLC Content"
              value={games.filter(g => !g.tid.endsWith('000') && !g.tid.endsWith('800')).length}
            />
            <StatsCard
              icon={HardDrive}
              title="Total Size"
              value={formatBytes(games.filter(g => g.tid.endsWith('000') || (g.tid.endsWith('800') && g.size > 0)).reduce((acc, game) => acc + game.size, 0))}
            />
          </div>
        )}

        {/* Recently added content section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-orange-400">Recently Dumped</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentGames.slice(0, 6).map((game) => (
              <RecentGameCard
                key={game.tid}
                game={game}
                onClick={() => onGameSelect(game.tid)}
              />
            ))}
          </div>
        </div>
        
        {/* Recent Updates and DLCs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Updates */}
          <div className="card-glass p-6">
            <h2 className="text-2xl font-semibold text-orange-400 mb-4">Recent Updates</h2>
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="text-white/70 cursor-pointer hover:text-white"
                      onClick={() => onUpdatesSortChange('title')}
                    >
                      Title {updatesSortConfig.key === 'title' && (updatesSortConfig.direction === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead 
                      className="text-white/70 cursor-pointer hover:text-white"
                      onClick={() => onUpdatesSortChange('version')}
                    >
                      Version {updatesSortConfig.key === 'version' && (updatesSortConfig.direction === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead className="text-white/70">
                      Size
                    </TableHead>
                    <TableHead 
                      className="text-white/70 cursor-pointer hover:text-white"
                      onClick={() => onUpdatesSortChange('date')}
                    >
                      Date {updatesSortConfig.key === 'date' && (updatesSortConfig.direction === 'asc' ? '↑' : '↓')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(showAllUpdates ? recentUpdates : recentUpdates.slice(0, 8)).map((update) => (
                    <TableRow 
                      key={update.tid}
                      className="cursor-pointer hover:bg-white/[0.03]"
                      onClick={() => onGameSelect(update.tid)}
                    >
                      <TableCell className="font-medium text-white/90">{update.title}</TableCell>
                      <TableCell className="text-white/70">v{update.version}</TableCell>
                      <TableCell className="text-white/70">{update.size}</TableCell>
                      <TableCell className="text-white/70">{update.date.toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {recentUpdates.length > 8 && (
                <button
                  onClick={() => onShowAllUpdatesChange(!showAllUpdates)}
                  className="w-full py-2 px-4 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors text-white/90 hover:text-white"
                >
                  {showAllUpdates ? 'Show Less' : `View All (${recentUpdates.length})`}
                </button>
              )}
            </div>
          </div>
          
          {/* Recent DLCs */}
          <div className="card-glass p-6">
            <h2 className="text-2xl font-semibold text-orange-400 mb-4">Recent DLCs</h2>
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="text-white/70 cursor-pointer hover:text-white"
                      onClick={() => onDLCSortChange('title')}
                    >
                      Title {dlcsSortConfig.key === 'title' && (dlcsSortConfig.direction === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead 
                      className="text-white/70 cursor-pointer hover:text-white"
                      onClick={() => onDLCSortChange('version')}
                    >
                      Version {dlcsSortConfig.key === 'version' && (dlcsSortConfig.direction === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead className="text-white/70">
                      Size
                    </TableHead>
                    <TableHead 
                      className="text-white/70 cursor-pointer hover:text-white"
                      onClick={() => onDLCSortChange('date')}
                    >
                      Date {dlcsSortConfig.key === 'date' && (dlcsSortConfig.direction === 'asc' ? '↑' : '↓')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(showAllDLCs ? recentDLCs : recentDLCs.slice(0, 8)).map((dlc) => (
                    <TableRow 
                      key={dlc.tid}
                      className="cursor-pointer hover:bg-white/[0.03]"
                      onClick={() => onGameSelect(dlc.tid)}
                    >
                      <TableCell className="font-medium text-white/90">{dlc.title}</TableCell>
                      <TableCell className="text-white/70">v{dlc.version}</TableCell>
                      <TableCell className="text-white/70">{dlc.size}</TableCell>
                      <TableCell className="text-white/70">{dlc.date.toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {recentDLCs.length > 8 && (
                <button
                  onClick={() => onShowAllDLCsChange(!showAllDLCs)}
                  className="w-full py-2 px-4 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors text-white/90 hover:text-white"
                >
                  {showAllDLCs ? 'Show Less' : `View All (${recentDLCs.length})`}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}