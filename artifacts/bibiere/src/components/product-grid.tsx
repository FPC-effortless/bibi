
import { useMemo } from "react"
import ProductCard from "./product-card"
import { ProductGridSkeleton } from "./loading-spinner"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useCommerce } from "@/components/commerce-provider"
import { Product } from "@/types"

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
  const { products, loading, wishlistProductIds, toggleWishlist, addProductToCart } = useCommerce()

  const displayProducts = useMemo(
    () => products.filter((product: Product) => !showFeaturedOnly || product.featured).slice(0, maxItems),
    [products, showFeaturedOnly, maxItems],
  )

  const handleWishlistToggle = async (productId: string) => {
    const isWishlisted = wishlistProductIds.has(productId)
    await toggleWishlist(productId)
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist")
  }

  const handleAddToCart = async (productId: string) => {
    const product = products.find((p: Product) => p.id === productId)
    if (!product) {
      return
    }

    await addProductToCart(productId)
    toast.success(`${product.name} added to cart`)
  }

  if (loading) {
    return (
      <div className={cn("container mx-auto px-4 py-12", className)}>
        <ProductGridSkeleton count={8} />
      </div>
    )
  }

  return (
    <section className={cn("container mx-auto px-4 py-12", className)}>
      <div className="text-center mb-12 space-y-4">
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground">{title}</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
        <div className="w-24 h-0.5 bg-gradient-to-r from-bibiere-burgundy to-bibiere-gold mx-auto" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
        {displayProducts.map((product: Product, index: number) => (
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
              price={`$${product.price}`}
              primaryImage={product.primaryImage}
              hoverImage={product.hoverImage || ""}
              isWishlisted={wishlistProductIds.has(product.id)}
              onWishlistToggle={handleWishlistToggle}
              onAddToCart={handleAddToCart}
              className={cn("h-full", product.featured && "ring-2 ring-bibiere-gold/20")}
            />
          </div>
        ))}
      </div>

      {displayProducts.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-muted-foreground/20" />
          </div>
          <h3 className="font-serif text-2xl text-foreground mb-2">No Products Found</h3>
          <p className="text-muted-foreground">We couldn't find any products matching your criteria.</p>
        </div>
      )}
    </section>
  )
}

export { ProductGrid }
