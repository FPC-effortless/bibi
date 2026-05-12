import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Instagram, Facebook } from "lucide-react"
import { BrandLogo } from "./brand-logo"
import { Link } from "wouter"

// Pinterest icon component since it's not in lucide-react
const PinterestIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.001 24c6.624 0 11.99-5.373 11.99-12C24 5.372 18.627.001 12.001.001z" />
  </svg>
)

export default function Footer() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Newsletter Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-serif font-semibold text-sidebar-accent">Join the bibiere Circle</h3>
            <p className="text-sm text-sidebar-foreground/80 leading-relaxed">
              Be the first to discover our latest collections, receive exclusive styling insights, and join a community 
              of individuals who appreciate timeless elegance and sophisticated craftsmanship.
            </p>
            <div className="flex gap-2 max-w-md">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="bg-input border-sidebar-border text-foreground placeholder:text-muted-foreground focus:border-sidebar-accent transition-colors duration-200"
              />
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 font-medium transition-all duration-200 hover:shadow-md">
                Subscribe
              </Button>
            </div>
            <p className="text-xs text-sidebar-foreground/60">
              By subscribing, you agree to receive marketing emails from bibiere. Unsubscribe at any time.
            </p>
          </div>

          {/* Links Section */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {/* Shop Links */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-sidebar-accent">Shop</h4>
                <nav className="space-y-2">
                  <Link href="/collections/new-arrivals" className="block text-sidebar-foreground hover:text-sidebar-accent transition-colors duration-200 text-sm">
                    New Arrivals
                  </Link>
                  <Link href="/collections/dresses" className="block text-sidebar-foreground hover:text-sidebar-accent transition-colors duration-200 text-sm">
                    Dresses
                  </Link>
                  <Link href="/collections" className="block text-sidebar-foreground hover:text-sidebar-accent transition-colors duration-200 text-sm">
                    All Collections
                  </Link>
                  <Link href="/search" className="block text-sidebar-foreground hover:text-sidebar-accent transition-colors duration-200 text-sm">
                    Search
                  </Link>
                </nav>
              </div>

              {/* Customer Service Links */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-sidebar-accent">Customer Care</h4>
                <nav className="space-y-2">
                  <Link href="/faq" className="block text-sidebar-foreground hover:text-sidebar-accent transition-colors duration-200 text-sm">
                    FAQ
                  </Link>
                  <Link href="/returns" className="block text-sidebar-foreground hover:text-sidebar-accent transition-colors duration-200 text-sm">
                    Returns & Exchanges
                  </Link>
                  <Link href="/track-order" className="block text-sidebar-foreground hover:text-sidebar-accent transition-colors duration-200 text-sm">
                    Track Your Order
                  </Link>
                  <Link href="/size-guide" className="block text-sidebar-foreground hover:text-sidebar-accent transition-colors duration-200 text-sm">
                    Size Guide
                  </Link>
                </nav>
              </div>

              {/* Company Links */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-sidebar-accent">Company</h4>
                <nav className="space-y-2">
                  <Link href="/about" className="block text-sidebar-foreground hover:text-sidebar-accent transition-colors duration-200 text-sm">
                    About bibiere
                  </Link>
                  <Link href="/heritage" className="block text-sidebar-foreground hover:text-sidebar-accent transition-colors duration-200 text-sm">
                    Our Heritage
                  </Link>
                  <Link href="/sustainability" className="block text-sidebar-foreground hover:text-sidebar-accent transition-colors duration-200 text-sm">
                    Sustainability
                  </Link>
                  <Link href="/careers" className="block text-sidebar-foreground hover:text-sidebar-accent transition-colors duration-200 text-sm">
                    Careers
                  </Link>
                  <Link href="/press" className="block text-sidebar-foreground hover:text-sidebar-accent transition-colors duration-200 text-sm">
                    Press
                  </Link>
                </nav>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-sidebar-foreground/80">Follow bibiere</h4>
              <div className="flex gap-4">
                <a
                  href="https://instagram.com/bibiere"
                  className="text-sidebar-foreground hover:text-sidebar-accent transition-all duration-200 hover:scale-110 p-2 hover:bg-sidebar-accent/10 rounded-full"
                  aria-label="Follow bibiere on Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://pinterest.com/bibiere"
                  className="text-sidebar-foreground hover:text-sidebar-accent transition-all duration-200 hover:scale-110 p-2 hover:bg-sidebar-accent/10 rounded-full"
                  aria-label="Follow bibiere on Pinterest"
                >
                  <PinterestIcon />
                </a>
                <a
                  href="https://facebook.com/bibiere"
                  className="text-sidebar-foreground hover:text-sidebar-accent transition-all duration-200 hover:scale-110 p-2 hover:bg-sidebar-accent/10 rounded-full"
                  aria-label="Follow bibiere on Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-sidebar-border mt-8 pt-6 flex flex-col items-center gap-4">
          <BrandLogo variant="footer" />
          <p className="text-sm text-sidebar-foreground/60 text-center">
            <Link href="/privacy" className="hover:text-sidebar-accent">Privacy</Link>
            {" Â· "}
            <Link href="/terms" className="hover:text-sidebar-accent">Terms</Link>
          </p>
          <p className="text-sm text-sidebar-foreground/60 text-center">
            © 2024 bibiere. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
