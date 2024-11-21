import { useState } from 'react';
import { Settings as SettingsIcon, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useUserPreferences } from '../store/userPreferences';

interface SettingsProps {
  onClose: () => void;
}

export function Settings({ onClose }: SettingsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { 
    itemsPerPage, 
    setItemsPerPage,
    searchPrecision, 
    setSearchPrecision,
    showLogs,
    setShowLogs,
    showVersionHistory,
    setShowVersionHistory,
    autoRefreshInterval,
    setAutoRefreshInterval,
    maxDlcDisplay,
    setMaxDlcDisplay,
    maxUpdateDisplay,
    setMaxUpdateDisplay,
    dataSources,
    setDataSource,
    resetDataSources
  } = useUserPreferences();

  const handlePrecisionChange = (value: string) => {
    setSearchPrecision(parseFloat(value));
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full border border-border">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <SettingsIcon className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
            aria-label="Close settings"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Display Settings */}
          <section className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Display Settings</h3>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Items per page
              </label>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="w-full bg-muted border border-border rounded-lg px-3 py-2 hover:border-primary/50 transition-colors"
              >
                <option value={10}>10 items</option>
                <option value={25}>25 items</option>
                <option value={50}>50 items</option>
                <option value={100}>100 items</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Maximum DLCs to display
              </label>
              <select
                value={maxDlcDisplay}
                onChange={(e) => setMaxDlcDisplay(Number(e.target.value))}
                className="w-full bg-muted border border-border rounded-lg px-3 py-2 hover:border-primary/50 transition-colors"
              >
                <option value={5}>5 DLCs</option>
                <option value={10}>10 DLCs</option>
                <option value={15}>15 DLCs</option>
                <option value={20}>20 DLCs</option>
                <option value={-1}>Show All</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Maximum Updates to display
              </label>
              <select
                value={maxUpdateDisplay}
                onChange={(e) => setMaxUpdateDisplay(Number(e.target.value))}
                className="w-full bg-muted border border-border rounded-lg px-3 py-2 hover:border-primary/50 transition-colors"
              >
                <option value={5}>5 Updates</option>
                <option value={10}>10 Updates</option>
                <option value={15}>15 Updates</option>
                <option value={20}>20 Updates</option>
                <option value={-1}>Show All</option>
              </select>
            </div>
          </section>

          {/* Search Settings */}
          <section className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Search Settings</h3>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Search Precision
              </label>
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.1"
                value={searchPrecision}
                onChange={(e) => handlePrecisionChange(e.target.value)}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>Exact Match</span>
                <span>Fuzzy Match</span>
              </div>
              <div className="mt-2 p-3 bg-muted rounded-lg text-sm">
                {searchPrecision <= 0.3 ? (
                  "High precision: Requires almost exact matches"
                ) : searchPrecision <= 0.6 ? (
                  "Medium precision: Allows some typos and variations"
                ) : (
                  "Low precision: Very forgiving, finds similar matches"
                )}
              </div>
            </div>
          </section>

          {/* Feature Toggles */}
          <section className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Features</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  Show Debug Logs
                </label>
                <button
                  onClick={() => setShowLogs(!showLogs)}
                  className={`
                    relative inline-flex h-6 w-11 items-center rounded-full
                    transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                    ${showLogs ? 'bg-primary' : 'bg-muted'}
                  `}
                >
                  <span
                    className={`
                      inline-block h-4 w-4 transform rounded-full bg-white shadow-lg
                      transition-transform duration-200
                      ${showLogs ? 'translate-x-6' : 'translate-x-1'}
                    `}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  Show Version History
                </label>
                <button
                  onClick={() => setShowVersionHistory(!showVersionHistory)}
                  className={`
                    relative inline-flex h-6 w-11 items-center rounded-full
                    transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                    ${showVersionHistory ? 'bg-primary' : 'bg-muted'}
                  `}
                >
                  <span
                    className={`
                      inline-block h-4 w-4 transform rounded-full bg-white shadow-lg
                      transition-transform duration-200
                      ${showVersionHistory ? 'translate-x-6' : 'translate-x-1'}
                    `}
                  />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Auto Refresh Interval
                </label>
                <select
                  value={autoRefreshInterval || ''}
                  onChange={(e) => setAutoRefreshInterval(e.target.value ? Number(e.target.value) : null)}
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2 hover:border-primary/50 transition-colors"
                >
                  <option value="">Disabled</option>
                  <option value="300000">5 minutes</option>
                  <option value="600000">10 minutes</option>
                  <option value="1800000">30 minutes</option>
                  <option value="3600000">1 hour</option>
                </select>
              </div>
            </div>
          </section>

          {/* Advanced Settings */}
          <section className="border-t border-border pt-4">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full text-sm font-medium p-2 hover:bg-muted rounded-lg transition-colors"
            >
              Advanced Settings
              {showAdvanced ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {showAdvanced && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Working Content URL
                  </label>
                  <input
                    type="url"
                    value={dataSources.workingContent}
                    onChange={(e) => setDataSource('workingContent', e.target.value)}
                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm hover:border-primary/50 transition-colors"
                    placeholder="Enter URL for working.txt"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Titles Database URL
                  </label>
                  <input
                    type="url"
                    value={dataSources.titlesDb}
                    onChange={(e) => setDataSource('titlesDb', e.target.value)}
                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm hover:border-primary/50 transition-colors"
                    placeholder="Enter URL for titles_db.txt"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={resetDataSources}
                    className="px-4 py-2 text-sm bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    Reset to Defaults
                  </button>
                </div>

                <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">
                  <p className="font-medium mb-2">⚠️ Warning</p>
                  <p>
                    Modifying these URLs may affect the application's functionality.
                    Only change them if you know what you're doing.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}