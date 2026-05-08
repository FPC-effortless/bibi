'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        
        <h1 className="text-2xl font-serif font-semibold text-foreground mb-3">
          Something went wrong
        </h1>
        
        <p className="text-muted-foreground mb-6">
          We apologize for the inconvenience. An unexpected error occurred.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <details className="mb-6 p-4 bg-muted rounded-lg text-left">
            <summary className="cursor-pointer font-medium text-sm mb-2">
              Error Details (Development)
            </summary>
            <pre className="text-xs text-muted-foreground overflow-auto whitespace-pre-wrap">
              {error.message}
              {error.digest && `\nError ID: ${error.digest}`}
            </pre>
          </details>
        )}

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={reset} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
            <Button variant="outline" asChild>
              <Link href="/" className="gap-2">
                <Home className="w-4 h-4" />
                Go Home
              </Link>
            </Button>
          </div>
          
          <Button variant="ghost" onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            If this problem persists, please{' '}
            <Link href="/contact" className="text-bibiere-gold hover:text-bibiere-burgundy transition-colors">
              contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}