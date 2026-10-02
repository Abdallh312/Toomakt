import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Flame, Droplets, ShieldCheck, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface CompanyIntroSectionProps {
  onExploreProducts?: () => void;
  onOurStory?: () => void;
}

export const CompanyIntroSection: React.FC<CompanyIntroSectionProps> = ({
  onExploreProducts,
  onOurStory,
}) => {
  const { t, isRtl } = useLanguage();

  const pillars = [
    {
      icon: Flame,
      image3d: '/images/3d_cutouts/6/1.webp',
      title: t('company_pillar1_title'),
      description: t('company_pillar1_desc'),
      tag: isRtl ? 'نحاس نقي 245°F' : 'Pure Copper 245°F'
    },
    {
      icon: Droplets,
      image3d: '/images/3d_cutouts/1/2.webp',
      title: t('company_pillar2_title'),
      description: t('company_pillar2_desc'),
      tag: isRtl ? 'فواكه حقيقية 100%' : '100% Orchard Puree'
    },
    {
      icon: ShieldCheck,
      image3d: '/images/3d_cutouts/8/1.webp',
      title: t('company_pillar3_title'),
      description: t('company_pillar3_desc'),
      tag: isRtl ? '84% زبدة أوروبية' : '84% Cultured Butter'
    },
    {
      icon: Clock,
      image3d: '/images/3d_cutouts/3/1.webp',
      title: t('company_pillar4_title'),
      description: t('company_pillar4_desc'),
      tag: isRtl ? 'قوام الـ 45 ثانية' : '45s Signature Curve'
    },
  ];

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section id="company" className="py-24 bg-[#FAF6F0] relative overflow-hidden border-b border-stone-200/80">
      {/* Ambient background blur */}
      <div className="absolute top-1/3 left-0 -translate-x-1/2 w-96 h-96 bg-[#E89228]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 translate-x-1/3 w-80 h-80 bg-[#C2293E]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-900/5 border border-stone-300/80 text-xs font-semibold text-[#8C4A15] mb-4 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C26715]" />
            <span>{t('company_badge')}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-serif font-black text-[#2B170E] tracking-tight leading-tight"
          >
            {t('company_title')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-stone-700 leading-relaxed font-normal"
          >
            {t('company_p1')}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-3 text-sm sm:text-base text-stone-600 leading-relaxed font-normal"
          >
            {t('company_p2')}
          </motion.p>
        </div>

        {/* 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Atelier Stage with 3D Centerpiece */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-3xl overflow-hidden bg-stone-100 border border-stone-200/90 shadow-xl aspect-4/3 sm:aspect-5/4 group">
              <img
                src="/images/toomakt/hero_family_showcase.webp"
                alt="toomakt Artisanal Confections"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent pointer-events-none" />

              {/* Floating 3D Candy Overlay Element */}
              <motion.div
                animate={{ y: [0, -8, 0], rotate: [0, 4, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 w-24 h-24 sm:w-32 sm:h-32 pointer-events-none drop-shadow-2xl z-20"
              >
                <img
                  src="/images/3d_cutouts/1/1.webp"
                  alt="3D toomakt Chew"
                  className="w-full h-full object-contain filter drop-shadow(0 10px 15px rgba(0,0,0,0.3))"
                />
              </motion.div>

              <div className="absolute bottom-6 left-6 right-6 text-white z-10">
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-300 font-semibold block mb-1">
                  {t('company_atelier_batch')}
                </span>
                <p className="font-serif text-lg sm:text-xl font-bold">
                  {t('company_atelier_sub')}
                </p>
              </div>
            </div>

            {/* Floating Metric Badge */}
            <div className="absolute -bottom-6 -right-2 sm:-right-6 bg-white rounded-2xl p-4 sm:p-5 shadow-2xl border border-stone-200/80 flex items-center gap-4 z-20">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200/70 flex items-center justify-center text-[#C26715]">
                <Flame className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-stone-900">245°F</div>
                <div className="text-[11px] text-stone-500 font-medium">
                  {isRtl ? 'حرارة الطهي بالمراجل النحاسية' : 'Precision Copper Simmer'}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: 4 Core Pillars with 3D Icons */}
          <div className="lg:col-span-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {pillars.map((pillar, idx) => {
                const IconComponent = pillar.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    whileHover={{ y: -4, borderColor: '#C26715' }}
                    className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:shadow-md transition-all duration-300 relative group overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FAF5EE] border border-amber-200/60 flex items-center justify-center text-[#C26715]">
                        <IconComponent className="w-5 h-5" />
                      </div>

                      {/* Micro 3D preview thumbnail */}
                      <div className="w-10 h-10 relative">
                        <img
                          src={pillar.image3d}
                          alt={pillar.title}
                          className="w-full h-full object-contain filter drop-shadow(0 4px 6px rgba(0,0,0,0.15)) group-hover:scale-115 transition-transform duration-300"
                        />
                      </div>
                    </div>

                    <span className="inline-block text-[10px] font-mono uppercase font-bold text-[#C26715] tracking-wider mb-1">
                      {pillar.tag}
                    </span>

                    <h3 className="font-serif font-bold text-base text-stone-900 mb-1.5 leading-snug">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed font-normal">
                      {pillar.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              {onExploreProducts && (
                <button
                  type="button"
                  onClick={onExploreProducts}
                  className="px-6 py-3 rounded-xl bg-[#2B170E] hover:bg-[#C26715] text-white text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <span>{t('company_btn_offerings')}</span>
                  <ArrowIcon className="w-3.5 h-3.5" />
                </button>
              )}
              {onOurStory && (
                <button
                  type="button"
                  onClick={onOurStory}
                  className="px-5 py-3 rounded-xl bg-transparent hover:bg-stone-200/60 text-stone-800 text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer border border-stone-300"
                >
                  {t('company_btn_story')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
