'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, Truck, Package, CheckCircle } from "lucide-react"

// Mock order data
const mockOrders = [
  {
    id: "ORD-001",
    customer: "Emma Thompson",
    email: "emma@example.com",
    total: 599.99,
    status: "pending",
    items: 2,
    date: "2024-08-24",
    shippingAddress: "123 Main St, New York, NY 10001"
  },
  {
    id: "ORD-002", 
    customer: "James Wilson",
    email: "james@example.com",
    total: 299.99,
    status: "processing",
    items: 1,
    date: "2024-08-23",
    shippingAddress: "456 Oak Ave, Los Angeles, CA 90210"
  },
  {
    id: "ORD-003",
    customer: "Sarah Davis",
    email: "sarah@example.com", 
    total: 899.99,
    status: "shipped",
    items: 3,
    date: "2024-08-22",
    shippingAddress: "789 Pine St, Chicago, IL 60601"
  },
  {
    id: "ORD-004",
    customer: "Michael Brown",
    email: "michael@example.com",
    total: 449.99,
    status: "delivered",
    items: 2,
    date: "2024-08-21",
    shippingAddress: "321 Elm St, Houston, TX 77001"
  },
  {
    id: "ORD-005",
    customer: "Lisa Garcia",
    email: "lisa@example.com",
    total: 199.99,
    status: "cancelled",
    items: 1,
    date: "2024-08-20",
    shippingAddress: "654 Maple Dr, Phoenix, AZ 85001"
  }
]

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800", 
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800"
}

const statusIcons = {
  pending: Package,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: Package
}

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [orders, setOrders] = useState(mockOrders)

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Order Management</h2>
          <p className="text-muted-foreground">Track and manage customer orders</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                const StatusIcon = statusIcons[order.status as keyof typeof statusIcons]
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-sm text-muted-foreground">{order.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{order.items} items</TableCell>
                    <TableCell>${order.total}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Select
                          value={order.status}
                          onValueChange={(value) => updateOrderStatus(order.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-card rounded-lg border p-4">
            <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
            <p className="text-2xl font-bold">{orders.length}</p>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <p className="text-sm font-medium text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {orders.filter(o => o.status === 'pending').length}
            </p>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <p className="text-sm font-medium text-muted-foreground">Processing</p>
            <p className="text-2xl font-bold text-blue-600">
              {orders.filter(o => o.status === 'processing').length}
            </p>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <p className="text-sm font-medium text-muted-foreground">Shipped</p>
            <p className="text-2xl font-bold text-purple-600">
              {orders.filter(o => o.status === 'shipped').length}
            </p>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <p className="text-sm font-medium text-muted-foreground">Delivered</p>
            <p className="text-2xl font-bold text-green-600">
              {orders.filter(o => o.status === 'delivered').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
