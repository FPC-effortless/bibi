import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Download, ExternalLink, Calendar, User, Award } from "lucide-react"

export const metadata: Metadata = {
  title: "Press & Media | bibiere",
  description: "Latest news, press releases, and media coverage of bibiere luxury fashion brand.",
}

const pressReleases = [
  {
    date: "2024-08-15",
    title: "bibiere Launches Sustainable Luxury Collection",
    excerpt: "New collection features 90% sustainable materials while maintaining the brand's signature elegance and craftsmanship.",
    category: "Product Launch",
    featured: true
  },
  {
    date: "2024-07-22",
    title: "bibiere Partners with Renowned Italian Artisans",
    excerpt: "Strategic partnership expands production capabilities while preserving traditional craftsmanship techniques.",
    category: "Partnership"
  },
  {
    date: "2024-06-10",
    title: "bibiere Receives B-Corp Certification",
    excerpt: "Luxury fashion brand achieves prestigious certification for meeting high standards of social and environmental performance.",
    category: "Sustainability"
  },
  {
    date: "2024-05-28",
    title: "bibiere Opens New Flagship Store in Beverly Hills",
    excerpt: "Stunning new retail space showcases the brand's commitment to luxury retail experience and customer service.",
    category: "Retail"
  }
]

const mediaFeatures = [
  {
    publication: "Vogue",
    title: "The New Generation of Sustainable Luxury",
    date: "2024-08-20",
    type: "Feature Article",
    image: "vogue-feature.jpg"
  },
  {
    publication: "Harper's Bazaar",
    title: "bibiere's Timeless Approach to Modern Fashion",
    date: "2024-07-15",
    type: "Brand Profile",
    image: "harpers-feature.jpg"
  },
  {
    publication: "Elle",
    title: "Best Investment Pieces for Your Wardrobe",
    date: "2024-06-30",
    type: "Product Feature",
    image: "elle-feature.jpg"
  },
  {
    publication: "WWD",
    title: "bibiere's Sustainable Manufacturing Revolution",
    date: "2024-06-05",
    type: "Industry News",
    image: "wwd-feature.jpg"
  }
]

const awards = [
  {
    year: "2024",
    award: "Sustainable Fashion Brand of the Year",
    organization: "Fashion Revolution",
    description: "Recognized for outstanding commitment to sustainable practices and transparency."
  },
  {
    year: "2023",
    award: "Luxury Brand Excellence Award",
    organization: "Luxury Institute",
    description: "Honored for exceptional customer experience and brand quality."
  },
  {
    year: "2023",
    award: "Best Craftsmanship Award",
    organization: "International Fashion Awards",
    description: "Celebrated for preserving traditional tailoring techniques in modern luxury fashion."
  }
]

export default function PressPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-serif font-bold">Press & Media</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Latest news, press releases, and media coverage featuring bibiere
            </p>
          </div>

          {/* Press Contact */}
          <div className="bg-muted/30 rounded-lg p-8 text-center space-y-4">
            <h2 className="text-2xl font-serif font-semibold">Media Inquiries</h2>
            <p className="text-muted-foreground">
              For press inquiries, high-resolution images, or interview requests, please contact our media team.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="text-sm">
                <p className="font-medium">Sarah Mitchell</p>
                <p className="text-muted-foreground">Director of Communications</p>
                <p className="text-muted-foreground">press@bibiere.com</p>
              </div>
              <Separator orientation="vertical" className="h-16" />
              <div className="text-sm">
                <p className="font-medium">Media Resources</p>
                <Button variant="outline" size="sm" className="mt-2">
                  <Download className="w-4 h-4 mr-2" />
                  Download Press Kit
                </Button>
              </div>
            </div>
          </div>

          {/* Latest Press Releases */}
          <div className="space-y-8">
            <h2 className="text-3xl font-serif font-bold">Latest Press Releases</h2>
            
            <div className="space-y-6">
              {pressReleases.map((release, index) => (
                <div key={index} className={`border border-border rounded-lg p-6 ${
                  release.featured ? 'bg-bibiere-burgundy/5 border-bibiere-burgundy/20' : ''
                }`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {new Date(release.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <Badge variant={release.featured ? "default" : "secondary"}>
                        {release.category}
                      </Badge>
                      {release.featured && (
                        <Badge className="bg-bibiere-burgundy">Featured</Badge>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      Read Full Release
                      <ExternalLink className="w-3 h-3 ml-2" />
                    </Button>
                  </div>
                  <h3 className="text-xl font-serif font-semibold mb-3">{release.title}</h3>
                  <p className="text-muted-foreground">{release.excerpt}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button variant="outline">View All Press Releases</Button>
            </div>
          </div>

          {/* Media Coverage */}
          <div className="space-y-8">
            <h2 className="text-3xl font-serif font-bold">Media Coverage</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {mediaFeatures.map((feature, index) => (
                <div key={index} className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-[16/9] bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground">{feature.publication} Feature</p>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{feature.type}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(feature.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-serif font-semibold text-lg mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">Published in {feature.publication}</p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Read Article
                      <ExternalLink className="w-3 h-3 ml-2" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button variant="outline">View All Media Coverage</Button>
            </div>
          </div>

          {/* Awards & Recognition */}
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-serif font-bold">Awards & Recognition</h2>
              <p className="text-muted-foreground">
                Industry recognition for our commitment to excellence and sustainability
              </p>
            </div>
            
            <div className="space-y-6">
              {awards.map((award, index) => (
                <div key={index} className="border border-border rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-bibiere-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-bibiere-gold" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-serif font-semibold">{award.award}</h3>
                        <Badge variant="outline">{award.year}</Badge>
                      </div>
                      <p className="text-muted-foreground font-medium">{award.organization}</p>
                      <p className="text-muted-foreground">{award.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Brand Assets */}
          <div className="bg-muted/30 rounded-lg p-8 space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-serif font-semibold">Brand Assets</h2>
              <p className="text-muted-foreground">
                High-resolution logos, product images, and brand guidelines for media use
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-background rounded-lg flex items-center justify-center mx-auto border">
                  <span className="font-serif font-bold text-bibiere-burgundy">b</span>
                </div>
                <div>
                  <h3 className="font-semibold">Logo Package</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Various formats and color variations
                  </p>
                  <Button variant="outline" size="sm">
                    <Download className="w-3 h-3 mr-2" />
                    Download
                  </Button>
                </div>
              </div>

              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-background rounded-lg flex items-center justify-center mx-auto border">
                  <span className="text-xs text-muted-foreground">IMG</span>
                </div>
                <div>
                  <h3 className="font-semibold">Product Images</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    High-resolution product photography
                  </p>
                  <Button variant="outline" size="sm">
                    <Download className="w-3 h-3 mr-2" />
                    Download
                  </Button>
                </div>
              </div>

              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-background rounded-lg flex items-center justify-center mx-auto border">
                  <span className="text-xs text-muted-foreground">DOC</span>
                </div>
                <div>
                  <h3 className="font-semibold">Brand Guidelines</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Usage guidelines and brand standards
                  </p>
                  <Button variant="outline" size="sm">
                    <Download className="w-3 h-3 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="text-center space-y-6 py-12 border-t border-border">
            <h2 className="text-3xl font-serif font-bold">Stay Updated</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Subscribe to our press newsletter to receive the latest news, press releases, and media updates from bibiere.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button>Subscribe to Press Updates</Button>
              <Button variant="outline" asChild>
                <Link href="/contact">Contact Media Team</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
