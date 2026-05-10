import { Doc } from "../../../../lib/convex/convex/_generated/dataModel";

export type Product = Doc<"products">;

export type CartItem = Doc<"cartItems"> & {
  name: string;
  price: number;
  image: string;
  brand: string;
};

export type WishlistItem = Doc<"wishlistItems"> & {
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  inStock: boolean;
  brand: string;
  dateAdded: string;
};

export type Order = Doc<"orders">;
export type OrderItem = Doc<"orderItems">;
