import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Pause, Play, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { RITUAL_STEPS } from '../data/toomaktData';

interface BrandStorySectionProps {
  onReadMore?: () => void;
}

export const BrandStorySection: React.FC<BrandStorySectionProps> = ({ onReadMore }) => {
  const { isRtl } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

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
      <section className="py-16 sm:py-20 md:py-28 bg-[#F4EFEA] border-b border-[#E8E2D7]">
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
                className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E8E2D7] bg-[#1A1A1A] shadow-soft-lg group cursor-pointer aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] max-h-[480px] w-full"
              >
                {/* HTML5 Autoplaying Video */}
                <video
                  ref={videoRef}
                  src="/videos/atelier_craft.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Subtle vignette gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

                {/* Play/Pause state indicator overlay on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 pointer-events-none">
                  <div className="w-14 h-14 rounded-full bg-[#FAF7F2]/90 backdrop-blur-sm text-[#1A1A1A] flex items-center justify-center shadow-soft">
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current translate-x-0.5" />}
                  </div>
                </div>

                {/* Bottom Bar: Badge and Sound Toggle */}
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex items-center justify-between pointer-events-auto">
                  <div className="bg-[#FAF7F2]/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-medium text-[#1A1A1A] border border-[#E8E2D7] shadow-soft flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#88C057] animate-pulse" />
                    <span>{isRtl ? 'في معمل الحلويات · القاهرة' : 'Atelier craft · Cairo · Slow Cook'}</span>
                  </div>

                  <button
                    onClick={toggleMute}
                    aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                    className="p-2 sm:p-2.5 rounded-full bg-[#FAF7F2]/95 backdrop-blur-md text-[#1A1A1A] hover:bg-[#3C1322] hover:text-[#FAF7F2] border border-[#E8E2D7] transition-all cursor-pointer shadow-soft"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
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
                <span className="w-1.5 h-1.5 rounded-full bg-[#3C1322]" />
                <span className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-[#736B63]">
                  {isRtl ? 'صنع ببطء' : 'MADE SLOWLY'}
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1A1A1A] tracking-tight leading-tight mb-4 sm:mb-6">
                {isRtl ? 'صُنعت لتُفتح بتمهل.' : 'Made to be opened slowly.'}
              </h2>

              <p className="text-sm sm:text-base md:text-lg text-[#736B63] font-light leading-relaxed mb-4 sm:mb-6">
                {isRtl
                  ? 'تبدأ كل دفعة ببيوريه الفاكهة الطبيعية الكاملة، تُطهى على نار هادئة في قدور نحاسية مع الزبدة الأوروبية النقية. لا نتسرع أبداً في وقت التبريد، ولا نستخدم أي نكهات أو ملونات صناعية.'
                  : 'Every batch begins with real fruit purée, simmered in heavy copper kettles with European sweet cream butter. We don\'t rush the setting time, and we never add artificial shortcuts.'}
              </p>

              <p className="text-xs sm:text-sm md:text-base text-[#736B63] font-light leading-relaxed mb-6 sm:mb-8">
                {isRtl
                  ? 'النتيجة هي قوام يذوب بسلاسة دون أن يلتصق، تاركاً حموضة الفواكه الطبيعية وشذى الكراميل يتفتحان تدريجياً.'
                  : 'The result is a tender chew that yields cleanly without sticking, letting pure fruit acidity and caramel aromas unfold across the palate.'}
              </p>

              {onReadMore && (
                <button
                  onClick={onReadMore}
                  className="btn-link text-sm font-medium"
                >
                  <span>{isRtl ? 'استكشف قصتنا الحرفية بالتفصيل ←' : 'Read our full atelier story →'}</span>
                </button>
              )}
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. The Toomakt Ritual Section */}
      <section className="py-16 sm:py-20 md:py-28 bg-[#FAF7F2] border-b border-[#E8E2D7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.6 }}
            className="text-left rtl:text-right mb-10 sm:mb-14 md:mb-16 max-w-2xl"
          >
            <span className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-[#736B63] block mb-3">
              {isRtl ? 'طقوس التذوق' : 'OUR RITUAL'}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1A1A1A] tracking-tight leading-tight">
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
                className="bg-white border border-[#E8E2D7] rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-[#1A1A1A] hover:shadow-soft transition-all"
              >
                <div>
                  <span className="font-serif text-xl sm:text-2xl font-light text-[#736B63]/60 block mb-3 sm:mb-4">
                    #{idx + 1}
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-normal text-[#1A1A1A] mb-2 sm:mb-3">
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
