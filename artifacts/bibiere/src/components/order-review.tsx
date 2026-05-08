
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, ShoppingBag } from "lucide-react"
import type { ShippingData, PaymentData } from "./shipping-form"

interface OrderReviewProps {
  shippingData: ShippingData
  paymentData: PaymentData
  onBack: () => void
  onComplete: () => void
}

const cartItems = [
  {
    id: 1,
    name: "Elegant Silk Dress",
    color: "Black",
    size: "M",
    price: 299.0,
    quantity: 1,
    image: "/elegant-black-silk-dress.png",
  },
  {
    id: 2,
    name: "Cashmere Scarf",
    color: "Cream",
    size: "One Size",
    price: 89.0,
    quantity: 1,
    image: "/cashmere-scarf.png",
  },
]

export default function OrderReview({ shippingData, paymentData, onBack, onComplete }: OrderReviewProps) {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 15.0
  const discount = paymentData.couponCode ? subtotal * 0.1 : 0
  const total = subtotal + shipping - discount

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-serif text-foreground flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-border last:border-b-0">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md bg-muted"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {item.color} • Size {item.size}
                    </p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">${item.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center">
                <Button variant="ghost" className="text-accent hover:text-accent/80 p-0 h-auto">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit Cart
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-serif text-foreground">Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-foreground space-y-1">
                <p className="font-medium">{shippingData.fullName}</p>
                <p>{shippingData.streetAddress}</p>
                <p>
                  {shippingData.city}, {shippingData.state} {shippingData.postalCode}
                </p>
                <p>{shippingData.phoneNumber}</p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-serif text-foreground">Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-foreground">
                <p>**** **** **** {paymentData.cardNumber.slice(-4)}</p>
                <p>Expires {paymentData.expirationDate}</p>
              </div>
            </CardContent>
          </Card>

          {/* Order Total */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-serif text-foreground">Order Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">${shipping.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="text-accent">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-border pt-2">
                  <div className="flex justify-between font-medium text-lg">
                    <span className="text-foreground">Total</span>
                    <span className="text-foreground">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1 border-border hover:bg-muted bg-transparent"
            >
              Back to Payment
            </Button>
            <Button
              onClick={onComplete}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3"
            >
              Complete Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
