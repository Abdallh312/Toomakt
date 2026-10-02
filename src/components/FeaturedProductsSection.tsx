import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { Product } from '../types';
import { CATEGORIES, PRODUCTS } from '../data/toomaktData';
import { ProductCard } from './ProductCard';
import { useLanguage } from '../context/LanguageContext';

interface FeaturedProductsSectionProps {
  onSelectProduct: (product: Product) => void;
  onViewAll?: () => void;
}

export const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({
  onSelectProduct,
  onViewAll,
}) => {
  const { isRtl } = useLanguage();
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await api.getProducts();
        if (mounted && data && data.length > 0) {
          setProducts(data);
        }
      } catch (err) {
        console.warn('Using local atelier products:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p => {
        const cat = (p.category || '').toLowerCase();
        return cat === activeCategory || cat.includes(activeCategory);
      });

  return (
    <section id="the-collection" className="py-20 md:py-28 bg-[#FAF7F2] border-b border-[#E8E2D7] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 text-left rtl:text-right">
          <div>
            <span className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-[#736B63] block mb-3">
              {isRtl ? 'المجموعة' : 'THE COLLECTION'}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1A1A1A] tracking-tight">
              {isRtl ? 'الفاكهة في أبهى صورها.' : 'Fruit, in its best light.'}
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`category-pill cursor-pointer ${isActive ? 'active' : ''}`}
                >
                  {isRtl ? cat.arabicName : cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Grid */}
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

        {/* View All / Explore Link */}
        {onViewAll && (
          <div className="mt-16 text-center">
            <button
              onClick={onViewAll}
              className="btn-secondary text-sm font-medium"
            >
              <span>{isRtl ? 'عرض كل التشكيلة (6 منتجات) ←' : 'View full collection (6 items) →'}</span>
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
