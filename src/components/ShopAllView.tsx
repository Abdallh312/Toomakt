import React, { useState } from 'react';
import { Search, Sparkles, Plus, Check, Eye, Sun, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FLAVOR_VAULT_PRODUCTS } from '../data/toomaktData';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { CustomBoxBuilderSection } from './CustomBoxBuilderSection';

interface ShopAllViewProps {
  onSelectProduct: (p: Product) => void;
  initialCategory?: string;
}

export const ShopAllView: React.FC<ShopAllViewProps> = ({ onSelectProduct }) => {
  const { addToCart } = useCart();
  const { isRtl } = useLanguage();
  const [selectedTag, setSelectedTag] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const filterTags = ['ALL', 'CHEWY', 'BRIGHT', 'BUTTERY', 'GIFTABLY'];

  const allProducts = FLAVOR_VAULT_PRODUCTS;

  const filteredProducts = allProducts.filter(p => {
    // Search query match
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const match =
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.fruitNotes.some(n => n.toLowerCase().includes(q));
      if (!match) return false;
    }

    // Tag match
    if (selectedTag === 'ALL') return true;
    if (selectedTag === 'CHEWY') return p.category === 'chewy' || (p.tags && p.tags.includes('CHEWY'));
    if (selectedTag === 'BRIGHT') return p.category === 'bright' || (p.tags && p.tags.includes('BRIGHT'));
    if (selectedTag === 'BUTTERY') return p.category === 'buttery' || (p.tags && p.tags.includes('BUTTERY'));
    if (selectedTag === 'GIFTABLY') return p.category === 'giftably' || (p.tags && p.tags.includes('GIFTABLY'));

    return true;
  });

  const handleQuickAdd = (p: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(p, 1);
    setJustAddedId(p.id);
    setTimeout(() => setJustAddedId(null), 1500);
  };

  return (
    <div className="bg-[#F5EFE6] text-[#1F1127] min-h-screen">
      
      {/* Header with Weather Graphic (Figma Frame 4) */}
      <section className="relative pt-12 sm:pt-16 pb-12 px-4 sm:px-6 lg:px-8 border-b-2 border-[#1F1127] overflow-hidden bg-[#F5EFE6]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Left Text */}
          <div className="max-w-xl text-center lg:text-left">
            <span className="badge-neo bg-[#FFE842] text-[#1F1127] mb-3">
              {isRtl ? 'معمل النكهات / الكتالوج الكامل' : 'TOOMAKT / TASTE LAB'}
            </span>
            <h1 className="font-display text-4xl sm:text-6xl font-black text-[#1F1127] tracking-tight uppercase leading-[0.98] mb-4">
              {isRtl ? (
                <>تسوق منظومة <br /><span className="text-[#FF5E2B]">الطقس بأكملها.</span></>
              ) : (
                <>SHOP THE WHOLE <br /><span className="text-[#FF5E2B]">WEATHER SYSTEM.</span></>
              )}
            </h1>
            <p className="text-base sm:text-lg font-bold text-[#1F1127]/80">
              {isRtl
                ? 'كل قضمة مشرقة وزبدية في مكان واحد. اختر توقعاتك لليوم.'
                : 'Every bright, buttery bite in one place. Pick your forecast.'}
            </p>
          </div>

          {/* Right Header Graphic (Sun Dial + Flavor Spheres) */}
          <div className="relative w-64 sm:w-80 h-44 sm:h-56 flex items-center justify-center shrink-0">
            {/* Sun Dial */}
            <div className="w-32 h-32 rounded-full bg-[#FFE842] border-3 border-[#1F1127] shadow-neo flex flex-col items-center justify-center text-center p-2">
              <Sun className="w-8 h-8 text-[#FF5E2B] animate-spin" style={{ animationDuration: '20s' }} />
              <span className="text-[10px] font-black uppercase text-[#1F1127] mt-1">100% JOY</span>
            </div>

            {/* Overlapping Floating Weather Bubbles */}
            <div className="absolute top-2 right-4 w-18 h-18 rounded-full bg-[#FF4D8D] border-2 border-[#1F1127] shadow-neo-sm flex items-center justify-center text-white text-[9px] font-black uppercase text-center p-1 animate-float">
              BERRY
            </div>
            <div className="absolute bottom-2 left-4 w-20 h-20 rounded-full bg-[#C4E86E] border-2 border-[#1F1127] shadow-neo-sm flex items-center justify-center text-[#1F1127] text-[10px] font-black uppercase text-center p-1 animate-float-reverse">
              CITRUS
            </div>
            <div className="absolute -bottom-2 right-8 w-16 h-16 rounded-full bg-[#4AD4DA] border-2 border-[#1F1127] shadow-neo-sm flex items-center justify-center text-[#1F1127] text-[9px] font-black uppercase text-center p-1">
              TROPIC
            </div>
          </div>

        </div>
      </section>

      {/* Filter & Search Bar Strip (Figma Frame 4) */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 border-b-2 border-[#1F1127] bg-[#FFFDF5] sticky top-[62px] z-30 shadow-neo-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {filterTags.map((tag) => {
              const isSelected = selectedTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-1.5 rounded-full border-2 border-[#1F1127] text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#1F1127] text-[#FFE842] shadow-neo-sm'
                      : 'bg-[#F5EFE6] text-[#1F1127] hover:bg-[#FFE842]'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <div className="flex items-center gap-2 bg-[#F5EFE6] rounded-full border-2 border-[#1F1127] px-3.5 py-1.5 shadow-neo-sm">
              <Search className="w-4 h-4 text-[#1F1127] shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search flavors..."
                className="w-full bg-transparent text-xs font-bold text-[#1F1127] placeholder-[#1F1127]/60 focus:outline-none"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 9-Item Neo-Brutalist Grid (Figma Frame 4) */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product, index) => {
            const isJustAdded = justAddedId === product.id;
            const isDarkCard = product.cardBgColor === '#1F1127';

            return (
              <motion.div
                key={product.id}
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                onClick={() => onSelectProduct(product)}
                className={`group rounded-2xl border-2 border-[#1F1127] shadow-neo hover:shadow-neo-lg transition-all p-6 flex flex-col justify-between cursor-pointer select-none overflow-hidden min-h-[380px] ${
                  isDarkCard ? 'text-white' : 'text-[#1F1127]'
                }`}
                style={{ backgroundColor: product.cardBgColor || '#FFE842' }}
              >
                {/* Header Tag / Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`badge-neo text-[10px] px-2.5 py-0.5 ${
                      isDarkCard ? 'bg-[#FFE842] text-[#1F1127]' : 'bg-[#1F1127] text-white'
                    }`}
                  >
                    {product.badge || `0${index + 1}`}
                  </span>
                  <span className="text-[11px] font-mono font-bold opacity-80">
                    45S CHEW
                  </span>
                </div>

                {/* Candy Stage Graphic */}
                <div className="relative aspect-4/3 rounded-xl border-2 border-[#1F1127] bg-[#FFFDF5] p-4 flex items-center justify-center overflow-hidden mb-6 shadow-neo-sm group-hover:scale-102 transition-transform">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain filter drop-shadow group-hover:rotate-2 transition-transform"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-[#1F1127]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="badge-neo bg-[#FFFDF5] text-[#1F1127] text-[10px]">
                      <Eye className="w-3 h-3 mr-1" />
                      QUICK VIEW
                    </span>
                  </div>
                </div>

                {/* Name & Tagline */}
                <div>
                  <h3
                    className={`font-display text-xl sm:text-2xl font-black uppercase leading-tight line-clamp-1 ${
                      isDarkCard ? 'text-white' : 'text-[#1F1127]'
                    }`}
                  >
                    {product.name}
                  </h3>
                  <p
                    className={`text-xs sm:text-sm font-bold mt-1 line-clamp-1 ${
                      isDarkCard ? 'text-white/80' : 'text-[#1F1127]/80'
                    }`}
                  >
                    {product.tagline}
                  </p>
                </div>

                {/* Price & Add Action Row */}
                <div className="pt-4 mt-4 border-t-2 border-[#1F1127] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-70 block">
                      PRICE
                    </span>
                    <span
                      className={`font-display font-black text-lg ${
                        isDarkCard ? 'text-[#FFE842]' : 'text-[#1F1127]'
                      }`}
                    >
                      {product.price} EGP
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleQuickAdd(product, e)}
                    className={`w-10 h-10 rounded-full border-2 border-[#1F1127] flex items-center justify-center transition-all cursor-pointer ${
                      isJustAdded
                        ? 'bg-[#C4E86E] text-[#1F1127]'
                        : isDarkCard
                        ? 'bg-[#FFE842] text-[#1F1127] hover:bg-white'
                        : 'bg-[#1F1127] text-white hover:bg-[#FF5E2B] shadow-neo-sm'
                    }`}
                    title="Add to Bag"
                  >
                    {isJustAdded ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Embedded Custom Box Builder (Figma Frame 4 bottom) */}
      <CustomBoxBuilderSection />

    </div>
  );
};
