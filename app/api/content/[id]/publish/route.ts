import { NextRequest, NextResponse } from 'next/server';nn// Force dynamic renderingnexport const dynamic = 'force-dynamic';
import { contentManager } from '@/lib/content-manager';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await contentManager.initialize();
    
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';

    const publishedContent = await contentManager.publishContent(params.id, locale);

    if (!publishedContent) {
      return NextResponse.json(
        { success: false, error: 'Content not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: publishedContent,
      message: 'Content published successfully'
    });
  } catch (error) {
    console.error('Error publishing content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to publish content' },
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

    const unpublishedContent = await contentManager.unpublishContent(params.id, locale);

    if (!unpublishedContent) {
      return NextResponse.json(
        { success: false, error: 'Content not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: unpublishedContent,
      message: 'Content unpublished successfully'
    });
  } catch (error) {
    console.error('Error unpublishing content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to unpublish content' },
      { status: 500 }
    );
  }
}