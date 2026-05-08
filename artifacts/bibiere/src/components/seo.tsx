import { useEffect } from "react";

interface StructuredDataSchema {
  "@context": string;
  "@type": string;
  [key: string]: unknown;
}

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string | string[];
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  price?: number;
  currency?: string;
  availability?: "in stock" | "out of stock";
  brand?: string;
  category?: string;
  structuredData?: StructuredDataSchema[];
  canonical?: string;
  robots?: string;
  alternateLanguages?: Record<string, string>;
}

export function SEO({
  title = "bibiere - Timeless Luxury Redefined",
  description = "Timeless luxury redefined. Discover bibiere's collection of exquisite pieces crafted for the discerning individual.",
  keywords = "bibiere, timeless luxury, elegant fashion, sophisticated style, premium craftsmanship",
  image = "/og-image.jpg",
  url,
  type = "website",
  price,
  currency = "USD",
  availability,
  brand = "bibiere",
  category,
  structuredData = [],
  canonical,
  robots = "index, follow",
}: SEOProps) {
  const fullTitle = title.includes("bibiere") ? title : `${title} | bibiere`;
  const fullUrl = url ? `https://bibiere.com${url}` : "https://bibiere.com";
  const fullImage = image?.startsWith("http") ? image : `https://bibiere.com${image}`;
  const keywordsString = Array.isArray(keywords) ? keywords.join(", ") : keywords;
  const canonicalUrl = canonical || fullUrl;

  useEffect(() => {
    document.title = fullTitle;
    const setMeta = (name: string, content: string, attr = "name") => {
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };
    setMeta("description", description);
    setMeta("keywords", keywordsString);
    setMeta("robots", robots);
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", description, "property");
    setMeta("og:type", type, "property");
    setMeta("og:image", fullImage, "property");
    setMeta("og:url", fullUrl, "property");
    if (fullTitle) setMeta("twitter:title", fullTitle);
    if (description) setMeta("twitter:description", description);
    if (fullImage) setMeta("twitter:image", fullImage);
  }, [fullTitle, description, keywordsString, robots, type, fullUrl, fullImage]);

  return null;
}

export function ProductSEO({
  product,
  url,
}: {
  product: {
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    category?: string;
    inStock?: boolean;
    images?: { src: string; alt: string }[];
    brand?: string;
    sku?: string;
    rating?: { value: number; count: number };
  };
  url: string;
}) {
  return (
    <SEO
      title={`${product.name} - Premium Fashion`}
      description={product.description}
      image={product.images?.[0]?.src}
      url={url}
      type="product"
      price={product.price}
      availability={product.inStock !== false ? "in stock" : "out of stock"}
      category={product.category}
      brand={product.brand}
    />
  );
}

export function CategorySEO({
  category,
  description,
  url,
  productCount,
}: {
  category: string;
  description: string;
  url: string;
  productCount?: number;
}) {
  const enhancedDescription = productCount
    ? `${description} Discover ${productCount} exquisite pieces in our ${category.toLowerCase()} collection.`
    : description;

  return (
    <SEO
      title={`${category} Collection - Luxury Fashion`}
      description={enhancedDescription}
      url={url}
      type="website"
    />
  );
}

export function ArticleSEO({
  article,
  url,
}: {
  article: {
    title: string;
    description: string;
    author: string;
    datePublished: string;
    dateModified?: string;
    image?: string;
    tags?: string[];
  };
  url: string;
}) {
  return (
    <SEO
      title={article.title}
      description={article.description}
      image={article.image}
      url={url}
      type="article"
    />
  );
}

export function FAQSEO({
  title,
  description,
  url,
}: {
  title: string;
  description: string;
  url: string;
  faqs?: Array<{ question: string; answer: string }>;
}) {
  return <SEO title={title} description={description} url={url} type="website" />;
}
