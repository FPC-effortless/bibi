import { useCallback, useMemo, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../../lib/convex/convex/_generated/api"
import { useUser } from "@clerk/react"
import { CartItem, WishlistItem } from "../types"

export function useCommerce() {
  const { user, isLoaded } = useUser()
  const storeUser = useMutation(api.users.store)

  // Sync user with Convex when logged in
  useEffect(() => {
    if (isLoaded && user) {
      void storeUser()
    }
  }, [isLoaded, user, storeUser])

  // Convex Queries (Reactive!)
  const products = useQuery(api.products.list) ?? []
  const cart = useQuery(api.cart.get) ?? []
  const wishlist = useQuery(api.wishlist.get) ?? []
  
  // Seed products if none exist (Convenience for first run)
  const seedProducts = useMutation(api.products.seed)
  useEffect(() => {
    if (products.length === 0 && isLoaded) {
      void seedProducts()
    }
  }, [products, seedProducts, isLoaded])

  // Convex Mutations
  const addCartMutation = useMutation(api.cart.add)
  const updateCartMutation = useMutation(api.cart.update)
  const toggleWishlistMutation = useMutation(api.wishlist.toggle)

  const toggleWishlist = useCallback(async (productId: string) => {
    await toggleWishlistMutation({ productId })
  }, [toggleWishlistMutation])

  const addProductToCart = useCallback(async (productId: string) => {
    await addCartMutation({ productId })
  }, [addCartMutation])

  const updateCartQuantity = useCallback(async (productId: string, quantity: number) => {
    await updateCartMutation({ productId, quantity })
  }, [updateCartMutation])

  const wishlistProductIds = useMemo(() => new Set(wishlist.map((item: WishlistItem) => item.productId)), [wishlist])

  const totals = useMemo(() => {
    const cartCount = cart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)
    const wishlistCount = wishlist.length
    return { cartCount, wishlistCount }
  }, [cart, wishlist])

  const loading = products.length === 0 // Simple loading state

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
