"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X, SlidersHorizontal } from "lucide-react"
import ProductCard from "@/components/product-card"

// Mock search results data
const mockProducts = [
  {
    id: "1",
    name: "Elegant Silk Evening Dress",
    price: 1299,
    originalPrice: 1599,
    image: "/elegant-black-silk-dress.png",
    category: "Dresses",
    color: "Black",
    size: ["XS", "S", "M", "L", "XL"],
    material: "Silk",
    rating: 4.8,
    reviewCount: 127,
    isNew: false,
    isFeatured: true
  },
  {
    id: "2",
    name: "Cashmere Blend Coat",
    price: 899,
    image: "/cozy-wool-coat.png",
    category: "Outerwear",
    color: "Camel",
    size: ["S", "M", "L", "XL"],
    material: "Cashmere",
    rating: 4.9,
    reviewCount: 89,
    isNew: true,
    isFeatured: false
  },
  {
    id: "3",
    name: "Premium Wool Blazer",
    price: 1599,
    image: "/wool-blazer.png",
    category: "Blazers",
    color: "Navy",
    size: ["XS", "S", "M", "L"],
    material: "Wool",
    rating: 4.7,
    reviewCount: 156,
    isNew: false,
    isFeatured: true
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
    material: "Silk",
    rating: 4.6,
    reviewCount: 203,
    isNew: false,
    isFeatured: false
  }
]

const categories = ["All", "Dresses", "Outerwear", "Blazers", "Accessories"]
const colors = ["All", "Black", "Navy", "Camel", "Multi", "White", "Burgundy"]
const materials = ["All", "Silk", "Cashmere", "Wool", "Cotton", "Linen"]
const sizes = ["All", "XS", "S", "M", "L", "XL"]

function SearchContent() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [products, setProducts] = useState(mockProducts)
  const [filteredProducts, setFilteredProducts] = useState(mockProducts)
  const [showFilters, setShowFilters] = useState(false)
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedColor, setSelectedColor] = useState("All")
  const [selectedMaterial, setSelectedMaterial] = useState("All")
  const [selectedSize, setSelectedSize] = useState("All")
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })
  const [sortBy, setSortBy] = useState("relevance")
  const [showOnSale, setShowOnSale] = useState(false)
  const [showNew, setShowNew] = useState(false)

  useEffect(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.material.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
      const matchesColor = selectedColor === "All" || product.color === selectedColor
      const matchesMaterial = selectedMaterial === "All" || product.material === selectedMaterial
      const matchesSize = selectedSize === "All" || product.size.includes(selectedSize)
      
      const matchesPriceMin = !priceRange.min || product.price >= parseInt(priceRange.min)
      const matchesPriceMax = !priceRange.max || product.price <= parseInt(priceRange.max)
      
      const matchesOnSale = !showOnSale || product.originalPrice
      const matchesNew = !showNew || product.isNew

      return matchesSearch && matchesCategory && matchesColor && matchesMaterial && 
             matchesSize && matchesPriceMin && matchesPriceMax && matchesOnSale && matchesNew
    })

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      default:
        // Keep original order for relevance
        break
    }

    setFilteredProducts(filtered)
  }, [searchQuery, selectedCategory, selectedColor, selectedMaterial, selectedSize, 
      priceRange, sortBy, showOnSale, showNew, products])

  const clearAllFilters = () => {
    setSelectedCategory("All")
    setSelectedColor("All")
    setSelectedMaterial("All")
    setSelectedSize("All")
    setPriceRange({ min: "", max: "" })
    setShowOnSale(false)
    setShowNew(false)
  }

  const activeFiltersCount = [
    selectedCategory !== "All",
    selectedColor !== "All", 
    selectedMaterial !== "All",
    selectedSize !== "All",
    priceRange.min || priceRange.max,
    showOnSale,
    showNew
  ].filter(Boolean).length

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="space-y-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="sm:w-auto"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-serif font-bold">
                {searchQuery ? `Search Results for "${searchQuery}"` : "All Products"}
              </h1>
              <p className="text-muted-foreground">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
              </p>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 space-y-6">
              <div className="border border-border rounded-lg p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-serif font-semibold">Filters</h2>
                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                      <X className="w-4 h-4 mr-2" />
                      Clear All
                    </Button>
                  )}
                </div>

                <Separator />

                {/* Category Filter */}
                <div className="space-y-3">
                  <h3 className="font-medium">Category</h3>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range Filter */}
                <div className="space-y-3">
                  <h3 className="font-medium">Price Range</h3>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Min"
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    />
                    <Input
                      placeholder="Max"
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Color Filter */}
                <div className="space-y-3">
                  <h3 className="font-medium">Color</h3>
                  <Select value={selectedColor} onValueChange={setSelectedColor}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {colors.map(color => (
                        <SelectItem key={color} value={color}>
                          {color}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Material Filter */}
                <div className="space-y-3">
                  <h3 className="font-medium">Material</h3>
                  <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {materials.map(material => (
                        <SelectItem key={material} value={material}>
                          {material}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Size Filter */}
                <div className="space-y-3">
                  <h3 className="font-medium">Size</h3>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sizes.map(size => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Special Filters */}
                <div className="space-y-3">
                  <h3 className="font-medium">Special Offers</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="on-sale"
                        checked={showOnSale}
                        onCheckedChange={(checked) => setShowOnSale(checked as boolean)}
                      />
                      <label htmlFor="on-sale" className="text-sm">
                        On Sale
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="new-arrivals"
                        checked={showNew}
                        onCheckedChange={(checked) => setShowNew(checked as boolean)}
                      />
                      <label htmlFor="new-arrivals" className="text-sm">
                        New Arrivals
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-serif font-semibold">No Products Found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search terms or filters
                  </p>
                </div>
                <Button onClick={clearAllFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={`$${product.price}`}
                    primaryImage={product.image}
                    hoverImage={product.image}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Load More / Pagination */}
        {filteredProducts.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Products
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-bibiere-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading search...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
