
import React from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />
      }

      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, resetError }: { error?: Error; resetError: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="w-8 h-8 text-destructive" />
      </div>
      
      <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">
        Something went wrong
      </h2>
      
      <p className="text-muted-foreground mb-6 max-w-md">
        We apologize for the inconvenience. An unexpected error occurred while loading this content.
      </p>
      
      {process.env.NODE_ENV === 'development' && error && (
        <details className="mb-6 p-4 bg-muted rounded-lg text-left max-w-lg">
          <summary className="cursor-pointer font-medium text-sm mb-2">
            Error Details (Development)
          </summary>
          <pre className="text-xs text-muted-foreground overflow-auto">
            {error.message}
            {error.stack && `\n\n${error.stack}`}
          </pre>
        </details>
      )}
      
      <div className="flex gap-3">
        <Button onClick={resetError} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Reload Page
        </Button>
      </div>
    </div>
  )
}

// Specific error boundaries for different sections
export function ProductErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={({ error, resetError }) => (
        <div className="flex flex-col items-center justify-center p-8 text-center border border-border rounded-xl">
          <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <h3 className="font-medium text-foreground mb-2">Product Loading Error</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Unable to load product information
          </p>
          <Button size="sm" onClick={resetError}>
            Retry
          </Button>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  )
}

export function CartErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={({ resetError }) => (
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <AlertTriangle className="w-8 h-8 text-destructive mb-3" />
          <h3 className="font-medium text-foreground mb-2">Cart Error</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Unable to load cart contents
          </p>
          <Button size="sm" onClick={resetError}>
            Retry
          </Button>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  )
}

export default ErrorBoundary