import { NextRequest, NextResponse } from 'next/server';nn// Force dynamic renderingnexport const dynamic = 'force-dynamic';
import { contentManager, ContentItem } from '@/lib/content-manager';

export async function GET(request: NextRequest) {
  try {
    await contentManager.initialize();
    
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    const type = searchParams.get('type') as ContentItem['type'] | null;
    const query = searchParams.get('q');

    let content: ContentItem[];

    if (query) {
      content = await contentManager.searchContent(query, locale);
    } else if (type) {
      content = await contentManager.getContentByType(type, locale);
    } else {
      content = await contentManager.getAllContent(locale);
    }

    return NextResponse.json({
      success: true,
      data: content,
      total: content.length
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await contentManager.initialize();
    
    const body = await request.json();
    const { content } = body;

    if (!content || !content.id || !content.title || !content.type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: id, title, type' },
        { status: 400 }
      );
    }

    const newContent = await contentManager.createContent(content);

    return NextResponse.json({
      success: true,
      data: newContent
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create content' },
      { status: 500 }
    );
  }
}