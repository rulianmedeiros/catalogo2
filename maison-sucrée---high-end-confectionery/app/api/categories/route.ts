import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    let imageUrl = data.image;
    if (imageUrl && imageUrl.startsWith('data:')) {
        const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/upload`, {
            method: 'POST',
            body: JSON.stringify({ image: imageUrl, folder: 'categories' })
        });
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
    }

    // Upsert logic for categories
    // If ID is 'all' or exists, update, else create
    if (data.id && data.id !== 'all' && await prisma.category.findUnique({ where: { id: data.id }})) {
        const cat = await prisma.category.update({
            where: { id: data.id },
            data: { name: data.name, image: imageUrl }
        });
        return NextResponse.json(cat);
    } else {
        // Create
        const cat = await prisma.category.create({
            data: { name: data.name, image: imageUrl }
        });
        return NextResponse.json(cat);
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error saving category' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (id && id !== 'all') {
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
}