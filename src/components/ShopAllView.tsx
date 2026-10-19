import React, { useState, useEffect } from 'react';
import { Search, X, Loader2, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '../types';
import { api } from '../services/api';
import { ProductCard } from './ProductCard';
import { useLanguage } from '../context/LanguageContext';
import { ScrollReveal } from './ScrollReveal';

interface ShopAllViewProps {
  onSelectProduct: (product: Product) => void;
  onNavigateHome: () => void;
}

export const ShopAllView: React.FC<ShopAllViewProps> = ({
  onSelectProduct,
  onNavigateHome,
}) => {
  const { isRtl } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  useEffect(() => {
    const handleGlobalSearch = (e: any) => {
      if (e.detail) setSearchQuery(e.detail);
    };
    window.addEventListener('toomakt:search', handleGlobalSearch);
    return () => window.removeEventListener('toomakt:search', handleGlobalSearch);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const data = await api.getProducts();
        if (!cancelled && data && data.length > 0) {
          setProducts(data);
        }
      } catch {
        // fallback
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchCatalog();
    return () => { cancelled = true; };
  }, []);

  const CATEGORIES = [
    { id: 'all',       name: 'All',                   arabicName: 'كل الحلويات' },
    { id: 'toffee',    name: 'Toffee',                arabicName: 'توفي زبدة' },
    { id: 'bonbon',    name: 'Bonbon',                arabicName: 'بونبون فاخر' },
    { id: 'coffee',    name: 'Coffee & Cappuccino',   arabicName: 'قهوة وكابتشينو' },
    { id: 'chocolate', name: 'Chocolate & Peanut',    arabicName: 'شوكولاتة وإكلير' },
    { id: 'fruit',     name: 'Fruit Confections',     arabicName: 'فواكه طبيعية' },
  ];

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'all') {
      const cat = typeof p.category === 'object' && p.category !== null
        ? ((p.category as any).slug || (p.category as any).name)
        : (p.category_name || p.category || '');
      const catLower = String(cat).toLowerCase();
      const match =
        (selectedCategory === 'toffee' && catLower.includes('toffee')) ||
        (selectedCategory === 'bonbon' && catLower.includes('bonbon')) ||
        (selectedCategory === 'coffee' && (catLower.includes('coffee') || catLower.includes('cappuccino') || p.id.includes('cappuccino'))) ||
        (selectedCategory === 'chocolate' && (catLower.includes('chocolate') || catLower.includes('peanut') || catLower.includes('eclair') || p.id.includes('eclairs'))) ||
        (selectedCategory === 'fruit' && (catLower.includes('fruit') || p.id.includes('fruit')));
      if (!match) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const name = (p.name || '').toLowerCase();
      const nameAr = (p.name_ar || '').toLowerCase();
      const nameEn = (p.name_en || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();
      const descAr = (p.description_ar || '').toLowerCase();
      const descEn = (p.description_en || '').toLowerCase();
      return (
        name.includes(q) ||
        nameAr.includes(q) ||
        nameEn.includes(q) ||
        desc.includes(q) ||
        descAr.includes(q) ||
        descEn.includes(q)
      );
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0;
  });

  return (
    <div className="w-full min-h-screen bg-[#FAF5EE] pt-28 sm:pt-36 pb-24 text-[#22120C]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-[#22120C]/60 mb-8">
          <button type="button" onClick={onNavigateHome} className="hover:text-[#963725] transition-colors cursor-pointer">
            {isRtl ? 'الرئيسية' : 'Home'}
          </button>
          <span>/</span>
          <span className="text-[#963725] font-semibold">
            {isRtl ? 'تشكيلة الحلويات' : 'The Collection'}
          </span>
        </div>

        {/* Master Catalog Header */}
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12 border-b border-[#22120C]/10 pb-8">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest text-[#963725] bg-[#963725]/08 border border-[#963725]/20 mb-3">
                {isRtl ? 'التشكيلة الكاملة · مصنع العاشر' : 'The Complete Confectionery Collection'}
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-[#22120C]">
                {isRtl ? 'توفي وبونبون حرفي فاخر' : 'Handcrafted Toffees & Bonbons'}
              </h1>
              <p className="mt-2 text-sm text-[#22120C]/65 font-light max-w-lg leading-relaxed font-sans">
                {isRtl
                  ? 'فاكهة طبيعية، زبدة أوروبية، طهي بطيء في مراجل النحاس.'
                  : 'Real orchard fruit, European butter, slow-cooked in copper cauldrons.'}
              </p>
            </div>
            <span className="text-xs font-mono text-[#963725] px-3.5 py-1.5 rounded-full border border-[#22120C]/10 bg-white/50">
              {sortedProducts.length} {isRtl ? 'صنف حلويات' : 'confections available'}
            </span>
          </div>
        </ScrollReveal>

        {/* Controls Bar: Category Pills + Search + Sort */}
        <div className="space-y-5 mb-10 sm:mb-12">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`category-pill-warm shrink-0 cursor-pointer ${isActive ? 'active' : ''}`}
                >
                  {isRtl ? cat.arabicName : cat.name}
                </button>
              );
            })}
          </div>

          {/* Search Bar & Sorter Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-[#22120C]/40 absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isRtl ? 'ابحث في التشكيلة...' : 'Search confections...'}
                className="w-full text-xs sm:text-sm pl-10 pr-9 rtl:pl-9 rtl:pr-10 py-3 rounded-full bg-white/60 border border-[#22120C]/10 text-[#22120C] placeholder-[#22120C]/40 focus:outline-none focus:border-[#963725] font-sans transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-[#22120C]/40 hover:text-[#22120C] p-1"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sorter Selector */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs font-sans text-[#22120C]/60">
              <span>{isRtl ? 'الترتيب:' : 'Sort:'}</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3.5 py-2 rounded-full border border-[#22120C]/10 bg-white/60 text-[#22120C] focus:outline-none focus:border-[#963725] cursor-pointer font-sans text-xs"
              >
                <option value="featured">{isRtl ? 'المختار للمعمل' : 'Featured Atelier'}</option>
                <option value="price-asc">{isRtl ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</option>
                <option value="price-desc">{isRtl ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="py-24 text-center">
            <Loader2 className="w-8 h-8 text-[#963725] animate-spin mx-auto mb-3" />
            <p className="text-xs font-sans text-[#22120C]/60">
              {isRtl ? 'جاري استحضار الحلويات...' : 'Loading confectionery catalog...'}
            </p>
          </div>
        )}

        {/* Empty Search Result Fallback */}
        {!loading && sortedProducts.length === 0 && (
          <div className="py-20 text-center bg-white/50 rounded-3xl border border-[#22120C]/10 p-10">
            <p className="font-serif text-2xl text-[#963725] mb-2">
              {isRtl ? 'لم نعثر على نتائج مطابقة' : 'No confections found'}
            </p>
            <p className="text-sm text-[#22120C]/60 font-light mb-6 font-sans">
              {isRtl ? 'جرب البحث بكلمة أخرى أو اختر قسماً مختلفاً.' : 'Try a different search term or reset filters.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="btn-warm-primary"
            >
              {isRtl ? 'إعادة ضبط كل الفلاتر' : 'Reset All Filters'}
            </button>
          </div>
        )}

        {/* Product Grid: Grand 3-column layout with larger cards */}
        {!loading && sortedProducts.length > 0 && (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 items-stretch"
          >
            {sortedProducts.map((product, idx) => (
              <ScrollReveal key={product.id} delay={Math.min(idx * 0.05, 0.3)} className="h-full flex flex-col">
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={onSelectProduct}
                  showDescription={true}
                  className="h-full"
                />
              </ScrollReveal>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ShopAllView;
