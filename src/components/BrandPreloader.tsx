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
  minDurationMs = 550,
}) => {
  const { isRtl } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(12);

  useEffect(() => {
    // Smooth progress increment
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const step = Math.max(12, Math.floor((100 - prev) / 3));
        return Math.min(100, prev + step);
      });
    }, 60);

    // Minimum display duration to allow buttery visual transition
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) {
        onComplete();
      }
    }, minDurationMs);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [minDurationMs, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="toomakt-brand-preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.03,
            filter: 'blur(8px)',
            transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-[99999] bg-[#FAF5EE] flex flex-col items-center justify-center overflow-hidden select-none cursor-wait"
          style={{ willChange: 'opacity, transform, filter' }}
          role="status"
          aria-live="polite"
          aria-label={isRtl ? 'جاري تحضير تجربة توماكت...' : 'Preparing the toomakt experience...'}
        >
          {/* Ambient Brand Glowing Pools (Secondary Colors: Sweet Rose #E890A8 & Sky Azure #6AACE9) */}
          <div
            className="absolute top-1/4 -right-16 w-[420px] h-[420px] rounded-full pointer-events-none opacity-40 blur-3xl animate-pulse"
            style={{
              background:
                'radial-gradient(circle, rgba(232, 144, 168, 0.28) 0%, rgba(250, 245, 238, 0) 70%)',
              animationDuration: '3s',
            }}
          />
          <div
            className="absolute -bottom-16 -left-16 w-[420px] h-[420px] rounded-full pointer-events-none opacity-35 blur-3xl"
            style={{
              background:
                'radial-gradient(circle, rgba(106, 172, 233, 0.24) 0%, rgba(250, 245, 238, 0) 70%)',
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full pointer-events-none opacity-30 blur-2xl"
            style={{
              background:
                'radial-gradient(circle, rgba(150, 55, 37, 0.15) 0%, rgba(250, 245, 238, 0) 70%)',
            }}
          />

          {/* Gentle Linen Texture */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #22120C 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Central Luxury Confection Emblem & Loader */}
          <div className="relative z-10 flex flex-col items-center text-center px-6">
            <motion.div
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center mb-6"
            >
              {/* Spinning Orbital Artisan Confection Ring */}
              <svg
                className="absolute inset-0 w-full h-full animate-[spin_4s_linear_infinite]"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="rgba(150, 55, 37, 0.12)"
                  strokeWidth="2"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#toomaktLoaderGradient)"
                  strokeWidth="2.5"
                  strokeDasharray="70 200"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="toomaktLoaderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#963725" />
                    <stop offset="50%" stopColor="#E890A8" />
                    <stop offset="100%" stopColor="#6AACE9" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Pulsing Concentric Aura */}
              <div className="absolute inset-2 rounded-full bg-white/90 backdrop-blur-md border border-[#22120C]/08 shadow-[0_12px_36px_rgba(150,55,37,0.12)] flex items-center justify-center" />

              {/* Logo Emblem */}
              <motion.img
                src="/images/logos/toomakt_logo_main.png"
                alt="toomakt"
                className="relative z-10 w-14 h-14 sm:w-16 sm:h-16 object-contain filter drop-shadow-[0_4px_12px_rgba(150,55,37,0.15)]"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: 'easeInOut',
                }}
              />

              {/* Little Floating Confection Sparkle */}
              <div className="absolute -top-1 -right-1 z-20 w-7 h-7 rounded-full bg-white shadow-sm border border-[#E890A8]/40 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-[#E890A8] animate-pulse" />
              </div>
            </motion.div>

            {/* Brand Wordmark Title */}
            <motion.div
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.35 }}
              className="space-y-1.5"
            >
              <h1 className="font-serif text-2xl sm:text-3xl text-[#22120C] font-normal tracking-tight leading-none lowercase">
                toomakt
              </h1>

              <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-[#963725] font-semibold">
                <span>{isRtl ? 'حِرْفَةُ التَّوْفِي الفَاخِرَة' : 'ARTISANAL TOFFEE'}</span>
                <span className="text-[#E890A8]">•</span>
                <span>{isRtl ? 'سُورْيَا ١٩٧٠ · مِصْر' : 'EST. 1970'}</span>
              </div>
            </motion.div>

            {/* Micro Slim Progress Bar */}
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 140 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              className="mt-6 w-36 h-1 rounded-full bg-[#22120C]/08 overflow-hidden relative"
            >
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#963725] via-[#E890A8] to-[#6AACE9]"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>

            {/* Status Hint */}
            <span className="mt-3 text-[10px] font-sans font-light text-[#736B63] tracking-wide">
              {isRtl ? 'جَارٍ تَحْضِيرُ التَّجْرِبَة...' : 'Preparing your sweet experience...'}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BrandPreloader;
