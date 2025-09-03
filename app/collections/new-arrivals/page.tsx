import { Metadata } from "next"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, SlidersHorizontal } from "lucide-react"
import ProductCard from "@/components/product-card"

export const metadata: Metadata = {
  title: "New Arrivals - Latest Luxury Fashion | bibiere",
  description: "Discover bibiere's newest collection of luxury fashion pieces. Fresh designs that embody timeless elegance and sophisticated craftsmanship.",
}

// Mock new arrivals data
const newArrivals = [
  {
    id: "na-001",
    name: "Silk Charmeuse Blouse",
    price: 695,
    image: "/silk-charmeuse-blouse.png",
    category: "Tops",
    color: "Ivory",
    isNew: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 23,
    description: "Luxurious silk charmeuse blouse with pearl button details"
  },
  {
    id: "na-002",
    name: "Tailored Wool Trousers",
    price: 895,
    image: "/tailored-wool-trousers.png",
    category: "Bottoms",
    color: "Charcoal",
    isNew: true,
    isFeatured: false,
    rating: 4.8,
    reviewCount: 15,
    description: "Impeccably tailored wool trousers with a modern silhouette"
  },
  {
    id: "na-003",
    name: "Cashmere Turtleneck",
    price: 545,
    image: "/cashmere-turtleneck.png",
    category: "Knitwear",
    color: "Camel",
    isNew: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 31,
    description: "Ultra-soft cashmere turtleneck in a relaxed fit"
  },
  {
    id: "na-004",
    name: "Leather Midi Skirt",
    price: 1295,
    image: "/leather-midi-skirt.png",
    category: "Skirts",
    color: "Black",
    isNew: true,
    isFeatured: false,
    rating: 4.7,
    reviewCount: 18,
    description: "Buttery soft leather midi skirt with subtle A-line silhouette"
  },
  {
    id: "na-005",
    name: "Oversized Blazer",
    price: 1495,
    image: "/oversized-blazer.png",
    category: "Blazers",
    color: "Navy",
    isNew: true,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 27,
    description: "Contemporary oversized blazer with structured shoulders"
  },
  {
    id: "na-006",
    name: "Pleated Midi Dress",
    price: 1895,
    image: "/pleated-midi-dress.png",
    category: "Dresses",
    color: "Burgundy",
    isNew: true,
    isFeatured: false,
    rating: 4.9,
    reviewCount: 22,
    description: "Elegant pleated midi dress in signature bibiere burgundy"
  }
]

export default function NewArrivalsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-6">
          <div className="space-y-4">
            <Badge className="bg-bibiere-burgundy mb-4">New Arrivals</Badge>
            <h1 className="text-4xl md:text-5xl font-serif font-bold">Latest Collection</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover our newest pieces, where contemporary design meets timeless elegance. 
              Each item is carefully crafted to become a cherished part of your wardrobe.
            </p>
          </div>
          
          {/* Collection Stats */}
          <div className="flex justify-center gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-bibiere-burgundy">{newArrivals.length}</div>
              <div className="text-sm text-muted-foreground">New Pieces</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-bibiere-burgundy">6</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-bibiere-burgundy">Limited</div>
              <div className="text-sm text-muted-foreground">Quantities</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {newArrivals.length} items
            </span>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
          
          <div className="flex gap-4">
            <Select defaultValue="newest">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Featured Items */}
        <div className="mb-12">
          <h2 className="text-2xl font-serif font-bold mb-6">Featured New Arrivals</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {newArrivals.filter(item => item.isFeatured).map((product) => (
              <ProductCard 
                key={product.id} 
                id={product.id}
                name={product.name}
                price={`$${product.price}`}
                primaryImage={product.image}
                hoverImage={product.image}
              />
            ))}
          </div>
        </div>

        {/* All New Arrivals */}
        <div className="space-y-8">
          <h2 className="text-2xl font-serif font-bold">Complete Collection</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard 
                key={product.id} 
                id={product.id}
                name={product.name}
                price={`$${product.price}`}
                primaryImage={product.image}
                hoverImage={product.image}
              />
            ))}
          </div>
        </div>

        {/* Collection Story */}
        <div className="mt-16 bg-muted/30 rounded-lg p-8 text-center space-y-6">
          <h2 className="text-3xl font-serif font-bold">The Story Behind Our Latest Collection</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            This season's collection draws inspiration from the intersection of modern architecture and 
            natural forms. Each piece reflects our commitment to creating garments that are both 
            contemporary and timeless, designed for the woman who appreciates subtle luxury and 
            impeccable craftsmanship.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="space-y-2">
              <h3 className="font-serif font-semibold">Sustainable Materials</h3>
              <p className="text-sm text-muted-foreground">
                90% of pieces feature certified sustainable fabrics
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-serif font-semibold">Artisan Crafted</h3>
              <p className="text-sm text-muted-foreground">
                Hand-finished details by master craftspeople
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-serif font-semibold">Limited Edition</h3>
              <p className="text-sm text-muted-foreground">
                Exclusive pieces with limited production runs
              </p>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 text-center space-y-4">
          <h3 className="text-xl font-serif font-semibold">Stay Updated</h3>
          <p className="text-muted-foreground">
            Be the first to know about new arrivals and exclusive collections
          </p>
          <Button>Subscribe to Updates</Button>
        </div>
      </div>
    </div>
  )
}
