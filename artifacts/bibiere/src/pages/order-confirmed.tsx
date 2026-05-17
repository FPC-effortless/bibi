import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { useAction, useQuery } from "convex/react";
import { CheckCircle2, Package, Ruler, Scissors, Truck } from "lucide-react";
import { api } from "../../../../lib/convex/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { hasConvexConfig } from "@/lib/runtime-config";
import { formatStoreCurrency } from "@/lib/currency-manager";

export default function OrderConfirmedPage() {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("id");
  const reference = params.get("reference") ?? params.get("trxref");
  if (!hasConvexConfig) {
    return <OrderConfirmedView orderId={orderId} order={null} verificationStatus="idle" verificationError={null} />;
  }

  return <BackendOrderConfirmedPage orderId={orderId} reference={reference} />;
}

function BackendOrderConfirmedPage({ orderId, reference }: { orderId: string | null; reference: string | null }) {
  const orders = useQuery(api.payments.list) ?? [];
  const verifyPayment = useAction(api.payments.verifyPayment);
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "verifying" | "verified" | "failed">(
    reference ? "verifying" : "idle",
  );
  const [verificationError, setVerificationError] = useState<string | null>(null);

  useEffect(() => {
    if (!reference) return;
    let cancelled = false;
    setVerificationStatus("verifying");
    setVerificationError(null);
    verifyPayment({ reference })
      .then((result) => {
        if (cancelled) return;
        if (result.paid) {
          setVerificationStatus("verified");
        } else {
          setVerificationStatus("failed");
          setVerificationError("Payment could not be confirmed yet.");
        }
      })
      .catch((error) => {
        if (cancelled) return;
        setVerificationStatus("failed");
        setVerificationError(error.message ?? "Payment verification failed.");
      });
    return () => {
      cancelled = true;
    };
  }, [reference, verifyPayment]);

  const order = useMemo(
    () => orders.find((item) => item._id === (orderId ?? reference)),
    [orders, orderId, reference],
  );
  return (
    <OrderConfirmedView
      orderId={orderId ?? reference}
      order={order ?? null}
      verificationStatus={verificationStatus}
      verificationError={verificationError}
    />
  );
}

function OrderConfirmedView({
  orderId,
  order,
  verificationStatus,
  verificationError,
}: {
  orderId: string | null;
  order: any;
  verificationStatus: "idle" | "verifying" | "verified" | "failed";
  verificationError: string | null;
}) {
  return (
    <main id="main-content" className="min-h-screen bg-background">
      <section className="container mx-auto max-w-3xl px-4 py-20 text-center">
        <CheckCircle2 className="mx-auto h-20 w-20 text-green-600" />
        <h1 className="mt-6 font-serif text-4xl font-bold">Order confirmed</h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Thank you for shopping with bibiere. Your made-to-order request has been received and is now visible in your account.
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
              {verificationStatus !== "idle" && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Payment verification:{" "}
                  <span className="font-medium text-foreground">
                    {verificationStatus === "verifying" ? "checking..." : verificationStatus}
                  </span>
                </p>
              )}
              {verificationError && (
                <p className="mt-2 text-sm text-red-600">{verificationError}</p>
              )}
              {hasConvexConfig && order && (
                <div className="mt-4 grid gap-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium capitalize">{order.status}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-medium">{formatStoreCurrency(order.totalAmount)}</span>
                  </div>
                  {order.eventDate && (
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Needed by</span>
                      <span className="font-medium">{new Date(order.eventDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 text-left sm:grid-cols-3">
          <div className="rounded-lg border border-border p-4">
            <Ruler className="h-5 w-5 text-bibiere-burgundy" />
            <h3 className="mt-3 font-medium">Measurements reviewed</h3>
            <p className="mt-1 text-sm text-muted-foreground">The team checks your fit details before production starts.</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <Scissors className="h-5 w-5 text-bibiere-burgundy" />
            <h3 className="mt-3 font-medium">Production begins</h3>
            <p className="mt-1 text-sm text-muted-foreground">Your garment is cut and sewn after payment confirmation.</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <Truck className="h-5 w-5 text-bibiere-burgundy" />
            <h3 className="mt-3 font-medium">Delivery follows</h3>
            <p className="mt-1 text-sm text-muted-foreground">Shipping details are used when the piece is ready.</p>
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
