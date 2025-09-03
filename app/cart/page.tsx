"use client"

import { useState } from "react"
import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react"

// Mock cart data - in a real app, this would come from a cart context/state management
const mockCartItems = [
  {
    id: "1",
    name: "Elegant Silk Evening Dress",
    price: 1299,
    originalPrice: 1599,
    size: "M",
    color: "Midnight Black",
    quantity: 1,
    image: "/elegant-black-silk-dress.png",
    inStock: true,
    stockCount: 8
  },
  {
    id: "2", 
    name: "Cashmere Blend Coat",
    price: 899,
    originalPrice: null,
    size: "L",
    color: "Camel",
    quantity: 2,
    image: "/cozy-wool-coat.png",
    inStock: true,
    stockCount: 3
  }
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState(mockCartItems)
  const [promoCode, setPromoCode] = useState("")
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null)

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCartItems(items => items.filter(item => item.id !== id))
    } else {
      setCartItems(items => 
        items.map(item => 
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      )
    }
  }

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id))
  }

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "welcome10") {
      setAppliedPromo("WELCOME10")
      setPromoCode("")
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const discount = appliedPromo ? subtotal * 0.1 : 0
  const shipping = subtotal > 500 ? 0 : 25
  const tax = (subtotal - discount) * 0.08
  const total = subtotal - discount + shipping + tax

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <ShoppingBag className="w-24 h-24 mx-auto text-muted-foreground" />
              <h1 className="text-3xl font-serif font-bold">Your Cart is Empty</h1>
              <p className="text-muted-foreground">
                Discover our curated collection of luxury fashion pieces
              </p>
            </div>
            <div className="space-y-4">
              <Button asChild size="lg">
                <Link href="/collections">Continue Shopping</Link>
              </Button>
              <div>
                <Button variant="outline" asChild>
                  <Link href="/wishlist">View Wishlist</Link>
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
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/collections">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
          <h1 className="text-3xl font-serif font-bold">Shopping Cart</h1>
          <p className="text-muted-foreground mt-2">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="border border-border rounded-lg p-6">
                <div className="flex gap-6">
                  <div className="w-24 h-32 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    <p className="text-xs text-muted-foreground text-center">Product Image</p>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-serif font-semibold text-lg">{item.name}</h3>
                        <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                          <span>Size: {item.size}</span>
                          <span>Color: {item.color}</span>
                        </div>
                        {item.stockCount <= 5 && (
                          <Badge variant="secondary" className="mt-2">
                            Only {item.stockCount} left
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stockCount}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-semibold">${item.price}</div>
                        {item.originalPrice && (
                          <div className="text-sm text-muted-foreground line-through">
                            ${item.originalPrice}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="border border-border rounded-lg p-6 space-y-6">
              <h2 className="text-xl font-serif font-semibold">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                {appliedPromo && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedPromo})</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {shipping > 0 && (
                <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                  Add ${(500 - subtotal).toFixed(2)} more for free shipping
                </div>
              )}
            </div>

            {/* Promo Code */}
            <div className="border border-border rounded-lg p-6 space-y-4">
              <h3 className="font-semibold">Promo Code</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <Button variant="outline" onClick={applyPromoCode}>
                  Apply
                </Button>
              </div>
              {appliedPromo && (
                <div className="text-sm text-green-600">
                  ✓ {appliedPromo} applied (10% off)
                </div>
              )}
            </div>

            {/* Checkout Button */}
            <Button asChild size="lg" className="w-full">
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>

            {/* Security Notice */}
            <div className="text-xs text-muted-foreground text-center">
              🔒 Secure checkout with SSL encryption
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
