import React, { useState, useEffect } from 'react';
import { Search, Loader2, Sparkles, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { useLanguage } from '../context/LanguageContext';

interface ShopAllViewProps {
  onSelectProduct: (p: Product) => void;
  initialCategory?: string;
  onNavigateHome?: () => void;
}

interface CategoryOption {
  id: string;
  name: string;
  arabicName: string;
}

export const ShopAllView: React.FC<ShopAllViewProps> = ({
  onSelectProduct,
  initialCategory = 'all',
  onNavigateHome
}) => {
  const { isRtl } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  useEffect(() => {
    let active = true;
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const [prodList, catList] = await Promise.all([
          api.getProducts(),
          api.getCategories()
        ]);
        if (!active) return;
        setProducts(prodList || []);

        const mappedCategories: CategoryOption[] = [
          { id: 'all', name: 'All', arabicName: 'الكل' },
          ...(catList || []).map((c: any) => ({
            id: c.slug || c.id,
            name: c.name,
            arabicName: c.name_ar || c.name
          }))
        ];
        setCategories(mappedCategories);
      } catch (err) {
        if (!active) return;
        console.error('Failed to load shop catalog:', err);
        setProducts([]);
        setCategories([{ id: 'all', name: 'All', arabicName: 'الكل' }]);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchCatalog();
    return () => {
      active = false;
    };
  }, []);

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

  const filteredProducts = products.filter(p => {
    // Category match
    if (selectedCategory !== 'all') {
      const cat = (p.category || (p as any).category_slug || '').toLowerCase();
      if (cat !== selectedCategory && !cat.includes(selectedCategory)) {
        return false;
      }
    }

    // Search query match
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const match =
        (p.name_ar || p.name).toLowerCase().includes(q) ||
        (p.name_en || p.name).toLowerCase().includes(q) ||
        (p.tagline_ar || p.tagline || '').toLowerCase().includes(q) ||
        (p.tagline_en || p.tagline || '').toLowerCase().includes(q) ||
        (p.description_ar || p.description || '').toLowerCase().includes(q) ||
        (p.description_en || p.description || '').toLowerCase().includes(q) ||
        (p.flavor_ar || p.flavor || '').toLowerCase().includes(q) ||
        (p.flavor_en || p.flavor || '').toLowerCase().includes(q) ||
        (Array.isArray(p.fruitNotes) && p.fruitNotes.some(n => n.toLowerCase().includes(q))) ||
        (Array.isArray(p.tasting_notes_en) && p.tasting_notes_en.some(n => n.toLowerCase().includes(q)));
      if (!match) return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0; // 'featured' keep original order
  });

  return (
    <div className="bg-[#FAF7F2] dark:bg-[#0C080A] text-[#1A1A1A] dark:text-[#FAF5EE] min-h-screen transition-colors duration-300">
      
      {/* Editorial Header */}
      <section className="pt-10 pb-12 px-4 sm:px-6 lg:px-8 border-b border-[#E8E2D7] dark:border-[#2A1622] bg-[#FAF7F2] dark:bg-[#0C080A]">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-mono text-[#736B63] dark:text-[#A89C90] uppercase tracking-wider mb-4">
            <button
              onClick={onNavigateHome}
              className="hover:text-[#1A1A1A] dark:hover:text-[#FFD147] transition-colors cursor-pointer"
            >
              TOOMAKT
            </button>
            <span>/</span>
            <span className="text-[#1A1A1A] dark:text-[#FAF5EE] font-semibold">COLLECTION</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#1A1A1A] dark:text-[#FAF5EE] tracking-tight mb-3">
            {isRtl ? 'المجموعة الحرفية' : 'The collection'}
          </h1>
          <p className="text-base sm:text-lg text-[#736B63] dark:text-[#B5A99D] font-light max-w-xl">
            {isRtl
              ? 'حلوى التوفي بالفواكه الطبيعية، مصنوعة يدوياً في دفعات صغيرة.'
              : 'Fruit-led toffee, made in small batches.'}
          </p>
        </div>
      </section>

      {/* Filter & Controls Bar */}
      <section className="sticky top-16 z-30 bg-[#FAF7F2]/95 dark:bg-[#0C080A]/95 backdrop-blur-md border-b border-[#E8E2D7] dark:border-[#2A1622] py-4 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {categories.map(cat => {
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
              <Search className="w-3.5 h-3.5 text-[#736B63] dark:text-[#A89C90] absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isRtl ? 'تصفية...' : 'Filter collection...'}
                className="w-full text-xs pl-8 pr-3 rtl:pl-3 rtl:pr-8 py-2 rounded-full border border-[#E8E2D7] dark:border-[#38212E] bg-white dark:bg-[#181014] text-[#1A1A1A] dark:text-[#FAF5EE] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#FFD147] transition-colors"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label={isRtl ? 'ترتيب المنتجات' : 'Sort products'}
                className="text-xs px-3.5 py-2 rounded-full border border-[#E8E2D7] dark:border-[#38212E] bg-white dark:bg-[#181014] text-[#1A1A1A] dark:text-[#FAF5EE] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#FFD147] transition-colors cursor-pointer"
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
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-[#736B63]">
              <Loader2 className="w-8 h-8 animate-spin text-[#3C1322] mb-3" />
              <span className="text-sm font-light">
                {isRtl ? 'جاري تحميل التشكيلة من المعمل...' : 'Loading collection from atelier...'}
              </span>
            </div>
          ) : products.length === 0 ? (
            /* Clean Empty State when database has no products yet */
            <div className="text-center py-20 bg-white dark:bg-[#181014] rounded-3xl border border-[#E8E2D7] dark:border-[#38212E] p-8 sm:p-12 shadow-soft max-w-2xl mx-auto">
              <div className="w-12 h-12 rounded-full bg-[#3C1322]/10 dark:bg-[#FFD147]/10 text-[#3C1322] dark:text-[#FFD147] flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl mb-3 text-[#1A1A1A] dark:text-[#FAF5EE]">
                {isRtl ? 'المطبخ الحرفي يُعد دفعات طازجة' : 'Our Atelier Kitchen is Preparing Fresh Batches'}
              </h2>
              <p className="text-sm text-[#736B63] dark:text-[#B5A99D] mb-8 font-light leading-relaxed max-w-lg mx-auto">
                {isRtl
                  ? 'يتم تحضير دفعات التوفي يدوياً بالطلب. أضف المنتجات الجديدة عبر لوحة التحكم أو تواصل مع خدمة الضيافة للطلبات الخاصة.'
                  : 'All fruit toffees are slowly crafted in small batches. Products added in the management portal will immediately appear here.'}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => window.open('https://wa.me/201024542139', '_blank')}
                  className="btn-primary text-xs"
                >
                  {isRtl ? 'تواصل مع المعمل عبر واتساب' : 'Inquire on WhatsApp'}
                </button>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-[#181014] rounded-2xl border border-[#E8E2D7] dark:border-[#38212E] p-8">
              <h3 className="font-serif text-xl mb-2 text-[#1A1A1A] dark:text-[#FAF5EE]">
                {isRtl ? 'لا توجد منتجات مطابقة' : 'No items match your filter'}
              </h3>
              <p className="text-xs text-[#736B63] dark:text-[#B5A99D] mb-6 font-light">
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
            <>
              <div className="mb-6 flex justify-between items-center text-xs text-[#736B63] dark:text-[#A89C90]">
                <span>
                  {isRtl
                    ? `عرض ${filteredProducts.length} من إجمالي ${products.length} منتجات`
                    : `Showing ${filteredProducts.length} of ${products.length} items`}
                </span>
              </div>

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
            </>
          )}

          {/* Bottom Help Toolbar */}
          <div className="mt-20 p-8 rounded-2xl border border-[#E8E2D7] dark:border-[#38212E] bg-[#F4EFEA] dark:bg-[#150E12] text-center max-w-2xl mx-auto">
            <h4 className="font-serif text-xl text-[#1A1A1A] dark:text-[#FAF5EE] mb-2 font-normal">
              {isRtl ? 'هل تحتاج إلى مساعدة في الاختيار؟' : 'Need help choosing?'}
            </h4>
            <p className="text-xs sm:text-sm text-[#736B63] dark:text-[#B5A99D] font-light mb-4">
              {isRtl
                ? 'قارن بين النكهات أو استشر خبير الحلويات لتنسيق هدية خاصة.'
                : 'Compare fruit profiles or speak with our confectionery concierge for curated corporate or wedding gifts.'}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => {
                  window.open('https://wa.me/201024542139', '_blank');
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
