import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  xOffset?: number;
  className?: string;
  viewportAmount?: number;
  once?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  delay = 0,
  duration = 0.65,
  yOffset = 24,
  xOffset = 0,
  className = '',
  viewportAmount = 0.12,
  once = false, // Bidirectional: animates both on scroll down and scroll up!
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset, x: xOffset }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once, amount: viewportAmount }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // atelier smooth cubic bezier
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  once?: boolean;
}

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  className = '',
  delay = 0,
  as: Component = 'span',
  once = false, // Bidirectional: animates on scroll down and scroll up!
}) => {
  const words = text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.035, delayChildren: delay * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1] as any,
      },
    },
    hidden: {
      opacity: 0,
      y: 18,
      transition: {
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1] as any,
      },
    },
  };

  const MotionComponent = motion[Component] as any;

  return (
    <MotionComponent
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.15 }}
      className={`inline-block ${className}`}
    >
      {words.map((word, index) => (
        <motion.span
          variants={child}
          key={index}
          className="inline-block mr-[0.25em] rtl:mr-0 rtl:ml-[0.25em] last:mr-0 rtl:last:ml-0"
        >
          {word}
        </motion.span>
      ))}
    </MotionComponent>
  );
};

interface ParallaxTextProps {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}

/**
 * Interactive text block that moves subtly in response to window scroll (up & down)
 */
export const ParallaxText: React.FC<ParallaxTextProps> = ({
  children,
  offset = 20,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
};
