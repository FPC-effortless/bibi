"use client"

import { useState, useEffect, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Search, Loader2, TrendingUp, Filter, X, ArrowUpDown } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

interface SearchResult {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  brand: string
  color: string
  size: string[]
  rating: number
  isNew: boolean
  onSale: boolean
}

interface SearchFilters {
  categories: string[]
  brands: string[]
  colors: string[]
  sizes: string[]
  priceRange: [number, number]
  rating: number
  showOnSale: boolean
  showNew: boolean
}

type SortOption = 'relevance' | 'price-low' | 'price-high' | 'newest' | 'rating' | 'name'

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('relevance')
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  
  // Enhanced filters state
  const [filters, setFilters] = useState<SearchFilters>({
    categories: [],
    brands: [],
    colors: [],
    sizes: [],
    priceRange: [0, 1000],
    rating: 0,
    showOnSale: false,
    showNew: false
  })

  // Mock enhanced search results with more detailed data
  const allProducts: SearchResult[] = [
    {
      id: 1,
      name: "Elegant Silk Dress",
      price: 299,
      originalPrice: 399,
      image: "/elegant-black-silk-dress.png",
      category: "Dresses",
      brand: "bibiere",
      color: "Black",
      size: ["XS", "S", "M", "L"],
      rating: 4.8,
      isNew: false,
      onSale: true
    },
    {
      id: 2,
      name: "Cashmere Wool Coat",
      price: 599,
      image: "/cozy-wool-coat.png",
      category: "Outerwear",
      brand: "bibiere",
      color: "Camel",
      size: ["S", "M", "L", "XL"],
      rating: 4.9,
      isNew: true,
      onSale: false
    },
    {
      id: 3,
      name: "Premium Tailored Blazer",
      price: 449,
      image: "/premium-tailored-blazer.png",
      category: "Blazers",
      brand: "bibiere",
      color: "Navy",
      size: ["XS", "S", "M", "L", "XL"],
      rating: 4.7,
      isNew: false,
      onSale: false
    },
    {
      id: 4,
      name: "Luxury Quilted Handbag",
      price: 799,
      originalPrice: 899,
      image: "/luxury-quilted-handbag.png",
      category: "Accessories",
      brand: "bibiere",
      color: "Black",
      size: ["One Size"],
      rating: 4.6,
      isNew: false,
      onSale: true
    },
    {
      id: 5,
      name: "Cashmere Scarf",
      price: 189,
      image: "/cashmere-scarf.png",
      category: "Accessories",
      brand: "bibiere",
      color: "Beige",
      size: ["One Size"],
      rating: 4.5,
      isNew: true,
      onSale: false
    },
    {
      id: 6,
      name: "Luxury Wristwatch",
      price: 1299,
      image: "/luxury-wristwatch.png",
      category: "Accessories",
      brand: "bibiere",
      color: "Gold",
      size: ["One Size"],
      rating: 4.9,
      isNew: true,
      onSale: false
    }
  ]

  const popularSearches = [
    "Silk dresses",
    "Cashmere coats",
    "Designer handbags",
    "Evening wear",
    "Luxury accessories",
    "New arrivals",
    "Sale items"
  ]

  // Available filter options
  const availableCategories = Array.from(new Set(allProducts.map(p => p.category)))
  const availableColors = Array.from(new Set(allProducts.map(p => p.color)))
  const availableSizes = Array.from(new Set(allProducts.flatMap(p => p.size)))

  // Generate search suggestions
  const generateSuggestions = (query: string): string[] => {
    if (!query.trim()) return []
    
    const suggestions = new Set<string>()
    const lowerQuery = query.toLowerCase()
    
    // Add product name matches
    allProducts.forEach(product => {
      if (product.name.toLowerCase().includes(lowerQuery)) {
        suggestions.add(product.name)
      }
      if (product.category.toLowerCase().includes(lowerQuery)) {
        suggestions.add(product.category)
      }
      if (product.brand.toLowerCase().includes(lowerQuery)) {
        suggestions.add(product.brand)
      }
      if (product.color.toLowerCase().includes(lowerQuery)) {
        suggestions.add(`${product.color} ${product.category}`)
      }
    })
    
    return Array.from(suggestions).slice(0, 5)
  }

  // Enhanced search with filters and sorting
  const filteredAndSortedResults = useMemo(() => {
    let results = allProducts

    // Apply text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      results = results.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.color.toLowerCase().includes(query)
      )
    }

    // Apply filters
    if (filters.categories.length > 0) {
      results = results.filter(product => filters.categories.includes(product.category))
    }
    
    if (filters.brands.length > 0) {
      results = results.filter(product => filters.brands.includes(product.brand))
    }
    
    if (filters.colors.length > 0) {
      results = results.filter(product => filters.colors.includes(product.color))
    }
    
    if (filters.sizes.length > 0) {
      results = results.filter(product => 
        product.size.some(size => filters.sizes.includes(size))
      )
    }
    
    results = results.filter(product => 
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    )
    
    if (filters.rating > 0) {
      results = results.filter(product => product.rating >= filters.rating)
    }
    
    if (filters.showOnSale) {
      results = results.filter(product => product.onSale)
    }
    
    if (filters.showNew) {
      results = results.filter(product => product.isNew)
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        results.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        results.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        results.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      case 'rating':
        results.sort((a, b) => b.rating - a.rating)
        break
      case 'name':
        results.sort((a, b) => a.name.localeCompare(b.name))
        break
      default: // relevance
        // Keep original order for relevance
        break
    }

    return results
  }, [searchQuery, filters, sortBy])

  // Handle search with debouncing and suggestions
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      setSearchSuggestions([])
      setShowSuggestions(false)
      return
    }

    setIsSearching(true)
    const timeoutId = setTimeout(() => {
      setSearchResults(filteredAndSortedResults)
      setSearchSuggestions(generateSuggestions(searchQuery))
      setIsSearching(false)
    }, 200) // Faster response time

    return () => clearTimeout(timeoutId)
  }, [searchQuery, filteredAndSortedResults])

  // Update results when filters or sorting change
  useEffect(() => {
    if (searchQuery.trim()) {
      setSearchResults(filteredAndSortedResults)
    }
  }, [filteredAndSortedResults, searchQuery])

  // Reset search when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("")
      setSearchResults([])
      setIsSearching(false)
      setShowFilters(false)
      setShowSuggestions(false)
      setSearchSuggestions([])
      setSortBy('relevance')
      setFilters({
        categories: [],
        brands: [],
        colors: [],
        sizes: [],
        priceRange: [0, 1000],
        rating: 0,
        showOnSale: false,
        showNew: false
      })
    }
  }, [isOpen])

  // Helper functions for filters
  const toggleFilter = (type: keyof SearchFilters, value: string) => {
    setFilters(prev => {
      const currentArray = prev[type] as string[]
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value]
      return { ...prev, [type]: newArray }
    })
  }

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      colors: [],
      sizes: [],
      priceRange: [0, 1000],
      rating: 0,
      showOnSale: false,
      showNew: false
    })
  }

  const hasActiveFilters = 
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.colors.length > 0 ||
    filters.sizes.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 1000 ||
    filters.rating > 0 ||
    filters.showOnSale ||
    filters.showNew

  const formatPrice = (price: number) => `$${price}`

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-2xl font-serif text-bibiere-burgundy">
            Search bibiere Collection
          </DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        <div className="px-6">
          <div className="relative">
            <Search className={cn(
              "absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-200",
              searchQuery ? "text-bibiere-gold" : "text-muted-foreground"
            )} />
            <Input
              placeholder="Search bibiere's collection..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setShowSuggestions(true)
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="pl-12 h-14 text-lg border-2 focus:border-bibiere-gold transition-all duration-300 rounded-xl"
              autoFocus
              aria-label="Search products"
              aria-describedby="search-instructions"
            />
            <div id="search-instructions" className="sr-only">
              Type to search for products, categories, or brands. Use arrow keys to navigate suggestions.
            </div>
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 animate-spin text-bibiere-gold" />
            )}
            
            {/* Search Suggestions */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50">
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchQuery(suggestion)
                      setShowSuggestions(false)
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-bibiere-gold/5 hover:text-bibiere-gold transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
                  >
                    <Search className="inline h-4 w-4 mr-2 text-muted-foreground" />
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Controls Bar */}
        {searchQuery && (
          <div className="px-6 py-4 border-b border-border">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(
                    "gap-2",
                    hasActiveFilters && "border-bibiere-gold text-bibiere-gold"
                  )}
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                      {filters.categories.length + filters.brands.length + filters.colors.length + filters.sizes.length + (filters.showOnSale ? 1 : 0) + (filters.showNew ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
                
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Clear all
                  </Button>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-1 overflow-hidden">
          {/* Filters Sidebar */}
          {showFilters && searchQuery && (
            <div className="w-80 border-r border-border overflow-y-auto p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Price Range */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Price Range</h4>
                <div className="px-2">
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value as [number, number] }))}
                    max={1000}
                    min={0}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>{formatPrice(filters.priceRange[0])}</span>
                    <span>{formatPrice(filters.priceRange[1])}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Categories */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Categories</h4>
                <div className="space-y-2">
                  {availableCategories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={filters.categories.includes(category)}
                        onCheckedChange={() => toggleFilter('categories', category)}
                      />
                      <label
                        htmlFor={`category-${category}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Colors */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Colors</h4>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((color) => (
                    <Badge
                      key={color}
                      variant={filters.colors.includes(color) ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer transition-all duration-200",
                        filters.colors.includes(color) 
                          ? "bg-bibiere-gold text-white hover:bg-bibiere-gold/90" 
                          : "hover:bg-bibiere-gold/10 hover:text-bibiere-gold hover:border-bibiere-gold/20"
                      )}
                      onClick={() => toggleFilter('colors', color)}
                    >
                      {color}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Sizes */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Sizes</h4>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <Badge
                      key={size}
                      variant={filters.sizes.includes(size) ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer transition-all duration-200",
                        filters.sizes.includes(size) 
                          ? "bg-bibiere-gold text-white hover:bg-bibiere-gold/90" 
                          : "hover:bg-bibiere-gold/10 hover:text-bibiere-gold hover:border-bibiere-gold/20"
                      )}
                      onClick={() => toggleFilter('sizes', size)}
                    >
                      {size}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Special Filters */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Special</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="on-sale"
                      checked={filters.showOnSale}
                      onCheckedChange={(checked) => setFilters(prev => ({ ...prev, showOnSale: !!checked }))}
                    />
                    <label htmlFor="on-sale" className="text-sm font-medium cursor-pointer">
                      On Sale
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="new-arrivals"
                      checked={filters.showNew}
                      onCheckedChange={(checked) => setFilters(prev => ({ ...prev, showNew: !!checked }))}
                    />
                    <label htmlFor="new-arrivals" className="text-sm font-medium cursor-pointer">
                      New Arrivals
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            {!searchQuery ? (
              // Popular searches when no query
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <h3 className="font-medium">Popular Searches</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => setSearchQuery(search)}
                      className="px-4 py-2 bg-muted hover:bg-bibiere-gold/10 hover:text-bibiere-gold rounded-full text-sm transition-all duration-200 border border-transparent hover:border-bibiere-gold/20"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // Search results
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-muted-foreground">
                    {isSearching ? "Searching..." : `${searchResults.length} Results`}
                  </h3>
                  {searchResults.length > 0 && (
                    <button
                      onClick={onClose}
                      className="text-sm text-bibiere-gold hover:text-bibiere-burgundy transition-colors duration-200"
                    >
                      View all results →
                    </button>
                  )}
                </div>
                
                {searchResults.length > 0 ? (
                  <div className="grid gap-3">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center space-x-4 p-4 rounded-xl hover:bg-bibiere-gold/5 hover:border-bibiere-gold/20 border border-transparent cursor-pointer transition-all duration-300 group"
                        onClick={onClose}
                      >
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted">
                          <Image 
                            src={product.image || "/placeholder.svg"} 
                            alt={product.name} 
                            fill 
                            className="object-cover group-hover:scale-105 transition-transform duration-300" 
                          />
                          {product.onSale && (
                            <Badge className="absolute top-1 left-1 bg-red-500 text-white text-xs">
                              Sale
                            </Badge>
                          )}
                          {product.isNew && (
                            <Badge className="absolute top-1 right-1 bg-green-500 text-white text-xs">
                              New
                            </Badge>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground group-hover:text-bibiere-burgundy transition-colors duration-200">
                            {product.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">{product.category} • {product.brand}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-bibiere-gold font-semibold">
                              {formatPrice(product.price)}
                            </span>
                            {product.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                            <div className="flex items-center gap-1 ml-auto">
                              <span className="text-yellow-500">★</span>
                              <span className="text-sm text-muted-foreground">{product.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs text-muted-foreground">Available in:</span>
                            <span className="text-xs text-foreground">{product.size.join(', ')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : !isSearching ? (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium text-foreground mb-2">No results found</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Try adjusting your search or filters to find what you're looking for
                    </p>
                    {hasActiveFilters && (
                      <Button
                        variant="outline"
                        onClick={clearAllFilters}
                        className="text-bibiere-gold border-bibiere-gold hover:bg-bibiere-gold hover:text-white"
                      >
                        Clear all filters
                      </Button>
                    )}
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
