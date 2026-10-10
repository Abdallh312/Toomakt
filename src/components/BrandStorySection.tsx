import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Pause, Play, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { RITUAL_STEPS } from '../data/toomaktData';

interface BrandStorySectionProps {
  onReadMore?: () => void;
}

export const BrandStorySection: React.FC<BrandStorySectionProps> = ({ onReadMore }) => {
  const { isRtl } = useLanguage();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  // Guarantee video is strictly silent and muted
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.volume = 0;
    }
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div id="story-ritual" className="w-full">
      {/* 1. Process Feature Banner: "Made slowly" with Autoplaying Video */}
      <section className="py-16 sm:py-20 md:py-28 bg-[#F4EFEA] dark:bg-[#120D11] border-b border-[#E8E2D7] dark:border-[#33242E] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            
            {/* Visual Card / Autoplaying Video */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 relative w-full"
            >
              <div
                onClick={togglePlay}
                className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E8E2D7] dark:border-[#33242E] bg-[#0E0A0C] shadow-soft-lg group cursor-pointer aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] max-h-[480px] w-full flex items-center justify-center"
              >
                {/* Ambient backdrop video (Desktop only) */}
                <video
                  src="/videos/toomakt_factory_tour.mp4"
                  poster="/images/hero/hero_factory_poster.webp"
                  preload="none"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="hidden md:block absolute inset-0 w-full h-full object-cover scale-125 blur-2xl opacity-40 pointer-events-none select-none"
                />

                {/* Main Factory Tour Video - Guaranteed 100% Silent */}
                <video
                  ref={videoRef}
                  src="/videos/toomakt_factory_tour.mp4"
                  poster="/images/hero/hero_factory_poster.webp"
                  preload="none"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="relative z-10 max-h-full max-w-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.7)] group-hover:scale-102 transition-transform duration-700 ease-out"
                />

                {/* Subtle vignette gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25 pointer-events-none z-20" />

                {/* Play/Pause state indicator overlay on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 pointer-events-none z-30">
                  <div className="w-14 h-14 rounded-full bg-[#FAF7F2]/90 dark:bg-[#1B1419]/90 backdrop-blur-sm text-[#1A1A1A] dark:text-[#F7F3EC] flex items-center justify-center shadow-soft">
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current translate-x-0.5" />}
                  </div>
                </div>

                {/* Bottom Bar: Badge and Silent Reel Indicator (Strictly No Sound) */}
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex items-center justify-between pointer-events-auto z-30">
                  <div className="bg-[#FAF7F2]/95 dark:bg-[#1B1419]/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-medium text-[#1A1A1A] dark:text-[#F7F3EC] border border-[#E8E2D7] dark:border-[#33242E] shadow-soft flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#88C057] animate-pulse" />
                    <span>{isRtl ? 'جولة حصرية داخل مصنع الزهرة وتوماكت · العاشر من رمضان' : 'Factory Tour & Atelier Craft · Cairo'}</span>
                  </div>

                  <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white/90 border border-white/10 text-[11px] font-mono flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#E8BD6D]" />
                    <span>{isRtl ? 'عرض سينمائي صامت' : 'Silent Cinema'}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Narrative & Story Copy with Scroll Reveal */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 text-left rtl:text-right"
            >
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3C1322] dark:bg-[#E8BD6D]" />
                <span className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-[#736B63] dark:text-[#9C8E83]">
                  {isRtl ? 'صنع ببطء' : 'MADE SLOWLY'}
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1A1A1A] dark:text-[#F7F3EC] tracking-tight leading-tight mb-4 sm:mb-6">
                {isRtl ? 'صُنعت لتُفتح بتمهل.' : 'Made to be opened slowly.'}
              </h2>

              <p className="text-sm sm:text-base md:text-lg text-[#736B63] dark:text-[#C8BEB5] font-light leading-relaxed mb-4 sm:mb-6">
                {isRtl
                  ? 'تبدأ كل دفعة ببيوريه الفاكهة الطبيعية الكاملة، تُطهى على نار هادئة في قدور نحاسية مع الزبدة الأوروبية النقية. لا نتسرع أبداً في وقت التبريد، ولا نستخدم أي نكهات أو ملونات صناعية.'
                  : 'Every batch begins with real fruit purée, simmered in heavy copper kettles with European sweet cream butter. We don\'t rush the setting time, and we never add artificial shortcuts.'}
              </p>

              <p className="text-xs sm:text-sm md:text-base text-[#736B63] dark:text-[#C8BEB5] font-light leading-relaxed mb-6 sm:mb-8">
                {isRtl
                  ? 'النتيجة هي قوام يذوب بسلاسة دون أن يلتصق، تاركاً حموضة الفواكه الطبيعية وشذى الكراميل يتفتحان تدريجياً.'
                  : 'The result is a tender chew that yields cleanly without sticking, letting pure fruit acidity and caramel aromas unfold across the palate.'}
              </p>

              {onReadMore && (
                <button
                  onClick={onReadMore}
                  className="btn-link text-sm font-medium inline-flex items-center gap-1.5 group cursor-pointer text-[#3C1322] dark:text-[#E8BD6D] hover:text-[#5A1C33] dark:hover:text-[#F2CE7F]"
                >
                  <span>{isRtl ? 'استكشف قصتنا الحرفية بالتفصيل' : 'Read our full atelier story'}</span>
                  <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                </button>
              )}
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. The Toomakt Ritual Section */}
      <section className="py-16 sm:py-20 md:py-28 bg-[#FAF7F2] dark:bg-[#120D11] border-b border-[#E8E2D7] dark:border-[#33242E] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.6 }}
            className="text-left rtl:text-right mb-10 sm:mb-14 md:mb-16 max-w-2xl"
          >
            <span className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-[#736B63] dark:text-[#9C8E83] block mb-3">
              {isRtl ? 'طقوس التذوق' : 'OUR RITUAL'}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1A1A1A] dark:text-[#F7F3EC] tracking-tight leading-tight">
              {isRtl ? 'طقوس توماكت' : 'The Toomakt ritual'}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
            {RITUAL_STEPS.map((step, idx) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white dark:bg-[#1B1419] border border-[#E8E2D7] dark:border-[#33242E] rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-[#1A1A1A] dark:hover:border-[#E8BD6D] hover:shadow-soft transition-all duration-300"
              >
                <div>
                  <span className="font-serif text-xl sm:text-2xl font-light text-[#736B63]/60 dark:text-[#9C8E83]/60 block mb-3 sm:mb-4">
                    #{idx + 1}
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-normal text-[#1A1A1A] dark:text-[#F7F3EC] mb-2 sm:mb-3">
                    {isRtl ? step.arabicTitle : step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#736B63] dark:text-[#C8BEB5] leading-relaxed font-light">
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
