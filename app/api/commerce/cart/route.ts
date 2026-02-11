import { NextRequest, NextResponse } from "next/server"
import { addToCart, updateCart } from "@/lib/convex-http"
import { fallbackCommerceData } from "@/lib/commerce-data"

function isValidProductId(productId: unknown): productId is string {
  return typeof productId === "string" && productId.trim().length > 0
}

function isValidQuantity(quantity: unknown): quantity is number {
  return typeof quantity === "number" && Number.isFinite(quantity) && quantity >= 0
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const productId = body?.productId

  if (!isValidProductId(productId)) {
    return NextResponse.json({ error: "Invalid productId" }, { status: 400 })
  }

  const updated = await addToCart(productId)
  if (updated) {
    return NextResponse.json({ items: updated })
  }

  const product = fallbackCommerceData.products.find((item) => item.id === productId)
  if (!product) {
    return NextResponse.json({ items: fallbackCommerceData.cart })
  }

  const existing = fallbackCommerceData.cart.find((item) => item.productId === productId)
  if (existing) {
    existing.quantity += 1
  } else {
    fallbackCommerceData.cart = [
      ...fallbackCommerceData.cart,
      {
        id: `cart-${Date.now()}`,
        productId,
        name: product.name,
        price: product.price,
        discountPrice: product.originalPrice ? product.price : undefined,
        quantity: 1,
        image: product.primaryImage,
        maxQuantity: 5,
        brand: product.brand,
      },
    ]
  }

  return NextResponse.json({ items: fallbackCommerceData.cart })
}

export async function PATCH(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const productId = body?.productId
  const quantity = body?.quantity

  if (!isValidProductId(productId) || !isValidQuantity(quantity)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const updated = await updateCart(productId, quantity)
  if (updated) {
    return NextResponse.json({ items: updated })
  }

  if (quantity <= 0) {
    fallbackCommerceData.cart = fallbackCommerceData.cart.filter((item) => item.productId !== productId)
    return NextResponse.json({ items: fallbackCommerceData.cart })
  }

  fallbackCommerceData.cart = fallbackCommerceData.cart.map((item) =>
    item.productId === productId ? { ...item, quantity } : item,
  )

  return NextResponse.json({ items: fallbackCommerceData.cart })
}
