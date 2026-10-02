import React from 'react';
import { motion } from 'framer-motion';
import { Award, Clock, Heart, Sparkles, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface BrandStorySectionProps {
  onReadMore?: () => void;
}

export const BrandStorySection: React.FC<BrandStorySectionProps> = ({ onReadMore }) => {
  const { t, isRtl } = useLanguage();

  const milestones = [
    {
      year: t('timeline_2021_year'),
      title: t('timeline_2021_title'),
      description: t('timeline_2021_desc'),
      image3d: '/images/3d_cutouts/6/1.webp',
      accentColor: '#D58218'
    },
    {
      year: t('timeline_2022_year'),
      title: t('timeline_2022_title'),
      description: t('timeline_2022_desc'),
      image3d: '/images/3d_cutouts/1/1.webp',
      accentColor: '#C2293E'
    },
    {
      year: t('timeline_2023_year'),
      title: t('timeline_2023_title'),
      description: t('timeline_2023_desc'),
      image3d: '/images/3d_cutouts/4/1.webp',
      accentColor: '#006F9E'
    },
    {
      year: t('timeline_2024_year'),
      title: t('timeline_2024_title'),
      description: t('timeline_2024_desc'),
      image3d: '/images/3d_cutouts/8/1.webp',
      accentColor: '#DF9B35'
    },
  ];

  return (
    <section id="started" className="py-24 bg-[#23120A] text-[#FAF6F0] relative overflow-hidden border-b border-stone-800">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-[#C26715]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[450px] h-[450px] bg-[#E89228]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold uppercase tracking-wider text-amber-300 mb-4 backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{t('timeline_badge')}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-serif font-black tracking-tight leading-tight text-white"
          >
            {t('timeline_title')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-amber-100/75 leading-relaxed font-normal"
          >
            {t('timeline_subtitle')}
          </motion.p>
        </div>

        {/* 4 Interactive Story Milestone Cards with 3D Icons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {milestones.map((m, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              whileHover={{ y: -6 }}
              className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between group backdrop-blur-xs relative overflow-hidden"
            >
              {/* Subtle top ambient glow */}
              <div
                className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity"
                style={{ backgroundColor: m.accentColor }}
              />

              <div>
                {/* 3D floating candy preview */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4 relative mx-auto sm:mx-0">
                  <motion.img
                    src={m.image3d}
                    alt={m.title}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 3 + idx, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-full h-full object-contain filter drop-shadow(0 8px 12px rgba(0,0,0,0.4)) group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                <span
                  className="text-xs font-mono font-bold uppercase tracking-wider block mb-2 px-2.5 py-1 rounded-full bg-white/10 w-fit"
                  style={{ color: m.accentColor }}
                >
                  {m.year}
                </span>

                <h3 className="font-serif font-bold text-lg text-white mb-2.5 leading-snug group-hover:text-amber-200 transition-colors">
                  {m.title}
                </h3>

                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
                  {m.description}
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-white/10 flex items-center justify-between text-xs text-stone-400">
                <span className="font-mono">Milestone 0{idx + 1}</span>
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: m.accentColor }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Master Confectioner Quote Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-amber-950/40 via-stone-900/70 to-amber-950/40 border border-amber-900/50 text-center max-w-4xl mx-auto shadow-2xl relative"
        >
          <p className="font-serif text-lg sm:text-2xl italic text-amber-100 font-medium leading-relaxed">
            {t('timeline_quote')}
          </p>
          <div className="mt-4 text-xs sm:text-sm text-amber-300/90 font-mono uppercase tracking-wider">
            {t('timeline_quote_author')}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
