import { mutation, query, action, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./users";
import { internal } from "./_generated/api";
import { requireAdmin } from "./adminAuth";

const orderStatus = v.union(
  v.literal("pending"),
  v.literal("paid"),
  v.literal("processing"),
  v.literal("shipped"),
  v.literal("delivered"),
  v.literal("cancelled"),
);

function allowMockPayments() {
  return process.env.ALLOW_MOCK_PAYMENTS === "true";
}

function isCustomerVisibleProduct(product: { status?: string; inStock: boolean } | null) {
  return Boolean(product) && product!.status !== "draft" && product!.status !== "archived";
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];
    return await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

export const getItems = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    const order = await ctx.db.get(args.orderId);
    if (!order || order.userId !== user._id) {
      throw new Error("Order not found");
    }

    return await ctx.db
      .query("orderItems")
      .withIndex("by_order", (q) => q.eq("orderId", args.orderId))
      .collect();
  },
});

export const adminList = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const orders = await ctx.db.query("orders").order("desc").collect();
    return await Promise.all(
      orders.map(async (order) => {
        const user = await ctx.db.get(order.userId);
        const items = await ctx.db
          .query("orderItems")
          .withIndex("by_order", (q) => q.eq("orderId", order._id))
          .collect();
        return {
          ...order,
          customer: user,
          itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
        };
      }),
    );
  },
});

export const adminGet = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");
    const customer = await ctx.db.get(order.userId);
    const items = await ctx.db
      .query("orderItems")
      .withIndex("by_order", (q) => q.eq("orderId", args.orderId))
      .collect();
    return { order, customer, items };
  },
});

export const adminUpdateStatus = mutation({
  args: { orderId: v.id("orders"), status: orderStatus },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.orderId, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

export const initializePayment = action({
  args: {
    email: v.string(),
    currency: v.optional(v.string()),
    callbackUrl: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new Error("Not authenticated");

    // 1. Get cart items via internal query
    const cartItems = await ctx.runQuery(internal.payments.getCartInternal, {});
    if (cartItems.length === 0) throw new Error("Cart is empty");

    const totalAmount = (cartItems as any[]).reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    const amountInKobo = Math.round(totalAmount * 100);

    // 2. Create pending order via internal mutation
    const orderId: string = (await ctx.runMutation(internal.payments.createOrderInternal, {
      totalAmount,
      currency: args.currency ?? "NGN",
      customerName: args.metadata?.customerName,
      customerEmail: args.email,
      phone: args.metadata?.phone,
      shippingAddress: args.metadata?.shipping,
      measurements: args.metadata?.measurements,
      productionNotes: args.metadata?.productionNotes,
      eventDate: args.metadata?.eventDate,
      items: (cartItems as any[]).map((item: any) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: item.image,
      })),
    })) as string;

    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

    if (!PAYSTACK_SECRET_KEY) {
      if (!allowMockPayments()) {
        throw new Error("Payment provider is not configured");
      }
      return {
        status: true,
        message: "Mock payment initialized",
        data: {
          authorization_url: args.callbackUrl
            ? `${args.callbackUrl}?reference=${orderId}&id=${orderId}&mock=true`
            : `/order-confirmed?reference=${orderId}&id=${orderId}&mock=true`,
          reference: orderId,
        },
        orderId,
      };
    }

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: args.email,
        amount: amountInKobo,
        currency: args.currency ?? "NGN",
        reference: orderId,
        callback_url: args.callbackUrl,
        metadata: { orderId, ...args.metadata },
      }),
    });

    const data = await response.json();
    if (data.status) {
      await ctx.runMutation(internal.payments.updateOrderReferenceInternal, {
        orderId: orderId as any,
        reference: data.data.reference,
      });
    }

    return { ...data, orderId };
  },
});

export const verifyPayment = action({
  args: { reference: v.string() },
  handler: async (ctx, args) => {
    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

    if (!PAYSTACK_SECRET_KEY) {
      if (!allowMockPayments()) {
        throw new Error("Payment provider is not configured");
      }
      // Mock verification
      await ctx.runMutation(internal.payments.fulfillOrderInternal, { reference: args.reference });
      return { status: true, message: "Payment verified (mock)", paid: true };
    }

    const response = await fetch(`https://api.paystack.co/transaction/verify/${args.reference}`, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
    });

    const data = await response.json();
    if (data.status && data.data?.status === "success") {
      await ctx.runMutation(internal.payments.fulfillOrderInternal, { reference: args.reference });
    }

    return { ...data, paid: data.data?.status === "success" };
  },
});

// Internal helpers
export const getCartInternal = internalQuery({
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];
    const items = await ctx.db.query("cartItems").withIndex("by_user", (q) => q.eq("userId", user._id)).collect();
    return await Promise.all(items.map(async item => {
        const product = await ctx.db.query("products").filter(q => q.eq(q.field("id"), item.productId)).unique();
        if (!isCustomerVisibleProduct(product) || !product?.inStock) {
          throw new Error("Cart contains an unavailable product");
        }
        return { ...item, name: product?.name ?? "", price: product?.price ?? 0, image: product?.primaryImage ?? "" };
    }));
  }
});

export const createOrderInternal = internalMutation({
  args: {
    totalAmount: v.number(),
    currency: v.string(),
    customerName: v.optional(v.string()),
    customerEmail: v.optional(v.string()),
    phone: v.optional(v.string()),
    shippingAddress: v.optional(v.string()),
    measurements: v.optional(v.string()),
    productionNotes: v.optional(v.string()),
    eventDate: v.optional(v.string()),
    items: v.array(v.object({
        productId: v.string(),
        name: v.string(),
        price: v.number(),
        quantity: v.number(),
        size: v.optional(v.string()),
        color: v.optional(v.string()),
        image: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");
    const orderId = await ctx.db.insert("orders", {
      userId: user._id,
      status: "pending",
      totalAmount: args.totalAmount,
      currency: args.currency,
      customerName: args.customerName,
      customerEmail: args.customerEmail,
      phone: args.phone,
      shippingAddress: args.shippingAddress,
      measurements: args.measurements,
      productionNotes: args.productionNotes,
      eventDate: args.eventDate,
      updatedAt: Date.now(),
    });
    for (const item of args.items) {
      await ctx.db.insert("orderItems", { ...item, orderId });
    }
    return orderId;
  },
});

export const updateOrderReferenceInternal = internalMutation({
  args: { orderId: v.id("orders"), reference: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, { paystackReference: args.reference });
  }
});

export const fulfillOrderInternal = internalMutation({
  args: { reference: v.string() },
  handler: async (ctx, args) => {
    const order = await ctx.db.query("orders").filter(q => q.or(
        q.eq(q.field("_id"), args.reference),
        q.eq(q.field("paystackReference"), args.reference)
    )).unique();
    if (!order) return;
    await ctx.db.patch(order._id, { status: "paid", paystackStatus: "success" });
    const orderItems = await ctx.db
      .query("orderItems")
      .withIndex("by_order", (q) => q.eq("orderId", order._id))
      .collect();
    const cartItems = await ctx.db.query("cartItems").withIndex("by_user", (q) => q.eq("userId", order.userId)).collect();
    for (const item of cartItems) {
      const fulfilled = orderItems.some((orderItem) =>
        orderItem.productId === item.productId &&
        orderItem.size === item.size &&
        orderItem.color === item.color
      );
      if (fulfilled) await ctx.db.delete(item._id);
    }
  }
});
