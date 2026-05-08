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
import { Textarea } from "@/components/ui/textarea"
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Upload,
  Star,
  Package,
  TrendingUp,
  Eye,
  Calendar
} from "lucide-react"

// Mock new arrivals data
const mockNewArrivals = [
  {
    id: "na-001",
    name: "Silk Charmeuse Blouse",
    price: 695,
    image: "/silk-charmeuse-blouse.png",
    category: "Tops",
    color: "Ivory",
    isNew: true,
    isFeatured: true,
    status: "active",
    arrivalDate: "2024-08-15",
    stock: 24,
    description: "Luxurious silk charmeuse blouse with pearl button details"
  },
  {
    id: "na-002", 
    name: "Tailored Wool Trousers",
    price: 895,
    image: "/tailored-wool-trousers.png",
    category: "Bottoms",
    color: "Charcoal",
    isNew: true,
    isFeatured: false,
    status: "active",
    arrivalDate: "2024-08-12",
    stock: 18,
    description: "Impeccably tailored wool trousers with a modern silhouette"
  },
  {
    id: "na-003",
    name: "Cashmere Turtleneck", 
    price: 545,
    image: "/cashmere-turtleneck.png",
    category: "Knitwear",
    color: "Camel",
    isNew: true,
    isFeatured: true,
    status: "active",
    arrivalDate: "2024-08-10",
    stock: 31,
    description: "Ultra-soft cashmere turtleneck in a relaxed fit"
  },
  {
    id: "na-004",
    name: "Leather Midi Skirt",
    price: 1295,
    image: "/leather-midi-skirt.png", 
    category: "Skirts",
    color: "Black",
    isNew: true,
    isFeatured: false,
    status: "draft",
    arrivalDate: "2024-08-20",
    stock: 12,
    description: "Buttery soft leather midi skirt with subtle A-line silhouette"
  }
]

const statusColors = {
  active: "bg-green-100 text-green-800",
  draft: "bg-yellow-100 text-yellow-800", 
  archived: "bg-gray-100 text-gray-800"
}

export default function NewArrivalsAdminPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [newArrivals] = useState(mockNewArrivals)
  const [activeTab, setActiveTab] = useState("manage")

  const filteredArrivals = newArrivals.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalItems = newArrivals.length
  const activeItems = newArrivals.filter(item => item.status === "active").length
  const featuredItems = newArrivals.filter(item => item.isFeatured).length
  const totalValue = newArrivals.reduce((sum, item) => sum + (item.price * item.stock), 0)

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-serif font-bold text-foreground mb-2">New Arrivals Management</h2>
          <p className="text-muted-foreground">Manage new arrival products and featured items</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItems}</div>
              <p className="text-xs text-muted-foreground">{activeItems} active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Featured Items</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{featuredItems}</div>
              <p className="text-xs text-muted-foreground">Highlighted on homepage</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Inventory value</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">New additions</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manage">Manage Items</TabsTrigger>
            <TabsTrigger value="create">Add New Arrival</TabsTrigger>
          </TabsList>

          <TabsContent value="manage" className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex gap-4 w-full sm:w-auto">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search new arrivals..."
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
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="bg-bibiere-burgundy hover:bg-bibiere-burgundy/90 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Add New Item
              </Button>
            </div>

            {/* Items Table */}
            <div className="rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Arrival Date</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredArrivals.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.color}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell>${item.price}</TableCell>
                      <TableCell>{item.stock}</TableCell>
                      <TableCell>{item.arrivalDate}</TableCell>
                      <TableCell>
                        {item.isFeatured ? (
                          <Star className="w-4 h-4 text-bibiere-burgundy fill-current" />
                        ) : (
                          <Star className="w-4 h-4 text-muted-foreground" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[item.status as keyof typeof statusColors]}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
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
                <CardTitle>Add New Arrival</CardTitle>
                <CardDescription>Add a new product to the new arrivals collection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Product Name</label>
                    <Input placeholder="e.g., Silk Charmeuse Blouse" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tops">Tops</SelectItem>
                        <SelectItem value="bottoms">Bottoms</SelectItem>
                        <SelectItem value="dresses">Dresses</SelectItem>
                        <SelectItem value="knitwear">Knitwear</SelectItem>
                        <SelectItem value="outerwear">Outerwear</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea placeholder="Detailed product description..." rows={3} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Price ($)</label>
                    <Input placeholder="695" type="number" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Stock Quantity</label>
                    <Input placeholder="24" type="number" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Color</label>
                    <Input placeholder="e.g., Ivory" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Arrival Date</label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium">Product Images</label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Upload product images</p>
                      <p className="text-xs text-muted-foreground">
                        Drag and drop files here, or click to browse
                      </p>
                    </div>
                    <Button variant="outline" className="mt-4">
                      Choose Files
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="featured" />
                  <label htmlFor="featured" className="text-sm font-medium">
                    Feature this item on homepage
                  </label>
                </div>

                <div className="flex gap-4">
                  <Button className="bg-bibiere-burgundy hover:bg-bibiere-burgundy/90 text-white">
                    Add to New Arrivals
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
