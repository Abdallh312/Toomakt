import React, { useState } from 'react';
import { Star, Gift, ShoppingBag, Sparkles, Check, PackageCheck } from 'lucide-react';
import { GRAND_CAROUSEL_BOX, CROWD_FAVORITES_ITEMS } from '../data/toomaktData';
import { useCart } from '../context/CartContext';
import { BundleItem } from '../types';

export const CrowdFavoritesSection: React.FC = () => {
  const { addToCart } = useCart();
  const [addedIds, setAddedIds] = useState<{ [key: string]: boolean }>({});

  const handleAdd = (item: BundleItem) => {
    addToCart(item);
    setAddedIds(prev => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedIds(prev => ({ ...prev, [item.id]: false }));
    }, 1500);
  };

  return (
    <section id="crowd-favorites" className="py-20 bg-[#F7F1E7] border-y border-[#EBE0D2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C26715] flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5" />
              Curated Gift Boxes & Bundles
            </span>
            <h2 className="mt-2 text-3xl sm:text-5xl font-serif font-black text-[#2B170E] tracking-tight">
              The Crowd Favorites
            </h2>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFFFFF] border border-[#E5DACD] text-xs font-semibold text-[#6E5D52] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#C26715] animate-pulse"></span>
            <span>94% of first-time buyers select the Grand Carousel Box</span>
          </div>
        </div>

        {/* Content Layout: Big featured box on left, 3 horizontal cards on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Grand Box Showcase (7 Cols) */}
          <div className="lg:col-span-7 bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border border-[#E8DDD0] shadow-medium flex flex-col justify-between relative overflow-hidden group">
            {/* Ambient gold glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFECCC]/40 rounded-full blur-3xl pointer-events-none"></div>

            <div>
              <div className="flex items-center justify-between">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-[#2B170E] text-[#FFF7EC]">
                  {GRAND_CAROUSEL_BOX.category}
                </span>

                <div className="text-right">
                  <span className="text-3xl font-serif font-bold text-[#2B170E]">
                    {GRAND_CAROUSEL_BOX.price.toFixed(2)} EGP
                  </span>
                  <span className="block text-[10px] uppercase tracking-wider text-[#9E8B80]">
                    {GRAND_CAROUSEL_BOX.weight}
                  </span>
                </div>
              </div>

              <h3 className="mt-4 text-2xl sm:text-4xl font-serif font-black text-[#2B170E] leading-snug">
                {GRAND_CAROUSEL_BOX.title}
              </h3>

              <p className="mt-2 text-sm text-[#736359] leading-relaxed max-w-xl">
                {GRAND_CAROUSEL_BOX.description}
              </p>

              {/* Feature Gilded Bag Tag */}
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FAF5EE] border border-[#EBE2D7] text-xs font-semibold text-[#8C4A15]">
                <PackageCheck className="w-3.5 h-3.5 text-[#C26715]" />
                <span>Includes Gold Foil Gift Bag & Tasting Menu</span>
              </div>
            </div>

            {/* Central Box Mock Visual */}
            <div className="my-6 relative rounded-2xl overflow-hidden aspect-16/9 shadow-soft">
              <img
                src={GRAND_CAROUSEL_BOX.image}
                alt={GRAND_CAROUSEL_BOX.title}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              />
              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
                12 Flavor Symphony
              </div>
            </div>

            {/* Reviews & CTA Button */}
            <div className="pt-4 border-t border-[#F2EAE0] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="flex text-[#F59E0B]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#2B170E]">4.98</span>
                <span className="text-xs text-[#8C7B71]">(1,280 reviews)</span>
              </div>

              <button
                onClick={() => handleAdd(GRAND_CAROUSEL_BOX)}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  addedIds[GRAND_CAROUSEL_BOX.id]
                    ? 'bg-[#2E7D32] text-white'
                    : 'bg-[#C26715] hover:bg-[#A8530B] text-white shadow-md hover:shadow-lg'
                }`}
              >
                {addedIds[GRAND_CAROUSEL_BOX.id] ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>ADD GIFT BOX TO BAG • 42 EGP</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: 3 Curated Stack Items (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            {CROWD_FAVORITES_ITEMS.map((item: BundleItem) => {
              const isAdded = !!addedIds[item.id];

              return (
                <div
                  key={item.id}
                  className="bg-[#FFFFFF] rounded-2xl p-4 sm:p-5 border border-[#E8DDD0] shadow-soft hover:shadow-medium hover:border-[#D5C1AE] transition-all flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-[#F9F4EE]">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#C26715] block">
                        {item.category}
                      </span>
                      <h4 className="font-serif font-bold text-base text-[#2B170E] group-hover:text-[#C26715] transition-colors leading-tight mt-0.5">
                        {item.title}
                      </h4>
                      <p className="text-xs text-[#7A6A60] mt-1 line-clamp-1 max-w-xs">
                        {item.description}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="font-serif font-bold text-sm text-[#2B170E]">
                          {item.price.toFixed(2)} EGP
                        </span>
                        <span className="text-[11px] text-[#8C7B71] flex items-center gap-1">
                          <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                          {item.rating} ({item.reviewCount})
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAdd(item)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                      isAdded
                        ? 'bg-[#2E7D32] text-white'
                        : 'bg-[#2B170E] hover:bg-[#C26715] text-white shadow-xs'
                    }`}
                  >
                    {isAdded ? 'Added' : 'Quick Add'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
