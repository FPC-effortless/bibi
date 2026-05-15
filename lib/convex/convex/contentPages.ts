import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./adminAuth";

const pageInput = {
  slug: v.string(),
  title: v.string(),
  eyebrow: v.string(),
  intro: v.string(),
  sections: v.array(v.object({
    title: v.string(),
    body: v.string(),
  })),
  status: v.union(v.literal("draft"), v.literal("active"), v.literal("archived")),
};

export const get = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const page = await ctx.db
      .query("contentPages")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!page || page.status !== "active") return null;
    return page;
  },
});

export const adminList = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const pages = await ctx.db.query("contentPages").collect();
    return pages.sort((a, b) => a.slug.localeCompare(b.slug));
  },
});

export const adminUpsert = mutation({
  args: pageInput,
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const slug = args.slug.trim().toLowerCase();
    if (!slug) throw new Error("Page slug is required");

    const existing = await ctx.db
      .query("contentPages")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();

    const page = {
      slug,
      title: args.title,
      eyebrow: args.eyebrow,
      intro: args.intro,
      sections: args.sections,
      status: args.status,
      updatedAt: Date.now(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, page);
      return existing._id;
    }

    return await ctx.db.insert("contentPages", page);
  },
});
