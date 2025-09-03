"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ShippingFormProps {
  onNext: (data: ShippingData) => void
}

export interface ShippingData {
  fullName: string
  streetAddress: string
  city: string
  state: string
  postalCode: string
  phoneNumber: string
}

export interface PaymentData {
  cardNumber: string
  expirationDate: string
  couponCode?: string
}

export default function ShippingForm({ onNext }: ShippingFormProps) {
  const [formData, setFormData] = useState<ShippingData>({
    fullName: "",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    phoneNumber: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext(formData)
  }

  const handleChange = (field: keyof ShippingData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-serif text-foreground">Shipping Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName" className="text-sm font-medium text-foreground">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  className="mt-1 bg-input border-border focus:ring-ring"
                  required
                />
              </div>

              <div>
                <Label htmlFor="streetAddress" className="text-sm font-medium text-foreground">
                  Street Address
                </Label>
                <Input
                  id="streetAddress"
                  type="text"
                  value={formData.streetAddress}
                  onChange={(e) => handleChange("streetAddress", e.target.value)}
                  className="mt-1 bg-input border-border focus:ring-ring"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city" className="text-sm font-medium text-foreground">
                    City
                  </Label>
                  <Input
                    id="city"
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    className="mt-1 bg-input border-border focus:ring-ring"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="state" className="text-sm font-medium text-foreground">
                    State
                  </Label>
                  <Input
                    id="state"
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleChange("state", e.target.value)}
                    className="mt-1 bg-input border-border focus:ring-ring"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="postalCode" className="text-sm font-medium text-foreground">
                    Postal Code
                  </Label>
                  <Input
                    id="postalCode"
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => handleChange("postalCode", e.target.value)}
                    className="mt-1 bg-input border-border focus:ring-ring"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phoneNumber" className="text-sm font-medium text-foreground">
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
                  className="mt-1 bg-input border-border focus:ring-ring"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3"
            >
              Continue to Payment
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
