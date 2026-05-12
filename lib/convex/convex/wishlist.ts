import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./users";

function isCustomerVisibleProduct(product: { status?: string } | null) {
  return Boolean(product) && product!.status !== "draft" && product!.status !== "archived";
}

export const get = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    const items = await ctx.db
      .query("wishlistItems")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

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
          originalPrice: product?.originalPrice,
          image: product?.primaryImage ?? "",
          inStock: product?.inStock ?? false,
          brand: product?.brand ?? "bibiere",
          dateAdded: new Date(item._creationTime).toISOString(),
        });
    }

    return itemsWithProducts;
  },
});

export const toggle = mutation({
  args: { productId: v.string() },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const product = await ctx.db
      .query("products")
      .withIndex("by_product_id", (q) => q.eq("id", args.productId))
      .unique();
    if (!isCustomerVisibleProduct(product)) {
      throw new Error("Product is not available");
    }

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
