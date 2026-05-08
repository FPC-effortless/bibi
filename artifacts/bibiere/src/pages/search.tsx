import { useState, useEffect } from "react";
import { Link, useSearch } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";

const mockProducts = [
  { id: "1", name: "Elegant Silk Evening Dress", price: 1299, originalPrice: 1599, category: "Dresses", color: "Black", material: "Silk", rating: 4.8, reviewCount: 127 },
  { id: "2", name: "Cashmere Blend Coat", price: 899, originalPrice: undefined, category: "Outerwear", color: "Camel", material: "Cashmere", rating: 4.9, reviewCount: 89 },
  { id: "3", name: "Premium Wool Blazer", price: 1599, originalPrice: undefined, category: "Blazers", color: "Navy", material: "Wool", rating: 4.7, reviewCount: 156 },
  { id: "4", name: "Silk Scarf Collection", price: 299, originalPrice: 399, category: "Accessories", color: "Multi", material: "Silk", rating: 4.6, reviewCount: 203 },
  { id: "5", name: "Luxury Quilted Handbag", price: 449, originalPrice: undefined, category: "Accessories", color: "Black", material: "Leather", rating: 4.7, reviewCount: 312 },
  { id: "6", name: "Tailored Wide Leg Trousers", price: 695, originalPrice: undefined, category: "Trousers", color: "Ivory", material: "Crepe", rating: 4.5, reviewCount: 67 },
];

const categories = ["All", "Dresses", "Outerwear", "Blazers", "Accessories", "Trousers"];
const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export default function SearchPage() {
  const searchStr = useSearch();
  const params = new URLSearchParams(searchStr);
  const [query, setQuery] = useState(params.get("q") || "");
  const [inputValue, setInputValue] = useState(params.get("q") || "");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("relevance");

  const filtered = mockProducts
    .filter((p) => {
      const matchesQuery =
        !query ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.material.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "All" || p.category === category;
      return matchesQuery && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(inputValue);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-serif font-bold mb-6">Search</h1>
          <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search for products, categories..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" className="bg-bibiere-burgundy hover:bg-bibiere-burgundy-dark text-white">
              Search
            </Button>
          </form>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={category === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setCategory(cat)}
                className={category === cat ? "bg-bibiere-burgundy text-white" : ""}
              >
                {cat}
              </Button>
            ))}
          </div>
          <div className="sm:ml-auto">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {query && (
          <p className="text-muted-foreground mb-6">
            {filtered.length} results for "{query}"
          </p>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <Search className="w-16 h-16 mx-auto text-muted-foreground" />
            <h2 className="text-xl font-serif font-semibold">No results found</h2>
            <p className="text-muted-foreground">Try a different search term or browse our collections</p>
            <Button asChild>
              <Link href="/collections">Browse Collections</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`} className="group block border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-[3/4] bg-muted flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">{product.category}</p>
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-serif font-semibold group-hover:text-bibiere-burgundy transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{product.category} · {product.material}</p>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <span>★ {product.rating}</span>
                    <span>({product.reviewCount})</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
