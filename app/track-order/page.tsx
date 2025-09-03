"use client"

import { useState } from "react"
import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Package, Truck, MapPin, Clock, CheckCircle, AlertCircle } from "lucide-react"

// Mock tracking data
const mockTrackingData = {
  orderNumber: "ORD-2024-001234",
  trackingNumber: "1Z999AA1234567890",
  carrier: "UPS",
  status: "in_transit",
  estimatedDelivery: "2024-08-30",
  currentLocation: "Los Angeles, CA",
  events: [
    {
      status: "Order Placed",
      location: "bibiere Warehouse",
      date: "2024-08-25T10:30:00Z",
      description: "Your order has been received and is being processed"
    },
    {
      status: "Processing",
      location: "bibiere Warehouse",
      date: "2024-08-26T09:00:00Z",
      description: "Order is being prepared for shipment"
    },
    {
      status: "Shipped",
      location: "bibiere Warehouse",
      date: "2024-08-27T14:30:00Z",
      description: "Package has been picked up by UPS"
    },
    {
      status: "In Transit",
      location: "Los Angeles, CA",
      date: "2024-08-28T08:15:00Z",
      description: "Package is on its way to the destination"
    },
    {
      status: "Out for Delivery",
      location: "Beverly Hills, CA",
      date: null,
      description: "Package will be delivered today"
    }
  ]
}

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("")
  const [email, setEmail] = useState("")
  const [trackingData, setTrackingData] = useState<typeof mockTrackingData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    // Simulate API call
    setTimeout(() => {
      if (orderNumber.toLowerCase().includes("ord-2024")) {
        setTrackingData(mockTrackingData)
      } else {
        setError("Order not found. Please check your order number and email address.")
      }
      setIsLoading(false)
    }, 1000)
  }

  const getStatusIcon = (status: string, isCompleted: boolean) => {
    if (!isCompleted) {
      return <div className="w-3 h-3 rounded-full bg-muted" />
    }
    
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "out for delivery":
        return <Truck className="w-5 h-5 text-blue-600" />
      case "in transit":
        return <Package className="w-5 h-5 text-blue-600" />
      default:
        return <CheckCircle className="w-5 h-5 text-green-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "out_for_delivery":
      case "in_transit":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (trackingData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-serif font-bold">Order Tracking</h1>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge variant="outline">Order #{trackingData.orderNumber}</Badge>
                <Badge variant="outline">Tracking: {trackingData.trackingNumber}</Badge>
              </div>
            </div>

            {/* Status Overview */}
            <div className="border border-border rounded-lg p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-serif font-semibold">Current Status</h2>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge className={getStatusColor(trackingData.status)}>
                      {trackingData.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <span className="text-muted-foreground">
                      Currently in {trackingData.currentLocation}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                  <p className="font-semibold">
                    {new Date(trackingData.estimatedDelivery).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Order Placed</span>
                  <span>Processing</span>
                  <span>Shipped</span>
                  <span>In Transit</span>
                  <span>Delivered</span>
                </div>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((step, index) => (
                    <div key={step} className="flex items-center flex-1">
                      <div className={`w-4 h-4 rounded-full ${
                        index < 4 ? 'bg-green-600' : 'bg-muted'
                      }`} />
                      {index < 4 && (
                        <div className={`flex-1 h-1 ${
                          index < 3 ? 'bg-green-600' : 'bg-muted'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="border border-border rounded-lg p-6 space-y-6">
              <h2 className="text-xl font-serif font-semibold">Tracking History</h2>
              <div className="space-y-6">
                {trackingData.events.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      {getStatusIcon(event.status, event.date !== null)}
                      {index < trackingData.events.length - 1 && (
                        <div className={`w-px h-12 mt-2 ${
                          event.date ? 'bg-green-200' : 'bg-muted'
                        }`} />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-semibold ${
                          event.date ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {event.status}
                        </h3>
                        {event.date && (
                          <span className="text-sm text-muted-foreground">
                            {new Date(event.date).toLocaleString()}
                          </span>
                        )}
                      </div>
                      <p className={`text-sm ${
                        event.date ? 'text-muted-foreground' : 'text-muted-foreground/60'
                      }`}>
                        {event.description}
                      </p>
                      <p className={`text-sm ${
                        event.date ? 'text-muted-foreground' : 'text-muted-foreground/60'
                      }`}>
                        <MapPin className="w-3 h-3 inline mr-1" />
                        {event.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-border rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-serif font-semibold">Delivery Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Carrier:</span>
                    <span className="font-medium">{trackingData.carrier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service:</span>
                    <span className="font-medium">Ground Shipping</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Delivery:</span>
                    <span className="font-medium">
                      {new Date(trackingData.estimatedDelivery).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Address:</span>
                    <span className="font-medium text-right">
                      123 Luxury Lane<br />
                      Beverly Hills, CA 90210
                    </span>
                  </div>
                </div>
              </div>

              <div className="border border-border rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-serif font-semibold">Need Help?</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="w-4 h-4 mr-2" />
                    Track with {trackingData.carrier}
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Report an Issue
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Clock className="w-4 h-4 mr-2" />
                    Delivery Instructions
                  </Button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setTrackingData(null)
                  setOrderNumber("")
                  setEmail("")
                }}
              >
                Track Another Order
              </Button>
              <Button variant="outline">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-bibiere-burgundy/10 rounded-full flex items-center justify-center mx-auto">
              <Package className="w-10 h-10 text-bibiere-burgundy" />
            </div>
            <h1 className="text-3xl font-serif font-bold">Track Your Order</h1>
            <p className="text-muted-foreground">
              Enter your order details to get real-time tracking information
            </p>
          </div>

          {/* Tracking Form */}
          <div className="border border-border rounded-lg p-8 space-y-6">
            <form onSubmit={handleTrackOrder} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="order-number">Order Number</Label>
                <Input
                  id="order-number"
                  placeholder="ORD-2024-001234"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Found in your order confirmation email
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Email address used for the order
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Tracking..." : "Track Order"}
              </Button>
            </form>
          </div>

          {/* Alternative Tracking Methods */}
          <div className="space-y-6">
            <div className="text-center">
              <Separator className="mb-4" />
              <p className="text-sm text-muted-foreground">Other ways to track your order</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-border rounded-lg p-6 text-center space-y-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Truck className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Carrier Tracking</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Track directly with UPS, FedEx, or USPS using your tracking number
                  </p>
                  <Button variant="outline" size="sm">
                    Carrier Websites
                  </Button>
                </div>
              </div>

              <div className="border border-border rounded-lg p-6 text-center space-y-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Account Dashboard</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    View all your orders and tracking information in one place
                  </p>
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="text-center space-y-4">
            <h3 className="text-lg font-serif font-semibold">Need Help?</h3>
            <p className="text-sm text-muted-foreground">
              Can't find your order or having tracking issues?
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" size="sm">
                Contact Support
              </Button>
              <Button variant="outline" size="sm">
                View FAQ
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
