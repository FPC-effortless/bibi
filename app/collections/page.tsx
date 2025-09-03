import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Collections - bibiere",
  description: "Explore bibiere's curated collections of luxury fashion pieces, from elegant dresses to sophisticated essentials.",
}

export default function CollectionsPage() {
  const collections = [
    {
      name: "New Arrivals",
      href: "/collections/new-arrivals",
      description: "Discover our latest collection of carefully curated luxury pieces",
      image: "New Arrivals Collection"
    },
    {
      name: "Dresses",
      href: "/collections/dresses",
      description: "From elegant evening gowns to sophisticated day dresses",
      image: "Dresses Collection"
    },
    {
      name: "Evening Wear",
      href: "/collections/evening",
      description: "Luxurious pieces for special occasions and formal events",
      image: "Evening Wear Collection"
    },
    {
      name: "Essentials",
      href: "/collections/essentials",
      description: "Timeless wardrobe staples crafted with exceptional quality",
      image: "Essentials Collection"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-16 lg:py-24">
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">Collections</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Explore our curated collections of luxury fashion pieces, each designed with 
            timeless elegance and exceptional craftsmanship in mind.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {collections.map((collection) => (
            <Link
              key={collection.href}
              href={collection.href}
              className="group block"
            >
              <div className="space-y-4">
                <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center group-hover:bg-muted/80 transition-colors duration-300">
                  <p className="text-muted-foreground">{collection.image}</p>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-serif font-semibold group-hover:text-bibiere-burgundy transition-colors duration-300">
                    {collection.name}
                  </h2>
                  <p className="text-muted-foreground">
                    {collection.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}