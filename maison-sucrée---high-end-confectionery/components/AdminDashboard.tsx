import React, { useState } from 'react';
import { Product, StoreSettings, Category } from '../types';
import { Plus, Trash2, Edit2, Save, X, Image as ImageIcon, Box, LayoutDashboard, Settings, Link as LinkIcon, Upload, GripHorizontal } from 'lucide-react';

interface AdminDashboardProps {
  products: Product[];
  categories: Category[];
  storeSettings: StoreSettings;
  onUpdateProduct: (product: Product) => void;
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateSettings: (settings: StoreSettings) => void;
  onUpdateCategory: (category: Category) => void;
  onAddCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  categories,
  storeSettings,
  onUpdateProduct,
  onAddProduct,
  onDeleteProduct,
  onUpdateSettings,
  onUpdateCategory,
  onAddCategory,
  onDeleteCategory,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'settings'>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Settings State
  const [tempSettings, setTempSettings] = useState(storeSettings);

  const emptyProduct: Product = {
    id: '',
    name: '',
    description: '',
    price: 0,
    categoryId: 'cakes',
    images: [],
    ingredients: '',
    stock: 10,
    sizes: []
  };

  const emptyCategory: Category = {
    id: '',
    name: '',
    image: ''
  };

  // Helper to convert file to Base64
  const handleFileUpload = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // --- Product Handlers ---

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (isAddingNew) {
      onAddProduct({ ...editingProduct, id: Date.now().toString() });
    } else {
      onUpdateProduct(editingProduct);
    }
    setEditingProduct(null);
    setIsAddingNew(false);
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setIsAddingNew(false);
  };

  const startAddNew = () => {
    setEditingProduct(emptyProduct);
    setIsAddingNew(true);
  };

  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    if (!editingProduct || !e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    try {
      const base64 = await handleFileUpload(file);
      
      if (index !== undefined) {
        // Replace existing image
        const newImages = [...editingProduct.images];
        newImages[index] = base64;
        setEditingProduct({ ...editingProduct, images: newImages });
      } else {
        // Add new image
        setEditingProduct({ ...editingProduct, images: [...editingProduct.images, base64] });
      }
    } catch (err) {
      console.error("Error uploading image", err);
    }
  };

  const removeProductImage = (index: number) => {
    if (!editingProduct) return;
    const newImages = editingProduct.images.filter((_, i) => i !== index);
    setEditingProduct({ ...editingProduct, images: newImages });
  };

  // --- Category Handlers ---
  
  const startAddNewCategory = () => {
    setEditingCategory(emptyCategory);
    setIsAddingCategory(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    if (isAddingCategory) {
      // Create simple ID from name or timestamp
      const newId = editingCategory.name.toLowerCase().trim().replace(/\s+/g, '-') || Date.now().toString();
      onAddCategory({ ...editingCategory, id: newId });
    } else {
      onUpdateCategory(editingCategory);
    }
    
    setEditingCategory(null);
    setIsAddingCategory(false);
  };

  const handleCategoryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingCategory || !e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const base64 = await handleFileUpload(file);
    setEditingCategory({ ...editingCategory, image: base64 });
  };

  // --- Settings Handlers ---

  const handleSettingsImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'heroImage') => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const base64 = await handleFileUpload(file);
    setTempSettings({ ...tempSettings, [field]: base64 });
  };


  return (
    <div className="fixed inset-0 z-50 bg-stone-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-stone-900 text-white flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-stone-800">
          <h2 className="text-xl font-semibold tracking-widest uppercase">Painel Admin</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${activeTab === 'products' ? 'bg-stone-800 text-white' : 'text-stone-400 hover:bg-stone-800/50'}`}
          >
            <Box size={20} />
            Produtos
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${activeTab === 'categories' ? 'bg-stone-800 text-white' : 'text-stone-400 hover:bg-stone-800/50'}`}
          >
            <GripHorizontal size={20} />
            Categorias
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${activeTab === 'settings' ? 'bg-stone-800 text-white' : 'text-stone-400 hover:bg-stone-800/50'}`}
          >
            <Settings size={20} />
            Configurações
          </button>
        </nav>
        <div className="p-4 border-t border-stone-800">
          <button onClick={onClose} className="w-full py-2 px-4 bg-stone-800 hover:bg-stone-700 rounded text-sm text-stone-300">
            Voltar para Loja
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        
        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl mx-auto space-y-8">
            {/* General Settings */}
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-stone-900 mb-6 flex items-center gap-2">
                <Settings size={20} /> Dados da Loja
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Nome do Catálogo</label>
                  <input
                    type="text"
                    value={tempSettings.name}
                    onChange={(e) => setTempSettings({ ...tempSettings, name: e.target.value })}
                    className="w-full p-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-stone-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Logotipo</label>
                  <div className="flex gap-4 items-center">
                    <label className="flex-1 cursor-pointer">
                        <div className="w-full p-2 border border-dashed border-stone-300 rounded-md text-stone-500 text-sm hover:bg-stone-50 flex items-center justify-center gap-2">
                            <Upload size={16} /> Escolher arquivo...
                        </div>
                        <input 
                            type="file" 
                            accept="image/png, image/jpeg, image/webp" 
                            className="hidden"
                            onChange={(e) => handleSettingsImageUpload(e, 'logoUrl')} 
                        />
                    </label>
                    {tempSettings.logoUrl && (
                      <div className="w-12 h-12 bg-stone-100 rounded border border-stone-200 flex items-center justify-center overflow-hidden flex-shrink-0 relative group">
                        <img src={tempSettings.logoUrl} alt="Logo Preview" className="w-full h-full object-contain" />
                        <button onClick={() => setTempSettings({...tempSettings, logoUrl: ''})} className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white"><X size={12} /></button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Banner Settings */}
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-stone-900 mb-6 flex items-center gap-2">
                <ImageIcon size={20} /> Banner Principal
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Imagem de Fundo</label>
                   <label className="block w-full cursor-pointer mb-2">
                        <div className="w-full p-3 border border-dashed border-stone-300 rounded-md text-stone-500 text-sm hover:bg-stone-50 flex items-center justify-center gap-2">
                            <Upload size={16} /> Carregar imagem (JPEG, PNG, WebP)
                        </div>
                        <input 
                            type="file" 
                            accept="image/png, image/jpeg, image/webp" 
                            className="hidden"
                            onChange={(e) => handleSettingsImageUpload(e, 'heroImage')} 
                        />
                    </label>
                  
                  {tempSettings.heroImage && (
                    <div className="w-full h-48 bg-stone-100 rounded overflow-hidden relative group">
                       <img src={tempSettings.heroImage} className="w-full h-full object-cover" />
                       <button 
                        onClick={() => setTempSettings({...tempSettings, heroImage: ''})}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                       >
                           <Trash2 size={16} />
                       </button>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Título Principal</label>
                    <input
                      type="text"
                      value={tempSettings.heroTitle || ''}
                      onChange={(e) => setTempSettings({ ...tempSettings, heroTitle: e.target.value })}
                      placeholder="Ex: A Arte da Pâtisserie"
                      className="w-full p-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-stone-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Subtítulo</label>
                    <input
                      type="text"
                      value={tempSettings.heroSubtitle || ''}
                      onChange={(e) => setTempSettings({ ...tempSettings, heroSubtitle: e.target.value })}
                      placeholder="Ex: Coleção de Outono"
                      className="w-full p-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-stone-500 outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Texto do Botão</label>
                    <input
                      type="text"
                      value={tempSettings.heroButtonText || ''}
                      onChange={(e) => setTempSettings({ ...tempSettings, heroButtonText: e.target.value })}
                      placeholder="Ex: Ver Destaques"
                      className="w-full p-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-stone-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Link de Destino</label>
                    <div className="relative">
                      <LinkIcon size={16} className="absolute left-3 top-3 text-stone-400" />
                      <input
                        type="text"
                        value={tempSettings.heroLink || ''}
                        onChange={(e) => setTempSettings({ ...tempSettings, heroLink: e.target.value })}
                        placeholder="#product-grid ou https://..."
                        className="w-full pl-9 p-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-stone-500 outline-none"
                      />
                    </div>
                    <p className="text-[10px] text-stone-500 mt-1">Use <b>#product-grid</b> para o cardápio ou uma URL completa para sites externos.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => onUpdateSettings(tempSettings)}
                className="px-8 py-3 bg-stone-900 text-white rounded-md hover:bg-stone-800 transition-colors flex items-center gap-2 shadow-lg"
              >
                <Save size={18} /> Salvar Todas as Configurações
              </button>
            </div>
          </div>
        )}

        {/* CATEGORIES TAB */}
        {activeTab === 'categories' && (
             <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-light text-stone-900">Gerenciar Categorias</h3>
                    {!editingCategory && (
                        <button onClick={startAddNewCategory} className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-md hover:bg-stone-800 text-sm">
                            <Plus size={16} /> Nova Categoria
                        </button>
                    )}
                </div>

                {editingCategory && isAddingCategory && (
                     <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-100 mb-6">
                         <h4 className="text-sm font-semibold mb-4 text-stone-900">Nova Categoria</h4>
                         <form onSubmit={handleSaveCategory} className="flex flex-col md:flex-row gap-6">
                            <div className="w-24 flex flex-col gap-2 items-center">
                                    <div className="w-24 h-24 rounded-full overflow-hidden bg-stone-100 border border-stone-200 relative group">
                                    {editingCategory.image ? (
                                        <img src={editingCategory.image} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-stone-400">Foto</div>
                                    )}
                                    <label className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer transition-opacity">
                                        <Upload className="text-white" size={24} />
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            className="hidden" 
                                            onChange={handleCategoryImageUpload}
                                        />
                                    </label>
                                    </div>
                            </div>
                            <div className="flex-1 space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-stone-500 uppercase">Nome da Categoria</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={editingCategory.name} 
                                        onChange={e => setEditingCategory({...editingCategory, name: e.target.value})}
                                        className="w-full p-2 border border-stone-300 rounded text-sm focus:ring-1 focus:ring-stone-900 outline-none"
                                        placeholder="Ex: Bolos de Festa"
                                    />
                                </div>
                                <div className="flex gap-2 justify-end">
                                    <button type="button" onClick={() => { setEditingCategory(null); setIsAddingCategory(false); }} className="px-4 py-2 text-sm bg-stone-100 rounded text-stone-600">Cancelar</button>
                                    <button type="submit" className="px-4 py-2 text-sm bg-stone-900 text-white rounded">Criar Categoria</button>
                                </div>
                            </div>
                         </form>
                     </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {categories.filter(c => c.id !== 'all').map(category => (
                        <div key={category.id} className="bg-white p-4 rounded-lg shadow-sm border border-stone-100 flex items-start gap-4">
                            {editingCategory?.id === category.id && !isAddingCategory ? (
                                // Editing Existing
                                <form onSubmit={handleSaveCategory} className="flex-1 flex gap-4 w-full">
                                    <div className="w-20 flex flex-col gap-2 items-center">
                                         <div className="w-20 h-20 rounded-full overflow-hidden bg-stone-100 border border-stone-200 relative group">
                                            {editingCategory.image ? (
                                                <img src={editingCategory.image} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs text-stone-400">Foto</div>
                                            )}
                                            <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                                                <Upload className="text-white" size={20} />
                                                <input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    className="hidden" 
                                                    onChange={handleCategoryImageUpload}
                                                />
                                            </label>
                                         </div>
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div>
                                            <label className="text-xs font-bold text-stone-500 uppercase">Nome</label>
                                            <input 
                                                type="text" 
                                                value={editingCategory.name} 
                                                onChange={e => setEditingCategory({...editingCategory, name: e.target.value})}
                                                className="w-full p-2 border border-stone-300 rounded text-sm"
                                            />
                                        </div>
                                        <div className="flex gap-2 justify-end">
                                            <button type="button" onClick={() => setEditingCategory(null)} className="px-3 py-1 text-xs bg-stone-100 rounded">Cancelar</button>
                                            <button type="submit" className="px-3 py-1 text-xs bg-stone-900 text-white rounded">Salvar</button>
                                        </div>
                                    </div>
                                </form>
                            ) : (
                                // View Mode
                                <>
                                    <div className="w-16 h-16 rounded-full overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0">
                                        <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-stone-900">{category.name}</h4>
                                        <p className="text-xs text-stone-500 mt-1">ID: {category.id}</p>
                                    </div>
                                    <div className="flex gap-1">
                                        <button 
                                            onClick={() => { setEditingCategory(category); setIsAddingCategory(false); }}
                                            className="p-2 text-stone-400 hover:text-stone-900 transition-colors"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button 
                                            onClick={() => onDeleteCategory(category.id)}
                                            className="p-2 text-stone-400 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
             </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="max-w-5xl mx-auto">
            {!editingProduct ? (
              // Product List
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-stone-200 flex justify-between items-center">
                  <h3 className="text-xl font-light text-stone-900">Gerenciar Produtos</h3>
                  <button onClick={startAddNew} className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-md hover:bg-stone-800 text-sm">
                    <Plus size={16} /> Novo Produto
                  </button>
                </div>
                <table className="w-full text-left border-collapse">
                  <thead className="bg-stone-50 text-stone-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="p-4 font-medium">Produto</th>
                      <th className="p-4 font-medium">Categoria</th>
                      <th className="p-4 font-medium">Preço</th>
                      <th className="p-4 font-medium">Estoque</th>
                      <th className="p-4 font-medium text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {products.map(product => (
                      <tr key={product.id} className="hover:bg-stone-50 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-md bg-stone-200 overflow-hidden">
                                {product.images[0] && <img src={product.images[0]} alt="" className="w-full h-full object-cover" />}
                            </div>
                          <span className="font-medium text-stone-900">{product.name}</span>
                        </td>
                        <td className="p-4 text-stone-600">
                           {categories.find(c => c.id === product.categoryId)?.name || product.categoryId}
                        </td>
                        <td className="p-4 text-stone-600">R$ {product.price.toFixed(2)}</td>
                        <td className="p-4 text-stone-600">
                          <span className={`px-2 py-1 rounded-full text-xs ${product.stock && product.stock < 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {product.stock || 0} un
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => startEdit(product)} className="text-stone-400 hover:text-stone-900 p-1">
                            <Edit2 size={18} />
                          </button>
                          <button onClick={() => onDeleteProduct(product.id)} className="text-stone-400 hover:text-red-600 p-1">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              // Edit/Add Form
              <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-light text-stone-900">
                    {isAddingNew ? 'Adicionar Produto' : 'Editar Produto'}
                  </h3>
                  <button onClick={() => setEditingProduct(null)} className="text-stone-400 hover:text-stone-600">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Nome do Produto</label>
                      <input required type="text" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full p-2 border border-stone-300 rounded focus:ring-1 focus:ring-stone-900 outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Preço (R$)</label>
                        <input required type="number" step="0.01" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})} className="w-full p-2 border border-stone-300 rounded focus:ring-1 focus:ring-stone-900 outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Estoque</label>
                        <input required type="number" value={editingProduct.stock || 0} onChange={e => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})} className="w-full p-2 border border-stone-300 rounded focus:ring-1 focus:ring-stone-900 outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Categoria</label>
                      <select value={editingProduct.categoryId} onChange={e => setEditingProduct({...editingProduct, categoryId: e.target.value})} className="w-full p-2 border border-stone-300 rounded focus:ring-1 focus:ring-stone-900 outline-none bg-white">
                        {categories.filter(c => c.id !== 'all').map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                     <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Tamanhos (separar por vírgula)</label>
                      <input 
                        type="text" 
                        placeholder="Ex: P, M, G ou 1kg, 2kg"
                        value={editingProduct.sizes?.join(', ') || ''} 
                        onChange={e => setEditingProduct({...editingProduct, sizes: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})} 
                        className="w-full p-2 border border-stone-300 rounded focus:ring-1 focus:ring-stone-900 outline-none" 
                      />
                    </div>
                  </div>

                  {/* Description & Images */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Descrição</label>
                      <textarea rows={3} value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} className="w-full p-2 border border-stone-300 rounded focus:ring-1 focus:ring-stone-900 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Ingredientes</label>
                      <textarea rows={2} value={editingProduct.ingredients || ''} onChange={e => setEditingProduct({...editingProduct, ingredients: e.target.value})} className="w-full p-2 border border-stone-300 rounded focus:ring-1 focus:ring-stone-900 outline-none" />
                    </div>
                    
                    {/* Image Upload Section */}
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">Imagens do Produto</label>
                      <div className="grid grid-cols-3 gap-3">
                         {/* Existing Images */}
                        {editingProduct.images.map((img, idx) => (
                          <div key={idx} className="relative aspect-square rounded-md overflow-hidden bg-stone-100 group border border-stone-200">
                             <img src={img} className="w-full h-full object-cover" />
                             <button 
                                type="button" 
                                onClick={() => removeProductImage(idx)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                             >
                                 <X size={12} />
                             </button>
                          </div>
                        ))}
                        
                        {/* Add New Image Button */}
                        <label className="aspect-square rounded-md border-2 border-dashed border-stone-300 hover:bg-stone-50 flex flex-col items-center justify-center cursor-pointer text-stone-400 hover:text-stone-600 transition-colors">
                            <Upload size={24} />
                            <span className="text-[10px] mt-1 font-medium">Adicionar</span>
                            <input 
                                type="file" 
                                accept="image/png, image/jpeg, image/webp" 
                                className="hidden" 
                                onChange={(e) => handleProductImageUpload(e)}
                            />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 pt-4 border-t border-stone-100 flex justify-end gap-3">
                    <button type="button" onClick={() => setEditingProduct(null)} className="px-6 py-2 border border-stone-300 rounded text-stone-600 hover:bg-stone-50">Cancelar</button>
                    <button type="submit" className="px-6 py-2 bg-stone-900 text-white rounded hover:bg-stone-800">Salvar Produto</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};