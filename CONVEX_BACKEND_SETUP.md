# Convex Backend Setup

The app now reads and writes commerce state through a Convex-compatible HTTP layer.

## Environment variables

Add these variables to your environment:

```bash
NEXT_PUBLIC_CONVEX_URL=https://<your-deployment>.convex.cloud
CONVEX_ADMIN_KEY=<optional-admin-key-for-server-side-mutations>
```

## Expected Convex functions

The HTTP adapter calls the following function paths:

- `commerce:getSnapshot` (query) -> `{ products, cart, wishlist }`
- `commerce:listProducts` (query) -> `products[]`
- `commerce:updateWishlist` (mutation) -> `wishlist[]`
- `commerce:addToCart` (mutation) -> `cart[]`
- `commerce:updateCart` (mutation) -> `cart[]`

If Convex is not configured, the app automatically falls back to in-memory demo data.
