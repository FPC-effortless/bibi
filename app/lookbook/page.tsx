import { Metadata } from "next"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Share2, ShoppingBag, Eye } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Lookbook - Style Inspiration & Curated Looks | bibiere",
  description: "Discover styling inspiration with bibiere's curated lookbook. Explore seasonal collections, styling tips, and complete looks from our luxury fashion pieces.",
}

// Mock lookbook data
const lookbookData = {
  seasonal: [
    {
      id: "look-s1",
      title: "Autumn Elegance",
      description: "Sophisticated layering with rich textures and warm tones for the modern woman.",
      image: "/lookbook-autumn-elegance.jpg",
      season: "Autumn 2024",
      tags: ["Layering", "Textures", "Warm Tones"],
      pieces: [
        { name: "Cashmere Coat", price: 2495, id: "coat-001" },
        { name: "Silk Blouse", price: 695, id: "blouse-001" },
        { name: "Tailored Trousers", price: 895, id: "trousers-001" }
      ],
      stylingTip: "Layer different textures to create visual depth while maintaining a cohesive color palette."
    },
    {
      id: "look-s2",
      title: "Winter Minimalism",
      description: "Clean lines and luxurious fabrics create an effortlessly chic winter wardrobe.",
      image: "/lookbook-winter-minimalism.jpg",
      season: "Winter 2024",
      tags: ["Minimalist", "Clean Lines", "Luxury"],
      pieces: [
        { name: "Wool Turtleneck", price: 545, id: "turtleneck-001" },
        { name: "Midi Skirt", price: 795, id: "skirt-001" },
        { name: "Leather Boots", price: 1295, id: "boots-001" }
      ],
      stylingTip: "Focus on quality over quantity - invest in timeless pieces that work across seasons."
    },
    {
      id: "look-s3",
      title: "Spring Sophistication",
      description: "Fresh florals and flowing silhouettes welcome the new season with grace.",
      image: "/lookbook-spring-sophistication.jpg",
      season: "Spring 2024",
      tags: ["Florals", "Flowing", "Fresh"],
      pieces: [
        { name: "Floral Dress", price: 1295, id: "dress-001" },
        { name: "Light Cardigan", price: 495, id: "cardigan-001" },
        { name: "Ballet Flats", price: 695, id: "flats-001" }
      ],
      stylingTip: "Embrace lighter fabrics and softer colors to transition into warmer weather."
    }
  ],
  occasion: [
    {
      id: "look-o1",
      title: "Business Chic",
      description: "Professional elegance that commands respect in the boardroom.",
      image: "/lookbook-business-chic.jpg",
      occasion: "Professional",
      tags: ["Professional", "Elegant", "Powerful"],
      pieces: [
        { name: "Blazer", price: 1495, id: "blazer-001" },
        { name: "Pencil Skirt", price: 695, id: "skirt-002" },
        { name: "Silk Camisole", price: 395, id: "camisole-001" }
      ],
      stylingTip: "Choose structured pieces in neutral tones for a polished, professional appearance."
    },
    {
      id: "look-o2",
      title: "Evening Glamour",
      description: "Sophisticated drama for special occasions and memorable nights.",
      image: "/lookbook-evening-glamour.jpg",
      occasion: "Evening",
      tags: ["Glamorous", "Dramatic", "Special Occasion"],
      pieces: [
        { name: "Evening Gown", price: 2895, id: "gown-001" },
        { name: "Statement Earrings", price: 295, id: "earrings-001" },
        { name: "Clutch Bag", price: 795, id: "clutch-001" }
      ],
      stylingTip: "Let one statement piece be the star - keep other elements refined and complementary."
    },
    {
      id: "look-o3",
      title: "Weekend Luxury",
      description: "Effortless elegance for relaxed moments and casual sophistication.",
      image: "/lookbook-weekend-luxury.jpg",
      occasion: "Casual",
      tags: ["Casual", "Comfortable", "Effortless"],
      pieces: [
        { name: "Knit Sweater", price: 595, id: "sweater-001" },
        { name: "Wide-leg Pants", price: 795, id: "pants-001" },
        { name: "Sneakers", price: 495, id: "sneakers-001" }
      ],
      stylingTip: "Combine comfort with luxury through premium fabrics and relaxed silhouettes."
    }
  ]
}

const allLooks = [...lookbookData.seasonal, ...lookbookData.occasion]

export default function LookbookPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-6">
          <div className="space-y-4">
            <Badge className="bg-bibiere-burgundy mb-4">Style Inspiration</Badge>
            <h1 className="text-4xl md:text-5xl font-serif font-bold">Lookbook</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover styling inspiration and curated looks from our latest collections. 
              Each piece tells a story of timeless elegance and sophisticated craftsmanship.
            </p>
          </div>
          
          {/* Collection Stats */}
          <div className="flex justify-center gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-bibiere-burgundy">{allLooks.length}</div>
              <div className="text-sm text-muted-foreground">Curated Looks</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-bibiere-burgundy">4</div>
              <div className="text-sm text-muted-foreground">Seasons</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-bibiere-burgundy">Expert</div>
              <div className="text-sm text-muted-foreground">Styling Tips</div>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs defaultValue="all" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="all">All Looks</TabsTrigger>
            <TabsTrigger value="seasonal">Seasonal</TabsTrigger>
            <TabsTrigger value="occasion">By Occasion</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allLooks.map((look) => (
                <LookCard key={look.id} look={look} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="seasonal" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-serif font-bold mb-2">Seasonal Collections</h2>
              <p className="text-muted-foreground">Curated looks for every season and weather</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {lookbookData.seasonal.map((look) => (
                <LookCard key={look.id} look={look} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="occasion" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-serif font-bold mb-2">Occasion Styling</h2>
              <p className="text-muted-foreground">Perfect looks for every moment and event</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {lookbookData.occasion.map((look) => (
                <LookCard key={look.id} look={look} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Styling Philosophy */}
        <div className="mt-16 bg-muted/30 rounded-lg p-8 space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-serif font-bold">Our Styling Philosophy</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              At bibiere, we believe in creating looks that transcend trends and embrace timeless sophistication
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-bibiere-burgundy/10 rounded-full flex items-center justify-center mx-auto">
                <Eye className="w-8 h-8 text-bibiere-burgundy" />
              </div>
              <div>
                <h3 className="font-serif font-semibold mb-2">Thoughtful Curation</h3>
                <p className="text-sm text-muted-foreground">
                  Every look is carefully curated to showcase the versatility and elegance of our pieces.
                </p>
              </div>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-bibiere-burgundy/10 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 text-bibiere-burgundy" />
              </div>
              <div>
                <h3 className="font-serif font-semibold mb-2">Personal Expression</h3>
                <p className="text-sm text-muted-foreground">
                  We encourage personal interpretation and adaptation of our styling suggestions.
                </p>
              </div>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-bibiere-burgundy/10 rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8 text-bibiere-burgundy" />
              </div>
              <div>
                <h3 className="font-serif font-semibold mb-2">Investment Pieces</h3>
                <p className="text-sm text-muted-foreground">
                  Focus on quality pieces that work across multiple looks and seasons.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 text-center space-y-4">
          <h3 className="text-xl font-serif font-semibold">Style Updates</h3>
          <p className="text-muted-foreground">
            Get the latest lookbook updates and styling tips delivered to your inbox
          </p>
          <Button>Subscribe for Style Inspiration</Button>
        </div>
      </div>
    </div>
  )
}

// Look Card Component
function LookCard({ look }: { look: any }) {
  return (
    <div className="group space-y-4 cursor-pointer">
      {/* Look Image */}
      <div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-muted-foreground font-medium">{look.title}</p>
        </div>
        
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button size="sm" variant="secondary" className="w-10 h-10 p-0">
            <Heart className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="secondary" className="w-10 h-10 p-0">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Season/Occasion Badge */}
        <div className="absolute bottom-4 left-4">
          <Badge variant="secondary" className="bg-white/90 text-black">
            {'season' in look ? look.season : look.occasion}
          </Badge>
        </div>
      </div>

      {/* Look Details */}
      <div className="space-y-3">
        <div>
          <h3 className="font-serif font-semibold text-lg group-hover:text-bibiere-burgundy transition-colors">
            {look.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {look.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {look.tags.map((tag: string) => (
            <span key={tag} className="text-xs bg-muted px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* Featured Pieces */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Featured Pieces:</h4>
          <div className="space-y-1">
            {look.pieces.slice(0, 2).map((piece: any) => (
              <div key={piece.id} className="flex justify-between items-center text-sm">
                <Link href={`/product/${piece.id}`} className="text-muted-foreground hover:text-bibiere-burgundy transition-colors">
                  {piece.name}
                </Link>
                <span className="font-medium">${piece.price}</span>
              </div>
            ))}
            {look.pieces.length > 2 && (
              <p className="text-xs text-muted-foreground">+{look.pieces.length - 2} more pieces</p>
            )}
          </div>
        </div>

        {/* Styling Tip */}
        <div className="bg-muted/50 p-3 rounded-lg">
          <p className="text-xs text-muted-foreground italic">
            <strong>Styling Tip:</strong> {look.stylingTip}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            View Look
          </Button>
          <Button size="sm" className="flex-1">
            Shop Pieces
          </Button>
        </div>
      </div>
    </div>
  )
}