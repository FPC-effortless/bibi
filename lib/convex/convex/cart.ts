import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./users";

function isCustomerVisibleProduct(product: { status?: string; inStock: boolean } | null) {
  return Boolean(product) && product!.status !== "draft" && product!.status !== "archived";
}

export const get = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    const items = await ctx.db
      .query("cartItems")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // Join with products manually in Convex (or denormalize)
    const itemsWithProducts = [];
    for (const item of items) {
        const product = await ctx.db
          .query("products")
          .withIndex("by_product_id", (q) => q.eq("id", item.productId))
          .unique();
        if (!isCustomerVisibleProduct(product)) continue;
        itemsWithProducts.push({
          ...item,
          name: product?.name ?? "Unknown Product",
          price: product?.price ?? 0,
          image: product?.primaryImage ?? "",
          brand: product?.brand ?? "bibiere",
        });
    }

    return itemsWithProducts;
  },
});

export const add = mutation({
  args: {
    productId: v.string(),
    size: v.optional(v.string()),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const product = await ctx.db
      .query("products")
      .withIndex("by_product_id", (q) => q.eq("id", args.productId))
      .unique();
    if (!isCustomerVisibleProduct(product) || !product?.inStock) {
      throw new Error("Product is not available");
    }

    const existing = await ctx.db
      .query("cartItems")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("productId"), args.productId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { quantity: existing.quantity + 1 });
    } else {
      await ctx.db.insert("cartItems", {
        userId: user._id,
        productId: args.productId,
        quantity: 1,
        size: args.size,
        color: args.color,
      });
    }
  },
});

export const update = mutation({
  args: {
    productId: v.string(),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("cartItems")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("productId"), args.productId))
      .unique();

    if (!existing) return;

    if (args.quantity <= 0) {
      await ctx.db.delete(existing._id);
    } else {
      await ctx.db.patch(existing._id, { quantity: args.quantity });
    }
  },
});

export const remove = mutation({
  args: { productId: v.string() },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("cartItems")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("productId"), args.productId))
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});

export const clear = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const items = await ctx.db
      .query("cartItems")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    for (const item of items) {
      await ctx.db.delete(item._id);
    }
  },
});
