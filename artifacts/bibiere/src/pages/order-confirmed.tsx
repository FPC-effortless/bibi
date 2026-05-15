import { useMemo } from "react";
import { Link } from "wouter";
import { useQuery } from "convex/react";
import { CheckCircle2, Package } from "lucide-react";
import { api } from "../../../../lib/convex/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { hasConvexConfig } from "@/lib/runtime-config";

export default function OrderConfirmedPage() {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("id");
  if (!hasConvexConfig) {
    return <OrderConfirmedView orderId={orderId} order={null} />;
  }

  return <BackendOrderConfirmedPage orderId={orderId} />;
}

function BackendOrderConfirmedPage({ orderId }: { orderId: string | null }) {
  const orders = useQuery(api.payments.list) ?? [];
  const order = useMemo(
    () => orders.find((item) => item._id === orderId),
    [orders, orderId],
  );
  return <OrderConfirmedView orderId={orderId} order={order ?? null} />;
}

function OrderConfirmedView({ orderId, order }: { orderId: string | null; order: any }) {
  return (
    <main id="main-content" className="min-h-screen bg-background">
      <section className="container mx-auto max-w-3xl px-4 py-20 text-center">
        <CheckCircle2 className="mx-auto h-20 w-20 text-green-600" />
        <h1 className="mt-6 font-serif text-4xl font-bold">Order confirmed</h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Thank you for shopping with bibiere. Your order has been received and is now visible in your account.
        </p>

        <div className="mt-10 rounded-xl border border-border bg-card p-6 text-left">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-bibiere-burgundy/10 p-3">
              <Package className="h-6 w-6 text-bibiere-burgundy" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-semibold">Order details</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Reference: <span className="font-mono text-foreground">{orderId ?? "pending"}</span>
              </p>
              {hasConvexConfig && order && (
                <div className="mt-4 grid gap-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium capitalize">{order.status}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-medium">{order.currency} {order.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/account">View account</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/collections">Continue shopping</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
