
import { useMemo, useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Plus, Minus, Loader2, Heart, Trash2 } from "lucide-react"
import { Link } from 'wouter'
import { useToast } from "@/hooks/use-toast"
import { useCommerce } from "@/components/commerce-provider"
import { CartItem } from "@/types"

export function CartDrawer() {
  const { toast } = useToast()
  const { cart, wishlistProductIds, cartCount, updateCartQuantity, toggleWishlist } = useCommerce()
  const [processingProductId, setProcessingProductId] = useState<string | null>(null)

  const subtotal = useMemo(() => cart.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0), [cart])
  const shipping = subtotal >= 100 ? 0 : (cart.length > 0 ? 25 : 0)
  const total = subtotal + shipping

  const updateQuantity = async (productId: string, newQuantity: number) => {
    setProcessingProductId(productId)
    await updateCartQuantity(productId, newQuantity)
    setProcessingProductId(null)
  }

  const moveToWishlist = async (productId: string, name: string) => {
    setProcessingProductId(productId)

    if (!wishlistProductIds.has(productId)) {
      await toggleWishlist(productId)
    }

    await updateCartQuantity(productId, 0)
    setProcessingProductId(null)
    toast({
      title: "Moved to wishlist",
      description: `${name} has been moved to your wishlist.`,
    })
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="text-white hover:text-white/80 hover:bg-white/10 relative">
          <ShoppingBag className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
          <span className="sr-only">Shopping Cart ({cartCount} items)</span>
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-2xl font-serif">Shopping Cart</SheetTitle>
          {cartCount > 0 && <p className="text-sm text-muted-foreground">{cartCount} items in your cart</p>}
        </SheetHeader>

        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto py-6">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground mb-6">Discover bibiere's collection of timeless elegance</p>
                <div className="space-y-2">
                  <Button asChild className="w-full">
                    <Link href="/">Shop Collection</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/wishlist">View Wishlist</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map((item: CartItem) => {
                  const isUpdating = processingProductId === item.productId
                  return (
                    <div key={item._id} className={`flex space-x-4 ${isUpdating ? "opacity-60" : ""}`}>
                      <div className="relative w-20 h-20 rounded-md overflow-hidden">
                        <img src={item.image || "/placeholder.svg"} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium line-clamp-2">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.color} {item.size ? `• Size ${item.size}` : ""}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="font-medium">${item.price.toLocaleString()}</p>
                        </div>

                        <div className="flex items-center space-x-2 mt-3">
                          <Button variant="outline" size="sm" onClick={() => updateQuantity(item.productId, item.quantity - 1)} disabled={isUpdating || item.quantity <= 1} className="h-8 w-8 p-0">
                            {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Minus className="h-3 w-3" />}
                          </Button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <Button variant="outline" size="sm" onClick={() => updateQuantity(item.productId, item.quantity + 1)} disabled={isUpdating} className="h-8 w-8 p-0">
                            {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => moveToWishlist(item.productId, item.name)} disabled={isUpdating} className="h-8 w-8 p-0 text-muted-foreground hover:text-pink-600" title="Move to wishlist">
                            {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Heart className="h-3 w-3" />}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => updateQuantity(item.productId, 0)} disabled={isUpdating} className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive" title="Remove from cart">
                            {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t pt-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({cartCount} items)</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-green-600" : ""}>{shipping === 0 ? "Free" : `$${shipping}`}</span>
                </div>
                <div className="flex justify-between font-medium text-lg border-t pt-2">
                  <span>Total</span>
                  <span>${total.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button asChild className="w-full" size="lg">
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/">Continue Shopping</Link>
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">Free shipping on orders over $100</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
