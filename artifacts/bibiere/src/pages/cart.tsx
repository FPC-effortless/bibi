import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Lock } from "lucide-react";
import { useCommerce } from "@/components/commerce-provider";
import { CartItem } from "@/types";

export default function CartPage() {
  const { cart, updateCartQuantity } = useCommerce();
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  const updateQuantity = async (item: CartItem, newQuantity: number) => {
    await updateCartQuantity(item.productId, newQuantity);
  };

  const applyPromoCode = () => {
    if (promoCode.trim().toLowerCase() === "welcome10") {
      setAppliedPromo("WELCOME10");
      setPromoCode("");
    }
  };

  const subtotal = cart.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);
  const discount = appliedPromo ? subtotal * 0.1 : 0;
  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 25;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + shipping + tax;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <ShoppingBag className="w-24 h-24 mx-auto text-muted-foreground" />
            <h1 className="text-3xl font-serif font-bold">Your Cart is Empty</h1>
            <p className="text-muted-foreground">Discover our curated collection of luxury fashion pieces</p>
            <div className="flex flex-col items-center gap-4">
              <Button asChild size="lg">
                <Link href="/collections">Continue Shopping</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/wishlist">View Wishlist</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/collections">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
          <h1 className="text-3xl font-serif font-bold">Shopping Cart</h1>
          <p className="text-muted-foreground mt-2">
            {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item: CartItem) => (
              <div key={(item as any)._id ?? (item as any).id ?? item.productId} className="border border-border rounded-lg p-6">
                <div className="flex gap-6">
                  <Link href={`/product/${item.productId}`} className="w-24 h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.image || "/placeholder.svg"} alt={item.name} className="h-full w-full object-cover" />
                  </Link>
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-serif font-semibold text-lg">{item.name}</h3>
                        {item.brand && <p className="text-sm text-muted-foreground mt-1">{item.brand}</p>}
                        {item.quantity >= 5 && (
                          <Badge variant="secondary" className="mt-2">
                            Quantity {item.quantity}
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateQuantity(item, 0)}
                        className="text-muted-foreground hover:text-destructive"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item, item.quantity - 1)}
                          aria-label={`Decrease ${item.name} quantity`}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item, item.quantity + 1)}
                          aria-label={`Increase ${item.name} quantity`}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${item.price.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">
                          ${(item.price * item.quantity).toLocaleString()} total
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="border border-border rounded-lg p-6 space-y-6">
              <h2 className="text-xl font-serif font-semibold">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedPromo})</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              {shipping > 0 && (
                <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                  Add ${(500 - subtotal).toFixed(2)} more for free shipping
                </div>
              )}
            </div>

            <div className="border border-border rounded-lg p-6 space-y-4">
              <h3 className="font-semibold">Promo Code</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && applyPromoCode()}
                />
                <Button variant="outline" onClick={applyPromoCode}>
                  Apply
                </Button>
              </div>
              {appliedPromo && (
                <div className="text-sm text-green-600">{appliedPromo} applied (10% off)</div>
              )}
            </div>

            <Button asChild size="lg" className="w-full bg-bibiere-burgundy hover:bg-bibiere-burgundy-dark text-white">
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Lock className="h-3 w-3" />
              Secure checkout with SSL encryption
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
