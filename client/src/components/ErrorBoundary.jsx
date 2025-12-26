import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './ui/Button';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error to console
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        this.setState({
            error,
            errorInfo
        });

        // You can also log to an error reporting service here
        // Example: logErrorToService(error, errorInfo);
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-secondary)] px-4">
                    <div className="max-w-md w-full">
                        <div className="bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border-primary)] p-8 text-center">
                            {/* Error Icon */}
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                                <AlertTriangle className="w-8 h-8 text-red-500" />
                            </div>

                            {/* Error Message */}
                            <h2 className="heading-3 mb-2">Something went wrong</h2>
                            <p className="body text-[var(--color-text-secondary)] mb-6">
                                We encountered an unexpected error. Please try refreshing the page.
                            </p>

                            {/* Error Details (Development Only) */}
                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <div className="mb-6 p-4 bg-[var(--color-bg-tertiary)] rounded-lg text-left">
                                    <p className="body-small font-mono text-red-400 mb-2">
                                        {this.state.error.toString()}
                                    </p>
                                    {this.state.errorInfo && (
                                        <details className="body-small font-mono text-[var(--color-text-tertiary)]">
                                            <summary className="cursor-pointer hover:text-[var(--color-text-secondary)]">
                                                Stack trace
                                            </summary>
                                            <pre className="mt-2 overflow-auto text-xs">
                                                {this.state.errorInfo.componentStack}
                                            </pre>
                                        </details>
                                    )}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3 justify-center">
                                <Button
                                    onClick={() => window.location.reload()}
                                    icon={RefreshCw}
                                    variant="primary"
                                >
                                    Refresh Page
                                </Button>
                                <Button
                                    onClick={this.handleReset}
                                    variant="secondary"
                                >
                                    Try Again
                                </Button>
                            </div>

                            {/* Help Text */}
                            <p className="body-small text-[var(--color-text-tertiary)] mt-6">
                                If this problem persists, please contact support.
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
