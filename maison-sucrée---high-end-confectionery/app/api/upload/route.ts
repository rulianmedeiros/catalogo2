import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Buffer } from 'buffer';

export async function POST(req: Request) {
  try {
    const { image, folder = 'misc' } = await req.json();

    if (!image || !image.startsWith('data:image')) {
      return NextResponse.json({ error: 'Invalid image format' }, { status: 400 });
    }

    // Extract mime type and base64 data
    const matches = image.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return NextResponse.json({ error: 'Invalid image string' }, { status: 400 });
    }

    const extension = matches[1] === 'jpeg' ? 'jpg' : matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    const filename = `${uuidv4()}.${extension}`;
    
    // Determine upload path (public/uploads/...)
    // Casting process to any to avoid "Property 'cwd' does not exist on type 'Process'" error
    const uploadDir = path.join((process as any).cwd(), 'public', 'uploads', folder);
    
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    
    // Write file to disk
    fs.writeFileSync(filePath, buffer);

    // Return the public URL
    const publicUrl = `/uploads/${folder}/${filename}`;

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}