"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import type { CartItem, Product, WishlistItem } from "@/lib/commerce-data"

interface CommerceState {
  products: Product[]
  cart: CartItem[]
  wishlist: WishlistItem[]
  loading: boolean
}

const emptyState: CommerceState = {
  products: [],
  cart: [],
  wishlist: [],
  loading: true,
}

export function useCommerce() {
  const [state, setState] = useState<CommerceState>(emptyState)

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/commerce/bootstrap", { cache: "no-store" })
      if (!response.ok) {
        throw new Error("Failed to load commerce state")
      }

      const snapshot = (await response.json()) as Omit<CommerceState, "loading">
      setState({ ...snapshot, loading: false })
    } catch {
      setState((prev) => ({ ...prev, loading: false }))
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const toggleWishlist = useCallback(async (productId: string, isWishlisted: boolean) => {
    try {
      const response = await fetch("/api/commerce/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, action: isWishlisted ? "remove" : "add" }),
      })

      if (!response.ok) {
        throw new Error("Failed to update wishlist")
      }

      const payload = (await response.json()) as { items: WishlistItem[] }
      setState((prev) => ({ ...prev, wishlist: payload.items }))
    } catch {
      // no-op: keep previous client state
    }
  }, [])

  const addProductToCart = useCallback(async (productId: string) => {
    try {
      const response = await fetch("/api/commerce/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      })

      if (!response.ok) {
        throw new Error("Failed to add to cart")
      }

      const payload = (await response.json()) as { items: CartItem[] }
      setState((prev) => ({ ...prev, cart: payload.items }))
    } catch {
      // no-op: keep previous client state
    }
  }, [])

  const updateCartQuantity = useCallback(async (productId: string, quantity: number) => {
    try {
      const response = await fetch("/api/commerce/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      })

      if (!response.ok) {
        throw new Error("Failed to update cart")
      }

      const payload = (await response.json()) as { items: CartItem[] }
      setState((prev) => ({ ...prev, cart: payload.items }))
    } catch {
      // no-op: keep previous client state
    }
  }, [])

  const wishlistProductIds = useMemo(() => new Set(state.wishlist.map((item) => item.productId)), [state.wishlist])

  const totals = useMemo(() => {
    const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0)
    const wishlistCount = state.wishlist.length
    return { cartCount, wishlistCount }
  }, [state.cart, state.wishlist])

  return {
    ...state,
    ...totals,
    wishlistProductIds,
    refresh,
    toggleWishlist,
    addProductToCart,
    updateCartQuantity,
  }
}
