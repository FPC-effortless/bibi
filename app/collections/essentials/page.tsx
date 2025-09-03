import { ProductGrid } from "@/components/product-grid"

export default function EssentialsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold mb-4">Essentials</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Timeless wardrobe staples crafted with exceptional quality. These versatile pieces form 
            the foundation of a sophisticated wardrobe that transcends seasons and trends.
          </p>
        </div>

        <ProductGrid 
          title="Essential Pieces"
          subtitle="Timeless staples for the sophisticated wardrobe"
          showFeaturedOnly={false}
        />
      </main>
    </div>
  )
}