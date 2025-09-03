'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Copy,
  Percent,
  DollarSign,
  Calendar,
  Users,
  TrendingUp
} from "lucide-react"

// Mock coupon data
const mockCoupons = [
  {
    id: "COUP-001",
    code: "WELCOME20",
    name: "Welcome Discount",
    type: "percentage",
    value: 20,
    minOrder: 100,
    maxDiscount: 50,
    usageLimit: 1000,
    usedCount: 234,
    status: "active",
    startDate: "2024-08-01",
    endDate: "2024-12-31",
    customerType: "new"
  },
  {
    id: "COUP-002",
    code: "SUMMER30",
    name: "Summer Sale",
    type: "percentage", 
    value: 30,
    minOrder: 200,
    maxDiscount: 100,
    usageLimit: 500,
    usedCount: 456,
    status: "active",
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    customerType: "all"
  },
  {
    id: "COUP-003",
    code: "FREESHIP",
    name: "Free Shipping",
    type: "shipping",
    value: 0,
    minOrder: 75,
    maxDiscount: 15,
    usageLimit: 2000,
    usedCount: 1234,
    status: "active",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    customerType: "all"
  },
  {
    id: "COUP-004",
    code: "VIP50",
    name: "VIP Exclusive",
    type: "fixed",
    value: 50,
    minOrder: 300,
    maxDiscount: 50,
    usageLimit: 100,
    usedCount: 23,
    status: "active",
    startDate: "2024-08-01",
    endDate: "2024-09-30",
    customerType: "vip"
  },
  {
    id: "COUP-005",
    code: "EXPIRED10",
    name: "Old Promotion",
    type: "percentage",
    value: 10,
    minOrder: 50,
    maxDiscount: 25,
    usageLimit: 500,
    usedCount: 500,
    status: "expired",
    startDate: "2024-01-01",
    endDate: "2024-07-31",
    customerType: "all"
  }
]

const statusColors = {
  active: "bg-green-100 text-green-800",
  expired: "bg-red-100 text-red-800",
  scheduled: "bg-blue-100 text-blue-800",
  disabled: "bg-gray-100 text-gray-800"
}

const typeColors = {
  percentage: "bg-purple-100 text-purple-800",
  fixed: "bg-blue-100 text-blue-800",
  shipping: "bg-orange-100 text-orange-800"
}

export default function CouponsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [coupons] = useState(mockCoupons)
  const [activeTab, setActiveTab] = useState("coupons")

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coupon.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || coupon.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalCoupons = coupons.length
  const activeCoupons = coupons.filter(c => c.status === "active").length
  const totalUsage = coupons.reduce((sum, c) => sum + c.usedCount, 0)
  const totalSavings = coupons.reduce((sum, c) => {
    if (c.type === "percentage") {
      return sum + (c.usedCount * (c.maxDiscount || 0))
    } else if (c.type === "fixed") {
      return sum + (c.usedCount * c.value)
    }
    return sum + (c.usedCount * 15) // shipping average
  }, 0)

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Coupon Management</h2>
          <p className="text-muted-foreground">Create and manage discount coupons and promotions</p>
        </div>

        {/* Coupon Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Coupons</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCoupons}</div>
              <p className="text-xs text-muted-foreground">{activeCoupons} active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsage.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Across all coupons</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalSavings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Customer savings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Usage Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">67.8%</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="coupons">Manage Coupons</TabsTrigger>
            <TabsTrigger value="create">Create Coupon</TabsTrigger>
          </TabsList>

          <TabsContent value="coupons" className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex gap-4 w-full sm:w-auto">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search coupons..."
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="bg-bibiere-burgundy hover:bg-bibiere-burgundy/90 text-white">
                <Plus className="mr-2 h-4 w-4" />
                New Coupon
              </Button>
            </div>

            {/* Coupons Table */}
            <div className="rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Valid Until</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCoupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                            {coupon.code}
                          </code>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{coupon.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Min order: ${coupon.minOrder}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={typeColors[coupon.type as keyof typeof typeColors]}>
                          {coupon.type.charAt(0).toUpperCase() + coupon.type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {coupon.type === "percentage" ? `${coupon.value}%` : 
                         coupon.type === "fixed" ? `$${coupon.value}` : "Free"}
                        {coupon.maxDiscount > 0 && coupon.type === "percentage" && (
                          <p className="text-xs text-muted-foreground">Max: ${coupon.maxDiscount}</p>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{coupon.usedCount}/{coupon.usageLimit}</p>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div 
                              className="bg-bibiere-burgundy h-1.5 rounded-full" 
                              style={{ width: `${(coupon.usedCount / coupon.usageLimit) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[coupon.status as keyof typeof statusColors]}>
                          {coupon.status.charAt(0).toUpperCase() + coupon.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{coupon.endDate}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create New Coupon</CardTitle>
                <CardDescription>Set up discount codes and promotional offers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Coupon Code</label>
                    <Input placeholder="e.g., SUMMER20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Coupon Name</label>
                    <Input placeholder="e.g., Summer Sale 2024" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Discount Type</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                        <SelectItem value="shipping">Free Shipping</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Discount Value</label>
                    <Input placeholder="20" type="number" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Max Discount ($)</label>
                    <Input placeholder="100" type="number" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Minimum Order Value</label>
                    <Input placeholder="50" type="number" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Usage Limit</label>
                    <Input placeholder="1000" type="number" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Start Date</label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">End Date</label>
                    <Input type="date" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Customer Eligibility</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Customers</SelectItem>
                      <SelectItem value="new">New Customers Only</SelectItem>
                      <SelectItem value="vip">VIP Customers Only</SelectItem>
                      <SelectItem value="returning">Returning Customers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="auto-apply" />
                  <label htmlFor="auto-apply" className="text-sm font-medium">
                    Auto-apply at checkout (if conditions are met)
                  </label>
                </div>

                <div className="flex gap-4">
                  <Button className="bg-bibiere-burgundy hover:bg-bibiere-burgundy/90 text-white">
                    Create Coupon
                  </Button>
                  <Button variant="outline">
                    Save as Draft
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
