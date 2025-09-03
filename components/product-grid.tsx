"use client"

import { useState, useCallback } from "react"
import ProductCard from "./product-card"
import { ProductGridSkeleton } from "./loading-spinner"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// Sample product data with enhanced information
const sampleProducts = [
  {
    id: "1",
    name: "Elegant Black Silk Dress",
    price: "$299",
    primaryImage: "/elegant-black-silk-dress.png",
    hoverImage: "/elegant-black-silk-dress-back.png",
    category: "Dresses",
    featured: true,
  },
  {
    id: "2",
    name: "Cozy Wool Coat",
    price: "$599",
    primaryImage: "/cozy-wool-coat.png",
    hoverImage: "/luxury-cashmere-texture.png",
    category: "Outerwear",
    featured: false,
  },
  {
    id: "3",
    name: "Luxury Quilted Handbag",
    price: "$449",
    primaryImage: "/luxury-quilted-handbag.png",
    hoverImage: "/designer-handbag-interior.png",
    category: "Accessories",
    featured: true,
  },
  {
    id: "4",
    name: "Premium Tailored Blazer",
    price: "$399",
    primaryImage: "/premium-tailored-blazer.png",
    hoverImage: "/premium-blazer-fabric.png",
    category: "Blazers",
    featured: false,
  },
  {
    id: "5",
    name: "Cashmere Scarf",
    price: "$149",
    primaryImage: "/cashmere-scarf.png",
    hoverImage: "/luxury-cashmere-texture.png",
    category: "Accessories",
    featured: false,
  },
  {
    id: "6",
    name: "Luxury Wristwatch",
    price: "$899",
    primaryImage: "/luxury-wristwatch.png",
    hoverImage: "/luxury-wristwatch.png",
    category: "Accessories",
    featured: true,
  },
]

interface ProductGridProps {
  title?: string
  subtitle?: string
  showFeaturedOnly?: boolean
  maxItems?: number
  className?: string
}

export default function ProductGrid({
  title = "Featured Products",
  subtitle = "Discover bibiere's curated collection of timeless elegance",
  showFeaturedOnly = false,
  maxItems,
  className,
}: ProductGridProps) {
  const [wishlistedItems, setWishlistedItems] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState(new Set<string>())

  // Filter and limit products based on props
  const displayProducts = sampleProducts
    .filter(product => !showFeaturedOnly || product.featured)
    .slice(0, maxItems)

  const handleWishlistToggle = useCallback((productId: string) => {
    setWishlistedItems((prev) => {
      const newSet = new Set(prev)
      const isAdding = !newSet.has(productId)
      
      if (isAdding) {
        newSet.add(productId)
        toast.success("Added to wishlist")
      } else {
        newSet.delete(productId)
        toast.success("Removed from wishlist")
      }
      return newSet
    })
  }, [])

  const handleAddToCart = useCallback(async (productId: string) => {
    const product = sampleProducts.find(p => p.id === productId)
    if (!product) return

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    toast.success(`${product.name} added to cart`)
  }, [])

  if (isLoading) {
    return (
      <div className={cn("container mx-auto px-4 py-12", className)}>
        <ProductGridSkeleton count={8} />
      </div>
    )
  }

  return (
    <section className={cn("container mx-auto px-4 py-12", className)}>
      {/* Section Header */}
      <div className="text-center mb-12 space-y-4">
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground">
          {title}
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
        <div className="w-24 h-0.5 bg-gradient-to-r from-bibiere-burgundy to-bibiere-gold mx-auto" />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
        {displayProducts.map((product, index) => (
          <div
            key={product.id}
            className="animate-fade-in-up"
            style={{ 
              animationDelay: `${index * 100}ms`,
              opacity: 0,
            }}
          >
            <ProductCard
              id={product.id}
              name={product.name}
              price={product.price}
              primaryImage={product.primaryImage}
              hoverImage={product.hoverImage}
              isWishlisted={wishlistedItems.has(product.id)}
              onWishlistToggle={handleWishlistToggle}
              onAddToCart={handleAddToCart}
              className={cn(
                "h-full",
                product.featured && "ring-2 ring-bibiere-gold/20"
              )}
            />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {displayProducts.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-muted-foreground/20" />
          </div>
          <h3 className="font-serif text-2xl text-foreground mb-2">No Products Found</h3>
          <p className="text-muted-foreground">
            We couldn't find any products matching your criteria.
          </p>
        </div>
      )}
    </section>
  )
}

export { ProductGrid }
