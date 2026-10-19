import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Product } from '../../types';
import { LandingFigmaHero } from './LandingFigmaHero';
import { LandingFigmaRibbon } from './LandingFigmaRibbon';
import { LandingFigmaSweetSide } from './LandingFigmaSweetSide';
import { LandingFigmaOutlook } from './LandingFigmaOutlook';
import { LandingFigmaCraft } from './LandingFigmaCraft';
import { LandingFigmaLoveLetter } from './LandingFigmaLoveLetter';
import { LandingFigmaGifting } from './LandingFigmaGifting';
import { LandingFigmaTrail } from './LandingFigmaTrail';
import { LandingFigmaConversation } from './LandingFigmaConversation';

interface LandingPageViewProps {
  onNavigateView: (view: string) => void;
  onSelectProduct?: (product: Product) => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onNavigateView,
  onSelectProduct,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Global Scroll Progress for Upper and Down Interaction
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    restDelta: 0.001,
  });

  const scrollToSection = (id: string) => {
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(`#${id}`, { offset: -70, duration: 1.15 });
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-[#FAF5EE] text-[#22120C]"
    >
      {/* Global Terracotta, Sweet Rose & Sky Azure Scroll Progress Indicator (Smooth GPU spring) */}
      <motion.div
        style={{ scaleX: smoothProgress, transformOrigin: '0%' }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#963725] via-[#E890A8] via-[#6AACE9] to-[#963725] z-[60] pointer-events-none shadow-[0_0_14px_rgba(106,172,233,0.45)] will-change-transform"
      />

      {/* 01 — Hero: Welcome to Toomakt ("Life's sweeter unwrapped.") */}
      <LandingFigmaHero
        onExploreSweets={() => onNavigateView('shop')}
        onNavigateSection={scrollToSection}
        onContactClick={() => onNavigateView('contact')}
      />

      {/* 02 — Brand Continuous Marquee Ribbon Ticker */}
      <LandingFigmaRibbon />

      {/* 03 — The Sweet Selection: Meet your sweet side (3 Signature Confectionery Cards) */}
      <LandingFigmaSweetSide
        onViewAllProducts={() => onNavigateView('shop')}
        onSelectProduct={onSelectProduct}
      />

      {/* 04 — The Toomakt Spirit: A sweeter outlook ("A little sweet. A lot of heart.") */}
      <LandingFigmaOutlook />

      {/* 05 — The Anatomy of Delicious: Simple pleasures. Rich details. */}
      <LandingFigmaCraft />

      {/* 06 — In Praise of the Golden Bite: First the crunch. Then the mmm. */}
      <LandingFigmaLoveLetter
        onDiscoverCollection={() => onNavigateView('shop')}
      />

      {/* 07 — For Your Favorite People: Say it with something sweet. (Gifting) */}
      <LandingFigmaGifting
        onTalkGifting={() => onNavigateView('contact')}
      />

      {/* 08 — Our Branches: Follow the sweet little trail (Interactive 3-Stop Corridor) */}
      <LandingFigmaTrail
        onAskBranches={() => onNavigateView('contact')}
        onSelectBranchStop={() => onNavigateView('contact')}
      />

      {/* 09 — A Good Thing Starts with Hello: Something sweet on your mind? */}
      <LandingFigmaConversation
        onStartTalk={() => onNavigateView('contact')}
      />
    </div>
  );
};

export default LandingPageView;
