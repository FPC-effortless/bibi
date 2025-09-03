"use client"

import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Package, Truck, MapPin, CreditCard, Download, RotateCcw } from "lucide-react"

// Mock order data - in a real app, this would be fetched based on the order ID
const mockOrderDetails = {
  id: "ORD-2024-001234",
  status: "shipped",
  date: "2024-08-25",
  estimatedDelivery: "2024-08-30",
  shippedDate: "2024-08-27",
  trackingNumber: "1Z999AA1234567890",
  carrier: "UPS",
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
      image: "/elegant-black-silk-dress.png",
      sku: "ESK-001-M-BLK"
    },
    {
      id: "2",
      name: "Cashmere Blend Coat",
      price: 899,
      size: "L",
      color: "Camel",
      quantity: 1,
      image: "/cozy-wool-coat.png",
      sku: "CBC-002-L-CAM"
    }
  ],
  paymentMethod: {
    type: "Credit Card",
    last4: "4242",
    brand: "Visa"
  },
  timeline: [
    { status: "Order Placed", date: "2024-08-25T10:30:00Z", completed: true },
    { status: "Payment Confirmed", date: "2024-08-25T10:31:00Z", completed: true },
    { status: "Processing", date: "2024-08-26T09:00:00Z", completed: true },
    { status: "Shipped", date: "2024-08-27T14:30:00Z", completed: true },
    { status: "Out for Delivery", date: null, completed: false },
    { status: "Delivered", date: null, completed: false }
  ]
}

const statusColors = {
  processing: "bg-yellow-100 text-yellow-800",
  shipped: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800"
}

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const order = mockOrderDetails

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Button variant="ghost" asChild className="mb-2">
                <Link href="/account/orders">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Orders
                </Link>
              </Button>
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-serif font-bold">Order #{order.id}</h1>
                <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Placed on {new Date(order.date).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download Receipt
              </Button>
              {order.status === "delivered" && (
                <Button variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reorder
                </Button>
              )}
            </div>
          </div>

          {/* Order Timeline */}
          {order.status === "shipped" && (
            <div className="border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif font-semibold">Tracking Information</h2>
                <Button variant="outline" size="sm">
                  <Truck className="w-4 h-4 mr-2" />
                  Track with {order.carrier}
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Tracking Number: <strong>{order.trackingNumber}</strong></span>
                  <span>Carrier: <strong>{order.carrier}</strong></span>
                </div>
                <div className="space-y-3">
                  {order.timeline.map((event, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${event.completed ? 'bg-green-600' : 'bg-muted'}`} />
                      <div className="flex-1 flex justify-between items-center">
                        <span className={event.completed ? 'font-medium' : 'text-muted-foreground'}>
                          {event.status}
                        </span>
                        {event.date && (
                          <span className="text-sm text-muted-foreground">
                            {new Date(event.date).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Order Items */}
            <div className="space-y-6">
              <div className="border border-border rounded-lg p-6">
                <h2 className="text-xl font-serif font-semibold mb-6">Order Items</h2>
                <div className="space-y-6">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-20 h-24 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                        <p className="text-xs text-muted-foreground text-center">Product Image</p>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Size: {item.size}</p>
                          <p>Color: {item.color}</p>
                          <p>Quantity: {item.quantity}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">${item.price}</span>
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
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({order.promoCode})</span>
                    <span>-${order.discount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${order.tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer & Address Info */}
            <div className="space-y-6">
              <div className="border border-border rounded-lg p-6">
                <h2 className="text-xl font-serif font-semibold mb-6">Customer Information</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{order.customer.name}</span>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>{order.customer.email}</p>
                    <p>{order.customer.phone}</p>
                  </div>
                </div>
              </div>

              <div className="border border-border rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <h2 className="text-xl font-serif font-semibold">Shipping Address</h2>
                </div>
                <div className="text-sm space-y-1">
                  <p className="font-medium">{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>

              <div className="border border-border rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5 text-muted-foreground" />
                  <h2 className="text-xl font-serif font-semibold">Payment Method</h2>
                </div>
                <div className="text-sm">
                  <p>{order.paymentMethod.brand} ending in {order.paymentMethod.last4}</p>
                </div>
              </div>

              <div className="border border-border rounded-lg p-6">
                <h2 className="text-xl font-serif font-semibold mb-4">Billing Address</h2>
                <div className="text-sm space-y-1">
                  <p className="font-medium">{order.billingAddress.name}</p>
                  <p>{order.billingAddress.street}</p>
                  <p>
                    {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zip}
                  </p>
                  <p>{order.billingAddress.country}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="border border-border rounded-lg p-6 text-center space-y-4">
            <h3 className="text-lg font-serif font-semibold">Need Help?</h3>
            <p className="text-muted-foreground">
              Have questions about your order? Our customer service team is here to help.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/returns">Return Policy</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/faq">FAQ</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
