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
    <div className="bg-[#FAF7F2] dark:bg-[#120D11] text-[#1A1A1A] dark:text-[#F7F3EC] min-h-screen transition-colors duration-300">
      <section className="relative pt-12 pb-14 px-4 sm:px-6 lg:px-8 border-b border-[#E8E2D7] dark:border-[#33242E] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(60,19,34,0.06),_transparent_55%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative">
          <div className="flex items-center gap-2 text-xs font-mono text-[#736B63] dark:text-[#9C8E83] uppercase tracking-wider mb-4">
            <button
              type="button"
              onClick={onNavigateHome}
              className="hover:text-[#1A1A1A] dark:hover:text-[#E8BD6D] transition-colors cursor-pointer"
            >
              TOOMAKT
            </button>
            <span>/</span>
            <span className="text-[#1A1A1A] dark:text-[#F7F3EC] font-semibold">
              {isRtl ? 'الباقات' : 'BUNDLES'}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.2em] text-[#3C1322] dark:text-[#E8BD6D] mb-3">
                <Gift className="w-3.5 h-3.5" />
                {isRtl ? 'علب هدايا مختارة' : 'Curated Gift Boxes & Tins'}
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#1A1A1A] dark:text-[#F7F3EC] tracking-tight mb-3">
                {isRtl ? 'الباقات المختارة' : 'The bundles'}
              </h1>
              <p className="text-base sm:text-lg text-[#736B63] dark:text-[#C8BEB5] font-light max-w-xl">
                {isRtl
                  ? 'علب هدايا وتذوقات مختارة من معمل القاهرة — جاهزة للإهداء.'
                  : 'Gift boxes and tasting sets from the Cairo atelier — ready to give.'}
              </p>
            </div>

            {!loading && bundles.length > 0 && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-[#1B1419] border border-[#E8E2D7] dark:border-[#33242E] text-xs text-[#736B63] dark:text-[#C8BEB5] shadow-soft">
                <Sparkles className="w-3.5 h-3.5 text-[#3C1322] dark:text-[#E8BD6D]" />
                <span>
                  {bundles.length} {isRtl ? 'باقة متاحة' : 'bundles available'}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-[#736B63] dark:text-[#9C8E83]">
              <Loader2 className="w-8 h-8 animate-spin text-[#3C1322] dark:text-[#E8BD6D] mb-3" />
              <span className="text-sm font-light">
                {isRtl ? 'جاري تحميل الباقات...' : 'Loading bundles from atelier...'}
              </span>
            </div>
          ) : bundles.length === 0 ? (
            <div className="bg-white dark:bg-[#1B1419] rounded-3xl border border-[#E8E2D7] dark:border-[#33242E] p-12 text-center shadow-soft">
              <Gift className="w-10 h-10 text-[#3C1322]/40 dark:text-[#E8BD6D]/40 mx-auto mb-4" />
              <h2 className="font-serif text-2xl text-[#1A1A1A] dark:text-[#F7F3EC] mb-2">
                {isRtl ? 'لا توجد باقات بعد' : 'No bundles yet'}
              </h2>
              <p className="text-sm text-[#736B63] dark:text-[#C8BEB5] font-light max-w-md mx-auto">
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
                  className="bg-white dark:bg-[#1B1419] rounded-3xl border border-[#E8E2D7] dark:border-[#33242E] p-6 sm:p-8 shadow-soft overflow-hidden relative"
                >
                  <div className="absolute top-0 right-0 w-80 h-80 bg-[#3C1322]/[0.04] dark:bg-[#E8BD6D]/[0.03] rounded-full blur-3xl pointer-events-none" />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative">
                    <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-[#F4EFEA] dark:bg-[#120D11]">
                      <img
                        src={featured.image || featured.image_url}
                        alt={featured.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest bg-[#3C1322] dark:bg-[#241A21] text-[#FAF7F2] dark:text-[#E8BD6D] border border-transparent dark:border-[#33242E]">
                          {featured.category}
                        </span>
                        {featured.badge && (
                          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-medium bg-[#FFD147]/30 dark:bg-[#E8BD6D]/20 text-[#3C1322] dark:text-[#E8BD6D]">
                            {featured.badge}
                          </span>
                        )}
                      </div>
                      <h2 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] dark:text-[#F7F3EC] tracking-tight mb-3">
                        {featured.title}
                      </h2>
                      <p className="text-sm text-[#736B63] dark:text-[#C8BEB5] font-light leading-relaxed mb-4">
                        {featured.description}
                      </p>
                      {featured.perk_note && (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FAF7F2] dark:bg-[#241A21] border border-[#E8E2D7] dark:border-[#33242E] text-xs text-[#3C1322] dark:text-[#E8BD6D] mb-5">
                          <PackageCheck className="w-3.5 h-3.5" />
                          <span>{featured.perk_note}</span>
                        </div>
                      )}
                      <div className="flex flex-wrap items-end justify-between gap-4 pt-4 border-t border-[#E8E2D7] dark:border-[#33242E]">
                        <div>
                          <span className="font-serif text-3xl text-[#1A1A1A] dark:text-[#F7F3EC]">
                            {Number(featured.price).toFixed(0)} EGP
                          </span>
                          <span className="block text-[11px] uppercase tracking-wider text-[#736B63] dark:text-[#9C8E83] mt-0.5">
                            {featured.weight}
                          </span>
                          <div className="flex items-center gap-1.5 mt-2 text-xs text-[#736B63] dark:text-[#9C8E83]">
                            <Star className="w-3.5 h-3.5 fill-[#E8BD6D] text-[#E8BD6D]" />
                            <span className="font-semibold text-[#1A1A1A] dark:text-[#F7F3EC]">
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
                          className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all cursor-pointer ${
                            addedIds[featured.id]
                              ? 'bg-emerald-700 text-white'
                              : 'bg-[#3C1322] dark:bg-[#E8BD6D] hover:bg-[#1A1A1A] dark:hover:bg-[#F2CE7F] text-[#FAF7F2] dark:text-[#120D11] shadow-soft'
                          }`}
                        >
                          {addedIds[featured.id] ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>{isRtl ? 'تمت الإضافة' : 'Added to bag'}</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-4 h-4" />
                              <span>{isRtl ? 'أضف للحقيبة' : 'Add gift box'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {rest.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {rest.map((item, idx) => {
                    const isAdded = !!addedIds[item.id];
                    return (
                      <motion.article
                        key={item.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: idx * 0.05 }}
                        className="bg-white dark:bg-[#1B1419] rounded-2xl border border-[#E8E2D7] dark:border-[#33242E] overflow-hidden shadow-soft hover:border-[#3C1322]/40 dark:hover:border-[#E8BD6D]/40 transition-all flex flex-col"
                      >
                        <div className="aspect-[5/4] bg-[#F4EFEA] dark:bg-[#120D11] overflow-hidden">
                          <img
                            src={item.image || item.image_url}
                            alt={item.title}
                            className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-500"
                          />
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#3C1322] dark:text-[#E8BD6D] mb-1">
                            {item.category}
                          </span>
                          <h3 className="font-serif text-xl text-[#1A1A1A] dark:text-[#F7F3EC] mb-1.5 leading-snug">
                            {item.title}
                          </h3>
                          <p className="text-xs text-[#736B63] dark:text-[#C8BEB5] font-light line-clamp-2 mb-4 flex-1">
                            {item.description}
                          </p>
                          <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#E8E2D7] dark:border-[#33242E]">
                            <div>
                              <span className="font-serif text-lg text-[#1A1A1A] dark:text-[#F7F3EC]">
                                {Number(item.price).toFixed(0)} EGP
                              </span>
                              <span className="block text-[10px] text-[#736B63] dark:text-[#9C8E83]">{item.weight}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleAdd(item)}
                              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                                isAdded
                                  ? 'bg-emerald-700 text-white'
                                  : 'bg-[#1A1A1A] dark:bg-[#E8BD6D] hover:bg-[#3C1322] dark:hover:bg-[#F2CE7F] text-[#FAF7F2] dark:text-[#120D11]'
                              }`}
                            >
                              {isAdded ? (isRtl ? 'تمت' : 'Added') : isRtl ? 'أضف' : 'Quick add'}
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
