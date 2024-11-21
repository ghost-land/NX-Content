import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserPreferences {
  isDark: boolean;
  itemsPerPage: number;
  lastActiveTab: 'base' | 'update' | 'dlc';
  namePrecision: number;
  tidPrecision: number;
  showLogs: boolean;
  showVersionHistory: boolean;
  autoRefreshInterval: number | null;
  maxDlcDisplay: number;
  maxUpdateDisplay: number;
  dataSources: {
    workingContent: string;
    titlesDb: string;
  };
  setDarkMode: (isDark: boolean) => void;
  setItemsPerPage: (count: number) => void;
  setLastActiveTab: (tab: 'base' | 'update' | 'dlc') => void;
  setNamePrecision: (precision: number) => void;
  setTidPrecision: (precision: number) => void;
  setShowLogs: (show: boolean) => void;
  setShowVersionHistory: (show: boolean) => void;
  setAutoRefreshInterval: (interval: number | null) => void;
  setMaxDlcDisplay: (count: number) => void;
  setMaxUpdateDisplay: (count: number) => void;
  setDataSource: (key: 'workingContent' | 'titlesDb', url: string) => void;
  resetDataSources: () => void;
}

const DEFAULT_DATA_SOURCES = {
  workingContent: 'https://raw.githubusercontent.com/ghost-land/NX-Missing/refs/heads/main/data/working.txt',
  titlesDb: 'https://raw.githubusercontent.com/ghost-land/NX-Missing/refs/heads/main/data/titles_db.txt'
};

export const useUserPreferences = create<UserPreferences>()(
  persist(
    (set) => ({
      isDark: window.matchMedia('(prefers-color-scheme: dark)').matches,
      itemsPerPage: 25,
      lastActiveTab: 'base',
      namePrecision: 0.7, // Higher precision for name search
      tidPrecision: 0.1, // Exact match for TID search
      showLogs: true, // Show logs by default
      showVersionHistory: true,
      autoRefreshInterval: null,
      maxDlcDisplay: 5,
      maxUpdateDisplay: 5,
      dataSources: DEFAULT_DATA_SOURCES,
      setDarkMode: (isDark) => set({ isDark }),
      setItemsPerPage: (itemsPerPage) => set({ itemsPerPage }),
      setLastActiveTab: (lastActiveTab) => set({ lastActiveTab }),
      setNamePrecision: (namePrecision) => set({ namePrecision }),
      setTidPrecision: (tidPrecision) => set({ tidPrecision }),
      setShowLogs: (showLogs) => set({ showLogs }),
      setShowVersionHistory: (showVersionHistory) => set({ showVersionHistory }),
      setAutoRefreshInterval: (autoRefreshInterval) => set({ autoRefreshInterval }),
      setMaxDlcDisplay: (maxDlcDisplay) => set({ maxDlcDisplay }),
      setMaxUpdateDisplay: (maxUpdateDisplay) => set({ maxUpdateDisplay }),
      setDataSource: (key, url) => set(state => ({
        dataSources: { ...state.dataSources, [key]: url }
      })),
      resetDataSources: () => set({ dataSources: DEFAULT_DATA_SOURCES }),
    }),
    {
      name: 'nx-working-preferences',
      version: 4,
      migrate: (persistedState: any, version: number) => {
        if (version < 4) {
          return {
            ...persistedState,
            tidPrecision: 0.1,
            namePrecision: 0.7,
            showLogs: true
          };
        }
        return persistedState;
      }
    }
  )
);