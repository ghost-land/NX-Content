import { useEffect, useState } from 'react';
import { ContentItem } from './types';
import { ContentTable } from './components/ContentTable';
import { TabNavigation } from './components/TabNavigation';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { logger } from './utils/logger';
import { useSearch } from './hooks/useSearch';
import { useUserPreferences } from './store/userPreferences';
import { sortByReleaseDate } from './utils/sorting';
import { isValidDate } from './utils/dates';

interface WorkingJsonItem {
  "Game Name": string;
  "Version": string;
  "Size": number;
}

interface WorkingJson {
  [key: string]: WorkingJsonItem;
}

export default function App() {
  const { isDark, setDarkMode, itemsPerPage, lastActiveTab, setLastActiveTab } = useUserPreferences();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { 
    nameQuery, 
    setNameQuery, 
    tidQuery, 
    setTidQuery, 
    results, 
    sortField, 
    sortDirection, 
    toggleSort 
  } = useSearch(items);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        logger.info('Starting data load');

        const [workingResponse, titlesResponse, workingJsonResponse] = await Promise.all([
          fetch('https://raw.githubusercontent.com/ghost-land/NX-Missing/refs/heads/main/data/working.txt'),
          fetch('https://raw.githubusercontent.com/ghost-land/NX-Missing/refs/heads/main/data/titles_db.txt'),
          fetch('https://raw.githubusercontent.com/ghost-land/NX-Missing/refs/heads/main/data/working.json')
        ]);

        const [workingText, titlesText] = await Promise.all([
          workingResponse.text(),
          titlesResponse.text()
        ]);

        const workingJson: WorkingJson = await workingJsonResponse.json();

        // Process titles database
        const titlesMap = new Map(titlesText.trim().split('\n').map(line => {
          const [id, date, name, size] = line.split('|');
          return [id, { date, name, size: parseInt(size) }];
        }));

        // Process all items from working.txt
        const processedItems = new Map<string, ContentItem>();

        workingText.trim().split('\n').forEach(line => {
          const [id, version] = line.split('|');
          const type = id.endsWith('800') ? 'update' as const : 
                      id.endsWith('000') ? 'base' as const : 'dlc' as const;
          
          const uniqueId = `${id}_${version || '0'}`;
          const titleInfo = titlesMap.get(id);
          const jsonInfo = workingJson[id];

          if (!processedItems.has(uniqueId)) {
            processedItems.set(uniqueId, {
              id,
              uniqueId,
              type,
              version: version || jsonInfo?.Version,
              name: jsonInfo?.["Game Name"] || titleInfo?.name || 'Unknown Title',
              size: titleInfo?.size || jsonInfo?.Size,
              releaseDate: type === 'base' ? titleInfo?.date : undefined
            });
          }
        });

        const sortedItems = sortByReleaseDate(Array.from(processedItems.values()));
        setItems(sortedItems);
        
        setLoading(false);
        logger.info('Data load complete', { 
          totalItems: sortedItems.length,
          baseCount: sortedItems.filter(item => item.type === 'base').length,
          updateCount: sortedItems.filter(item => item.type === 'update').length,
          dlcCount: sortedItems.filter(item => item.type === 'dlc').length,
          withDatesCount: sortedItems.filter(item => isValidDate(item.releaseDate)).length,
          withoutDatesCount: sortedItems.filter(item => !isValidDate(item.releaseDate)).length
        });
      } catch (error) {
        logger.error('Failed to load content data', { 
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        });
        setLoading(false);
        throw new Error('Failed to load content data');
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading games...</p>
        </div>
      </div>
    );
  }

  const filteredItems = results.filter(item => item.type === lastActiveTab);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const counts = {
    base: items.filter(item => item.type === 'base').length,
    update: items.filter(item => item.type === 'update').length,
    dlc: items.filter(item => item.type === 'dlc').length
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onToggleTheme={() => setDarkMode(!isDark)} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="w-full rounded-lg p-4 border bg-card border-border text-foreground select-none">
            <h3 className="text-sm font-medium text-muted-foreground">Base Games</h3>
            <p className="mt-2 text-3xl font-bold">
              {counts.base.toLocaleString()}
            </p>
          </div>
          <div className="w-full rounded-lg p-4 border bg-card border-border text-foreground select-none">
            <h3 className="text-sm font-medium text-muted-foreground">Updates</h3>
            <p className="mt-2 text-3xl font-bold">
              {counts.update.toLocaleString()}
            </p>
          </div>
          <div className="w-full rounded-lg p-4 border bg-card border-border text-foreground select-none">
            <h3 className="text-sm font-medium text-muted-foreground">DLCs</h3>
            <p className="mt-2 text-3xl font-bold">
              {counts.dlc.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <SearchBar 
            nameQuery={nameQuery}
            tidQuery={tidQuery}
            onNameChange={setNameQuery}
            onTidChange={setTidQuery}
            resultCount={filteredItems.length}
            totalCount={items.filter(item => item.type === lastActiveTab).length}
          />

          <TabNavigation
            activeTab={lastActiveTab}
            onTabChange={setLastActiveTab}
            counts={counts}
          />

          <ContentTable
            items={paginatedItems}
            allItems={items}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={toggleSort}
          />
        </div>
      </main>
    </div>
  );
}