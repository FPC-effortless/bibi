"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import CheckoutProgress from "@/components/checkout-progress"
import ShippingForm, { type ShippingData } from "@/components/shipping-form"
import PaymentForm, { type PaymentData } from "@/components/payment-form"
import OrderReview from "@/components/order-review"

export default function CheckoutPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [shippingData, setShippingData] = useState<ShippingData | null>(null)
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)

  const handleShippingNext = (data: ShippingData) => {
    setShippingData(data)
    setCurrentStep(2)
  }

  const handlePaymentNext = (data: PaymentData) => {
    setPaymentData(data)
    setCurrentStep(3)
  }

  const handlePaymentBack = () => {
    setCurrentStep(1)
  }

  const handleReviewBack = () => {
    setCurrentStep(2)
  }

  const handleOrderComplete = () => {
    const orderId = `BB-${Date.now()}`
    router.push(`/order/confirmation/${orderId}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <CheckoutProgress currentStep={currentStep} />

      <div className="container mx-auto px-4 py-12">
        {currentStep === 1 && <ShippingForm onNext={handleShippingNext} />}

        {currentStep === 2 && <PaymentForm onNext={handlePaymentNext} onBack={handlePaymentBack} />}

        {currentStep === 3 && shippingData && paymentData && (
          <OrderReview
            shippingData={shippingData}
            paymentData={paymentData}
            onBack={handleReviewBack}
            onComplete={handleOrderComplete}
          />
        )}
      </div>
    </div>
  )
}
