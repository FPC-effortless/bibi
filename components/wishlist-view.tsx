"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, ShoppingCart, Heart, Loader2, AlertCircle, Filter, SortAsc, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { LoadingSpinner } from "@/components/loading-spinner"
import Image from "next/image"

interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
  inStock: boolean
  originalPrice?: number
  size?: string
  color?: string
  brand?: string
  category?: string
  sku?: string
  dateAdded?: string
}

interface WishlistState {
  items: WishlistItem[]
  loading: boolean
  error: string | null
  processingItems: Set<string>
}

export default function WishlistView() {
  const { toast } = useToast()
  const [sortBy, setSortBy] = useState<'dateAdded' | 'price' | 'name'>('dateAdded')
  const [filterBy, setFilterBy] = useState<'all' | 'inStock' | 'onSale'>('all')
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [wishlistState, setWishlistState] = useState<WishlistState>({
    items: [
      {
        id: "1",
        name: "Elegant Silk Dress",
        price: 299,
        originalPrice: 399,
        image: "/elegant-black-silk-dress.png",
        inStock: true,
        size: "M",
        color: "Midnight Black",
        brand: "bibiere",
        category: "Dresses",
        sku: "ESD-001-M-BLK",
        dateAdded: "2024-01-15",
      },
      {
        id: "2",
        name: "Luxury Cashmere Coat",
        price: 599,
        image: "/luxury-cashmere-coat.png",
        inStock: false,
        size: "L",
        color: "Camel",
        brand: "bibiere",
        category: "Outerwear",
        sku: "LCC-002-L-CAM",
        dateAdded: "2024-01-10",
      },
      {
        id: "3",
        name: "Designer Handbag",
        price: 450,
        image: "/designer-handbag.png",
        inStock: true,
        color: "Black",
        brand: "bibiere",
        category: "Accessories",
        sku: "DHB-003-BLK",
        dateAdded: "2024-01-08",
      },
      {
        id: "4",
        name: "Premium Watch",
        price: 899,
        originalPrice: 1199,
        image: "/premium-watch.png",
        inStock: true,
        color: "Gold",
        brand: "bibiere",
        category: "Accessories",
        sku: "PW-004-GLD",
        dateAdded: "2024-01-05",
      },
    ],
    loading: false,
    error: null,
    processingItems: new Set(),
  })

  const removeFromWishlist = async (itemId: string) => {
    const item = wishlistState.items.find(item => item.id === itemId)
    if (!item) return

    setWishlistState(prev => ({
      ...prev,
      processingItems: new Set(Array.from(prev.processingItems).concat([itemId]))
    }))

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      setWishlistState(prev => ({
        ...prev,
        items: prev.items.filter((item) => item.id !== itemId),
        processingItems: new Set(Array.from(prev.processingItems).filter(id => id !== itemId))
      }))

      toast({
        title: "Removed from wishlist",
        description: `${item.name} has been removed from your wishlist.`,
      })
    } catch (error) {
      setWishlistState(prev => ({
        ...prev,
        error: "Failed to remove item. Please try again.",
        processingItems: new Set(Array.from(prev.processingItems).filter(id => id !== itemId))
      }))

      toast({
        title: "Error",
        description: "Failed to remove item from wishlist. Please try again.",
        variant: "destructive",
      })
    }
  }

  const addToCart = async (item: WishlistItem, removeFromWishlist = false) => {
    if (!item.inStock) {
      toast({
        title: "Out of stock",
        description: "This item is currently out of stock.",
        variant: "destructive",
      })
      return
    }

    setWishlistState(prev => ({
      ...prev,
      processingItems: new Set(Array.from(prev.processingItems).concat([item.id]))
    }))

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (removeFromWishlist) {
        setWishlistState(prev => ({
          ...prev,
          items: prev.items.filter((wishlistItem) => wishlistItem.id !== item.id),
          processingItems: new Set(Array.from(prev.processingItems).filter(id => id !== item.id))
        }))
        toast({
          title: "Added to cart",
          description: `${item.name} has been added to your cart and removed from wishlist.`,
        })
      } else {
        setWishlistState(prev => ({
          ...prev,
          processingItems: new Set(Array.from(prev.processingItems).filter(id => id !== item.id))
        }))
        toast({
          title: "Added to cart",
          description: `${item.name} has been added to your cart.`,
        })
      }
    } catch (error) {
      setWishlistState(prev => ({
        ...prev,
        error: "Failed to add item to cart. Please try again.",
        processingItems: new Set(Array.from(prev.processingItems).filter(id => id !== item.id))
      }))

      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Filter and sort items
  const filteredItems = wishlistState.items.filter(item => {
    if (filterBy === 'inStock') return item.inStock
    if (filterBy === 'onSale') return item.originalPrice && item.originalPrice > item.price
    return true
  })

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price
      case 'name':
        return a.name.localeCompare(b.name)
      case 'dateAdded':
      default:
        return new Date(b.dateAdded || '').getTime() - new Date(a.dateAdded || '').getTime()
    }
  })

  const availableItemsCount = wishlistState.items.filter(item => item.inStock).length

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Your Wishlist</h1>
            <p className="text-muted-foreground">
              {wishlistState.items.length === 0 
                ? "Items you've saved for later" 
                : `${wishlistState.items.length} ${wishlistState.items.length === 1 ? 'item' : 'items'} saved`
              }
            </p>
          </div>
        </div>
      </div>

      {wishlistState.items.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-6">
            Save items you love to your wishlist and shop them later.
          </p>
          <Button>Continue Shopping</Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedItems.map((item) => {
              const isProcessing = wishlistState.processingItems.has(item.id)
              const hasDiscount = item.originalPrice && item.originalPrice > item.price

              return (
                <Card
                  key={item.id}
                  className="group overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={400}
                      height={500}
                      className="w-full aspect-[4/5] object-cover"
                    />
                    {!item.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-white text-black px-3 py-1 rounded-full text-sm font-medium">
                          Out of Stock
                        </span>
                      </div>
                    )}
                    {hasDiscount && item.inStock && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                        Sale
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                      onClick={() => removeFromWishlist(item.id)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  <div className="p-4">
                    <div className="mb-2">
                      {item.brand && (
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                          {item.brand}
                        </p>
                      )}
                      <h3 className="font-sans font-semibold text-card-foreground line-clamp-2">
                        {item.name}
                      </h3>
                      {(item.color || item.size) && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {[item.color, item.size].filter(Boolean).join(' • ')}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center gap-2">
                        <p className="font-sans text-lg font-semibold text-card-foreground">
                          ${item.price.toLocaleString()}
                        </p>
                        {hasDiscount && (
                          <p className="font-sans text-sm text-muted-foreground line-through">
                            ${item.originalPrice!.toLocaleString()}
                          </p>
                        )}
                      </div>
                      {hasDiscount && (
                        <p className="text-xs text-green-600 font-medium">
                          Save ${(item.originalPrice! - item.price).toLocaleString()}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Button
                        onClick={() => addToCart(item, true)}
                        disabled={!item.inStock || isProcessing}
                        className="w-full"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          'Add to Cart & Remove'
                        )}
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={() => removeFromWishlist(item.id)}
                        disabled={isProcessing}
                        className="w-full"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Removing...
                          </>
                        ) : (
                          'Remove'
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}