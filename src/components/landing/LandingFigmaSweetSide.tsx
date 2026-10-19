import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { PRODUCTS } from '../../data/toomaktData';
import { ProductCard } from '../ProductCard';
import { Product } from '../../types';

interface LandingFigmaSweetSideProps {
  onViewAllProducts: () => void;
  onSelectProduct?: (product: Product) => void;
}

export const LandingFigmaSweetSide: React.FC<LandingFigmaSweetSideProps> = ({
  onViewAllProducts,
  onSelectProduct,
}) => {
  const { isRtl } = useLanguage();

  // Pick 3 signature atelier confections using real data and assets
  const signatureProducts = [
    PRODUCTS.find((p) => p.id === 'cappuccino-candies-1egp') || PRODUCTS[0],
    PRODUCTS.find((p) => p.id === 'milk-toffee-1egp') || PRODUCTS[1],
    PRODUCTS.find((p) => p.id === 'butter-eclairs-1egp') || PRODUCTS[2],
  ];

  return (
    <section
      id="meet-your-sweet-side"
      className="relative w-full bg-[#FAF5EE] text-[#22120C] py-24 sm:py-32 px-6 sm:px-10 lg:px-16 overflow-hidden"
      aria-label="Meet your sweet side"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 sm:mb-20">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] sm:text-xs font-mono tracking-[0.2em] uppercase text-[#963725] font-semibold block">
                {isRtl ? 'تَشْكِيلَةُ الحَلْوَيَاتِ الحِرَفِيَّة' : 'THE ARTISAN SELECTION'}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#963725] bg-[#E58DA5]/20 border border-[#E58DA5]/40 px-2.5 py-0.5 rounded-full font-medium">
                <Sparkles className="w-3 h-3 text-[#E58DA5]" />
                <span>{isRtl ? 'وصفات فرنسية أصلية' : 'Authentic French Recipes'}</span>
              </span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#22120C]">
              {isRtl ? 'تَعَرَّفْ عَلَى جَانِبِكَ الحُلْو.' : 'Meet your sweet side.'}
            </h2>
            <p className="text-sm sm:text-base text-[#22120C]/70 font-light max-w-xl leading-relaxed">
              {isRtl
                ? 'حلوى توفي وبونبون مصنوعة ببطء من زبدة أوروبية فاخرة وسوائل حشوات غنية لا تُنسى.'
                : 'Slow-crafted with pure European butter, natural fruit purées, and rich liquid centers.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onViewAllProducts}
            className="inline-flex items-center gap-2 self-start md:self-auto px-7 py-3.5 rounded-full border border-[#22120C]/25 text-xs sm:text-sm font-sans font-medium text-[#22120C] hover:bg-[#22120C] hover:text-[#FAF5EE] hover:border-[#22120C] hover:shadow-[0_8px_24px_rgba(229,141,165,0.25)] transition-all duration-300 cursor-pointer group shadow-xs will-change-transform"
          >
            <span>{isRtl ? 'عَرْضُ كَافَّةِ التشكيلة (١٤ صنفاً)' : 'View all 14 confections'}</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>

        {/* Grand 3-Column Product Grid with Big Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 items-stretch">
          {signatureProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
              className="h-full flex flex-col"
            >
              <ProductCard
                product={product}
                onSelectProduct={(p) => {
                  if (onSelectProduct) onSelectProduct(p);
                  else onViewAllProducts();
                }}
                showDescription={true}
                className="h-full"
              />
            </motion.div>
          ))}
        </div>

        {/* Footer Notice */}
        <div className="mt-16 sm:mt-20 pt-8 border-t border-[#22120C]/08 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left rtl:sm:text-right">
          <p className="text-xs sm:text-sm font-sans text-[#22120C]/65 font-light">
            {isRtl
              ? 'تغليف آلي إيطالي محكم يعزل الرطوبة بنسبة ١٠٠٪ ليحفظ طراوة الزبدة ونقاء النكهة.'
              : 'Italian automated flow-wrapping preserves European butter texture and sealed freshness.'}
          </p>
          <button
            type="button"
            onClick={onViewAllProducts}
            className="text-xs font-mono text-[#963725] hover:underline font-semibold"
          >
            {isRtl ? 'استكشف كافة الأصناف ←' : 'Browse full catalog →'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default LandingFigmaSweetSide;
