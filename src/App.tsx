import { useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState, useTransition, Suspense, useCallback } from 'react';
import type { ProcessedGame, RecentGame } from './lib/types';
import { processGameData, mergeGameData } from './lib/format';
import { useDebounce } from './hooks/use-debounce';
import { getBaseTidForUpdate } from './lib/utils';
import { fetchRecentGames, fetchRecentUpdates, fetchRecentDLCs } from './lib/api';
import { GameDetails } from './pages/GameDetails';
import { HomePage } from './pages/HomePage';
import { ContentList } from './pages/ContentList';
import { Documentation } from './pages/Documentation';
import { ErrorBoundary } from './components/ErrorBoundary';

/**
 * Main application component that handles routing and data management
 * Manages game data, recent content, and navigation between different views
 */
function App() {
  // URL and navigation state
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Core data state
  const [games, setGames] = useState<ProcessedGame[]>([]);
  const [recentGames, setRecentGames] = useState<RecentGame[]>([]);
  const [recentUpdates, setRecentUpdates] = useState<RecentGame[]>([]);
  const [recentDLCs, setRecentDLCs] = useState<RecentGame[]>([]);
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Loading database...');
  const [stage, setStage] = useState<'downloading' | 'processing'>('downloading');
  const [progress, setProgress] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [downloadSize, setDownloadSize] = useState<string>('');
  
  // Content display state
  const [showAllUpdates, setShowAllUpdates] = useState(false);
  const [showAllDLCs, setShowAllDLCs] = useState(false);
  
  // Sorting configuration
  const [updatesSortConfig, setUpdatesSortConfig] = useState<{ 
    key: keyof RecentGame; 
    direction: 'asc' | 'desc' 
  }>({ key: 'date', direction: 'desc' });
  
  const [dlcsSortConfig, setDlcsSortConfig] = useState<{ 
    key: keyof RecentGame; 
    direction: 'asc' | 'desc' 
  }>({ key: 'date', direction: 'desc' });
  
  // Content view state
  const [nameInput, setNameInput] = useState(searchParams.get('search') || '');
  const [tidInput, setTidInput] = useState(searchParams.get('tid') || '');
  
  // Performance optimization
  const [isPending, startTransition] = useTransition();
  const itemsPerPage = window.innerWidth < 640 ? 25 : 51;
  
  // Debounced search inputs
  const debouncedName = useDebounce(nameInput, 300);
  const debouncedTid = useDebounce(tidInput, 300);
  
  // View detection
  const isContentView = searchParams.get('view') === 'content';
  
  // URL parameters
  const currentPage = parseInt(searchParams.get('page') || '1');
  const sortBy = searchParams.get('sort') as 'name' | 'size' | 'date' || 'name';
  const sortOrder = searchParams.get('order') as 'asc' | 'desc' || 'asc';
  const filterType = searchParams.get('type') as 'all' | 'base' | 'update' | 'dlc' || 'base';
  const viewMode = searchParams.get('display') as 'banner' | 'grid' || 'grid';

  /**
   * Generates a random base game from the available games
   */
  const getRandomBaseGame = useCallback(() => {
    const baseGames = games.filter(game => game.tid.endsWith('000'));
    if (baseGames.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * baseGames.length);
    return baseGames[randomIndex];
  }, [games]);

  /**
   * Updates URL search parameters while preserving existing ones
   */
  const updateSearchParams = (updates: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams);
    
    // Preserve view parameter if it exists
    const currentView = searchParams.get('view');
    if (currentView) {
      newParams.set('view', currentView);
    }
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  };

  /**
   * Handles sorting for updates and DLCs tables
   */
  const handleSort = (table: 'updates' | 'dlcs', key: keyof RecentGame) => {
    if (table === 'updates') {
      setUpdatesSortConfig(current => ({
        key,
        direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
      }));
    } else {
      setDlcsSortConfig(current => ({
        key,
        direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
      }));
    }
  };

  // Handle random game parameter
  useEffect(() => {
    if (searchParams.get('random') === 'random') {
      const randomGame = getRandomBaseGame();
      if (randomGame) {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('random');
        newParams.set('game', randomGame.tid);
        setSearchParams(newParams);
      }
    }
  }, [searchParams, games, getRandomBaseGame, setSearchParams]);

  // Initialize content view parameters
  useEffect(() => {
    if (isContentView && !searchParams.get('page')) {
      setSearchParams({
        view: 'content',
        page: '1',
        sort: 'name',
        order: 'asc',
        type: 'base',
        search: '',
        tid: '',
      });
    }
  }, [isContentView, searchParams, setSearchParams]);

  // Update URL when debounced search values change
  useEffect(() => {
    updateSearchParams({ 
      view: 'content',
      search: debouncedName,
      tid: debouncedTid,
      page: '1'
    });
  }, [debouncedName, debouncedTid]);

  // Reset page when search changes
  useEffect(() => {
    updateSearchParams({ page: '1' });
  }, [debouncedName, debouncedTid]);

  // Handle responsive pagination
  useEffect(() => {
    const handleResize = () => {
      const newItemsPerPage = window.innerWidth < 640 ? 25 : 51;
      if (newItemsPerPage !== itemsPerPage) {
        updateSearchParams({ page: '1' });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [itemsPerPage]);

  // Load main game database
  useEffect(() => {
    async function loadData() {
      try {
        setLoadingText('Downloading databases...');
        
        // Fetch both data sources in parallel
        const [jsonResponse, txtResponse] = await Promise.all([
          fetch('https://nx-missing.ghostland.at/data/working.json'),
          fetch('https://nx-missing.ghostland.at/data/working.txt')
        ]);

        const jsonData = await jsonResponse.json();
        const txtData = await txtResponse.text();
        
        // Parse TXT data
        const txtEntries = txtData.split('\n')
          .filter(line => line.trim())
          .map(line => {
            const [tid, version] = line.split('|');
            return { tid, version };
          });

        // Process and merge data
        setStage('processing');
        setLoadingText('Processing data...');
        const mergedData = mergeGameData(jsonData, txtEntries);
        const processedGames = processGameData(mergedData);
        setGames(processedGames);
        setLoading(false);
      } catch (error) {
        console.error('Error loading games:', error);
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Load recent games
  useEffect(() => {
    async function loadRecentGames() {
      try {
        const data = await fetchRecentGames();
        setRecentGames(data);
      } catch (error) {
        console.error('Error loading recent games:', error);
      }
    }
    loadRecentGames();
  }, []);

  // Load recent content (updates and DLCs)
  useEffect(() => {
    async function loadRecentContent() {
      try {
        const [updates, dlcs] = await Promise.all([
          fetchRecentUpdates(),
          fetchRecentDLCs()
        ]);
        setRecentUpdates(updates);
        setRecentDLCs(dlcs);
      } catch (error) {
        console.error('Error loading recent content:', error);
      }
    }
    loadRecentContent();
  }, []);

  // Filter and sort games based on current criteria
  const filteredGames = useMemo(() => {
    let filtered = filterType === 'all' ? games : games.filter(game => game.type === filterType);
    
    // Apply name filter
    if (debouncedName) {
      const searchLower = debouncedName.toLowerCase();
      filtered = filtered.filter(game => 
        game.name.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply TID filter
    if (debouncedTid) {
      const searchLower = debouncedTid.toLowerCase();
      filtered = filtered.filter(game => 
        game.tid.toLowerCase().includes(searchLower)
      );
    }

    // Sort results
    return [...filtered].sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'size') {
        return sortOrder === 'asc'
          ? a.size - b.size
          : b.size - a.size;
      }
      return 0;
    });
  }, [games, filterType, debouncedName, debouncedTid, sortBy, sortOrder]);

  // Paginate filtered games
  const paginatedGames = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredGames.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredGames, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredGames.length / itemsPerPage);

  // Sort recent updates
  const sortedUpdates = useMemo(() => {
    return [...recentUpdates].sort((a, b) => {
      if (updatesSortConfig.key === 'date') {
        return updatesSortConfig.direction === 'asc' 
          ? a.date.getTime() - b.date.getTime()
          : b.date.getTime() - a.date.getTime();
      }
      if (updatesSortConfig.key === 'title') {
        return updatesSortConfig.direction === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
      if (updatesSortConfig.key === 'version') {
        return updatesSortConfig.direction === 'asc'
          ? a.version.localeCompare(a.version, undefined, { numeric: true })
          : b.version.localeCompare(a.version, undefined, { numeric: true });
      }
      return 0;
    });
  }, [recentUpdates, updatesSortConfig]);

  // Sort recent DLCs
  const sortedDLCs = useMemo(() => {
    return [...recentDLCs].sort((a, b) => {
      if (dlcsSortConfig.key === 'date') {
        return dlcsSortConfig.direction === 'asc'
          ? a.date.getTime() - b.date.getTime()
          : b.date.getTime() - a.date.getTime();
      }
      if (dlcsSortConfig.key === 'title') {
        return dlcsSortConfig.direction === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
      if (dlcsSortConfig.key === 'version') {
        return dlcsSortConfig.direction === 'asc'
          ? a.version.localeCompare(a.version, undefined, { numeric: true })
          : b.version.localeCompare(a.version, undefined, { numeric: true });
      }
      return 0;
    });
  }, [recentDLCs, dlcsSortConfig]);

  return (
    <ErrorBoundary>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-10 h-10 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
            <p className="text-white/70">Loading application...</p>
          </div>
        </div>
      }>
        {searchParams.get('game') ? (
          loading ? (
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-10 h-10 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
                <p className="text-white/70">Loading game data...</p>
              </div>
            </div>
          ) : (
            <GameDetails 
              games={games} 
              tid={getBaseTidForUpdate(searchParams.get('game')!)} 
            />
          )
        ) : searchParams.get('view') === 'content' ? (
          <ContentList
            games={games}
            loading={loading}
            nameInput={nameInput}
            tidInput={tidInput}
            filterType={filterType}
            sortBy={sortBy}
            sortOrder={sortOrder}
            viewMode={viewMode}
            currentPage={currentPage}
            totalPages={totalPages}
            paginatedGames={paginatedGames}
            filteredGames={filteredGames}
            onNameInputChange={setNameInput}
            onTidInputChange={setTidInput}
            updateSearchParams={updateSearchParams}
            getRandomBaseGame={getRandomBaseGame}
          />
        ) : searchParams.get('view') === 'docs' ? (
          <Documentation />
        ) : (
          <HomePage
            loading={loading}
            loadingText={loadingText}
            stage={stage}
            progress={progress}
            processingProgress={processingProgress}
            downloadSize={downloadSize}
            games={games}
            recentGames={recentGames}
            recentUpdates={sortedUpdates}
            recentDLCs={sortedDLCs}
            showAllUpdates={showAllUpdates}
            showAllDLCs={showAllDLCs}
            updatesSortConfig={updatesSortConfig}
            dlcsSortConfig={dlcsSortConfig}
            onUpdatesSortChange={(key) => handleSort('updates', key)}
            onDLCSortChange={(key) => handleSort('dlcs', key)}
            onShowAllUpdatesChange={setShowAllUpdates}
            onShowAllDLCsChange={setShowAllDLCs}
            onGameSelect={(tid) => updateSearchParams({ game: tid })}
          />
        )}
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;