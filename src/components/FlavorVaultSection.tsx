import React, { useState, useEffect } from 'react';
import { Plus, Sparkles, ChevronRight, Check, ArrowRight } from 'lucide-react';
import { FLAVOR_VAULT_PRODUCTS, HERO_PRODUCT } from '../data/toomaktData';
import { Product, ProductCategory } from '../types';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { navigateTo } from '../utils/navigation';

interface FlavorVaultSectionProps {
  onSelectProduct: (p: Product) => void;
  onShopAll?: () => void;
}

export const FlavorVaultSection: React.FC<FlavorVaultSectionProps> = ({ onSelectProduct, onShopAll }) => {
  const [activeTab, setActiveTab] = useState<ProductCategory>('all');
  const [products, setProducts] = useState<Product[]>([HERO_PRODUCT, ...FLAVOR_VAULT_PRODUCTS]);
  const [addedId, setAddedId] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchLiveProducts() {
      try {
        const data = await api.getProducts();
        if (Array.isArray(data) && data.length > 0) {
          const mapped: Product[] = data.map((p: any) => {
            const catSlug = (p.category?.slug || p.category_slug || '').toLowerCase();
            const text = ((p.slug || '') + ' ' + (p.name || '') + ' ' + catSlug).toLowerCase();

            let category: ProductCategory = 'fruits';
            if (text.includes('butter') || text.includes('milk') || text.includes('cream')) {
              category = 'butter';
            } else if (text.includes('coffee') || text.includes('cappuccino') || text.includes('espresso')) {
              category = 'coffee';
            } else if (text.includes('eclair') || text.includes('peanut') || text.includes('chocolate')) {
              category = 'eclairs';
            } else if (text.includes('family') || text.includes('عيلة') || text.includes('picnic') || text.includes('sharing') || text.includes('canister')) {
              category = 'family';
            }

            return {
              id: p.id,
              name: p.name,
              tagline: p.tagline || p.flavor_name || 'Artisanal Hand-Pulled Soft Toffee',
              description: p.description || p.tagline || '',
              badge: p.badge || (p.is_featured ? 'FAVORITE' : undefined),
              badgeType: p.badge_type || 'gold',
              price: Number(p.price) || 24,
              weight: p.weight || '250g Pouch',
              category,
              rating: p.rating ? Number(p.rating) : 4.97,
              reviewsCount: p.reviews_count ? Number(p.reviews_count) : 240,
              chewiness: p.chewiness_score ? Number(p.chewiness_score) : 9.5,
              fruitImpact: {
                label: p.fruit_impact_label || 'Fruit Impact',
                score: p.fruit_impact_score ? Number(p.fruit_impact_score) : 9.6
              },
              fruitNotes: Array.isArray(p.fruit_notes)
                ? p.fruit_notes
                : ['100% Real Purée', 'Browned Butter', 'Tahitian Vanilla'],
              image: p.image_url || p.image || '/images/toomakt/cat_fruity_candy.webp',
              accentColor: p.accent_color || '#C26715',
              lightBgColor: p.light_bg_color || '#FAF5EE',
              isPopular: Boolean(p.is_featured),
              pieces_per_pack: p.pieces_per_pack || 24,
              stock_quantity: p.stock_quantity ?? 80
            };
          });

          // Deduplicate and set
          setProducts(mapped);
        }
      } catch (err) {
        console.error('Error fetching products for FlavorVault:', err);
      }
    }

    fetchLiveProducts();
  }, []);

  const tabs: { id: ProductCategory; label: string; arabic: string }[] = [
    { id: 'all', label: 'All Confections', arabic: 'جميع النكهات' },
    { id: 'fruits', label: 'Fruit Candies', arabic: 'كاندي الفواكه' },
    { id: 'butter', label: 'Butter & Milk', arabic: 'حليب وبتر' },
    { id: 'coffee', label: 'Coffee & Bonbons', arabic: 'قهوة وكابتشينو' },
    { id: 'eclairs', label: 'Eclairs & Peanut', arabic: 'إكليرز وشوكولاتة' },
    { id: 'family', label: 'Family Collections', arabic: 'عيلة توماكت' }
  ];

  const filteredProducts = activeTab === 'all'
    ? products
    : products.filter(p => p.category === activeTab);

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const handleShopNavigation = () => {
    if (onShopAll) {
      onShopAll();
    } else {
      navigateTo('shop');
    }
  };

  return (
    <section id="flavors" className="py-20 bg-[#FAF6F0] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-[#EBE1D5]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C26715] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              The Confection Palette
            </span>
            <h2 className="mt-2 text-3xl sm:text-5xl font-serif font-black text-[#2B170E] tracking-tight">
              Explore the Flavor Vault
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p className="max-w-md text-xs sm:text-sm text-[#6E5D52] leading-relaxed">
              Each flavor begins with orchard-ripened fruit purée, swirled gently into hand-pulled golden dairy toffee.
            </p>
            <button
              onClick={handleShopNavigation}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#2B170E]/15 text-xs font-bold text-[#2B170E] hover:bg-[#FAF5EE] hover:border-[#C26715] transition shadow-xs whitespace-nowrap"
            >
              <span>View All in Shop ({products.length})</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C26715]" />
            </button>
          </div>
        </div>

        {/* Filter Category Pills */}
        <div className="mt-8 flex flex-wrap items-center gap-2 sm:gap-3">
          {tabs.map(tab => {
            const count = tab.id === 'all'
              ? products.length
              : products.filter(p => p.category === tab.id).length;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-[#2B170E] text-white shadow-sm'
                    : 'bg-[#FFFFFF] text-[#6E5D52] hover:text-[#2B170E] border border-[#E5DACD] hover:border-[#C26715]'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] opacity-75 font-mono px-1.5 py-0.2 rounded-full bg-black/10">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Flavor Cards Grid */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isJustAdded = addedId === product.id;

            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="bg-[#FFFFFF] rounded-2xl border border-[#E9E0D4] overflow-hidden shadow-soft hover:shadow-medium hover:border-[#D5C1AE] transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  {/* Card Image Area with Badge */}
                  <div className="relative aspect-4/3 overflow-hidden bg-[#FBF7F2] p-3 flex items-center justify-center">
                    {product.badge && (
                      <span className="absolute top-3 left-3 z-10 text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs bg-[#2B170E] text-[#FFF9F2]">
                        {product.badge}
                      </span>
                    )}

                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                  </div>

                  {/* Card Content Area */}
                  <div className="p-4 sm:p-5">
                    {/* Title with decorative bullet */}
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: product.accentColor }}
                      ></span>
                      <h3 className="font-serif font-bold text-base sm:text-lg text-[#2B170E] group-hover:text-[#C26715] transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </div>

                    <p className="mt-2 text-xs text-[#736359] line-clamp-2 leading-relaxed h-8">
                      {product.tagline}
                    </p>

                    {/* Sensory Metrics */}
                    <div className="mt-4 pt-3 border-t border-[#F2EAE0] space-y-2 text-[11px]">
                      <div className="flex items-center justify-between text-[#806B5F]">
                        <span>Chewiness Index</span>
                        <span className="font-bold text-[#2B170E]">
                          {product.chewiness} / 10
                        </span>
                      </div>
                      <div className="w-full bg-[#EFE7DC] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#C26715] h-full rounded-full"
                          style={{ width: `${product.chewiness * 10}%` }}
                        ></div>
                      </div>

                      <div className="flex items-center justify-between text-[#806B5F] pt-1">
                        <span>{product.fruitImpact?.label || 'Flavor Impact'}</span>
                        <span className="font-bold text-[#2B170E]">
                          {product.fruitImpact?.score || 9.5} / 10
                        </span>
                      </div>
                      <div className="w-full bg-[#EFE7DC] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(product.fruitImpact?.score || 9.5) * 10}%`,
                            backgroundColor: product.accentColor
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer price & add action */}
                <div className="p-4 pt-0 sm:p-5 sm:pt-0 flex items-center justify-between border-t border-[#F7F2EC] mt-2">
                  <div>
                    <span className="text-base sm:text-lg font-serif font-black text-[#2B170E]">
                      {product.price.toFixed(2)} EGP
                    </span>
                    <span className="block text-[10px] uppercase tracking-wider text-[#9E8B80]">
                      {product.weight}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleQuickAdd(e, product)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      isJustAdded
                        ? 'bg-[#2E7D32] text-white scale-110'
                        : 'bg-[#2B170E] hover:bg-[#C26715] text-white shadow-xs hover:shadow-md'
                    }`}
                    title="Add to cart"
                    aria-label={`Add ${product.name} to cart`}
                  >
                    {isJustAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner to Visit Shop */}
        <div className="mt-14 text-center">
          <button
            onClick={handleShopNavigation}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#2B170E] hover:bg-[#C26715] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-xl hover:scale-102"
          >
            <span>Explore All {products.length} Confections in Shop</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
