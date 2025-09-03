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
  Camera,
  Heart,
  Eye,
  Calendar,
  Tag,
  Palette
} from "lucide-react"

// Mock lookbook data
const mockLookbookItems = [
  {
    id: "look-001",
    title: "Autumn Elegance",
    description: "Sophisticated layering with rich textures and warm tones for the modern woman.",
    image: "/lookbook-autumn-elegance.jpg",
    category: "seasonal",
    season: "Autumn 2024",
    occasion: null,
    tags: ["Layering", "Textures", "Warm Tones"],
    status: "published",
    createdDate: "2024-08-15",
    isFeature: true,
    pieces: [
      { name: "Cashmere Coat", price: 2495, id: "coat-001" },
      { name: "Silk Blouse", price: 695, id: "blouse-001" },
      { name: "Tailored Trousers", price: 895, id: "trousers-001" }
    ],
    stylingTip: "Layer different textures to create visual depth while maintaining a cohesive color palette."
  },
  {
    id: "look-002",
    title: "Business Chic",
    description: "Professional elegance that commands respect in the boardroom.",
    image: "/lookbook-business-chic.jpg",
    category: "occasion",
    season: null,
    occasion: "Professional",
    tags: ["Professional", "Elegant", "Powerful"],
    status: "published",
    createdDate: "2024-08-12",
    isFeature: false,
    pieces: [
      { name: "Blazer", price: 1495, id: "blazer-001" },
      { name: "Pencil Skirt", price: 695, id: "skirt-002" },
      { name: "Silk Camisole", price: 395, id: "camisole-001" }
    ],
    stylingTip: "Choose structured pieces in neutral tones for a polished, professional appearance."
  },
  {
    id: "look-003",
    title: "Evening Glamour",
    description: "Sophisticated drama for special occasions and memorable nights.",
    image: "/lookbook-evening-glamour.jpg",
    category: "occasion",
    season: null,
    occasion: "Evening",
    tags: ["Glamorous", "Dramatic", "Special Occasion"],
    status: "draft",
    createdDate: "2024-08-20",
    isFeature: true,
    pieces: [
      { name: "Evening Gown", price: 2895, id: "gown-001" },
      { name: "Statement Earrings", price: 295, id: "earrings-001" },
      { name: "Clutch Bag", price: 795, id: "clutch-001" }
    ],
    stylingTip: "Let one statement piece be the star - keep other elements refined and complementary."
  },
  {
    id: "look-004",
    title: "Winter Minimalism",
    description: "Clean lines and luxurious fabrics create an effortlessly chic winter wardrobe.",
    image: "/lookbook-winter-minimalism.jpg",
    category: "seasonal",
    season: "Winter 2024",
    occasion: null,
    tags: ["Minimalist", "Clean Lines", "Luxury"],
    status: "published",
    createdDate: "2024-08-10",
    isFeature: false,
    pieces: [
      { name: "Wool Turtleneck", price: 545, id: "turtleneck-001" },
      { name: "Midi Skirt", price: 795, id: "skirt-001" },
      { name: "Leather Boots", price: 1295, id: "boots-001" }
    ],
    stylingTip: "Focus on quality over quantity - invest in timeless pieces that work across seasons."
  }
]

const statusColors = {
  published: "bg-green-100 text-green-800",
  draft: "bg-yellow-100 text-yellow-800",
  archived: "bg-gray-100 text-gray-800"
}

const categoryColors = {
  seasonal: "bg-blue-100 text-blue-800",
  occasion: "bg-purple-100 text-purple-800"
}

export default function LookbookAdminPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [lookbookItems] = useState(mockLookbookItems)
  const [activeTab, setActiveTab] = useState("manage")

  const filteredItems = lookbookItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const totalLooks = lookbookItems.length
  const publishedLooks = lookbookItems.filter(item => item.status === "published").length
  const featuredLooks = lookbookItems.filter(item => item.isFeature).length
  const totalPieces = lookbookItems.reduce((sum, item) => sum + item.pieces.length, 0)

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Lookbook Management</h2>
          <p className="text-muted-foreground">Create and manage styling inspiration and curated looks</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Looks</CardTitle>
              <Camera className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLooks}</div>
              <p className="text-xs text-muted-foreground">{publishedLooks} published</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Featured Looks</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{featuredLooks}</div>
              <p className="text-xs text-muted-foreground">Homepage featured</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pieces</CardTitle>
              <Palette className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPieces}</div>
              <p className="text-xs text-muted-foreground">Styled products</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">New looks added</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manage">Manage Looks</TabsTrigger>
            <TabsTrigger value="create">Create Look</TabsTrigger>
          </TabsList>

          <TabsContent value="manage" className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex gap-4 w-full sm:w-auto">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search looks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="seasonal">Seasonal</SelectItem>
                    <SelectItem value="occasion">Occasion</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="bg-bibiere-burgundy hover:bg-bibiere-burgundy/90 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Create Look
              </Button>
            </div>

            {/* Lookbook Table */}
            <div className="rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Look</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Pieces</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                            <Camera className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{item.title}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge className={categoryColors[item.category as keyof typeof categoryColors]}>
                            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            {item.season || item.occasion}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {item.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="text-xs bg-muted px-2 py-1 rounded-full">
                              {tag}
                            </span>
                          ))}
                          {item.tags.length > 2 && (
                            <span className="text-xs text-muted-foreground">
                              +{item.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Palette className="w-4 h-4 text-muted-foreground" />
                          <span>{item.pieces.length}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.isFeature ? (
                          <Heart className="w-4 h-4 text-bibiere-burgundy fill-current" />
                        ) : (
                          <Heart className="w-4 h-4 text-muted-foreground" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[item.status as keyof typeof statusColors]}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.createdDate}</TableCell>
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
                <CardTitle>Create New Look</CardTitle>
                <CardDescription>Add a new styled look to the lookbook collection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Look Title</label>
                    <Input placeholder="e.g., Autumn Elegance" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="seasonal">Seasonal</SelectItem>
                        <SelectItem value="occasion">Occasion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea 
                    placeholder="Describe the look and styling inspiration..." 
                    rows={3} 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Season/Occasion</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select season or occasion" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spring-2024">Spring 2024</SelectItem>
                        <SelectItem value="summer-2024">Summer 2024</SelectItem>
                        <SelectItem value="autumn-2024">Autumn 2024</SelectItem>
                        <SelectItem value="winter-2024">Winter 2024</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="evening">Evening</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="special-occasion">Special Occasion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags</label>
                  <Input placeholder="e.g., Layering, Textures, Warm Tones (comma separated)" />
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium">Look Photography</label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Upload lookbook images</p>
                      <p className="text-xs text-muted-foreground">
                        High-quality lifestyle photography recommended
                      </p>
                    </div>
                    <Button variant="outline" className="mt-4">
                      Choose Images
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium">Featured Products</label>
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">Select products to feature in this look</p>
                      <Button variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Product
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-sm">No products selected</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Styling Tip</label>
                  <Textarea 
                    placeholder="Share professional styling advice for this look..." 
                    rows={3} 
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="featured-look" />
                  <label htmlFor="featured-look" className="text-sm font-medium">
                    Feature this look on homepage
                  </label>
                </div>

                <div className="flex gap-4">
                  <Button className="bg-bibiere-burgundy hover:bg-bibiere-burgundy/90 text-white">
                    Create Look
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
