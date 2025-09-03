import { Metadata } from "next"
import { Ruler, Info } from "lucide-react"

export const metadata: Metadata = {
  title: "Size Guide - bibiere",
  description: "Find your perfect fit with bibiere's comprehensive size guide for luxury fashion.",
}

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold mb-4">Size Guide</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find your perfect fit with our comprehensive size guide. Each piece is crafted with precision, 
            and proper sizing ensures the best fit and comfort.
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-16">
          {/* How to Measure */}
          <section className="space-y-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-bibiere-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ruler className="h-8 w-8 text-bibiere-burgundy" />
              </div>
              <h2 className="text-3xl font-serif font-bold mb-4">How to Measure</h2>
              <p className="text-muted-foreground">
                For the most accurate fit, take your measurements while wearing well-fitting undergarments.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <span className="font-semibold">1</span>
                </div>
                <h3 className="font-semibold">Bust</h3>
                <p className="text-sm text-muted-foreground">
                  Measure around the fullest part of your bust, keeping the tape parallel to the floor.
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <span className="font-semibold">2</span>
                </div>
                <h3 className="font-semibold">Waist</h3>
                <p className="text-sm text-muted-foreground">
                  Measure around your natural waistline, which is the narrowest part of your torso.
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <span className="font-semibold">3</span>
                </div>
                <h3 className="font-semibold">Hips</h3>
                <p className="text-sm text-muted-foreground">
                  Measure around the fullest part of your hips, approximately 8 inches below your waist.
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <span className="font-semibold">4</span>
                </div>
                <h3 className="font-semibold">Length</h3>
                <p className="text-sm text-muted-foreground">
                  For dresses, measure from the highest point of your shoulder to your desired length.
                </p>
              </div>
            </div>
          </section>

          {/* Size Charts */}
          <section className="space-y-8">
            <h2 className="text-3xl font-serif font-bold text-center">Size Charts</h2>
            
            {/* Dresses Size Chart */}
            <div className="space-y-4">
              <h3 className="text-xl font-serif font-semibold">Dresses</h3>
              <div className="overflow-x-auto">
                <table className="w-full border border-border rounded-lg">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Size</th>
                      <th className="px-4 py-3 text-left font-semibold">Bust (inches)</th>
                      <th className="px-4 py-3 text-left font-semibold">Waist (inches)</th>
                      <th className="px-4 py-3 text-left font-semibold">Hips (inches)</th>
                      <th className="px-4 py-3 text-left font-semibold">Length (inches)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-4 py-3 font-medium">XS</td>
                      <td className="px-4 py-3">32-34</td>
                      <td className="px-4 py-3">24-26</td>
                      <td className="px-4 py-3">34-36</td>
                      <td className="px-4 py-3">58-60</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">S</td>
                      <td className="px-4 py-3">34-36</td>
                      <td className="px-4 py-3">26-28</td>
                      <td className="px-4 py-3">36-38</td>
                      <td className="px-4 py-3">59-61</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">M</td>
                      <td className="px-4 py-3">36-38</td>
                      <td className="px-4 py-3">28-30</td>
                      <td className="px-4 py-3">38-40</td>
                      <td className="px-4 py-3">60-62</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">L</td>
                      <td className="px-4 py-3">38-40</td>
                      <td className="px-4 py-3">30-32</td>
                      <td className="px-4 py-3">40-42</td>
                      <td className="px-4 py-3">61-63</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">XL</td>
                      <td className="px-4 py-3">40-42</td>
                      <td className="px-4 py-3">32-34</td>
                      <td className="px-4 py-3">42-44</td>
                      <td className="px-4 py-3">62-64</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tops Size Chart */}
            <div className="space-y-4">
              <h3 className="text-xl font-serif font-semibold">Tops & Blouses</h3>
              <div className="overflow-x-auto">
                <table className="w-full border border-border rounded-lg">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Size</th>
                      <th className="px-4 py-3 text-left font-semibold">Bust (inches)</th>
                      <th className="px-4 py-3 text-left font-semibold">Waist (inches)</th>
                      <th className="px-4 py-3 text-left font-semibold">Shoulder (inches)</th>
                      <th className="px-4 py-3 text-left font-semibold">Sleeve (inches)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-4 py-3 font-medium">XS</td>
                      <td className="px-4 py-3">32-34</td>
                      <td className="px-4 py-3">24-26</td>
                      <td className="px-4 py-3">14.5</td>
                      <td className="px-4 py-3">23</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">S</td>
                      <td className="px-4 py-3">34-36</td>
                      <td className="px-4 py-3">26-28</td>
                      <td className="px-4 py-3">15</td>
                      <td className="px-4 py-3">23.5</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">M</td>
                      <td className="px-4 py-3">36-38</td>
                      <td className="px-4 py-3">28-30</td>
                      <td className="px-4 py-3">15.5</td>
                      <td className="px-4 py-3">24</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">L</td>
                      <td className="px-4 py-3">38-40</td>
                      <td className="px-4 py-3">30-32</td>
                      <td className="px-4 py-3">16</td>
                      <td className="px-4 py-3">24.5</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">XL</td>
                      <td className="px-4 py-3">40-42</td>
                      <td className="px-4 py-3">32-34</td>
                      <td className="px-4 py-3">16.5</td>
                      <td className="px-4 py-3">25</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* International Sizes */}
          <section className="space-y-8 border-t border-border pt-16">
            <h2 className="text-3xl font-serif font-bold text-center">International Size Conversion</h2>
            <div className="overflow-x-auto">
              <table className="w-full border border-border rounded-lg">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">US</th>
                    <th className="px-4 py-3 text-left font-semibold">UK</th>
                    <th className="px-4 py-3 text-left font-semibold">EU</th>
                    <th className="px-4 py-3 text-left font-semibold">IT</th>
                    <th className="px-4 py-3 text-left font-semibold">FR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-3 font-medium">XS</td>
                    <td className="px-4 py-3">6</td>
                    <td className="px-4 py-3">34</td>
                    <td className="px-4 py-3">38</td>
                    <td className="px-4 py-3">34</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">S</td>
                    <td className="px-4 py-3">8</td>
                    <td className="px-4 py-3">36</td>
                    <td className="px-4 py-3">40</td>
                    <td className="px-4 py-3">36</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">M</td>
                    <td className="px-4 py-3">10</td>
                    <td className="px-4 py-3">38</td>
                    <td className="px-4 py-3">42</td>
                    <td className="px-4 py-3">38</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">L</td>
                    <td className="px-4 py-3">12</td>
                    <td className="px-4 py-3">40</td>
                    <td className="px-4 py-3">44</td>
                    <td className="px-4 py-3">40</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">XL</td>
                    <td className="px-4 py-3">14</td>
                    <td className="px-4 py-3">42</td>
                    <td className="px-4 py-3">46</td>
                    <td className="px-4 py-3">42</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Fit Tips */}
          <section className="space-y-8 border-t border-border pt-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-bibiere-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Info className="h-8 w-8 text-bibiere-gold" />
              </div>
              <h2 className="text-3xl font-serif font-bold mb-4">Fit Tips</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-serif font-semibold">Finding Your Perfect Fit</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• If you're between sizes, we recommend sizing up for a more comfortable fit</li>
                  <li>• Consider the fabric composition - natural fibers may have less stretch</li>
                  <li>• Check the product description for specific fit notes</li>
                  <li>• Our customer service team is available to help with sizing questions</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-serif font-semibold">Still Unsure?</h3>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    Our customer service team is here to help you find the perfect fit. 
                    Contact us with your measurements and we'll recommend the best size for you.
                  </p>
                  <div className="space-y-1">
                    <p>Email: sizing@bibiere.com</p>
                    <p>Phone: +1 (555) 123-4567</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}