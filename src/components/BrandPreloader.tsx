import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toomakt3DLoader } from './Toomakt3DLoader';
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
  const [progress, setProgress] = useState(15);

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
          key="toomakt-brand-3d-preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            filter: 'blur(8px)',
            transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-[99999] pointer-events-auto"
        >
          <Toomakt3DLoader
            mode="fullscreen"
            size="fullscreen"
            showBrandTitle={true}
            showProgressBar={true}
            progress={progress}
            colorTheme="rose"
            label={isRtl ? 'جَارٍ تَحْضِيرُ التَّجْرِبَةِ الشَّهِيَّة...' : 'Preparing the artisanal toomakt experience...'}
            sublabel={isRtl ? 'حِرْفَةُ التَّوْفِي الفَاخِرَة · تُومَاكْت ١٩٧٠' : 'ARTISANAL TOFFEE · EST. 1970'}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BrandPreloader;
