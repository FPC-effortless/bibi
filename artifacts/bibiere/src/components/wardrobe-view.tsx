
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ShirtIcon } from "lucide-react" // Added import for ShirtIcon

interface WardrobeItem {
  id: string
  name: string
  image: string
  purchaseDate: string
  productUrl: string
}

export default function WardrobeView() {
  const { toast } = useToast()
  const [wardrobeItems] = useState<WardrobeItem[]>([
    {
      id: "1",
      name: "Classic Black Dress",
      image: "/elegant-black-silk-dress.png",
      purchaseDate: "2024-01-15",
      productUrl: "/product/1",
    },
    {
      id: "2",
      name: "Cashmere Scarf",
      image: "/cashmere-scarf.png",
      purchaseDate: "2024-02-03",
      productUrl: "/product/2",
    },
    {
      id: "3",
      name: "Designer Handbag",
      image: "/luxury-quilted-handbag.png",
      purchaseDate: "2024-01-28",
      productUrl: "/product/3",
    },
    {
      id: "4",
      name: "Luxury Watch",
      image: "/luxury-wristwatch.png",
      purchaseDate: "2024-02-10",
      productUrl: "/product/4",
    },
    {
      id: "5",
      name: "Wool Coat",
      image: "/cozy-wool-coat.png",
      purchaseDate: "2024-01-20",
      productUrl: "/product/5",
    },
  ])

  const viewProduct = (item: WardrobeItem) => {
    toast({
      title: "Redirecting to product",
      description: `Opening ${item.name} product page.`,
    })
    // In a real app, this would navigate to the product page
    // router.push(item.productUrl)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">My Wardrobe</h1>
        <p className="text-muted-foreground">Your digital closet of purchased items</p>
      </div>

      {wardrobeItems.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <ShirtIcon className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-serif text-xl font-semibold text-foreground mb-2">Your wardrobe is empty</h3>
          <p className="text-muted-foreground">Start shopping to build your digital closet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wardrobeItems.map((item) => (
            <Card
              key={item.id}
              className="group relative overflow-hidden bg-card border-border hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative">
                <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-64 object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
              </div>

              <div className="p-4">
                <h3 className="font-sans font-semibold text-card-foreground mb-2 line-clamp-2">{item.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">Purchased {formatDate(item.purchaseDate)}</p>

                <Button
                  variant="outline"
                  className="w-full border-border text-foreground hover:bg-muted bg-transparent"
                  onClick={() => viewProduct(item)}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
