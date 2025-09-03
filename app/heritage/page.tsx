import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Heritage - Our Story | bibiere",
  description: "Discover the rich heritage and craftsmanship tradition behind bibiere luxury fashion. From our founding to our commitment to timeless elegance.",
}

export default function HeritagePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-serif font-bold">Our Heritage</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A legacy of craftsmanship, elegance, and timeless design that spans generations of artisans and visionaries.
            </p>
          </div>

          {/* Timeline Section */}
          <div className="space-y-12">
            <h2 className="text-3xl font-serif font-bold text-center">Our Journey</h2>
            
            <div className="space-y-12">
              {/* 1920s */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-bibiere-burgundy font-semibold">1920s</span>
                    <h3 className="text-2xl font-serif font-bold">The Beginning</h3>
                  </div>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Founded in the heart of Paris by master tailor Henri Bibiere, our atelier began as a small 
                      workshop dedicated to creating exquisite garments for the city's most discerning clientele.
                    </p>
                    <p>
                      Henri's vision was simple yet revolutionary: to create clothing that transcended fashion 
                      trends, focusing instead on impeccable craftsmanship and timeless elegance.
                    </p>
                  </div>
                </div>
                <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Historic Atelier Image</p>
                </div>
              </div>

              {/* 1950s */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center md:order-1">
                  <p className="text-muted-foreground">Golden Age Image</p>
                </div>
                <div className="space-y-6 md:order-2">
                  <div className="space-y-2">
                    <span className="text-bibiere-burgundy font-semibold">1950s</span>
                    <h3 className="text-2xl font-serif font-bold">The Golden Age</h3>
                  </div>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Under the guidance of Henri's daughter, Marie Bibiere, the brand expanded internationally, 
                      becoming synonymous with Parisian sophistication and luxury.
                    </p>
                    <p>
                      This era saw the introduction of our signature silhouettes and the establishment of our 
                      core design philosophy that continues to guide us today.
                    </p>
                  </div>
                </div>
              </div>

              {/* 1980s */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-bibiere-burgundy font-semibold">1980s</span>
                    <h3 className="text-2xl font-serif font-bold">Innovation & Tradition</h3>
                  </div>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      The third generation brought fresh perspectives while honoring traditional techniques. 
                      We began incorporating innovative fabrics and sustainable practices into our production.
                    </p>
                    <p>
                      This period marked our commitment to ethical fashion, establishing partnerships with 
                      certified suppliers and implementing environmentally conscious practices.
                    </p>
                  </div>
                </div>
                <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Innovation Era Image</p>
                </div>
              </div>

              {/* Present */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center md:order-1">
                  <p className="text-muted-foreground">Modern Atelier Image</p>
                </div>
                <div className="space-y-6 md:order-2">
                  <div className="space-y-2">
                    <span className="text-bibiere-burgundy font-semibold">Today</span>
                    <h3 className="text-2xl font-serif font-bold">Modern Legacy</h3>
                  </div>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Today, bibiere continues to honor its heritage while embracing the future. We combine 
                      time-honored craftsmanship with modern innovation to create pieces that are both 
                      timeless and contemporary.
                    </p>
                    <p>
                      Our commitment to excellence, sustainability, and ethical practices remains unwavering 
                      as we write the next chapter of our story.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Craftsmanship Section */}
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-serif font-bold">Master Craftsmanship</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Every bibiere piece is a testament to the skill and dedication of our master artisans
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-bibiere-burgundy/10 rounded-full flex items-center justify-center mx-auto">
                  <div className="w-10 h-10 bg-bibiere-burgundy rounded-full"></div>
                </div>
                <h3 className="text-xl font-serif font-semibold">Hand-Finished Details</h3>
                <p className="text-muted-foreground text-sm">
                  Every seam, button, and finishing touch is completed by hand using techniques 
                  passed down through generations of master tailors.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-bibiere-gold/10 rounded-full flex items-center justify-center mx-auto">
                  <div className="w-10 h-10 bg-bibiere-gold rounded-full"></div>
                </div>
                <h3 className="text-xl font-serif font-semibold">Premium Materials</h3>
                <p className="text-muted-foreground text-sm">
                  We source only the finest fabrics from renowned mills in Italy, France, and Scotland, 
                  ensuring exceptional quality and longevity.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <div className="w-10 h-10 bg-foreground rounded-full"></div>
                </div>
                <h3 className="text-xl font-serif font-semibold">Timeless Design</h3>
                <p className="text-muted-foreground text-sm">
                  Our designs transcend seasonal trends, focusing on silhouettes and details that 
                  remain elegant and relevant for years to come.
                </p>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="bg-muted/30 rounded-lg p-8 space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-serif font-bold">Our Values</h2>
              <p className="text-muted-foreground">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-serif font-semibold">Excellence</h3>
                <p className="text-muted-foreground">
                  We never compromise on quality. Every piece must meet our exacting standards 
                  before it bears the bibiere name.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-serif font-semibold">Sustainability</h3>
                <p className="text-muted-foreground">
                  We believe luxury should not come at the expense of our planet. Our commitment 
                  to sustainable practices is woven into every aspect of our business.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-serif font-semibold">Authenticity</h3>
                <p className="text-muted-foreground">
                  We stay true to our heritage while embracing innovation, creating pieces that 
                  are genuinely bibiere in every detail.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-serif font-semibold">Integrity</h3>
                <p className="text-muted-foreground">
                  We conduct business with honesty and transparency, treating our customers, 
                  partners, and artisans with respect and fairness.
                </p>
              </div>
            </div>
          </div>

          {/* Artisan Spotlight */}
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-serif font-bold">Meet Our Artisans</h2>
              <p className="text-muted-foreground">
                The skilled hands behind every bibiere creation
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Master Tailor Portrait</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-serif font-semibold">Master Tailor Giuseppe</h3>
                  <p className="text-muted-foreground text-sm">
                    With over 30 years of experience, Giuseppe leads our Italian atelier, 
                    specializing in the intricate construction of our evening wear collection.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Pattern Maker Portrait</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-serif font-semibold">Pattern Maker Claire</h3>
                  <p className="text-muted-foreground text-sm">
                    Claire's expertise in pattern making ensures perfect fit and drape in every 
                    garment, translating design vision into wearable art.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Legacy Statement */}
          <div className="text-center space-y-6 py-12 border-t border-border">
            <h2 className="text-3xl font-serif font-bold">Continuing the Legacy</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              As we look to the future, we remain committed to the values and craftsmanship that have 
              defined bibiere for generations. Each piece we create is not just clothing, but a 
              continuation of our story—one that you become part of when you choose bibiere.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
