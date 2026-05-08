import { useState } from "react";
import HeroSection from "@/components/hero-section";
import ProductGrid from "@/components/product-grid";
import SizeGuideModal from "@/components/size-guide-modal";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  return (
    <main id="main-content" className="min-h-screen bg-background">
      <HeroSection />

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Featured Collection</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Discover bibiere's carefully curated selection of timeless elegance
            </p>
            <Button onClick={() => setIsSizeGuideOpen(true)} variant="outline" className="mb-8">
              Size Guide
            </Button>
          </div>
          <ProductGrid showFeaturedOnly={true} maxItems={8} />
        </div>
      </section>

      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </main>
  );
}
