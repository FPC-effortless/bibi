import type { QueryCtx, MutationCtx } from "./_generated/server";

type AdminCtx = QueryCtx | MutationCtx;

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export async function requireAdmin(ctx: AdminCtx) {
  const identity = await ctx.auth.getUserIdentity();
  const email = identity?.email?.toLowerCase();

  if (!email || !getAdminEmails().includes(email)) {
    throw new Error("Admin access required");
  }

  return identity;
}
