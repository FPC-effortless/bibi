import { Metadata } from "next"
import { Truck, RotateCcw, Shield, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Shipping & Returns - bibiere",
  description: "Learn about bibiere's shipping options, return policy, and how we ensure your luxury fashion arrives safely.",
}

export default function ShippingReturnsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold mb-4">Shipping & Returns</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We want you to love your bibiere pieces. Learn about our shipping options and 
            hassle-free return policy designed with your satisfaction in mind.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-16">
          {/* Shipping Section */}
          <section className="space-y-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-bibiere-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-bibiere-burgundy" />
              </div>
              <h2 className="text-3xl font-serif font-bold mb-4">Shipping Information</h2>
              <p className="text-muted-foreground">
                We offer multiple shipping options to ensure your order arrives when you need it.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-xl font-serif font-semibold">Shipping Options</h3>
                <div className="space-y-4">
                  <div className="border border-border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">Standard Shipping</h4>
                      <span className="text-sm text-muted-foreground">5-7 business days</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Free on orders over $200</p>
                    <p className="font-semibold">$15.00</p>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">Express Shipping</h4>
                      <span className="text-sm text-muted-foreground">2-3 business days</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Expedited delivery</p>
                    <p className="font-semibold">$25.00</p>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">Overnight Shipping</h4>
                      <span className="text-sm text-muted-foreground">1 business day</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Next day delivery</p>
                    <p className="font-semibold">$45.00</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-serif font-semibold">Shipping Details</h3>
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Processing Time</h4>
                    <p>Orders are processed within 1-2 business days. You'll receive a tracking number once your order ships.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">International Shipping</h4>
                    <p>We ship worldwide. International shipping rates and delivery times vary by destination.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Packaging</h4>
                    <p>All items are carefully packaged in our signature bibiere packaging to ensure they arrive in perfect condition.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Returns Section */}
          <section className="space-y-8 border-t border-border pt-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-bibiere-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="h-8 w-8 text-bibiere-gold" />
              </div>
              <h2 className="text-3xl font-serif font-bold mb-4">Returns & Exchanges</h2>
              <p className="text-muted-foreground">
                Not completely satisfied? We offer a generous return policy to ensure your complete satisfaction.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-xl font-serif font-semibold">Return Policy</h3>
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">30-Day Returns</h4>
                    <p>Return any item within 30 days of delivery for a full refund or exchange.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Condition Requirements</h4>
                    <p>Items must be unworn, unwashed, and in original condition with all tags attached.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Free Returns</h4>
                    <p>We provide a prepaid return label for all domestic returns. International return shipping fees apply.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-serif font-semibold">How to Return</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-bibiere-burgundy text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      1
                    </div>
                    <p className="text-muted-foreground">Contact our customer service team to initiate your return.</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-bibiere-burgundy text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      2
                    </div>
                    <p className="text-muted-foreground">Pack your items securely in the original packaging.</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-bibiere-burgundy text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      3
                    </div>
                    <p className="text-muted-foreground">Use the prepaid return label and drop off at any authorized location.</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-bibiere-burgundy text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      4
                    </div>
                    <p className="text-muted-foreground">Receive your refund within 5-7 business days after we receive your return.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Additional Services */}
          <section className="space-y-8 border-t border-border pt-16">
            <h2 className="text-3xl font-serif font-bold text-center mb-8">Additional Services</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Shield className="h-8 w-8 text-foreground" />
                </div>
                <h3 className="text-xl font-serif font-semibold">Damage Protection</h3>
                <p className="text-muted-foreground">
                  If your item arrives damaged, we'll replace it immediately at no cost to you.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Clock className="h-8 w-8 text-foreground" />
                </div>
                <h3 className="text-xl font-serif font-semibold">Extended Returns</h3>
                <p className="text-muted-foreground">
                  Holiday purchases can be returned until January 31st for your convenience.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="text-center space-y-4 border-t border-border pt-16">
            <h3 className="text-xl font-serif font-semibold">Questions?</h3>
            <p className="text-muted-foreground">
              Our customer service team is here to help with any shipping or return questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="text-bibiere-burgundy hover:underline font-medium">
                Contact Us
              </a>
              <span className="hidden sm:inline text-muted-foreground">|</span>
              <a href="mailto:hello@bibiere.com" className="text-bibiere-burgundy hover:underline font-medium">
                hello@bibiere.com
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