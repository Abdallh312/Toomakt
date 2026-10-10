import React from 'react';
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { ScrollReveal } from './ScrollReveal';

interface BrandFlavorShowcaseSectionProps {
  onExploreProducts: () => void;
}

export const BrandFlavorShowcaseSection: React.FC<BrandFlavorShowcaseSectionProps> = ({
  onExploreProducts,
}) => {
  const { isRtl } = useLanguage();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const flavorFamilies = [
    {
      id: 'coffee',
      family: isRtl ? 'قهوة وكابتشينو' : 'Coffee & Cappuccino',
      title: isRtl ? 'بونبون كابتشينو سائل القهوة' : 'Cappuccino Candies',
      tagline: isRtl ? 'مستخلصات سائل القهوة الطبيعية مع حبوب إيطالية' : 'Natural Italian coffee liquid center',
      description: isRtl
        ? 'بونبون قهوة وكابتشينو فاخر محشو بسائل القهوة الطبيعية المركزة مع حبوب البن الإيطالية المحمصة.'
        : 'Protein and Extracts of Coffee Liquid. Premium cappuccino bonbon filled with natural roasted Italian coffee extract.',
      image: '/images/drive_products/01_cappuccino_candies_shop.webp',
      badge: isRtl ? 'الأكثر طلباً' : 'Bestseller',
      accent: '#4A2E18',
    },
    {
      id: 'toffee',
      family: isRtl ? 'توفي الحليب الفاخر' : 'European Milk Toffee',
      title: isRtl ? 'توفي حليب جودة أوروبا' : 'Milk Toffee Center Milk',
      tagline: isRtl ? 'حليب طبيعي كامل الدسم وكريمة الفانيليا' : 'Full cream milk & natural vanilla cream',
      description: isRtl
        ? 'توفي حليب ناعم بجودة أوربية محشو باللبن الطبيعي وكريمة الفانيليا الفاخرة.'
        : 'Toomakt Milk Center Milk Europe Quality. Soft toffee stuffed with natural whole milk and delicate vanilla cream.',
      image: '/images/drive_products/02_milk_toffee_shop.webp',
      badge: isRtl ? 'جودة أوروبا' : 'Europe Quality',
      accent: '#1E4B8A',
    },
    {
      id: 'chocolate',
      family: isRtl ? 'اكلير الزبدة والشوكولاتة' : 'Butter & Chocolate Eclairs',
      title: isRtl ? 'اكلير زبدة محشو بالشوكولاتة' : 'Butter Eclairs Chocolate',
      tagline: isRtl ? 'زبدة طبيعية نقية مع قلب شوكولاتة ذائب' : 'Rich butter toffee with melting chocolate',
      description: isRtl
        ? 'توفي اكلير مصنوع من الزبدة الطبيعية الفاخرة ومحشو بشوكولاتة سائلة ناعمة تذوب في الفم.'
        : 'Artisanal butter eclair toffee filled with velvety chocolate cream and whole milk.',
      image: '/images/drive_products/03_butter_eclairs_chocolate_shop.webp',
      badge: isRtl ? 'شوكولاتة فاخرة' : 'Rich Chocolate',
      accent: '#D4AF37',
    },
    {
      id: 'fruit',
      family: isRtl ? 'فواكه طبيعية' : 'Natural Fruit Toffee',
      title: isRtl ? 'توفي فواكه بعسل الفواكه' : 'Fruit Toffee Honey Filled',
      tagline: isRtl ? 'تشكيلة نكهات الفواكه مع عسل الفاكهة النقي' : 'Assorted natural fruits with fruit honey core',
      description: isRtl
        ? 'توفي ناعم متعدد النكهات (فراولة، ليمون، تفاح أخضر) محشو بعسل وسيرب الفواكه الطبيعي.'
        : 'Soft chewy toffee with vibrant fruit extracts filled with liquid natural fruit honey.',
      image: '/images/drive_products/04_fruit_toffee_shop.webp',
      badge: isRtl ? 'فواكه منعشة' : 'Fresh Fruits',
      accent: '#E63946',
    },
  ];

  return (
    <section className="py-16 sm:py-20 md:py-28 bg-[#FAF7F2] dark:bg-[#120D11] border-b border-[#E8E2D7] dark:border-[#33242E] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Scroll Reveal */}
        <ScrollReveal yOffset={20}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16 text-left rtl:text-right">
            <div className="max-w-2xl">
              <span className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-[#736B63] dark:text-[#C8BEB5] block mb-3">
                {isRtl ? 'لوحة التذوق الحرفية' : 'THE TASTING PALETTE'}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1A1A1A] dark:text-[#F7F3EC] tracking-tight leading-tight">
                {isRtl ? 'أربعة عوالم من الفاكهة الطبيعية.' : 'Four expressions of pure fruit.'}
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#736B63] dark:text-[#C8BEB5] font-light leading-relaxed">
                {isRtl
                  ? 'من قهوة الإسبريسو الإيطالية وتوفي الحليب الأوربي، إلى اكلير الشوكولاتة الذائبة وفواكه البساتين الطبيعية.'
                  : 'From roasted Italian espresso and European milk toffee, to melting Belgian chocolate eclairs and wild fruit purées.'}
              </p>
            </div>

            <div className="shrink-0">
              <button
                onClick={onExploreProducts}
                className="btn-primary group flex items-center gap-2 cursor-pointer w-full sm:w-auto shadow-soft hover:shadow-soft-md"
              >
                <span>{isRtl ? 'عرض كل المنتجات في المتجر' : 'Explore The Full Collection'}</span>
                <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* 4 Flavor Family Cards Grid with Staggered Scroll Reveal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6 lg:gap-8">
          {flavorFamilies.map((fam, idx) => (
            <ScrollReveal key={fam.id} delay={idx * 0.12} yOffset={30}>
              <div
                className="bg-white dark:bg-[#1B1419] rounded-2xl border border-[#E8E2D7] dark:border-[#33242E] overflow-hidden hover:border-[#1A1A1A] dark:hover:border-[#E8BD6D] hover:shadow-soft-md transition-all duration-300 flex flex-col group cursor-pointer h-full"
                onClick={() => {
                  const el = document.getElementById('featured-products');
                  if (el) {
                    if ((window as any).scrollToSmooth) {
                      (window as any).scrollToSmooth(el, -30);
                    } else {
                      el.scrollIntoView({ behavior: 'smooth' });
                    }
                  } else {
                    onExploreProducts();
                  }
                }}
              >
                {/* Image Frame */}
                <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-[#FAF7F2] dark:bg-[#120D11]">
                  <img
                    src={fam.image}
                    alt={fam.title}
                    width="500"
                    height="500"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  
                  {/* Badge */}
                  <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 bg-white/90 dark:bg-[#1B1419]/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wider uppercase text-[#1A1A1A] dark:text-[#F7F3EC] border border-[#E8E2D7] dark:border-[#33242E]">
                    {fam.badge}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-mono tracking-wider uppercase text-[#736B63] dark:text-[#C8BEB5] block mb-1">
                      {fam.family}
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl font-normal text-[#1A1A1A] dark:text-[#F7F3EC] mb-2 group-hover:text-[#3C1322] dark:group-hover:text-[#E8BD6D] transition-colors">
                      {fam.title}
                    </h3>
                    <p className="text-xs text-[#736B63] dark:text-[#C8BEB5] font-light leading-relaxed mb-4">
                      {fam.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E8E2D7] dark:border-[#33242E] flex items-center justify-between text-xs text-[#1A1A1A] dark:text-[#F7F3EC] font-medium">
                    <span className="text-[#736B63] dark:text-[#C8BEB5] font-light text-[11px]">{fam.tagline}</span>
                    <ArrowIcon className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform text-[#3C1322] dark:text-[#E8BD6D]" />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Bottom Banner Invitation */}
        <ScrollReveal delay={0.2} yOffset={20}>
          <div className="mt-12 sm:mt-16 p-6 sm:p-8 rounded-2xl bg-[#F4EFEA] dark:bg-[#1B1419] border border-[#E8E2D7] dark:border-[#33242E] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left rtl:sm:text-right">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1A1A1A] dark:bg-[#241A21] text-[#FAF7F2] dark:text-[#E8BD6D] border border-transparent dark:border-[#E8BD6D]/30 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-[#FFD147] dark:text-[#E8BD6D]" />
              </div>
              <div>
                <h4 className="font-serif text-base sm:text-lg font-normal text-[#1A1A1A] dark:text-[#F7F3EC]">
                  {isRtl ? 'جاهز لاستكشاف التشكيلة الكاملة؟' : 'Ready to experience all confections?'}
                </h4>
                <p className="text-xs text-[#736B63] dark:text-[#C8BEB5] font-light">
                  {isRtl
                    ? 'اختر نكهاتك المفضلة وتعرف على مواصفات التغليف والعلب مع شحن مبرد لجميع المحافظات.'
                    : 'Browse weights, piece counts, tasting notes, and order directly to your door.'}
                </p>
              </div>
            </div>

            <button
              onClick={onExploreProducts}
              className="btn-primary shrink-0 w-full sm:w-auto text-xs cursor-pointer shadow-soft hover:shadow-soft-md"
            >
              <span>{isRtl ? 'الانتقال إلى صفحة المنتجات' : 'Go to Products Page'}</span>
            </button>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};
