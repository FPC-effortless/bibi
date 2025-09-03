"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Package, Eye, Download, Filter } from "lucide-react"

// Mock order data
const mockOrders = [
  {
    id: "ORD-2024-001234",
    date: "2024-08-25",
    status: "processing",
    total: 2423.84,
    itemCount: 2,
    estimatedDelivery: "2024-08-30",
    items: [
      { name: "Elegant Silk Evening Dress", image: "/elegant-black-silk-dress.png" },
      { name: "Cashmere Blend Coat", image: "/cozy-wool-coat.png" }
    ]
  },
  {
    id: "ORD-2024-001189",
    date: "2024-08-15",
    status: "delivered",
    total: 1599.00,
    itemCount: 1,
    deliveredDate: "2024-08-20",
    items: [
      { name: "Premium Wool Blazer", image: "/wool-blazer.png" }
    ]
  },
  {
    id: "ORD-2024-001156",
    date: "2024-08-01",
    status: "shipped",
    total: 899.50,
    itemCount: 3,
    trackingNumber: "1Z999AA1234567890",
    estimatedDelivery: "2024-08-28",
    items: [
      { name: "Silk Scarf Collection", image: "/silk-scarf.png" },
      { name: "Leather Handbag", image: "/leather-handbag.png" },
      { name: "Pearl Earrings", image: "/pearl-earrings.png" }
    ]
  },
  {
    id: "ORD-2024-001098",
    date: "2024-07-20",
    status: "cancelled",
    total: 2199.00,
    itemCount: 1,
    items: [
      { name: "Designer Evening Gown", image: "/evening-gown.png" }
    ]
  }
]

const statusColors = {
  processing: "bg-yellow-100 text-yellow-800",
  shipped: "bg-blue-100 text-blue-800", 
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800"
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState(mockOrders)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  const filteredOrders = orders
    .filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesStatus = statusFilter === "all" || order.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.date).getTime() - new Date(a.date).getTime()
      if (sortBy === "oldest") return new Date(a.date).getTime() - new Date(b.date).getTime()
      if (sortBy === "highest") return b.total - a.total
      if (sortBy === "lowest") return a.total - b.total
      return 0
    })

  const getStatusText = (order: any) => {
    switch (order.status) {
      case "processing":
        return `Processing • Est. delivery ${new Date(order.estimatedDelivery).toLocaleDateString()}`
      case "shipped":
        return `Shipped • Tracking: ${order.trackingNumber}`
      case "delivered":
        return `Delivered on ${new Date(order.deliveredDate).toLocaleDateString()}`
      case "cancelled":
        return "Cancelled"
      default:
        return order.status
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-serif font-bold">Order History</h1>
            <p className="text-muted-foreground">
              Track and manage your bibiere orders
            </p>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search orders or products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="highest">Highest Amount</SelectItem>
                <SelectItem value="lowest">Lowest Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <Package className="w-16 h-16 mx-auto text-muted-foreground" />
              <div className="space-y-2">
                <h3 className="text-xl font-serif font-semibold">No Orders Found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || statusFilter !== "all" 
                    ? "Try adjusting your search or filter criteria"
                    : "You haven't placed any orders yet"
                  }
                </p>
              </div>
              {!searchQuery && statusFilter === "all" && (
                <Button asChild>
                  <Link href="/collections">Start Shopping</Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <div key={order.id} className="border border-border rounded-lg p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">Order #{order.id}</h3>
                        <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Placed on {new Date(order.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {getStatusText(order)}
                      </p>
                    </div>
                    <div className="text-right space-y-2">
                      <p className="text-lg font-semibold">${order.total.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Order Items Preview */}
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div
                          key={index}
                          className="w-12 h-12 bg-muted rounded-lg border-2 border-background flex items-center justify-center"
                        >
                          <span className="text-xs text-muted-foreground">IMG</span>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-12 h-12 bg-muted rounded-lg border-2 border-background flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">+{order.items.length - 3}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {order.items[0].name}
                        {order.items.length > 1 && ` and ${order.items.length - 1} more`}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/order/confirmation/${order.id}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Link>
                    </Button>
                    
                    {order.status === "shipped" && (
                      <Button variant="outline" size="sm">
                        <Package className="w-4 h-4 mr-2" />
                        Track Package
                      </Button>
                    )}
                    
                    {order.status === "delivered" && (
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download Receipt
                      </Button>
                    )}
                    
                    {(order.status === "delivered" || order.status === "cancelled") && (
                      <Button variant="outline" size="sm">
                        Reorder Items
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination would go here in a real app */}
          {filteredOrders.length > 0 && (
            <div className="text-center text-sm text-muted-foreground">
              Showing {filteredOrders.length} of {orders.length} orders
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
