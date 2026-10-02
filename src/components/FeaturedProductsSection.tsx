import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, PackageX } from 'lucide-react';
import { api } from '../services/api';
import { Product, ProductCategory } from '../types';
import { ProductCard } from './ProductCard';

interface FeaturedProductsSectionProps {
  onSelectProduct: (product: Product) => void;
  onViewAll?: () => void;
}

export const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({
  onSelectProduct,
  onViewAll,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ProductCategory>('all');

  const normalizeProduct = (p: any): Product => {
    const catSlug = (p.category?.slug || p.category_slug || '').toLowerCase();
    const text = ((p.slug || '') + ' ' + (p.name || '') + ' ' + catSlug).toLowerCase();

    let category: ProductCategory = 'fruits';
    if (text.includes('butter') || text.includes('milk') || text.includes('cream')) {
      category = 'butter';
    } else if (text.includes('coffee') || text.includes('cappuccino') || text.includes('espresso')) {
      category = 'coffee';
    } else if (text.includes('eclair') || text.includes('peanut') || text.includes('chocolate')) {
      category = 'eclairs';
    } else if (text.includes('family') || text.includes('عيلة') || text.includes('sharing')) {
      category = 'family';
    }

    return {
      id: p.id,
      name: p.name,
      tagline: p.tagline || p.flavor_name || 'Artisanal Hand-Pulled Soft Toffee',
      description: p.description || p.tagline || '',
      badge: p.badge || (p.is_featured ? 'FEATURED' : undefined),
      badgeType: p.badge_type || 'gold',
      price: Number(p.price) || 24,
      originalPrice: p.compare_at_price ? Number(p.compare_at_price) : undefined,
      weight: p.weight || '250g Pouch',
      category,
      category_name: p.category?.name || p.category_name,
      rating: p.rating ? Number(p.rating) : 4.97,
      reviewsCount: p.reviews_count ? Number(p.reviews_count) : 240,
      chewiness: p.chewiness_score ? Number(p.chewiness_score) : 9.6,
      fruitImpact: {
        label: p.fruit_impact_label || 'Fruit Impact',
        score: p.fruit_impact_score ? Number(p.fruit_impact_score) : 9.5,
      },
      fruitNotes: Array.isArray(p.fruit_notes)
        ? p.fruit_notes
        : ['100% Real Fruit Purée', 'Normandy Sweet Butter'],
      image: p.image_url || p.image || '/images/toomakt/cat_fruity_candy.webp',
      accentColor: p.accent_color || '#C26715',
      lightBgColor: p.light_bg_color || '#FAF5EE',
      isPopular: Boolean(p.is_featured),
      pieces_per_pack: p.pieces_per_pack || 24,
      stock_quantity: p.stock_quantity ?? 80,
      in_stock: p.stock_quantity !== undefined ? p.stock_quantity > 0 : p.is_active !== false,
    };
  };

  useEffect(() => {
    async function loadLiveProducts() {
      setLoading(true);
      try {
        const data = await api.getProducts();
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map(normalizeProduct);
          setProducts(mapped);
        }
      } catch (err) {
        console.error('Failed to load featured products from database:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLiveProducts();
  }, []);

  const tabs: { id: ProductCategory; label: string }[] = [
    { id: 'all', label: 'All Confections' },
    { id: 'fruits', label: 'Fruit Toffees' },
    { id: 'butter', label: 'Butter & Milk' },
    { id: 'coffee', label: 'Coffee Bonbons' },
    { id: 'eclairs', label: 'Chocolate Eclairs' },
    { id: 'family', label: 'Family Assortments' },
  ];

  const filtered = activeTab === 'all'
    ? products
    : products.filter(p => p.category === activeTab);

  return (
    <section className="py-24 bg-[#FAF6F0] relative border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-200 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#C26715]" />
              <span>Direct From Our Kettles</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#2B170E] tracking-tight leading-tight">
              Featured Confections
            </h2>
            <p className="mt-2 text-sm sm:text-base text-stone-600 font-normal">
              Authentic recipes synchronized live with our atelier database.
            </p>
          </div>

          {onViewAll && (
            <button
              type="button"
              onClick={onViewAll}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-800 transition-colors shadow-2xs cursor-pointer self-start md:self-auto"
            >
              <span>View Full Catalog ({products.length})</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C26715]" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {tabs.map(tab => {
            const count = tab.id === 'all'
              ? products.length
              : products.filter(p => p.category === tab.id).length;

            if (count === 0 && tab.id !== 'all') return null;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-white hover:bg-stone-100 text-stone-600 border border-stone-200'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] opacity-75 font-mono">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block w-8 h-8 border-3 border-[#C26715] border-t-transparent rounded-full animate-spin" />
            <p className="mt-3 text-xs text-stone-500 font-mono">Syncing live batch data...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 bg-white rounded-3xl border border-stone-200 text-center max-w-md mx-auto p-8 shadow-xs">
            <PackageX className="w-10 h-10 text-stone-400 mx-auto mb-3" />
            <h3 className="font-serif font-bold text-lg text-stone-900">No confections in this category</h3>
            <p className="text-xs text-stone-500 mt-1">Check back soon for freshly pulled kettle batches.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
