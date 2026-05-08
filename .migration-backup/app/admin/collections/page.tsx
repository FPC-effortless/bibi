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
  Folder,
  Package,
  TrendingUp,
  Eye,
  ArrowUpDown
} from "lucide-react"

// Mock collections data
const mockCollections = [
  {
    id: "col-001",
    name: "New Arrivals",
    description: "Discover our latest collection of carefully curated luxury pieces",
    href: "/collections/new-arrivals",
    image: "/new-arrivals-collection.jpg",
    status: "active",
    productCount: 24,
    createdDate: "2024-01-15",
    isVisible: true,
    sortOrder: 1
  },
  {
    id: "col-002", 
    name: "Dresses",
    description: "From elegant evening gowns to sophisticated day dresses",
    href: "/collections/dresses",
    image: "/dresses-collection.jpg",
    status: "active",
    productCount: 45,
    createdDate: "2024-01-10",
    isVisible: true,
    sortOrder: 2
  },
  {
    id: "col-003",
    name: "Evening Wear",
    description: "Luxurious pieces for special occasions and formal events",
    href: "/collections/evening",
    image: "/evening-wear-collection.jpg", 
    status: "active",
    productCount: 18,
    createdDate: "2024-01-08",
    isVisible: true,
    sortOrder: 3
  },
  {
    id: "col-004",
    name: "Essentials",
    description: "Timeless wardrobe staples crafted with exceptional quality",
    href: "/collections/essentials",
    image: "/essentials-collection.jpg",
    status: "active", 
    productCount: 32,
    createdDate: "2024-01-05",
    isVisible: true,
    sortOrder: 4
  },
  {
    id: "col-005",
    name: "Summer 2024",
    description: "Light and airy pieces perfect for the warmer months",
    href: "/collections/summer-2024",
    image: "/summer-2024-collection.jpg",
    status: "draft",
    productCount: 0,
    createdDate: "2024-08-20",
    isVisible: false,
    sortOrder: 5
  }
]

const statusColors = {
  active: "bg-green-100 text-green-800",
  draft: "bg-yellow-100 text-yellow-800",
  archived: "bg-gray-100 text-gray-800"
}

export default function CollectionsAdminPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [collections] = useState(mockCollections)
  const [activeTab, setActiveTab] = useState("manage")

  const filteredCollections = collections.filter(collection => {
    const matchesSearch = collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         collection.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || collection.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalCollections = collections.length
  const activeCollections = collections.filter(c => c.status === "active").length
  const totalProducts = collections.reduce((sum, c) => sum + c.productCount, 0)
  const visibleCollections = collections.filter(c => c.isVisible).length

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Collections Management</h2>
          <p className="text-muted-foreground">Organize and manage product collections</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Collections</CardTitle>
              <Folder className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCollections}</div>
              <p className="text-xs text-muted-foreground">{activeCollections} active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <p className="text-xs text-muted-foreground">Across all collections</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visible Collections</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{visibleCollections}</div>
              <p className="text-xs text-muted-foreground">Public collections</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Products</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(totalProducts / activeCollections)}</div>
              <p className="text-xs text-muted-foreground">Per collection</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manage">Manage Collections</TabsTrigger>
            <TabsTrigger value="create">Create Collection</TabsTrigger>
          </TabsList>

          <TabsContent value="manage" className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex gap-4 w-full sm:w-auto">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search collections..."
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
                New Collection
              </Button>
            </div>

            {/* Collections Table */}
            <div className="rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Collection</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Visibility</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCollections.map((collection) => (
                    <TableRow key={collection.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                            <Folder className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{collection.name}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {collection.description}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-muted-foreground" />
                          <span>{collection.productCount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[collection.status as keyof typeof statusColors]}>
                          {collection.status.charAt(0).toUpperCase() + collection.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={collection.isVisible ? "default" : "secondary"}>
                          {collection.isVisible ? "Visible" : "Hidden"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{collection.sortOrder}</span>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <ArrowUpDown className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{collection.createdDate}</TableCell>
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
                <CardTitle>Create New Collection</CardTitle>
                <CardDescription>Set up a new product collection with custom settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Collection Name</label>
                    <Input placeholder="e.g., Summer 2024" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">URL Slug</label>
                    <Input placeholder="e.g., summer-2024" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea 
                    placeholder="Brief description of the collection..." 
                    rows={3} 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sort Order</label>
                    <Input placeholder="1" type="number" />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium">Collection Image</label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Upload collection hero image</p>
                      <p className="text-xs text-muted-foreground">
                        Recommended size: 1200x800px
                      </p>
                    </div>
                    <Button variant="outline" className="mt-4">
                      Choose Image
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="visible" />
                    <label htmlFor="visible" className="text-sm font-medium">
                      Make collection visible to customers
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="featured" />
                    <label htmlFor="featured" className="text-sm font-medium">
                      Feature on homepage
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">SEO Settings</label>
                  <div className="space-y-3 p-4 border rounded-lg">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">Meta Title</label>
                      <Input placeholder="Collection name - bibiere" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">Meta Description</label>
                      <Textarea 
                        placeholder="Brief description for search engines..." 
                        rows={2} 
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button className="bg-bibiere-burgundy hover:bg-bibiere-burgundy/90 text-white">
                    Create Collection
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
