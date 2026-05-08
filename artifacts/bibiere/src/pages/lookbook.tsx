import { useState } from "react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Share2, ShoppingBag, Eye } from "lucide-react";

interface Look {
  id: string;
  title: string;
  description: string;
  image: string;
  season?: string;
  occasion?: string;
  tags: string[];
  pieces: { name: string; price: number; id: string }[];
  stylingTip: string;
}

const lookbookData: { seasonal: Look[]; occasion: Look[] } = {
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
        { name: "Tailored Trousers", price: 895, id: "trousers-001" },
      ],
      stylingTip: "Layer different textures to create visual depth while maintaining a cohesive color palette.",
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
        { name: "Leather Boots", price: 1295, id: "boots-001" },
      ],
      stylingTip: "Focus on quality over quantity — invest in timeless pieces that work across seasons.",
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
        { name: "Ballet Flats", price: 695, id: "flats-001" },
      ],
      stylingTip: "Embrace lighter fabrics and softer colors to transition into warmer weather.",
    },
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
        { name: "Silk Camisole", price: 395, id: "camisole-001" },
      ],
      stylingTip: "Choose structured pieces in neutral tones for a polished, professional appearance.",
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
        { name: "Clutch Bag", price: 795, id: "clutch-001" },
      ],
      stylingTip: "Let one statement piece be the star — keep other elements refined and complementary.",
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
        { name: "Sneakers", price: 495, id: "sneakers-001" },
      ],
      stylingTip: "Combine comfort with luxury through premium fabrics and relaxed silhouettes.",
    },
  ],
};

function LookCard({ look }: { look: Look }) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="group border border-border rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="aspect-[3/4] bg-muted flex items-center justify-center relative overflow-hidden">
        <p className="text-muted-foreground text-sm">{look.title}</p>
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Button
            size="sm"
            variant="secondary"
            className="gap-1"
            onClick={() => setLiked(!liked)}
          >
            <Heart className={`w-4 h-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
          <Button size="sm" variant="secondary" className="gap-1">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="p-5 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-serif font-semibold text-lg">{look.title}</h3>
            {(look.season || look.occasion) && (
              <Badge variant="secondary" className="text-xs">
                {look.season ?? look.occasion}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm">{look.description}</p>
        </div>
        <div className="flex flex-wrap gap-1">
          {look.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="space-y-2 border-t border-border pt-4">
          <p className="text-sm font-medium">Shop the Look</p>
          {look.pieces.map((piece) => (
            <div key={piece.id} className="flex items-center justify-between text-sm">
              <Link href={`/product/${piece.id}`} className="text-bibiere-burgundy hover:underline">
                {piece.name}
              </Link>
              <span className="text-muted-foreground">${piece.price}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground italic border-t border-border pt-3">
          <span className="font-medium not-italic">Styling tip: </span>
          {look.stylingTip}
        </p>
      </div>
    </div>
  );
}

const allLooks = [...lookbookData.seasonal, ...lookbookData.occasion];

export default function LookbookPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 space-y-6">
          <Badge className="bg-bibiere-burgundy text-white mb-4">Style Inspiration</Badge>
          <h1 className="text-4xl md:text-5xl font-serif font-bold">Lookbook</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover styling inspiration and curated looks from our latest collections. Each piece tells a story of timeless elegance and sophisticated craftsmanship.
          </p>
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

        <Tabs defaultValue="all" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="all">All Looks</TabsTrigger>
            <TabsTrigger value="seasonal">Seasonal</TabsTrigger>
            <TabsTrigger value="occasion">By Occasion</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allLooks.map((look) => (
                <LookCard key={look.id} look={look} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="seasonal">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {lookbookData.seasonal.map((look) => (
                <LookCard key={look.id} look={look} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="occasion">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {lookbookData.occasion.map((look) => (
                <LookCard key={look.id} look={look} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
