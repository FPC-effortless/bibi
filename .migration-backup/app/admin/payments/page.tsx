"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, DollarSign, TrendingUp, Search, Filter, Download, RefreshCw, AlertCircle } from "lucide-react"

// Mock payments data
const mockPayments = [
  {
    id: "pay-001",
    orderId: "ORD-1234",
    customer: "Sarah Johnson",
    amount: 2895,
    method: "Credit Card",
    status: "completed",
    transactionId: "txn_1234567890",
    gateway: "Stripe",
    createdAt: "2024-01-25 14:30",
    fee: 89.50
  },
  {
    id: "pay-002", 
    orderId: "ORD-1235",
    customer: "Emma Wilson",
    amount: 1495,
    method: "PayPal",
    status: "completed",
    transactionId: "pp_9876543210",
    gateway: "PayPal",
    createdAt: "2024-01-25 12:15",
    fee: 43.40
  },
  {
    id: "pay-003",
    orderId: "ORD-1236",
    customer: "Michael Chen",
    amount: 795,
    method: "Credit Card",
    status: "pending",
    transactionId: "txn_5555666677",
    gateway: "Stripe",
    createdAt: "2024-01-25 11:45",
    fee: 25.50
  },
  {
    id: "pay-004",
    orderId: "ORD-1237",
    customer: "Lisa Anderson",
    amount: 3200,
    method: "Bank Transfer",
    status: "failed",
    transactionId: "bt_1111222233",
    gateway: "Bank",
    createdAt: "2024-01-25 10:20",
    fee: 0
  },
  {
    id: "pay-005",
    orderId: "ORD-1238",
    customer: "David Miller",
    amount: 1295,
    method: "Apple Pay",
    status: "refunded",
    transactionId: "ap_4444555566",
    gateway: "Stripe",
    createdAt: "2024-01-24 16:30",
    fee: 37.75
  }
]

export default function AdminPaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [selectedMethod, setSelectedMethod] = useState("All")

  const statuses = ["All", "completed", "pending", "failed", "refunded"]
  const methods = ["All", "Credit Card", "PayPal", "Bank Transfer", "Apple Pay"]

  const filteredPayments = mockPayments.filter(payment => {
    const matchesSearch = payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "All" || payment.status === selectedStatus
    const matchesMethod = selectedMethod === "All" || payment.method === selectedMethod
    
    return matchesSearch && matchesStatus && matchesMethod
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      case "refunded":
        return <Badge className="bg-blue-100 text-blue-800">Refunded</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const totalRevenue = mockPayments
    .filter(p => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0)
  
  const totalFees = mockPayments
    .filter(p => p.status === "completed")
    .reduce((sum, p) => sum + p.fee, 0)

  const pendingPayments = mockPayments.filter(p => p.status === "pending").length
  const failedPayments = mockPayments.filter(p => p.status === "failed").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold">Payments</h1>
          <p className="text-muted-foreground">Manage transactions and payment processing</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              +12.5% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Processing Fees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalFees.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">
              {((totalFees / totalRevenue) * 100).toFixed(1)}% of revenue
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingPayments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Failed Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{failedPayments}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status === "All" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedMethod} onValueChange={setSelectedMethod}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Payment Method" />
              </SelectTrigger>
              <SelectContent>
                {methods.map(method => (
                  <SelectItem key={method} value={method}>{method}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payments ({filteredPayments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Gateway</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-mono text-sm">{payment.orderId}</TableCell>
                    <TableCell>
                      <div className="font-medium">{payment.customer}</div>
                      <div className="text-sm text-muted-foreground font-mono">
                        {payment.transactionId}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">${payment.amount.toLocaleString()}</TableCell>
                    <TableCell>{payment.method}</TableCell>
                    <TableCell>{payment.gateway}</TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell>${payment.fee.toFixed(2)}</TableCell>
                    <TableCell className="text-sm">{payment.createdAt}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                        {payment.status === "completed" && (
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            Refund
                          </Button>
                        )}
                        {payment.status === "failed" && (
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                            Retry
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {methods.slice(1).map((method) => {
                const methodPayments = mockPayments.filter(p => p.method === method && p.status === "completed")
                const methodTotal = methodPayments.reduce((sum, p) => sum + p.amount, 0)
                const percentage = totalRevenue > 0 ? (methodTotal / totalRevenue) * 100 : 0
                
                return (
                  <div key={method} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{method}</span>
                      <span className="text-muted-foreground">
                        ${methodTotal.toLocaleString()} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-bibiere-burgundy h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gateway Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Stripe", "PayPal", "Bank"].map((gateway) => {
                const gatewayPayments = mockPayments.filter(p => p.gateway === gateway)
                const successRate = gatewayPayments.length > 0 
                  ? (gatewayPayments.filter(p => p.status === "completed").length / gatewayPayments.length) * 100 
                  : 0
                
                return (
                  <div key={gateway} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <div className="font-medium">{gateway}</div>
                      <div className="text-sm text-muted-foreground">
                        {gatewayPayments.length} transactions
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{successRate.toFixed(1)}%</div>
                      <div className="text-sm text-muted-foreground">Success Rate</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
