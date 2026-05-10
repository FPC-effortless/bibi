
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Heart, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Link } from 'wouter'
import { useCommerce } from "@/components/commerce-provider"
import { WishlistItem } from "@/types"

export default function WishlistView() {
  const { toast } = useToast()
  const { wishlist, addProductToCart, toggleWishlist } = useCommerce()
  const [sortBy, setSortBy] = useState<"dateAdded" | "price" | "name">("dateAdded")
  const [filterBy, setFilterBy] = useState<"all" | "inStock" | "onSale">("all")
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [processingItems, setProcessingItems] = useState<Set<string>>(new Set())

  const sortedItems = useMemo(() => {
    const filtered = wishlist.filter((item: WishlistItem) => {
      if (filterBy === "inStock") return item.inStock
      if (filterBy === "onSale") return Boolean(item.originalPrice && item.originalPrice > item.price)
      return true
    })

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price - b.price
        case "name":
          return a.name.localeCompare(b.name)
        case "dateAdded":
        default:
          return new Date(b.dateAdded || "").getTime() - new Date(a.dateAdded || "").getTime()
      }
    })
  }, [wishlist, filterBy, sortBy])

  const removeFromWishlist = async (productId: string, name: string) => {
    setProcessingItems((prev) => new Set(prev).add(productId))
    await toggleWishlist(productId)
    setProcessingItems((prev) => {
      const clone = new Set(prev)
      clone.delete(productId)
      return clone
    })
    setSelectedItems((prev) => {
      const clone = new Set(prev)
      clone.delete(productId)
      return clone
    })
    toast({
      title: "Removed from wishlist",
      description: `${name} has been removed from your wishlist.`,
    })
  }

  const addToCart = async (productId: string, name: string, removeAfter = false) => {
    setProcessingItems((prev) => new Set(prev).add(productId))
    await addProductToCart(productId)
    if (removeAfter) {
      await toggleWishlist(productId)
    }
    setProcessingItems((prev) => {
      const clone = new Set(prev)
      clone.delete(productId)
      return clone
    })

    toast({
      title: "Added to cart",
      description: removeAfter ? `${name} has been added to your cart and removed from wishlist.` : `${name} has been added to your cart.`,
    })
  }

  const addSelectedToCart = async () => {
    const selected = sortedItems.filter((item) => selectedItems.has(item.productId) && item.inStock)
    for (const item of selected) {
      // eslint-disable-next-line no-await-in-loop
      await addToCart(item.productId, item.name, true)
    }
    setSelectedItems(new Set())
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Your Wishlist</h1>
          <p className="text-muted-foreground">
            {wishlist.length === 0 ? "Items you've saved for later" : `${wishlist.length} ${wishlist.length === 1 ? "item" : "items"} saved`}
          </p>
        </div>

        {wishlist.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className="border rounded-md px-3 py-2 bg-background text-sm">
              <option value="dateAdded">Newest</option>
              <option value="price">Price</option>
              <option value="name">Name</option>
            </select>
            <select value={filterBy} onChange={(e) => setFilterBy(e.target.value as typeof filterBy)} className="border rounded-md px-3 py-2 bg-background text-sm">
              <option value="all">All</option>
              <option value="inStock">In Stock</option>
              <option value="onSale">On Sale</option>
            </select>
            <Button variant="outline" onClick={addSelectedToCart} disabled={selectedItems.size === 0}>
              Add Selected to Cart
            </Button>
          </div>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-6">Save items you love to your wishlist and shop them later.</p>
          <Button asChild>
            <Link href="/collections/new-arrivals">Explore New Arrivals</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedItems.map((item) => {
            const isProcessing = processingItems.has(item.productId)
            const hasDiscount = item.originalPrice && item.originalPrice > item.price
            const isSelected = selectedItems.has(item.productId)

            return (
              <Card key={item._id} className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <img src={item.image} alt={item.name} className="w-full aspect-[4/5] object-cover" />
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      const checked = e.target.checked
                      setSelectedItems((prev) => {
                        const clone = new Set(prev)
                        if (checked) clone.add(item.productId)
                        else clone.delete(item.productId)
                        return clone
                      })
                    }}
                    className="absolute top-2 left-2 h-4 w-4"
                    aria-label={`Select ${item.name}`}
                  />
                  {!item.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-white text-black px-3 py-1 rounded-full text-sm font-medium">Out of Stock</span>
                    </div>
                  )}
                  {hasDiscount && item.inStock && (
                    <div className="absolute top-2 left-8 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">Sale</div>
                  )}
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-white/80 hover:bg-white" onClick={() => removeFromWishlist(item.productId, item.name)} disabled={isProcessing}>
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                  </Button>
                </div>

                <div className="p-4">
                  <div className="mb-2">
                    {item.brand && <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{item.brand}</p>}
                    <h3 className="font-sans font-semibold text-card-foreground line-clamp-2">{item.name}</h3>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <p className="font-sans text-lg font-semibold text-card-foreground">${item.price.toLocaleString()}</p>
                      {hasDiscount && <p className="font-sans text-sm text-muted-foreground line-through">${item.originalPrice!.toLocaleString()}</p>}
                    </div>
                    {hasDiscount && <p className="text-xs text-green-600 font-medium">Save ${(item.originalPrice! - item.price).toLocaleString()}</p>}
                  </div>

                  <div className="space-y-2">
                    <Button onClick={() => addToCart(item.productId, item.name, true)} disabled={!item.inStock || isProcessing} className="w-full">
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        "Add to Cart & Remove"
                      )}
                    </Button>

                    <Button variant="outline" onClick={() => removeFromWishlist(item.productId, item.name)} disabled={isProcessing} className="w-full">
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Removing...
                        </>
                      ) : (
                        "Remove"
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
