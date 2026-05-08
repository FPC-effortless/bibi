import { useState } from "react";
import { useLocation, Link, Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, CreditCard, MapPin, Package, Lock, ShoppingBag } from "lucide-react";
import { useUser, Show } from "@clerk/react";
import { useCommerce } from "@/components/commerce-provider";

type Step = 1 | 2;

const steps = [
  { id: 1, label: "Shipping", icon: MapPin },
  { id: 2, label: "Payment", icon: CreditCard },
];

function ProgressBar({ step }: { step: Step }) {
  return (
    <div className="border-b border-border bg-card py-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-4">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isActive = step === s.id;
            const isDone = step > s.id;
            return (
              <div key={s.id} className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isDone
                        ? "bg-green-500 text-white"
                        : isActive
                        ? "bg-bibiere-burgundy text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs font-medium ${isActive ? "text-bibiere-burgundy" : "text-muted-foreground"}`}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`h-0.5 w-16 ${step > s.id ? "bg-green-500" : "bg-border"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, navigate] = useLocation();
  const { user, isLoaded } = useUser();
  const { cart } = useCommerce();

  const [shipping, setShipping] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.primaryEmailAddress?.emailAddress ?? "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "NG",
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

  const handlePayment = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: shipping.email,
          amount: total,
          currency: "NGN",
          metadata: {
            shipping: `${shipping.address}, ${shipping.city}, ${shipping.state} ${shipping.zip}, ${shipping.country}`,
            customerName: `${shipping.firstName} ${shipping.lastName}`,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Payment initialization failed");
      }
      if (data.data?.authorization_url) {
        window.location.href = data.data.authorization_url;
      } else {
        navigate(`/order-confirmed?id=${data.orderId}`);
      }
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-bibiere-burgundy border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <>
      <Show when="signed-out">
        <Redirect to="/sign-in" />
      </Show>
      <Show when="signed-in">
        <div className="min-h-screen bg-background">
          <ProgressBar step={step} />

          {cart.length === 0 ? (
            <div className="container mx-auto px-4 py-24 text-center space-y-4">
              <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground" />
              <h2 className="text-2xl font-serif font-bold">Your cart is empty</h2>
              <p className="text-muted-foreground">Add items to your cart before checking out.</p>
              <Button asChild className="bg-bibiere-burgundy hover:bg-bibiere-burgundy/90 text-white">
                <Link href="/collections">Browse Collections</Link>
              </Button>
            </div>
          ) : (
            <div className="container mx-auto px-4 py-12">
              <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8">
                  {step === 1 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-serif font-bold">Shipping Information</h2>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={shipping.firstName}
                            onChange={(e) => setShipping({ ...shipping, firstName: e.target.value })}
                            placeholder="Jane"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={shipping.lastName}
                            onChange={(e) => setShipping({ ...shipping, lastName: e.target.value })}
                            placeholder="Doe"
                          />
                        </div>
                        <div className="col-span-2 space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={shipping.email}
                            onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                            placeholder="jane@example.com"
                          />
                        </div>
                        <div className="col-span-2 space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={shipping.phone}
                            onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                            placeholder="+234 800 000 0000"
                          />
                        </div>
                        <div className="col-span-2 space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            value={shipping.address}
                            onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                            placeholder="123 Luxury Lane"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={shipping.city}
                            onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                            placeholder="Lagos"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zip">Postal Code</Label>
                          <Input
                            id="zip"
                            value={shipping.zip}
                            onChange={(e) => setShipping({ ...shipping, zip: e.target.value })}
                            placeholder="100001"
                          />
                        </div>
                      </div>
                      <Button
                        className="w-full bg-bibiere-burgundy hover:bg-bibiere-burgundy/90 text-white"
                        disabled={!shipping.firstName || !shipping.email || !shipping.address}
                        onClick={() => setStep(2)}
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-serif font-bold">Confirm & Pay</h2>

                      <div className="bg-muted/40 rounded-xl p-4 space-y-3">
                        <p className="text-sm font-medium text-muted-foreground">Shipping to</p>
                        <p className="font-medium">{shipping.firstName} {shipping.lastName}</p>
                        <p className="text-sm text-muted-foreground">{shipping.address}, {shipping.city} {shipping.zip}</p>
                        <p className="text-sm text-muted-foreground">{shipping.email}</p>
                      </div>

                      <div className="border border-border rounded-xl p-4 space-y-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <Lock className="w-4 h-4" />
                          Secured by Paystack
                        </div>
                        <p className="text-sm text-muted-foreground">
                          You'll be redirected to Paystack's secure payment page to complete your purchase. 
                          We accept cards, bank transfers, and mobile money.
                        </p>
                        <div className="flex gap-2 pt-1">
                          {["Visa", "Mastercard", "Verve"].map((brand) => (
                            <span key={brand} className="text-xs border border-border rounded px-2 py-1 text-muted-foreground font-medium">
                              {brand}
                            </span>
                          ))}
                        </div>
                      </div>

                      {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                          {error}
                        </div>
                      )}

                      <div className="flex gap-4">
                        <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                          Back
                        </Button>
                        <Button
                          className="flex-1 bg-bibiere-burgundy hover:bg-bibiere-burgundy/90 text-white gap-2"
                          onClick={handlePayment}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Lock className="w-4 h-4" />
                              Pay ₦{total.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border border-border rounded-xl p-6 space-y-4 h-fit sticky top-24">
                  <h3 className="font-serif font-semibold text-lg">Order Summary</h3>
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-3 items-start">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 object-cover rounded-lg bg-muted flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Qty {item.quantity}</p>
                        </div>
                        <span className="text-sm font-medium flex-shrink-0">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Separator />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₦{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₦{total.toLocaleString()}</span>
                  </div>
                  <Badge className="w-full justify-center bg-green-50 text-green-700 border-green-200">
                    Free shipping on this order
                  </Badge>
                  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground pt-1">
                    <Lock className="w-3 h-3" />
                    Secured checkout
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Show>
    </>
  );
}
