import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: { status: 401, message: 'Authentication required' } }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: { status: 400, message: 'A file is required' } }, { status: 400 });
    }

    const bytes = await (file as File).arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${(file as File).name.replace(/\s+/g, '-')}`;
    const uploadDir = '/tmp/eventify-uploads';

    await import('fs/promises').then(({ mkdir, writeFile }) => mkdir(uploadDir, { recursive: true }).then(() => writeFile(`${uploadDir}/${fileName}`, buffer)));

    return NextResponse.json({ data: { url: `/api/upload/${fileName}` } });
  } catch (error) {
    console.error('upload error:', error);
    return NextResponse.json({ error: { status: 500, message: 'Upload failed' } }, { status: 500 });
  }
}
