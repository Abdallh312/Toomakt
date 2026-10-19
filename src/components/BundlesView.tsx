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
    <div className="bg-[#FAF5EE] text-[#22120C] min-h-screen pt-28 sm:pt-36 pb-24">
      <section className="px-6 sm:px-10 lg:px-14 pb-14 border-b border-[#22120C]/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-mono text-[#22120C]/60 uppercase tracking-wider mb-6">
            <button
              type="button"
              onClick={onNavigateHome}
              className="hover:text-[#963725] transition-colors cursor-pointer"
            >
              TOOMAKT
            </button>
            <span>/</span>
            <span className="text-[#963725] font-semibold">
              {isRtl ? 'الباقات المختارة' : 'BUNDLES'}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="font-serif italic text-[#963725] text-lg mb-2">
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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F4ECE2] border border-[#22120C]/10 text-xs font-mono text-[#22120C]/75">
                <Sparkles className="w-3.5 h-3.5 text-[#963725]" />
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
              <Loader2 className="w-8 h-8 animate-spin text-[#963725] mb-3" />
              <span className="text-sm font-mono font-light">
                {isRtl ? 'جاري تحميل الباقات...' : 'Loading bundles from atelier...'}
              </span>
            </div>
          ) : bundles.length === 0 ? (
            <div className="bg-[#F4ECE2] rounded-3xl border border-[#22120C]/10 p-12 text-center">
              <Gift className="w-10 h-10 text-[#22120C]/40 mx-auto mb-4" />
              <h2 className="font-serif text-2xl text-[#22120C] mb-2">
                {isRtl ? 'لا توجد باقات بعد' : 'No bundles yet'}
              </h2>
              <p className="text-sm text-[#22120C]/70 font-light max-w-md mx-auto">
                {isRtl
                  ? 'أضف باقات من لوحة التحكم لتظهر هنا مباشرة من قاعدة البيانات.'
                  : 'Add gift bundles in the admin dashboard — they will appear here from the database.'}
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {featured && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-[#FAF5EE] rounded-[32px] border border-[#22120C]/10 p-6 sm:p-10 overflow-hidden relative shadow-[0_20px_50px_rgba(34,18,12,0.06)]"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative">
                    <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-[#F4ECE2] p-4 flex items-center justify-center border border-[#22120C]/8">
                      <img
                        src={featured.image || featured.image_url}
                        alt={featured.title}
                        className="w-full h-full object-contain filter drop-shadow-md"
                      />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest bg-[#963725] text-[#FAF5EE] font-semibold">
                          {featured.category}
                        </span>
                        {featured.badge && (
                          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#963725]/10 border border-[#963725]/20 text-[#963725] font-medium">
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
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#F4ECE2] border border-[#22120C]/10 text-xs font-mono text-[#963725] mb-6 font-medium">
                          <PackageCheck className="w-3.5 h-3.5" />
                          <span>{featured.perk_note}</span>
                        </div>
                      )}
                      <div className="flex flex-wrap items-end justify-between gap-4 pt-5 border-t border-[#22120C]/10">
                        <div>
                          <span className="font-serif text-3xl text-[#963725] font-semibold">
                            {Number(featured.price).toFixed(0)} EGP
                          </span>
                          <span className="block text-[11px] font-mono uppercase tracking-wider text-[#22120C]/50 mt-0.5">
                            {featured.weight}
                          </span>
                          <div className="flex items-center gap-1.5 mt-2 text-xs font-mono text-[#22120C]/70">
                            <Star className="w-3.5 h-3.5 fill-[#E4B072] text-[#E4B072]" />
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
                          className="bg-[#963725] text-[#FAF5EE] hover:bg-[#822E1E] px-7 py-3 rounded-full font-serif font-medium transition-all shadow-[0_4px_14px_rgba(150,55,37,0.25)] hover:shadow-[0_6px_20px_rgba(150,55,37,0.35)] flex items-center gap-2 cursor-pointer"
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
                        className="bg-[#FAF5EE] rounded-[28px] border border-[#22120C]/10 overflow-hidden hover:border-[#963725]/35 hover:shadow-[0_16px_40px_rgba(34,18,12,0.08)] transition-all flex flex-col justify-between"
                      >
                        <div className="aspect-[5/4] bg-[#F4ECE2] p-4 flex items-center justify-center border-b border-[#22120C]/8">
                          <img
                            src={item.image || item.image_url}
                            alt={item.title}
                            className="w-full h-full object-contain filter drop-shadow-sm hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-6 flex flex-col flex-1 justify-between">
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-[#963725] mb-1 block font-semibold">
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
                              <span className="font-serif text-xl text-[#963725] font-semibold">
                                {Number(item.price).toFixed(0)} EGP
                              </span>
                              <span className="block text-[10px] font-mono text-[#22120C]/50">{item.weight}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleAdd(item)}
                              className={`px-4 py-2 rounded-full text-xs font-mono font-semibold transition-all cursor-pointer ${
                                isAdded
                                  ? 'bg-[#2E5C38] text-[#FAF5EE]'
                                  : 'bg-[#963725] text-[#FAF5EE] hover:bg-[#822E1E] shadow-sm'
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
