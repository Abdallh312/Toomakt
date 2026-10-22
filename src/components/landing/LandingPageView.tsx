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
      className="landing-continuous relative w-full overflow-x-clip bg-white text-[#22120C]"
    >
      {/* Global Sweet Rose & Sky Azure Scroll Progress Indicator (Smooth GPU spring) */}
      <motion.div
        style={{ scaleX: smoothProgress, transformOrigin: '0%' }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#E890A8] via-[#6AACE9] to-[#E890A8] z-[60] pointer-events-none shadow-[0_0_14px_rgba(106,172,233,0.45)] will-change-transform"
      />

      {/* 01 — Hero: Welcome to Toomakt ("Life's sweeter unwrapped.") */}
      <motion.div
        className="landing-chapter"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.12, margin: '-8% 0px -8% 0px' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <LandingFigmaHero
          onExploreSweets={() => onNavigateView('shop')}
          onNavigateSection={scrollToSection}
          onContactClick={() => onNavigateView('contact')}
        />
      </motion.div>

      {/* 02 — Brand Continuous Marquee Ribbon Ticker */}
      <motion.div className="landing-chapter" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ amount: 0.2 }} transition={{ duration: 0.7 }}>
        <LandingFigmaRibbon />
      </motion.div>

      {/* 03 — The Sweet Selection: Meet your sweet side (3 Signature Confectionery Cards) */}
      <motion.div
        className="landing-chapter"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.12, margin: '-8% 0px -8% 0px' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <LandingFigmaSweetSide
          onViewAllProducts={() => onNavigateView('shop')}
          onSelectProduct={onSelectProduct}
        />
      </motion.div>

      {/* 04 — The Toomakt Spirit: A sweeter outlook ("A little sweet. A lot of heart.") */}
      <motion.div className="landing-chapter" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.12 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
        <LandingFigmaOutlook />
      </motion.div>

      {/* 05 — The Anatomy of Delicious: Simple pleasures. Rich details. */}
      <motion.div className="landing-chapter" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.12 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
        <LandingFigmaCraft />
      </motion.div>

      {/* 06 — In Praise of the Golden Bite: First the crunch. Then the mmm. */}
      <motion.div className="landing-chapter" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.12 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
        <LandingFigmaLoveLetter
          onDiscoverCollection={() => onNavigateView('shop')}
        />
      </motion.div>

      {/* 07 — For Your Favorite People: Say it with something sweet. (Gifting) */}
      <motion.div className="landing-chapter" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.12 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
        <LandingFigmaGifting
          onTalkGifting={() => onNavigateView('contact')}
        />
      </motion.div>

      {/* 08 — Our Branches: Follow the sweet little trail (Interactive 3-Stop Corridor) */}
      <motion.div className="landing-chapter" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.12 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
        <LandingFigmaTrail
          onAskBranches={() => onNavigateView('contact')}
          onSelectBranchStop={() => onNavigateView('contact')}
        />
      </motion.div>

      {/* 09 — A Good Thing Starts with Hello: Something sweet on your mind? */}
      <motion.div className="landing-chapter" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.12 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
        <LandingFigmaConversation
          onStartTalk={() => onNavigateView('contact')}
        />
      </motion.div>
    </div>
  );
};

export default LandingPageView;
