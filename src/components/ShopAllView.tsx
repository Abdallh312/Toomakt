import React, { useState } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRODUCTS, CATEGORIES } from '../data/toomaktData';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { useLanguage } from '../context/LanguageContext';

interface ShopAllViewProps {
  onSelectProduct: (p: Product) => void;
  initialCategory?: string;
  onNavigateHome?: () => void;
}

export const ShopAllView: React.FC<ShopAllViewProps> = ({
  onSelectProduct,
  initialCategory = 'all',
  onNavigateHome
}) => {
  const { isRtl } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  React.useEffect(() => {
    const handleSearchEvent = (e: any) => {
      if (e && e.detail !== undefined) {
        setSearchQuery(e.detail);
        setSelectedCategory('all');
      }
    };
    window.addEventListener('toomakt:search', handleSearchEvent);
    return () => window.removeEventListener('toomakt:search', handleSearchEvent);
  }, []);

  const filteredProducts = PRODUCTS.filter(p => {
    // Category match
    if (selectedCategory !== 'all') {
      const cat = (p.category || '').toLowerCase();
      if (cat !== selectedCategory && !cat.includes(selectedCategory)) {
        return false;
      }
    }

    // Search query match
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const match =
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.fruitNotes.some(n => n.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0; // 'featured' keep original order
  });

  return (
    <div className="bg-[#FAF7F2] text-[#1A1A1A] min-h-screen">
      
      {/* Editorial Header (Figma Frame 4) */}
      <section className="pt-10 pb-12 px-4 sm:px-6 lg:px-8 border-b border-[#E8E2D7] bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-mono text-[#736B63] uppercase tracking-wider mb-4">
            <button
              onClick={onNavigateHome}
              className="hover:text-[#1A1A1A] transition-colors cursor-pointer"
            >
              TOOMAKT
            </button>
            <span>/</span>
            <span className="text-[#1A1A1A] font-semibold">COLLECTION</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#1A1A1A] tracking-tight mb-3">
            {isRtl ? 'المجموعة الحرفية' : 'The collection'}
          </h1>
          <p className="text-base sm:text-lg text-[#736B63] font-light max-w-xl">
            {isRtl
              ? 'حلوى التوفي بالفواكه الطبيعية، مصنوعة يدوياً في دفعات صغيرة.'
              : 'Fruit-led toffee, made in small batches.'}
          </p>
        </div>
      </section>

      {/* Filter & Controls Bar */}
      <section className="sticky top-16 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8E2D7] py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {CATEGORIES.map(cat => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`category-pill cursor-pointer ${isActive ? 'active' : ''}`}
                >
                  {isRtl ? cat.arabicName : cat.name}
                </button>
              );
            })}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-[#736B63] absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isRtl ? 'تصفية...' : 'Filter collection...'}
                className="w-full text-xs pl-8 pr-3 rtl:pl-3 rtl:pr-8 py-2 rounded-full border border-[#E8E2D7] bg-white focus:outline-none focus:border-[#1A1A1A] transition-colors"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label={isRtl ? 'ترتيب المنتجات' : 'Sort products'}
                className="text-xs px-3.5 py-2 rounded-full border border-[#E8E2D7] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] transition-colors cursor-pointer"
              >
                <option value="featured">{isRtl ? 'المميز أولاً' : 'Featured'}</option>
                <option value="price-asc">{isRtl ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</option>
                <option value="price-desc">{isRtl ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}</option>
              </select>
            </div>
          </div>

        </div>
      </section>

      {/* Catalog Grid */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="mb-6 flex justify-between items-center text-xs text-[#736B63]">
            <span>
              {isRtl
                ? `عرض ${filteredProducts.length} من إجمالي ${PRODUCTS.length} منتجات`
                : `Showing ${filteredProducts.length} of ${PRODUCTS.length} items`}
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-[#E8E2D7] p-8">
              <h3 className="font-serif text-xl mb-2 text-[#1A1A1A]">
                {isRtl ? 'لا توجد منتجات مطابقة' : 'No items match your filter'}
              </h3>
              <p className="text-xs text-[#736B63] mb-6 font-light">
                {isRtl ? 'حاول تغيير معايير البحث أو تصفح كل النكهات' : 'Try resetting your search query or selecting All.'}
              </p>
              <button
                onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                className="btn-primary text-xs"
              >
                {isRtl ? 'إعادة ضبط الفلاتر' : 'Reset filters'}
              </button>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              <AnimatePresence>
                {filteredProducts.map(product => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard
                      product={product}
                      onSelectProduct={onSelectProduct}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Bottom Help Toolbar (Frame 4) */}
          <div className="mt-20 p-8 rounded-2xl border border-[#E8E2D7] bg-[#F4EFEA] text-center max-w-2xl mx-auto">
            <h4 className="font-serif text-xl text-[#1A1A1A] mb-2 font-normal">
              {isRtl ? 'هل تحتاج إلى مساعدة في الاختيار؟' : 'Need help choosing?'}
            </h4>
            <p className="text-xs sm:text-sm text-[#736B63] font-light mb-4">
              {isRtl
                ? 'قارن بين النكهات أو استشر خبير الحلويات لتنسيق هدية خاصة.'
                : 'Compare fruit profiles or speak with our confectionery concierge for curated corporate or wedding gifts.'}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => {
                  window.open('https://wa.me/201016869608', '_blank');
                }}
                className="btn-secondary text-xs font-medium"
              >
                {isRtl ? 'تواصل عبر واتساب ←' : 'Concierge on WhatsApp →'}
              </button>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
