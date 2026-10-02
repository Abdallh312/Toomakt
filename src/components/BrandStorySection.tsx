import React from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { RITUAL_STEPS } from '../data/toomaktData';

interface BrandStorySectionProps {
  onReadMore?: () => void;
}

export const BrandStorySection: React.FC<BrandStorySectionProps> = ({ onReadMore }) => {
  const { isRtl } = useLanguage();

  return (
    <div id="story-ritual">
      {/* 1. Process Feature Banner: "Made slowly" */}
      <section className="py-20 md:py-28 bg-[#F4EFEA] border-b border-[#E8E2D7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            
            {/* Visual Card / Media Preview */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 relative"
            >
              <div className="relative rounded-2xl overflow-hidden border border-[#E8E2D7] bg-white shadow-soft group">
                <img
                  src="/images/hero/hero_spec.jpg"
                  alt="Crafting fruit toffee slowly"
                  className="w-full h-[360px] sm:h-[440px] object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-[#1A1A1A]/20 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-[#FAF7F2] text-[#1A1A1A] flex items-center justify-center shadow-soft-lg group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-current translate-x-0.5" />
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 rtl:left-auto rtl:right-4 bg-[#FAF7F2]/90 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-xs font-medium text-[#1A1A1A] border border-[#E8E2D7]">
                  {isRtl ? 'في معمل الحلويات · القاهرة' : 'Atelier craft · Cairo'}
                </div>
              </div>
            </motion.div>

            {/* Narrative & Story Copy */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 text-left rtl:text-right"
            >
              <span className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-[#736B63] block mb-3">
                {isRtl ? 'صنع ببطء' : 'MADE SLOWLY'}
              </span>

              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1A1A1A] tracking-tight leading-tight mb-6">
                {isRtl ? 'صُنعت لتُفتح بتمهل.' : 'Made to be opened slowly.'}
              </h2>

              <p className="text-base sm:text-lg text-[#736B63] font-light leading-relaxed mb-6">
                {isRtl
                  ? 'تبدأ كل دفعة ببيوريه الفاكهة الطبيعية الكاملة، تُطهى على نار هادئة في قدور نحاسية مع الزبدة الأوروبية النقية. لا نتسرع أبداً في وقت التبريد، ولا نستخدم أي نكهات أو ملونات صناعية.'
                  : 'Every batch begins with real fruit purée, simmered in heavy copper kettles with European sweet cream butter. We don\'t rush the setting time, and we never add artificial shortcuts.'}
              </p>

              <p className="text-sm sm:text-base text-[#736B63] font-light leading-relaxed mb-8">
                {isRtl
                  ? 'النتيجة هي قوام يذوب بسلاسة دون أن يلتصق، تاركاً حموضة الفواكه الطبيعية وشذى الكراميل يتفتحان تدريجياً.'
                  : 'The result is a tender chew that yields cleanly without sticking, letting pure fruit acidity and caramel aromas unfold across the palate.'}
              </p>

              {onReadMore && (
                <button
                  onClick={onReadMore}
                  className="btn-link text-sm font-medium"
                >
                  <span>{isRtl ? 'استكشف قصتنا الحرفية ←' : 'Explore our story →'}</span>
                </button>
              )}
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. The Toomakt Ritual Section */}
      <section className="py-20 md:py-28 bg-[#FAF7F2] border-b border-[#E8E2D7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-left rtl:text-right mb-16 max-w-2xl">
            <span className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-[#736B63] block mb-3">
              {isRtl ? 'طقوس التذوق' : 'OUR RITUAL'}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1A1A1A] tracking-tight">
              {isRtl ? 'طقوس توماكت' : 'The Toomakt ritual'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {RITUAL_STEPS.map((step, idx) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white border border-[#E8E2D7] rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-[#1A1A1A] transition-colors"
              >
                <div>
                  <span className="font-serif text-2xl font-light text-[#736B63]/60 block mb-4">
                    #{idx + 1}
                  </span>
                  <h3 className="font-serif text-xl font-normal text-[#1A1A1A] mb-3">
                    {isRtl ? step.arabicTitle : step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#736B63] leading-relaxed font-light">
                    {isRtl ? step.arabicDescription : step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
};
