"use client"

import { useState } from "react"
import { Search, Heart, User, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SearchModal } from "./search-modal"
import { CartDrawer } from "./cart-drawer"
import { BrandLogo } from "./brand-logo"
import { cn } from "@/lib/utils"

export default function Header() {
  const [wishlistCount] = useState(3)
  const [cartCount] = useState(2)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationLinks = [
    { href: "/collections/new-arrivals", label: "New Arrivals" },
    { href: "/collections", label: "Collections" },
    { href: "/lookbook", label: "Lookbook" },
    { href: "/about", label: "About" },
  ]

  return (
    <>
      {/* Skip Navigation Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[100] bg-bibiere-burgundy text-white px-4 py-2 rounded-md font-medium transition-all duration-200"
      >
        Skip to main content
      </a>
      
      <header className="sticky top-0 z-50 bg-sidebar/95 backdrop-blur-sm border-b border-sidebar-border shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Button - Enhanced for touch */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="btn-touch-md text-sidebar-foreground hover:text-bibiere-gold hover:bg-bibiere-gold/10 transition-all duration-300 active:scale-95 touch:bg-bibiere-gold/5"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-navigation"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
                <span className="sr-only">
                  {isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                </span>
              </Button>
            </div>

            {/* Left Navigation - Desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-sidebar-foreground hover:text-bibiere-gold transition-all duration-300 font-medium group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-bibiere-gold transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </nav>

            {/* Center Logo */}
            <div className="flex-1 flex justify-center md:flex-none">
              <BrandLogo variant="header" />
            </div>

            {/* Right Icons - Enhanced for mobile touch */}
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="btn-touch-md text-sidebar-foreground hover:text-bibiere-gold hover:bg-bibiere-gold/10 no-touch:hover:scale-105 transition-all duration-300 active:scale-95 touch:bg-bibiere-gold/5"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="sr-only">Search</span>
              </Button>

              <Link href="/account">
                <Button
                  variant="ghost"
                  size="icon"
                  className="btn-touch-md relative text-sidebar-foreground hover:text-bibiere-gold hover:bg-bibiere-gold/10 no-touch:hover:scale-105 transition-all duration-300 active:scale-95 touch:bg-bibiere-gold/5"
                >
                  <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-bibiere-burgundy text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse min-w-[20px]">
                      {wishlistCount}
                    </span>
                  )}
                  <span className="sr-only">Wishlist ({wishlistCount} items)</span>
                </Button>
              </Link>

              <Link href="/account" className="hidden sm:block">
                <Button
                  variant="ghost"
                  size="icon"
                  className="btn-touch-md text-sidebar-foreground hover:text-bibiere-gold hover:bg-bibiere-gold/10 no-touch:hover:scale-105 transition-all duration-300 active:scale-95 touch:bg-bibiere-gold/5"
                >
                  <User className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="sr-only">My Account</span>
                </Button>
              </Link>

              <CartDrawer />
            </div>
          </div>

          {/* Enhanced Mobile Navigation Menu */}
          <div 
            id="mobile-navigation"
            role="navigation"
            aria-label="Mobile navigation menu"
            className={cn(
              "md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-sidebar/98 backdrop-blur-sm",
              isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <nav className="py-4 space-y-1 border-t border-sidebar-border safe-area-bottom">
              {navigationLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-6 py-4 text-sidebar-foreground hover:text-bibiere-gold hover:bg-bibiere-gold/10 active:bg-bibiere-gold/20 transition-all duration-300 font-medium rounded-lg mx-2 min-h-touch-md flex items-center text-responsive"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile-only account link */}
              <Link
                href="/account"
                className="sm:hidden block px-6 py-4 text-sidebar-foreground hover:text-bibiere-gold hover:bg-bibiere-gold/10 active:bg-bibiere-gold/20 transition-all duration-300 font-medium rounded-lg mx-2 min-h-touch-md flex items-center text-responsive border-t border-sidebar-border/50 mt-2 pt-6"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="h-5 w-5 mr-3" />
                My Account
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
