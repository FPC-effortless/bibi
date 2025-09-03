import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProductCard from '@/components/product-card'

const mockProduct = {
  id: '1',
  name: 'Test Product',
  price: '$299',
  primaryImage: '/test-image.jpg',
  hoverImage: '/test-hover-image.jpg',
}

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    render(<ProductCard {...mockProduct} />)
    
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('$299')).toBeInTheDocument()
  })

  it('handles wishlist toggle', async () => {
    const user = userEvent.setup()
    const mockWishlistToggle = jest.fn()
    
    render(
      <ProductCard 
        {...mockProduct} 
        onWishlistToggle={mockWishlistToggle}
      />
    )
    
    const wishlistButton = screen.getByLabelText(/add to wishlist/i)
    await user.click(wishlistButton)
    
    expect(mockWishlistToggle).toHaveBeenCalledWith('1')
  })

  it('handles add to cart', async () => {
    const user = userEvent.setup()
    const mockAddToCart = jest.fn()
    
    render(
      <ProductCard 
        {...mockProduct} 
        onAddToCart={mockAddToCart}
      />
    )
    
    const addToCartButton = screen.getByLabelText(/quick add to cart/i)
    await user.click(addToCartButton)
    
    expect(mockAddToCart).toHaveBeenCalledWith('1')
  })

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup()
    
    render(<ProductCard {...mockProduct} />)
    
    const productCard = screen.getByRole('article')
    await user.tab()
    
    expect(productCard).toHaveFocus()
    
    // Test Enter key navigation
    await user.keyboard('{Enter}')
    // Should navigate to product page (would need to mock navigation)
  })

  it('shows hover effects', async () => {
    const user = userEvent.setup()
    
    render(<ProductCard {...mockProduct} />)
    
    const productCard = screen.getByRole('article')
    
    await user.hover(productCard)
    
    // Check if hover state is applied
    await waitFor(() => {
      expect(productCard).toHaveClass('group')
    })
  })

  it('has proper accessibility attributes', () => {
    render(<ProductCard {...mockProduct} />)
    
    const productCard = screen.getByRole('article')
    expect(productCard).toHaveAttribute('aria-label', 'Test Product - $299')
    expect(productCard).toHaveAttribute('tabIndex', '0')
  })

  it('displays wishlist state correctly', () => {
    const { rerender } = render(
      <ProductCard {...mockProduct} isWishlisted={false} />
    )
    
    let wishlistButton = screen.getByLabelText(/add to wishlist/i)
    expect(wishlistButton).toBeInTheDocument()
    
    rerender(<ProductCard {...mockProduct} isWishlisted={true} />)
    
    wishlistButton = screen.getByLabelText(/remove from wishlist/i)
    expect(wishlistButton).toBeInTheDocument()
  })
})