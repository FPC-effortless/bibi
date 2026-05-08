import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Mock data - in production, this would connect to a database
let newArrivals = [
  {
    id: "na-001",
    name: "Silk Charmeuse Blouse",
    price: 695,
    image: "/silk-charmeuse-blouse.png",
    category: "Tops",
    color: "Ivory",
    isNew: true,
    isFeatured: true,
    status: "active",
    arrivalDate: "2024-08-15",
    stock: 24,
    description: "Luxurious silk charmeuse blouse with pearl button details",
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

    let filteredArrivals = [...newArrivals]

    if (status && status !== 'all') {
      filteredArrivals = filteredArrivals.filter(item => item.status === status)
    }

    if (category && category !== 'all') {
      filteredArrivals = filteredArrivals.filter(item => 
        item.category.toLowerCase() === category.toLowerCase()
      )
    }

    if (featured === 'true') {
      filteredArrivals = filteredArrivals.filter(item => item.isFeatured)
    }

    return NextResponse.json({
      success: true,
      data: filteredArrivals,
      total: filteredArrivals.length
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch new arrivals' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newItem = {
      id: `na-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    newArrivals.push(newItem)

    return NextResponse.json({
      success: true,
      data: newItem,
      message: 'New arrival item created successfully'
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create new arrival item' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    const itemIndex = newArrivals.findIndex(item => item.id === id)
    
    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      )
    }

    newArrivals[itemIndex] = {
      ...newArrivals[itemIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: newArrivals[itemIndex],
      message: 'Item updated successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update item' },
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
        { success: false, error: 'Item ID is required' },
        { status: 400 }
      )
    }

    const itemIndex = newArrivals.findIndex(item => item.id === id)
    
    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      )
    }

    newArrivals.splice(itemIndex, 1)

    return NextResponse.json({
      success: true,
      message: 'Item deleted successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete item' },
      { status: 500 }
    )
  }
}
