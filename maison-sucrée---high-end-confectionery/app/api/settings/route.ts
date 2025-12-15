import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  let settings = await prisma.storeSettings.findUnique({ where: { id: 'default' }});
  if (!settings) {
    settings = await prisma.storeSettings.create({ data: { id: 'default', name: 'Maison Sucrée' }});
  }
  return NextResponse.json(settings);
}

export async function POST(req: Request) {
  const data = await req.json();
  
  // Handle Logo Upload
  if (data.logoUrl && data.logoUrl.startsWith('data:')) {
     const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/upload`, {
         method: 'POST',
         body: JSON.stringify({ image: data.logoUrl, folder: 'brand' })
     });
     data.logoUrl = (await res.json()).url;
  }

  // Handle Hero Image Upload
  if (data.heroImage && data.heroImage.startsWith('data:')) {
     const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/upload`, {
         method: 'POST',
         body: JSON.stringify({ image: data.heroImage, folder: 'brand' })
     });
     data.heroImage = (await res.json()).url;
  }

  const settings = await prisma.storeSettings.upsert({
    where: { id: 'default' },
    update: { ...data },
    create: { id: 'default', ...data }
  });
  
  return NextResponse.json(settings);
}