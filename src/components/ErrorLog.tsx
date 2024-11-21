import { useState, type ReactNode } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { logger, type LogEntry, type LogDetails } from '../utils/logger';

interface ErrorLogProps {
  onClose: () => void;
}

function formatLogDetails(details: LogDetails): ReactNode {
  try {
    return (
      <pre className="whitespace-pre-wrap font-mono text-xs bg-black/10 p-2 rounded">
        {JSON.stringify(details, null, 2)}
      </pre>
    );
  } catch {
    return (
      <pre className="whitespace-pre-wrap font-mono text-xs bg-black/10 p-2 rounded text-red-500">
        [Error formatting details]
      </pre>
    );
  }
}

export function ErrorLog({ onClose }: ErrorLogProps) {
  const [filter, setFilter] = useState<'all' | 'error'>('error');
  const logs = filter === 'all' ? logger.getLogs() : logger.getErrorLogs();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-border">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Application Logs</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 border-b border-border">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'error')}
            className="bg-muted border border-border rounded-lg px-3 py-1.5 text-foreground hover:border-primary/50 transition-colors"
          >
            <option value="all">All Logs</option>
            <option value="error">Errors Only</option>
          </select>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {logs.length === 0 ? (
            <p className="text-muted-foreground text-center">No logs to display</p>
          ) : (
            <div className="space-y-4">
              {logs.map((log: LogEntry, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    log.level === 'error'
                      ? 'bg-red-500/10 border-red-500/20 text-red-500'
                      : log.level === 'warn'
                      ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'
                      : 'bg-blue-500/10 border-blue-500/20 text-blue-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      {log.level.toUpperCase()}
                    </span>
                    <span className="text-sm opacity-75">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="mb-2">{log.message}</p>
                  {log.details && formatLogDetails(log.details)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}