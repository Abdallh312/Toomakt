import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { APPROACH_PILLARS } from '../data/toomaktData';

interface BrandMissionSectionProps {
  onNavigateStory?: () => void;
}

export const BrandMissionSection: React.FC<BrandMissionSectionProps> = ({ onNavigateStory }) => {
  const { isRtl } = useLanguage();

  return (
    <section id="our-approach" className="py-20 md:py-28 bg-[#FAF7F2] border-b border-[#E8E2D7] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-left rtl:text-right mb-16 md:mb-20 max-w-2xl">
          <span className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-[#736B63] block mb-3">
            {isRtl ? 'طريقتنا الحرفية' : 'OUR APPROACH'}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1A1A1A] tracking-tight">
            {isRtl ? 'حلاوة أهدأ وأعمق.' : 'A quieter kind of sweet.'}
          </h2>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {APPROACH_PILLARS.map((pillar, idx) => (
            <motion.div
              key={pillar.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="bg-[#F4EFEA] border border-[#E8E2D7] rounded-2xl p-8 flex flex-col justify-between hover:border-[#D8CFBF] transition-colors"
            >
              <div>
                <span className="font-serif text-3xl sm:text-4xl font-light text-[#736B63]/60 block mb-6">
                  {pillar.number}
                </span>
                <h3 className="font-serif text-2xl font-normal text-[#1A1A1A] mb-4">
                  {isRtl ? pillar.arabicTitle : pillar.title}
                </h3>
                <p className="text-sm sm:text-base text-[#736B63] leading-relaxed font-light">
                  {isRtl ? pillar.arabicDescription : pillar.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
