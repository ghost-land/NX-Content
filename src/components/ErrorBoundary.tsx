import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary component that catches JavaScript errors in child components
 * Displays a fallback UI when errors occur instead of crashing the entire app
 * 
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  /**
   * Static method called when an error occurs in a child component
   * Updates state to indicate an error has occurred
   */
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  /**
   * Lifecycle method called after an error has been thrown
   * Logs error information for debugging purposes
   */
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  /**
   * Renders either the children components or the error fallback UI
   */
  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="card-glass p-6 max-w-lg w-full text-center space-y-4">
            <h2 className="text-xl font-semibold text-red-400">Something went wrong</h2>
            <p className="text-white/70">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-orange"
            >
              <div>Reload Page</div>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}