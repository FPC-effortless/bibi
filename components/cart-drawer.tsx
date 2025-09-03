"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Plus, Minus, X, AlertCircle, Loader2, Heart, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useToast } from "@/hooks/use-toast"

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  size: string
  color: string
  image: string
  maxQuantity?: number
  sku?: string
  brand?: string
  category?: string
  discountPrice?: number
}

interface CartState {
  items: CartItem[]
  loading: boolean
  error: string | null
  updatingItems: Set<number>
}

export function CartDrawer() {
  const { toast } = useToast()
  const [cartState, setCartState] = useState<CartState>({
    items: [
      {
        id: 1,
        name: "Elegant Silk Dress",
        price: 1299,
        discountPrice: 999,
        quantity: 1,
        size: "M",
        color: "Midnight Black",
        image: "/elegant-black-silk-dress.png",
        maxQuantity: 5,
        sku: "ESD-001-M-BLK",
        brand: "bibiere",
        category: "Dresses",
      },
    ],
    loading: false,
    error: null,
    updatingItems: new Set(),
  })

  const updateQuantity = async (id: number, newQuantity: number) => {
    const item = cartState.items.find(item => item.id === id)
    if (!item) return

    // Validate quantity
    if (newQuantity < 0) return
    if (item.maxQuantity && newQuantity > item.maxQuantity) {
      toast({
        title: "Quantity limit reached",
        description: `Maximum ${item.maxQuantity} items available for this product.`,
        variant: "destructive",
      })
      return
    }

    // Add item to updating set
    setCartState(prev => ({
      ...prev,
      updatingItems: new Set(Array.from(prev.updatingItems).concat([id]))
    }))

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      if (newQuantity === 0) {
        setCartState(prev => ({
          ...prev,
          items: prev.items.filter((item) => item.id !== id),
          updatingItems: new Set(Array.from(prev.updatingItems).filter(itemId => itemId !== id))
        }))
        toast({
          title: "Item removed",
          description: `${item.name} has been removed from your cart.`,
        })
      } else {
        setCartState(prev => ({
          ...prev,
          items: prev.items.map((item) => 
            item.id === id ? { ...item, quantity: newQuantity } : item
          ),
          updatingItems: new Set(Array.from(prev.updatingItems).filter(itemId => itemId !== id))
        }))
        toast({
          title: "Cart updated",
          description: `Quantity updated to ${newQuantity}.`,
        })
      }
    } catch (error) {
      setCartState(prev => ({
        ...prev,
        error: "Failed to update cart. Please try again.",
        updatingItems: new Set(Array.from(prev.updatingItems).filter(itemId => itemId !== id))
      }))
      toast({
        title: "Update failed",
        description: "Failed to update cart. Please try again.",
        variant: "destructive",
      })
    }
  }

  const removeItem = async (id: number) => {
    await updateQuantity(id, 0)
  }

  const moveToWishlist = async (id: number) => {
    const item = cartState.items.find(item => item.id === id)
    if (!item) return

    setCartState(prev => ({
      ...prev,
      updatingItems: new Set(Array.from(prev.updatingItems).concat([id]))
    }))

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))

      setCartState(prev => ({
        ...prev,
        items: prev.items.filter((item) => item.id !== id),
        updatingItems: new Set(Array.from(prev.updatingItems).filter(itemId => itemId !== id))
      }))

      toast({
        title: "Moved to wishlist",
        description: `${item.name} has been moved to your wishlist.`,
      })
    } catch (error) {
      setCartState(prev => ({
        ...prev,
        error: "Failed to move item to wishlist. Please try again.",
        updatingItems: new Set(Array.from(prev.updatingItems).filter(itemId => itemId !== id))
      }))
      toast({
        title: "Move failed",
        description: "Failed to move item to wishlist. Please try again.",
        variant: "destructive",
      })
    }
  }

  const clearError = () => {
    setCartState(prev => ({ ...prev, error: null }))
  }

  const subtotal = cartState.items.reduce((sum, item) => sum + (item.discountPrice || item.price) * item.quantity, 0)
  const originalSubtotal = cartState.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalSavings = originalSubtotal - subtotal
  const shipping = subtotal >= 100 ? 0 : (cartState.items.length > 0 ? 25 : 0)
  const total = subtotal + shipping
  const itemCount = cartState.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="text-white hover:text-white/80 hover:bg-white/10 relative">
          <ShoppingBag className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
          <span className="sr-only">Shopping Cart ({itemCount} items)</span>
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-2xl font-serif">Shopping Cart</SheetTitle>
          {itemCount > 0 && (
            <p className="text-sm text-muted-foreground">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
            </p>
          )}
        </SheetHeader>

        {cartState.error && (
          <div className="mx-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <p className="text-sm text-destructive flex-1">{cartState.error}</p>
            <Button variant="ghost" size="sm" onClick={clearError}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}

        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto py-6">
            {cartState.loading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : cartState.items.length === 0 ? (
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
                    <Link href="/account/wishlist">View Wishlist</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {cartState.items.map((item) => {
                  const isUpdating = cartState.updatingItems.has(item.id)
                  return (
                    <div key={item.id} className={`flex space-x-4 ${isUpdating ? 'opacity-60' : ''}`}>
                      <div className="relative w-20 h-20 rounded-md overflow-hidden">
                        <Image 
                          src={item.image || "/placeholder.svg"} 
                          alt={item.name} 
                          fill 
                          className="object-cover" 
                          sizes="80px"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium line-clamp-2">{item.name}</h3>
                        {item.brand && (
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                            {item.brand}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          {item.color} • Size {item.size}
                        </p>
                        {item.sku && (
                          <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                        )}
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center gap-2">
                            {item.discountPrice ? (
                              <>
                                <p className="font-medium text-red-600">${item.discountPrice.toLocaleString()}</p>
                                <p className="text-sm text-muted-foreground line-through">${item.price.toLocaleString()}</p>
                                <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                                  Save ${(item.price - item.discountPrice).toLocaleString()}
                                </span>
                              </>
                            ) : (
                              <p className="font-medium">${item.price.toLocaleString()}</p>
                            )}
                          </div>
                          {item.maxQuantity && item.quantity >= item.maxQuantity && (
                            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                              Max quantity
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 mt-3">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={isUpdating || item.quantity <= 1}
                            className="h-8 w-8 p-0"
                          >
                            {isUpdating ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Minus className="h-3 w-3" />
                            )}
                          </Button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={isUpdating || Boolean(item.maxQuantity && item.quantity >= item.maxQuantity)}
                            className="h-8 w-8 p-0"
                          >
                            {isUpdating ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Plus className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-sm font-medium">
                            Subtotal: ${((item.discountPrice || item.price) * item.quantity).toLocaleString()}
                          </p>
                          {item.discountPrice && (
                            <p className="text-xs text-green-600">
                              You save ${((item.price - item.discountPrice) * item.quantity).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => moveToWishlist(item.id)}
                            disabled={isUpdating}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-pink-600"
                            title="Move to wishlist"
                          >
                            {isUpdating ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Heart className="h-3 w-3" />
                            )}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeItem(item.id)}
                            disabled={isUpdating}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                            title="Remove from cart"
                          >
                            {isUpdating ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {cartState.items.length > 0 && !cartState.loading && (
            <div className="border-t pt-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                {totalSavings > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Total Savings</span>
                    <span>-${totalSavings.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600' : ''}>
                    {shipping === 0 ? 'Free' : `$${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between font-medium text-lg border-t pt-2">
                  <span>Total</span>
                  <span>${total.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button 
                  asChild 
                  className="w-full" 
                  size="lg"
                  disabled={cartState.updatingItems.size > 0}
                >
                  <Link href="/checkout">
                    {cartState.updatingItems.size > 0 ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Updating Cart...
                      </>
                    ) : (
                      'Proceed to Checkout'
                    )}
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/">Continue Shopping</Link>
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground text-center">
                Free shipping on orders over $100
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
