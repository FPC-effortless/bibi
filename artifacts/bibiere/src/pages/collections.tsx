import { Link } from "wouter";
import { useCommerce } from "@/components/commerce-provider";

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export default function CollectionsPage() {
  const { products, loading } = useCommerce();
  const collections = Array.from(
    products.reduce((map, product) => {
      const slug = slugify(product.category);
      const existing = map.get(slug);
      map.set(slug, {
        slug,
        name: product.category,
        count: (existing?.count ?? 0) + 1,
        image: existing?.image ?? product.primaryImage,
        description: existing?.description ?? `Explore ${product.category.toLowerCase()} selected from the live catalog.`,
      });
      return map;
    }, new Map<string, { slug: string; name: string; count: number; image: string; description: string }>()),
  ).map(([, collection]) => collection);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-16 lg:py-24">
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">Collections</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Browse the collections currently active in the store catalog.
          </p>
        </section>

        {loading ? (
          <p className="text-center text-muted-foreground">Loading collections...</p>
        ) : collections.length === 0 ? (
          <p className="text-center text-muted-foreground">No active collections yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {collections.map((collection) => (
              <Link key={collection.slug} href={`/collections/${collection.slug}`} className="group block">
                <div className="space-y-4">
                  <div className="aspect-[4/3] bg-muted rounded-xl overflow-hidden">
                    <img src={collection.image || "/placeholder.svg"} alt={collection.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-serif font-semibold group-hover:text-bibiere-burgundy transition-colors duration-300">
                      {collection.name}
                    </h2>
                    <p className="text-muted-foreground">{collection.description}</p>
                    <p className="text-sm text-bibiere-burgundy">{collection.count} active item{collection.count === 1 ? "" : "s"}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
