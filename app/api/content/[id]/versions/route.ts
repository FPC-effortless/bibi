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

    const versions = await contentManager.getContentVersions(params.id, locale);

    return NextResponse.json({
      success: true,
      data: versions,
      total: versions.length
    });
  } catch (error) {
    console.error('Error fetching content versions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch content versions' },
      { status: 500 }
    );
  }
}