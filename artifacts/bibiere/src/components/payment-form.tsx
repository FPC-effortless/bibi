
import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Tag } from "lucide-react"

interface PaymentFormProps {
  onNext: (data: PaymentData) => void
  onBack: () => void
}

export interface PaymentData {
  cardNumber: string
  expirationDate: string
  cvv: string
  couponCode: string
}

export default function PaymentForm({ onNext, onBack }: PaymentFormProps) {
  const [formData, setFormData] = useState<PaymentData>({
    cardNumber: "",
    expirationDate: "",
    cvv: "",
    couponCode: "",
  })
  const [couponApplied, setCouponApplied] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext(formData)
  }

  const handleChange = (field: keyof PaymentData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const applyCoupon = () => {
    if (formData.couponCode.trim()) {
      setCouponApplied(true)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-serif text-foreground flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="cardNumber" className="text-sm font-medium text-foreground">
                  Card Number
                </Label>
                <Input
                  id="cardNumber"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={(e) => handleChange("cardNumber", e.target.value)}
                  className="mt-1 bg-input border-border focus:ring-ring"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expirationDate" className="text-sm font-medium text-foreground">
                    Expiration Date
                  </Label>
                  <Input
                    id="expirationDate"
                    type="text"
                    placeholder="MM/YY"
                    value={formData.expirationDate}
                    onChange={(e) => handleChange("expirationDate", e.target.value)}
                    className="mt-1 bg-input border-border focus:ring-ring"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="cvv" className="text-sm font-medium text-foreground">
                    CVV
                  </Label>
                  <Input
                    id="cvv"
                    type="text"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={(e) => handleChange("cvv", e.target.value)}
                    className="mt-1 bg-input border-border focus:ring-ring"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <div className="space-y-4">
                <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Coupon Code
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter coupon code"
                    value={formData.couponCode}
                    onChange={(e) => handleChange("couponCode", e.target.value)}
                    className="bg-input border-border focus:ring-ring"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={applyCoupon}
                    className="border-border hover:bg-muted bg-transparent"
                  >
                    Apply
                  </Button>
                </div>
                {couponApplied && (
                  <p className="text-sm text-accent font-medium">Coupon applied successfully! 10% discount added.</p>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex-1 border-border hover:bg-muted bg-transparent"
              >
                Back to Shipping
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3"
              >
                Review Order
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
