import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/react";
import { api } from "../../../../lib/convex/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { hasConvexConfig } from "@/lib/runtime-config";
import { toast } from "sonner";
import { formatStoreCurrency } from "@/lib/currency-manager";

type ProductStatus = "draft" | "active" | "archived";
type OrderStatus = "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";

type ProductForm = {
  id: string;
  slug: string;
  status: ProductStatus;
  name: string;
  price: string;
  originalPrice: string;
  primaryImage: string;
  hoverImage: string;
  images: string;
  category: string;
  featured: boolean;
  inStock: boolean;
  inventoryCount: string;
  sortOrder: string;
  brand: string;
  description: string;
  details: string;
  careInstructions: string;
  sizes: string;
  colors: string;
};

type ContentPageStatus = "draft" | "active" | "archived";

type ContentPageForm = {
  slug: string;
  status: ContentPageStatus;
  eyebrow: string;
  title: string;
  intro: string;
  sections: string;
};

const emptyProductForm: ProductForm = {
  id: "",
  slug: "",
  status: "draft",
  name: "",
  price: "",
  originalPrice: "",
  primaryImage: "",
  hoverImage: "",
  images: "",
  category: "",
  featured: false,
  inStock: true,
  inventoryCount: "",
  sortOrder: "",
  brand: "bibiere",
  description: "",
  details: "",
  careInstructions: "",
  sizes: "",
  colors: "",
};

const productStatuses: ProductStatus[] = ["draft", "active", "archived"];
const pageStatuses: ContentPageStatus[] = ["draft", "active", "archived"];
const orderStatuses: OrderStatus[] = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"];
const customerPageSlugs = [
  "home",
  "faq",
  "contact",
  "returns",
  "track-order",
  "size-guide",
  "privacy",
  "terms",
  "heritage",
  "sustainability",
  "careers",
  "press",
];

function toOptionalNumber(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function splitImages(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseColors(value: string) {
  return splitLines(value).map((line) => {
    const [name = "", colorValue = ""] = line.split("|").map((part) => part.trim());
    return {
      name,
      value: colorValue || "#1f2937",
    };
  }).filter((color) => color.name);
}

function parseSections(value: string) {
  return splitLines(value).map((line) => {
    const [title = "", body = ""] = line.split("|").map((part) => part.trim());
    return { title, body };
  }).filter((section) => section.title && section.body);
}

function sectionsToText(sections: Array<{ title: string; body: string }> = []) {
  return sections.map((section) => `${section.title} | ${section.body}`).join("\n");
}

function emptyPageForm(slug = "returns"): ContentPageForm {
  return {
    slug,
    status: "draft",
    eyebrow: "",
    title: "",
    intro: "",
    sections: "",
  };
}

function pageToForm(page: any): ContentPageForm {
  return {
    slug: page.slug ?? "",
    status: page.status ?? "draft",
    eyebrow: page.eyebrow ?? "",
    title: page.title ?? "",
    intro: page.intro ?? "",
    sections: sectionsToText(page.sections ?? []),
  };
}

function productToForm(product: any): ProductForm {
  return {
    id: product.id ?? "",
    slug: product.slug ?? "",
    status: product.status ?? "active",
    name: product.name ?? "",
    price: String(product.price ?? ""),
    originalPrice: product.originalPrice ? String(product.originalPrice) : "",
    primaryImage: product.primaryImage ?? "",
    hoverImage: product.hoverImage ?? "",
    images: (product.images ?? []).join("\n"),
    category: product.category ?? "",
    featured: Boolean(product.featured),
    inStock: Boolean(product.inStock),
    inventoryCount: product.inventoryCount === undefined ? "" : String(product.inventoryCount),
    sortOrder: product.sortOrder === undefined ? "" : String(product.sortOrder),
    brand: product.brand ?? "bibiere",
    description: product.description ?? "",
    details: product.details ?? "",
    careInstructions: product.careInstructions ?? "",
    sizes: (product.sizes ?? []).join("\n"),
    colors: (product.colors ?? []).map((color: any) => `${color.name} | ${color.value}`).join("\n"),
  };
}

function formToArgs(form: ProductForm) {
  return {
    id: form.id.trim() || undefined,
    slug: form.slug.trim() || undefined,
    status: form.status,
    name: form.name.trim(),
    price: Number(form.price),
    originalPrice: toOptionalNumber(form.originalPrice),
    primaryImage: form.primaryImage.trim(),
    hoverImage: form.hoverImage.trim() || undefined,
    images: splitImages(form.images),
    category: form.category.trim(),
    featured: form.featured,
    inStock: form.inStock,
    inventoryCount: toOptionalNumber(form.inventoryCount),
    sortOrder: toOptionalNumber(form.sortOrder),
    brand: form.brand.trim() || "bibiere",
    description: form.description.trim() || undefined,
    details: form.details.trim() || undefined,
    careInstructions: form.careInstructions.trim() || undefined,
    sizes: splitLines(form.sizes),
    colors: parseColors(form.colors),
  };
}

export default function AdminPage() {
  if (!hasConvexConfig) {
    return (
      <main className="min-h-screen bg-background px-4 py-12">
        <div className="container mx-auto max-w-3xl rounded-lg border border-border p-6">
          <h1 className="font-serif text-3xl font-semibold">Admin backend unavailable</h1>
          <p className="mt-3 text-muted-foreground">
            Set VITE_CONVEX_URL and redeploy before using admin tools.
          </p>
        </div>
      </main>
    );
  }

  return <AdminContent />;
}

function AdminContent() {
  const { isSignedIn, isLoaded } = useUser();
  const isAdmin = useQuery(api.users.isAdmin);

  if (!isLoaded || isAdmin === undefined) {
    return <AdminShell title="Loading admin..." />;
  }

  if (!isSignedIn) {
    return (
      <AdminShell title="Sign in required">
        <p className="text-muted-foreground">Use the account menu to sign in with an admin email.</p>
      </AdminShell>
    );
  }

  if (!isAdmin) {
    return (
      <AdminShell title="Admin access required">
        <p className="text-muted-foreground">Your signed-in email is not listed in ADMIN_EMAILS.</p>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Store Admin">
      <Tabs defaultValue="products" className="gap-6">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <ProductsAdmin />
        </TabsContent>
        <TabsContent value="orders">
          <OrdersAdmin />
        </TabsContent>
        <TabsContent value="pages">
          <ContentPagesAdmin />
        </TabsContent>
      </Tabs>
    </AdminShell>
  );
}

function AdminShell({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-bibiere-burgundy">
            bibiere operations
          </p>
          <h1 className="mt-2 font-serif text-4xl font-semibold">{title}</h1>
        </div>
        {children}
      </div>
    </main>
  );
}

function ProductsAdmin() {
  const products = useQuery(api.products.adminList) ?? [];
  const createProduct = useMutation(api.products.adminCreate);
  const updateProduct = useMutation(api.products.adminUpdate);
  const archiveProduct = useMutation(api.products.adminArchive);
  const setStatus = useMutation(api.products.adminSetStatus);
  const setFeatured = useMutation(api.products.adminSetFeatured);
  const setInventory = useMutation(api.products.adminSetInventory);
  const archiveSeedProducts = useMutation(api.products.adminArchiveSeedProducts);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const selectedProduct = products.find((product: any) => product._id === selectedProductId);
  const [form, setForm] = useState<ProductForm>(emptyProductForm);

  useEffect(() => {
    setForm(selectedProduct ? productToForm(selectedProduct) : emptyProductForm);
  }, [selectedProduct]);

  const sortedProducts = useMemo(
    () => [...products].sort((a: any, b: any) => (a.sortOrder ?? 9999) - (b.sortOrder ?? 9999)),
    [products],
  );

  const updateField = <K extends keyof ProductForm>(key: K, value: ProductForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submitProduct = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.primaryImage.trim() || !form.category.trim()) {
      toast.error("Name, image, and category are required");
      return;
    }
    if (!Number.isFinite(Number(form.price))) {
      toast.error("Price must be a valid number");
      return;
    }

    const payload = formToArgs(form);
    if (selectedProduct) {
      await updateProduct({ productId: selectedProduct._id, ...payload });
      toast.success("Product updated");
    } else {
      await createProduct(payload);
      toast.success("Product created");
    }
    setSelectedProductId(null);
    setForm(emptyProductForm);
  };

  const archiveDemos = async () => {
    const result = await archiveSeedProducts();
    toast.success(`Archived ${result.archived} demo product${result.archived === 1 ? "" : "s"}`);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
      <section className="rounded-lg border border-border bg-card p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-serif text-2xl font-semibold">Catalog</h2>
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" onClick={archiveDemos}>Archive demo products</Button>
            <Button variant="outline" onClick={() => setSelectedProductId(null)}>New product</Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedProducts.map((product: any) => (
              <TableRow key={product._id}>
                <TableCell>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-xs text-muted-foreground">{product.category} · {formatStoreCurrency(product.price)}</div>
                </TableCell>
                <TableCell>
                  <Select
                    value={product.status ?? "active"}
                    onValueChange={(value) => setStatus({ productId: product._id, status: value as ProductStatus })}
                  >
                    <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {productStatuses.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Input
                    className="w-24"
                    type="number"
                    defaultValue={product.inventoryCount ?? ""}
                    onBlur={(event) => setInventory({
                      productId: product._id,
                      inventoryCount: Number(event.currentTarget.value || 0),
                    })}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant={product.featured ? "default" : "outline"}
                    onClick={() => setFeatured({ productId: product._id, featured: !product.featured })}
                  >
                    {product.featured ? "Featured" : "Set"}
                  </Button>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => setSelectedProductId(product._id)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => archiveProduct({ productId: product._id })}>Archive</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <section className="rounded-lg border border-border bg-card p-4">
        <h2 className="mb-4 font-serif text-2xl font-semibold">
          {selectedProduct ? "Edit product" : "Create product"}
        </h2>
        <form className="space-y-4" onSubmit={submitProduct}>
          <Input placeholder="Name" value={form.name} onChange={(e) => updateField("name", e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="ID" value={form.id} onChange={(e) => updateField("id", e.target.value)} />
            <Input placeholder="Slug" value={form.slug} onChange={(e) => updateField("slug", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Price" type="number" value={form.price} onChange={(e) => updateField("price", e.target.value)} />
            <Input placeholder="Original price" type="number" value={form.originalPrice} onChange={(e) => updateField("originalPrice", e.target.value)} />
          </div>
          <Input placeholder="Primary image URL/path" value={form.primaryImage} onChange={(e) => updateField("primaryImage", e.target.value)} />
          <Input placeholder="Hover image URL/path" value={form.hoverImage} onChange={(e) => updateField("hoverImage", e.target.value)} />
          <Textarea placeholder="Gallery images, one URL/path per line" value={form.images} onChange={(e) => updateField("images", e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Category" value={form.category} onChange={(e) => updateField("category", e.target.value)} />
            <Input placeholder="Brand" value={form.brand} onChange={(e) => updateField("brand", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Production capacity" type="number" value={form.inventoryCount} onChange={(e) => updateField("inventoryCount", e.target.value)} />
            <Input placeholder="Sort order" type="number" value={form.sortOrder} onChange={(e) => updateField("sortOrder", e.target.value)} />
          </div>
          <Select value={form.status} onValueChange={(value) => updateField("status", value as ProductStatus)}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              {productStatuses.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.featured} onChange={(e) => updateField("featured", e.target.checked)} />
              Featured
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.inStock} onChange={(e) => updateField("inStock", e.target.checked)} />
              Accepting orders
            </label>
          </div>
          <Textarea placeholder="Description" value={form.description} onChange={(e) => updateField("description", e.target.value)} />
          <Textarea placeholder="Details" value={form.details} onChange={(e) => updateField("details", e.target.value)} />
          <Textarea placeholder="Care instructions" value={form.careInstructions} onChange={(e) => updateField("careInstructions", e.target.value)} />
          <Textarea placeholder="Sizes, one per line" value={form.sizes} onChange={(e) => updateField("sizes", e.target.value)} />
          <Textarea placeholder="Colors, one per line: Name | #hex" value={form.colors} onChange={(e) => updateField("colors", e.target.value)} />
          <div className="flex gap-2">
            <Button type="submit">{selectedProduct ? "Save changes" : "Create product"}</Button>
            {selectedProduct && <Button type="button" variant="outline" onClick={() => setSelectedProductId(null)}>Cancel</Button>}
          </div>
        </form>
      </section>
    </div>
  );
}

function ContentPagesAdmin() {
  const pages = useQuery(api.contentPages.adminList) ?? [];
  const upsertPage = useMutation(api.contentPages.adminUpsert);
  const availableSlugs = useMemo(
    () => Array.from(new Set([...customerPageSlugs, ...pages.map((page: any) => page.slug)])).sort(),
    [pages],
  );
  const [selectedSlug, setSelectedSlug] = useState(customerPageSlugs[0]);
  const selectedPage = pages.find((page: any) => page.slug === selectedSlug);
  const [form, setForm] = useState<ContentPageForm>(emptyPageForm(customerPageSlugs[0]));

  useEffect(() => {
    setForm(selectedPage ? pageToForm(selectedPage) : emptyPageForm(selectedSlug));
  }, [selectedPage, selectedSlug]);

  const updateField = <K extends keyof ContentPageForm>(key: K, value: ContentPageForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submitPage = async (event: FormEvent) => {
    event.preventDefault();
    const sections = parseSections(form.sections);
    if (!form.slug.trim() || !form.title.trim() || !form.eyebrow.trim() || !form.intro.trim()) {
      toast.error("Slug, eyebrow, title, and intro are required");
      return;
    }
    if (sections.length === 0) {
      toast.error("Add at least one section using: Title | Body");
      return;
    }

    await upsertPage({
      slug: form.slug.trim().toLowerCase(),
      status: form.status,
      eyebrow: form.eyebrow.trim(),
      title: form.title.trim(),
      intro: form.intro.trim(),
      sections,
    });
    toast.success("Page content saved");
    setSelectedSlug(form.slug.trim().toLowerCase());
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
      <section className="rounded-lg border border-border bg-card p-4">
        <h2 className="mb-4 font-serif text-2xl font-semibold">Customer pages</h2>
        <div className="space-y-2">
          {availableSlugs.map((slug) => {
            const page = pages.find((item: any) => item.slug === slug);
            return (
              <button
                key={slug}
                type="button"
                onClick={() => setSelectedSlug(slug)}
                className={`w-full rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                  selectedSlug === slug
                    ? "border-bibiere-burgundy bg-bibiere-burgundy/10 text-bibiere-burgundy"
                    : "border-border hover:bg-muted"
                }`}
              >
                <span className="font-medium">/{slug}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {page ? page.status : "not created"}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card p-4">
        <h2 className="mb-4 font-serif text-2xl font-semibold">Edit page content</h2>
        <form className="space-y-4" onSubmit={submitPage}>
          <div className="grid gap-3 md:grid-cols-[1fr_180px]">
            <Input placeholder="Slug" value={form.slug} onChange={(e) => updateField("slug", e.target.value)} />
            <Select value={form.status} onValueChange={(value) => updateField("status", value as ContentPageStatus)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {pageStatuses.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Input placeholder="Eyebrow" value={form.eyebrow} onChange={(e) => updateField("eyebrow", e.target.value)} />
          <Input placeholder="Title" value={form.title} onChange={(e) => updateField("title", e.target.value)} />
          <Textarea placeholder="Intro" value={form.intro} onChange={(e) => updateField("intro", e.target.value)} />
          <Textarea
            className="min-h-40"
            placeholder="Sections, one per line: Section title | Section body"
            value={form.sections}
            onChange={(e) => updateField("sections", e.target.value)}
          />
          <Button type="submit">Save page</Button>
        </form>
      </section>
    </div>
  );
}

function OrdersAdmin() {
  const orders = useQuery(api.payments.adminList) ?? [];
  const updateStatus = useMutation(api.payments.adminUpdateStatus);
  const [selectedOrderId, setSelectedOrderId] = useState<any>(null);
  const selectedOrder = useQuery(
    api.payments.adminGet,
    selectedOrderId ? { orderId: selectedOrderId } : "skip",
  );
  const activeOrders = orders.filter((order: any) => !["shipped", "delivered", "cancelled"].includes(order.status));
  const paidOrders = orders.filter((order: any) => ["paid", "processing"].includes(order.status));
  const revenue = orders
    .filter((order: any) => order.status !== "cancelled")
    .reduce((sum: number, order: any) => sum + order.totalAmount, 0);

  return (
    <section className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Active orders</p>
          <p className="mt-1 font-serif text-3xl font-semibold">{activeOrders.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">In production queue</p>
          <p className="mt-1 font-serif text-3xl font-semibold">{paidOrders.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Order value</p>
          <p className="mt-1 font-serif text-3xl font-semibold">{formatStoreCurrency(revenue)}</p>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <h2 className="mb-4 font-serif text-2xl font-semibold">Orders</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment Ref</TableHead>
            <TableHead className="text-right">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order: any) => (
            <TableRow key={order._id}>
              <TableCell>
                <div className="font-mono text-xs">{order._id}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(order._creationTime).toLocaleString()}
                </div>
              </TableCell>
              <TableCell>
                <div>{order.customerName ?? `${order.customer?.firstName ?? ""} ${order.customer?.lastName ?? ""}`.trim() ?? "Unknown customer"}</div>
                <div className="text-xs text-muted-foreground">{order.customerEmail ?? order.customer?.email ?? "No email"}</div>
              </TableCell>
              <TableCell>{order.itemCount}</TableCell>
              <TableCell>{formatStoreCurrency(order.totalAmount)}</TableCell>
              <TableCell>
                <Select
                  value={order.status}
                  onValueChange={(value) => updateStatus({ orderId: order._id, status: value as OrderStatus })}
                >
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {orderStatuses.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="font-mono text-xs">{order.paystackReference ?? "none"}</TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="outline" onClick={() => setSelectedOrderId(order._id)}>
                  Review
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {orders.length === 0 && (
        <p className="py-10 text-center text-muted-foreground">No orders yet.</p>
      )}
      </div>

      {selectedOrderId && (
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-serif text-2xl font-semibold">Made-to-order brief</h3>
              <p className="font-mono text-xs text-muted-foreground">{selectedOrderId}</p>
            </div>
            <Button variant="outline" onClick={() => setSelectedOrderId(null)}>Close</Button>
          </div>

          {!selectedOrder ? (
            <p className="py-8 text-center text-muted-foreground">Loading order details...</p>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Items</h4>
                  <div className="mt-2 divide-y divide-border rounded-lg border border-border">
                    {selectedOrder.items.map((item: any) => (
                      <div key={item._id} className="flex items-center justify-between gap-4 p-3">
                        <div className="flex items-center gap-3">
                          {item.image && <img src={item.image} alt="" className="h-14 w-14 rounded-md object-cover" />}
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {[
                                `Qty ${item.quantity}`,
                                item.color,
                                item.size ? `Size ${item.size}` : "",
                              ].filter(Boolean).join(" · ")}
                            </p>
                          </div>
                        </div>
                        <p className="font-medium">{formatStoreCurrency(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-border p-4">
                    <h4 className="font-medium">Measurements</h4>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                      {selectedOrder.order.measurements || "No measurements provided."}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <h4 className="font-medium">Style notes</h4>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                      {selectedOrder.order.productionNotes || "No style notes provided."}
                    </p>
                  </div>
                </div>
              </div>

              <aside className="space-y-3 rounded-lg border border-border p-4">
                <h4 className="font-medium">Customer</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Name</p>
                    <p className="font-medium">{selectedOrder.order.customerName ?? selectedOrder.customer?.email ?? "Unknown"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedOrder.order.customerEmail ?? selectedOrder.customer?.email ?? "No email"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedOrder.order.phone ?? "No phone"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Delivery address</p>
                    <p className="font-medium">{selectedOrder.order.shippingAddress ?? "No address"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Needed by</p>
                    <p className="font-medium">{selectedOrder.order.eventDate || "No date provided"}</p>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
