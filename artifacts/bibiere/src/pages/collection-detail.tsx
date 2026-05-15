import { useMemo } from "react";
import { useParams, Link } from "wouter";
import ProductGrid from "@/components/product-grid";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useCommerce } from "@/components/commerce-provider";

function titleize(slug: string) {
  return slug.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export default function CollectionDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";
  const { products } = useCommerce();
  const matchingProducts = useMemo(
    () => slug === "new-arrivals"
      ? products.slice(0, 12)
      : products.filter((product) => slugify(product.category) === slug),
    [products, slug],
  );
  const title = slug === "new-arrivals" ? "New Arrivals" : matchingProducts[0]?.category ?? titleize(slug);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/collections">
              <ArrowLeft className="w-4 h-4 mr-2" />
              All Collections
            </Link>
          </Button>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{title}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            {matchingProducts.length} active item{matchingProducts.length === 1 ? "" : "s"} currently available in this collection.
          </p>
        </div>
        <ProductGrid showFeaturedOnly={false} categorySlug={slug} />
      </main>
    </div>
  );
}
