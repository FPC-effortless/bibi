import { Router, Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { db } from "@workspace/db";
import {
  productsTable,
  cartItemsTable,
  wishlistItemsTable,
  usersTable,
  ordersTable,
} from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { fallbackCommerceData } from "../lib/commerce-data";

const router = Router();

async function ensureUser(userId: string, email?: string) {
  await db
    .insert(usersTable)
    .values({ id: userId, email: email ?? `${userId}@clerk.local` })
    .onConflictDoNothing();
}

async function getOrSeedProducts() {
  const existing = await db.select().from(productsTable).limit(1);
  if (existing.length === 0) {
    for (const p of fallbackCommerceData.products) {
      await db.insert(productsTable).values({
        id: p.id,
        name: p.name,
        price: String(p.price),
        originalPrice: p.originalPrice ? String(p.originalPrice) : null,
        primaryImage: p.primaryImage,
        hoverImage: p.hoverImage,
        category: p.category,
        featured: p.featured,
        inStock: p.inStock,
        brand: p.brand,
      }).onConflictDoNothing();
    }
  }
  const rows = await db.select().from(productsTable);
  return rows.map((p) => ({
    id: p.id,
    name: p.name,
    price: Number(p.price),
    originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
    primaryImage: p.primaryImage,
    hoverImage: p.hoverImage ?? p.primaryImage,
    category: p.category,
    featured: p.featured,
    inStock: p.inStock,
    brand: p.brand,
  }));
}

const cartSelect = {
  id: cartItemsTable.id,
  productId: cartItemsTable.productId,
  quantity: cartItemsTable.quantity,
  size: cartItemsTable.size,
  color: cartItemsTable.color,
  name: productsTable.name,
  price: productsTable.price,
  image: productsTable.primaryImage,
  brand: productsTable.brand,
};

const wishlistSelect = {
  id: wishlistItemsTable.id,
  productId: wishlistItemsTable.productId,
  name: productsTable.name,
  price: productsTable.price,
  originalPrice: productsTable.originalPrice,
  image: productsTable.primaryImage,
  inStock: productsTable.inStock,
  brand: productsTable.brand,
  dateAdded: wishlistItemsTable.createdAt,
};

function mapCart(rows: any[]) {
  return rows.map((r) => ({
    id: r.id,
    productId: r.productId,
    name: r.name,
    price: Number(r.price),
    quantity: r.quantity,
    size: r.size ?? undefined,
    color: r.color ?? undefined,
    image: r.image,
    brand: r.brand,
  }));
}

function mapWishlist(rows: any[]) {
  return rows.map((r) => ({
    id: r.id,
    productId: r.productId,
    name: r.name,
    price: Number(r.price),
    originalPrice: r.originalPrice ? Number(r.originalPrice) : undefined,
    image: r.image,
    inStock: r.inStock,
    brand: r.brand,
    dateAdded: r.dateAdded?.toISOString(),
  }));
}

// GET /bootstrap
router.get("/bootstrap", async (req: Request, res: Response) => {
  try {
    const products = await getOrSeedProducts();
    const auth = getAuth(req as any);
    const userId = auth?.userId;
    if (!userId) return res.json({ products, cart: [], wishlist: [] });

    await ensureUser(userId);
    const [cartRows, wishlistRows] = await Promise.all([
      db.select(cartSelect).from(cartItemsTable)
        .innerJoin(productsTable, eq(cartItemsTable.productId, productsTable.id))
        .where(eq(cartItemsTable.userId, userId)),
      db.select(wishlistSelect).from(wishlistItemsTable)
        .innerJoin(productsTable, eq(wishlistItemsTable.productId, productsTable.id))
        .where(eq(wishlistItemsTable.userId, userId)),
    ]);
    res.json({ products, cart: mapCart(cartRows), wishlist: mapWishlist(wishlistRows) });
  } catch (err) {
    console.error("Bootstrap error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /wishlist
router.post("/wishlist", async (req: Request, res: Response) => {
  const auth = getAuth(req as any);
  const userId = auth?.userId;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const { productId, action } = req.body as { productId: string; action: "add" | "remove" };
  if (!productId || !["add", "remove"].includes(action)) {
    return res.status(400).json({ error: "Invalid request" });
  }

  try {
    await ensureUser(userId);
    if (action === "remove") {
      await db.delete(wishlistItemsTable).where(
        and(eq(wishlistItemsTable.userId, userId), eq(wishlistItemsTable.productId, productId)),
      );
    } else {
      await db.insert(wishlistItemsTable).values({ userId, productId }).onConflictDoNothing();
    }
    const rows = await db.select(wishlistSelect).from(wishlistItemsTable)
      .innerJoin(productsTable, eq(wishlistItemsTable.productId, productsTable.id))
      .where(eq(wishlistItemsTable.userId, userId));
    res.json({ items: mapWishlist(rows) });
  } catch (err) {
    console.error("Wishlist error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /cart
router.post("/cart", async (req: Request, res: Response) => {
  const auth = getAuth(req as any);
  const userId = auth?.userId;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const { productId, size, color } = req.body as { productId: string; size?: string; color?: string };
  if (!productId) return res.status(400).json({ error: "productId required" });

  try {
    await ensureUser(userId);
    const product = await db.select().from(productsTable).where(eq(productsTable.id, productId)).limit(1);
    if (!product.length) return res.status(404).json({ error: "Product not found" });

    const existing = await db.select().from(cartItemsTable)
      .where(and(eq(cartItemsTable.userId, userId), eq(cartItemsTable.productId, productId)))
      .limit(1);

    if (existing.length > 0) {
      await db.update(cartItemsTable)
        .set({ quantity: existing[0].quantity + 1, updatedAt: new Date() })
        .where(eq(cartItemsTable.id, existing[0].id));
    } else {
      await db.insert(cartItemsTable).values({ userId, productId, quantity: 1, size: size ?? null, color: color ?? null });
    }

    const rows = await db.select(cartSelect).from(cartItemsTable)
      .innerJoin(productsTable, eq(cartItemsTable.productId, productsTable.id))
      .where(eq(cartItemsTable.userId, userId));
    res.json({ items: mapCart(rows) });
  } catch (err) {
    console.error("Cart add error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /cart
router.patch("/cart", async (req: Request, res: Response) => {
  const auth = getAuth(req as any);
  const userId = auth?.userId;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const { productId, quantity } = req.body as { productId: string; quantity: number };
  if (!productId || quantity === undefined) return res.status(400).json({ error: "productId and quantity required" });

  try {
    if (quantity <= 0) {
      await db.delete(cartItemsTable).where(
        and(eq(cartItemsTable.userId, userId), eq(cartItemsTable.productId, productId)),
      );
    } else {
      await db.update(cartItemsTable)
        .set({ quantity, updatedAt: new Date() })
        .where(and(eq(cartItemsTable.userId, userId), eq(cartItemsTable.productId, productId)));
    }
    const rows = await db.select(cartSelect).from(cartItemsTable)
      .innerJoin(productsTable, eq(cartItemsTable.productId, productsTable.id))
      .where(eq(cartItemsTable.userId, userId));
    res.json({ items: mapCart(rows) });
  } catch (err) {
    console.error("Cart update error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /cart
router.delete("/cart", async (req: Request, res: Response) => {
  const auth = getAuth(req as any);
  const userId = auth?.userId;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  try {
    await db.delete(cartItemsTable).where(eq(cartItemsTable.userId, userId));
    res.json({ items: [] });
  } catch (err) {
    console.error("Cart clear error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /orders
router.get("/orders", async (req: Request, res: Response) => {
  const auth = getAuth(req as any);
  const userId = auth?.userId;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  try {
    const orders = await db.select().from(ordersTable).where(eq(ordersTable.userId, userId));
    res.json({ orders });
  } catch (err) {
    console.error("Orders error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
