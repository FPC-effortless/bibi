import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("products").collect();
  },
});

export const get = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("id"), args.id))
      .unique();
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("products").first();
    if (existing) return;

    const products = [
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
    ];

    for (const p of products) {
      await ctx.db.insert("products", p);
    }
  },
});
