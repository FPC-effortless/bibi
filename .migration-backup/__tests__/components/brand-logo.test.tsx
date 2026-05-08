import { render, screen } from '@testing-library/react'
import { BrandLogo } from '@/components/brand-logo'

describe('BrandLogo', () => {
  it('renders the bibiere logo', () => {
    render(<BrandLogo />)
    
    const logo = screen.getByRole('img', { name: /bibiere/i })
    expect(logo).toBeInTheDocument()
  })

  it('renders different variants correctly', () => {
    const { rerender } = render(<BrandLogo variant="header" />)
    
    let logo = screen.getByRole('img', { name: /bibiere/i })
    expect(logo).toHaveClass('h-8') // Header size
    
    rerender(<BrandLogo variant="footer" />)
    logo = screen.getByRole('img', { name: /bibiere/i })
    expect(logo).toHaveClass('h-6') // Footer size
  })

  it('has proper accessibility attributes', () => {
    render(<BrandLogo />)
    
    const logo = screen.getByRole('img', { name: /bibiere/i })
    expect(logo).toHaveAttribute('alt', expect.stringContaining('bibiere'))
  })

  it('maintains brand consistency', () => {
    render(<BrandLogo />)
    
    const logoContainer = screen.getByRole('img', { name: /bibiere/i }).parentElement
    expect(logoContainer).toHaveClass('text-bibiere-burgundy')
  })
})