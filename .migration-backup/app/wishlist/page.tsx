"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Heart, Search, Filter, ShoppingBag, Trash2, Share2 } from "lucide-react"
import ProductCard from "@/components/product-card"

// Mock wishlist data
const mockWishlistItems = [
  {
    id: "1",
    name: "Elegant Silk Evening Dress",
    price: 1299,
    originalPrice: 1599,
    image: "/elegant-black-silk-dress.png",
    category: "Dresses",
    color: "Midnight Black",
    size: ["XS", "S", "M", "L", "XL"],
    rating: 4.8,
    reviewCount: 127,
    inStock: true,
    stockCount: 8,
    dateAdded: "2024-08-20",
    isOnSale: true
  },
  {
    id: "2",
    name: "Cashmere Blend Coat",
    price: 899,
    image: "/cozy-wool-coat.png",
    category: "Outerwear",
    color: "Camel",
    size: ["S", "M", "L", "XL"],
    rating: 4.9,
    reviewCount: 89,
    inStock: true,
    stockCount: 3,
    dateAdded: "2024-08-18",
    isOnSale: false
  },
  {
    id: "3",
    name: "Premium Wool Blazer",
    price: 1599,
    image: "/wool-blazer.png",
    category: "Blazers",
    color: "Navy",
    size: ["XS", "S", "M", "L"],
    rating: 4.7,
    reviewCount: 156,
    inStock: false,
    stockCount: 0,
    dateAdded: "2024-08-15",
    isOnSale: false
  },
  {
    id: "4",
    name: "Silk Scarf Collection",
    price: 299,
    originalPrice: 399,
    image: "/silk-scarf.png",
    category: "Accessories",
    color: "Multi",
    size: ["One Size"],
    rating: 4.6,
    reviewCount: 203,
    inStock: true,
    stockCount: 15,
    dateAdded: "2024-08-10",
    isOnSale: true
  }
]

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState(mockWishlistItems)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const removeFromWishlist = (itemId: string) => {
    setWishlistItems(items => items.filter(item => item.id !== itemId))
    setSelectedItems(selected => selected.filter(id => id !== itemId))
  }

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(selected => 
      selected.includes(itemId) 
        ? selected.filter(id => id !== itemId)
        : [...selected, itemId]
    )
  }

  const removeSelectedItems = () => {
    setWishlistItems(items => items.filter(item => !selectedItems.includes(item.id)))
    setSelectedItems([])
  }

  const moveSelectedToCart = () => {
    // In a real app, this would add items to cart
    alert(`Moving ${selectedItems.length} items to cart`)
    setSelectedItems([])
  }

  const filteredItems = wishlistItems
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = categoryFilter === "all" || item.category.toLowerCase() === categoryFilter.toLowerCase()
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        case "oldest":
          return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  const categories = ["all", ...Array.from(new Set(wishlistItems.map(item => item.category.toLowerCase())))]

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <Heart className="w-24 h-24 mx-auto text-muted-foreground" />
              <h1 className="text-3xl font-serif font-bold">Your Wishlist is Empty</h1>
              <p className="text-muted-foreground">
                Save items you love to your wishlist and shop them later
              </p>
            </div>
            <div className="space-y-4">
              <Button asChild size="lg">
                <Link href="/collections">Discover Products</Link>
              </Button>
              <div>
                <Button variant="outline" asChild>
                  <Link href="/lookbook">Browse Lookbook</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-serif font-bold">My Wishlist</h1>
                <p className="text-muted-foreground">
                  {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
                </p>
              </div>
              <Button variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share Wishlist
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search wishlist..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bulk Actions */}
            {selectedItems.length > 0 && (
              <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg">
                <span className="text-sm font-medium">
                  {selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'} selected
                </span>
                <div className="flex gap-2">
                  <Button size="sm" onClick={moveSelectedToCart}>
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button size="sm" variant="outline" onClick={removeSelectedItems}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Wishlist Items */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-serif font-semibold">No Items Found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <div key={item.id} className="relative group">
                  {/* Selection Checkbox */}
                  <div className="absolute top-3 left-3 z-10">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleItemSelection(item.id)}
                      className="w-4 h-4 rounded border-border bg-background"
                    />
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background"
                    onClick={() => removeFromWishlist(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>

                  {/* Product Card */}
                  <div className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-[3/4] bg-muted flex items-center justify-center relative">
                      <p className="text-muted-foreground">Product Image</p>
                      {item.isOnSale && (
                        <Badge className="absolute top-3 left-3 bg-red-600">
                          Sale
                        </Badge>
                      )}
                      {!item.inStock && (
                        <Badge variant="secondary" className="absolute bottom-3 left-3">
                          Out of Stock
                        </Badge>
                      )}
                    </div>
                    
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-serif font-semibold line-clamp-2">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">${item.price}</span>
                        {item.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${item.originalPrice}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Added {new Date(item.dateAdded).toLocaleDateString()}</span>
                        {item.inStock && item.stockCount <= 5 && (
                          <Badge variant="secondary" className="text-xs">
                            Only {item.stockCount} left
                          </Badge>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          disabled={!item.inStock}
                          asChild={item.inStock}
                        >
                          {item.inStock ? (
                            <Link href={`/product/${item.id}`}>
                              <ShoppingBag className="w-4 h-4 mr-2" />
                              Add to Cart
                            </Link>
                          ) : (
                            <>
                              <ShoppingBag className="w-4 h-4 mr-2" />
                              Out of Stock
                            </>
                          )}
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/product/${item.id}`}>
                            View
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-4 pt-8">
            <Button variant="outline" asChild>
              <Link href="/collections">Continue Shopping</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/lookbook">Browse Lookbook</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
