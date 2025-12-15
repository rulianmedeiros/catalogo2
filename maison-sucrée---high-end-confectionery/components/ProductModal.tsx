import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, ChevronRight, ChevronLeft, Plus, Minus } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, selectedSize?: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onAddToCart }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isClosing, setIsClosing] = useState(false);

  // Reset state when product changes
  useEffect(() => {
    setCurrentImageIndex(0);
    setQuantity(1);
    if (product?.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    } else {
      setSelectedSize('');
    }
  }, [product]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [product]);

  if (!product) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedSize);
    handleClose();
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const isOutOfStock = product.stock === 0;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-stone-900/40 backdrop-blur-sm transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
      onClick={handleClose}
    >
      <div 
        className={`bg-stone-50 w-full h-full md:h-auto md:max-h-[90vh] md:max-w-4xl md:rounded-lg overflow-hidden flex flex-col md:flex-row shadow-2xl transition-transform duration-300 ${isClosing ? 'scale-95 translate-y-4' : 'scale-100 translate-y-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Close Button (Absolute) */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/50 backdrop-blur rounded-full md:hidden"
        >
          <X size={20} className="text-stone-900" />
        </button>

        {/* Left: Image Gallery */}
        <div className="w-full md:w-1/2 h-[40vh] md:h-[600px] relative bg-stone-100">
          <img 
            src={product.images[currentImageIndex]} 
            alt={product.name} 
            className={`w-full h-full object-cover ${isOutOfStock ? 'grayscale opacity-75' : ''}`}
          />
          
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-stone-900/80 backdrop-blur text-white px-6 py-2 text-lg font-bold uppercase tracking-widest border-2 border-white">
                Esgotado
              </span>
            </div>
          )}
          
          {product.images.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
              >
                <ChevronRight size={20} />
              </button>
              
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {product.images.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`w-2 h-2 rounded-full transition-colors ${idx === currentImageIndex ? 'bg-stone-900' : 'bg-white/60'}`} 
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right: Content */}
        <div className="w-full md:w-1/2 flex flex-col p-6 md:p-10 h-full overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-xs font-bold tracking-widest text-stone-400 uppercase mb-2 block">
                Maison Sucrée
              </span>
              <h2 className="text-3xl font-light text-stone-900 leading-tight">
                {product.name}
              </h2>
            </div>
            <button 
              onClick={handleClose}
              className="hidden md:block p-2 hover:bg-stone-100 rounded-full transition-colors"
            >
              <X size={24} className="text-stone-400" />
            </button>
          </div>

          <div className="mb-8 flex items-center gap-4">
            <span className="text-2xl font-medium text-stone-900">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
            {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
               <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full uppercase tracking-wide">
                 Apenas {product.stock} un.
               </span>
            )}
          </div>

          <div className="space-y-6 flex-1">
            <p className="text-stone-600 leading-relaxed font-light">
              {product.description}
            </p>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <span className="text-sm font-medium text-stone-900 uppercase tracking-wide mb-3 block">
                  Escolha uma opção
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded text-sm transition-all ${
                        selectedSize === size 
                          ? 'border-stone-900 bg-stone-900 text-white' 
                          : 'border-stone-200 text-stone-600 hover:border-stone-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.ingredients && (
              <div className="pt-6 border-t border-stone-100">
                <h4 className="text-sm font-semibold text-stone-900 mb-2 uppercase tracking-wide">
                  Ingredientes Principais
                </h4>
                <p className="text-sm text-stone-500">
                  {product.ingredients}
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 md:mt-auto pt-6 border-t border-stone-100">
             {/* Quantity Selector */}
             <div className="flex items-center gap-4 mb-4">
               <span className="text-sm font-medium text-stone-500 uppercase tracking-wide">Quantidade</span>
               <div className="flex items-center border border-stone-200 rounded-full">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-stone-100 rounded-full text-stone-600 disabled:opacity-50"
                    disabled={quantity <= 1 || isOutOfStock}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center text-sm font-medium text-stone-900">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-stone-100 rounded-full text-stone-600 disabled:opacity-50"
                    disabled={isOutOfStock || (product.stock !== undefined && quantity >= product.stock)}
                  >
                    <Plus size={16} />
                  </button>
               </div>
             </div>

            <button 
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full py-4 px-6 rounded-md flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-lg ${
                isOutOfStock 
                  ? 'bg-stone-300 text-stone-500 cursor-not-allowed shadow-none' 
                  : 'bg-stone-900 hover:bg-stone-800 text-white'
              }`}
            >
              <ShoppingBag size={20} />
              <span className="font-medium tracking-wide">
                {isOutOfStock ? 'Produto Indisponível' : `Adicionar à Sacola - R$ ${(product.price * quantity).toFixed(2).replace('.', ',')}`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};