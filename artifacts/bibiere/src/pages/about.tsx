export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-16 lg:py-24">
        <section className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">About bibiere</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Timeless luxury redefined. We craft exquisite pieces for the discerning individual who appreciates sophisticated design and exceptional quality.
          </p>
        </section>

        <div className="max-w-6xl mx-auto space-y-20">
          <section className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-serif font-bold">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded on the belief that true luxury lies in timeless design and exceptional craftsmanship, bibiere emerged from a passion for creating pieces that transcend fleeting trends.
                </p>
                <p>
                  Our journey began with a simple vision: to offer discerning individuals clothing that embodies sophistication, quality, and enduring style. Each piece in our collection is carefully curated and crafted to become a cherished part of your wardrobe.
                </p>
              </div>
            </div>
            <div className="aspect-[4/3] bg-muted rounded-xl flex items-center justify-center">
              <p className="text-muted-foreground">Brand Story Image</p>
            </div>
          </section>

          <section className="space-y-12">
            <h2 className="text-3xl font-serif font-bold text-center">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-bibiere-burgundy/10 rounded-full flex items-center justify-center mx-auto">
                  <div className="w-8 h-8 bg-bibiere-burgundy rounded-full" />
                </div>
                <h3 className="text-xl font-serif font-semibold">Timeless Design</h3>
                <p className="text-muted-foreground">
                  We create pieces that transcend seasons and trends, focusing on enduring elegance that remains relevant year after year.
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-bibiere-gold/10 rounded-full flex items-center justify-center mx-auto">
                  <div className="w-8 h-8 bg-bibiere-gold rounded-full" />
                </div>
                <h3 className="text-xl font-serif font-semibold">Exceptional Quality</h3>
                <p className="text-muted-foreground">
                  Every piece is crafted with meticulous attention to detail, using only the finest materials and time-honored techniques.
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <div className="w-8 h-8 bg-foreground rounded-full" />
                </div>
                <h3 className="text-xl font-serif font-semibold">Sustainable Luxury</h3>
                <p className="text-muted-foreground">
                  We are committed to responsible practices, ensuring our luxury comes with a conscience and respect for our environment.
                </p>
              </div>
            </div>
          </section>

          <section className="grid md:grid-cols-2 gap-12 items-center">
            <div className="aspect-[4/3] bg-muted rounded-xl flex items-center justify-center">
              <p className="text-muted-foreground">Craftsmanship Image</p>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-serif font-bold">Craftsmanship</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Our commitment to excellence is evident in every stitch, every seam, and every detail. We work with skilled artisans who share our passion for perfection.
                </p>
                <p>
                  From the selection of premium fabrics to the final finishing touches, each piece undergoes rigorous quality control to ensure it meets our exacting standards.
                </p>
              </div>
            </div>
          </section>

          <section className="text-center space-y-8 py-20 border-t border-border">
            <h2 className="text-3xl font-serif font-bold">Our Mission</h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              To create luxury fashion that empowers individuals to express their unique style while honoring the timeless principles of elegance, quality, and sophistication.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
