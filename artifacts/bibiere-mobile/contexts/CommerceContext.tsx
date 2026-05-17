import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  primaryImage: string;
  category: string;
  featured: boolean;
  inStock: boolean;
  brand: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  inStock: boolean;
}

const PRODUCTS: Product[] = [];
const PRODUCT_IDS = new Set(PRODUCTS.map((product) => product.id));

interface CommerceContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: WishlistItem[];
  cartCount: number;
  wishlistCount: number;
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQty: (productId: string, qty: number) => Promise<void>;
  toggleWishlist: (product: Product) => Promise<void>;
  isWishlisted: (productId: string) => boolean;
  cartTotal: number;
}

const CommerceContext = createContext<CommerceContextType | null>(null);

const CART_KEY = "bibiere_cart_v1";
const WISHLIST_KEY = "bibiere_wishlist_v1";

export function CommerceProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(CART_KEY).then((v) => {
      if (!v) return;
      const stored = JSON.parse(v) as CartItem[];
      const productionItems = stored.filter((item) => PRODUCT_IDS.has(item.productId));
      setCart(productionItems);
      if (productionItems.length !== stored.length) {
        AsyncStorage.setItem(CART_KEY, JSON.stringify(productionItems));
      }
    });
    AsyncStorage.getItem(WISHLIST_KEY).then((v) => {
      if (!v) return;
      const stored = JSON.parse(v) as WishlistItem[];
      const productionItems = stored.filter((item) => PRODUCT_IDS.has(item.productId));
      setWishlist(productionItems);
      if (productionItems.length !== stored.length) {
        AsyncStorage.setItem(WISHLIST_KEY, JSON.stringify(productionItems));
      }
    });
  }, []);

  const saveCart = useCallback(async (items: CartItem[]) => {
    setCart(items);
    await AsyncStorage.setItem(CART_KEY, JSON.stringify(items));
  }, []);

  const saveWishlist = useCallback(async (items: WishlistItem[]) => {
    setWishlist(items);
    await AsyncStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  }, []);

  const addToCart = useCallback(async (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      let next: CartItem[];
      if (existing) {
        next = prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        next = [
          ...prev,
          {
            id: `${Date.now()}`,
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.primaryImage,
          },
        ];
      }
      AsyncStorage.setItem(CART_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeFromCart = useCallback(async (productId: string) => {
    setCart((prev) => {
      const next = prev.filter((i) => i.productId !== productId);
      AsyncStorage.setItem(CART_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const updateQty = useCallback(async (productId: string, qty: number) => {
    setCart((prev) => {
      const next =
        qty <= 0
          ? prev.filter((i) => i.productId !== productId)
          : prev.map((i) => (i.productId === productId ? { ...i, quantity: qty } : i));
      AsyncStorage.setItem(CART_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleWishlist = useCallback(async (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((i) => i.productId === product.id);
      const next = exists
        ? prev.filter((i) => i.productId !== product.id)
        : [
            ...prev,
            {
              id: `${Date.now()}`,
              productId: product.id,
              name: product.name,
              price: product.price,
              originalPrice: product.originalPrice,
              image: product.primaryImage,
              inStock: product.inStock,
            },
          ];
      AsyncStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isWishlisted = useCallback(
    (productId: string) => wishlist.some((i) => i.productId === productId),
    [wishlist]
  );

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const wishlistCount = wishlist.length;
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CommerceContext.Provider
      value={{
        products: PRODUCTS,
        cart,
        wishlist,
        cartCount,
        wishlistCount,
        addToCart,
        removeFromCart,
        updateQty,
        toggleWishlist,
        isWishlisted,
        cartTotal,
      }}
    >
      {children}
    </CommerceContext.Provider>
  );
}

export function useCommerce() {
  const ctx = useContext(CommerceContext);
  if (!ctx) throw new Error("useCommerce must be inside CommerceProvider");
  return ctx;
}
