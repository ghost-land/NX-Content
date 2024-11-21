import { useState, type ReactNode } from 'react';
import { AlertTriangle, X, FileText, AlertCircle, Info } from 'lucide-react';
import { logger, type LogEntry, type LogDetails, type LogLevel } from '../utils/logger';

interface ErrorLogProps {
  onClose: () => void;
}

function LogIcon({ level }: { level: LogLevel }) {
  switch (level) {
    case 'error':
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case 'warn':
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    default:
      return <Info className="h-4 w-4 text-blue-500" />;
  }
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
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                const text = logs
                  .map(log => `[${log.timestamp}] ${log.level.toUpperCase()}: ${log.message}${
                    log.details ? '\nDetails: ' + JSON.stringify(log.details, null, 2) : ''
                  }`)
                  .join('\n\n');
                
                const blob = new Blob([text], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `nx-working-logs-${new Date().toISOString()}.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <FileText className="h-4 w-4" />
              <span>Export Logs</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-4 border-b border-border flex items-center justify-between">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'error')}
            className="bg-muted border border-border rounded-lg px-3 py-1.5 text-foreground hover:border-primary/50 transition-colors"
          >
            <option value="all">All Logs ({logger.getLogs().length})</option>
            <option value="error">Errors Only ({logger.getErrorLogs().length})</option>
          </select>

          <button
            onClick={() => {
              logger.clearLogs();
              onClose();
            }}
            className="px-3 py-1.5 text-sm text-red-500 hover:text-red-600 transition-colors"
          >
            Clear All Logs
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <FileText className="h-12 w-12 mb-4 opacity-50" />
              <p>No logs to display</p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log: LogEntry, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    log.level === 'error'
                      ? 'bg-red-500/10 border-red-500/20'
                      : log.level === 'warn'
                      ? 'bg-yellow-500/10 border-yellow-500/20'
                      : 'bg-blue-500/10 border-blue-500/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <LogIcon level={log.level} />
                      <span className="text-sm font-medium">
                        {log.level.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="mb-2 text-foreground">{log.message}</p>
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