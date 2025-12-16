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
export async function POST(req) {
  try {
    const data = await req.json();
    
    // If ID exists and is not temp ID, update. Else create.
    const isUpdate = data.id && data.id.length > 20; // UUID check roughly

    // --- CORREÇÃO DE INGREDIENTES AQUI ---
    // O banco espera String[] (Lista), mas o form pode mandar String (Texto)
    let finalIngredients = [];
    
    if (typeof data.ingredients === 'string') {
      // Se vier texto "Trigo, Ovo", separa nas vírgulas e remove espaços
      if (data.ingredients.trim() !== '') {
        finalIngredients = data.ingredients.split(',').map(i => i.trim());
      }
    } else if (Array.isArray(data.ingredients)) {
      // Se já vier lista, mantém
      finalIngredients = data.ingredients;
    }
    // -------------------------------------

    // Handle Image Uploads First
    const processedImages = await Promise.all(data.images.map(async (img) => {
      if (img.startsWith('data:')) {
        // Usa o IP da VPS ou localhost se não tiver definido
        const apiUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        
        const uploadRes = await fetch(`${apiUrl}/api/upload`, {
            method: 'POST',
            body: JSON.stringify({ image: img, folder: 'products' })
        });
        
        if (!uploadRes.ok) {
            console.error("Falha no upload interno da imagem");
            return img; // Retorna original se falhar para não quebrar tudo
        }

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
      ingredients: finalIngredients, // <--- Usando a variável corrigida
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
    console.error("Erro ao salvar produto:", error);
    // Retorna o erro exato para o navegador para facilitar o debug
    return NextResponse.json({ error: 'Error saving product', details: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
