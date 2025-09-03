import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-6xl font-serif font-bold text-bibiere-burgundy mb-4">404</h1>
          <h2 className="text-2xl font-serif font-semibold text-foreground mb-3">
            Page Not Found
          </h2>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link href="/" className="gap-2">
                <Home className="w-4 h-4" />
                Go Home
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/search" className="gap-2">
                <Search className="w-4 h-4" />
                Search Products
              </Link>
            </Button>
          </div>
          
          <Button variant="ghost" onClick={() => window.history.back()} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            Popular pages:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link href="/collections" className="text-sm text-bibiere-gold hover:text-bibiere-burgundy transition-colors">
              Collections
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/account" className="text-sm text-bibiere-gold hover:text-bibiere-burgundy transition-colors">
              My Account
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/contact" className="text-sm text-bibiere-gold hover:text-bibiere-burgundy transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}