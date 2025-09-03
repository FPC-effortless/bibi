import { NextRequest, NextResponse } from 'next/server'

// Mock data - in production, this would connect to a database
let collections = [
  {
    id: "col-001",
    name: "New Arrivals",
    description: "Discover our latest collection of carefully curated luxury pieces",
    href: "/collections/new-arrivals",
    slug: "new-arrivals",
    image: "/new-arrivals-collection.jpg",
    status: "active",
    productCount: 24,
    isVisible: true,
    isFeatured: false,
    sortOrder: 1,
    metaTitle: "New Arrivals - Latest Luxury Fashion | bibiere",
    metaDescription: "Discover bibiere's newest collection of luxury fashion pieces. Fresh designs that embody timeless elegance and sophisticated craftsmanship.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const visible = searchParams.get('visible')
    const featured = searchParams.get('featured')

    let filteredCollections = [...collections]

    if (status && status !== 'all') {
      filteredCollections = filteredCollections.filter(collection => collection.status === status)
    }

    if (visible === 'true') {
      filteredCollections = filteredCollections.filter(collection => collection.isVisible)
    }

    if (featured === 'true') {
      filteredCollections = filteredCollections.filter(collection => collection.isFeatured)
    }

    // Sort by sortOrder
    filteredCollections.sort((a, b) => a.sortOrder - b.sortOrder)

    return NextResponse.json({
      success: true,
      data: filteredCollections,
      total: filteredCollections.length
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch collections' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Generate slug from name if not provided
    const slug = body.slug || body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    
    // Check if slug already exists
    const existingCollection = collections.find(c => c.slug === slug)
    if (existingCollection) {
      return NextResponse.json(
        { success: false, error: 'Collection with this slug already exists' },
        { status: 400 }
      )
    }

    const newCollection = {
      id: `col-${Date.now()}`,
      ...body,
      slug,
      href: `/collections/${slug}`,
      productCount: 0, // Start with 0 products
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    collections.push(newCollection)

    return NextResponse.json({
      success: true,
      data: newCollection,
      message: 'Collection created successfully'
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create collection' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    const collectionIndex = collections.findIndex(collection => collection.id === id)
    
    if (collectionIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Collection not found' },
        { status: 404 }
      )
    }

    // If updating slug, check for conflicts
    if (updateData.slug) {
      const existingCollection = collections.find(c => c.slug === updateData.slug && c.id !== id)
      if (existingCollection) {
        return NextResponse.json(
          { success: false, error: 'Collection with this slug already exists' },
          { status: 400 }
        )
      }
      updateData.href = `/collections/${updateData.slug}`
    }

    collections[collectionIndex] = {
      ...collections[collectionIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: collections[collectionIndex],
      message: 'Collection updated successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update collection' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Collection ID is required' },
        { status: 400 }
      )
    }

    const collectionIndex = collections.findIndex(collection => collection.id === id)
    
    if (collectionIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Collection not found' },
        { status: 404 }
      )
    }

    // Check if collection has products (in production, you'd check the database)
    const collection = collections[collectionIndex]
    if (collection.productCount > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete collection with products. Move products first.' },
        { status: 400 }
      )
    }

    collections.splice(collectionIndex, 1)

    return NextResponse.json({
      success: true,
      message: 'Collection deleted successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete collection' },
      { status: 500 }
    )
  }
}
