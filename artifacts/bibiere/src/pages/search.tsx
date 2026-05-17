import { useMemo, useState } from "react";
import { Link, useSearch } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useCommerce } from "@/components/commerce-provider";
import { formatStoreCurrency } from "@/lib/currency-manager";

const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name", label: "Name" },
];

export default function SearchPage() {
  const searchStr = useSearch();
  const params = new URLSearchParams(searchStr);
  const { products } = useCommerce();
  const [query, setQuery] = useState(params.get("q") || "");
  const [inputValue, setInputValue] = useState(params.get("q") || "");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("relevance");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((product) => product.category))).sort()],
    [products],
  );

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return [...products]
      .filter((product) => {
        const matchesQuery =
          !normalizedQuery ||
          product.name.toLowerCase().includes(normalizedQuery) ||
          product.category.toLowerCase().includes(normalizedQuery) ||
          product.brand.toLowerCase().includes(normalizedQuery) ||
          product.description?.toLowerCase().includes(normalizedQuery);
        const matchesCategory = category === "All" || product.category === category;
        return matchesQuery && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return (a.sortOrder ?? 9999) - (b.sortOrder ?? 9999);
      });
  }, [category, products, query, sortBy]);

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
                <div className="aspect-[3/4] bg-muted overflow-hidden">
                  <img src={product.primaryImage || "/placeholder.svg"} alt={product.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-serif font-semibold group-hover:text-bibiere-burgundy transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{product.category} · {product.brand}</p>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{formatStoreCurrency(product.price)}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">{formatStoreCurrency(product.originalPrice)}</span>
                    )}
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
