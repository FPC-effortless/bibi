
import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Heart, ChevronDown, ChevronUp, Truck, Shield, RotateCcw, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { SizeGuideModal } from "./size-guide-modal"
import { toast } from "sonner"
import { useCommerce } from "@/components/commerce-provider"

interface ProductDetailsProps {
  product: {
    id: string
    name: string
    price: number
    originalPrice?: number
    description: string
    sizes: string[]
    colors: { name: string; value: string; image?: string }[]
    materials?: string[]
    careInstructions?: string[]
    features?: string[]
    rating?: number
    reviewCount?: number
    inStock?: boolean
    stockCount?: number
  }
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { addProductToCart, toggleWishlist, wishlistProductIds } = useCommerce()
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]?.name || "")
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'care'>('description')

  useEffect(() => {
    setIsWishlisted(wishlistProductIds.has(product.id))
  }, [product.id, wishlistProductIds])

  const handleAddToCart = useCallback(async () => {
    if (!selectedSize) {
      toast.error("Please select a size")
      return
    }

    if (!product.inStock) {
      toast.error("This item is currently out of stock")
      return
    }

    setIsAddingToCart(true)

    try {
      await addProductToCart(product.id)
      toast.success("Added to cart successfully!")
    } catch (error) {
      toast.error("Failed to add to cart. Please try again.")
    } finally {
      setIsAddingToCart(false)
    }
  }, [addProductToCart, selectedSize, product.id, product.inStock])

  const handleWishlistToggle = useCallback(async () => {
    const currentlyWishlisted = wishlistProductIds.has(product.id)
    await toggleWishlist(product.id)
    setIsWishlisted(!currentlyWishlisted)
    toast.success(currentlyWishlisted ? "Removed from wishlist" : "Added to wishlist")
  }, [product.id, toggleWishlist, wishlistProductIds])

  const isOnSale = product.originalPrice && product.originalPrice > product.price
  const discountPercentage = isOnSale 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0

  return (
    <div className="space-y-8">
      {/* Product Title, Rating, and Price */}
      <div className="space-y-6">
        <div className="space-y-3">
          <h1 className="font-serif text-3xl lg:text-4xl xl:text-5xl text-foreground leading-tight">
            {product.name}
          </h1>
          
          {/* Rating and Reviews */}
          {product.rating && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-4 h-4",
                      i < Math.floor(product.rating!)
                        ? "fill-bibiere-gold text-bibiere-gold"
                        : "text-muted-foreground/30"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviewCount || 0} reviews)
              </span>
            </div>
          )}
        </div>

        {/* Price Section */}
        <div className="flex items-center gap-4">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-semibold text-bibiere-burgundy">
              ${product.price.toLocaleString()}
            </span>
            {isOnSale && (
              <>
                <span className="text-xl text-muted-foreground line-through">
                  ${product.originalPrice!.toLocaleString()}
                </span>
                <span className="px-2 py-1 bg-bibiere-burgundy text-white text-sm font-medium rounded-md">
                  -{discountPercentage}%
                </span>
              </>
            )}
          </div>
        </div>

        {/* Stock Status */}
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            product.inStock !== false ? "bg-green-500" : "bg-red-500"
          )} />
          <span className={cn(
            "text-sm font-medium",
            product.inStock !== false ? "text-green-700" : "text-red-700"
          )}>
            {product.inStock !== false 
              ? `In Stock${product.stockCount ? ` (${product.stockCount} available)` : ''}`
              : 'Out of Stock'
            }
          </span>
        </div>
      </div>

      {/* Product Information Tabs */}
      <div className="space-y-6">
        <div className="flex border-b border-border">
          {[
            { id: 'description', label: 'Description' },
            { id: 'details', label: 'Details' },
            { id: 'care', label: 'Care' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                "px-6 py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === tab.id
                  ? "border-bibiere-burgundy text-bibiere-burgundy"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="min-h-[120px]">
          {activeTab === 'description' && (
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
              {product.features && (
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Key Features:</h4>
                  <ul className="space-y-1">
                    {product.features.map((feature, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-bibiere-gold mt-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-4">
              {product.materials && (
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Materials:</h4>
                  <ul className="space-y-1">
                    {product.materials.map((material, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-bibiere-burgundy mt-2 flex-shrink-0" />
                        {material}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'care' && (
            <div className="space-y-4">
              {product.careInstructions && (
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Care Instructions:</h4>
                  <ul className="space-y-1">
                    {product.careInstructions.map((instruction, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-bibiere-gold mt-2 flex-shrink-0" />
                        {instruction}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Size Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium text-foreground">Size</h3>
          <button
            onClick={() => setIsSizeGuideOpen(true)}
            className="text-sm text-bibiere-burgundy hover:text-bibiere-burgundy-dark underline transition-colors font-medium"
          >
            Size Guide
          </button>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={cn(
                "py-4 px-4 text-sm font-medium border-2 rounded-xl transition-all duration-300",
                "hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-bibiere-burgundy focus:ring-offset-2",
                selectedSize === size
                  ? "border-bibiere-burgundy bg-bibiere-burgundy text-white shadow-lg scale-105"
                  : "border-border hover:border-bibiere-burgundy text-foreground",
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color Selector */}
      <div className="space-y-4">
        <h3 className="text-base font-medium text-foreground">
          Color: <span className="font-normal text-muted-foreground">{selectedColor}</span>
        </h3>
        <div className="flex gap-4">
          {product.colors.map((color) => (
            <button
              key={color.name}
              onClick={() => setSelectedColor(color.name)}
              className={cn(
                "relative w-14 h-14 rounded-full border-3 transition-all duration-300 hover:scale-110",
                "focus:outline-none focus:ring-2 focus:ring-bibiere-burgundy focus:ring-offset-2",
                selectedColor === color.name
                  ? "border-bibiere-burgundy scale-110 shadow-lg ring-2 ring-bibiere-burgundy ring-offset-2"
                  : "border-border hover:border-muted-foreground shadow-md",
              )}
              style={{ backgroundColor: color.value }}
              title={color.name}
            >
              {selectedColor === color.name && (
                <div className="absolute inset-0 rounded-full border-2 border-white" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Add to Cart and Wishlist */}
      <div className="space-y-6 pt-6">
        <div className="space-y-4">
          <Button
            size="lg"
            className={cn(
              "w-full h-16 text-lg font-medium transition-all duration-300",
              "bg-bibiere-burgundy hover:bg-bibiere-burgundy-dark",
              "hover:scale-[1.02] hover:shadow-lg",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            )}
            disabled={!selectedSize || isAddingToCart || product.inStock === false}
            onClick={handleAddToCart}
          >
            {isAddingToCart ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Adding to Cart...
              </div>
            ) : product.inStock === false ? (
              "Out of Stock"
            ) : !selectedSize ? (
              "Select a Size"
            ) : (
              "Add to Cart"
            )}
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={handleWishlistToggle}
            className={cn(
              "w-full h-14 text-base font-medium transition-all duration-300",
              "border-2 hover:scale-[1.02] hover:shadow-md",
              isWishlisted 
                ? "border-bibiere-burgundy text-bibiere-burgundy bg-bibiere-burgundy/5" 
                : "border-border hover:border-bibiere-burgundy hover:text-bibiere-burgundy"
            )}
          >
            <Heart
              className={cn(
                "w-5 h-5 mr-3 transition-all duration-300",
                isWishlisted 
                  ? "fill-bibiere-burgundy text-bibiere-burgundy scale-110" 
                  : "text-muted-foreground",
              )}
            />
            {isWishlisted ? "Added to Wishlist" : "Add to Wishlist"}
          </Button>
        </div>

        {/* Product Guarantees */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-border">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-10 h-10 rounded-full bg-bibiere-burgundy/10 flex items-center justify-center">
              <Truck className="w-5 h-5 text-bibiere-burgundy" />
            </div>
            <div>
              <p className="font-medium text-foreground">Free Shipping</p>
              <p className="text-muted-foreground">On orders over $200</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <div className="w-10 h-10 rounded-full bg-bibiere-gold/10 flex items-center justify-center">
              <RotateCcw className="w-5 h-5 text-bibiere-gold" />
            </div>
            <div>
              <p className="font-medium text-foreground">Easy Returns</p>
              <p className="text-muted-foreground">30-day return policy</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-foreground">Authenticity</p>
              <p className="text-muted-foreground">100% guaranteed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </div>
  )
}
