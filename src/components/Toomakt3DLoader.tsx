import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface Toomakt3DLoaderProps {
  mode?: 'fullscreen' | 'inline' | 'overlay';
  size?: 'sm' | 'md' | 'lg' | 'fullscreen';
  label?: string;
  sublabel?: string;
  progress?: number;
  showBrandTitle?: boolean;
  showProgressBar?: boolean;
  colorTheme?: 'rose' | 'azure' | 'gold' | 'roast';
  className?: string;
  onComplete?: () => void;
}

export const Toomakt3DLoader: React.FC<Toomakt3DLoaderProps> = ({
  mode = 'inline',
  size = 'md',
  label,
  sublabel,
  progress,
  showBrandTitle = false,
  showProgressBar = false,
  colorTheme = 'rose',
  className = '',
}) => {
  const { isRtl } = useLanguage();

  // Dimension scaling based on size
  const cubeSizes = {
    sm: { cube: 38, half: 19, rings: 74, shadow: 48, icon: 16 },
    md: { cube: 56, half: 28, rings: 108, shadow: 72, icon: 24 },
    lg: { cube: 76, half: 38, rings: 144, shadow: 96, icon: 32 },
    fullscreen: { cube: 92, half: 46, rings: 172, shadow: 115, icon: 40 },
  };

  const actualSize = mode === 'fullscreen' ? 'fullscreen' : size;
  const cfg = cubeSizes[actualSize];

  // Theme palettes
  const gradients = {
    rose: {
      front: 'linear-gradient(135deg, #F8B4C6 0%, #E890A8 50%, #C96884 100%)',
      back: 'linear-gradient(135deg, #C96884 0%, #E890A8 50%, #B2506C 100%)',
      right: 'linear-gradient(135deg, #E890A8 0%, #D47993 60%, #9F3E58 100%)',
      left: 'linear-gradient(135deg, #FADCE4 0%, #E890A8 70%, #C96884 100%)',
      top: 'linear-gradient(135deg, #FFF0F4 0%, #F5BACB 50%, #E890A8 100%)',
      bottom: 'linear-gradient(135deg, #8E324A 0%, #5B1B2C 100%)',
      glow: 'rgba(232, 144, 168, 0.45)',
      ring1: '#E890A8',
      ring2: '#6AACE9',
      pearl: '#FFFFFF',
    },
    azure: {
      front: 'linear-gradient(135deg, #99C8F4 0%, #6AACE9 50%, #468CCB 100%)',
      back: 'linear-gradient(135deg, #468CCB 0%, #6AACE9 50%, #306FA8 100%)',
      right: 'linear-gradient(135deg, #6AACE9 0%, #569BD8 60%, #2A5E91 100%)',
      left: 'linear-gradient(135deg, #D4E8FA 0%, #6AACE9 70%, #468CCB 100%)',
      top: 'linear-gradient(135deg, #F0F7FD 0%, #A9D1F7 50%, #6AACE9 100%)',
      bottom: 'linear-gradient(135deg, #1C4670 0%, #102B47 100%)',
      glow: 'rgba(106, 172, 233, 0.45)',
      ring1: '#6AACE9',
      ring2: '#E890A8',
      pearl: '#FFFFFF',
    },
    gold: {
      front: 'linear-gradient(135deg, #FDE68A 0%, #E8BD6D 50%, #C89748 100%)',
      back: 'linear-gradient(135deg, #C89748 0%, #E8BD6D 50%, #A6732B 100%)',
      right: 'linear-gradient(135deg, #E8BD6D 0%, #D8A555 60%, #9A6721 100%)',
      left: 'linear-gradient(135deg, #FEF3C7 0%, #E8BD6D 70%, #C89748 100%)',
      top: 'linear-gradient(135deg, #FFFBEB 0%, #F5D38A 50%, #E8BD6D 100%)',
      bottom: 'linear-gradient(135deg, #784E13 0%, #4D3008 100%)',
      glow: 'rgba(232, 189, 109, 0.45)',
      ring1: '#E8BD6D',
      ring2: '#E890A8',
      pearl: '#FFFFFF',
    },
    roast: {
      front: 'linear-gradient(135deg, #4A281E 0%, #22120C 60%, #150906 100%)',
      back: 'linear-gradient(135deg, #22120C 0%, #351A12 60%, #100603 100%)',
      right: 'linear-gradient(135deg, #30170F 0%, #22120C 60%, #110704 100%)',
      left: 'linear-gradient(135deg, #5C3427 0%, #3C1E15 60%, #22120C 100%)',
      top: 'linear-gradient(135deg, #704031 0%, #4D2B20 50%, #22120C 100%)',
      bottom: 'linear-gradient(135deg, #0D0402 0%, #000000 100%)',
      glow: 'rgba(34, 18, 12, 0.35)',
      ring1: '#E890A8',
      ring2: '#6AACE9',
      pearl: '#FAF7F2',
    },
  };

  const theme = gradients[colorTheme];

  const defaultLabel = isRtl
    ? 'جَارٍ تَحْضِيرُ التَّجْرِبَةِ الشَّهِيَّة...'
    : 'Preparing your artisanal confectionery...';
  const defaultSub = isRtl
    ? 'حِرْفَةُ التَّوْفِي الفَاخِرَة · تُومَاكْت'
    : 'ARTISANAL TOFFEE · TOOMAKT CAIRO';

  const displayLabel = label !== undefined ? label : defaultLabel;
  const displaySub = sublabel !== undefined ? sublabel : defaultSub;

  // 3D Confection Core Visual
  const confection3DCore = (
    <div
      className="relative flex flex-col items-center justify-center select-none"
      style={{
        width: `${cfg.rings + 20}px`,
        height: `${cfg.rings + 30}px`,
      }}
    >
      {/* Dynamic 3D Contact Shadow on Floor */}
      <div
        className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full pointer-events-none animate-shadow-pulse blur-md"
        style={{
          width: `${cfg.shadow}px`,
          height: `${cfg.shadow * 0.32}px`,
          background: 'radial-gradient(ellipse at center, rgba(34, 18, 12, 0.45) 0%, rgba(34, 18, 12, 0) 70%)',
        }}
      />

      {/* Floating 3D Anchor */}
      <div className="relative animate-confection-float preserve-3d">
        {/* Orbital Gyroscope Ring 1 */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none animate-orbit-ring-1 preserve-3d"
          style={{
            width: `${cfg.rings}px`,
            height: `${cfg.rings}px`,
            border: `1.5px solid ${theme.ring1}40`,
            boxShadow: `0 0 16px ${theme.glow}`,
          }}
        >
          {/* Orbiting Sweet Pearl 1 */}
          <div
            className="absolute -top-1.5 left-1/2 -translate-x-1/2 rounded-full shadow-md animate-pulse"
            style={{
              width: `${Math.max(6, cfg.cube * 0.12)}px`,
              height: `${Math.max(6, cfg.cube * 0.12)}px`,
              backgroundColor: theme.ring1,
              boxShadow: `0 0 10px ${theme.ring1}, 0 0 4px #FFFFFF`,
            }}
          />
        </div>

        {/* Orbital Gyroscope Ring 2 (Counter Tilt) */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none animate-orbit-ring-2 preserve-3d"
          style={{
            width: `${cfg.rings * 0.86}px`,
            height: `${cfg.rings * 0.86}px`,
            border: `1.5px dashed ${theme.ring2}50`,
          }}
        >
          {/* Orbiting Sweet Pearl 2 */}
          <div
            className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 rounded-full shadow-md"
            style={{
              width: `${Math.max(5, cfg.cube * 0.1)}px`,
              height: `${Math.max(5, cfg.cube * 0.1)}px`,
              backgroundColor: theme.ring2,
              boxShadow: `0 0 8px ${theme.ring2}`,
            }}
          />
        </div>

        {/* 3D Perspective Viewport */}
        <div
          className="perspective-1000 relative flex items-center justify-center"
          style={{
            width: `${cfg.cube * 1.5}px`,
            height: `${cfg.cube * 1.5}px`,
          }}
        >
          {/* The Rotating 3D Confection Cube */}
          <div
            className="preserve-3d animate-confection-spin-3d relative cursor-grab active:cursor-grabbing"
            style={{
              width: `${cfg.cube}px`,
              height: `${cfg.cube}px`,
            }}
          >
            {/* FRONT FACE */}
            <div
              className="absolute inset-0 rounded-2xl flex items-center justify-center shadow-lg border border-white/40 overflow-hidden backface-hidden"
              style={{
                transform: `rotateY(0deg) translateZ(${cfg.half}px)`,
                background: theme.front,
              }}
            >
              {/* Glass Sheen Shimmer */}
              <div
                className="absolute inset-0 pointer-events-none animate-shimmer-sweep"
                style={{
                  background:
                    'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%)',
                }}
              />
              <img
                src="/images/logos/toomakt_logo_main.png"
                alt="Toomakt Monogram"
                className="object-contain filter drop-shadow-md select-none pointer-events-none"
                style={{
                  width: `${cfg.icon}px`,
                  height: `${cfg.icon}px`,
                }}
              />
            </div>

            {/* BACK FACE */}
            <div
              className="absolute inset-0 rounded-2xl flex items-center justify-center shadow-lg border border-white/25 overflow-hidden backface-hidden"
              style={{
                transform: `rotateY(180deg) translateZ(${cfg.half}px)`,
                background: theme.back,
              }}
            >
              <Sparkles className="text-white/80 animate-pulse" style={{ width: `${cfg.icon * 0.7}px`, height: `${cfg.icon * 0.7}px` }} />
            </div>

            {/* RIGHT FACE */}
            <div
              className="absolute inset-0 rounded-2xl flex items-center justify-center shadow-lg border border-white/20 overflow-hidden backface-hidden"
              style={{
                transform: `rotateY(90deg) translateZ(${cfg.half}px)`,
                background: theme.right,
              }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-white/60 blur-[1px]" />
            </div>

            {/* LEFT FACE */}
            <div
              className="absolute inset-0 rounded-2xl flex items-center justify-center shadow-lg border border-white/30 overflow-hidden backface-hidden"
              style={{
                transform: `rotateY(-90deg) translateZ(${cfg.half}px)`,
                background: theme.left,
              }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-white/70 blur-[1px]" />
            </div>

            {/* TOP FACE (Specular Highlight) */}
            <div
              className="absolute inset-0 rounded-2xl flex items-center justify-center shadow-md border border-white/60 overflow-hidden backface-hidden"
              style={{
                transform: `rotateX(90deg) translateZ(${cfg.half}px)`,
                background: theme.top,
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.85) 0%, transparent 60%)',
                }}
              />
              <span className="font-serif font-bold text-white/90 text-[10px] tracking-wider select-none">
                T
              </span>
            </div>

            {/* BOTTOM FACE (Dark Base) */}
            <div
              className="absolute inset-0 rounded-2xl flex items-center justify-center shadow-2xl backface-hidden"
              style={{
                transform: `rotateX(-90deg) translateZ(${cfg.half}px)`,
                background: theme.bottom,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  // INLINE MODE: Compact embedding inside cards, catalogs, tabs
  if (mode === 'inline') {
    return (
      <div
        className={`relative flex min-h-[250px] flex-col items-center justify-center overflow-hidden rounded-[2rem] bg-[#f9f5f2] px-4 py-10 text-center select-none ${className}`}
        role="status"
        aria-live="polite"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              'radial-gradient(circle at 20% 20%, rgba(232,144,168,.2), transparent 34%), radial-gradient(circle at 80% 85%, rgba(106,172,233,.18), transparent 36%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #22120C 1px, transparent 0)',
            backgroundSize: '22px 22px',
          }}
        />

        <div className="relative z-10 flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border border-dashed border-[#E890A8]/60"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-[14%] rounded-full border border-[#6AACE9]/50"
          />
          <span className="absolute right-0 top-2 h-2.5 w-2.5 rounded-full bg-[#E890A8] shadow-[0_0_12px_rgba(232,144,168,.85)]" />
          <span className="absolute bottom-1 left-1 h-2 w-2 rounded-full bg-[#6AACE9] shadow-[0_0_12px_rgba(106,172,233,.8)]" />
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [-8, 4, -8] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
            className="relative flex h-14 w-14 items-center justify-center rounded-[1.15rem] bg-gradient-to-br from-[#f9cad7] via-[#E890A8] to-[#b95876] shadow-[10px_14px_24px_rgba(139,58,83,.22)] sm:h-16 sm:w-16"
          >
            <span className="h-7 w-7 rotate-45 rounded-lg border border-white/45 bg-white/20" />
            <span className="absolute bottom-1.5 font-mono text-[7px] font-bold tracking-[.18em] text-white/85">
              1970
            </span>
          </motion.div>
        </div>

        {displayLabel && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 mt-5 max-w-xs text-xs font-sans font-normal tracking-wide text-[#22120C]/75"
          >
            {displayLabel}
          </motion.p>
        )}

        {displaySub && (
          <span className="relative z-10 mt-2 font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-[#E890A8]">
            {displaySub}
          </span>
        )}

        {showProgressBar && progress !== undefined && (
          <div className="relative z-10 mt-4 h-1 w-36 overflow-hidden rounded-full bg-[#22120C]/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#E890A8] via-[#6AACE9] to-[#E890A8]"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
        )}
      </div>
    );
  }

  // OVERLAY MODE: Frosted glass modal over active content
  if (mode === 'overlay') {
    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-[#22120C]/40 backdrop-blur-md px-6 ${className}`}
        role="dialog"
        aria-modal="true"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white/95 rounded-3xl p-8 shadow-[0_24px_60px_rgba(34,18,12,0.22)] border border-[#E890A8]/25 flex flex-col items-center text-center max-w-sm w-full mx-auto"
        >
          {confection3DCore}

          {displayLabel && (
            <h3 className="font-serif text-lg text-[#22120C] mt-5 font-normal leading-snug">
              {displayLabel}
            </h3>
          )}

          {displaySub && (
            <p className="text-[11px] font-mono tracking-widest uppercase text-[#E890A8] mt-1 font-semibold">
              {displaySub}
            </p>
          )}

          {showProgressBar && (
            <div className="mt-5 w-44 h-1.5 bg-[#22120C]/10 rounded-full overflow-hidden relative">
              <motion.div
                className="h-full bg-gradient-to-r from-[#E890A8] via-[#6AACE9] to-[#E890A8] rounded-full"
                style={{ width: `${progress !== undefined ? progress : 75}%` }}
                animate={
                  progress === undefined
                    ? {
                        x: ['-100%', '100%'],
                      }
                    : undefined
                }
                transition={
                  progress === undefined
                    ? {
                        repeat: Infinity,
                        duration: 1.5,
                        ease: 'easeInOut',
                      }
                    : { duration: 0.2 }
                }
              />
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  // FULLSCREEN MODE: Brand preloader or page transition
  return (
    <div
      className={`fixed inset-0 z-[99999] bg-white flex flex-col items-center justify-center overflow-hidden select-none cursor-wait ${className}`}
      role="status"
      aria-live="polite"
      aria-label={displayLabel}
    >
      {/* Ambient Confection Light Pools */}
      <div
        className="absolute top-1/4 -right-16 w-[480px] h-[480px] rounded-full pointer-events-none opacity-45 blur-3xl animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(232, 144, 168, 0.32) 0%, rgba(255, 255, 255, 0) 70%)',
          animationDuration: '3.6s',
        }}
      />
      <div
        className="absolute -bottom-16 -left-16 w-[480px] h-[480px] rounded-full pointer-events-none opacity-40 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(106, 172, 233, 0.3) 0%, rgba(255, 255, 255, 0) 70%)',
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full pointer-events-none opacity-25 blur-2xl"
        style={{
          background: 'radial-gradient(circle, rgba(232, 144, 168, 0.2) 0%, rgba(255, 255, 255, 0) 70%)',
        }}
      />

      {/* Gentle Linen Texture */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #22120C 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Center 3D Confection Presentation */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md w-full">
        {confection3DCore}

        {/* Brand Wordmark Title */}
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.12, duration: 0.4 }}
          className="mt-6 space-y-1.5"
        >
          {showBrandTitle && (
            <h1 className="font-serif text-3xl sm:text-4xl text-[#22120C] font-normal tracking-tight leading-none lowercase">
              toomakt
            </h1>
          )}

          <div className="flex items-center justify-center gap-2 text-[11px] sm:text-xs font-mono tracking-widest uppercase text-[#E890A8] font-bold">
            <span>{isRtl ? 'حِرْفَةُ التَّوْفِي الفَاخِرَة' : 'ARTISANAL TOFFEE'}</span>
            <span className="text-[#6AACE9]">•</span>
            <span>{isRtl ? 'سُورْيَا ١٩٧٠ · مِصْر' : 'EST. 1970'}</span>
          </div>
        </motion.div>

        {/* Progress Bar */}
        {showProgressBar && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 160 }}
            transition={{ delay: 0.15, duration: 0.25 }}
            className="mt-6 w-40 h-1.5 rounded-full bg-[#22120C]/08 overflow-hidden relative"
          >
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#E890A8] via-[#6AACE9] to-[#E890A8]"
              style={{ width: `${progress !== undefined ? progress : 80}%` }}
              animate={
                progress === undefined
                  ? {
                      x: ['-100%', '100%'],
                    }
                  : undefined
              }
              transition={
                progress === undefined
                  ? {
                      repeat: Infinity,
                      duration: 1.6,
                      ease: 'easeInOut',
                    }
                  : { duration: 0.15 }
              }
            />
          </motion.div>
        )}

        {/* Status Hint */}
        {displayLabel && (
          <span className="mt-3.5 text-xs font-sans font-light text-[#736B63] tracking-wide">
            {displayLabel}
          </span>
        )}
      </div>
    </div>
  );
};

export default Toomakt3DLoader;
