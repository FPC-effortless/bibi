/**
 * Checkout Process Flow End-to-End Validation Tests
 * 
 * This test suite validates the complete checkout process including:
 * - Checkout page loads correctly with progress indicator
 * - Shipping form validation and field requirements
 * - Shipping form submission and progression to payment step
 * - Payment form validation and field requirements
 * - Payment form submission and progression to order review
 * - Order review page display with complete order details
 * - Back button functionality between checkout steps
 * - Order completion confirmation and success messaging
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6
 */

import React from 'react'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CheckoutPage from '@/app/checkout/page'
import CheckoutProgress from '@/components/checkout-progress'
import ShippingForm from '@/components/shipping-form'
import PaymentForm from '@/components/payment-form'
import OrderReview from '@/components/order-review'
import { BrowserRouter } from 'react-router-dom'

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

describe('Checkout Process Flow End-to-End Validation', () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
    jest.clearAllMocks()
  })

  describe('Checkout Page Loading and Progress Indicator', () => {
    test('should load checkout page correctly with progress indicator', () => {
      render(
        <TestWrapper>
          <CheckoutPage />
        </TestWrapper>
      )

      // Check that checkout progress is displayed
      expect(screen.getByText('Shipping Info')).toBeInTheDocument()
      expect(screen.getByText('Payment')).toBeInTheDocument()
      expect(screen.getByText('Order Review')).toBeInTheDocument()

      // Check that step 1 is active
      const step1 = screen.getByText('1')
      expect(step1).toHaveClass('bg-primary')
    })

    test('should display shipping form as first step', () => {
      render(
        <TestWrapper>
          <CheckoutPage />
        </TestWrapper>
      )

      expect(screen.getByText('Shipping Information')).toBeInTheDocument()
      expect(screen.getByLabelText('Full Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Street Address')).toBeInTheDocument()
      expect(screen.getByLabelText('City')).toBeInTheDocument()
      expect(screen.getByLabelText('State')).toBeInTheDocument()
      expect(screen.getByLabelText('Postal Code')).toBeInTheDocument()
      expect(screen.getByLabelText('Phone Number')).toBeInTheDocument()
    })

    test('should show correct progress indicator states', () => {
      render(
        <TestWrapper>
          <CheckoutProgress currentStep={1} />
        </TestWrapper>
      )

      const step1 = screen.getByText('1')
      const step2 = screen.getByText('2')
      const step3 = screen.getByText('3')

      expect(step1).toHaveClass('bg-primary')
      expect(step2).toHaveClass('bg-muted')
      expect(step3).toHaveClass('bg-muted')
    })
  })

  describe('Shipping Form Validation and Submission', () => {
    test('should validate required shipping form fields', async () => {
      const mockOnNext = jest.fn()
      
      render(
        <TestWrapper>
          <ShippingForm onNext={mockOnNext} />
        </TestWrapper>
      )

      const submitButton = screen.getByRole('button', { name: /continue to payment/i })
      await user.click(submitButton)

      // Check that form doesn't submit without required fields
      expect(mockOnNext).not.toHaveBeenCalled()

      // Check for HTML5 validation (required attributes)
      const fullNameInput = screen.getByLabelText('Full Name')
      expect(fullNameInput).toBeRequired()
      expect(fullNameInput).toBeInvalid()
    })

    test('should accept valid shipping form data', async () => {
      const mockOnNext = jest.fn()
      
      render(
        <TestWrapper>
          <ShippingForm onNext={mockOnNext} />
        </TestWrapper>
      )

      // Fill out all required fields
      await user.type(screen.getByLabelText('Full Name'), 'John Doe')
      await user.type(screen.getByLabelText('Street Address'), '123 Main St')
      await user.type(screen.getByLabelText('City'), 'New York')
      await user.type(screen.getByLabelText('State'), 'NY')
      await user.type(screen.getByLabelText('Postal Code'), '10001')
      await user.type(screen.getByLabelText('Phone Number'), '555-123-4567')

      const submitButton = screen.getByRole('button', { name: /continue to payment/i })
      await user.click(submitButton)

      // Check that form submits with valid data
      expect(mockOnNext).toHaveBeenCalledWith({
        fullName: 'John Doe',
        streetAddress: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        phoneNumber: '555-123-4567'
      })
    })

    test('should progress to payment step after shipping form submission', async () => {
      render(
        <TestWrapper>
          <CheckoutPage />
        </TestWrapper>
      )

      // Fill out shipping form
      await user.type(screen.getByLabelText('Full Name'), 'John Doe')
      await user.type(screen.getByLabelText('Street Address'), '123 Main St')
      await user.type(screen.getByLabelText('City'), 'New York')
      await user.type(screen.getByLabelText('State'), 'NY')
      await user.type(screen.getByLabelText('Postal Code'), '10001')
      await user.type(screen.getByLabelText('Phone Number'), '555-123-4567')

      const submitButton = screen.getByRole('button', { name: /continue to payment/i })
      await user.click(submitButton)

      // Check that payment form is now displayed
      await waitFor(() => {
        expect(screen.getByText('Payment Information')).toBeInTheDocument()
      })

      // Check that progress indicator shows step 2 as active
      const step2 = screen.getByText('2')
      expect(step2).toHaveClass('bg-primary')
    })

    test('should validate phone number format', async () => {
      const mockOnNext = jest.fn()
      
      render(
        <TestWrapper>
          <ShippingForm onNext={mockOnNext} />
        </TestWrapper>
      )

      const phoneInput = screen.getByLabelText('Phone Number')
      expect(phoneInput).toHaveAttribute('type', 'tel')
    })
  })

  describe('Payment Form Validation and Submission', () => {
    test('should display payment form with security indicators', () => {
      const mockOnNext = jest.fn()
      const mockOnBack = jest.fn()
      
      render(
        <TestWrapper>
          <PaymentForm onNext={mockOnNext} onBack={mockOnBack} />
        </TestWrapper>
      )

      expect(screen.getByText('Payment Information')).toBeInTheDocument()
      expect(screen.getByTestId('lock-icon')).toBeInTheDocument()
      expect(screen.getByLabelText('Card Number')).toBeInTheDocument()
      expect(screen.getByLabelText('Expiration Date')).toBeInTheDocument()
      expect(screen.getByLabelText('CVV')).toBeInTheDocument()
    })

    test('should validate required payment form fields', async () => {
      const mockOnNext = jest.fn()
      const mockOnBack = jest.fn()
      
      render(
        <TestWrapper>
          <PaymentForm onNext={mockOnNext} onBack={mockOnBack} />
        </TestWrapper>
      )

      const submitButton = screen.getByRole('button', { name: /review order/i })
      await user.click(submitButton)

      // Check that form doesn't submit without required fields
      expect(mockOnNext).not.toHaveBeenCalled()

      // Check for required attributes
      const cardNumberInput = screen.getByLabelText('Card Number')
      const expirationInput = screen.getByLabelText('Expiration Date')
      const cvvInput = screen.getByLabelText('CVV')

      expect(cardNumberInput).toBeRequired()
      expect(expirationInput).toBeRequired()
      expect(cvvInput).toBeRequired()
    })

    test('should accept valid payment form data', async () => {
      const mockOnNext = jest.fn()
      const mockOnBack = jest.fn()
      
      render(
        <TestWrapper>
          <PaymentForm onNext={mockOnNext} onBack={mockOnBack} />
        </TestWrapper>
      )

      // Fill out payment form
      await user.type(screen.getByLabelText('Card Number'), '4111111111111111')
      await user.type(screen.getByLabelText('Expiration Date'), '12/25')
      await user.type(screen.getByLabelText('CVV'), '123')

      const submitButton = screen.getByRole('button', { name: /review order/i })
      await user.click(submitButton)

      // Check that form submits with valid data
      expect(mockOnNext).toHaveBeenCalledWith({
        cardNumber: '4111111111111111',
        expirationDate: '12/25',
        cvv: '123',
        couponCode: ''
      })
    })

    test('should handle coupon code application', async () => {
      const mockOnNext = jest.fn()
      const mockOnBack = jest.fn()
      
      render(
        <TestWrapper>
          <PaymentForm onNext={mockOnNext} onBack={mockOnBack} />
        </TestWrapper>
      )

      // Enter coupon code
      const couponInput = screen.getByPlaceholderText('Enter coupon code')
      await user.type(couponInput, 'SAVE10')

      const applyButton = screen.getByRole('button', { name: /apply/i })
      await user.click(applyButton)

      // Check that coupon applied message appears
      await waitFor(() => {
        expect(screen.getByText('Coupon applied successfully! 10% discount added.')).toBeInTheDocument()
      })
    })

    test('should navigate back to shipping when back button is clicked', async () => {
      const mockOnNext = jest.fn()
      const mockOnBack = jest.fn()
      
      render(
        <TestWrapper>
          <PaymentForm onNext={mockOnNext} onBack={mockOnBack} />
        </TestWrapper>
      )

      const backButton = screen.getByRole('button', { name: /back to shipping/i })
      await user.click(backButton)

      expect(mockOnBack).toHaveBeenCalled()
    })

    test('should progress to order review after payment form submission', async () => {
      render(
        <TestWrapper>
          <CheckoutPage />
        </TestWrapper>
      )

      // Complete shipping form first
      await user.type(screen.getByLabelText('Full Name'), 'John Doe')
      await user.type(screen.getByLabelText('Street Address'), '123 Main St')
      await user.type(screen.getByLabelText('City'), 'New York')
      await user.type(screen.getByLabelText('State'), 'NY')
      await user.type(screen.getByLabelText('Postal Code'), '10001')
      await user.type(screen.getByLabelText('Phone Number'), '555-123-4567')

      let submitButton = screen.getByRole('button', { name: /continue to payment/i })
      await user.click(submitButton)

      // Wait for payment form
      await waitFor(() => {
        expect(screen.getByText('Payment Information')).toBeInTheDocument()
      })

      // Complete payment form
      await user.type(screen.getByLabelText('Card Number'), '4111111111111111')
      await user.type(screen.getByLabelText('Expiration Date'), '12/25')
      await user.type(screen.getByLabelText('CVV'), '123')

      submitButton = screen.getByRole('button', { name: /review order/i })
      await user.click(submitButton)

      // Check that order review is displayed
      await waitFor(() => {
        expect(screen.getByText('Order Summary')).toBeInTheDocument()
      })

      // Check that progress indicator shows step 3 as active
      const step3 = screen.getByText('3')
      expect(step3).toHaveClass('bg-primary')
    })
  })

  describe('Order Review Page Display', () => {
    const mockShippingData = {
      fullName: 'John Doe',
      streetAddress: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      phoneNumber: '555-123-4567'
    }

    const mockPaymentData = {
      cardNumber: '4111111111111111',
      expirationDate: '12/25',
      cvv: '123',
      couponCode: 'SAVE10'
    }

    test('should display complete order details', () => {
      const mockOnBack = jest.fn()
      const mockOnComplete = jest.fn()
      
      render(
        <TestWrapper>
          <OrderReview
            shippingData={mockShippingData}
            paymentData={mockPaymentData}
            onBack={mockOnBack}
            onComplete={mockOnComplete}
          />
        </TestWrapper>
      )

      // Check order summary
      expect(screen.getByText('Order Summary')).toBeInTheDocument()
      expect(screen.getByText('Elegant Silk Dress')).toBeInTheDocument()
      expect(screen.getByText('Cashmere Scarf')).toBeInTheDocument()

      // Check shipping address
      expect(screen.getByText('Shipping Address')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('123 Main St')).toBeInTheDocument()
      expect(screen.getByText('New York, NY 10001')).toBeInTheDocument()
      expect(screen.getByText('555-123-4567')).toBeInTheDocument()

      // Check payment method
      expect(screen.getByText('Payment Method')).toBeInTheDocument()
      expect(screen.getByText('**** **** **** 1111')).toBeInTheDocument()
      expect(screen.getByText('Expires 12/25')).toBeInTheDocument()

      // Check order total
      expect(screen.getByText('Order Total')).toBeInTheDocument()
      expect(screen.getByText('Subtotal')).toBeInTheDocument()
      expect(screen.getByText('Shipping')).toBeInTheDocument()
      expect(screen.getByText('Discount')).toBeInTheDocument()
      expect(screen.getByText('Total')).toBeInTheDocument()
    })

    test('should display product details with images', () => {
      const mockOnBack = jest.fn()
      const mockOnComplete = jest.fn()
      
      render(
        <TestWrapper>
          <OrderReview
            shippingData={mockShippingData}
            paymentData={mockPaymentData}
            onBack={mockOnBack}
            onComplete={mockOnComplete}
          />
        </TestWrapper>
      )

      // Check product images
      const dressImage = screen.getByAltText('Elegant Silk Dress')
      const scarfImage = screen.getByAltText('Cashmere Scarf')
      
      expect(dressImage).toBeInTheDocument()
      expect(dressImage).toHaveAttribute('src', '/elegant-black-silk-dress.png')
      
      expect(scarfImage).toBeInTheDocument()
      expect(scarfImage).toHaveAttribute('src', '/cashmere-scarf.png')

      // Check product details
      expect(screen.getByText('Black • Size M')).toBeInTheDocument()
      expect(screen.getByText('Cream • Size One Size')).toBeInTheDocument()
      expect(screen.getByText('Qty: 1')).toBeInTheDocument()
    })

    test('should calculate and display correct totals', () => {
      const mockOnBack = jest.fn()
      const mockOnComplete = jest.fn()
      
      render(
        <TestWrapper>
          <OrderReview
            shippingData={mockShippingData}
            paymentData={mockPaymentData}
            onBack={mockOnBack}
            onComplete={mockOnComplete}
          />
        </TestWrapper>
      )

      // Check individual item prices
      expect(screen.getByText('$299.00')).toBeInTheDocument() // Dress price
      expect(screen.getByText('$89.00')).toBeInTheDocument()  // Scarf price

      // Check calculated totals
      expect(screen.getByText('$388.00')).toBeInTheDocument() // Subtotal
      expect(screen.getByText('$15.00')).toBeInTheDocument()  // Shipping
      expect(screen.getByText('-$38.80')).toBeInTheDocument() // 10% discount
      expect(screen.getByText('$364.20')).toBeInTheDocument() // Final total
    })

    test('should provide edit cart functionality', () => {
      const mockOnBack = jest.fn()
      const mockOnComplete = jest.fn()
      
      render(
        <TestWrapper>
          <OrderReview
            shippingData={mockShippingData}
            paymentData={mockPaymentData}
            onBack={mockOnBack}
            onComplete={mockOnComplete}
          />
        </TestWrapper>
      )

      const editCartButton = screen.getByRole('button', { name: /edit cart/i })
      expect(editCartButton).toBeInTheDocument()
    })
  })

  describe('Back Button Functionality', () => {
    test('should navigate back to payment from order review', () => {
      const mockShippingData = {
        fullName: 'John Doe',
        streetAddress: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        phoneNumber: '555-123-4567'
      }

      const mockPaymentData = {
        cardNumber: '4111111111111111',
        expirationDate: '12/25',
        cvv: '123',
        couponCode: ''
      }

      const mockOnBack = jest.fn()
      const mockOnComplete = jest.fn()
      
      render(
        <TestWrapper>
          <OrderReview
            shippingData={mockShippingData}
            paymentData={mockPaymentData}
            onBack={mockOnBack}
            onComplete={mockOnComplete}
          />
        </TestWrapper>
      )

      const backButton = screen.getByRole('button', { name: /back to payment/i })
      fireEvent.click(backButton)

      expect(mockOnBack).toHaveBeenCalled()
    })

    test('should maintain form data when navigating back', async () => {
      render(
        <TestWrapper>
          <CheckoutPage />
        </TestWrapper>
      )

      // Complete shipping form
      await user.type(screen.getByLabelText('Full Name'), 'John Doe')
      await user.type(screen.getByLabelText('Street Address'), '123 Main St')
      await user.type(screen.getByLabelText('City'), 'New York')
      await user.type(screen.getByLabelText('State'), 'NY')
      await user.type(screen.getByLabelText('Postal Code'), '10001')
      await user.type(screen.getByLabelText('Phone Number'), '555-123-4567')

      let submitButton = screen.getByRole('button', { name: /continue to payment/i })
      await user.click(submitButton)

      // Go to payment form and back
      await waitFor(() => {
        expect(screen.getByText('Payment Information')).toBeInTheDocument()
      })

      const backButton = screen.getByRole('button', { name: /back to shipping/i })
      await user.click(backButton)

      // Check that shipping form data is preserved
      await waitFor(() => {
        expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
        expect(screen.getByDisplayValue('123 Main St')).toBeInTheDocument()
        expect(screen.getByDisplayValue('New York')).toBeInTheDocument()
      })
    })
  })

  describe('Order Completion', () => {
    test('should complete order when complete button is clicked', async () => {
      const mockShippingData = {
        fullName: 'John Doe',
        streetAddress: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        phoneNumber: '555-123-4567'
      }

      const mockPaymentData = {
        cardNumber: '4111111111111111',
        expirationDate: '12/25',
        cvv: '123',
        couponCode: ''
      }

      const mockOnBack = jest.fn()
      const mockOnComplete = jest.fn()
      
      render(
        <TestWrapper>
          <OrderReview
            shippingData={mockShippingData}
            paymentData={mockPaymentData}
            onBack={mockOnBack}
            onComplete={mockOnComplete}
          />
        </TestWrapper>
      )

      const completeButton = screen.getByRole('button', { name: /complete order/i })
      await user.click(completeButton)

      expect(mockOnComplete).toHaveBeenCalled()
    })

    test('should show success confirmation after order completion', async () => {
      // Mock window.alert
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})

      render(
        <TestWrapper>
          <CheckoutPage />
        </TestWrapper>
      )

      // Complete entire checkout flow
      // Fill shipping form
      await user.type(screen.getByLabelText('Full Name'), 'John Doe')
      await user.type(screen.getByLabelText('Street Address'), '123 Main St')
      await user.type(screen.getByLabelText('City'), 'New York')
      await user.type(screen.getByLabelText('State'), 'NY')
      await user.type(screen.getByLabelText('Postal Code'), '10001')
      await user.type(screen.getByLabelText('Phone Number'), '555-123-4567')

      let submitButton = screen.getByRole('button', { name: /continue to payment/i })
      await user.click(submitButton)

      // Fill payment form
      await waitFor(() => {
        expect(screen.getByText('Payment Information')).toBeInTheDocument()
      })

      await user.type(screen.getByLabelText('Card Number'), '4111111111111111')
      await user.type(screen.getByLabelText('Expiration Date'), '12/25')
      await user.type(screen.getByLabelText('CVV'), '123')

      submitButton = screen.getByRole('button', { name: /review order/i })
      await user.click(submitButton)

      // Complete order
      await waitFor(() => {
        expect(screen.getByText('Order Summary')).toBeInTheDocument()
      })

      const completeButton = screen.getByRole('button', { name: /complete order/i })
      await user.click(completeButton)

      // Check for success message
      expect(alertSpy).toHaveBeenCalledWith('Order completed successfully!')

      alertSpy.mockRestore()
    })
  })

  describe('Form Accessibility', () => {
    test('should have proper form labels and accessibility attributes', () => {
      const mockOnNext = jest.fn()
      
      render(
        <TestWrapper>
          <ShippingForm onNext={mockOnNext} />
        </TestWrapper>
      )

      // Check that all form inputs have proper labels
      const fullNameInput = screen.getByLabelText('Full Name')
      const streetAddressInput = screen.getByLabelText('Street Address')
      const cityInput = screen.getByLabelText('City')
      const stateInput = screen.getByLabelText('State')
      const postalCodeInput = screen.getByLabelText('Postal Code')
      const phoneInput = screen.getByLabelText('Phone Number')

      expect(fullNameInput).toBeInTheDocument()
      expect(streetAddressInput).toBeInTheDocument()
      expect(cityInput).toBeInTheDocument()
      expect(stateInput).toBeInTheDocument()
      expect(postalCodeInput).toBeInTheDocument()
      expect(phoneInput).toBeInTheDocument()

      // Check that inputs have proper IDs matching their labels
      expect(fullNameInput).toHaveAttribute('id', 'fullName')
      expect(streetAddressInput).toHaveAttribute('id', 'streetAddress')
      expect(cityInput).toHaveAttribute('id', 'city')
      expect(stateInput).toHaveAttribute('id', 'state')
      expect(postalCodeInput).toHaveAttribute('id', 'postalCode')
      expect(phoneInput).toHaveAttribute('id', 'phoneNumber')
    })

    test('should have proper form structure and semantics', () => {
      const mockOnNext = jest.fn()
      
      render(
        <TestWrapper>
          <ShippingForm onNext={mockOnNext} />
        </TestWrapper>
      )

      // Check that form element exists
      const form = screen.getByRole('form')
      expect(form).toBeInTheDocument()

      // Check that submit button is properly labeled
      const submitButton = screen.getByRole('button', { name: /continue to payment/i })
      expect(submitButton).toHaveAttribute('type', 'submit')
    })
  })
})