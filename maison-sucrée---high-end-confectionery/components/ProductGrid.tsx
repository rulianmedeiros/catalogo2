import React, { useMemo } from 'react';
import { Product, Category } from '../types';
import { Plus } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  categories: Category[];
  selectedCategory: string;
  searchTerm: string;
  onProductClick: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, categories, selectedCategory, searchTerm, onProductClick }) => {
  
  const filteredProducts = useMemo(() => {
    let results = products;

    // Filter by Category
    if (selectedCategory !== 'all') {
      results = results.filter(p => p.categoryId === selectedCategory);
    }

    // Filter by Search Term
    if (searchTerm.trim() !== '') {
      const lowerTerm = searchTerm.toLowerCase();
      results = results.filter(p => 
        p.name.toLowerCase().includes(lowerTerm) || 
        p.description.toLowerCase().includes(lowerTerm)
      );
    }

    return results;
  }, [selectedCategory, searchTerm, products]);

  return (
    <section id="product-grid" className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl md:text-3xl font-light text-stone-900">
              {searchTerm ? `Resultados para "${searchTerm}"` : (selectedCategory === 'all' ? 'Cardápio Completo' : 'Nossa Seleção')}
            </h3>
            {searchTerm && selectedCategory !== 'all' && (
              <span className="text-sm text-stone-400">Em {selectedCategory}</span>
            )}
          </div>
          <span className="text-sm text-stone-500">
            {filteredProducts.length} produtos
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center">
            <p className="text-stone-400 text-lg mb-2">Nenhum produto encontrado.</p>
            {searchTerm && (
              <p className="text-stone-500 text-sm">Tente usar termos diferentes ou limpar a busca.</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-12">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="group cursor-pointer flex flex-col"
                onClick={() => onProductClick(product)}
              >
                {/* Image Container - Updated with rounded-2xl and shadow-md */}
                <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 mb-4 rounded-2xl shadow-md transition-shadow duration-300 group-hover:shadow-xl">
                  {product.images[0] ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-stone-200 text-stone-400">
                      Sem imagem
                    </div>
                  )}
                  {/* Stock Badge if low */}
                  {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
                     <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded">
                       Últimas Unidades
                     </span>
                  )}
                  {product.stock === 0 && (
                     <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                       <span className="bg-stone-900 text-white text-xs uppercase font-bold px-3 py-1 rounded">Esgotado</span>
                     </div>
                  )}

                  {/* Quick Add Overlay (Desktop) */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                    <button className="bg-white/90 backdrop-blur text-stone-900 px-6 py-2 text-xs uppercase tracking-widest hover:bg-white shadow-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 rounded-full">
                      Ver Detalhes
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col gap-1 px-1">
                  <h4 className="text-base font-medium text-stone-900 group-hover:text-stone-600 transition-colors">
                    {product.name}
                  </h4>
                  <div className="flex justify-between items-baseline">
                    <p className="text-stone-500 text-sm">
                      R$ {product.price.toFixed(2).replace('.', ',')}
                    </p>
                    {product.sizes && product.sizes.length > 0 && (
                      <span className="text-[10px] text-stone-400 border border-stone-200 px-1 rounded">
                        +{product.sizes.length} opções
                      </span>
                    )}
                  </div>
                   <p className="text-xs text-stone-400 mt-1">
                      {categories.find(c => c.id === product.categoryId)?.name}
                   </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};