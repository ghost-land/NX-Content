import { useEffect, useState } from 'react';
import { ContentItem } from './types';
import { ContentTable } from './components/ContentTable';
import { TabNavigation } from './components/TabNavigation';
import { StatsCard } from './components/StatsCard';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { logger } from './utils/logger';
import { useSearch } from './hooks/useSearch';
import { useUserPreferences } from './store/userPreferences';

interface WorkingJsonItem {
  "Game Name": string;
  "Version": string;
  "Size": number;
}

interface WorkingJson {
  [key: string]: WorkingJsonItem;
}

interface VersionsJson {
  [titleId: string]: {
    [version: string]: string;
  };
}

function parseDate(dateStr: string | undefined): number {
  if (!dateStr) return 0;
  try {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? 0 : date.getTime();
  } catch {
    return 0;
  }
}

function getUpdateReleaseDate(titleId: string, version: string, versionsJson: VersionsJson): string | undefined {
  const baseId = titleId.slice(0, -3) + '000';
  const versionInfo = versionsJson[baseId];
  
  if (versionInfo) {
    const versionParts = version.split('.').map(Number);
    let versionNumber = 65536;
    
    if (versionParts.length >= 3) {
      versionNumber = versionParts[0] * 65536 + versionParts[1] * 256 + versionParts[2];
    }
    
    return versionInfo[versionNumber.toString()];
  }
  
  return undefined;
}

function processUpdates(baseId: string, versionsJson: VersionsJson): ContentItem[] {
  const updates: ContentItem[] = [];
  const versionInfo = versionsJson[baseId];
  
  if (versionInfo) {
    const updateId = baseId.slice(0, -3) + '800';
    
    Object.entries(versionInfo).forEach(([versionNumber, releaseDate]) => {
      const version = parseInt(versionNumber);
      const major = Math.floor(version / 65536);
      const minor = Math.floor((version % 65536) / 256);
      const patch = version % 256;
      
      updates.push({
        id: updateId,
        uniqueId: `${updateId}_${version}`,
        type: 'update',
        version: `${major}.${minor}.${patch}`,
        releaseDate,
        name: undefined,
        size: undefined
      });
    });
  }
  
  return updates;
}

function sortByReleaseDate(items: ContentItem[]): ContentItem[] {
  return [...items].sort((a, b) => {
    const dateA = parseDate(a.releaseDate);
    const dateB = parseDate(b.releaseDate);

    // Always put items without dates at the end
    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;

    // Sort by date
    if (dateA !== dateB) {
      return dateB - dateA; // Descending order
    }

    // If dates are equal, sort by name as secondary criteria
    const nameA = a.name || 'Unknown Title';
    const nameB = b.name || 'Unknown Title';
    return nameA.localeCompare(nameB);
  });
}

export default function App() {
  const { isDark, setDarkMode, itemsPerPage, lastActiveTab, setLastActiveTab, dataSources } = useUserPreferences();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { query, setQuery, results, sortField, sortDirection, toggleSort } = useSearch(items);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        logger.info('Starting data load');

        // Fetch all data sources in parallel
        const [workingResponse, titlesResponse, workingJsonResponse, versionsResponse] = await Promise.all([
          fetch(dataSources.workingContent),
          fetch(dataSources.titlesDb),
          fetch('https://raw.githubusercontent.com/ghost-land/NX-Missing/refs/heads/main/data/working.json'),
          fetch('https://raw.githubusercontent.com/blawar/titledb/refs/heads/master/versions.json')
        ]);

        const [workingText, titlesText] = await Promise.all([
          workingResponse.text(),
          titlesResponse.text()
        ]);

        const [workingJson, versionsJson]: [WorkingJson, VersionsJson] = await Promise.all([
          workingJsonResponse.json(),
          versionsResponse.json()
        ]);

        // Process titles database
        const titlesMap = new Map(titlesText.trim().split('\n').map(line => {
          const [id, date, name, size] = line.split('|');
          return [id, { date, name, size: parseInt(size) }];
        }));

        // Process working content
        const processedItems = new Map<string, ContentItem>();
        const baseTitleIds = new Set<string>();

        // First pass: collect base title IDs and process working.txt entries
        workingText.trim().split('\n').forEach(line => {
          const [id] = line.split('|');
          if (id.endsWith('000')) {
            baseTitleIds.add(id);
          }
        });

        // Second pass: process all content including updates from versions.json
        workingText.trim().split('\n').forEach(line => {
          const [id, version] = line.split('|');
          const type = id.endsWith('800') ? 'update' as const : 
                      id.endsWith('000') ? 'base' as const : 'dlc' as const;
          
          const uniqueId = `${id}_${version || '0'}`;
          const titleInfo = titlesMap.get(id);
          const jsonInfo = workingJson[id];

          // Get release date based on content type
          let releaseDate = titleInfo?.date;
          if (type === 'update' && version) {
            releaseDate = getUpdateReleaseDate(id, version, versionsJson) || releaseDate;
          }
          
          if (!processedItems.has(uniqueId)) {
            processedItems.set(uniqueId, {
              id,
              uniqueId,
              type,
              version: version || jsonInfo?.Version,
              name: titleInfo?.name || jsonInfo?.["Game Name"] || 'Unknown Title',
              size: titleInfo?.size || jsonInfo?.Size,
              releaseDate
            });
          }
        });

        // Add all updates from versions.json
        baseTitleIds.forEach(baseId => {
          const updates = processUpdates(baseId, versionsJson);
          updates.forEach(update => {
            if (!processedItems.has(update.uniqueId)) {
              processedItems.set(update.uniqueId, update);
            }
          });
        });

        // Convert to array and sort by release date
        const sortedItems = sortByReleaseDate(Array.from(processedItems.values()));
        setItems(sortedItems);
        
        setLoading(false);
        logger.info('Data load complete', { 
          totalItems: sortedItems.length,
          baseCount: sortedItems.filter(item => item.type === 'base').length,
          updateCount: sortedItems.filter(item => item.type === 'update').length,
          dlcCount: sortedItems.filter(item => item.type === 'dlc').length,
          withDatesCount: sortedItems.filter(item => item.releaseDate).length,
          withoutDatesCount: sortedItems.filter(item => !item.releaseDate).length
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
  }, [dataSources]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading games...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onToggleTheme={() => setDarkMode(!isDark)} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatsCard
            title="Base Games"
            count={counts.base}
            isActive={lastActiveTab === 'base'}
            onClick={() => setLastActiveTab('base')}
          />
          <StatsCard
            title="Updates"
            count={counts.update}
            isActive={lastActiveTab === 'update'}
            onClick={() => setLastActiveTab('update')}
          />
          <StatsCard
            title="DLCs"
            count={counts.dlc}
            isActive={lastActiveTab === 'dlc'}
            onClick={() => setLastActiveTab('dlc')}
          />
        </div>

        <div className="space-y-4">
          <SearchBar 
            value={query} 
            onChange={setQuery}
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