import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./users";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    const items = await ctx.db
      .query("wishlistItems")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const itemsWithProducts = await Promise.all(
      items.map(async (item) => {
        const product = await ctx.db
          .query("products")
          .filter((q) => q.eq(q.field("id"), item.productId))
          .unique();
        return {
          ...item,
          name: product?.name ?? "Unknown Product",
          price: product?.price ?? 0,
          originalPrice: product?.originalPrice,
          image: product?.primaryImage ?? "",
          inStock: product?.inStock ?? false,
          brand: product?.brand ?? "bibiere",
          dateAdded: new Date(item._creationTime).toISOString(),
        };
      })
    );

    return itemsWithProducts;
  },
});

export const toggle = mutation({
  args: { productId: v.string() },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("wishlistItems")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("productId"), args.productId))
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
    } else {
      await ctx.db.insert("wishlistItems", {
        userId: user._id,
        productId: args.productId,
      });
    }
  },
});
