/**
 * AI-Powered Product Recommendations System
 * Uses collaborative filtering, content-based filtering, and user behavior analysis
 */

interface Product {
  id: string
  name: string
  category: string
  subcategory?: string
  price: number
  colors: string[]
  sizes: string[]
  materials: string[]
  style: string[]
  tags: string[]
  rating: number
  reviewCount: number
  imageUrl: string
}

interface UserBehavior {
  userId?: string
  sessionId: string
  viewedProducts: string[]
  cartItems: string[]
  wishlistItems: string[]
  purchasedProducts: string[]
  searchQueries: string[]
  categoryPreferences: Record<string, number>
  priceRange: { min: number; max: number }
  colorPreferences: Record<string, number>
  stylePreferences: Record<string, number>
}

interface RecommendationResult {
  productId: string
  score: number
  reason: string
  type: 'trending' | 'similar' | 'collaborative' | 'personalized' | 'seasonal'
}

class ProductRecommendationEngine {
  private products: Product[] = []
  private userBehaviors: Map<string, UserBehavior> = new Map()
  private productSimilarities: Map<string, Map<string, number>> = new Map()
  private trendingProducts: string[] = []

  constructor() {
    this.loadProducts()
    this.calculateProductSimilarities()
    this.updateTrendingProducts()
  }

  // Main recommendation methods
  async getRecommendations(
    userId?: string,
    sessionId?: string,
    context?: {
      currentProductId?: string
      category?: string
      maxResults?: number
      excludeIds?: string[]
    }
  ): Promise<RecommendationResult[]> {
    const maxResults = context?.maxResults || 8
    const excludeIds = new Set(context?.excludeIds || [])
    
    const recommendations: RecommendationResult[] = []
    
    // Get user behavior data
    const userBehavior = this.getUserBehavior(userId, sessionId)
    
    // 1. Similar products (if viewing a specific product)
    if (context?.currentProductId) {
      const similar = await this.getSimilarProducts(context.currentProductId, 3)
      recommendations.push(...similar.filter(r => !excludeIds.has(r.productId)))
    }
    
    // 2. Personalized recommendations based on user behavior
    if (userBehavior) {
      const personalized = await this.getPersonalizedRecommendations(userBehavior, 4)
      recommendations.push(...personalized.filter(r => !excludeIds.has(r.productId)))
    }
    
    // 3. Collaborative filtering recommendations
    if (userId) {
      const collaborative = await this.getCollaborativeRecommendations(userId, 3)
      recommendations.push(...collaborative.filter(r => !excludeIds.has(r.productId)))
    }
    
    // 4. Trending products
    const trending = await this.getTrendingRecommendations(3)
    recommendations.push(...trending.filter(r => !excludeIds.has(r.productId)))
    
    // 5. Seasonal recommendations
    const seasonal = await this.getSeasonalRecommendations(2)
    recommendations.push(...seasonal.filter(r => !excludeIds.has(r.productId)))
    
    // Remove duplicates and sort by score
    const uniqueRecommendations = this.deduplicateRecommendations(recommendations)
    
    return uniqueRecommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults)
  }

  // Similar products based on content similarity
  private async getSimilarProducts(productId: string, limit: number): Promise<RecommendationResult[]> {
    const product = this.products.find(p => p.id === productId)
    if (!product) return []

    const similarities = this.productSimilarities.get(productId)
    if (!similarities) return []

    return Array.from(similarities.entries())
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
      .slice(0, limit)
      .map(([id, score]) => ({
        productId: id,
        score: score * 0.8, // Weight similar products slightly lower
        reason: 'Similar style and features',
        type: 'similar' as const
      }))
  }

  // Personalized recommendations based on user behavior
  private async getPersonalizedRecommendations(
    userBehavior: UserBehavior,
    limit: number
  ): Promise<RecommendationResult[]> {
    const recommendations: RecommendationResult[] = []
    
    // Based on category preferences
    const categoryRecs = this.getRecommendationsByCategory(userBehavior, limit / 2)
    recommendations.push(...categoryRecs)
    
    // Based on price range
    const priceRecs = this.getRecommendationsByPriceRange(userBehavior, limit / 2)
    recommendations.push(...priceRecs)
    
    // Based on color preferences
    const colorRecs = this.getRecommendationsByColor(userBehavior, limit / 2)
    recommendations.push(...colorRecs)
    
    return recommendations.slice(0, limit)
  }

  private getRecommendationsByCategory(userBehavior: UserBehavior, limit: number): RecommendationResult[] {
    const topCategories = Object.entries(userBehavior.categoryPreferences)
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
      .slice(0, 3)
      .map(([category]) => category)

    const categoryProducts = this.products
      .filter(p => topCategories.includes(p.category))
      .filter(p => !userBehavior.viewedProducts.includes(p.id))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit)

    return categoryProducts.map(product => ({
      productId: product.id,
      score: 0.7 + (userBehavior.categoryPreferences[product.category] || 0) * 0.3,
      reason: `Popular in ${product.category}`,
      type: 'personalized' as const
    }))
  }

  private getRecommendationsByPriceRange(userBehavior: UserBehavior, limit: number): RecommendationResult[] {
    const { min, max } = userBehavior.priceRange
    
    const priceRangeProducts = this.products
      .filter(p => p.price >= min && p.price <= max)
      .filter(p => !userBehavior.viewedProducts.includes(p.id))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit)

    return priceRangeProducts.map(product => ({
      productId: product.id,
      score: 0.6 + (product.rating / 5) * 0.2,
      reason: 'Within your price range',
      type: 'personalized' as const
    }))
  }

  private getRecommendationsByColor(userBehavior: UserBehavior, limit: number): RecommendationResult[] {
    const topColors = Object.entries(userBehavior.colorPreferences)
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
      .slice(0, 3)
      .map(([color]) => color)

    const colorProducts = this.products
      .filter(p => p.colors.some(color => topColors.includes(color)))
      .filter(p => !userBehavior.viewedProducts.includes(p.id))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit)

    return colorProducts.map(product => ({
      productId: product.id,
      score: 0.6 + (product.rating / 5) * 0.2,
      reason: 'Matches your color preferences',
      type: 'personalized' as const
    }))
  }

  // Collaborative filtering recommendations
  private async getCollaborativeRecommendations(userId: string, limit: number): Promise<RecommendationResult[]> {
    // Find users with similar behavior
    const similarUsers = await this.findSimilarUsers(userId)
    const recommendations: RecommendationResult[] = []
    
    for (const similarUserId of similarUsers.slice(0, 5)) {
      const similarUserBehavior = this.userBehaviors.get(similarUserId)
      if (!similarUserBehavior) continue
      
      // Get products liked by similar users
      const likedProducts = [
        ...similarUserBehavior.purchasedProducts,
        ...similarUserBehavior.wishlistItems
      ]
      
      const currentUserBehavior = this.userBehaviors.get(userId)
      const currentUserProducts = currentUserBehavior ? [
        ...currentUserBehavior.viewedProducts,
        ...currentUserBehavior.purchasedProducts,
        ...currentUserBehavior.wishlistItems
      ] : []
      
      for (const productId of likedProducts) {
        if (!currentUserProducts.includes(productId)) {
          recommendations.push({
            productId,
            score: 0.7,
            reason: 'Users with similar taste also liked this',
            type: 'collaborative'
          })
        }
      }
    }
    
    return recommendations.slice(0, limit)
  }

  private async findSimilarUsers(userId: string): Promise<string[]> {
    const userBehavior = this.userBehaviors.get(userId)
    if (!userBehavior) return []
    
    const similarities: Array<{ userId: string; score: number }> = []
    
    for (const [otherUserId, otherBehavior] of Array.from(this.userBehaviors.entries())) {
      if (otherUserId === userId) continue
      
      const similarity = this.calculateUserSimilarity(userBehavior, otherBehavior)
      if (similarity > 0.3) {
        similarities.push({ userId: otherUserId, score: similarity })
      }
    }
    
    return similarities
      .sort((a, b) => b.score - a.score)
      .map(s => s.userId)
  }

  private calculateUserSimilarity(user1: UserBehavior, user2: UserBehavior): number {
    let similarity = 0
    let factors = 0
    
    // Category preferences similarity
    const categories = new Set([
      ...Object.keys(user1.categoryPreferences),
      ...Object.keys(user2.categoryPreferences)
    ])
    
    let categoryScore = 0
    for (const category of Array.from(categories)) {
      const pref1 = user1.categoryPreferences[category] || 0
      const pref2 = user2.categoryPreferences[category] || 0
      categoryScore += 1 - Math.abs(pref1 - pref2)
    }
    similarity += categoryScore / categories.size
    factors++
    
    // Price range similarity
    const priceOverlap = Math.max(0, 
      Math.min(user1.priceRange.max, user2.priceRange.max) - 
      Math.max(user1.priceRange.min, user2.priceRange.min)
    ) / Math.max(user1.priceRange.max, user2.priceRange.max)
    
    similarity += priceOverlap
    factors++
    
    return similarity / factors
  }

  // Trending recommendations
  private async getTrendingRecommendations(limit: number): Promise<RecommendationResult[]> {
    return this.trendingProducts
      .slice(0, limit)
      .map(productId => ({
        productId,
        score: 0.8,
        reason: 'Trending now',
        type: 'trending' as const
      }))
  }

  // Seasonal recommendations
  private async getSeasonalRecommendations(limit: number): Promise<RecommendationResult[]> {
    const season = this.getCurrentSeason()
    const seasonalTags = this.getSeasonalTags(season)
    
    const seasonalProducts = this.products
      .filter(p => p.tags.some(tag => seasonalTags.includes(tag)))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit)
    
    return seasonalProducts.map(product => ({
      productId: product.id,
      score: 0.6 + (product.rating / 5) * 0.2,
      reason: `Perfect for ${season}`,
      type: 'seasonal' as const
    }))
  }

  // Utility methods
  private calculateProductSimilarities() {
    for (const product1 of this.products) {
      const similarities = new Map<string, number>()
      
      for (const product2 of this.products) {
        if (product1.id === product2.id) continue
        
        const similarity = this.calculateProductSimilarity(product1, product2)
        if (similarity > 0.3) {
          similarities.set(product2.id, similarity)
        }
      }
      
      this.productSimilarities.set(product1.id, similarities)
    }
  }

  private calculateProductSimilarity(product1: Product, product2: Product): number {
    let similarity = 0
    let factors = 0
    
    // Category similarity
    if (product1.category === product2.category) {
      similarity += 0.4
      if (product1.subcategory === product2.subcategory) {
        similarity += 0.2
      }
    }
    factors++
    
    // Price similarity (normalized)
    const priceDiff = Math.abs(product1.price - product2.price)
    const maxPrice = Math.max(product1.price, product2.price)
    const priceScore = 1 - (priceDiff / maxPrice)
    similarity += priceScore * 0.2
    factors++
    
    // Style similarity
    const commonStyles = product1.style.filter(s => product2.style.includes(s))
    const styleScore = commonStyles.length / Math.max(product1.style.length, product2.style.length)
    similarity += styleScore * 0.3
    factors++
    
    // Color similarity
    const commonColors = product1.colors.filter(c => product2.colors.includes(c))
    const colorScore = commonColors.length / Math.max(product1.colors.length, product2.colors.length)
    similarity += colorScore * 0.1
    factors++
    
    return similarity / factors
  }

  private getUserBehavior(userId?: string, sessionId?: string): UserBehavior | null {
    if (userId && this.userBehaviors.has(userId)) {
      return this.userBehaviors.get(userId)!
    }
    
    if (sessionId && this.userBehaviors.has(sessionId)) {
      return this.userBehaviors.get(sessionId)!
    }
    
    return null
  }

  private deduplicateRecommendations(recommendations: RecommendationResult[]): RecommendationResult[] {
    const seen = new Set<string>()
    const unique: RecommendationResult[] = []
    
    for (const rec of recommendations) {
      if (!seen.has(rec.productId)) {
        seen.add(rec.productId)
        unique.push(rec)
      }
    }
    
    return unique
  }

  private getCurrentSeason(): string {
    const month = new Date().getMonth()
    if (month >= 2 && month <= 4) return 'spring'
    if (month >= 5 && month <= 7) return 'summer'
    if (month >= 8 && month <= 10) return 'fall'
    return 'winter'
  }

  private getSeasonalTags(season: string): string[] {
    const seasonalTags = {
      spring: ['light', 'floral', 'pastel', 'cotton', 'breathable'],
      summer: ['lightweight', 'sleeveless', 'bright', 'linen', 'shorts'],
      fall: ['warm', 'layering', 'wool', 'boots', 'cozy'],
      winter: ['heavy', 'insulated', 'dark', 'cashmere', 'coat']
    }
    
    return seasonalTags[season as keyof typeof seasonalTags] || []
  }

  private loadProducts() {
    // In a real implementation, this would load from a database
    // For now, we'll use mock data
    this.products = [
      // Mock products would be loaded here
    ]
  }

  private updateTrendingProducts() {
    // In a real implementation, this would analyze recent sales, views, etc.
    // For now, we'll use mock trending data
    this.trendingProducts = [
      // Mock trending product IDs would be here
    ]
  }

  // Public methods for updating user behavior
  updateUserBehavior(userId: string | undefined, sessionId: string, behavior: Partial<UserBehavior>) {
    const key = userId || sessionId
    const existing = this.userBehaviors.get(key) || {
      userId,
      sessionId,
      viewedProducts: [],
      cartItems: [],
      wishlistItems: [],
      purchasedProducts: [],
      searchQueries: [],
      categoryPreferences: {},
      priceRange: { min: 0, max: 1000 },
      colorPreferences: {},
      stylePreferences: {}
    }
    
    this.userBehaviors.set(key, { ...existing, ...behavior })
  }

  trackProductView(userId: string | undefined, sessionId: string, productId: string) {
    const product = this.products.find(p => p.id === productId)
    if (!product) return
    
    const key = userId || sessionId
    const behavior = this.userBehaviors.get(key) || {
      userId,
      sessionId,
      viewedProducts: [],
      cartItems: [],
      wishlistItems: [],
      purchasedProducts: [],
      searchQueries: [],
      categoryPreferences: {},
      priceRange: { min: 0, max: 1000 },
      colorPreferences: {},
      stylePreferences: {}
    }
    
    // Update viewed products
    if (!behavior.viewedProducts.includes(productId)) {
      behavior.viewedProducts.push(productId)
    }
    
    // Update category preferences
    behavior.categoryPreferences[product.category] = (behavior.categoryPreferences[product.category] || 0) + 1
    
    // Update price range
    behavior.priceRange.min = Math.min(behavior.priceRange.min, product.price * 0.5)
    behavior.priceRange.max = Math.max(behavior.priceRange.max, product.price * 2)
    
    // Update color preferences
    for (const color of product.colors) {
      behavior.colorPreferences[color] = (behavior.colorPreferences[color] || 0) + 1
    }
    
    this.userBehaviors.set(key, behavior)
  }
}

// Create singleton instance
export const recommendationEngine = new ProductRecommendationEngine()

// React hook for recommendations
export function useRecommendations() {
  return {
    getRecommendations: recommendationEngine.getRecommendations.bind(recommendationEngine),
    trackProductView: recommendationEngine.trackProductView.bind(recommendationEngine),
    updateUserBehavior: recommendationEngine.updateUserBehavior.bind(recommendationEngine)
  }
}
