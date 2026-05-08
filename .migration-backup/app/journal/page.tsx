import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Journal - bibiere",
  description: "Explore fashion insights, styling tips, and stories from the world of bibiere.",
}

export default function JournalPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold mb-4">Journal</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore fashion insights, styling tips, and stories from the world of bibiere. 
            Discover the inspiration behind our collections and the craftsmanship that defines our brand.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-12">
          {/* Featured Article */}
          <article className="border-b border-border pb-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Featured Article Image</p>
              </div>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">Featured Article</div>
                <h2 className="text-2xl font-serif font-bold">The Art of Timeless Elegance</h2>
                <p className="text-muted-foreground">
                  Discover the philosophy behind bibiere's approach to luxury fashion. 
                  We explore how timeless design principles create pieces that transcend trends.
                </p>
                <div className="text-sm text-muted-foreground">December 15, 2024</div>
              </div>
            </div>
          </article>

          {/* Article Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            <article className="space-y-4">
              <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Article Image</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-serif font-semibold">Sustainable Luxury</h3>
                <p className="text-sm text-muted-foreground">
                  Our commitment to ethical fashion and sustainable practices in luxury design.
                </p>
                <div className="text-xs text-muted-foreground">December 10, 2024</div>
              </div>
            </article>

            <article className="space-y-4">
              <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Article Image</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-serif font-semibold">Styling Guide: Evening Wear</h3>
                <p className="text-sm text-muted-foreground">
                  Expert tips on styling our evening collection for different occasions.
                </p>
                <div className="text-xs text-muted-foreground">December 5, 2024</div>
              </div>
            </article>

            <article className="space-y-4">
              <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Article Image</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-serif font-semibold">Behind the Seams</h3>
                <p className="text-sm text-muted-foreground">
                  Meet the artisans and craftspeople who bring bibiere designs to life.
                </p>
                <div className="text-xs text-muted-foreground">November 28, 2024</div>
              </div>
            </article>

            <article className="space-y-4">
              <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Article Image</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-serif font-semibold">Care & Preservation</h3>
                <p className="text-sm text-muted-foreground">
                  How to care for your luxury pieces to ensure they last for years to come.
                </p>
                <div className="text-xs text-muted-foreground">November 20, 2024</div>
              </div>
            </article>
          </div>
        </div>
      </main>
    </div>
  )
}