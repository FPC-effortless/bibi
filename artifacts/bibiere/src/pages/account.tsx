import { useState, useEffect } from "react";
import { Link, Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Package, Heart, Settings, LogOut } from "lucide-react";
import { useUser, useClerk, Show } from "@clerk/react";
import { useCommerce } from "@/components/commerce-provider";

const statusColors: Record<string, string> = {
  paid: "bg-green-100 text-green-800",
  shipped: "bg-blue-100 text-blue-800",
  processing: "bg-yellow-100 text-yellow-800",
  pending: "bg-gray-100 text-gray-600",
  cancelled: "bg-red-100 text-red-800",
};

export default function AccountPage() {
  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { wishlist } = useCommerce();

  useEffect(() => {
    if (!user) return;
    fetch("/api/commerce/orders")
      .then((r) => r.json())
      .then((data) => setOrders(data.orders ?? []))
      .catch(() => {})
      .finally(() => setOrdersLoading(false));
  }, [user]);

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
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-10">
                {user?.imageUrl ? (
                  <img src={user.imageUrl} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-bibiere-burgundy/20" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-bibiere-burgundy/10 flex items-center justify-center">
                    <User className="w-8 h-8 text-bibiere-burgundy" />
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-serif font-bold">
                    {user?.firstName ? `Welcome back, ${user.firstName}` : "My Account"}
                  </h1>
                  <p className="text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
                </div>
              </div>

              <Tabs value={tab} onValueChange={setTab}>
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="orders" className="gap-2">
                    <Package className="w-4 h-4" />
                    Orders
                  </TabsTrigger>
                  <TabsTrigger value="wishlist" className="gap-2">
                    <Heart className="w-4 h-4" />
                    Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="gap-2">
                    <Settings className="w-4 h-4" />
                    Settings
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="orders" className="space-y-6">
                  <h2 className="text-xl font-serif font-semibold">Order History</h2>
                  {ordersLoading ? (
                    <div className="animate-pulse space-y-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="h-24 bg-muted rounded-xl" />
                      ))}
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12 space-y-4">
                      <Package className="w-16 h-16 mx-auto text-muted-foreground" />
                      <p className="text-muted-foreground">No orders yet</p>
                      <Button asChild className="bg-bibiere-burgundy hover:bg-bibiere-burgundy/90 text-white">
                        <Link href="/collections">Start Shopping</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-border rounded-xl p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold font-mono text-sm">{order.id.slice(0, 8).toUpperCase()}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString("en-US", {
                                  year: "numeric", month: "long", day: "numeric",
                                })}
                              </p>
                            </div>
                            <div className="text-right space-y-1">
                              <Badge className={statusColors[order.status] ?? "bg-gray-100 text-gray-600"}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                              <p className="text-sm font-semibold">${Number(order.totalAmount).toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="wishlist">
                  {wishlist.length === 0 ? (
                    <div className="text-center py-12 space-y-4">
                      <Heart className="w-16 h-16 mx-auto text-muted-foreground" />
                      <p className="text-muted-foreground">Your wishlist is empty</p>
                      <Button asChild className="bg-bibiere-burgundy hover:bg-bibiere-burgundy/90 text-white">
                        <Link href="/collections">Browse Collections</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h2 className="text-xl font-serif font-semibold">Saved Items ({wishlist.length})</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {wishlist.map((item) => (
                          <div key={item.id} className="border border-border rounded-xl p-4 flex gap-4">
                            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-muted" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{item.name}</p>
                              <p className="text-bibiere-burgundy font-semibold">${Number(item.price).toFixed(2)}</p>
                              <Link href="/wishlist" className="text-sm text-muted-foreground hover:text-bibiere-burgundy transition-colors">
                                View all →
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                  <h2 className="text-xl font-serif font-semibold">Account Settings</h2>
                  <div className="space-y-4 max-w-md">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Name</label>
                      <input
                        className="w-full border border-border rounded-lg px-3 py-2 bg-background text-sm"
                        defaultValue={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()}
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <input
                        className="w-full border border-border rounded-lg px-3 py-2 bg-background text-sm"
                        defaultValue={user?.primaryEmailAddress?.emailAddress ?? ""}
                        readOnly
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">To update your profile details, please use the account management portal.</p>
                  </div>
                  <div className="border-t border-border pt-6">
                    <Button
                      variant="outline"
                      className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/5"
                      onClick={() => signOut()}
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </Show>
    </>
  );
}
