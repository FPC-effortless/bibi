const getEnvString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

export const clerkPublishableKey = getEnvString(
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);
export const clerkProxyUrl = getEnvString(import.meta.env.VITE_CLERK_PROXY_URL);
export const convexUrl = getEnvString(import.meta.env.VITE_CONVEX_URL);

export const hasClerkConfig = clerkPublishableKey.length > 0;
export const hasConvexConfig = convexUrl.length > 0;
