import { Metadata } from "next"
import { Droplets, Wind, Sun, Shirt } from "lucide-react"

export const metadata: Metadata = {
  title: "Care Instructions - bibiere",
  description: "Learn how to properly care for your bibiere luxury fashion pieces to ensure they last for years to come.",
}

export default function CareInstructionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold mb-4">Care Instructions</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Proper care ensures your bibiere pieces maintain their beauty and quality for years to come. 
            Follow these guidelines to preserve the luxury and craftsmanship of your garments.
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-16">
          {/* General Care Principles */}
          <section className="space-y-8">
            <h2 className="text-3xl font-serif font-bold text-center">General Care Principles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-bibiere-burgundy/10 rounded-full flex items-center justify-center mx-auto">
                  <Droplets className="h-8 w-8 text-bibiere-burgundy" />
                </div>
                <h3 className="text-lg font-serif font-semibold">Gentle Cleaning</h3>
                <p className="text-sm text-muted-foreground">
                  Always follow care labels and use gentle, luxury-appropriate cleaning methods.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-bibiere-gold/10 rounded-full flex items-center justify-center mx-auto">
                  <Wind className="h-8 w-8 text-bibiere-gold" />
                </div>
                <h3 className="text-lg font-serif font-semibold">Proper Drying</h3>
                <p className="text-sm text-muted-foreground">
                  Air dry away from direct sunlight to preserve fabric integrity and color.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Sun className="h-8 w-8 text-foreground" />
                </div>
                <h3 className="text-lg font-serif font-semibold">UV Protection</h3>
                <p className="text-sm text-muted-foreground">
                  Store away from direct sunlight to prevent fading and fabric degradation.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-sidebar/10 rounded-full flex items-center justify-center mx-auto">
                  <Shirt className="h-8 w-8 text-sidebar-foreground" />
                </div>
                <h3 className="text-lg font-serif font-semibold">Proper Storage</h3>
                <p className="text-sm text-muted-foreground">
                  Use padded hangers and breathable garment bags for optimal preservation.
                </p>
              </div>
            </div>
          </section>

          {/* Fabric-Specific Care */}
          <section className="space-y-8">
            <h2 className="text-3xl font-serif font-bold text-center">Fabric-Specific Care</h2>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Silk Care */}
              <div className="border border-border rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-serif font-semibold">Silk</h3>
                <div className="space-y-3 text-muted-foreground">
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Cleaning</h4>
                    <p className="text-sm">Dry clean only or hand wash in cold water with silk-specific detergent</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Drying</h4>
                    <p className="text-sm">Lay flat on a clean towel, never wring or twist</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Ironing</h4>
                    <p className="text-sm">Use low heat with a pressing cloth, iron while slightly damp</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Storage</h4>
                    <p className="text-sm">Hang on padded hangers in a cool, dry place</p>
                  </div>
                </div>
              </div>

              {/* Wool Care */}
              <div className="border border-border rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-serif font-semibold">Wool & Cashmere</h3>
                <div className="space-y-3 text-muted-foreground">
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Cleaning</h4>
                    <p className="text-sm">Professional dry cleaning recommended for best results</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Drying</h4>
                    <p className="text-sm">Lay flat to dry, reshape while damp</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Ironing</h4>
                    <p className="text-sm">Steam gently or use low heat with a pressing cloth</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Storage</h4>
                    <p className="text-sm">Fold with tissue paper, store with cedar blocks</p>
                  </div>
                </div>
              </div>

              {/* Cotton Care */}
              <div className="border border-border rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-serif font-semibold">Cotton & Linen</h3>
                <div className="space-y-3 text-muted-foreground">
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Cleaning</h4>
                    <p className="text-sm">Machine wash in cold water with gentle detergent</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Drying</h4>
                    <p className="text-sm">Air dry or tumble dry on low heat</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Ironing</h4>
                    <p className="text-sm">Iron while slightly damp for best results</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Storage</h4>
                    <p className="text-sm">Hang or fold, ensure completely dry before storing</p>
                  </div>
                </div>
              </div>

              {/* Delicate Fabrics */}
              <div className="border border-border rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-serif font-semibold">Delicate Fabrics</h3>
                <div className="space-y-3 text-muted-foreground">
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Cleaning</h4>
                    <p className="text-sm">Professional cleaning recommended for embellished pieces</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Drying</h4>
                    <p className="text-sm">Always air dry, never use heat</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Ironing</h4>
                    <p className="text-sm">Use pressing cloth and lowest heat setting</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Storage</h4>
                    <p className="text-sm">Store flat or hang with extra support</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Stain Removal */}
          <section className="space-y-8 border-t border-border pt-16">
            <h2 className="text-3xl font-serif font-bold text-center">Stain Removal Guide</h2>
            <div className="max-w-4xl mx-auto">
              <div className="bg-muted/50 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold mb-3">Important: Act Quickly</h3>
                <p className="text-muted-foreground">
                  The sooner you treat a stain, the better your chances of complete removal. 
                  Always blot, never rub, and test any cleaning solution on an inconspicuous area first.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Common Stains</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium">Oil-based stains:</span>
                      <p className="text-muted-foreground">Blot excess, apply cornstarch, let sit for 10 minutes, then brush off gently</p>
                    </div>
                    <div>
                      <span className="font-medium">Water-based stains:</span>
                      <p className="text-muted-foreground">Blot with clean, damp cloth working from outside in</p>
                    </div>
                    <div>
                      <span className="font-medium">Protein stains:</span>
                      <p className="text-muted-foreground">Rinse with cold water immediately, never use hot water</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">When to Seek Professional Help</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Large or set-in stains</li>
                    <li>• Delicate or embellished fabrics</li>
                    <li>• Unknown stain composition</li>
                    <li>• Valuable or sentimental pieces</li>
                    <li>• Previous home treatment failed</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Storage Tips */}
          <section className="space-y-8 border-t border-border pt-16">
            <h2 className="text-3xl font-serif font-bold text-center">Long-Term Storage</h2>
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-xl font-serif font-semibold">Seasonal Storage</h3>
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Clean Before Storing</h4>
                    <p>Always clean garments before long-term storage to prevent stains from setting and attracting pests.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Climate Control</h4>
                    <p>Store in a cool, dry place with consistent temperature and humidity levels.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Protection</h4>
                    <p>Use breathable garment bags or acid-free tissue paper, never plastic bags.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-serif font-semibold">Daily Care</h3>
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">After Wearing</h4>
                    <p>Allow garments to air out before storing, check for stains or damage.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Rotation</h4>
                    <p>Rotate your wardrobe to prevent excessive wear on favorite pieces.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Professional Maintenance</h4>
                    <p>Schedule regular professional cleaning for your most treasured pieces.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="text-center space-y-4 border-t border-border pt-16">
            <h3 className="text-xl font-serif font-semibold">Need Care Advice?</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our customer service team is here to help with specific care questions about your bibiere pieces. 
              Don't hesitate to reach out for personalized advice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="text-bibiere-burgundy hover:underline font-medium">
                Contact Us
              </a>
              <span className="hidden sm:inline text-muted-foreground">|</span>
              <a href="mailto:care@bibiere.com" className="text-bibiere-burgundy hover:underline font-medium">
                care@bibiere.com
              </a>
              <span className="hidden sm:inline text-muted-foreground">|</span>
              <a href="tel:+15551234567" className="text-bibiere-burgundy hover:underline font-medium">
                +1 (555) 123-4567
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}