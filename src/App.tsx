import { useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState, useTransition, Suspense } from 'react';
import type { ProcessedGame } from './lib/types';
import { formatBytes, filterBaseGames, processGameDataInChunks } from './lib/format';
import { processGameData, mergeGameData } from './lib/format';
import { useCallback } from 'react';
import { useDebounce } from './hooks/use-debounce';
import { GameDetails } from './pages/GameDetails';
import { getBaseTidForUpdate } from './lib/utils';
import { HomePage } from './pages/HomePage';
import { ContentList } from './pages/ContentList';
import { fetchRecentGames, fetchRecentUpdates, fetchRecentDLCs, fetchGameDetails } from './lib/api';
import type { RecentGame } from './lib/types';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  const [games, setGames] = useState<ProcessedGame[]>([]);
  const [recentGames, setRecentGames] = useState<RecentGame[]>([]);
  const [recentUpdates, setRecentUpdates] = useState<RecentGame[]>([]);
  const [recentDLCs, setRecentDLCs] = useState<RecentGame[]>([]);
  const [showAllUpdates, setShowAllUpdates] = useState(false);
  const [showAllDLCs, setShowAllDLCs] = useState(false);
  const [updatesSortConfig, setUpdatesSortConfig] = useState<{ key: keyof RecentGame; direction: 'asc' | 'desc' }>({ key: 'date', direction: 'desc' });
  const [dlcsSortConfig, setDlcsSortConfig] = useState<{ key: keyof RecentGame; direction: 'asc' | 'desc' }>({ key: 'date', direction: 'desc' });
  const [isPending, startTransition] = useTransition();
  const itemsPerPage = window.innerWidth < 640 ? 25 : 51;
  
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [downloadSize, setDownloadSize] = useState<string>('');
  const [stage, setStage] = useState<'downloading' | 'processing'>('downloading');
  const [loadingText, setLoadingText] = useState('Loading database...');
  
  const getRandomBaseGame = useCallback(() => {
    const baseGames = games.filter(game => game.tid.endsWith('000'));
    if (baseGames.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * baseGames.length);
    return baseGames[randomIndex];
  }, [games]);
  
  // URL Search Params
  const [searchParams, setSearchParams] = useSearchParams({
    page: '1',
    sort: 'name',
    order: 'asc',
    type: 'base', 
    search: '',
    tid: '',
    game: ''
  });

  const currentPage = parseInt(searchParams.get('page') || '1');
  const sortBy = searchParams.get('sort') as 'name' | 'size' | 'date' || 'name';
  const sortOrder = searchParams.get('order') as 'asc' | 'desc' || 'asc';
  const filterType = searchParams.get('type') as 'all' | 'base' | 'update' | 'dlc' || 'base';
  const viewMode = searchParams.get('display') as 'banner' | 'grid' || 'grid';
  
  // Local state for input values
  const [nameInput, setNameInput] = useState(searchParams.get('search') || '');
  const [tidInput, setTidInput] = useState(searchParams.get('tid') || '');
  
  const debouncedName = useDebounce(nameInput, 300);
  const debouncedTid = useDebounce(tidInput, 300);

  // Update URL when debounced values change
  useEffect(() => {
    updateSearchParams({ 
      search: debouncedName,
      tid: debouncedTid,
      page: '1'
    });
  }, [debouncedName, debouncedTid]);

  // Update URL params when filters change
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

  useEffect(() => {
    // Reset page when search changes
    updateSearchParams({ page: '1' });
  }, [debouncedName, debouncedTid]);

  const filteredGames = useMemo(() => {
    let filtered = filterType === 'all' ? games : games.filter(game => game.type === filterType);
    
    if (debouncedName) {
      const searchLower = debouncedName.toLowerCase();
      filtered = filtered.filter(game => 
        game.name.toLowerCase().includes(searchLower)
      );
    }
    
    if (debouncedTid) {
      const searchLower = debouncedTid.toLowerCase();
      filtered = filtered.filter(game => 
        game.tid.toLowerCase().includes(searchLower)
      );
    }

    // Sort the filtered results
    const sorted = [...filtered].sort((a, b) => {
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
    
    return sorted;
  }, [games, filterType, debouncedName, debouncedTid, sortBy, sortOrder]);

  const paginatedGames = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredGames.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredGames, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredGames.length / itemsPerPage);

  // Update itemsPerPage when window size changes
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

  useEffect(() => {
    async function loadData() {
      try {
        // Download both files in parallel
        setLoadingText('Downloading databases...');
        const [jsonResponse, txtResponse] = await Promise.all([
          fetch('https://nx-missing.ghostland.at/data/working.json'),
          fetch('https://nx-missing.ghostland.at/data/working.txt')
        ]);

        // Process JSON data
        const jsonData = await jsonResponse.json();

        // Process TXT data
        const txtData = await txtResponse.text();
        const txtEntries = txtData.split('\n')
          .filter(line => line.trim())
          .map(line => {
            const [tid, version] = line.split('|');
            return { tid, version };
          });

        // Merge and process the data
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

  const sortedUpdates = useMemo(() => {
    const sorted = [...recentUpdates].sort((a, b) => {
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
          ? a.version.localeCompare(b.version, undefined, { numeric: true })
          : b.version.localeCompare(a.version, undefined, { numeric: true });
      }
      return 0;
    });
    return sorted;
  }, [recentUpdates, updatesSortConfig]);

  const sortedDLCs = useMemo(() => {
    const sorted = [...recentDLCs].sort((a, b) => {
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
          ? a.version.localeCompare(b.version, undefined, { numeric: true })
          : b.version.localeCompare(a.version, undefined, { numeric: true });
      }
      return 0;
    });
    return sorted;
  }, [recentDLCs, dlcsSortConfig]);

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
        <GameDetails 
          games={games} 
          tid={getBaseTidForUpdate(searchParams.get('game')!)} 
        />
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
          getRandomBaseGame={getRandomBaseGame}
          updateSearchParams={updateSearchParams}
        />
      )}
      </Suspense>
    </ErrorBoundary>
  );
}

export default App