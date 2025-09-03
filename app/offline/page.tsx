'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { WifiOff, RefreshCw, Bookmark, Clock, Search } from 'lucide-react'
import Link from 'next/link'

interface CachedContent {
  recentlyViewed: Array<{
    id: string
    name: string
    price: string
    image: string
    url: string
  }>
  savedItems: Array<{
    id: string
    name: string
    price: string
    image: string
    url: string
  }>
  cachedPages: Array<{
    title: string
    url: string
    lastVisited: string
  }>
}

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true)
  const [cachedContent, setCachedContent] = useState<CachedContent>({
    recentlyViewed: [],
    savedItems: [],
    cachedPages: []
  })

  useEffect(() => {
    // Check online status
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Load cached content from localStorage or service worker
    loadCachedContent()

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const loadCachedContent = () => {
    try {
      // Load from localStorage (this would typically come from service worker cache)
      const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
      const savedItems = JSON.parse(localStorage.getItem('wishlist') || '[]')
      const cachedPages = JSON.parse(localStorage.getItem('cachedPages') || '[]')

      setCachedContent({
        recentlyViewed: recentlyViewed.slice(0, 6),
        savedItems: savedItems.slice(0, 6),
        cachedPages: cachedPages.slice(0, 8)
      })
    } catch (error) {
      console.error('Error loading cached content:', error)
    }
  }

  const handleRetryConnection = () => {
    if (navigator.onLine) {
      window.location.reload()
    } else {
      // Attempt to check connectivity
      fetch('/api/health', { method: 'HEAD' })
        .then(() => {
          setIsOnline(true)
          window.location.reload()
        })
        .catch(() => {
          alert('Still offline. Please check your internet connection.')
        })
    }
  }

  if (isOnline) {
    // Redirect to home if back online
    window.location.href = '/'
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <WifiOff className="w-10 h-10 text-muted-foreground" />
          </div>
          
          <h1 className="text-3xl font-serif font-semibold text-foreground mb-4">
            You're Offline
          </h1>
          
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            No internet connection detected. You can still browse your recently viewed items and saved content below.
          </p>

          <Button onClick={handleRetryConnection} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Try to Reconnect
          </Button>
        </div>

        {/* Cached Content Sections */}
        <div className="space-y-12">
          {/* Recently Viewed */}
          {cachedContent.recentlyViewed.length > 0 && (
            <section>
              <h2 className="text-xl font-serif font-semibold text-foreground mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-bibiere-gold" />
                Recently Viewed
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {cachedContent.recentlyViewed.map((item) => (
                  <div key={item.id} className="bg-card border rounded-lg p-4 opacity-75">
                    <div className="aspect-square bg-muted rounded-md mb-3 flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">Cached</span>
                    </div>
                    <h3 className="font-medium text-sm text-foreground mb-1 line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{item.price}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Saved Items */}
          {cachedContent.savedItems.length > 0 && (
            <section>
              <h2 className="text-xl font-serif font-semibold text-foreground mb-6 flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-bibiere-gold" />
                Saved Items
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {cachedContent.savedItems.map((item) => (
                  <div key={item.id} className="bg-card border rounded-lg p-4 opacity-75">
                    <div className="aspect-square bg-muted rounded-md mb-3 flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">Cached</span>
                    </div>
                    <h3 className="font-medium text-sm text-foreground mb-1 line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{item.price}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Cached Pages */}
          {cachedContent.cachedPages.length > 0 && (
            <section>
              <h2 className="text-xl font-serif font-semibold text-foreground mb-6 flex items-center gap-2">
                <Search className="w-5 h-5 text-bibiere-gold" />
                Available Offline
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {cachedContent.cachedPages.map((page, index) => (
                  <Link 
                    key={index}
                    href={page.url}
                    className="bg-card border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <h3 className="font-medium text-foreground mb-2">{page.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      Last visited: {page.lastVisited}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Default Offline Content */}
          <section>
            <h2 className="text-xl font-serif font-semibold text-foreground mb-6">
              Always Available
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link 
                href="/about"
                className="bg-card border rounded-lg p-6 hover:bg-muted/50 transition-colors text-center"
              >
                <h3 className="font-medium text-foreground mb-2">About Bibiere</h3>
                <p className="text-sm text-muted-foreground">Learn about our brand</p>
              </Link>
              
              <Link 
                href="/care-instructions"
                className="bg-card border rounded-lg p-6 hover:bg-muted/50 transition-colors text-center"
              >
                <h3 className="font-medium text-foreground mb-2">Care Instructions</h3>
                <p className="text-sm text-muted-foreground">Garment care guide</p>
              </Link>
              
              <Link 
                href="/size-guide"
                className="bg-card border rounded-lg p-6 hover:bg-muted/50 transition-colors text-center"
              >
                <h3 className="font-medium text-foreground mb-2">Size Guide</h3>
                <p className="text-sm text-muted-foreground">Find your perfect fit</p>
              </Link>
              
              <Link 
                href="/contact"
                className="bg-card border rounded-lg p-6 hover:bg-muted/50 transition-colors text-center"
              >
                <h3 className="font-medium text-foreground mb-2">Contact Info</h3>
                <p className="text-sm text-muted-foreground">Get in touch</p>
              </Link>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Your connection will be restored automatically when internet access returns.
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <button 
              onClick={handleRetryConnection}
              className="text-bibiere-gold hover:text-bibiere-burgundy transition-colors"
            >
              Check Connection
            </button>
            <Link 
              href="/help"
              className="text-bibiere-gold hover:text-bibiere-burgundy transition-colors"
            >
              Help & Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}