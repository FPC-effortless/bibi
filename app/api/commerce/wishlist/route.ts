import { NextRequest, NextResponse } from "next/server"
import { fallbackCommerceData } from "@/lib/commerce-data"
import { updateWishlist } from "@/lib/convex-http"

function isValidProductId(productId: unknown): productId is string {
  return typeof productId === "string" && productId.trim().length > 0
}

function isValidAction(action: unknown): action is "add" | "remove" {
  return action === "add" || action === "remove"
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const productId = body?.productId
  const action = body?.action

  if (!isValidProductId(productId) || !isValidAction(action)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const updated = await updateWishlist(productId, action)
  if (updated) {
    return NextResponse.json({ items: updated })
  }

  if (action === "add") {
    const product = fallbackCommerceData.products.find((item) => item.id === productId)
    if (!product) {
      return NextResponse.json({ items: fallbackCommerceData.wishlist })
    }

    const existing = fallbackCommerceData.wishlist.find((item) => item.productId === productId)
    if (!existing) {
      fallbackCommerceData.wishlist = [
        ...fallbackCommerceData.wishlist,
        {
          id: `wishlist-${Date.now()}`,
          productId,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.primaryImage,
          inStock: product.inStock,
          brand: product.brand,
          dateAdded: new Date().toISOString(),
        },
      ]
    }
  }

  if (action === "remove") {
    fallbackCommerceData.wishlist = fallbackCommerceData.wishlist.filter((item) => item.productId !== productId)
  }

  return NextResponse.json({ items: fallbackCommerceData.wishlist })
}
