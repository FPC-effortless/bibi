
import type React from "react"

import { useState, useRef } from "react"
import { Heart, ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  id: string
  name: string
  price: string
  primaryImage: string
  hoverImage?: string
  isWishlisted?: boolean
  onWishlistToggle?: (id: string) => void
  onAddToCart?: (id: string) => void
  className?: string
}

export default function ProductCard({
  id,
  name,
  price,
  primaryImage,
  hoverImage = "",
  isWishlisted = false,
  onWishlistToggle,
  onAddToCart,
  className,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [primaryImageLoaded, setPrimaryImageLoaded] = useState(false)
  const [hoverImageLoaded, setHoverImageLoaded] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onWishlistToggle?.(id)
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!onAddToCart) return
    
    setIsAddingToCart(true)
    try {
      await onAddToCart(id)
    } finally {
      setIsAddingToCart(false)
    }
  }

  return (
    <div
      ref={cardRef}
      role="article"
      tabIndex={0}
      aria-label={`${name} - ${price}`}
      className={cn(
        "group relative w-full bg-card rounded-xl overflow-hidden transition-all duration-300 ease-in-out",
        "no-touch:hover:shadow-xl no-touch:hover:shadow-black/10 no-touch:hover:-translate-y-1",
        "border border-border/50 no-touch:hover:border-border focus:border-bibiere-burgundy focus:ring-2 focus:ring-bibiere-burgundy focus:ring-offset-2",
        "cursor-pointer transform-gpu",
        "touch:active:scale-[0.98] touch:active:shadow-lg",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setTimeout(() => setIsHovered(false), 300)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          // Navigate to product page
          window.location.href = `/product/${id}`
        }
      }}
    >
      {/* Action Buttons Container */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={cn(
            "p-2.5 rounded-full bg-background/90 backdrop-blur-md shadow-lg",
            "transition-all duration-300 hover:bg-background hover:scale-110",
            "focus:outline-none focus:ring-2 focus:ring-bibiere-burgundy focus:ring-offset-2",
            "opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0",
          )}
          style={{ transitionDelay: "50ms" }}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-all duration-200",
              isWishlisted 
                ? "fill-bibiere-burgundy text-bibiere-burgundy scale-110" 
                : "text-muted-foreground hover:text-bibiere-burgundy",
            )}
          />
        </button>

        {/* Quick Add to Cart Button */}
        {onAddToCart && (
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className={cn(
              "p-2.5 rounded-full bg-bibiere-burgundy text-white shadow-lg",
              "transition-all duration-300 hover:bg-bibiere-burgundy-dark hover:scale-110",
              "focus:outline-none focus:ring-2 focus:ring-bibiere-burgundy focus:ring-offset-2",
              "opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
            )}
            style={{ transitionDelay: "100ms" }}
            aria-label="Quick add to cart"
          >
            <ShoppingBag className={cn("w-4 h-4", isAddingToCart && "animate-pulse")} />
          </button>
        )}
      </div>

      {/* Product Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-muted/30">
        {/* Primary Image */}
        <img
          src={primaryImage || "/placeholder.svg"}
          alt={name}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out",
            isHovered ? "opacity-0 scale-110" : "opacity-100 scale-100",
            !primaryImageLoaded && "opacity-0"
          )}
          onLoad={() => setPrimaryImageLoaded(true)}
          loading="lazy"
        />

        {/* Hover Image */}
        <img
          src={hoverImage || "/placeholder.svg"}
          alt={`${name} detail view`}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out",
            isHovered ? "opacity-100 scale-100" : "opacity-0 scale-110",
            !hoverImageLoaded && "opacity-0"
          )}
          onLoad={() => setHoverImageLoaded(true)}
          loading="lazy"
        />

        {/* Loading State */}
        {(!primaryImageLoaded || !hoverImageLoaded) && (
          <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted/80 to-muted animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        )}

        {/* Overlay Gradient */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent",
          "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        )} />
      </div>

      {/* Product Information */}
      <div className="p-5 space-y-3">
        <div className="space-y-1">
          <h3 className={cn(
            "font-serif text-lg text-card-foreground leading-tight line-clamp-2",
            "group-hover:text-bibiere-burgundy transition-colors duration-200"
          )}>
            {name}
          </h3>
          <p className="text-bibiere-burgundy font-semibold text-lg tracking-wide">
            {price}
          </p>
        </div>
        
        {/* Quick Actions Bar */}
        <div className={cn(
          "flex items-center justify-between pt-2 border-t border-border/30",
          "opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0",
          "transition-all duration-300"
        )}>
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            Quick View
          </span>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-bibiere-gold" />
            <div className="w-1.5 h-1.5 rounded-full bg-bibiere-burgundy" />
            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
          </div>
        </div>
      </div>
    </div>
  )
}
