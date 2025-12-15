import React from 'react';
import { StoreSettings } from '../types';

interface HeroProps {
  settings: StoreSettings;
  onDefaultCta: () => void;
}

export const Hero: React.FC<HeroProps> = ({ settings, onDefaultCta }) => {
  
  const handleCtaClick = () => {
    const link = settings.heroLink || '#product-grid';

    if (link.startsWith('#')) {
      // If it's the default grid anchor, use the passed handler or find element
      if (link === '#product-grid') {
        onDefaultCta();
      } else {
        const element = document.querySelector(link);
        element?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // External link (e.g., WhatsApp)
      window.open(link, '_blank');
    }
  };

  return (
    <div className="w-full bg-stone-100 overflow-hidden relative h-[400px] md:h-[500px]">
      <img
        src={settings.heroImage || "https://picsum.photos/id/292/1920/1080"}
        alt="Banner Principal"
        className="w-full h-full object-cover opacity-90 transition-opacity duration-500"
      />
      <div className="absolute inset-0 bg-black/20 flex flex-col justify-center items-center text-center p-6">
        <span className="text-white/90 text-sm md:text-base tracking-[0.2em] uppercase mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {settings.heroSubtitle || "Coleção de Outono"}
        </span>
        <h2 className="text-4xl md:text-6xl text-white font-light tracking-tight mb-6 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          {settings.heroTitle || "A Arte da Pâtisserie Francesa"}
        </h2>
        <button 
          onClick={handleCtaClick}
          className="px-8 py-3 bg-white text-stone-900 text-sm tracking-widest uppercase hover:bg-stone-100 transition-colors duration-300 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300"
        >
          {settings.heroButtonText || "Ver Destaques"}
        </button>
      </div>
    </div>
  );
};