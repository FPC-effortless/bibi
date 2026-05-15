import { query, mutation } from "./_generated/server";
import type { MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./adminAuth";

const productStatus = v.union(
  v.literal("draft"),
  v.literal("active"),
  v.literal("archived"),
);

const productInput = {
  id: v.optional(v.string()),
  slug: v.optional(v.string()),
  status: v.optional(productStatus),
  name: v.string(),
  price: v.number(),
  originalPrice: v.optional(v.number()),
  primaryImage: v.string(),
  hoverImage: v.optional(v.string()),
  images: v.optional(v.array(v.string())),
  category: v.string(),
  featured: v.boolean(),
  inStock: v.boolean(),
  inventoryCount: v.optional(v.number()),
  sortOrder: v.optional(v.number()),
  brand: v.string(),
  description: v.optional(v.string()),
  details: v.optional(v.string()),
  careInstructions: v.optional(v.string()),
  sizes: v.optional(v.array(v.string())),
  colors: v.optional(v.array(v.object({
    name: v.string(),
    value: v.string(),
  }))),
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function isCustomerVisible(product: { status?: string; inStock: boolean }) {
  return product.status !== "draft" && product.status !== "archived";
}

function stripUndefined<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, fieldValue]) => fieldValue !== undefined),
  ) as Partial<T>;
}

async function assertUniqueProduct(
  ctx: MutationCtx,
  id: string,
  slug: string,
  existingDocId?: string,
) {
  const existingById = await ctx.db
    .query("products")
    .withIndex("by_product_id", (q) => q.eq("id", id))
    .unique();
  if (existingById && existingById._id !== existingDocId) {
    throw new Error("Product ID already exists");
  }

  const existingBySlug = await ctx.db
    .query("products")
    .withIndex("by_slug", (q) => q.eq("slug", slug))
    .unique();
  if (existingBySlug && existingBySlug._id !== existingDocId) {
    throw new Error("Product slug already exists");
  }
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    return products
      .filter(isCustomerVisible)
      .sort((a, b) => (a.sortOrder ?? 9999) - (b.sortOrder ?? 9999));
  },
});

export const get = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const product = await ctx.db
      .query("products")
      .withIndex("by_product_id", (q) => q.eq("id", args.id))
      .unique();
    if (!product || !isCustomerVisible(product)) return null;
    return product;
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const product = await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!product || !isCustomerVisible(product)) return null;
    return product;
  },
});

export const adminList = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const products = await ctx.db.query("products").collect();
    return products.sort((a, b) => (a.sortOrder ?? 9999) - (b.sortOrder ?? 9999));
  },
});

export const adminCreate = mutation({
  args: productInput,
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const slug = args.slug?.trim() || slugify(args.name);
    const id = args.id?.trim() || slug;
    if (!slug || !id) throw new Error("Product needs a valid name or slug");

    await assertUniqueProduct(ctx, id, slug);

    return await ctx.db.insert("products", {
      id,
      slug,
      status: args.status ?? "draft",
      name: args.name,
      price: args.price,
      originalPrice: args.originalPrice,
      primaryImage: args.primaryImage,
      hoverImage: args.hoverImage,
      images: args.images,
      category: args.category,
      featured: args.featured,
      inStock: args.inStock,
      inventoryCount: args.inventoryCount,
      sortOrder: args.sortOrder,
      brand: args.brand,
      description: args.description,
      details: args.details,
      careInstructions: args.careInstructions,
      sizes: args.sizes,
      colors: args.colors,
      updatedAt: Date.now(),
    });
  },
});

export const adminUpdate = mutation({
  args: {
    productId: v.id("products"),
    ...productInput,
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const existing = await ctx.db.get(args.productId);
    if (!existing) throw new Error("Product not found");

    const slug = args.slug?.trim() || slugify(args.name);
    const id = args.id?.trim() || slug;
    if (!slug || !id) throw new Error("Product needs a valid name or slug");

    await assertUniqueProduct(ctx, id, slug, args.productId);

    await ctx.db.patch(args.productId, stripUndefined({
      id,
      slug,
      status: args.status ?? existing.status ?? "draft",
      name: args.name,
      price: args.price,
      originalPrice: args.originalPrice,
      primaryImage: args.primaryImage,
      hoverImage: args.hoverImage,
      images: args.images,
      category: args.category,
      featured: args.featured,
      inStock: args.inStock,
      inventoryCount: args.inventoryCount,
      sortOrder: args.sortOrder,
      brand: args.brand,
      description: args.description,
      details: args.details,
      careInstructions: args.careInstructions,
      sizes: args.sizes,
      colors: args.colors,
      updatedAt: Date.now(),
    }));
  },
});

export const adminArchive = mutation({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.productId, {
      status: "archived",
      featured: false,
      inStock: false,
      updatedAt: Date.now(),
    });
  },
});

export const adminSetFeatured = mutation({
  args: { productId: v.id("products"), featured: v.boolean() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.productId, {
      featured: args.featured,
      updatedAt: Date.now(),
    });
  },
});

export const adminSetInventory = mutation({
  args: {
    productId: v.id("products"),
    inventoryCount: v.number(),
    inStock: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.productId, {
      inventoryCount: args.inventoryCount,
      inStock: args.inStock ?? args.inventoryCount > 0,
      updatedAt: Date.now(),
    });
  },
});

export const adminSetStatus = mutation({
  args: { productId: v.id("products"), status: productStatus },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.productId, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
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
        status: "active",
        slug: "elegant-black-silk-dress",
        inventoryCount: 12,
        sortOrder: 10,
        brand: "bibiere",
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: [{ name: "Black", value: "#111827" }],
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
        status: "active",
        slug: "cozy-wool-coat",
        inventoryCount: 0,
        sortOrder: 20,
        brand: "bibiere",
        sizes: ["S", "M", "L"],
        colors: [{ name: "Camel", value: "#b08968" }],
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
        status: "active",
        slug: "luxury-quilted-handbag",
        inventoryCount: 8,
        sortOrder: 30,
        brand: "bibiere",
        sizes: ["One Size"],
        colors: [{ name: "Black", value: "#111827" }],
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
        status: "active",
        slug: "premium-tailored-blazer",
        inventoryCount: 10,
        sortOrder: 40,
        brand: "bibiere",
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: [{ name: "Navy", value: "#1f2a44" }],
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
        status: "active",
        slug: "cashmere-scarf",
        inventoryCount: 18,
        sortOrder: 50,
        brand: "bibiere",
        sizes: ["One Size"],
        colors: [{ name: "Oat", value: "#d8cab8" }],
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
        status: "active",
        slug: "luxury-wristwatch",
        inventoryCount: 6,
        sortOrder: 60,
        brand: "bibiere",
        sizes: ["One Size"],
        colors: [{ name: "Gold", value: "#c7a34f" }],
      },
    ];

    for (const p of products) {
      await ctx.db.insert("products", p);
    }
  },
});
