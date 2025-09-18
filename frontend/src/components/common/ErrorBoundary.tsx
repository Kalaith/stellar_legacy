// components/common/ErrorBoundary.tsx
import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import Logger from '../../utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    Logger.error('Error caught by ErrorBoundary', { error: error.message, stack: error.stack, componentStack: errorInfo.componentStack });
    // Send to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-6 bg-black text-red-400 rounded-lg border border-red-400">
          <h2 className="text-xl font-bold mb-4">Something went wrong</h2>
          <p className="mb-4">The application encountered an error. Please refresh the page.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-black hover:bg-black border border-red-400 hover:border-red-300 rounded text-red-400 hover:text-red-300 font-medium font-mono"
          >
            Refresh Page
          </button>
          {import.meta.env.DEV && this.state.error && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm">Error Details (Development)</summary>
              <pre className="mt-2 p-2 bg-black border border-red-400 rounded text-xs overflow-auto font-mono">
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;