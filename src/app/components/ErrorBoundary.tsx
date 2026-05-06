import React, { Component, ReactNode } from 'react';
import { AlertCircle, Home, ArrowLeft, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleGoBack = () => {
    window.history.back();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <div className="bg-white rounded-lg shadow-lg border border-red-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-8 text-white">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Oops! Something went wrong</h1>
                    <p className="text-red-100 text-sm mt-1">
                      Don't worry, we've got you covered
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-6">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">What happened?</h2>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    An unexpected error occurred while processing your request. This might be due to:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-600 ml-2">
                    <li>Navigation to an invalid page or resource</li>
                    <li>A temporary system issue</li>
                    <li>Missing or incorrect data</li>
                    <li>Browser compatibility issues</li>
                  </ul>
                </div>

                {/* Error Details (Collapsible) */}
                {this.state.error && (
                  <details className="mb-6">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 mb-2">
                      Technical Details (for developers)
                    </summary>
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-xs font-mono text-gray-800 mb-2 break-words">
                        <strong>Error:</strong> {this.state.error.toString()}
                      </div>
                      {this.state.errorInfo && (
                        <div className="text-xs font-mono text-gray-600 max-h-40 overflow-y-auto">
                          <strong>Stack Trace:</strong>
                          <pre className="mt-1 whitespace-pre-wrap">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                )}

                {/* Action Buttons */}
                <div className="border-t border-gray-200 pt-6">
                  <p className="text-sm font-medium text-gray-900 mb-4">
                    What would you like to do?
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={this.handleGoBack}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Go Back
                    </button>
                    <button
                      onClick={this.handleReload}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Reload Page
                    </button>
                    <button
                      onClick={this.handleGoHome}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
                    >
                      <Home className="w-4 h-4" />
                      Go Home
                    </button>
                  </div>
                </div>

                {/* Help Text */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>💡 Pro Tip:</strong> If this error persists, try clearing your browser cache or 
                    contact support with the technical details above.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Error Dialog Component for runtime errors
interface ErrorDialogProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
  onNavigateBack?: () => void;
  onNavigateHome?: () => void;
}

export function ErrorDialog({
  isOpen,
  title = 'Error',
  message = 'An unexpected error occurred',
  onClose,
  onNavigateBack,
  onNavigateHome,
}: ErrorDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <p className="text-gray-700 text-sm leading-relaxed mb-6">{message}</p>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            {onNavigateBack && (
              <button
                onClick={onNavigateBack}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </button>
            )}
            {onNavigateHome && (
              <button
                onClick={onNavigateHome}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
              >
                <Home className="w-4 h-4" />
                Go to Dashboard
              </button>
            )}
            <button
              onClick={onClose}
              className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
