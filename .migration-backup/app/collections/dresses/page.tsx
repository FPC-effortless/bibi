import { Metadata } from "next"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SlidersHorizontal, Star } from "lucide-react"
import ProductCard from "@/components/product-card"

export const metadata: Metadata = {
  title: "Luxury Dresses - Elegant Evening & Day Dresses | bibiere",
  description: "Discover bibiere's exquisite collection of luxury dresses. From elegant evening gowns to sophisticated day dresses, each piece embodies timeless elegance.",
}

// Mock dresses data
const dresses = {
  evening: [
    {
      id: "dr-eve-001",
      name: "Silk Evening Gown",
      price: 2895,
      originalPrice: 3295,
      image: "/silk-evening-gown.png",
      category: "Evening",
      color: "Midnight Blue",
      rating: 4.9,
      reviewCount: 45,
      isFeatured: true,
      description: "Floor-length silk gown with hand-beaded bodice"
    },
    {
      id: "dr-eve-002",
      name: "Velvet Cocktail Dress",
      price: 1695,
      image: "/velvet-cocktail-dress.png",
      category: "Evening",
      color: "Emerald",
      rating: 4.8,
      reviewCount: 32,
      isFeatured: false,
      description: "Luxurious velvet cocktail dress with subtle draping"
    },
    {
      id: "dr-eve-003",
      name: "Sequined Mini Dress",
      price: 1295,
      image: "/sequined-mini-dress.png",
      category: "Evening",
      color: "Gold",
      rating: 4.7,
      reviewCount: 28,
      isFeatured: true,
      description: "Hand-embellished sequined mini dress"
    }
  ],
  day: [
    {
      id: "dr-day-001",
      name: "Wrap Midi Dress",
      price: 895,
      image: "/wrap-midi-dress.png",
      category: "Day",
      color: "Navy",
      rating: 4.8,
      reviewCount: 67,
      isFeatured: true,
      description: "Classic wrap dress in premium jersey"
    },
    {
      id: "dr-day-002",
      name: "Shirt Dress",
      price: 695,
      image: "/shirt-dress.png",
      category: "Day",
      color: "White",
      rating: 4.6,
      reviewCount: 54,
      isFeatured: false,
      description: "Crisp cotton shirt dress with belt detail"
    },
    {
      id: "dr-day-003",
      name: "Knit Sweater Dress",
      price: 795,
      image: "/knit-sweater-dress.png",
      category: "Day",
      color: "Camel",
      rating: 4.9,
      reviewCount: 41,
      isFeatured: true,
      description: "Cozy cashmere blend sweater dress"
    }
  ],
  formal: [
    {
      id: "dr-for-001",
      name: "Black Tie Gown",
      price: 3495,
      image: "/black-tie-gown.png",
      category: "Formal",
      color: "Black",
      rating: 5.0,
      reviewCount: 23,
      isFeatured: true,
      description: "Exquisite black tie gown with train"
    },
    {
      id: "dr-for-002",
      name: "Lace Formal Dress",
      price: 2195,
      image: "/lace-formal-dress.png",
      category: "Formal",
      color: "Ivory",
      rating: 4.9,
      reviewCount: 18,
      isFeatured: false,
      description: "Intricate lace formal dress with silk lining"
    }
  ]
}

const allDresses = [...dresses.evening, ...dresses.day, ...dresses.formal]

export default function DressesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-6">
          <div className="space-y-4">
            <Badge className="bg-bibiere-burgundy mb-4">Dresses Collection</Badge>
            <h1 className="text-4xl md:text-5xl font-serif font-bold">Luxury Dresses</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              From elegant evening gowns to sophisticated day dresses, each piece in our collection 
              is designed to make you feel confident and beautiful for every occasion.
            </p>
          </div>
          
          {/* Collection Stats */}
          <div className="flex justify-center gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-bibiere-burgundy">{allDresses.length}</div>
              <div className="text-sm text-muted-foreground">Styles</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-bibiere-burgundy">3</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1">
                <Star className="w-4 h-4 fill-bibiere-gold text-bibiere-gold" />
                <span className="text-2xl font-bold text-bibiere-burgundy">4.8</span>
              </div>
              <div className="text-sm text-muted-foreground">Avg Rating</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {allDresses.length} dresses
            </span>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
          
          <div className="flex gap-4">
            <Select defaultValue="featured">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs defaultValue="all" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 max-w-md mx-auto">
            <TabsTrigger value="all">All Dresses</TabsTrigger>
            <TabsTrigger value="evening">Evening</TabsTrigger>
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="formal">Formal</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-8">
            {/* Featured Dresses */}
            <div className="space-y-6">
              <h2 className="text-2xl font-serif font-bold">Featured Dresses</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {allDresses.filter(dress => dress.isFeatured).slice(0, 3).map((product) => (
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

            {/* All Dresses */}
            <div className="space-y-6">
              <h2 className="text-2xl font-serif font-bold">Complete Collection</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {allDresses.map((product) => (
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
          </TabsContent>

          <TabsContent value="evening" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-serif font-bold mb-2">Evening Dresses</h2>
              <p className="text-muted-foreground">Elegant gowns for special occasions and formal events</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {dresses.evening.map((product) => (
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
          </TabsContent>

          <TabsContent value="day" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-serif font-bold mb-2">Day Dresses</h2>
              <p className="text-muted-foreground">Sophisticated styles perfect for everyday elegance</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {dresses.day.map((product) => (
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
          </TabsContent>

          <TabsContent value="formal" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-serif font-bold mb-2">Formal Dresses</h2>
              <p className="text-muted-foreground">Exquisite gowns for the most important occasions</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {dresses.formal.map((product) => (
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
          </TabsContent>
        </Tabs>

        {/* Styling Guide */}
        <div className="mt-16 bg-muted/30 rounded-lg p-8 space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-serif font-bold">Dress Styling Guide</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Expert tips on how to style your bibiere dresses for different occasions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Evening Styling</p>
              </div>
              <div>
                <h3 className="font-serif font-semibold mb-2">Evening Elegance</h3>
                <p className="text-sm text-muted-foreground">
                  Pair evening gowns with statement jewelry and elegant heels. 
                  A classic clutch completes the sophisticated look.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Day Styling</p>
              </div>
              <div>
                <h3 className="font-serif font-semibold mb-2">Daytime Chic</h3>
                <p className="text-sm text-muted-foreground">
                  Style day dresses with a structured blazer and comfortable flats. 
                  Add a crossbody bag for practical elegance.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Formal Styling</p>
              </div>
              <div>
                <h3 className="font-serif font-semibold mb-2">Formal Perfection</h3>
                <p className="text-sm text-muted-foreground">
                  Formal dresses shine with minimal, high-quality accessories. 
                  Let the dress be the star of your ensemble.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Care Instructions */}
        <div className="mt-12 text-center space-y-6">
          <h3 className="text-2xl font-serif font-bold">Caring for Your Dresses</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our luxury dresses are crafted with the finest materials. Proper care ensures they remain 
            beautiful for years to come.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="space-y-2">
              <h4 className="font-serif font-semibold">Professional Cleaning</h4>
              <p className="text-sm text-muted-foreground">
                We recommend dry cleaning for all evening and formal dresses
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-serif font-semibold">Proper Storage</h4>
              <p className="text-sm text-muted-foreground">
                Store on padded hangers in breathable garment bags
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-serif font-semibold">Expert Alterations</h4>
              <p className="text-sm text-muted-foreground">
                Our recommended tailors can ensure the perfect fit
              </p>
            </div>
          </div>
          <Button variant="outline">View Complete Care Guide</Button>
        </div>
      </div>
    </div>
  )
}
