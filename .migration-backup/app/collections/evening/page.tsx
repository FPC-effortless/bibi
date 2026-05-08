import { ProductGrid } from "@/components/product-grid"

export default function EveningWearPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold mb-4">Evening Wear</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Luxurious pieces for special occasions and formal events. Each piece is crafted to make 
            you feel confident and elegant for life's most memorable moments.
          </p>
        </div>

        <ProductGrid 
          title="Evening Collection"
          subtitle="Sophisticated pieces for your most special occasions"
          showFeaturedOnly={false}
        />
      </main>
    </div>
  )
}