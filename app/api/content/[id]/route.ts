import { NextRequest, NextResponse } from 'next/server';nn// Force dynamic renderingnexport const dynamic = 'force-dynamic';
import { contentManager } from '@/lib/content-manager';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await contentManager.initialize();
    
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';

    const content = await contentManager.getContent(params.id, locale);

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Content not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await contentManager.initialize();
    
    const body = await request.json();
    const { updates, author = 'system', changeLog = 'Content updated' } = body;

    if (!updates) {
      return NextResponse.json(
        { success: false, error: 'No updates provided' },
        { status: 400 }
      );
    }

    const updatedContent = await contentManager.updateContent(
      params.id,
      updates,
      author,
      changeLog
    );

    return NextResponse.json({
      success: true,
      data: updatedContent
    });
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update content' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await contentManager.initialize();
    
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';

    const success = await contentManager.deleteContent(params.id, locale);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Content not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Content archived successfully'
    });
  } catch (error) {
    console.error('Error deleting content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete content' },
      { status: 500 }
    );
  }
}