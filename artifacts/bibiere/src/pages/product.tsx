import { useParams, Link } from "wouter";
import ProductImageGallery from "@/components/product-image-gallery";
import ProductDetails from "@/components/product-details";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const mockProduct = {
  id: "1",
  name: "Elegant Silk Evening Dress",
  price: 1299,
  originalPrice: 1599,
  description:
    "Crafted from the finest mulberry silk, this elegant evening dress embodies timeless sophistication. The fluid drape and subtle sheen create a silhouette that flatters every figure, while the hand-finished seams ensure exceptional quality and durability.",
  sizes: ["XS", "S", "M", "L", "XL"],
  colors: [
    { name: "Midnight Black", value: "#1a1a1a" },
    { name: "Deep Navy", value: "#1e3a8a" },
    { name: "Burgundy", value: "#7c2d12" },
    { name: "Emerald", value: "#065f46" },
  ],
  materials: [
    "100% Mulberry Silk",
    "Premium Cotton Lining",
    "Hand-finished Seams",
    "Hidden Zipper Closure",
  ],
  careInstructions: [
    "Dry clean only",
    "Store on padded hangers",
    "Avoid direct sunlight",
    "Steam to remove wrinkles",
  ],
  features: [
    "Timeless sophisticated design",
    "Flattering silhouette for all figures",
    "Premium quality construction",
    "Versatile for special occasions",
    "Fully lined for comfort",
  ],
  rating: 4.8,
  reviewCount: 127,
  inStock: true,
  stockCount: 8,
  images: [
    {
      id: "1",
      src: "/elegant-black-silk-dress.png",
      alt: "Elegant Silk Evening Dress - Front View",
    },
    {
      id: "2",
      src: "/elegant-black-silk-dress-back.png",
      alt: "Elegant Silk Evening Dress - Back View",
    },
    {
      id: "3",
      src: "/black-silk-dress-texture.png",
      alt: "Elegant Silk Evening Dress - Fabric Detail",
    },
    {
      id: "4",
      src: "/elegant-black-silk-dress-side.png",
      alt: "Elegant Silk Evening Dress - Side View",
    },
  ],
};

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const productId = params.id;
  const product = { ...mockProduct, id: productId || "1" };

  return (
    <main id="main-content" className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <Button variant="ghost" asChild className="mb-8">
          <Link href="/collections">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Collections
          </Link>
        </Button>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="space-y-6">
            <ProductImageGallery images={product.images} productName={product.name} />
          </div>
          <div className="space-y-8">
            <ProductDetails product={product} />
          </div>
        </div>
      </div>
    </main>
  );
}
