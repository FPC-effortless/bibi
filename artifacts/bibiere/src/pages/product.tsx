import { useMemo } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "convex/react";
import { api } from "../../../../lib/convex/convex/_generated/api";
import ProductImageGallery from "@/components/product-image-gallery";
import ProductDetails from "@/components/product-details";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { hasConvexConfig } from "@/lib/runtime-config";

function splitList(value?: string) {
  return value?.split("\n").map((item) => item.trim()).filter(Boolean) ?? [];
}

function toDetailProduct(product: any) {
  const gallery = [
    product.primaryImage,
    product.hoverImage,
    ...(product.images ?? []),
  ].filter(Boolean);

  return {
    id: product.id,
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    description: product.description ?? `${product.name} from ${product.brand}.`,
    sizes: product.sizes?.length ? product.sizes : ["One Size"],
    colors: product.colors?.length ? product.colors : [{ name: "Default", value: "#1f2937" }],
    materials: splitList(product.details),
    careInstructions: splitList(product.careInstructions),
    features: product.featured ? ["Featured in the current collection"] : [],
    inStock: product.inStock,
    stockCount: product.inventoryCount,
    images: gallery.length > 0
      ? gallery.map((src, index) => ({ id: `${product.id}-${index}`, src, alt: `${product.name} image ${index + 1}` }))
      : [{ id: `${product.id}-placeholder`, src: "/placeholder.svg", alt: product.name }],
  };
}

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const productId = params.id || "";

  if (!hasConvexConfig) {
    return <ProductPageView product={null} loading={false} />;
  }

  return <BackendProductPage productId={productId} />;
}

function BackendProductPage({ productId }: { productId: string }) {
  const backendProduct = useQuery(api.products.get, productId ? { id: productId } : "skip");
  const product = useMemo(
    () => backendProduct ? toDetailProduct(backendProduct) : null,
    [backendProduct],
  );

  return <ProductPageView product={product} loading={backendProduct === undefined} />;
}

function ProductPageView({ product, loading }: { product: ReturnType<typeof toDetailProduct> | null; loading: boolean }) {
  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">Loading product...</div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <Button variant="ghost" asChild className="mb-8">
            <Link href="/collections">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Collections
            </Link>
          </Button>
          <h1 className="font-serif text-3xl font-semibold">Product not found</h1>
          <p className="mt-3 text-muted-foreground">This item may be archived, drafted, or unavailable.</p>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <Button variant="ghost" asChild className="mb-8">
          <Link href="/collections">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Collections
          </Link>
        </Button>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <ProductImageGallery images={product.images} productName={product.name} />
          <ProductDetails product={product} />
        </div>
      </div>
    </main>
  );
}
