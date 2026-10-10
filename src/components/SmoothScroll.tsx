import React, { useEffect } from 'react';
import Lenis from 'lenis';

export const SmoothScroll: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Initialize Lenis smooth scroll engine with buttery silk physics
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential silk curve
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.6,
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
    (window as any).scrollToSmooth = (target: any, offset = 0) => {
      lenis.scrollTo(target, { offset, immediate: false, duration: 1.1 });
    };

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      document.documentElement.classList.remove('lenis', 'lenis-smooth');
      delete (window as any).lenis;
      delete (window as any).scrollToSmooth;
    };
  }, []);

  return <>{children}</>;
};
