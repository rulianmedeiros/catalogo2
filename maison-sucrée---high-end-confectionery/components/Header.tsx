import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { StoreSettings } from '../types';

interface HeaderProps {
  storeSettings: StoreSettings;
  onOpenCart: () => void;
  cartItemCount: number;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  storeSettings,
  onOpenCart, 
  cartItemCount,
  searchTerm,
  onSearchChange
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      onSearchChange(''); // Clear search on close
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-stone-50/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 relative">
          
          {/* Left: Mobile Menu */}
          <div className="flex items-center gap-4 z-10">
            <button className="p-2 -ml-2 hover:bg-stone-100 rounded-full md:hidden text-stone-600">
              <Menu size={24} />
            </button>
          </div>

          {/* Center: Logo (Hidden when mobile search is active) */}
          <div className={`flex-1 flex justify-center absolute inset-0 items-center pointer-events-none transition-opacity duration-300 ${isSearchOpen ? 'opacity-0 md:opacity-100' : 'opacity-100'}`}>
            <div className="pointer-events-auto">
              {storeSettings.logoUrl ? (
                <img src={storeSettings.logoUrl} alt={storeSettings.name} className="h-10 md:h-12 object-contain" />
              ) : (
                <h1 className="text-xl md:text-2xl font-semibold tracking-widest text-stone-900 uppercase">
                  {storeSettings.name}
                </h1>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 md:gap-4 z-10 ml-auto bg-stone-50/90 md:bg-transparent pl-4">
            
            {/* Search Bar */}
            <div className={`flex items-center transition-all duration-300 ${isSearchOpen ? 'w-full absolute left-0 top-0 h-16 bg-stone-50 md:static md:w-64 md:h-auto md:bg-transparent px-4 md:px-0' : 'w-auto'}`}>
              {isSearchOpen ? (
                <div className="flex items-center w-full relative">
                   <Search size={18} className="absolute left-3 text-stone-500" />
                   <input 
                    type="text" 
                    placeholder="Buscar..." 
                    className="w-full pl-10 pr-4 py-2 bg-stone-100 border-none rounded-full text-sm focus:ring-1 focus:ring-stone-300 outline-none text-stone-900 placeholder-stone-500"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    autoFocus
                   />
                   <button onClick={toggleSearch} className="ml-2 p-2 text-stone-500 hover:text-stone-800">
                     <X size={20} />
                   </button>
                </div>
              ) : (
                <button 
                  onClick={toggleSearch}
                  className="p-2 hover:bg-stone-100 rounded-full text-stone-500 transition-colors"
                >
                  <Search size={20} />
                </button>
              )}
            </div>

            {/* Cart Button */}
            {!isSearchOpen && (
              <button 
                onClick={onOpenCart}
                className="p-2 -mr-2 hover:bg-stone-100 rounded-full text-stone-800 transition-colors relative"
              >
                <ShoppingBag size={20} />
                {cartItemCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-stone-900 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};