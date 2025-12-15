'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { CategoryRail } from '@/components/CategoryRail';
import { ProductGrid } from '@/components/ProductGrid';
import { ProductModal } from '@/components/ProductModal';
import { CartSidebar } from '@/components/CartSidebar';
import { AdminDashboard } from '@/components/AdminDashboard';
import { Product, CartItem, StoreSettings, Category } from '@/types';
import { Lock, ArrowRight, Loader2 } from 'lucide-react';

const ADMIN_PIN = "1234"; 

export default function Home() {
  // Global State
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginPin, setLoginPin] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    name: 'Maison Sucrée',
    logoUrl: '',
    heroImage: '',
    heroTitle: 'Carregando...',
    heroSubtitle: '',
    heroButtonText: '',
    heroLink: ''
  });

  // Fetch Data on Mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, catRes, setRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
        fetch('/api/settings')
      ]);

      const prods = await prodRes.json();
      const cats = await catRes.json();
      const settings = await setRes.json();

      setProducts(prods);
      
      // Ensure 'all' category exists for UI logic
      const hasAll = cats.find((c: Category) => c.id === 'all');
      if (!hasAll) {
         setCategories([{ id: 'all', name: 'Todos', image: '' }, ...cats]);
      } else {
         setCategories(cats);
      }
      
      setStoreSettings(settings);
    } catch (e) {
      console.error("Failed to fetch data", e);
    } finally {
      setIsLoading(false);
    }
  };

  // Storefront State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // --- Storefront Handlers ---

  const handleProductClick = (product: Product) => setActiveProduct(product);
  const handleCloseModal = () => setActiveProduct(null);

  const handleAddToCart = (product: Product, quantity: number, selectedSize?: string) => {
    setCartItems(prev => {
      const existingItemIndex = prev.findIndex(item => item.id === product.id && item.selectedSize === selectedSize);
      if (existingItemIndex > -1) {
        const newItems = [...prev];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      }
      return [...prev, { ...product, quantity, selectedSize }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === productId) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const handleHeroCta = () => {
    setSelectedCategory('all');
    document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  // --- Admin Handlers (Now connecting to API) ---

  const handleSecretAdminTrigger = () => {
    if (isAdminMode) return;
    setShowLoginModal(true);
    setLoginError(false);
    setLoginPin('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginPin === ADMIN_PIN) {
      setIsAdminMode(true);
      setShowLoginModal(false);
    } else {
      setLoginError(true);
    }
  };

  const handleAddProduct = async (newProduct: Product) => {
    await fetch('/api/products', { method: 'POST', body: JSON.stringify(newProduct) });
    fetchData(); // Refresh data
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    await fetch('/api/products', { method: 'POST', body: JSON.stringify(updatedProduct) });
    fetchData();
  };

  const handleDeleteProduct = async (id: string) => {
    await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
    fetchData();
  };

  const handleUpdateCategory = async (updatedCategory: Category) => {
    await fetch('/api/categories', { method: 'POST', body: JSON.stringify(updatedCategory) });
    fetchData();
  };

  const handleAddCategory = async (newCategory: Category) => {
    await fetch('/api/categories', { method: 'POST', body: JSON.stringify(newCategory) });
    fetchData();
  };

  const handleDeleteCategory = async (id: string) => {
    if (id === 'all') return;
    await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
    fetchData();
    if (selectedCategory === id) setSelectedCategory('all');
  };

  const handleUpdateSettings = async (newSettings: StoreSettings) => {
    await fetch('/api/settings', { method: 'POST', body: JSON.stringify(newSettings) });
    fetchData();
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-stone-50"><Loader2 className="animate-spin text-stone-400" size={40} /></div>
  }

  return (
    <div className="min-h-screen flex flex-col relative bg-stone-50">
      
      {isAdminMode ? (
        <AdminDashboard 
          products={products}
          categories={categories}
          storeSettings={storeSettings}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onUpdateCategory={handleUpdateCategory}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
          onUpdateSettings={handleUpdateSettings}
          onClose={() => setIsAdminMode(false)}
        />
      ) : (
        <>
          <Header 
            storeSettings={storeSettings}
            onOpenCart={() => setIsCartOpen(true)}
            cartItemCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          
          <main className="flex-1">
            <Hero settings={storeSettings} onDefaultCta={handleHeroCta} />
            <CategoryRail categories={categories} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
            <ProductGrid products={products} categories={categories} selectedCategory={selectedCategory} searchTerm={searchTerm} onProductClick={handleProductClick} />
          </main>

          <footer className="bg-stone-100 py-12 border-t border-stone-200">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <h2 className="text-xl font-semibold tracking-widest text-stone-900 uppercase mb-4">{storeSettings.name}</h2>
              <p onClick={handleSecretAdminTrigger} className="text-stone-500 text-sm mb-6 cursor-default hover:text-stone-600 transition-colors select-none" title="">
                &copy; {new Date().getFullYear()} Todos os direitos reservados.
              </p>
            </div>
          </footer>

          <ProductModal product={activeProduct} onClose={handleCloseModal} onAddToCart={handleAddToCart} />

          <CartSidebar 
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
          />

          {showLoginModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4">
              <div className="bg-white rounded-lg p-8 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="text-center mb-6">
                  <div className="mx-auto w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mb-4"><Lock className="text-stone-900" size={24} /></div>
                  <h3 className="text-lg font-medium text-stone-900">Acesso Restrito</h3>
                </div>
                <form onSubmit={handleLoginSubmit}>
                  <input type="password" autoFocus value={loginPin} onChange={(e) => setLoginPin(e.target.value)} placeholder="PIN" className="w-full text-center text-2xl tracking-widest p-3 border border-stone-200 rounded-md focus:ring-2 focus:ring-stone-900 outline-none mb-4" maxLength={6} />
                  {loginError && <p className="text-red-500 text-xs text-center mb-4">Senha incorreta.</p>}
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setShowLoginModal(false)} className="flex-1 py-3 text-stone-500 hover:bg-stone-50 rounded-md text-sm font-medium">Cancelar</button>
                    <button type="submit" className="flex-1 py-3 bg-stone-900 text-white rounded-md text-sm font-medium hover:bg-stone-800 flex items-center justify-center gap-2">Entrar <ArrowRight size={16} /></button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}