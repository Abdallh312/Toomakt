import React, { useState, useEffect, useMemo } from 'react';
import { ArrowRight, ArrowLeft, Sparkles, Search, X, Check, ShoppingBag, Eye, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import { PRODUCTS, CATEGORIES } from '../data/toomaktData';
import { ProductCard } from './ProductCard';
import { useLanguage } from '../context/LanguageContext';
import { ScrollReveal } from './ScrollReveal';
import { api } from '../services/api';

interface FeaturedProductsSectionProps {
  onSelectProduct: (product: Product) => void;
  onExploreAll: () => void;
}

export const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({
  onSelectProduct,
  onExploreAll,
}) => {
  const { isRtl } = useLanguage();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS);
  const [displayLimit, setDisplayLimit] = useState<number>(8);

  useEffect(() => {
    let active = true;
    api.getProducts().then((res) => {
      if (active && Array.isArray(res) && res.length > 0) {
        setProductsList(res);
      }
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  // Filter products by category and live search query
  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      // 1. Category match
      const cat = (p.category || (p as any).category_slug || '').toLowerCase();
      const matchCat = selectedCategory === 'all' || cat === selectedCategory || cat.includes(selectedCategory);
      if (!matchCat) return false;

      // 2. Search query match
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const name = (p.name || '').toLowerCase();
      const nameAr = (p.name_ar || '').toLowerCase();
      const nameEn = (p.name_en || '').toLowerCase();
      const flavor = (p.flavor || '').toLowerCase();
      const flavorAr = (p.flavor_ar || '').toLowerCase();
      const flavorEn = (p.flavor_en || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();

      return (
        name.includes(q) ||
        nameAr.includes(q) ||
        nameEn.includes(q) ||
        flavor.includes(q) ||
        flavorAr.includes(q) ||
        flavorEn.includes(q) ||
        desc.includes(q)
      );
    });
  }, [productsList, selectedCategory, searchQuery]);

  const displayedList = displayLimit === 0
    ? filteredProducts
    : filteredProducts.slice(0, displayLimit);

  // Calculate count per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: productsList.length };
    CATEGORIES.forEach((cat) => {
      if (cat.id !== 'all') {
        counts[cat.id] = productsList.filter((p) => {
          const c = (p.category || (p as any).category_slug || '').toLowerCase();
          return c === cat.id || c.includes(cat.id);
        }).length;
      }
    });
    return counts;
  }, [productsList]);

  return (
    <section id="featured-products" className="py-14 sm:py-20 md:py-24 bg-[#FAF7F2] dark:bg-[#120D11] border-b border-[#E8E2D7] dark:border-[#33242E] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal yOffset={20}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12 text-left rtl:text-right">
            <div>
              <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-white/90 dark:bg-[#1B1419] border border-[#E8E2D7] dark:border-[#33242E] shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#8B2D5C] animate-pulse" />
                <span className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-[#736B63] dark:text-[#C8BEB5]">
                  {isRtl ? 'تشكيلة منتجات توماكت الأصلية' : 'OFFICIAL TOOMAKT COLLECTION'}
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1A1A1A] dark:text-[#F7F3EC] tracking-tight">
                {isRtl ? 'حلوى صنعت ببطء وإتقان.' : 'Confections crafted with devotion.'}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-[#736B63] dark:text-[#C8BEB5] font-light max-w-xl">
                {isRtl
                  ? 'استكشف تشكيلة توماكت الكاملة: توفي الحليب الأوروبي، بونبون سائل القهوة الإيطالية، اكلير الشوكولاتة، وحلوى عسل الفواكه.'
                  : 'Explore authentic Toomakt confections: European butter toffee, cappuccino espresso bonbons, chocolate eclairs, and fruit honey chews.'}
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              <button
                type="button"
                onClick={onExploreAll}
                className="btn-primary group flex items-center gap-2 cursor-pointer w-full sm:w-auto shadow-soft hover:shadow-soft-md py-2.5 px-5 text-sm"
              >
                <span>{isRtl ? 'عرض كل الـ 14 منتج' : 'View All 14 Items'}</span>
                <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Search & Category Filter Controls Toolbar */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            
            {/* Live Filter / Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#736B63] dark:text-[#C8BEB5] absolute top-1/2 -translate-y-1/2 left-3 rtl:left-auto rtl:right-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isRtl ? 'ابحث في النكهات (مثال: قهوة، مانجو، حليب، ليمون...)' : 'Search flavors (e.g. coffee, milk, mango...)'}
                className="w-full pl-9 pr-8 rtl:pl-8 rtl:pr-9 py-2 rounded-full text-xs sm:text-sm bg-white dark:bg-[#1B1419] border border-[#E8E2D7] dark:border-[#33242E] text-[#1A1A1A] dark:text-[#F7F3EC] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#E8BD6D] transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute top-1/2 -translate-y-1/2 right-3 rtl:right-auto rtl:left-3 text-[#736B63] hover:text-[#1A1A1A] dark:hover:text-[#F7F3EC]"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Display Count / Limit Toggle */}
            <div className="flex items-center gap-2 text-xs text-[#736B63] dark:text-[#C8BEB5]">
              <span>
                {isRtl
                  ? `عرض ${displayedList.length} من أصل ${filteredProducts.length} منتج`
                  : `Showing ${displayedList.length} of ${filteredProducts.length} items`}
              </span>
              {filteredProducts.length > 8 && (
                <button
                  type="button"
                  onClick={() => setDisplayLimit(displayLimit === 0 ? 8 : 0)}
                  className="px-3 py-1 rounded-full bg-white dark:bg-[#1B1419] border border-[#E8E2D7] dark:border-[#33242E] text-[#1A1A1A] dark:text-[#F7F3EC] hover:border-[#1A1A1A] dark:hover:border-[#E8BD6D] transition-all cursor-pointer font-medium"
                >
                  {displayLimit === 0 ? (isRtl ? 'عرض أقل (8)' : 'Show Less (8)') : (isRtl ? 'عرض الكل' : 'Show All')}
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills with Item Badges */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              const count = categoryCounts[cat.id] ?? 0;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#1A1A1A] dark:bg-[#E8BD6D] text-[#FAF5EE] dark:text-[#120D11] shadow-[0_4px_14px_rgba(232,189,109,0.25)] font-semibold scale-102'
                      : 'bg-white dark:bg-[#1B1419] text-[#736B63] dark:text-[#C8BEB5] border border-[#E8E2D7] dark:border-[#33242E] hover:border-[#1A1A1A] dark:hover:border-[#E8BD6D]'
                  }`}
                >
                  <span>{isRtl ? cat.arabicName : cat.name}</span>
                  {count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-white/20 dark:bg-black/20 text-[#FAF5EE] dark:text-[#120D11]'
                        : 'bg-[#FAF7F2] dark:bg-[#241A21] text-[#736B63] dark:text-[#C8BEB5]'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          {displayedList.length > 0 ? (
            <motion.div
              key={`${selectedCategory}-${searchQuery}-${displayLimit}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6"
            >
              {displayedList.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onSelectProduct={onSelectProduct}
                  showDescription={true}
                />
              ))}
            </motion.div>
          ) : (
            <div className="py-16 text-center bg-white dark:bg-[#1B1419] rounded-2xl border border-[#E8E2D7] dark:border-[#33242E] p-8">
              <p className="text-sm text-[#736B63] dark:text-[#C8BEB5]">
                {isRtl
                  ? `لم نجد أي منتجات تطابق "${searchQuery}". جرب كلمة بحث أخرى أو تصفح كل المنتجات.`
                  : `No confections found matching "${searchQuery}". Try a different flavor or clear search.`}
              </p>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="mt-4 px-4 py-2 rounded-full text-xs font-semibold bg-[#1A1A1A] dark:bg-[#E8BD6D] text-white dark:text-[#120D11] cursor-pointer shadow-soft"
              >
                {isRtl ? 'إعادة ضبط التصفية' : 'Reset Filters'}
              </button>
            </div>
          )}
        </AnimatePresence>

        {/* Bottom CTA Banner */}
        <div className="mt-12 sm:mt-16 text-center">
          <button
            type="button"
            onClick={onExploreAll}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#3C1322] dark:text-[#E8BD6D] hover:underline cursor-pointer group"
          >
            <span>{isRtl ? 'عرض تفاصيل ومواصفات كل المنتجات في المتجر الكامل' : 'Browse full specifications & packaging in the catalog'}</span>
            <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
};
