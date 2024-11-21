import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useUserPreferences } from '../store/userPreferences';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    const { resetDataSources } = useUserPreferences.getState();
    resetDataSources();
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      const isDataLoadError = this.state.error?.message?.includes('Failed to load game data');

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="bg-card p-6 rounded-lg shadow-lg border border-border max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <h2 className="text-lg font-semibold">Something went wrong</h2>
            </div>
            
            <p className="text-muted-foreground mb-6">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>

            <div className="flex flex-col space-y-3">
              {isDataLoadError && (
                <button
                  className="w-full flex items-center justify-center space-x-2 bg-red-500/10 text-red-500 px-4 py-2 rounded-lg hover:bg-red-500/20 transition-colors"
                  onClick={this.handleReset}
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Reset Data Sources & Reload</span>
                </button>
              )}

              <button
                className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </button>
            </div>

            {isDataLoadError && (
              <div className="mt-4 p-3 bg-muted rounded-lg text-sm text-muted-foreground">
                <p className="font-medium mb-1">💡 Tip</p>
                <p>
                  If you've modified the data source URLs in settings, try resetting them to their default values.
                  This often resolves loading issues.
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}