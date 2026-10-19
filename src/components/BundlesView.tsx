import React, { useEffect, useState } from 'react';
import { Gift, Star, ShoppingBag, Check, PackageCheck, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { BundleItem } from '../types';

interface BundlesViewProps {
  onNavigateHome?: () => void;
}

export const BundlesView: React.FC<BundlesViewProps> = ({ onNavigateHome }) => {
  const { addToCart } = useCart();
  const { isRtl } = useLanguage();
  const [bundles, setBundles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await api.getBundles();
        if (!cancelled) {
          setBundles((data || []).filter((b: any) => b.is_active !== false));
        }
      } catch {
        if (!cancelled) setBundles([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAdd = (item: any) => {
    const cartItem: BundleItem = {
      id: String(item.id),
      title: item.title,
      category: item.category || 'Curated Gift Box',
      badge: item.badge,
      description: item.description || '',
      price: Number(item.price),
      rating: Number(item.rating || 5),
      reviewCount: item.reviewCount ?? item.review_count ?? 0,
      image: item.image || item.image_url || '/images/carousel.jpg',
      weight: item.weight || '450G LUXURY TIN',
    };
    addToCart(cartItem);
    setAddedIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [item.id]: false }));
    }, 1500);
  };

  const featured = bundles.find((b) => b.is_grand_feature) || bundles[0];
  const rest = bundles.filter((b) => b.id !== featured?.id);

  return (
    <div className="bg-white text-[#22120C] min-h-screen pt-28 sm:pt-36 pb-24">
      <section className="px-6 sm:px-10 lg:px-14 pb-14 border-b border-[#22120C]/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-mono text-[#22120C]/60 uppercase tracking-wider mb-6">
            <button
              type="button"
              onClick={onNavigateHome}
              className="hover:text-[#E890A8] transition-colors cursor-pointer"
            >
              TOOMAKT
            </button>
            <span>/</span>
            <span className="text-[#E890A8] font-semibold">
              {isRtl ? 'الباقات المختارة' : 'BUNDLES'}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="font-serif italic text-[#E890A8] text-lg mb-2">
                {isRtl ? 'علب هدايا مختارة' : 'Curated Gift Boxes & Tins'}
              </p>
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#22120C] tracking-tight mb-3">
                {isRtl ? 'الباقات المختارة' : 'The Bundles'}
              </h1>
              <p className="text-sm sm:text-base text-[#22120C]/75 font-light max-w-xl leading-relaxed">
                {isRtl
                  ? 'علب هدايا وتذوقات مختارة من معمل القاهرة — جاهزة للإهداء بتغليف راقٍ.'
                  : 'Gift boxes and tasting sets from the Cairo atelier — ready to give in tailored presentation.'}
              </p>
            </div>

            {!loading && bundles.length > 0 && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FDF2F5] border border-[#E890A8]/20 text-xs font-mono text-[#22120C]/75">
                <Sparkles className="w-3.5 h-3.5 text-[#E890A8]" />
                <span>
                  {bundles.length} {isRtl ? 'باقة متاحة' : 'bundles available'}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 px-6 sm:px-10 lg:px-14">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-[#22120C]/60">
              <Loader2 className="w-8 h-8 animate-spin text-[#E890A8] mb-3" />
              <span className="text-sm font-mono font-light">
                {isRtl ? 'جاري تحميل الباقات...' : 'Loading bundles from atelier...'}
              </span>
            </div>
          ) : bundles.length === 0 ? (
            <div className="bg-[#FDF2F5] rounded-3xl border border-[#E890A8]/20 p-12 text-center">
              <Gift className="w-10 h-10 text-[#22120C]/40 mx-auto mb-4" />
              <h2 className="font-serif text-2xl text-[#22120C] mb-2">
                {isRtl ? 'لا توجد باقات بعد' : 'No bundles yet'}
              </h2>
              <p className="text-sm text-[#22120C]/70 font-light max-w-md mx-auto">
                {isRtl
                  ? 'ترقبوا إطلاق باقات وتشكيلات الهدايا الفاخرة قريباً.'
                  : 'Curated luxury gift collections and bundles coming soon.'}
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {featured && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white rounded-[32px] border border-[#E890A8]/20 p-6 sm:p-10 overflow-hidden relative shadow-[0_20px_50px_rgba(232,144,168,0.1)]"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative">
                    <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-[#FDF2F5] p-4 flex items-center justify-center border border-[#E890A8]/15">
                      <img
                        src={featured.image || featured.image_url}
                        alt={featured.title}
                        className="w-full h-full object-contain filter drop-shadow-md"
                      />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest bg-[#E890A8] text-white font-semibold">
                          {featured.category}
                        </span>
                        {featured.badge && (
                          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#E890A8]/10 border border-[#E890A8]/20 text-[#E890A8] font-medium">
                            {featured.badge}
                          </span>
                        )}
                      </div>
                      <h2 className="font-serif text-3xl sm:text-4xl text-[#22120C] tracking-tight mb-3">
                        {featured.title}
                      </h2>
                      <p className="text-sm text-[#22120C]/75 font-light leading-relaxed mb-5">
                        {featured.description}
                      </p>
                      {featured.perk_note && (
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#FDF2F5] border border-[#E890A8]/20 text-xs font-mono text-[#E890A8] mb-6 font-medium">
                          <PackageCheck className="w-3.5 h-3.5" />
                          <span>{featured.perk_note}</span>
                        </div>
                      )}
                      <div className="flex flex-wrap items-end justify-between gap-4 pt-5 border-t border-[#22120C]/10">
                        <div>
                          <span className="font-serif text-3xl text-[#E890A8] font-semibold">
                            {Number(featured.price).toFixed(0)} EGP
                          </span>
                          <span className="block text-[11px] font-mono uppercase tracking-wider text-[#22120C]/50 mt-0.5">
                            {featured.weight}
                          </span>
                          <div className="flex items-center gap-1.5 mt-2 text-xs font-mono text-[#22120C]/70">
                            <Star className="w-3.5 h-3.5 fill-[#E890A8] text-[#E890A8]" />
                            <span className="font-semibold text-[#22120C]">
                              {Number(featured.rating || 5).toFixed(2)}
                            </span>
                            <span>
                              ({featured.reviewCount ?? featured.review_count ?? 0}{' '}
                              {isRtl ? 'تقييم' : 'reviews'})
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAdd(featured)}
                          className="bg-[#E890A8] text-white hover:bg-[#6AACE9] px-7 py-3 rounded-full font-serif font-medium transition-all shadow-[0_4px_14px_rgba(232,144,168,0.25)] hover:shadow-[0_6px_20px_rgba(106,172,233,0.35)] flex items-center gap-2 cursor-pointer"
                        >
                          {addedIds[featured.id] ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>{isRtl ? 'تمت الإضافة' : 'Added to bag'}</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-4 h-4" />
                              <span>{isRtl ? 'أضف للحقيبة' : 'Add Gift Box'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {rest.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((item, idx) => {
                    const isAdded = !!addedIds[item.id];
                    return (
                      <motion.article
                        key={item.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: idx * 0.05 }}
                        className="bg-white rounded-[28px] border border-[#22120C]/10 overflow-hidden hover:border-[#E890A8]/45 hover:shadow-[0_16px_40px_rgba(232,144,168,0.1)] transition-all flex flex-col justify-between"
                      >
                        <div className="aspect-[5/4] bg-[#FDF2F5] p-4 flex items-center justify-center border-b border-[#22120C]/8">
                          <img
                            src={item.image || item.image_url}
                            alt={item.title}
                            className="w-full h-full object-contain filter drop-shadow-sm hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-6 flex flex-col flex-1 justify-between">
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-[#E890A8] mb-1 block font-semibold">
                              {item.category}
                            </span>
                            <h3 className="font-serif text-xl text-[#22120C] mb-1.5 leading-snug">
                              {item.title}
                            </h3>
                            <p className="text-xs text-[#22120C]/70 font-light line-clamp-2 mb-4">
                              {item.description}
                            </p>
                          </div>
                          <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#22120C]/8">
                            <div>
                              <span className="font-serif text-xl text-[#E890A8] font-semibold">
                                {Number(item.price).toFixed(0)} EGP
                              </span>
                              <span className="block text-[10px] font-mono text-[#22120C]/50">{item.weight}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleAdd(item)}
                              className={`px-4 py-2 rounded-full text-xs font-mono font-semibold transition-all cursor-pointer ${
                                isAdded
                                  ? 'bg-[#6AACE9] text-white'
                                  : 'bg-[#E890A8] text-white hover:bg-[#6AACE9] shadow-sm'
                              }`}
                            >
                              {isAdded ? (isRtl ? 'تمت' : 'Added') : isRtl ? 'أضف' : 'Quick Add'}
                            </button>
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BundlesView;
