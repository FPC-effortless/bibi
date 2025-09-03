'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home, MessageCircle } from 'lucide-react'
import Link from 'next/link'

export default function InternalServerError() {
  useEffect(() => {
    // Log the 500 error occurrence
    console.error('500 Internal Server Error occurred')
    
    // Report to monitoring service
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: '500_internal_server_error',
        fatal: false,
      })
    }
  }, [])

  const handleRetry = () => {
    window.location.reload()
  }

  const handleReportIssue = () => {
    // Open contact form or support system
    window.open('/contact?issue=server_error', '_blank')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background to-muted/20">
      <div className="text-center max-w-lg">
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <AlertTriangle className="w-10 h-10 text-destructive" />
        </div>
        
        <h1 className="text-3xl font-serif font-semibold text-foreground mb-4">
          Server Error
        </h1>
        
        <p className="text-muted-foreground mb-2">
          We're experiencing technical difficulties on our end.
        </p>
        
        <p className="text-sm text-muted-foreground mb-8">
          Our team has been automatically notified and is working to resolve this issue.
        </p>

        <div className="bg-muted/50 rounded-lg p-6 mb-8">
          <h3 className="font-medium text-foreground mb-3">What you can try:</h3>
          <ul className="text-sm text-muted-foreground space-y-2 text-left">
            <li>• Wait a few minutes and refresh the page</li>
            <li>• Clear your browser cache and cookies</li>
            <li>• Try accessing the page from a different browser</li>
            <li>• Check if other pages on our site are working</li>
          </ul>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={handleRetry} className="gap-2">
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
          
          <Button variant="ghost" onClick={handleReportIssue} className="gap-2">
            <MessageCircle className="w-4 h-4" />
            Report Issue
          </Button>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            Need immediate assistance?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
            <Link 
              href="/contact" 
              className="text-bibiere-gold hover:text-bibiere-burgundy transition-colors"
            >
              Contact Support
            </Link>
            <Link 
              href="/faq" 
              className="text-bibiere-gold hover:text-bibiere-burgundy transition-colors"
            >
              FAQ
            </Link>
            <Link 
              href="/status" 
              className="text-bibiere-gold hover:text-bibiere-burgundy transition-colors"
            >
              System Status
            </Link>
          </div>
        </div>

        <div className="mt-6 text-xs text-muted-foreground">
          Error Code: 500 • {new Date().toISOString()}
        </div>
      </div>
    </div>
  )
}