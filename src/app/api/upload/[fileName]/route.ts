import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(req: NextRequest, { params }: { params: Promise<{ fileName: string }> }) {
  try {
    const { fileName } = await params;
    const filePath = path.join('/tmp/eventify-uploads', fileName);
    const content = await readFile(filePath);
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: { status: 404, message: 'File not found' } }, { status: 404 });
  }
}
