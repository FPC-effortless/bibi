import { Router, Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { db } from "@workspace/db";
import { ordersTable, orderItemsTable, cartItemsTable, productsTable, usersTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";

const router = Router();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY ?? "";

// POST /initialize — create a Paystack payment session
router.post("/initialize", async (req: Request, res: Response) => {
  const auth = getAuth(req as any);
  const userId = auth?.userId;
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { email, amount, currency = "NGN", metadata } = req.body as {
    email: string;
    amount: number;
    currency?: string;
    metadata?: Record<string, unknown>;
  };

  if (!email || !amount) {
    res.status(400).json({ error: "email and amount required" }); return;
  }

  try {
    // Get user's cart items
    const cartItems = await db
      .select({
        productId: cartItemsTable.productId,
        quantity: cartItemsTable.quantity,
        name: productsTable.name,
        price: productsTable.price,
        image: productsTable.primaryImage,
      })
      .from(cartItemsTable)
      .innerJoin(productsTable, eq(cartItemsTable.productId, productsTable.id))
      .where(eq(cartItemsTable.userId, userId));

    if (cartItems.length === 0) {
      res.status(400).json({ error: "Cart is empty" }); return;
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
    const amountInKobo = Math.round(totalAmount * 100);

    // Create a pending order
    const [order] = await db.insert(ordersTable).values({
      userId,
      status: "pending",
      totalAmount: String(totalAmount),
      currency,
    }).returning();

    // Insert order items
    await db.insert(orderItemsTable).values(
      cartItems.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }))
    );

    if (!PAYSTACK_SECRET_KEY) {
      // Return mock response if Paystack not configured
      res.json({
        status: true,
        message: "Authorization URL created (mock)",
        data: {
          authorization_url: `${req.headers.origin || "http://localhost"}/checkout?order=${order.id}&mock=true`,
          access_code: "mock_access",
          reference: `mock_${order.id}`,
        },
        orderId: order.id,
      }); return;
    }

    const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: amountInKobo,
        currency,
        reference: order.id,
        metadata: { orderId: order.id, userId, ...metadata },
        callback_url: `${req.headers.origin || ""}/checkout/success`,
      }),
    });

    const paystackData = (await paystackRes.json()) as any;

    if (paystackData.status) {
      await db.update(ordersTable)
        .set({ paystackReference: paystackData.data.reference })
        .where(eq(ordersTable.id, order.id));
    }

    res.json({ ...paystackData, orderId: order.id });
  } catch (err) {
    console.error("Payment init error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /verify — verify a Paystack transaction and fulfill the order
router.post("/verify", async (req: Request, res: Response) => {
  const auth = getAuth(req as any);
  const userId = auth?.userId;
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { reference } = req.body as { reference: string };
  if (!reference) { res.status(400).json({ error: "reference required" }); return; }

  try {
    if (!PAYSTACK_SECRET_KEY) {
      // Mock verification
      await db.update(ordersTable)
        .set({ status: "paid", paystackStatus: "success", updatedAt: new Date() })
        .where(and(eq(ordersTable.id, reference), eq(ordersTable.userId, userId)));
      await db.delete(cartItemsTable).where(eq(cartItemsTable.userId, userId));
      res.json({ status: true, message: "Payment verified (mock)", paid: true }); return;
    }

    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
    });

    const paystackData = (await paystackRes.json()) as any;

    if (paystackData.status && paystackData.data?.status === "success") {
      await db.update(ordersTable)
        .set({ status: "paid", paystackStatus: "success", updatedAt: new Date() })
        .where(and(eq(ordersTable.paystackReference, reference), eq(ordersTable.userId, userId)));
      // Clear user's cart after successful payment
      await db.delete(cartItemsTable).where(eq(cartItemsTable.userId, userId));
    }

    res.json({ ...paystackData, paid: paystackData.data?.status === "success" });
  } catch (err) {
    console.error("Payment verify error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
