/**
 * User Flow Validation Tests - Task 2.1: Header Navigation Components
 * 
 * This test suite validates all header navigation functionality including:
 * - Logo click navigation to homepage
 * - Main navigation menu links (New Arrivals, Dresses, Lookbook, Journal)
 * - Mobile menu toggle functionality and navigation links
 * - Search icon opening search modal
 * - Cart icon opening cart drawer with proper item count display
 * - User/account icon navigation to account page
 * 
 * Requirements: 1.1, 1.2, 1.3, 7.3
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrandLogo } from '@/components/brand-logo'

// Mock Next.js router
const mockPush = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    pathname: '/',
    query: {},
    asPath: '/',
  }),
  usePathname: () => '/',
}))

// Mock components that have complex dependencies
jest.mock('@/components/search-modal', () => ({
  SearchModal: jest.fn(({ isOpen, onClose }) => 
    isOpen ? React.createElement('div', { 'data-testid': 'search-modal' }, 
      React.createElement('button', { onClick: onClose, 'data-testid': 'close-search' }, 'Close Search'),
      React.createElement('input', { 'data-testid': 'search-input', placeholder: 'Search...' })
    ) : null
  )
}))

jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}))

// Mock React for createElement
const React = require('react')

describe('Header Navigation Components - Task 2.1', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    mockPush.mockClear()
  })

  describe('Logo Navigation', () => {
    it('should navigate to homepage when logo is clicked', async () => {
      render(<BrandLogo variant="header" />)
      
      const logoLink = screen.getByRole('link')
      expect(logoLink).toHaveAttribute('href', '/')
      
      await user.click(logoLink)
      // Logo navigation is handled by Next.js Link component
      expect(logoLink).toBeInTheDocument()
    })

    it('should display logo with correct styling and accessibility', () => {
      render(<BrandLogo variant="header" />)
      
      const logoLink = screen.getByRole('link')
      expect(logoLink).toBeInTheDocument()
      
      // Check for brand text
      expect(screen.getByText('bibiere')).toBeInTheDocument()
      
      // Check for SVG icon
      const svgIcon = logoLink.querySelector('svg')
      expect(svgIcon).toBeInTheDocument()
    })
  })

  describe('Main Navigation Menu Links', () => {
    it('should render all main navigation links with correct hrefs', () => {
      render(<Header />)
      
      const expectedLinks = [
        { text: 'New Arrivals', href: '/collections/new-arrivals' },
        { text: 'Dresses', href: '/collections/dresses' },
        { text: 'Lookbook', href: '/lookbook' },
        { text: 'Journal', href: '/journal' },
      ]

      expectedLinks.forEach(({ text, href }) => {
        const link = screen.getByRole('link', { name: text })
        expect(link).toBeInTheDocument()
        expect(link).toHaveAttribute('href', href)
      })
    })

    it('should have proper hover effects and styling for navigation links', () => {
      render(<Header />)
      
      const newArrivalsLink = screen.getByRole('link', { name: 'New Arrivals' })
      expect(newArrivalsLink).toHaveClass('hover:text-bibiere-gold')
      expect(newArrivalsLink).toHaveClass('transition-all')
    })

    it('should be hidden on mobile and visible on desktop', () => {
      render(<Header />)
      
      const desktopNav = screen.getByRole('navigation', { hidden: true })
      expect(desktopNav).toHaveClass('hidden', 'md:flex')
    })
  })

  describe('Mobile Menu Toggle Functionality', () => {
    it('should toggle mobile menu when hamburger button is clicked', async () => {
      render(<Header />)
      
      const menuButton = screen.getByRole('button', { name: /open menu/i })
      expect(menuButton).toBeInTheDocument()
      
      // Initially menu should be closed
      const mobileNav = screen.getByRole('navigation', { name: 'Mobile navigation menu' })
      expect(mobileNav).toHaveClass('max-h-0', 'opacity-0')
      
      // Click to open menu
      await user.click(menuButton)
      
      await waitFor(() => {
        expect(mobileNav).toHaveClass('max-h-96', 'opacity-100')
      })
      
      // Button should now show close icon
      expect(screen.getByRole('button', { name: /close menu/i })).toBeInTheDocument()
    })

    it('should display all navigation links in mobile menu', async () => {
      render(<Header />)
      
      const menuButton = screen.getByRole('button', { name: /open menu/i })
      await user.click(menuButton)
      
      await waitFor(() => {
        const mobileNav = screen.getByRole('navigation', { name: 'Mobile navigation menu' })
        expect(mobileNav).toHaveClass('max-h-96', 'opacity-100')
      })
      
      // Check all mobile navigation links
      const expectedLinks = [
        'New Arrivals',
        'Dresses', 
        'Lookbook',
        'Journal',
        'My Account' // Mobile-only account link
      ]

      expectedLinks.forEach(linkText => {
        expect(screen.getByRole('link', { name: linkText })).toBeInTheDocument()
      })
    })

    it('should close mobile menu when a navigation link is clicked', async () => {
      render(<Header />)
      
      const menuButton = screen.getByRole('button', { name: /open menu/i })
      await user.click(menuButton)
      
      await waitFor(() => {
        const mobileNav = screen.getByRole('navigation', { name: 'Mobile navigation menu' })
        expect(mobileNav).toHaveClass('max-h-96', 'opacity-100')
      })
      
      // Click on a navigation link
      const lookbookLink = screen.getAllByRole('link', { name: 'Lookbook' })[1] // Mobile version
      await user.click(lookbookLink)
      
      await waitFor(() => {
        const mobileNav = screen.getByRole('navigation', { name: 'Mobile navigation menu' })
        expect(mobileNav).toHaveClass('max-h-0', 'opacity-0')
      })
    })

    it('should have proper accessibility attributes for mobile menu', () => {
      render(<Header />)
      
      const menuButton = screen.getByRole('button', { name: /open menu/i })
      expect(menuButton).toHaveAttribute('aria-expanded', 'false')
      expect(menuButton).toHaveAttribute('aria-controls', 'mobile-navigation')
      
      const mobileNav = screen.getByRole('navigation', { name: 'Mobile navigation menu' })
      expect(mobileNav).toHaveAttribute('id', 'mobile-navigation')
    })
  })

  describe('Search Icon Functionality', () => {
    it('should open search modal when search icon is clicked', async () => {
      render(<Header />)
      
      const searchButton = screen.getByRole('button', { name: 'Search' })
      expect(searchButton).toBeInTheDocument()
      
      // Initially search modal should be closed
      const searchModal = screen.getByTestId('search-modal')
      expect(searchModal).toHaveStyle({ display: 'none' })
      
      // Click search button
      await user.click(searchButton)
      
      await waitFor(() => {
        expect(searchModal).toHaveStyle({ display: 'block' })
      })
    })

    it('should have proper accessibility attributes for search button', () => {
      render(<Header />)
      
      const searchButton = screen.getByRole('button', { name: 'Search' })
      expect(searchButton).toHaveAttribute('aria-label', 'Search')
      
      // Check for screen reader text
      expect(screen.getByText('Search')).toHaveClass('sr-only')
    })

    it('should close search modal when close button is clicked', async () => {
      render(<Header />)
      
      const searchButton = screen.getByRole('button', { name: 'Search' })
      await user.click(searchButton)
      
      await waitFor(() => {
        const searchModal = screen.getByTestId('search-modal')
        expect(searchModal).toHaveStyle({ display: 'block' })
      })
      
      const closeButton = screen.getByTestId('close-search')
      await user.click(closeButton)
      
      await waitFor(() => {
        const searchModal = screen.getByTestId('search-modal')
        expect(searchModal).toHaveStyle({ display: 'none' })
      })
    })
  })

  describe('Cart Icon and Drawer Functionality', () => {
    it('should display cart icon with proper item count', () => {
      render(<CartDrawer />)
      
      const cartButton = screen.getByRole('button', { name: /shopping cart/i })
      expect(cartButton).toBeInTheDocument()
      
      // Check for cart count badge (should show 1 based on mock data)
      const cartBadge = cartButton.querySelector('span')
      expect(cartBadge).toBeInTheDocument()
      expect(cartBadge).toHaveTextContent('1')
    })

    it('should have proper accessibility attributes for cart button', () => {
      render(<CartDrawer />)
      
      const cartButton = screen.getByRole('button', { name: /shopping cart/i })
      expect(cartButton).toHaveAttribute('aria-label')
      
      // Check for screen reader text
      expect(screen.getByText(/shopping cart/i)).toHaveClass('sr-only')
    })

    it('should open cart drawer when cart icon is clicked', async () => {
      render(<CartDrawer />)
      
      const cartButton = screen.getByRole('button', { name: /shopping cart/i })
      await user.click(cartButton)
      
      await waitFor(() => {
        expect(screen.getByText('Shopping Cart')).toBeInTheDocument()
      })
    })
  })

  describe('User/Account Icon Navigation', () => {
    it('should navigate to account page when user icon is clicked', () => {
      render(<Header />)
      
      // Check for account links (both desktop and mobile versions)
      const accountLinks = screen.getAllByRole('link', { name: /my account/i })
      
      accountLinks.forEach(link => {
        expect(link).toHaveAttribute('href', '/account')
      })
    })

    it('should display wishlist icon with proper count', () => {
      render(<Header />)
      
      const wishlistButton = screen.getByRole('button', { name: /wishlist/i })
      expect(wishlistButton).toBeInTheDocument()
      
      // Check for wishlist count badge (should show 3 based on mock data)
      const wishlistBadge = wishlistButton.querySelector('span')
      expect(wishlistBadge).toBeInTheDocument()
      expect(wishlistBadge).toHaveTextContent('3')
    })

    it('should have proper accessibility attributes for user icons', () => {
      render(<Header />)
      
      const wishlistButton = screen.getByRole('button', { name: /wishlist/i })
      expect(wishlistButton).toHaveAttribute('aria-label')
      
      // Check for screen reader text
      expect(screen.getByText(/wishlist/i)).toHaveClass('sr-only')
    })

    it('should hide user icon on small screens and show in mobile menu', () => {
      render(<Header />)
      
      // Desktop user icon should be hidden on small screens
      const desktopUserLink = screen.getAllByRole('link', { name: /my account/i })[0]
      expect(desktopUserLink).toHaveClass('hidden', 'sm:block')
    })
  })

  describe('Responsive Behavior', () => {
    it('should have proper responsive classes for mobile adaptation', () => {
      render(<Header />)
      
      // Check mobile menu button visibility
      const menuButton = screen.getByRole('button', { name: /open menu/i })
      expect(menuButton.parentElement).toHaveClass('md:hidden')
      
      // Check desktop navigation visibility
      const desktopNav = screen.getByRole('navigation', { hidden: true })
      expect(desktopNav).toHaveClass('hidden', 'md:flex')
    })

    it('should have proper touch target sizes for mobile', () => {
      render(<Header />)
      
      const menuButton = screen.getByRole('button', { name: /open menu/i })
      expect(menuButton).toHaveClass('btn-touch-md')
      
      const searchButton = screen.getByRole('button', { name: 'Search' })
      expect(searchButton).toHaveClass('btn-touch-md')
    })
  })

  describe('Accessibility Features', () => {
    it('should include skip navigation link', () => {
      render(<Header />)
      
      const skipLink = screen.getByRole('link', { name: 'Skip to main content' })
      expect(skipLink).toBeInTheDocument()
      expect(skipLink).toHaveAttribute('href', '#main-content')
      expect(skipLink).toHaveClass('sr-only', 'focus:not-sr-only')
    })

    it('should have proper ARIA labels for all interactive elements', () => {
      render(<Header />)
      
      // Check all buttons have proper labels
      const searchButton = screen.getByRole('button', { name: 'Search' })
      const menuButton = screen.getByRole('button', { name: /menu/i })
      const wishlistButton = screen.getByRole('button', { name: /wishlist/i })
      
      expect(searchButton).toBeInTheDocument()
      expect(menuButton).toBeInTheDocument()
      expect(wishlistButton).toBeInTheDocument()
    })

    it('should support keyboard navigation', async () => {
      render(<Header />)
      
      // Tab through navigation elements
      await user.tab()
      expect(screen.getByRole('link', { name: 'Skip to main content' })).toHaveFocus()
      
      await user.tab()
      // Should focus on first navigation element
      const firstNavElement = document.activeElement
      expect(firstNavElement).toBeInTheDocument()
    })
  })

  describe('Visual and Interaction Feedback', () => {
    it('should have proper hover effects on navigation elements', () => {
      render(<Header />)
      
      const searchButton = screen.getByRole('button', { name: 'Search' })
      expect(searchButton).toHaveClass('hover:text-bibiere-gold', 'transition-all')
      
      const menuButton = screen.getByRole('button', { name: /menu/i })
      expect(menuButton).toHaveClass('hover:text-bibiere-gold', 'transition-all')
    })

    it('should have proper active states for touch interactions', () => {
      render(<Header />)
      
      const searchButton = screen.getByRole('button', { name: 'Search' })
      expect(searchButton).toHaveClass('active:scale-95')
      
      const menuButton = screen.getByRole('button', { name: /menu/i })
      expect(menuButton).toHaveClass('active:scale-95')
    })
  })
})