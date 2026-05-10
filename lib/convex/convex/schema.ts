import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(), // Clerk's unique ID for the user
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  }).index("by_token", ["tokenIdentifier"]),

  products: defineTable({
    id: v.string(), // Original product ID from fallback data
    name: v.string(),
    price: v.number(),
    originalPrice: v.optional(v.number()),
    primaryImage: v.string(),
    hoverImage: v.optional(v.string()),
    category: v.string(),
    featured: v.boolean(),
    inStock: v.boolean(),
    brand: v.string(),
    description: v.optional(v.string()),
  })
    .index("by_category", ["category"])
    .index("by_product_id", ["id"]),

  cartItems: defineTable({
    userId: v.id("users"),
    productId: v.string(),
    quantity: v.number(),
    size: v.optional(v.string()),
    color: v.optional(v.string()),
  }).index("by_user", ["userId"]),

  wishlistItems: defineTable({
    userId: v.id("users"),
    productId: v.string(),
  }).index("by_user", ["userId"]),

  orders: defineTable({
    userId: v.id("users"),
    status: v.string(), // "pending", "paid", etc.
    totalAmount: v.number(),
    currency: v.string(),
    paystackReference: v.optional(v.string()),
    paystackStatus: v.optional(v.string()),
    shippingAddress: v.optional(v.string()),
  }).index("by_user", ["userId"]),

  orderItems: defineTable({
    orderId: v.id("orders"),
    productId: v.string(),
    name: v.string(),
    price: v.number(),
    quantity: v.number(),
    image: v.optional(v.string()),
  }).index("by_order", ["orderId"]),
});
