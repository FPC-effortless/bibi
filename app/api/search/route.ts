import { NextRequest, NextResponse } from 'next/server'
import { withSecurity, apiSchemas } from '@/lib/api-security'

// Search products with validation and sanitization
export const GET = withSecurity(
  async (request: NextRequest) => {
    try {
      const { searchParams } = request.nextUrl
      
      // Extract and validate search parameters
      const searchData = {
        query: searchParams.get('query') || '',
        category: searchParams.get('category') || undefined,
        minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
        maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
        sortBy: searchParams.get('sortBy') || 'relevance',
        page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
        limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20
      }
      
      // Validate search parameters
      const validation = apiSchemas.search.safeParse(searchData)
      if (!validation.success) {
        return NextResponse.json({
          success: false,
          error: 'Invalid search parameters',
          details: validation.error.issues
        }, { status: 400 })
      }
      
      const validatedData = validation.data
      
      // Simulate search processing
      console.log('Processing search:', {
        query: validatedData.query,
        category: validatedData.category,
        priceRange: validatedData.minPrice || validatedData.maxPrice ? 
          `${validatedData.minPrice || 0} - ${validatedData.maxPrice || 'unlimited'}` : 'any',
        sortBy: validatedData.sortBy,
        page: validatedData.page,
        limit: validatedData.limit
      })
      
      // Simulate search results
      const mockResults = {
        query: validatedData.query,
        totalResults: 42,
        page: validatedData.page,
        limit: validatedData.limit,
        totalPages: Math.ceil(42 / (validatedData.limit || 20)),
        products: [
          {
            id: 'prod_1',
            name: 'Elegant Evening Dress',
            price: 299.99,
            category: 'evening',
            image: '/images/dress-1.jpg',
            rating: 4.8
          },
          {
            id: 'prod_2',
            name: 'Classic Silk Blouse',
            price: 149.99,
            category: 'essentials',
            image: '/images/blouse-1.jpg',
            rating: 4.6
          }
        ],
        filters: {
          categories: ['evening', 'essentials', 'accessories'],
          priceRanges: [
            { min: 0, max: 100, count: 12 },
            { min: 100, max: 300, count: 25 },
            { min: 300, max: 1000, count: 5 }
          ]
        }
      }
      
      return NextResponse.json({
        success: true,
        ...mockResults
      })
      
    } catch (error) {
      console.error('Search error:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Search failed. Please try again.' 
        },
        { status: 500 }
      )
    }
  },
  {
    requireCSRF: false, // GET requests don't need CSRF
    rateLimit: {
      maxRequests: 100, // 100 searches
      windowMs: 15 * 60 * 1000 // per 15 minutes
    }
  }
)

export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 200 })
  response.headers.set('Allow', 'GET, OPTIONS')
  return response
}