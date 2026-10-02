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
      id: 'mango',
      family: isRtl ? 'نكهات المانجو' : 'Golden Mango',
      title: isRtl ? 'مانجو صن بيم' : 'Mango Sunbeam',
      tagline: isRtl ? 'حلاوة مشمسة وقوام زبدي غني' : 'Creamy, bright, buttery finish',
      description: isRtl
        ? 'بيوريه مانجو ألفونسو طبيعي يُطهى ببطء مع زبدة النورماندي الحلوة وفانيليا تاهيتي.'
        : 'Pure Alphonso mango purée slow-simmered with Normandy sweet cream butter into an explosive sunny chew.',
      image: '/images/products/mango_sunbeam.jpg',
      badge: isRtl ? 'الأكثر طلباً' : 'Bestseller',
      accent: '#FFD147',
    },
    {
      id: 'berry',
      family: isRtl ? 'توت الغابات' : 'Wild Berries',
      title: isRtl ? 'بيري أفترجلو' : 'Berry Afterglow',
      tagline: isRtl ? 'طبقات التوت البري مع الكريمة الفاخرة' : 'Layered berries, delicate cream',
      description: isRtl
        ? 'فراولة ألبية برية وتوت بري داكن ممزوجان بنعومة مع الكريمة الأوروبية الغنية.'
        : 'Cold-macerated wild alpine strawberries and raspberries swirling in velvety cultured sweet cream.',
      image: '/images/products/berry_afterglow.jpg',
      badge: isRtl ? 'مخملي' : 'Velvety',
      accent: '#C84B5B',
    },
    {
      id: 'citrus',
      family: isRtl ? 'الحمضيات الإيطالية' : 'Zesty Citrus',
      title: isRtl ? 'سيتروس كوميت' : 'Citrus Comet',
      tagline: isRtl ? 'حموضة متلألئة وانتعاش طبيعي' : 'Bright citrus, sparkling acidity',
      description: isRtl
        ? 'ليمون صقلية معصور على البارد وليمون حامض يمتزجان بتناغم مع التوفي الكراميلي.'
        : 'Cold-pressed Mediterranean lemons, sun-warmed limes, and slow-churned butter toffee.',
      image: '/images/products/citrus_comet.jpg',
      badge: isRtl ? 'منعش' : 'Sparkling',
      accent: '#88C057',
    },
    {
      id: 'gift-boxes',
      family: isRtl ? 'مجموعات الإهداء' : 'Gift Collections',
      title: isRtl ? 'صناديق الهدايا الفاخرة' : 'Sun Chaser & Reserve',
      tagline: isRtl ? 'تشكيلة مختارة في صناديق كتانية راقية' : 'Curated presentation boxes',
      description: isRtl
        ? 'مجموعات مختارة من إبداعاتنا ملفوفة يدوياً بعناية في صناديق كتانية مذهبة تليق بأرقى المناسبات.'
        : 'Curated gift boxes featuring our finest fruit toffees in embossed linen keepsake boxes.',
      image: '/images/products/sun_chaser_box.jpg',
      badge: isRtl ? 'فاخر للإهداء' : 'Deluxe Keepsake',
      accent: '#D4AF37',
    },
  ];

  return (
    <section className="py-16 sm:py-20 md:py-28 bg-[#FAF7F2] border-b border-[#E8E2D7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Scroll Reveal */}
        <ScrollReveal yOffset={20}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16 text-left rtl:text-right">
            <div className="max-w-2xl">
              <span className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-[#736B63] block mb-3">
                {isRtl ? 'لوحة التذوق الحرفية' : 'THE TASTING PALETTE'}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1A1A1A] tracking-tight leading-tight">
                {isRtl ? 'أربعة عوالم من الفاكهة الطبيعية.' : 'Four expressions of pure fruit.'}
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#736B63] font-light leading-relaxed">
                {isRtl
                  ? 'من مانجو الألفونسو المشمسة إلى توت الغابات البرية وحمضيات صقلية، كل نكهة تحكي قصة بطء الصنعة وجودة المكونات.'
                  : 'From sunlit Alphonso mangoes to layered mountain berries, each confection is crafted slowly to celebrate its raw fruit origin.'}
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
                className="bg-white rounded-2xl border border-[#E8E2D7] overflow-hidden hover:border-[#1A1A1A] hover:shadow-soft-md transition-all duration-300 flex flex-col group cursor-pointer h-full"
                onClick={onExploreProducts}
              >
                {/* Image Frame */}
                <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-[#FAF7F2]">
                  <img
                    src={fam.image}
                    alt={fam.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  
                  {/* Badge */}
                  <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wider uppercase text-[#1A1A1A] border border-[#E8E2D7]">
                    {fam.badge}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-mono tracking-wider uppercase text-[#736B63] block mb-1">
                      {fam.family}
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl font-normal text-[#1A1A1A] mb-2 group-hover:text-[#3C1322] transition-colors">
                      {fam.title}
                    </h3>
                    <p className="text-xs text-[#736B63] font-light leading-relaxed mb-4">
                      {fam.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E8E2D7] flex items-center justify-between text-xs text-[#1A1A1A] font-medium">
                    <span className="text-[#736B63] font-light text-[11px]">{fam.tagline}</span>
                    <span className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform text-[#3C1322]">
                      →
                    </span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Bottom Banner Invitation */}
        <ScrollReveal delay={0.2} yOffset={20}>
          <div className="mt-12 sm:mt-16 p-6 sm:p-8 rounded-2xl bg-[#F4EFEA] border border-[#E8E2D7] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left rtl:sm:text-right">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1A1A1A] text-[#FAF7F2] flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-[#FFD147]" />
              </div>
              <div>
                <h4 className="font-serif text-base sm:text-lg font-normal text-[#1A1A1A]">
                  {isRtl ? 'جاهز لاستكشاف التشكيلة الكاملة؟' : 'Ready to experience all six confections?'}
                </h4>
                <p className="text-xs text-[#736B63] font-light">
                  {isRtl
                    ? 'اختر نكهاتك المفضلة أو ركّب صندوقك الخاص من متجرنا المخصص.'
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
