"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, Eye } from "lucide-react"
import { useRecommendations } from "@/lib/recommendations"
import { useAnalytics } from "@/lib/analytics"
import Image from "next/image"

interface Product {
  id: string
  name: string
  price: string
  primaryImage: string
  category: string
  rating: number
}

interface RecommendationResult {
  productId: string
  score: number
  reason: string
  type: 'trending' | 'similar' | 'collaborative' | 'personalized' | 'seasonal'
}

interface ProductRecommendationsProps {
  userId?: string
  sessionId?: string
  currentProductId?: string
  category?: string
  title?: string
  maxResults?: number
  className?: string
}

export default function ProductRecommendations({
  userId,
  sessionId,
  currentProductId,
  category,
  title = "Recommended for You",
  maxResults = 6,
  className = ""
}: ProductRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { getRecommendations, trackProductView } = useRecommendations()
  const { track, trackProductView: trackAnalytics } = useAnalytics()

  useEffect(() => {
    loadRecommendations()
  }, [userId, sessionId, currentProductId, category])

  const loadRecommendations = async () => {
    try {
      setLoading(true)
      setError(null)

      const recs = await getRecommendations(userId, sessionId, {
        currentProductId,
        category,
        maxResults,
        excludeIds: currentProductId ? [currentProductId] : undefined
      })

      setRecommendations(recs)

      // Fetch product details for recommendations
      const productIds = recs.map(r => r.productId)
      const productData = await fetchProductDetails(productIds)
      setProducts(productData)

      // Track recommendation display
      track('recommendations_displayed', {
        recommendationCount: recs.length,
        types: recs.map(r => r.type),
        context: currentProductId ? 'product_page' : 'general'
      })

    } catch (err) {
      console.error('Failed to load recommendations:', err)
      setError('Failed to load recommendations')
    } finally {
      setLoading(false)
    }
  }

  const fetchProductDetails = async (productIds: string[]): Promise<Product[]> => {
    // In a real implementation, this would fetch from your API
    // For now, return mock data
    return productIds.map(id => ({
      id,
      name: `Product ${id}`,
      price: '$299',
      primaryImage: '/placeholder-product.jpg',
      category: 'Dresses',
      rating: 4.5
    }))
  }

  const handleProductClick = (product: Product, recommendation: RecommendationResult) => {
    // Track product view
    if (userId || sessionId) {
      trackProductView(userId, sessionId!, product.id)
    }

    // Track analytics
    trackAnalytics(product.id, product.name, product.category, 299)

    // Track recommendation click
    track('recommendation_clicked', {
      productId: product.id,
      recommendationType: recommendation.type,
      reason: recommendation.reason,
      score: recommendation.score,
      position: products.indexOf(product)
    })
  }

  const handleAddToWishlist = (product: Product, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    track('add_to_wishlist_from_recommendations', {
      productId: product.id,
      productName: product.name,
      source: 'recommendations'
    })

    // Add to wishlist logic would go here
  }

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    track('quick_add_from_recommendations', {
      productId: product.id,
      productName: product.name,
      source: 'recommendations'
    })

    // Quick add to cart logic would go here
  }

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="text-xl font-serif font-semibold">{title}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: maxResults }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-muted rounded-lg aspect-[3/4] mb-2"></div>
              <div className="bg-muted rounded h-4 mb-1"></div>
              <div className="bg-muted rounded h-4 w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error || products.length === 0) {
    return null
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-serif font-semibold text-foreground">
          {title}
        </h3>
        {recommendations.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Based on {recommendations[0].reason.toLowerCase()}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {products.map((product, index) => {
          const recommendation = recommendations[index]
          if (!recommendation) return null

          return (
            <Card
              key={product.id}
              className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-0 bg-card"
              onClick={() => handleProductClick(product, recommendation)}
            >
              <CardContent className="p-0">
                <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
                  <Image
                    src={product.primaryImage}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                  
                  {/* Recommendation badge */}
                  <div className="absolute top-2 left-2">
                    <span className="bg-bibiere-burgundy text-white text-xs px-2 py-1 rounded-full font-medium">
                      {recommendation.type === 'trending' && '🔥 Trending'}
                      {recommendation.type === 'similar' && '✨ Similar'}
                      {recommendation.type === 'collaborative' && '👥 Popular'}
                      {recommendation.type === 'personalized' && '💎 For You'}
                      {recommendation.type === 'seasonal' && '🍂 Seasonal'}
                    </span>
                  </div>

                  {/* Hover actions */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="bg-white/90 hover:bg-white text-foreground"
                      onClick={(e) => handleAddToWishlist(product, e)}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="bg-white/90 hover:bg-white text-foreground"
                      onClick={(e) => handleQuickAdd(product, e)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-3 space-y-1">
                  <h4 className="font-medium text-sm text-foreground line-clamp-2 group-hover:text-bibiere-burgundy transition-colors">
                    {product.name}
                  </h4>
                  <p className="text-bibiere-burgundy font-semibold text-sm">
                    {product.price}
                  </p>
                  
                  {/* Rating */}
                  <div className="flex items-center space-x-1">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`text-xs ${
                            i < Math.floor(product.rating)
                              ? 'text-bibiere-gold'
                              : 'text-muted-foreground'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({product.rating})
                    </span>
                  </div>

                  {/* Recommendation reason */}
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {recommendation.reason}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* View all recommendations button */}
      <div className="text-center pt-4">
        <Button
          variant="outline"
          onClick={() => {
            track('view_all_recommendations_clicked', {
              currentRecommendationCount: products.length,
              context: currentProductId ? 'product_page' : 'general'
            })
            // Navigate to recommendations page
          }}
        >
          <Eye className="h-4 w-4 mr-2" />
          View All Recommendations
        </Button>
      </div>
    </div>
  )
}
