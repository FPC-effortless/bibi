import { mutation, query, QueryCtx } from "./_generated/server";
import { v } from "convex/values";

export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (user !== null) {
      // Update existing user
      if (user.email !== identity.email) {
        await ctx.db.patch(user._id, { email: identity.email! });
      }
      return user._id;
    }

    // Create new user
    return await ctx.db.insert("users", {
      tokenIdentifier: identity.tokenIdentifier,
      email: identity.email!,
      firstName: identity.givenName,
      lastName: identity.familyName,
      imageUrl: identity.pictureUrl,
    });
  },
});

export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  return await ctx.db
    .query("users")
    .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
    .unique();
}
