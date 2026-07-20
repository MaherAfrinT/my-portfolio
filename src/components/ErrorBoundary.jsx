import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4 text-white">
          <div className="mx-auto w-full max-w-2xl rounded-2xl border border-red-500/20 bg-red-500/10 p-8 shadow-2xl backdrop-blur-sm">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h1 className="mb-4 text-3xl font-bold text-red-400">Something went wrong</h1>
            <p className="mb-8 text-slate-300">
              An unexpected error occurred in the application. Try refreshing the page.
            </p>
            <div className="mb-8 overflow-auto rounded-xl bg-black/50 p-4 font-mono text-sm text-red-300/80">
              <p className="font-semibold text-red-400">{this.state.error && this.state.error.toString()}</p>
              <pre className="mt-2 whitespace-pre-wrap text-xs opacity-75">
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="rounded-full bg-red-500 px-8 py-3 font-medium text-white transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
