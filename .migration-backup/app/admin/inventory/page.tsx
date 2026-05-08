"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Package, TrendingDown, TrendingUp, Search, Filter, Download, Plus } from "lucide-react"

// Mock inventory data
const mockInventory = [
  {
    id: "inv-001",
    productName: "Silk Evening Gown",
    sku: "SEG-001",
    category: "Dresses",
    currentStock: 12,
    reservedStock: 3,
    availableStock: 9,
    reorderLevel: 5,
    maxStock: 25,
    lastRestocked: "2024-01-20",
    supplier: "Luxury Textiles Co.",
    cost: 1200,
    status: "in_stock"
  },
  {
    id: "inv-002",
    productName: "Cashmere Coat",
    sku: "CC-002", 
    category: "Outerwear",
    currentStock: 8,
    reservedStock: 2,
    availableStock: 6,
    reorderLevel: 10,
    maxStock: 20,
    lastRestocked: "2024-01-18",
    supplier: "Premium Fabrics Ltd.",
    cost: 950,
    status: "low_stock"
  },
  {
    id: "inv-003",
    productName: "Leather Handbag",
    sku: "LH-003",
    category: "Accessories", 
    currentStock: 0,
    reservedStock: 0,
    availableStock: 0,
    reorderLevel: 8,
    maxStock: 30,
    lastRestocked: "2024-01-10",
    supplier: "Artisan Leather Works",
    cost: 450,
    status: "out_of_stock"
  },
  {
    id: "inv-004",
    productName: "Wool Blazer",
    sku: "WB-004",
    category: "Blazers",
    currentStock: 15,
    reservedStock: 1,
    availableStock: 14,
    reorderLevel: 6,
    maxStock: 18,
    lastRestocked: "2024-01-22",
    supplier: "Elite Tailoring Supply",
    cost: 680,
    status: "in_stock"
  },
  {
    id: "inv-005",
    productName: "Designer Heels",
    sku: "DH-005",
    category: "Shoes",
    currentStock: 4,
    reservedStock: 1,
    availableStock: 3,
    reorderLevel: 8,
    maxStock: 24,
    lastRestocked: "2024-01-15",
    supplier: "Luxury Footwear Inc.",
    cost: 380,
    status: "low_stock"
  }
]

export default function AdminInventoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")

  const categories = ["All", "Dresses", "Outerwear", "Accessories", "Blazers", "Shoes"]
  const statuses = ["All", "in_stock", "low_stock", "out_of_stock"]

  const filteredInventory = mockInventory.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
    const matchesStatus = selectedStatus === "All" || item.status === selectedStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_stock":
        return <Badge className="bg-green-100 text-green-800">In Stock</Badge>
      case "low_stock":
        return <Badge className="bg-yellow-100 text-yellow-800">Low Stock</Badge>
      case "out_of_stock":
        return <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getStockLevel = (current: number, reorder: number) => {
    if (current === 0) return "critical"
    if (current <= reorder) return "low"
    return "good"
  }

  const totalValue = mockInventory.reduce((sum, item) => sum + (item.currentStock * item.cost), 0)
  const lowStockItems = mockInventory.filter(item => item.status === "low_stock").length
  const outOfStockItems = mockInventory.filter(item => item.status === "out_of_stock").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">Track stock levels and manage inventory</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Stock
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Package className="w-4 h-4" />
              Total Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockInventory.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              Low Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowStockItems}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Out of Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{outOfStockItems}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inventory Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
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
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status === "All" ? "All Status" : status.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items ({filteredInventory.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead>Reserved</TableHead>
                  <TableHead>Reorder Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Restocked</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => {
                  const stockLevel = getStockLevel(item.currentStock, item.reorderLevel)
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.productName}</div>
                          <div className="text-sm text-muted-foreground">{item.supplier}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${
                            stockLevel === "critical" ? "text-red-600" :
                            stockLevel === "low" ? "text-yellow-600" :
                            "text-green-600"
                          }`}>
                            {item.currentStock}
                          </span>
                          <div className="w-16 bg-muted rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                stockLevel === "critical" ? "bg-red-500" :
                                stockLevel === "low" ? "bg-yellow-500" :
                                "bg-green-500"
                              }`}
                              style={{ width: `${Math.min((item.currentStock / item.maxStock) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{item.availableStock}</TableCell>
                      <TableCell>{item.reservedStock}</TableCell>
                      <TableCell>{item.reorderLevel}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell className="text-sm">{item.lastRestocked}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Restock
                          </Button>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Stock Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            Stock Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockInventory
              .filter(item => item.status === "low_stock" || item.status === "out_of_stock")
              .map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      item.status === "out_of_stock" ? "bg-red-500" : "bg-yellow-500"
                    }`} />
                    <div>
                      <div className="font-medium">{item.productName}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.status === "out_of_stock" 
                          ? "Out of stock - Reorder immediately" 
                          : `Low stock - ${item.currentStock} remaining (Reorder at ${item.reorderLevel})`
                        }
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant={item.status === "out_of_stock" ? "destructive" : "default"}>
                    Reorder Now
                  </Button>
                </div>
              ))}
            {mockInventory.filter(item => item.status === "low_stock" || item.status === "out_of_stock").length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No stock alerts at this time</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
