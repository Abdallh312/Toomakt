import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ArrowLeft, ShieldCheck, Heart, Award, Flame, Package, Truck, Building2, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { HERO_PRODUCT } from '../data/toomaktData';
import { Product } from '../types';

interface ProductLinesSectionProps {
  onSelectProduct?: (p: Product) => void;
  onExploreCatalog?: () => void;
}

export const ProductLinesSection: React.FC<ProductLinesSectionProps> = ({
  onSelectProduct,
  onExploreCatalog
}) => {
  const { addToCart } = useCart();
  const { t, isRtl, formatPrice } = useLanguage();
  const [activeTab, setActiveTab] = useState<'all' | 'confections' | 'services'>('all');

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const offerings = [
    {
      id: 'fruity-toffees',
      type: 'confection',
      title: t('provide_card1_title'),
      tag: t('provide_card1_tag'),
      desc: t('provide_card1_desc'),
      image3d: '/images/3d_cutouts/1/1.webp',
      badge: isRtl ? 'الأكثر طلباً' : 'Bestseller',
      price: 22.00,
      accentColor: '#C2293E',
      bgGradient: 'from-[#C2293E]/10 to-transparent',
      productData: {
        ...HERO_PRODUCT,
        id: 'fruit-candy-pouch',
        name: isRtl ? 'كاندي وتوفي الفواكه المشكلة' : 'Fruity Candy & Orchard Toffee',
        price: 22.00,
        image: '/images/toomakt/cat_fruity_candy.webp'
      }
    },
    {
      id: 'butter-milk',
      type: 'confection',
      title: t('provide_card2_title'),
      tag: t('provide_card2_tag'),
      desc: t('provide_card2_desc'),
      image3d: '/images/3d_cutouts/8/1.webp',
      badge: isRtl ? 'كراميل نورماندي' : 'Normandy Cream',
      price: 24.00,
      accentColor: '#DF9B35',
      bgGradient: 'from-[#DF9B35]/10 to-transparent',
      productData: {
        ...HERO_PRODUCT,
        id: 'butter-milk-pouch',
        name: isRtl ? 'توفي زبدة نورماندي والحليب' : 'Butter & Milk Velvet Toffee',
        price: 24.00,
        image: '/images/toomakt/cat_butter_milk_toffee.webp'
      }
    },
    {
      id: 'coffee-cocoa',
      type: 'confection',
      title: t('provide_card3_title'),
      tag: t('provide_card3_tag'),
      desc: t('provide_card3_desc'),
      image3d: '/images/3d_cutouts/6/1.webp',
      badge: isRtl ? 'إسبريسو أرابيكا' : 'Arabica Espresso',
      price: 26.00,
      accentColor: '#A35315',
      bgGradient: 'from-[#A35315]/10 to-transparent',
      productData: {
        ...HERO_PRODUCT,
        id: 'coffee-cappuccino-pouch',
        name: isRtl ? 'بونبون القهوة وإكلير الشوكولاتة' : 'Roasted Arabica & Cocoa Bonbon',
        price: 26.00,
        image: '/images/toomakt/cat_coffee_cappuccino.webp'
      }
    },
    {
      id: 'harvest-tins',
      type: 'confection',
      title: t('provide_card4_title'),
      tag: t('provide_card4_tag'),
      desc: t('provide_card4_desc'),
      image3d: '/images/3d_cutouts/7/1.webp',
      badge: isRtl ? 'علبة الهدايا الفاخرة' : 'Gift Harvest Box',
      price: 28.00,
      accentColor: '#5C3189',
      bgGradient: 'from-[#5C3189]/10 to-transparent',
      productData: HERO_PRODUCT
    },
    {
      id: 'cold-shipping',
      type: 'service',
      title: t('provide_card5_title'),
      tag: t('provide_card5_tag'),
      desc: t('provide_card5_desc'),
      image3d: '/images/3d_cutouts/4/1.webp',
      badge: isRtl ? '27 محافظة مصرية' : '27 Governorates',
      price: null,
      accentColor: '#006F9E',
      bgGradient: 'from-[#006F9E]/10 to-transparent'
    },
    {
      id: 'corporate-wholesale',
      type: 'service',
      title: t('provide_card6_title'),
      tag: t('provide_card6_tag'),
      desc: t('provide_card6_desc'),
      image3d: '/images/3d_cutouts/10/1.webp',
      badge: isRtl ? 'للفنادق والشركات' : 'Bespoke Atelier',
      price: null,
      accentColor: '#2B170E',
      bgGradient: 'from-[#2B170E]/10 to-transparent'
    }
  ];

  const filteredOfferings = offerings.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'confections') return item.type === 'confection';
    if (activeTab === 'services') return item.type === 'service';
    return true;
  });

  return (
    <section id="what-we-provide" className="py-24 bg-[#FAF5EE] border-b border-[#EBDDCF] relative overflow-hidden">
      {/* Decorative ambient gradient backdrop */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#E89228]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[500px] h-[500px] bg-[#C2293E]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-bold uppercase tracking-[0.2em] text-[#C26715] flex items-center gap-2 mb-3"
            >
              <Sparkles className="w-4 h-4 text-[#C26715]" />
              <span>{t('provide_badge')}</span>
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-5xl font-serif font-black text-[#2B170E] tracking-tight leading-tight"
            >
              {t('provide_title')}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-3 text-sm sm:text-base text-[#735F52] leading-relaxed"
            >
              {t('provide_subtitle')}
            </motion.p>
          </div>

          {/* Filter Pills with Motion layoutId sliding indicator */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white border border-[#E0D2C2] shadow-xs self-start md:self-end relative">
            {[
              { id: 'all', label: t('provide_tab_all') },
              { id: 'confections', label: t('provide_tab_fruity') },
              { id: 'services', label: t('provide_tab_wholesale') }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer z-10 ${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'text-[#7A6B63] hover:text-[#2B170E]'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="productLinesFilterPill"
                    className="absolute inset-0 bg-[#2B170E] rounded-xl shadow-xs -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 6 Studio Offering Cards with 3D Centerpieces */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredOfferings.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                whileHover={{
                  y: -8,
                  transition: { type: 'spring', stiffness: 350, damping: 20 }
                }}
                className="bg-white rounded-3xl p-6 border border-[#E9E0D4] shadow-xs hover:shadow-2xl hover:border-[#D0BDAA] transition-colors duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Subtle top corner gradient */}
                <div
                  className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full bg-gradient-to-bl ${item.bgGradient} opacity-60 pointer-events-none group-hover:scale-125 transition-transform duration-500`}
                />

                <div>
                  {/* Top Badge & 3D Centerpiece Showcase */}
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#FAF5EE] border border-[#E8DFD3] text-[#2B170E]">
                      {item.badge}
                    </span>
                    <span
                      className="text-[10px] font-mono uppercase font-bold tracking-wider"
                      style={{ color: item.accentColor }}
                    >
                      {item.tag}
                    </span>
                  </div>

                  {/* 3D Floating Asset Viewport */}
                  <div className="relative h-44 sm:h-48 rounded-2xl bg-[#FAF5EE]/70 border border-[#F0E6D8] mb-5 flex items-center justify-center p-4 overflow-hidden group-hover:bg-[#FAF5EE] transition-colors">
                    <motion.img
                      src={item.image3d}
                      alt={item.title}
                      animate={{ y: [0, -6, 0], rotate: [0, 2, 0] }}
                      transition={{ duration: 3.5 + idx * 0.5, repeat: Infinity, ease: 'easeInOut' }}
                      className="max-h-full max-w-full object-contain filter drop-shadow(0 12px 18px rgba(0,0,0,0.22)) group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-serif font-bold text-xl text-[#2B170E] group-hover:text-[#C26715] transition-colors leading-snug mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#6B5A4E] leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-5 mt-5 border-t border-[#F2EAE0] flex items-center justify-between relative z-10">
                  {item.price ? (
                    <div>
                      <span className="text-[10px] text-[#9E8B80] uppercase tracking-wider block">
                        {isRtl ? 'السعر' : 'Starting From'}
                      </span>
                      <span className="font-serif font-black text-lg text-[#2B170E]">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#C26715]">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isRtl ? 'خدمة معملية مضمونة' : 'Atelier Guaranteed'}</span>
                    </div>
                  )}

                  {item.productData ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                      type="button"
                      onClick={() => {
                        if (onSelectProduct && item.productData) {
                          onSelectProduct(item.productData);
                        } else if (item.productData) {
                          addToCart(item.productData);
                        }
                      }}
                      className="bg-[#2B170E] hover:bg-[#C26715] text-white text-xs font-bold px-4 py-2.5 rounded-full transition-colors flex items-center gap-1.5 shadow-xs hover:shadow-md cursor-pointer"
                    >
                      <span>{t('btn_add_to_cart')}</span>
                      <ArrowIcon className="w-3.5 h-3.5" />
                    </motion.button>
                  ) : (
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                      href="#store-content"
                      className="bg-[#FAF5EE] hover:bg-[#2B170E] text-[#2B170E] hover:text-white border border-[#E0D2C2] text-xs font-bold px-4 py-2.5 rounded-full transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <span>{isRtl ? 'تفاصيل الخدمة' : 'Learn More'}</span>
                      <ArrowIcon className="w-3.5 h-3.5" />
                    </motion.a>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
