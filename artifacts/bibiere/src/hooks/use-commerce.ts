import { useCallback, useMemo, useEffect, useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../../lib/convex/convex/_generated/api"
import { useUser } from "@clerk/react"
import { CartItem, WishlistItem } from "../types"
import { fallbackCommerceData } from "@/lib/commerce-data"
import { hasConvexConfig } from "@/lib/runtime-config"

type CommerceState = ReturnType<typeof useConvexCommerce>

export function useCommerce(): CommerceState {
  if (!hasConvexConfig) {
    return useFallbackCommerce()
  }

  return useConvexCommerce()
}

function useConvexCommerce() {
  const { user, isLoaded } = useUser()
  const storeUser = useMutation(api.users.store)

  // Sync user with Convex when logged in
  useEffect(() => {
    if (isLoaded && user) {
      void storeUser()
    }
  }, [isLoaded, user, storeUser])

  // Convex Queries (Reactive!)
  const productsQuery = useQuery(api.products.list)
  const cartQuery = useQuery(api.cart.get)
  const wishlistQuery = useQuery(api.wishlist.get)
  const products = productsQuery ?? []
  const cart = cartQuery ?? []
  const wishlist = wishlistQuery ?? []
  
  // Convex Mutations
  const addCartMutation = useMutation(api.cart.add)
  const updateCartMutation = useMutation(api.cart.update)
  const toggleWishlistMutation = useMutation(api.wishlist.toggle)

  const toggleWishlist = useCallback(async (productId: string) => {
    await toggleWishlistMutation({ productId })
  }, [toggleWishlistMutation])

  const addProductToCart = useCallback(async (productId: string, options?: { size?: string; color?: string }) => {
    await addCartMutation({ productId, size: options?.size, color: options?.color })
  }, [addCartMutation])

  const updateCartQuantity = useCallback(async (cartItemId: string, quantity: number) => {
    await updateCartMutation({ cartItemId: cartItemId as any, quantity })
  }, [updateCartMutation])

  const wishlistProductIds = useMemo(() => new Set(wishlist.map((item: WishlistItem) => item.productId)), [wishlist])

  const totals = useMemo(() => {
    const cartCount = cart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)
    const wishlistCount = wishlist.length
    return { cartCount, wishlistCount }
  }, [cart, wishlist])

  const loading = productsQuery === undefined

  return {
    products,
    cart,
    wishlist,
    loading,
    ...totals,
    wishlistProductIds,
    toggleWishlist,
    addProductToCart,
    updateCartQuantity,
  }
}

function useFallbackCommerce(): CommerceState {
  const [cart, setCart] = useState(fallbackCommerceData.cart)
  const [wishlist, setWishlist] = useState(fallbackCommerceData.wishlist)
  const products = fallbackCommerceData.products

  const toggleWishlist = useCallback(async (productId: string) => {
    setWishlist((current) => {
      if (current.some((item) => item.productId === productId)) {
        return current.filter((item) => item.productId !== productId)
      }

      const product = products.find((item) => item.id === productId)
      if (!product) {
        return current
      }

      return [
        ...current,
        {
          id: `wishlist-${product.id}`,
          productId: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.primaryImage,
          inStock: product.inStock,
          brand: product.brand,
          dateAdded: new Date().toISOString(),
        },
      ]
    })
  }, [products])

  const addProductToCart = useCallback(async (productId: string, options?: { size?: string; color?: string }) => {
    const product = products.find((item) => item.id === productId)
    if (!product) {
      return
    }

    setCart((current) => {
      const existing = current.find((item) => item.productId === productId && item.size === options?.size && item.color === options?.color)
      if (existing) {
        return current.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }

      return [
        ...current,
        {
          id: `cart-${product.id}`,
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          size: options?.size,
          color: options?.color,
          image: product.primaryImage,
          maxQuantity: 5,
          brand: product.brand,
        },
      ]
    })
  }, [products])

  const updateCartQuantity = useCallback(async (cartItemId: string, quantity: number) => {
    setCart((current) => {
      if (quantity <= 0) {
        return current.filter((item) => item.id !== cartItemId)
      }

      return current.map((item) =>
        item.id === cartItemId ? { ...item, quantity } : item,
      )
    })
  }, [])

  const wishlistProductIds = useMemo(
    () => new Set(wishlist.map((item) => item.productId)),
    [wishlist],
  )

  const totals = useMemo(() => {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
    const wishlistCount = wishlist.length
    return { cartCount, wishlistCount }
  }, [cart, wishlist])

  return {
    products: products as CommerceState["products"],
    cart: cart as unknown as CommerceState["cart"],
    wishlist: wishlist as unknown as CommerceState["wishlist"],
    loading: false,
    ...totals,
    wishlistProductIds,
    toggleWishlist,
    addProductToCart,
    updateCartQuantity,
  }
}
