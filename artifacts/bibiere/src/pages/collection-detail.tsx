import { useParams, Link } from "wouter";
import ProductGrid from "@/components/product-grid";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const collectionMeta: Record<string, { title: string; description: string }> = {
  "new-arrivals": {
    title: "New Arrivals",
    description: "The latest additions to our curated luxury collection.",
  },
  dresses: {
    title: "Dresses",
    description: "From elegant evening gowns to sophisticated day dresses.",
  },
  evening: {
    title: "Evening Wear",
    description: "Luxurious pieces for special occasions and formal events.",
  },
  essentials: {
    title: "Essentials",
    description: "Timeless wardrobe staples crafted with exceptional quality.",
  },
  outerwear: {
    title: "Outerwear",
    description: "Coats, blazers and jackets crafted from the finest materials.",
  },
  accessories: {
    title: "Accessories",
    description: "Scarves, bags and jewellery to complete the perfect look.",
  },
};

export default function CollectionDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";
  const meta = collectionMeta[slug] ?? {
    title: slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    description: "Explore this curated collection.",
  };

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
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{meta.title}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">{meta.description}</p>
        </div>
        <ProductGrid showFeaturedOnly={false} />
      </main>
    </div>
  );
}
