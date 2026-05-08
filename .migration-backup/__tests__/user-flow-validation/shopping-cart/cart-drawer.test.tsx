/**
 * Cart Drawer Functionality Validation Tests
 * 
 * This test suite validates all cart drawer functionality including:
 * - Cart icon click opens drawer correctly
 * - Cart item display with proper images, names, prices, and details
 * - Quantity increase/decrease buttons functionality
 * - Item removal functionality with confirmation feedback
 * - "Move to Wishlist" functionality transfers items correctly
 * - Subtotal and total calculations accuracy
 * - "Proceed to Checkout" button navigation to checkout page
 * - Empty cart state display and messaging
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5
 */

import React from 'react'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CartDrawer } from '@/components/cart-drawer'
import { BrowserRouter } from 'react-router-dom'
import { toast } from '@/hooks/use-toast'

// Mock the toast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}))

// Mock Next.js components
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return React.createElement('img', { src, alt, ...props })
  }
})

jest.mock('next/link', () => {
  return function MockLink({ href, children, ...props }: any) {
    return React.createElement('a', { href, ...props }, children)
  }
})

// Wrapper component for testing
const TestWrapper = ({ children }: { children: React.ReactNode }) => 
  React.createElement(BrowserRouter, {}, children)

describe('Cart Drawer Functionality Validation', () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
    jest.clearAllMocks()
  })

  describe('Cart Icon and Drawer Opening', () => {
    test('should display cart icon with correct item count', () => {
      render(
        <TestWrapper>
          <CartDrawer />
        </TestWrapper>
      )

      const cartButton = screen.getByRole('button', { name: /shopping cart/i })
      expect(cartButton).toBeInTheDocument()
      
      // Check for item count badge
      const itemCountBadge = screen.getByText('1')
      expect(itemCountBadge).toBeInTheDocument()
    })

    test('should open cart drawer when cart icon is clicked', async () => {
      render(
        <TestWrapper>
          <CartDrawer />
        </TestWrapper>
      )

      const cartButton = screen.getByRole('button', { name: /shopping cart/i })
      await user.click(cartButton)

      // Wait for drawer to open
      await waitFor(() => {
        expect(screen.getByText('Shopping Cart')).toBeInTheDocument()
      })
    })

    test('should display correct item count in header when drawer is open', async () => {
      render(
        <TestWrapper>
          <CartDrawer />
        </TestWrapper>
      )

      const cartButton = screen.getByRole('button', { name: /shopping cart/i })
      await user.click(cartButton)

      await waitFor(() => {
        expect(screen.getByText('1 item in your cart')).toBeInTheDocument()
      })
    })
  })

  describe('Cart Item Display', () => {
    test('should display cart items with proper images, names, prices, and details', async () => {
      render(
        <TestWrapper>
          <CartDrawer />
        </TestWrapper>
      )

      const cartButton = screen.getByRole('button', { name: /shopping cart/i })
      await user.click(cartButton)

      await waitFor(() => {
        // Check product image
        const productImage = screen.getByAltText('Elegant Silk Dress')
        expect(productImage).toBeInTheDocument()
        expect(productImage).toHaveAttribute('src', '/elegant-black-silk-dress.png')

        // Check product name
        expect(screen.getByText('Elegant Silk Dress')).toBeInTheDocument()

        // Check brand
        expect(screen.getByText('bibiere')).toBeInTheDocument()

        // Check color and size
        expect(screen.getByText('Midnight Black • Size M')).toBeInTheDocument()

        // Check SKU
        expect(screen.getByText('SKU: ESD-001-M-BLK')).toBeInTheDocument()

        // Check prices (both original and discount)
        expect(screen.getByText('$999')).toBeInTheDocument()
        expect(screen.getByText('$1,299')).toBeInTheDocument()

        // Check savings indicator
        expect(screen.getByText('Save $300')).toBeInTheDocument()
      })
    })

    test('should display quantity selector with current quantity', async () => {
      render(
        <TestWrapper>
          <CartDrawer />
        </TestWrapper>
      )

      const cartButton = screen.getByRole('button', { name: /shopping cart/i })
      await user.click(cartButton)

      await waitFor(() => {
        // Check quantity display
        expect(screen.getByText('1')).toBeInTheDocument()

        // Check quantity buttons
        const decreaseButton = screen.getByRole('button', { name: /decrease quantity/i })
        const increaseButton = screen.getByRole('button', { name: /increase quantity/i })
        
        expect(decreaseButton).toBeInTheDocument()
        expect(increaseButton).toBeInTheDocument()
      })
    })

    test('should display item subtotal correctly', async () => {
      render(
        <TestWrapper>
          <CartDrawer />
        </TestWrapper>
      )

      const cartButton = screen.getByRole('button', { name: /shopping cart/i })
      await user.click(cartButton)

      await waitFor(() => {
        expect(screen.getByText('Subtotal: $999')).toBeInTheDocument()
        expect(screen.getByText('You save $300')).toBeInTheDocument()
      })
    })
  })

  describe('Quantity Modification', () => {
    test('should increase quantity when plus button is clicked', async () => {
      render(
        <TestWrapper>
          <CartDrawer />
        </TestWrapper>
      )

      const cartButton = screen.getByRole('button', { name: /shopping cart/i })
      await user.click(cartButton)

      await waitFor(() => {
        const increaseButton = screen.getByRole('button', { name: /increase quantity/i })
        expect(increaseButton).toBeInTheDocument()
      })

      const increaseButton = screen.getByRole('button', { name: /increase quantity/i })
      await user.click(increaseButton)

      // Wait for loading state
      await waitFor(() => {
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
      })

      // Wait for quantity update
      await waitFor(() => {
        expect(screen.getByText('2')).toBeInTheDocument()
        expect(screen.getByText('Subtotal: $1,998')).toBeInTheDocument()
      }, { timeout: 1000 })
    })

    test('should decrease quantity when minus button is clicked', async () => {
      render(
        <TestWrapper>
          <CartDrawer />
        </TestWrapper>
      )

      const cartButton = screen.getByRole('button', { name: /shopping cart/i })
      await user.click(cartButton)

      // First increase quantity to 2
      await waitFor(() => {
        const increaseButton = screen.getByRole('button', { name: /increase quantity/i })
        expect(increaseButton).toBeInTheDocument()
      })

      const increaseButton = screen.getByRole('button', { name: /increase quantity/i })
      await user.click(increaseButton)

      await waitFor(() => {
        expect(screen.getByText('2')).toBeInTheDocument()
      }, { timeout: 1000 })

      // Then decrease quantity
      const decreaseButton = screen.getByRole('button', { name: /decrease quantity/i })
      await user.click(decreaseButton)

      await waitFor(() => {
        expect(screen.getByText('1')).toBeInTheDocument()
        expect(screen.getByText('Subtotal: $999')).toBeInTheDocument()
      }, { timeout: 1000 })
    })

    test('should show loading state during quantity updates', async () => {
      render(
        <TestWrapper>
          <CartDrawer />
        </TestWrapper>
      )

      const cartButton = screen.getByRole('button', { name: /shopping cart/i })
      await user.click(cartButton)

      await waitFor(() => {
        const increaseButton = screen.getByRole('button', { name: /increase quantity/i })
        expect(increaseButton).toBeInTheDocument()
      })

      const increaseButton = screen.getByRole('button', { name: /increase quantity/i })
      await user.click(increaseButton)

      // Check for loading spinner in button
      await waitFor(() => {
        const loadingSpinner = within(increaseButton).getByTestId('loading-spinner')
        expect(loadingSpinner).toBeInTheDocument()
      })
    })

    test('should prevent quantity from going below 1', async () => {
      render(
        <TestWrapper>
          <CartDrawer />
        </TestWrapper>
      )

      const cartButton = screen.getByRole('button', { name: /shopping cart/i })
      await user.click(cartButton)

      await waitFor(() => {
        const decreaseButton = screen.getByRole('button', { name: /decrease quantity/i })
        expect(decreaseButton).toBeDisabled()
      })
    })

    test('should enforce maximum quantity limits', async () => {
      render(
        <TestWrapper>
          <CartDrawer />
        </TestWrapper>
      )

      const cartButton = screen.getByRole('button', { name: /shopping cart/i })
      await user.click(cartButton)

      // Increase quantity to maximum (5)
      await waitFor(() => {
        const increaseButton = screen.getByRole('button', { name: /increase quantity/i })
        expect(increaseButton).toBeInTheDocument()
      })

      const increaseButton = screen.getByRole('button', { name: /increase quantity/i })
      
      // Click increase button multiple times to reach max
      for (let i = 0; i < 4; i++) {
        await user.click(increaseButton)
        await waitFor(() => {
          expect(screen.getByText((i + 2).toString())).toBeInTheDocument()
        }, { timeout: 1000 })
      }

      // At max quantity, button should be disabled
      await waitFor(() => {
        expect(increaseButton).toBeDisabled()
        expect(screen.getByText('Max quantity')).toBeInTheDocument()
      })
    })
  })

  describe('Item Removal', () => {
    test('should remove item when remove button is clicked', async () => {
      render(
        <TestWrapper>
          <CartDrawer />
        </TestWrapper>
      )

      const cartButton = screen.getByRole('button', { name: /shopping cart/i })
      await user.click(cartButton)

      await waitFor(() => {
        const removeButton = screen.getByRole('button', { name: /remove from cart/i })
        expect(removeButton).toBeInTheDocument()
      })

      const removeButton = screen.getByRole('button', { name: /remove from cart/i })
      await user.click(removeButton)

      // Wait for removal confirmation
      await waitFor(() => {
        expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
      }, { timeout: 1000 })
    })

    test('should show confirmation feedback when item is removed', async () => {
      const mockToast = jest.fn()
      ;(toast as jest.Mock).mockReturnValue({ toast: mockToast })

      render(
        <TestWrapper>
          <CartDrawer />
        </TestWrapper>
      )

      const cartButton = screen.getByRole('button', { name: /shopping cart/i })
      await user.click(cartButton)

      await waitFor(() => {
        const removeButton = screen.getByRole('button', { name: /remove from cart/i })
        expect(removeButton).toBeInTheDocument()
      })

      const removeButton = screen.getByRole('button', { name: /remove from cart/i })
      await user.click(removeButton)

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Item removed',
          description: 'Elegant Silk Dress has been removed from your cart.'
        })
      }, { timeout: 1000 })
    })
  })

  describe('Move to Wishlist', () => {
    test('should move item to wishlist when wishlist button is clicked', async () => {
      render(
        <TestWrapper>
          <CartDrawer />
        </TestWrapper>
      )

      const cartButton = screen.getByRole('button', { name: /shopping cart/i })
      await user.click(cartButton)

      await waitFor(() => {
        const wishlistButton = screen.getByRole('button', { name: /move to wishlist/i })
        expect(wishlistButton).toBeInTheDocument()
      })

      const wishlistButton = screen.getByRole('button', { name: /move to wishlist/i })
      await user.click(wishlistButton)

      // Wait for move to wishlist completion
      await waitFor(() => {
        expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
      }, { timeout: 1000 })
    })

    test('should show confirmation feedback when item is moved to wishlist', async () => {
      const mockToast = jest.fn()
      ;(toast as jest.Mock).mockReturnValue({ toast: mockToast })

      render(
        <TestWrapper>
          <CartDrawer />
        </TestWrapper>
      )

      const cartButton = screen.getByRole('button', { name: /shopping cart/i })
      await user.click(cartButton)

      await waitFor(() => {
        const wishlistButton = screen.getByRole('button', { name: /move to wishlist/i })
        expect(wishlistButton).toBeInTheDocument()
      })

      const wishlistButton = screen.getByRole('button', { name: /move to wishlist/i })
      await user.click(wishlistButton)

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Moved to wishlist',
          description: 'Elegant Silk Dress has been moved to your wishlist.'
        })
      }, { timeout: 1000 })
    })
  })

  describe('Cart Totals and Calculations', () => {
    test('should display accurate subtotal calculations', async () => {
      render(
        <TestWrapper>
          <CartDrawer />
        </TestWrapper>
      )

      const cartButton = screen.getByRole('button', { name: /shopping cart/i })
      await user.click(cartButton)

      await waitFor(() => {
        // Check subtotal in cart summary
        expect(screen.getByText('Subtotal (1 item)')).toBeInTheDocument()
        expect(screen.getByText('$999')).toBeInTheDocument()

        // Check total savings
        expect(screen.getByText('Total Savings')).toBeInTheDocument()
        expect(screen.getByText('-$300')).toBeInTheDocument()

        // Check shipping
        expect(screen.getByText('Shipping')).toBeInTheDocument()
        expect(screen.getByText('Free')).toBeInTheDocument()

        // Check total
        expect(screen.getByText('Total')).toBeInTheDocument()
        expect(screen.getByText('$999')).toBeInTheDocument()
      })
    })

    test('should update totals when quantity changes', async () => {
      render(
        <TestWrapper>
          <CartDrawer />
        </TestWrapper>
      )

      const cartButton = screen.getByRole('button', { name: /shopping cart/i })
      await user.click(cartButton)

      // Increase quantity
      await waitFor(() => {
        const increaseButton = screen.getByRole('button', { name: /increase quantity/i })
        expect(increaseButton).toBeInTheDocument()
      })

      const increaseButton = screen.getByRole('button', { name: /increase quantity/i })
      await user.click(increaseButton)

      // Wait for quantity and totals to update
      await waitFor(() => {
        expect(screen.getByText('Subtotal (2 items)')).toBeInTheDocument()
        expect(screen.getByText('$1,998')).toBeInTheDocument()
        expect(screen.getByText('-$600')).toBeInTheDocument() // Total savings doubled
      }, { timeout: 1000 })
    })

    test('should show free shipping message', async () => {
      render(
        <TestWrapper>
          <CartDrawer />
        </TestWrapper>
      )

      const cartButton = screen.getByRole('button', { name: /shopping cart/i })
      await user.click(cartButton)

      await waitFor(() => {
        expect(screen.getByText('Free shipping on orders over $100')).toBeInTheDocument()
      })
    })
  })

  describe('Checkout Navigation', () => {
    test('should display "Proceed to Checkout" button when cart has items', async () => {
      render(
        <TestWrapper>
          <CartDrawer />
        </TestWrapper>
      )

      const cartButton = screen.getByRole('button', { name: /shopping cart/i })
      await user.click(cartButton)

      await waitFor(() => {
        const checkoutButton = screen.getByRole('link', { name: /proceed to checkout/i })
        expect(checkoutButton).toBeInTheDocument()
        expect(checkoutButton).toHaveAttribute('href', '/checkout')
      })
    })

    test('should disable checkout button when cart is updating', async () => {
      render(
        <TestWrapper>
          <CartDrawer />
        </TestWrapper>
      )

      const cartButton = screen.getByRole('button', { name: /shopping cart/i })
      await user.click(cartButton)

      // Start quantity update
      await waitFor(() => {
        const increaseButton = screen.getByRole('button', { name: /increase quantity/i })
        expect(increaseButton).toBeInTheDocument()
      })

      const increaseButton = screen.getByRole('button', { name: /increase quantity/i })
      await user.click(increaseButton)

      // Check that checkout button shows updating state
      await waitFor(() => {
        expect(screen.getByText('Updating Cart...')).toBeInTheDocument()
      })
    })

    test('should display "Continue Shopping" button', async () => {
      render(
        <TestWrapper>
          <CartDrawer />
        </TestWrapper>
      )

      const cartButton = screen.getByRole('button', { name: /shopping cart/i })
      await user.click(cartButton)

      await waitFor(() => {
        const continueShoppingButton = screen.getByRole('link', { name: /continue shopping/i })
        expect(continueShoppingButton).toBeInTheDocument()
        expect(continueShoppingButton).toHaveAttribute('href', '/')
      })
    })
  })

  describe('Empty Cart State', () => {
    test('should display empty cart message when no items', async () => {
      // Mock empty cart state
      const EmptyCartDrawer = () => {
        // This would be a modified version with empty cart
        return <CartDrawer />
      }

      render(
        <TestWrapper>
          <EmptyCartDrawer />
        </TestWrapper>
      )

      const cartButton = screen.getByRole('button', { name: /shopping cart \(0 items\)/i })
      await user.click(cartButton)

      await waitFor(() => {
        expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
        expect(screen.getByText('Discover bibiere\'s collection of timeless elegance')).toBeInTheDocument()
      })
    })

    test('should display shopping options in empty cart state', async () => {
      // Test would need empty cart state
      render(
        <TestWrapper>
          <CartDrawer />
        </TestWrapper>
      )

      const cartButton = screen.getByRole('button', { name: /shopping cart/i })
      await user.click(cartButton)

      // Remove the item to get empty state
      await waitFor(() => {
        const removeButton = screen.getByRole('button', { name: /remove from cart/i })
        expect(removeButton).toBeInTheDocument()
      })

      const removeButton = screen.getByRole('button', { name: /remove from cart/i })
      await user.click(removeButton)

      await waitFor(() => {
        const shopCollectionButton = screen.getByRole('link', { name: /shop collection/i })
        const viewWishlistButton = screen.getByRole('link', { name: /view wishlist/i })
        
        expect(shopCollectionButton).toBeInTheDocument()
        expect(shopCollectionButton).toHaveAttribute('href', '/')
        
        expect(viewWishlistButton).toBeInTheDocument()
        expect(viewWishlistButton).toHaveAttribute('href', '/account/wishlist')
      }, { timeout: 1000 })
    })
  })

  describe('Error Handling', () => {
    test('should display error message when operations fail', async () => {
      // Mock network error
      const originalFetch = global.fetch
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'))

      render(
        <TestWrapper>
          <CartDrawer />
        </TestWrapper>
      )

      const cartButton = screen.getByRole('button', { name: /shopping cart/i })
      await user.click(cartButton)

      await waitFor(() => {
        const increaseButton = screen.getByRole('button', { name: /increase quantity/i })
        expect(increaseButton).toBeInTheDocument()
      })

      const increaseButton = screen.getByRole('button', { name: /increase quantity/i })
      await user.click(increaseButton)

      await waitFor(() => {
        expect(screen.getByText('Failed to update cart. Please try again.')).toBeInTheDocument()
      }, { timeout: 1000 })

      global.fetch = originalFetch
    })

    test('should allow error dismissal', async () => {
      // Mock network error
      const originalFetch = global.fetch
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'))

      render(
        <TestWrapper>
          <CartDrawer />
        </TestWrapper>
      )

      const cartButton = screen.getByRole('button', { name: /shopping cart/i })
      await user.click(cartButton)

      await waitFor(() => {
        const increaseButton = screen.getByRole('button', { name: /increase quantity/i })
        expect(increaseButton).toBeInTheDocument()
      })

      const increaseButton = screen.getByRole('button', { name: /increase quantity/i })
      await user.click(increaseButton)

      await waitFor(() => {
        expect(screen.getByText('Failed to update cart. Please try again.')).toBeInTheDocument()
      }, { timeout: 1000 })

      // Dismiss error
      const dismissButton = screen.getByRole('button', { name: /close/i })
      await user.click(dismissButton)

      await waitFor(() => {
        expect(screen.queryByText('Failed to update cart. Please try again.')).not.toBeInTheDocument()
      })

      global.fetch = originalFetch
    })
  })
})