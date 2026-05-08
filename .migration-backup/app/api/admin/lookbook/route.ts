import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Mock data - in production, this would connect to a database
let lookbookItems = [
  {
    id: "look-001",
    title: "Autumn Elegance",
    description: "Sophisticated layering with rich textures and warm tones for the modern woman.",
    image: "/lookbook-autumn-elegance.jpg",
    category: "seasonal",
    season: "Autumn 2024",
    occasion: null,
    tags: ["Layering", "Textures", "Warm Tones"],
    status: "published",
    isFeature: true,
    pieces: [
      { name: "Cashmere Coat", price: 2495, id: "coat-001" },
      { name: "Silk Blouse", price: 695, id: "blouse-001" },
      { name: "Tailored Trousers", price: 895, id: "trousers-001" }
    ],
    stylingTip: "Layer different textures to create visual depth while maintaining a cohesive color palette.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const season = searchParams.get('season')
    const occasion = searchParams.get('occasion')

    let filteredItems = [...lookbookItems]

    if (status && status !== 'all') {
      filteredItems = filteredItems.filter(item => item.status === status)
    }

    if (category && category !== 'all') {
      filteredItems = filteredItems.filter(item => item.category === category)
    }

    if (featured === 'true') {
      filteredItems = filteredItems.filter(item => item.isFeature)
    }

    if (season) {
      filteredItems = filteredItems.filter(item => item.season === season)
    }

    if (occasion) {
      filteredItems = filteredItems.filter(item => item.occasion === occasion)
    }

    // Sort by creation date (newest first)
    filteredItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({
      success: true,
      data: filteredItems,
      total: filteredItems.length
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch lookbook items' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Process tags if they're provided as a comma-separated string
    let tags = body.tags
    if (typeof tags === 'string') {
      tags = tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0)
    }

    const newLook = {
      id: `look-${Date.now()}`,
      ...body,
      tags,
      pieces: body.pieces || [], // Initialize with empty array if no pieces provided
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    lookbookItems.push(newLook)

    return NextResponse.json({
      success: true,
      data: newLook,
      message: 'Lookbook item created successfully'
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create lookbook item' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    const itemIndex = lookbookItems.findIndex(item => item.id === id)
    
    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Lookbook item not found' },
        { status: 404 }
      )
    }

    // Process tags if they're provided as a comma-separated string
    if (updateData.tags && typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0)
    }

    lookbookItems[itemIndex] = {
      ...lookbookItems[itemIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: lookbookItems[itemIndex],
      message: 'Lookbook item updated successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update lookbook item' },
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
        { success: false, error: 'Lookbook item ID is required' },
        { status: 400 }
      )
    }

    const itemIndex = lookbookItems.findIndex(item => item.id === id)
    
    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Lookbook item not found' },
        { status: 404 }
      )
    }

    lookbookItems.splice(itemIndex, 1)

    return NextResponse.json({
      success: true,
      message: 'Lookbook item deleted successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete lookbook item' },
      { status: 500 }
    )
  }
}

// Additional endpoint for managing lookbook pieces
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, action, pieceData } = body

    const itemIndex = lookbookItems.findIndex(item => item.id === id)
    
    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Lookbook item not found' },
        { status: 404 }
      )
    }

    const item = lookbookItems[itemIndex]

    switch (action) {
      case 'add_piece':
        item.pieces.push(pieceData)
        break
      case 'remove_piece':
        item.pieces = item.pieces.filter(piece => piece.id !== pieceData.id)
        break
      case 'update_piece':
        const pieceIndex = item.pieces.findIndex(piece => piece.id === pieceData.id)
        if (pieceIndex !== -1) {
          item.pieces[pieceIndex] = { ...item.pieces[pieceIndex], ...pieceData }
        }
        break
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }

    item.updatedAt = new Date().toISOString()
    lookbookItems[itemIndex] = item

    return NextResponse.json({
      success: true,
      data: item,
      message: `Piece ${action.replace('_', ' ')} successfully`
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update lookbook pieces' },
      { status: 500 }
    )
  }
}
