import { Metadata } from "next"
import { Leaf, Recycle, Heart, Globe, Award, Users } from "lucide-react"

export const metadata: Metadata = {
  title: "Sustainability - Our Commitment | bibiere",
  description: "Discover bibiere's commitment to sustainable luxury fashion, ethical practices, and environmental responsibility.",
}

export default function SustainabilityPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Leaf className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold">Sustainable Luxury</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We believe that true luxury must be responsible. Our commitment to sustainability is woven into every aspect of our business, from sourcing to production to packaging.
            </p>
          </div>

          {/* Our Commitment */}
          <div className="space-y-8">
            <h2 className="text-3xl font-serif font-bold text-center">Our Sustainability Pillars</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Globe className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-serif font-semibold">Environmental Stewardship</h3>
                <p className="text-muted-foreground">
                  Minimizing our environmental impact through responsible sourcing, renewable energy, and carbon-neutral shipping.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-serif font-semibold">Social Responsibility</h3>
                <p className="text-muted-foreground">
                  Ensuring fair wages, safe working conditions, and supporting communities throughout our supply chain.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-serif font-semibold">Ethical Practices</h3>
                <p className="text-muted-foreground">
                  Transparency in our operations and partnerships with suppliers who share our values and standards.
                </p>
              </div>
            </div>
          </div>

          {/* Materials Section */}
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-serif font-bold">Sustainable Materials</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We carefully select materials that meet our high standards for both quality and sustainability
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="border border-border rounded-lg p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-serif font-semibold">Organic & Natural Fibers</h3>
                </div>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>• Organic cotton certified by GOTS (Global Organic Textile Standard)</p>
                  <p>• Linen from European flax farms using sustainable practices</p>
                  <p>• Silk from certified suppliers with ethical sericulture practices</p>
                  <p>• Wool from farms with high animal welfare standards</p>
                </div>
              </div>

              <div className="border border-border rounded-lg p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Recycle className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-serif font-semibold">Innovative Eco-Materials</h3>
                </div>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>• Recycled cashmere from post-consumer garments</p>
                  <p>• Tencel and modal from sustainably managed forests</p>
                  <p>• Recycled polyester from plastic bottles</p>
                  <p>• Deadstock fabrics to reduce textile waste</p>
                </div>
              </div>
            </div>
          </div>

          {/* Production Practices */}
          <div className="bg-muted/30 rounded-lg p-8 space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-serif font-bold">Responsible Production</h2>
              <p className="text-muted-foreground">
                Our manufacturing partners share our commitment to ethical and sustainable practices
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-xl font-serif font-semibold">Manufacturing Standards</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-bibiere-burgundy mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Certified Facilities</p>
                      <p className="text-sm text-muted-foreground">All production facilities are OEKO-TEX and SA8000 certified</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-bibiere-burgundy mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Fair Labor Practices</p>
                      <p className="text-sm text-muted-foreground">Living wages, safe conditions, and no child labor</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-bibiere-burgundy mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Local Sourcing</p>
                      <p className="text-sm text-muted-foreground">Prioritizing suppliers within 500km of production facilities</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-serif font-semibold">Environmental Measures</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Leaf className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Water Conservation</p>
                      <p className="text-sm text-muted-foreground">Advanced water recycling and low-impact dyeing processes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Recycle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Waste Reduction</p>
                      <p className="text-sm text-muted-foreground">Zero waste to landfill policy with comprehensive recycling</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Renewable Energy</p>
                      <p className="text-sm text-muted-foreground">100% renewable energy in all owned facilities</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Packaging & Shipping */}
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-serif font-bold">Sustainable Packaging</h2>
              <p className="text-muted-foreground">
                Every detail matters, including how we package and ship your orders
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Recycle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-serif font-semibold">Recyclable Materials</h3>
                <p className="text-sm text-muted-foreground">
                  100% recyclable and biodegradable packaging materials, including our signature boxes and dust bags
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Globe className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-serif font-semibold">Carbon Neutral Shipping</h3>
                <p className="text-sm text-muted-foreground">
                  All shipments are carbon neutral through verified offset programs and optimized logistics
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-serif font-semibold">Minimal Packaging</h3>
                <p className="text-sm text-muted-foreground">
                  Right-sized packaging to reduce waste while ensuring your items arrive in perfect condition
                </p>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="border border-border rounded-lg p-8 space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-serif font-bold">Our Certifications</h2>
              <p className="text-muted-foreground">
                Third-party verified standards that hold us accountable
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-2">
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto">
                  <span className="text-xs font-bold">GOTS</span>
                </div>
                <p className="text-sm font-medium">Global Organic Textile Standard</p>
              </div>
              <div className="space-y-2">
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto">
                  <span className="text-xs font-bold">OEKO</span>
                </div>
                <p className="text-sm font-medium">OEKO-TEX Standard 100</p>
              </div>
              <div className="space-y-2">
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto">
                  <span className="text-xs font-bold">SA8000</span>
                </div>
                <p className="text-sm font-medium">Social Accountability</p>
              </div>
              <div className="space-y-2">
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto">
                  <span className="text-xs font-bold">B-CORP</span>
                </div>
                <p className="text-sm font-medium">Certified B Corporation</p>
              </div>
            </div>
          </div>

          {/* Goals & Progress */}
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-serif font-bold">2030 Sustainability Goals</h2>
              <p className="text-muted-foreground">
                Our ambitious targets for the next decade
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Carbon Neutral Operations</span>
                    <span className="text-sm text-green-600 font-medium">85% Complete</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Sustainable Materials</span>
                    <span className="text-sm text-green-600 font-medium">70% Complete</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Circular Design</span>
                    <span className="text-sm text-blue-600 font-medium">45% Complete</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-serif font-semibold">Key Initiatives</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Transition to 100% renewable energy across all facilities</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Achieve 90% sustainable material sourcing</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Launch take-back program for end-of-life garments</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Implement blockchain supply chain transparency</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center space-y-6 py-12 border-t border-border">
            <h2 className="text-3xl font-serif font-bold">Join Our Journey</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Sustainability is not a destination but a continuous journey. By choosing bibiere, 
              you're supporting responsible luxury and helping us create a more sustainable future for fashion.
            </p>
            <div className="text-sm text-muted-foreground">
              <p>Download our latest sustainability report to learn more about our progress and commitments.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
