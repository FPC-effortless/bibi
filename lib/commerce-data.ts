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
  products: [
    {
      id: "1",
      name: "Elegant Black Silk Dress",
      price: 299,
      originalPrice: 399,
      primaryImage: "/elegant-black-silk-dress.png",
      hoverImage: "/elegant-black-silk-dress-back.png",
      category: "Dresses",
      featured: true,
      inStock: true,
      brand: "bibiere",
    },
    {
      id: "2",
      name: "Cozy Wool Coat",
      price: 599,
      primaryImage: "/cozy-wool-coat.png",
      hoverImage: "/luxury-cashmere-texture.png",
      category: "Outerwear",
      featured: false,
      inStock: false,
      brand: "bibiere",
    },
    {
      id: "3",
      name: "Luxury Quilted Handbag",
      price: 449,
      primaryImage: "/luxury-quilted-handbag.png",
      hoverImage: "/designer-handbag-interior.png",
      category: "Accessories",
      featured: true,
      inStock: true,
      brand: "bibiere",
    },
    {
      id: "4",
      name: "Premium Tailored Blazer",
      price: 399,
      primaryImage: "/premium-tailored-blazer.png",
      hoverImage: "/premium-blazer-fabric.png",
      category: "Blazers",
      featured: false,
      inStock: true,
      brand: "bibiere",
    },
    {
      id: "5",
      name: "Cashmere Scarf",
      price: 149,
      primaryImage: "/cashmere-scarf.png",
      hoverImage: "/luxury-cashmere-texture.png",
      category: "Accessories",
      featured: false,
      inStock: true,
      brand: "bibiere",
    },
    {
      id: "6",
      name: "Luxury Wristwatch",
      price: 899,
      primaryImage: "/luxury-wristwatch.png",
      hoverImage: "/luxury-wristwatch.png",
      category: "Accessories",
      featured: true,
      inStock: true,
      brand: "bibiere",
    },
  ],
  cart: [
    {
      id: "cart-1",
      productId: "1",
      name: "Elegant Black Silk Dress",
      price: 1299,
      discountPrice: 999,
      quantity: 1,
      size: "M",
      color: "Midnight Black",
      image: "/elegant-black-silk-dress.png",
      maxQuantity: 5,
      brand: "bibiere",
    },
  ],
  wishlist: [
    {
      id: "wishlist-1",
      productId: "1",
      name: "Elegant Silk Dress",
      price: 299,
      originalPrice: 399,
      image: "/elegant-black-silk-dress.png",
      inStock: true,
      size: "M",
      color: "Midnight Black",
      brand: "bibiere",
      dateAdded: "2024-01-15",
    },
    {
      id: "wishlist-2",
      productId: "2",
      name: "Luxury Cashmere Coat",
      price: 599,
      image: "/luxury-cashmere-coat.png",
      inStock: false,
      size: "L",
      color: "Camel",
      brand: "bibiere",
      dateAdded: "2024-01-10",
    },
    {
      id: "wishlist-3",
      productId: "3",
      name: "Designer Handbag",
      price: 450,
      image: "/designer-handbag.png",
      inStock: true,
      color: "Black",
      brand: "bibiere",
      dateAdded: "2024-01-08",
    },
    {
      id: "wishlist-4",
      productId: "6",
      name: "Premium Watch",
      price: 899,
      originalPrice: 1199,
      image: "/premium-watch.png",
      inStock: true,
      color: "Gold",
      brand: "bibiere",
      dateAdded: "2024-01-05",
    },
  ],
}
