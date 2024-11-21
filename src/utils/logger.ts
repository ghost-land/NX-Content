export type LogLevel = 'info' | 'warn' | 'error';

export interface LogDetails {
  [key: string]: string | number | boolean | null | undefined;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  details?: LogDetails;
}

class Logger {
  private logs: LogEntry[] = [];
  private readonly maxLogs = 1000;

  private createEntry(level: LogLevel, message: string, details?: LogDetails): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      details,
    };
  }

  private addLog(entry: LogEntry) {
    this.logs.unshift(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }
    
    const style = `color: ${
      entry.level === 'error' ? 'red' : 
      entry.level === 'warn' ? 'orange' : 
      'blue'
    }; font-weight: bold;`;
    
    console.groupCollapsed(`%c${entry.level.toUpperCase()}: ${entry.message}`, style);
    console.log('Timestamp:', entry.timestamp);
    if (entry.details) console.log('Details:', entry.details);
    console.groupEnd();
  }

  info(message: string, details?: LogDetails) {
    this.addLog(this.createEntry('info', message, details));
  }

  warn(message: string, details?: LogDetails) {
    this.addLog(this.createEntry('warn', message, details));
  }

  error(message: string, details?: LogDetails) {
    this.addLog(this.createEntry('error', message, details));
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  getErrorLogs(): LogEntry[] {
    return this.logs.filter(log => log.level === 'error');
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = new Logger();