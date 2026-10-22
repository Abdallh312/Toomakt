import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface BrandPreloaderProps {
  onComplete?: () => void;
  minDurationMs?: number;
}

export const BrandPreloader: React.FC<BrandPreloaderProps> = ({
  onComplete,
  minDurationMs = 850,
}) => {
  const { isRtl } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(8);

  useEffect(() => {
    // Smooth progress ticker
    const stepDuration = Math.max(20, Math.floor(minDurationMs / 25));
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return Math.min(100, prev + Math.floor(Math.random() * 8 + 4));
      });
    }, stepDuration);

    const timer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsVisible(false);
        if (onComplete) {
          onComplete();
        }
      }, 160);
    }, minDurationMs);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [minDurationMs, onComplete]);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key="toomakt-atelier-preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            clipPath: 'inset(0 0 100% 0)',
            transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-[99999] pointer-events-auto flex min-h-screen items-center justify-center overflow-hidden bg-[#fffafc] text-[#22120C]"
          role="status"
          aria-live="polite"
          aria-label={isRtl ? 'جَارٍ تَحْضِيرُ التَّجْرِبَةِ الشَّهِيَّة...' : 'Preparing the artisanal Toomakt experience'}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_15%,rgba(232,144,168,0.2),transparent_28%),radial-gradient(circle_at_85%_85%,rgba(106,172,233,0.2),transparent_30%)]" />
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #22120C 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />

          <motion.div
            initial={{ scale: 0.75, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 grid w-full max-w-5xl grid-cols-1 items-center gap-12 px-7 py-12 sm:px-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20"
          >
            <div className="relative mx-auto flex aspect-square w-full max-w-[310px] items-center justify-center lg:order-2 lg:max-w-[390px]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border border-dashed border-[#E890A8]/50"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-[12%] rounded-full border border-[#6AACE9]/45"
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-[24%] rounded-full border border-[#22120C]/10"
              />

              <span className="absolute right-[9%] top-[18%] h-3 w-3 rounded-full bg-[#E890A8] shadow-[0_0_18px_rgba(232,144,168,0.8)]" />
              <span className="absolute bottom-[19%] left-[12%] h-2.5 w-2.5 rounded-full bg-[#6AACE9] shadow-[0_0_18px_rgba(106,172,233,0.8)]" />

              <motion.div
                animate={{ y: [0, -14, 0], rotate: [-8, 4, -8] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative flex h-36 w-36 items-center justify-center rounded-[2.5rem] bg-gradient-to-br from-[#f9cad7] via-[#E890A8] to-[#b95876] shadow-[18px_26px_45px_rgba(139,58,83,0.25)] sm:h-44 sm:w-44"
              >
                <div className="absolute inset-3 rounded-[2rem] border border-white/40" />
                <div className="h-14 w-14 rotate-45 rounded-[1.2rem] border border-white/35 bg-white/20 backdrop-blur-sm" />
                <span className="absolute bottom-5 font-mono text-[9px] font-bold tracking-[0.25em] text-white/80">
                  1970
                </span>
              </motion.div>
            </div>

            <div className="text-center lg:order-1 lg:text-left rtl:lg:text-right">
              <motion.div
                initial={{ y: 18, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25, duration: 0.6 }}
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E890A8]/35 bg-white/60 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#E890A8]"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {isRtl ? 'من المشغل إلى المائدة' : 'From our atelier to your table'}
              </motion.div>

              <div className="overflow-hidden">
                <motion.h1
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="font-serif text-7xl lowercase leading-[0.8] tracking-[-0.06em] text-[#22120C] sm:text-8xl"
                >
                  toomakt
                </motion.h1>
              </div>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.5 }}
                className="mt-5 max-w-md text-sm font-light leading-relaxed text-[#22120C]/65 sm:text-base"
              >
                {isRtl
                  ? 'نُحضّر لك لحظة حلوة من إرث عائلي بدأ عام ١٩٧٠.'
                  : 'A little sweetness is being prepared for you, from a family heritage since 1970.'}
              </motion.p>

              <div className="mx-auto mt-9 max-w-md lg:mx-0">
                <div className="mb-2.5 flex items-end justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-[#22120C]/45">
                  <span>{isRtl ? 'جاري التحضير' : 'Preparing the experience'}</span>
                  <span className="text-[#E890A8]">{progress}%</span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-[#22120C]/10">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#E890A8] via-[#6AACE9] to-[#E890A8]"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  />
                </div>
                <div className="mt-3 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-[#22120C]/40">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#E890A8]" />
                  {isRtl ? 'حِرْفَةُ التَّوْفِي الفَاخِرَة · مِصْر' : 'Artisanal toffee · Cairo'}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="absolute bottom-7 left-0 right-0 flex justify-center font-mono text-[9px] uppercase tracking-[0.3em] text-[#22120C]/35">
            <span>Al-Zahra Food Industries</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BrandPreloader;
