import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface DataSources {
  workingContent: string;
  titlesDb: string;
}

interface UserPreferences {
  isDark: boolean;
  itemsPerPage: number;
  lastActiveTab: 'base' | 'update' | 'dlc';
  searchPrecision: number;
  showLogs: boolean;
  showVersionHistory: boolean;
  autoRefreshInterval: number | null;
  maxDlcDisplay: number;
  maxUpdateDisplay: number;
  dataSources: DataSources;
  setDarkMode: (isDark: boolean) => void;
  setItemsPerPage: (count: number) => void;
  setLastActiveTab: (tab: 'base' | 'update' | 'dlc') => void;
  setSearchPrecision: (precision: number) => void;
  setShowLogs: (show: boolean) => void;
  setShowVersionHistory: (show: boolean) => void;
  setAutoRefreshInterval: (interval: number | null) => void;
  setMaxDlcDisplay: (count: number) => void;
  setMaxUpdateDisplay: (count: number) => void;
  setDataSource: (key: keyof DataSources, url: string) => void;
  resetDataSources: () => void;
}

const DEFAULT_DATA_SOURCES: DataSources = {
  workingContent: 'https://raw.githubusercontent.com/ghost-land/NX-Missing/refs/heads/main/data/working.txt',
  titlesDb: 'https://raw.githubusercontent.com/ghost-land/NX-Missing/refs/heads/main/data/titles_db.txt'
};

const initialState = {
  isDark: window.matchMedia('(prefers-color-scheme: dark)').matches,
  itemsPerPage: 25,
  lastActiveTab: 'base' as const,
  searchPrecision: 0.4,
  showLogs: false,
  showVersionHistory: true,
  autoRefreshInterval: null,
  maxDlcDisplay: 5,
  maxUpdateDisplay: 5,
  dataSources: DEFAULT_DATA_SOURCES,
};

export const useUserPreferences = create<UserPreferences>()(
  persist(
    (set) => ({
      ...initialState,
      setDarkMode: (isDark) => set({ isDark }),
      setItemsPerPage: (itemsPerPage) => set({ itemsPerPage }),
      setLastActiveTab: (lastActiveTab) => set({ lastActiveTab }),
      setSearchPrecision: (searchPrecision) => set({ searchPrecision }),
      setShowLogs: (showLogs) => set({ showLogs }),
      setShowVersionHistory: (showVersionHistory) => set({ showVersionHistory }),
      setAutoRefreshInterval: (autoRefreshInterval) => set({ autoRefreshInterval }),
      setMaxDlcDisplay: (maxDlcDisplay) => set({ maxDlcDisplay }),
      setMaxUpdateDisplay: (maxUpdateDisplay) => set({ maxUpdateDisplay }),
      setDataSource: (key, url) => set(state => ({
        dataSources: {
          ...state.dataSources,
          [key]: url
        }
      })),
      resetDataSources: () => set({ dataSources: DEFAULT_DATA_SOURCES }),
    }),
    {
      name: 'nx-working-preferences',
      version: 5,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isDark: state.isDark,
        itemsPerPage: state.itemsPerPage,
        lastActiveTab: state.lastActiveTab,
        searchPrecision: state.searchPrecision,
        showLogs: state.showLogs,
        showVersionHistory: state.showVersionHistory,
        autoRefreshInterval: state.autoRefreshInterval,
        maxDlcDisplay: state.maxDlcDisplay,
        maxUpdateDisplay: state.maxUpdateDisplay,
        dataSources: state.dataSources,
      }),
      migrate: (persistedState: any, version) => {
        if (version < 5) {
          return {
            ...initialState,
            ...persistedState,
            maxDlcDisplay: 5,
            maxUpdateDisplay: 5,
          };
        }
        return persistedState as UserPreferences;
      },
    }
  )
);