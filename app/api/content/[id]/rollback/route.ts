import { NextRequest, NextResponse } from 'next/server';
import { contentManager } from '@/lib/content-manager';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await contentManager.initialize();
    
    const body = await request.json();
    const { version, locale = 'en' } = body;

    if (!version || typeof version !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Version number is required' },
        { status: 400 }
      );
    }

    const rolledBackContent = await contentManager.rollbackToVersion(
      params.id,
      version,
      locale
    );

    if (!rolledBackContent) {
      return NextResponse.json(
        { success: false, error: 'Failed to rollback content' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: rolledBackContent,
      message: `Content rolled back to version ${version}`
    });
  } catch (error) {
    console.error('Error rolling back content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to rollback content' },
      { status: 500 }
    );
  }
}