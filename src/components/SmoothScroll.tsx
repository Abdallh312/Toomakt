import React, { useEffect } from 'react';
import Lenis from 'lenis';

export const SmoothScroll: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Initialize Lenis smooth scroll engine with buttery physics
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential silk curve
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.8,
      syncTouch: false, // Let mobile touchscreens retain ultra-responsive native 120Hz momentum
      infinite: false,
    });

    let animationFrameId: number;

    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    // Global reference for smooth programmatic navigation
    (window as any).lenis = lenis;
    (window as any).scrollToSmooth = (target: any, offset = 0) => {
      lenis.scrollTo(target, { offset, immediate: false, duration: 1.0 });
    };

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      delete (window as any).lenis;
      delete (window as any).scrollToSmooth;
    };
  }, []);

  return <>{children}</>;
};
