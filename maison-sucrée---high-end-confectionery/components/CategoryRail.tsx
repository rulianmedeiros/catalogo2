import React from 'react';
import { Category } from '../types';

interface CategoryRailProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

export const CategoryRail: React.FC<CategoryRailProps> = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="w-full py-8 border-b border-stone-200 bg-stone-50">
      <div className="max-w-7xl mx-auto">
        {/* Added justify-center to center the items */}
        <div className="flex justify-center overflow-x-auto no-scrollbar gap-6 px-4 md:px-8 pb-2 snap-x">
          {categories.map((category) => {
            const isSelected = selectedCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className="flex flex-col items-center gap-3 min-w-[80px] snap-start group cursor-pointer focus:outline-none"
              >
                <div 
                  className={`
                    w-16 h-16 md:w-20 md:h-20 rounded-full p-[2px] transition-all duration-300
                    ${isSelected 
                      ? 'bg-gradient-to-tr from-stone-400 to-stone-900 shadow-md transform scale-105' 
                      : 'bg-transparent group-hover:bg-stone-200'
                    }
                  `}
                >
                  <div className="w-full h-full rounded-full border-2 border-stone-50 overflow-hidden shadow-sm relative bg-stone-200">
                    {category.image ? (
                      <img 
                        src={category.image} 
                        alt={category.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-stone-400">
                        Foto
                      </div>
                    )}
                  </div>
                </div>
                <span 
                  className={`
                    text-xs font-medium tracking-wide transition-colors
                    ${isSelected ? 'text-stone-900' : 'text-stone-500 group-hover:text-stone-700'}
                  `}
                >
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};