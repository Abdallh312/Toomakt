import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Sparkles, SlidersHorizontal } from 'lucide-react';
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
  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS);

  useEffect(() => {
    let active = true;
    api.getProducts().then((res) => {
      if (active && Array.isArray(res) && res.length > 0) {
        setProductsList(res);
      }
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  const filtered = selectedCategory === 'all'
    ? productsList
    : productsList.filter((p) => {
        const cat = (p.category || (p as any).category_slug || '').toLowerCase();
        return cat === selectedCategory || cat.includes(selectedCategory);
      });

  return (
    <section id="featured-products" className="py-16 sm:py-20 md:py-24 bg-[#FAF7F2] dark:bg-[#0C080A] border-b border-[#E8E2D7] dark:border-[#2A1622] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal yOffset={20}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12 text-left rtl:text-right">
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B2D5C]" />
                <span className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-[#736B63] dark:text-[#B0A396]">
                  {isRtl ? 'تشكيلة منتجات توماكت الأصلية' : 'OFFICIAL TOOMAKT COLLECTION'}
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1A1A1A] dark:text-[#FAF5EE] tracking-tight">
                {isRtl ? 'حلوى صنعت ببطء وإتقان.' : 'Confections crafted with devotion.'}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-[#736B63] dark:text-[#B0A396] font-light max-w-xl">
                {isRtl
                  ? 'استكشف منتجات توماكت الأصلية؛ توفي الزبدة الفاخر، بونبون القهوة والكابتشينو، وحلوى الفواكه الطبيعية.'
                  : 'Explore authentic Toomakt confections: European butter toffee, cappuccino bonbons, and natural fruit honey chews.'}
              </p>
            </div>

            <div className="shrink-0">
              <button
                onClick={onExploreAll}
                className="btn-primary group flex items-center gap-2 cursor-pointer w-full sm:w-auto shadow-soft hover:shadow-soft-md"
              >
                <span>{isRtl ? 'عرض كل الـ 14 منتج' : 'View Full Catalog (14 Items)'}</span>
                <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-1 mb-8 scrollbar-none no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#1A1A1A] dark:bg-[#FAF5EE] text-[#FAF5EE] dark:text-[#1A1A1A] shadow-soft'
                    : 'bg-white dark:bg-[#140C12] text-[#736B63] dark:text-[#B0A396] border border-[#E8E2D7] dark:border-[#2A1622] hover:border-[#1A1A1A] dark:hover:border-[#FAF5EE]'
                }`}
              >
                {isRtl ? cat.arabicName : cat.name}
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6"
          >
            {filtered.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onSelectProduct={onSelectProduct}
                showDescription={true}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Bottom CTA Banner */}
        <div className="mt-12 sm:mt-16 text-center">
          <button
            type="button"
            onClick={onExploreAll}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#3C1322] dark:text-[#E8BDD4] hover:underline cursor-pointer"
          >
            <span>{isRtl ? 'عرض تفاصيل ومواصفات كل المنتجات في المتجر الكامل' : 'Browse full specifications & packaging in the catalog'}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
