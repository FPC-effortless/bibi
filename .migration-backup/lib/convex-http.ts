import { fallbackCommerceData, type CartItem, type CommerceSnapshot, type Product, type WishlistItem } from "@/lib/commerce-data"

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL
const CONVEX_ADMIN_KEY = process.env.CONVEX_ADMIN_KEY

interface ConvexResponse<T> {
  status: "success" | "error"
  value?: T
  errorMessage?: string
}

async function callConvex<T>(kind: "query" | "mutation", path: string, args: Record<string, unknown> = {}): Promise<T | null> {
  if (!CONVEX_URL) {
    return null
  }

  try {
    const response = await fetch(`${CONVEX_URL}/api/${kind}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(CONVEX_ADMIN_KEY ? { Authorization: `Convex ${CONVEX_ADMIN_KEY}` } : {}),
      },
      body: JSON.stringify({ path, args }),
      cache: "no-store",
    })

    if (!response.ok) {
      return null
    }

    const payload = (await response.json()) as ConvexResponse<T>
    if (payload.status !== "success") {
      return null
    }

    return payload.value ?? null
  } catch {
    return null
  }
}

export async function loadCommerceSnapshot(): Promise<CommerceSnapshot> {
  const snapshot = await callConvex<CommerceSnapshot>("query", "commerce:getSnapshot")
  return snapshot ?? fallbackCommerceData
}

export async function updateWishlist(productId: string, action: "add" | "remove"): Promise<WishlistItem[] | null> {
  return callConvex<WishlistItem[]>("mutation", "commerce:updateWishlist", { productId, action })
}

export async function updateCart(productId: string, quantity: number): Promise<CartItem[] | null> {
  return callConvex<CartItem[]>("mutation", "commerce:updateCart", { productId, quantity })
}

export async function addToCart(productId: string): Promise<CartItem[] | null> {
  return callConvex<CartItem[]>("mutation", "commerce:addToCart", { productId })
}

export async function getProducts(): Promise<Product[]> {
  const products = await callConvex<Product[]>("query", "commerce:listProducts")
  return products ?? fallbackCommerceData.products
}
