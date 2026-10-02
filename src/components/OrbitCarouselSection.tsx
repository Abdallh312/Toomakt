import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Plus, Check, Eye, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { Product } from '../types';
import { FLAVOR_VAULT_PRODUCTS } from '../data/toomaktData';

interface OrbitCarouselSectionProps {
  onSelectProduct: (product: Product) => void;
  onExploreCatalog: () => void;
}

export const OrbitCarouselSection: React.FC<OrbitCarouselSectionProps> = ({
  onSelectProduct,
  onExploreCatalog
}) => {
  const { addToCart } = useCart();
  const { isRtl } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  // Take the 6 flagship single flavor chews
  const products = FLAVOR_VAULT_PRODUCTS.slice(0, 6);

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % products.length);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + products.length) % products.length);
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setJustAddedId(product.id);
    setTimeout(() => setJustAddedId(null), 1500);
  };

  return (
    <section className="py-16 sm:py-24 bg-[#FFFDF5] border-b-2 border-[#1F1127] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Controls Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <span className="badge-neo bg-[#C4E86E] text-[#1F1127] mb-2.5">
              {isRtl ? 'معمل النكهات / الملاحظات الميدانية' : 'TASTE LAB / FIELD NOTES'}
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-black text-[#1F1127] tracking-tight uppercase leading-tight">
              {isRtl ? 'أشهى النكهات في المدار' : 'THE GOOD STUFF, IN ORBIT.'}
            </h2>
          </div>

          {/* Carousel Arrows & View All CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handlePrev}
              className="w-11 h-11 rounded-full border-2 border-[#1F1127] bg-[#F5EFE6] hover:bg-[#FFE842] flex items-center justify-center transition-all shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
              aria-label="Previous Flavor"
            >
              <ArrowLeft className={`w-5 h-5 text-[#1F1127] ${isRtl ? 'rotate-180' : ''}`} />
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="w-11 h-11 rounded-full border-2 border-[#1F1127] bg-[#F5EFE6] hover:bg-[#FFE842] flex items-center justify-center transition-all shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
              aria-label="Next Flavor"
            >
              <ArrowRight className={`w-5 h-5 text-[#1F1127] ${isRtl ? 'rotate-180' : ''}`} />
            </button>

            <button
              type="button"
              onClick={onExploreCatalog}
              className="btn-neo bg-[#FF5E2B] text-white px-5 py-2.5 text-xs font-black uppercase tracking-wider hover:bg-[#ff480e] cursor-pointer ml-2"
            >
              {isRtl ? 'عرض الكل' : 'VIEW ALL'}
            </button>
          </div>
        </div>

        {/* Carousel Grid / Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {products.map((product, index) => {
            const isJustAdded = justAddedId === product.id;
            const isDarkText = product.cardBgColor !== '#1F1127';

            return (
              <motion.div
                key={product.id}
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                onClick={() => onSelectProduct(product)}
                className="group relative rounded-2xl border-2 border-[#1F1127] shadow-neo hover:shadow-neo-lg transition-all p-6 flex flex-col justify-between cursor-pointer select-none overflow-hidden min-h-[360px]"
                style={{ backgroundColor: product.cardBgColor || '#FFE842' }}
              >
                {/* Top Badge & Code */}
                <div className="flex items-center justify-between mb-4">
                  <span className="badge-neo bg-[#1F1127] text-white text-[10px] px-2.5 py-0.5">
                    {product.badge || `DROP 0${index + 1}`}
                  </span>

                  <span className="text-[11px] font-mono font-bold text-[#1F1127]/80">
                    45S CHEW
                  </span>
                </div>

                {/* Candy Stage Graphic */}
                <div className="relative aspect-4/3 rounded-xl border-2 border-[#1F1127] bg-[#FFFDF5] p-4 flex items-center justify-center overflow-hidden mb-6 shadow-neo-sm group-hover:scale-102 transition-transform">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain filter drop-shadow-md group-hover:rotate-3 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Quick Inspect Hover Chip */}
                  <div className="absolute inset-0 bg-[#1F1127]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="badge-neo bg-[#FFFDF5] text-[#1F1127] text-[10px] shadow-neo-sm">
                      <Eye className="w-3 h-3 mr-1" />
                      QUICK VIEW
                    </span>
                  </div>
                </div>

                {/* Title & Tagline */}
                <div>
                  <h3 className="font-display text-xl sm:text-2xl font-black text-[#1F1127] uppercase leading-tight line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-[#1F1127]/80 mt-1 line-clamp-1">
                    {product.tagline}
                  </p>
                </div>

                {/* Price & Add Action Row */}
                <div className="pt-4 mt-4 border-t-2 border-[#1F1127] flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#1F1127]/70">
                      PRICE
                    </span>
                    <span className="font-display font-black text-lg text-[#1F1127]">
                      {product.price} EGP
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleAddToCart(product, e)}
                    className={`w-10 h-10 rounded-full border-2 border-[#1F1127] flex items-center justify-center transition-all cursor-pointer ${
                      isJustAdded
                        ? 'bg-[#C4E86E] text-[#1F1127]'
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

      </div>
    </section>
  );
};
