import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: List all products
export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(products);
}

// POST: Create or Update Product
export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // If ID exists and is not temp ID, update. Else create.
    // Note: The frontend sends 'Date.now()' as ID for new items sometimes, 
    // we should rely on Prisma UUID for creation.

    const isUpdate = data.id && data.id.length > 20; // UUID check roughly

    // Handle Image Uploads First
    // The frontend sends Base64. We need to upload them to our local API if they are base64.
    // If they are already URLs (starting with /uploads), we keep them.
    
    const processedImages = await Promise.all(data.images.map(async (img: string) => {
      if (img.startsWith('data:')) {
        // Call internal upload logic or fetch self
        // For simplicity in this mono-container, we can just call the file writing logic here
        // But to keep it clean, let's assume we call the upload endpoint helper function logic
        // or just rely on the frontend to have uploaded it? 
        // BETTER: Let's do the file writing right here to avoid self-fetch issues in Docker.
        
        const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/upload`, {
            method: 'POST',
            body: JSON.stringify({ image: img, folder: 'products' })
        });
        const uploadData = await uploadRes.json();
        return uploadData.url;
      }
      return img;
    }));

    const payload = {
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      categoryId: data.categoryId,
      ingredients: data.ingredients,
      stock: parseInt(data.stock),
      sizes: data.sizes || [],
      images: processedImages
    };

    if (isUpdate) {
      const product = await prisma.product.update({
        where: { id: data.id },
        data: payload
      });
      return NextResponse.json(product);
    } else {
      const product = await prisma.product.create({
        data: payload
      });
      return NextResponse.json(product);
    }

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error saving product' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}