export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  primaryImage: string
  hoverImage: string
  category: string
  featured: boolean
  inStock: boolean
  brand: string
}

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  discountPrice?: number
  quantity: number
  size?: string
  color?: string
  image: string
  maxQuantity?: number
  brand?: string
}

export interface WishlistItem {
  id: string
  productId: string
  name: string
  price: number
  originalPrice?: number
  image: string
  inStock: boolean
  size?: string
  color?: string
  brand?: string
  dateAdded?: string
}

export interface CommerceSnapshot {
  products: Product[]
  cart: CartItem[]
  wishlist: WishlistItem[]
}

export const fallbackCommerceData: CommerceSnapshot = {
  products: [],
  cart: [],
  wishlist: [],
}
