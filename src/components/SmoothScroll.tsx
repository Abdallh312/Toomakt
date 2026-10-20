import React, { useEffect } from 'react';
import Lenis from 'lenis';

export const SmoothScroll: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Detect fine pointer vs touch device
    const isTouchOnly = typeof window !== 'undefined' &&
      'ontouchstart' in window &&
      window.matchMedia('(pointer: coarse)').matches &&
      !window.matchMedia('(pointer: fine)').matches;

    // Initialize Lenis smooth scroll engine with buttery silk physics
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential silk curve
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: isTouchOnly ? 1.0 : 1.2,
      syncTouch: false, // Maintain mobile 120Hz native momentum
      infinite: false,
    });

    document.documentElement.classList.add('lenis', 'lenis-smooth');

    let animationFrameId: number;

    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    // Global reference for silky programmatic navigation
    (window as any).lenis = lenis;
    (window as any).scrollToSmooth = (target: any, offset = 0, duration = 1.15) => {
      lenis.scrollTo(target, { offset, immediate: false, duration });
    };

    // Modal & Drawer scroll lock listeners to eliminate background scroll fighting
    const handleModalOpen = () => {
      lenis.stop();
      document.documentElement.classList.add('lenis-stopped');
    };

    const handleModalClose = () => {
      lenis.start();
      document.documentElement.classList.remove('lenis-stopped');
    };

    window.addEventListener('toomakt:modal-open', handleModalOpen);
    window.addEventListener('toomakt:modal-close', handleModalClose);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('toomakt:modal-open', handleModalOpen);
      window.removeEventListener('toomakt:modal-close', handleModalClose);
      lenis.destroy();
      document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped');
      delete (window as any).lenis;
      delete (window as any).scrollToSmooth;
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScroll;
