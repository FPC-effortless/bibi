"use client"

import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Package, Truck, Mail, Download, ArrowRight } from "lucide-react"

// Mock order data - in a real app, this would be fetched based on the order ID
const mockOrder = {
  id: "ORD-2024-001234",
  status: "confirmed",
  date: "2024-08-25",
  estimatedDelivery: "2024-08-30",
  total: 2423.84,
  subtotal: 2198.00,
  shipping: 0,
  tax: 175.84,
  discount: 219.80,
  promoCode: "WELCOME10",
  customer: {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567"
  },
  shippingAddress: {
    name: "Sarah Johnson",
    street: "123 Luxury Lane",
    city: "Beverly Hills",
    state: "CA",
    zip: "90210",
    country: "United States"
  },
  billingAddress: {
    name: "Sarah Johnson",
    street: "123 Luxury Lane", 
    city: "Beverly Hills",
    state: "CA",
    zip: "90210",
    country: "United States"
  },
  items: [
    {
      id: "1",
      name: "Elegant Silk Evening Dress",
      price: 1299,
      originalPrice: 1599,
      size: "M",
      color: "Midnight Black",
      quantity: 1,
      image: "/elegant-black-silk-dress.png"
    },
    {
      id: "2",
      name: "Cashmere Blend Coat",
      price: 899,
      size: "L", 
      color: "Camel",
      quantity: 1,
      image: "/cozy-wool-coat.png"
    }
  ],
  paymentMethod: {
    type: "Credit Card",
    last4: "4242",
    brand: "Visa"
  }
}

export default function OrderConfirmationPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Success Header */}
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-serif font-bold">Order Confirmed!</h1>
              <p className="text-muted-foreground">
                Thank you for your purchase. Your order has been confirmed and is being processed.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="text-sm">
                Order #{mockOrder.id}
              </Badge>
              <Badge variant="outline" className="text-sm">
                Estimated delivery: {new Date(mockOrder.estimatedDelivery).toLocaleDateString()}
              </Badge>
            </div>
          </div>

          {/* Order Status Timeline */}
          <div className="border border-border rounded-lg p-6">
            <h2 className="text-xl font-serif font-semibold mb-6">Order Status</h2>
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">Order Placed</p>
                  <p className="text-xs text-muted-foreground">Aug 25, 2024</p>
                </div>
              </div>
              <div className="flex-1 h-px bg-muted mx-4"></div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-10 h-10 bg-bibiere-burgundy rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">Processing</p>
                  <p className="text-xs text-muted-foreground">1-2 days</p>
                </div>
              </div>
              <div className="flex-1 h-px bg-muted mx-4"></div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                  <Truck className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">Shipped</p>
                  <p className="text-xs text-muted-foreground">3-4 days</p>
                </div>
              </div>
              <div className="flex-1 h-px bg-muted mx-4"></div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">Delivered</p>
                  <p className="text-xs text-muted-foreground">Aug 30, 2024</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Order Items */}
            <div className="space-y-6">
              <div className="border border-border rounded-lg p-6">
                <h2 className="text-xl font-serif font-semibold mb-6">Order Items</h2>
                <div className="space-y-4">
                  {mockOrder.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                        <p className="text-xs text-muted-foreground text-center">Image</p>
                      </div>
                      <div className="flex-1 space-y-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <div className="text-sm text-muted-foreground">
                          Size: {item.size} • Color: {item.color}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                        </div>
                        <div className="flex gap-2">
                          <span className="font-medium">${item.price}</span>
                          {item.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              ${item.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border border-border rounded-lg p-6">
                <h2 className="text-xl font-serif font-semibold mb-6">Order Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${mockOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({mockOrder.promoCode})</span>
                    <span>-${mockOrder.discount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{mockOrder.shipping === 0 ? 'Free' : `$${mockOrder.shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${mockOrder.tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${mockOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer & Shipping Info */}
            <div className="space-y-6">
              <div className="border border-border rounded-lg p-6">
                <h2 className="text-xl font-serif font-semibold mb-6">Customer Information</h2>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">{mockOrder.customer.name}</p>
                    <p className="text-sm text-muted-foreground">{mockOrder.customer.email}</p>
                    <p className="text-sm text-muted-foreground">{mockOrder.customer.phone}</p>
                  </div>
                </div>
              </div>

              <div className="border border-border rounded-lg p-6">
                <h2 className="text-xl font-serif font-semibold mb-6">Shipping Address</h2>
                <div className="text-sm space-y-1">
                  <p className="font-medium">{mockOrder.shippingAddress.name}</p>
                  <p>{mockOrder.shippingAddress.street}</p>
                  <p>
                    {mockOrder.shippingAddress.city}, {mockOrder.shippingAddress.state} {mockOrder.shippingAddress.zip}
                  </p>
                  <p>{mockOrder.shippingAddress.country}</p>
                </div>
              </div>

              <div className="border border-border rounded-lg p-6">
                <h2 className="text-xl font-serif font-semibold mb-6">Payment Method</h2>
                <div className="text-sm">
                  <p>{mockOrder.paymentMethod.brand} ending in {mockOrder.paymentMethod.last4}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </Button>
            <Button variant="outline">
              <Mail className="w-4 h-4 mr-2" />
              Email Receipt
            </Button>
            <Button asChild>
              <Link href="/account/orders">
                View Order History
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          {/* Next Steps */}
          <div className="border border-border rounded-lg p-6 text-center space-y-4">
            <h3 className="text-lg font-serif font-semibold">What's Next?</h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="space-y-2">
                <Mail className="w-8 h-8 mx-auto text-bibiere-burgundy" />
                <p className="font-medium">Email Confirmation</p>
                <p className="text-muted-foreground">
                  You'll receive an email confirmation shortly with your order details.
                </p>
              </div>
              <div className="space-y-2">
                <Package className="w-8 h-8 mx-auto text-bibiere-burgundy" />
                <p className="font-medium">Processing</p>
                <p className="text-muted-foreground">
                  Your order will be processed and prepared for shipping within 1-2 business days.
                </p>
              </div>
              <div className="space-y-2">
                <Truck className="w-8 h-8 mx-auto text-bibiere-burgundy" />
                <p className="font-medium">Shipping Updates</p>
                <p className="text-muted-foreground">
                  You'll receive tracking information once your order ships.
                </p>
              </div>
            </div>
          </div>

          {/* Continue Shopping */}
          <div className="text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/collections">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
