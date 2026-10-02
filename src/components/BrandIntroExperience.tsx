import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent
} from 'framer-motion';
import {
  ArrowDown,
  Sparkles,
  Award,
  ShieldCheck,
  Flame,
  ChevronDown,
  ShoppingBag,
  Compass,
  ArrowRight,
  ArrowLeft,
  Volume2,
  VolumeX,
  Clock,
  Layers,
  Heart
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { HERO_PRODUCT } from '../data/toomaktData';
import { Product } from '../types';

interface BrandIntroExperienceProps {
  onShopNow: () => void;
  onExploreFlavors: () => void;
  onSelectProduct?: (p: Product) => void;
  onScrollToStore?: () => void;
}

export const BrandIntroExperience: React.FC<BrandIntroExperienceProps> = ({
  onShopNow,
  onExploreFlavors,
  onSelectProduct,
  onScrollToStore
}) => {
  const { t, language, isRtl } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeScene, setActiveScene] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // 1. Core Scroll Setup with silky spring smoothing
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 26,
    restDelta: 0.0008
  });

  // Track active scene index for pagination dots
  useMotionValueEvent(smoothProgress, 'change', (latest) => {
    if (latest < 0.20) setActiveScene(0);
    else if (latest < 0.42) setActiveScene(1);
    else if (latest < 0.64) setActiveScene(2);
    else if (latest < 0.84) setActiveScene(3);
    else setActiveScene(4);
  });

  // Parallax mouse tracker for desktop subtle 3D tilt
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 2; // -1 to 1
    const y = (clientY / innerHeight - 0.5) * 2; // -1 to 1
    setMousePos({ x, y });
  }, []);

  // Jump to specific scene smoothly
  const scrollToScene = (sceneIndex: number) => {
    if (!containerRef.current) return;
    const sceneTargets = [0.0, 0.28, 0.50, 0.72, 0.92];
    const targetFraction = sceneTargets[sceneIndex];
    const containerTop = containerRef.current.offsetTop;
    const containerHeight = containerRef.current.offsetHeight - window.innerHeight;
    const targetScroll = containerTop + targetFraction * containerHeight;

    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
  };

  // Jump straight to store content
  const handleSkipToStore = () => {
    if (onScrollToStore) {
      onScrollToStore();
    } else {
      const storeEl = document.getElementById('store-content');
      if (storeEl) {
        storeEl.scrollIntoView({ behavior: 'smooth' });
      } else if (containerRef.current) {
        const bottom = containerRef.current.offsetTop + containerRef.current.offsetHeight;
        window.scrollTo({ top: bottom, behavior: 'smooth' });
      }
    }
  };

  // Play subtle sound on user click if unmuted
  const toggleSound = () => {
    setIsMuted(!isMuted);
    if (isMuted) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(780, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } catch (e) {}
    }
  };

  // ==========================================
  // SCENE 1 ANIMATIONS (0.00 -> 0.22)
  // ==========================================
  const s1Opacity = useTransform(smoothProgress, [0.00, 0.13, 0.21], [1, 1, 0]);
  const s1Scale = useTransform(smoothProgress, [0.00, 0.16, 0.22], [1, 0.96, 0.90]);
  const s1Y = useTransform(smoothProgress, [0.00, 0.18], [0, -50]);
  const s1Blur = useTransform(smoothProgress, [0.00, 0.13, 0.21], [0, 0, 10]);
  const s1LogoScale = useTransform(smoothProgress, [0.00, 0.15], [1.1, 0.88]);
  const s1ScrollIndicatorOpacity = useTransform(smoothProgress, [0.00, 0.05], [1, 0]);

  // ==========================================
  // SCENE 2 ANIMATIONS (0.19 -> 0.43)
  // ==========================================
  const s2Opacity = useTransform(smoothProgress, [0.18, 0.24, 0.36, 0.43], [0, 1, 1, 0]);
  const s2Scale = useTransform(smoothProgress, [0.18, 0.25, 0.36, 0.44], [0.93, 1, 1, 1.04]);
  const s2Y = useTransform(smoothProgress, [0.18, 0.25, 0.36, 0.43], [60, 0, 0, -50]);
  const s2Blur = useTransform(smoothProgress, [0.18, 0.24, 0.36, 0.43], [10, 0, 0, 8]);
  const s2Pillar1Y = useTransform(smoothProgress, [0.20, 0.38], [50, -20]);
  const s2Pillar2Y = useTransform(smoothProgress, [0.20, 0.38], [80, -40]);
  const s2Pillar3Y = useTransform(smoothProgress, [0.20, 0.38], [110, -60]);

  // ==========================================
  // SCENE 3 ANIMATIONS (0.39 -> 0.65)
  // ==========================================
  const s3Opacity = useTransform(smoothProgress, [0.38, 0.44, 0.58, 0.65], [0, 1, 1, 0]);
  const s3Scale = useTransform(smoothProgress, [0.38, 0.46, 0.58, 0.66], [0.90, 1, 1, 1.05]);
  const s3Y = useTransform(smoothProgress, [0.38, 0.45, 0.58, 0.65], [50, 0, 0, -40]);
  const s3CenterProductScale = useTransform(smoothProgress, [0.40, 0.52, 0.62], [0.82, 1.05, 1.15]);
  const s3CenterProductY = useTransform(smoothProgress, [0.40, 0.52, 0.62], [60, 0, -30]);
  const s3LeftProductX = useTransform(smoothProgress, [0.40, 0.50, 0.62], [-140, 0, -40]);
  const s3LeftProductRotate = useTransform(smoothProgress, [0.40, 0.52], [-12, -5]);
  const s3RightProductX = useTransform(smoothProgress, [0.40, 0.50, 0.62], [140, 0, 40]);
  const s3RightProductRotate = useTransform(smoothProgress, [0.40, 0.52], [12, 6]);

  // ==========================================
  // SCENE 4 ANIMATIONS (0.61 -> 0.85)
  // ==========================================
  const s4Opacity = useTransform(smoothProgress, [0.60, 0.66, 0.78, 0.85], [0, 1, 1, 0]);
  const s4Scale = useTransform(smoothProgress, [0.60, 0.68, 0.78, 0.86], [0.94, 1, 1, 1.04]);
  const s4Y = useTransform(smoothProgress, [0.60, 0.67, 0.78, 0.85], [40, 0, 0, -40]);
  const s4TextParallaxX = useTransform(smoothProgress, [0.60, 0.85], isRtl ? [-80, 80] : [80, -80]);
  const s4AuraScale = useTransform(smoothProgress, [0.62, 0.74, 0.84], [0.8, 1.25, 1.5]);

  // ==========================================
  // SCENE 5 ANIMATIONS (0.81 -> 1.00)
  // ==========================================
  const s5Opacity = useTransform(smoothProgress, [0.80, 0.86, 0.98, 1.00], [0, 1, 1, 0.6]);
  const s5Scale = useTransform(smoothProgress, [0.80, 0.88, 1.00], [0.92, 1, 0.98]);
  const s5Y = useTransform(smoothProgress, [0.80, 0.87, 1.00], [40, 0, -20]);
  const s5LogoScale = useTransform(smoothProgress, [0.82, 0.90], [0.85, 1.05]);

  // Background atmosphere transformations across the 500vh scroll
  const bgMarblingOpacity = useTransform(smoothProgress, [0, 0.5, 1], [0.16, 0.22, 0.12]);
  const bgLightAuraY = useTransform(smoothProgress, [0, 1], ['-10%', '60%']);
  const bgLightAuraX = useTransform(smoothProgress, [0, 1], ['20%', '-20%']);

  // Scene titles for interactive navigator dots
  const scenes = [
    { id: 0, titleEn: 'Brand Origin', titleAr: 'الأصل والهوية' },
    { id: 1, titleEn: 'Craft Creed', titleAr: 'فلسفة الصنع' },
    { id: 2, titleEn: 'Product Reveal', titleAr: 'تشكيلة الحلويات' },
    { id: 3, titleEn: 'Sensory Curve', titleAr: 'تجربة الحواس' },
    { id: 4, titleEn: 'The Atelier', titleAr: 'دخول المعمل' }
  ];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full select-none"
      style={{ height: '520vh' }}
    >
      {/* 
        STICKY VIEWPORT
        Pins for the entire 520vh duration.
        All 5 scenes morph seamlessly inside this 100vh canvas.
      */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#FAF6F0] flex flex-col justify-between">
        
        {/* Dynamic Multi-layered Atmospheric Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {/* Subtle Warm Caramel & Gold Radial Lights */}
          <motion.div
            style={{
              top: bgLightAuraY,
              left: bgLightAuraX,
              scale: s4AuraScale
            }}
            className="absolute w-[500px] h-[500px] sm:w-[750px] sm:h-[750px] rounded-full bg-gradient-to-tr from-[#E89228]/15 via-[#C26715]/12 to-transparent blur-[120px]"
          />
          <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] rounded-full bg-gradient-to-tl from-[#C2293E]/10 via-[#DF9B35]/10 to-transparent blur-[100px]" />
          
          {/* Authentic Slow-Drifting Marbling Pattern Texture */}
          <motion.div
            style={{ opacity: bgMarblingOpacity }}
            className="absolute inset-0 bg-[url('/images/marbling.jpg')] bg-cover bg-center mix-blend-multiply filter contrast-125 brightness-95"
          />

          {/* Delicate Vignette */}
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#FAF6F0]/30 to-[#FAF6F0]/80" />
        </div>

        {/* 
          TOP FLOATING UTILITIES BAR (Subtle Minimalist Brand Controls)
        */}
        <div className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 flex items-center justify-between pointer-events-auto">
          {/* Left / Start: Brand Crest Badge */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF6F0]/90 border border-[#E8DFD3] text-[11px] font-bold tracking-wider uppercase text-[#C26715] shadow-xs backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-[#E89228]" />
              <span>{isRtl ? 'معمل حلويات توماكت' : 'toomakt Confectionery Atelier'}</span>
            </span>
          </div>

          {/* Right / End: Audio Atmosphere Toggle & Skip To Store Action */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleSound}
              type="button"
              className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-[#FAF6F0]/80 border border-[#E8DFD3] hover:border-[#C26715]/50 text-[#7A6B63] hover:text-[#2B170E] transition-all text-xs flex items-center gap-1.5 backdrop-blur-md shadow-xs cursor-pointer"
              title={isMuted ? 'Unmute Atelier sound' : 'Mute sound'}
              aria-label="Sound toggle"
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-[#7A6B63]" />
                  <span className="hidden md:inline text-[11px] font-medium">{isRtl ? 'الصوت صامت' : 'Sound Off'}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#C26715] animate-pulse" />
                  <span className="hidden md:inline text-[11px] font-bold text-[#C26715]">{isRtl ? 'مؤثرات نشطة' : 'Sound On'}</span>
                </>
              )}
            </button>

            <button
              onClick={handleSkipToStore}
              type="button"
              className="px-3.5 py-1.5 rounded-full bg-[#2B170E] hover:bg-[#C26715] text-[#FFFDF9] transition-all text-xs font-bold flex items-center gap-1.5 shadow-sm hover:shadow-md cursor-pointer group"
            >
              <span>{isRtl ? 'تخطي إلى المتجر' : 'Skip to Store'}</span>
              <ArrowDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-y-0.5" />
            </button>
          </div>
        </div>

        {/* 
          CENTRAL STAGE FOR THE 5 MORPHING SCENES
        */}
        <div className="relative z-10 w-full flex-1 max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-center">

          {/* ======================================================== */}
          {/* SCENE 01: BRAND INTRODUCTION (0.00 -> 0.22)               */}
          {/* ======================================================== */}
          <motion.div
            style={{
              opacity: s1Opacity,
              scale: s1Scale,
              y: s1Y,
              filter: `blur(${s1Blur}px)`
            }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none"
          >
            {/* Real Authentic Logo Entrance with Subtle Floating Fruit Badges */}
            <div className="relative flex items-center justify-center mb-4 sm:mb-6">
              {/* Subtle Floating Fruit Logos on Flanks */}
              <motion.img
                src="/images/logos/logo_cherry.webp"
                alt="Cherry Emblem"
                style={{
                  x: mousePos.x * -18,
                  y: mousePos.y * -14
                }}
                className="hidden md:block absolute -left-28 lg:-left-36 top-2 w-16 lg:w-20 h-auto object-contain opacity-75 filter drop-shadow-md transform -rotate-12 transition-transform duration-300"
              />
              <motion.img
                src="/images/logos/logo_lemon.webp"
                alt="Lemon Emblem"
                style={{
                  x: mousePos.x * 20,
                  y: mousePos.y * 16
                }}
                className="hidden md:block absolute -right-28 lg:-right-36 top-4 w-16 lg:w-20 h-auto object-contain opacity-75 filter drop-shadow-md transform rotate-12 transition-transform duration-300"
              />

              {/* Central Primary Logo */}
              <motion.div
                style={{ scale: s1LogoScale }}
                className="relative inline-block"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#E89228]/30 to-[#C26715]/20 blur-xl scale-125" />
                <img
                  src="/images/logos/logo_toomakt_main.webp"
                  alt="toomakt"
                  className="relative h-20 sm:h-28 md:h-36 w-auto object-contain drop-shadow-xl select-none"
                />
              </motion.div>
            </div>

            {/* Main Brand Statement (Word by Word Aesthetic) */}
            <div className="space-y-3 sm:space-y-4 max-w-3xl">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF6F0] border border-[#E8DFD3] text-xs font-black tracking-[0.2em] uppercase text-[#C26715] shadow-xs">
                <Award className="w-3.5 h-3.5 text-[#DF9B35]" />
                <span>{isRtl ? 'دفعة حلويات ممتازة • إصدار حصري' : 'FINE CONFECTIONERY • BATCH 08'}</span>
              </span>

              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-black text-[#2B170E] tracking-tight leading-[1.08]">
                {isRtl ? (
                  <>فاكهة حقيقية. كراميل أصيل.<br /><span className="gold-gradient-text">شغف لا يقاوم.</span></>
                ) : (
                  <>BIG FRUIT. REAL TOFFEE.<br /><span className="gold-gradient-text">PURE OBSESSION.</span></>
                )}
              </h1>

              <p className="text-sm sm:text-lg md:text-xl text-[#7A6B63] max-w-2xl mx-auto font-normal leading-relaxed">
                {isRtl
                  ? 'كراميل ذهبي مطهو ببطء فائق وممزوج ببيوريه الفواكه الطبيعية 100% وزبدة أوروبية فاخرة.'
                  : 'Artisanal slow-cooked golden caramel infused with 100% sun-ripened real fruit purées and European cultured butter.'}
              </p>
            </div>
          </motion.div>

          {/* ======================================================== */}
          {/* SCENE 02: WHAT THE BRAND REPRESENTS (0.19 -> 0.43)        */}
          {/* ======================================================== */}
          <motion.div
            style={{
              opacity: s2Opacity,
              scale: s2Scale,
              y: s2Y,
              filter: `blur(${s2Blur}px)`
            }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none"
          >
            <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
              {/* Category Eyebrow */}
              <div className="flex items-center justify-center gap-2">
                <span className="px-3.5 py-1 rounded-full bg-[#C26715]/10 border border-[#C26715]/30 text-xs font-extrabold tracking-widest uppercase text-[#C26715]">
                  {isRtl ? 'فلسفة الصنع والحرفة' : 'THE ARTISAN CREED'}
                </span>
              </div>

              {/* Masked Rising Headline with Position Movement */}
              <div className="overflow-hidden">
                <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-black text-[#2B170E] leading-tight max-w-3xl mx-auto">
                  {isRtl ? (
                    <>حيث تلتقي الفاكهة المشمسة ببطء الطهي عند <span className="text-[#C26715]">118°C</span></>
                  ) : (
                    <>WHERE SUN-RIPENED FRUIT MEETS SLOW SIMMER AT <span className="text-[#C26715]">118°C</span></>
                  )}
                </h2>
              </div>

              <p className="text-sm sm:text-base md:text-lg text-[#7A6B63] max-w-2xl mx-auto leading-relaxed">
                {isRtl
                  ? 'نرفض استخدام النكهات الصناعية وزيوت النخيل. كل قطعة تُطهى في قدور نحاسية تقليدية وتُسحب يدوياً لضمان قوام ناعم يذوب بحرارة الفم.'
                  : 'Zero palm oil. Zero synthetic essences. Pure cane sugar and Normandy cultured butter slow-caramelized to golden perfection, preserving authentic fruit pectin.'}
              </p>

              {/* 3 Parallax Floating Craft Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto pt-2 sm:pt-4">
                <motion.div
                  style={{ y: s2Pillar1Y }}
                  className="bg-[#FFFFFF]/90 backdrop-blur-md p-4 rounded-2xl border border-[#E8DFD3] shadow-sm flex flex-col items-center text-center"
                >
                  <div className="w-10 h-10 rounded-full bg-[#C2293E]/10 flex items-center justify-center text-[#C2293E] mb-2 font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#2B170E]">
                    {isRtl ? 'بيوريه فاكهة 100%' : '100% Real Orchard Puree'}
                  </h3>
                  <p className="text-xs text-[#7A6B63] mt-1">
                    {isRtl ? 'فراولة برية، مانجو ألفونسو، وحمضيات طازجة' : 'Cold-macerated alpine strawberry & Alphonso mango'}
                  </p>
                </motion.div>

                <motion.div
                  style={{ y: s2Pillar2Y }}
                  className="bg-[#FFFFFF]/90 backdrop-blur-md p-4 rounded-2xl border border-[#E8DFD3] shadow-sm flex flex-col items-center text-center"
                >
                  <div className="w-10 h-10 rounded-full bg-[#C26715]/10 flex items-center justify-center text-[#C26715] mb-2 font-bold">
                    <Flame className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#2B170E]">
                    {isRtl ? 'زبدة أوروبية فاخرة' : 'European Cultured Butter'}
                  </h3>
                  <p className="text-xs text-[#7A6B63] mt-1">
                    {isRtl ? '84% دسم حليبي طبيعي لكراميل مخملي' : '84% grass-fed sweet cream for luscious melt'}
                  </p>
                </motion.div>

                <motion.div
                  style={{ y: s2Pillar3Y }}
                  className="bg-[#FFFFFF]/90 backdrop-blur-md p-4 rounded-2xl border border-[#E8DFD3] shadow-sm flex flex-col items-center text-center"
                >
                  <div className="w-10 h-10 rounded-full bg-[#2B170E]/10 flex items-center justify-center text-[#2B170E] mb-2 font-bold">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#2B170E]">
                    {isRtl ? 'مضغ حريري 45 ثانية' : '45s Signature Chew'}
                  </h3>
                  <p className="text-xs text-[#7A6B63] mt-1">
                    {isRtl ? 'لا يلتصق بالأسنان ويحرر طبقات النكهة تدريجياً' : 'Never sticks to teeth; blooms in three distinct waves'}
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* ======================================================== */}
          {/* SCENE 03: PRODUCT / VISUAL REVEAL (0.39 -> 0.65)          */}
          {/* ======================================================== */}
          <motion.div
            style={{
              opacity: s3Opacity,
              scale: s3Scale,
              y: s3Y
            }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none"
          >
            {/* Eyebrow & Headline */}
            <div className="mb-4 sm:mb-6 max-w-2xl">
              <span className="px-3.5 py-1 rounded-full bg-[#E89228]/15 border border-[#E89228]/40 text-xs font-black tracking-widest uppercase text-[#C26715]">
                {isRtl ? 'إبداعات عيلة توماكت الأصلية' : 'THE SIGNATURE LINEUP'}
              </span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-black text-[#2B170E] mt-2">
                {isRtl ? 'أربع عائلات، شغف واحد متقن' : 'Four Product Lines. One Pure Obsession.'}
              </h2>
            </div>

            {/* Dynamic Layered Multi-Angle Product Stage */}
            <div className="relative w-full max-w-4xl h-[280px] sm:h-[360px] md:h-[420px] flex items-center justify-center">
              {/* Warm Caramel Radial Glow behind Centerpiece */}
              <div className="absolute w-[280px] h-[280px] sm:w-[420px] sm:h-[420px] rounded-full bg-[#C26715]/20 blur-3xl" />

              {/* Left Flank: Fruity Candy Pack */}
              <motion.div
                style={{
                  x: s3LeftProductX,
                  rotate: s3LeftProductRotate
                }}
                className="absolute left-4 sm:left-12 md:left-16 z-10 w-36 sm:w-52 md:w-64"
              >
                <div className="relative group">
                  <img
                    src="/images/toomakt/cat_fruity_candy.webp"
                    alt="Fruity Candy"
                    className="w-full h-auto object-contain filter drop-shadow-xl select-none"
                  />
                  <div className="mt-2 text-center">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-[#FFFFFF]/90 border border-[#E8DFD3] text-[10px] sm:text-xs font-bold text-[#C2293E] shadow-xs">
                      {isRtl ? 'كاندي الفواكه المشكلة' : 'Fruit Flavors Line'}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Centerpiece: Full Family Showcase / عيلة توماكت */}
              <motion.div
                style={{
                  scale: s3CenterProductScale,
                  y: s3CenterProductY
                }}
                className="relative z-20 w-52 sm:w-72 md:w-96 cursor-pointer pointer-events-auto"
                onClick={() => onSelectProduct && onSelectProduct(HERO_PRODUCT)}
              >
                <div className="relative group">
                  <img
                    src="/images/toomakt/hero_family_showcase.webp"
                    alt="The Full Family Showcase"
                    className="w-full h-auto object-contain filter drop-shadow-2xl select-none transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className="px-3 py-1 rounded-full bg-[#2B170E] text-[#FFFDF9] text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5 border border-[#C26715]/40">
                      <Sparkles className="w-3 h-3 text-[#E89228]" />
                      <span>{isRtl ? 'عيلة توماكت الكاملة' : 'The Grand Atelier Family'}</span>
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Right Flank: Butter & Milk Toffee */}
              <motion.div
                style={{
                  x: s3RightProductX,
                  rotate: s3RightProductRotate
                }}
                className="absolute right-4 sm:right-12 md:right-16 z-10 w-36 sm:w-52 md:w-64"
              >
                <div className="relative group">
                  <img
                    src="/images/toomakt/cat_butter_milk_toffee.webp"
                    alt="Butter & Milk Toffee"
                    className="w-full h-auto object-contain filter drop-shadow-xl select-none"
                  />
                  <div className="mt-2 text-center">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-[#FFFFFF]/90 border border-[#E8DFD3] text-[10px] sm:text-xs font-bold text-[#2B5A8F] shadow-xs">
                      {isRtl ? 'حليب وبتر كاندي فاخر' : 'Butter & Milk Toffee'}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Supporting Credentials */}
            <div className="flex items-center justify-center gap-4 sm:gap-8 mt-2 text-xs font-semibold text-[#7A6B63]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#C26715]" />
                <span>{isRtl ? '20 قطعة مغلفة فردياً بالذهب' : '20 Individually Wrapped Gems'}</span>
              </span>
              <span className="hidden sm:inline text-[#E8DFD3]">•</span>
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#E89228]" />
                <span>{isRtl ? 'حاصلة على جوائز الحلويات الحرفية' : 'Gold Medal Artisanal Confiserie'}</span>
              </span>
            </div>
          </motion.div>

          {/* ======================================================== */}
          {/* SCENE 04: BRAND EXPERIENCE / IMMERSION (0.61 -> 0.85)     */}
          {/* ======================================================== */}
          <motion.div
            style={{
              opacity: s4Opacity,
              scale: s4Scale,
              y: s4Y
            }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none"
          >
            {/* Giant Drifting Kinetic Typography in Background */}
            <motion.div
              style={{ x: s4TextParallaxX }}
              className="absolute -top-6 sm:top-2 inset-x-0 overflow-hidden whitespace-nowrap opacity-10 pointer-events-none select-none"
            >
              <span className="text-6xl sm:text-8xl md:text-9xl font-serif font-black text-[#C26715] tracking-widest uppercase">
                {isRtl ? 'شغف المضغ الحريري • سر الطعم الأصيل •' : 'THE ART OF CHEW • PURE OBSESSION •'}
              </span>
            </motion.div>

            {/* Central Experience Header */}
            <div className="relative z-10 max-w-3xl mx-auto mb-6 sm:mb-8">
              <span className="px-3.5 py-1 rounded-full bg-[#FAF6F0] border border-[#E8DFD3] text-xs font-extrabold tracking-widest uppercase text-[#C26715]">
                {isRtl ? 'تطور النكهة على الحواس' : 'THE SENSORY EVOLUTION'}
              </span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-black text-[#2B170E] mt-2">
                {isRtl ? 'ثلاث مراحل تدوم 45 ثانية في الفم' : 'Three Sensorial Waves Over 45 Seconds'}
              </h2>
            </div>

            {/* 3 Interactive Sensory Timeline Cards */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto w-full">
              <div className="bg-[#FFFFFF]/95 backdrop-blur-md p-5 rounded-2xl border border-[#E8DFD3] shadow-md flex flex-col text-left rtl:text-right relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#DF9B35]/10 rounded-bl-full pointer-events-none" />
                <span className="text-2xl font-serif font-black text-[#C26715]">0s</span>
                <h3 className="font-serif font-bold text-base text-[#2B170E] mt-1">
                  {isRtl ? 'دفء الزبدة الذائبة' : 'Warm Butter Melt'}
                </h3>
                <p className="text-xs text-[#7A6B63] mt-2 leading-relaxed">
                  {isRtl
                    ? 'بمجرد ملامسة حرارة الفم، تطلق زبدة نورماندي دسامة الحليب ودفء الفانيليا الطبيعية دون أن تلتصق بالأسنان.'
                    : 'Cultured Normandy butter melts immediately at body temperature, coating the palate with rich sweet cream notes.'}
                </p>
              </div>

              <div className="bg-[#FFFFFF]/95 backdrop-blur-md p-5 rounded-2xl border border-[#E8DFD3] shadow-md flex flex-col text-left rtl:text-right relative overflow-hidden group border-t-4 border-t-[#C2293E]">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#C2293E]/10 rounded-bl-full pointer-events-none" />
                <span className="text-2xl font-serif font-black text-[#C2293E]">20s</span>
                <h3 className="font-serif font-bold text-base text-[#2B170E] mt-1">
                  {isRtl ? 'انفجار نكتار الفاكهة' : 'Pure Fruit Peak'}
                </h3>
                <p className="text-xs text-[#7A6B63] mt-2 leading-relaxed">
                  {isRtl
                    ? 'بيوريه الفواكه الطبيعية المعصورة على البارد يتدفق بنكهة حامضية حلوة منعشة تعيد للأذهان طعم الفاكهة الطازجة من الشجرة.'
                    : 'Cold-pressed real orchard fruit purée bursts through, releasing vibrant natural pectin and lively fruit tartness.'}
                </p>
              </div>

              <div className="bg-[#FFFFFF]/95 backdrop-blur-md p-5 rounded-2xl border border-[#E8DFD3] shadow-md flex flex-col text-left rtl:text-right relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#2B170E]/10 rounded-bl-full pointer-events-none" />
                <span className="text-2xl font-serif font-black text-[#2B170E]">45s</span>
                <h3 className="font-serif font-bold text-base text-[#2B170E] mt-1">
                  {isRtl ? 'لمسة التوفي والملح الذهبي' : 'Salted Toffee Finish'}
                </h3>
                <p className="text-xs text-[#7A6B63] mt-2 leading-relaxed">
                  {isRtl
                    ? 'رقائق ملح مالدون البحري والسكر المكرمل يختتمان التجربة بنقاء تام دون أي طعم صناعي متبقي.'
                    : 'Maldon sea salt crystals crystallize with golden caramel for a crisp, memorable savory-sweet finish.'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* ======================================================== */}
          {/* SCENE 05: FINAL BRAND STATEMENT & GATEWAY (0.81 -> 1.00)  */}
          {/* ======================================================== */}
          <motion.div
            style={{
              opacity: s5Opacity,
              scale: s5Scale,
              y: s5Y
            }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-auto"
          >
            {/* Re-entering Brand Crest & Logo in Center */}
            <motion.div
              style={{ scale: s5LogoScale }}
              className="relative inline-block mb-4 sm:mb-6"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#C26715]/40 via-[#E89228]/25 to-transparent blur-2xl scale-150" />
              <img
                src="/images/logos/logo_toomakt_main.webp"
                alt="toomakt Atelier"
                className="relative h-20 sm:h-28 md:h-32 w-auto object-contain drop-shadow-2xl select-none"
              />
            </motion.div>

            {/* Final Climax Message */}
            <div className="space-y-4 max-w-3xl mx-auto">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2B170E] text-[#FFFDF9] text-xs font-black tracking-widest uppercase shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-[#E89228]" />
                <span>{isRtl ? 'معمل توماكت يرحب بكم' : 'THE CONFECTIONERY ATELIER IS OPEN'}</span>
              </span>

              <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black text-[#2B170E] tracking-tight leading-tight">
                {isRtl ? (
                  <>انضم إلى عشاق <span className="gold-gradient-text">المذاق الحرفي الفاخر</span></>
                ) : (
                  <>WELCOME TO THE <span className="gold-gradient-text">ATELIER EXPERIENCE</span></>
                )}
              </h2>

              <p className="text-sm sm:text-lg text-[#7A6B63] max-w-2xl mx-auto leading-relaxed">
                {isRtl
                  ? 'طازج، مسحوب يدوياً، ويصلك في عبوات مبردة مباشرة إلى باب منزلك في جميع محافظات جمهورية مصر العربية.'
                  : 'Freshly pulled in small batches and delivered in insulated cooler packs to all 27 Egyptian Governorates.'}
              </p>

              {/* Action Buttons: Seamless Dive into Store & Direct Orders */}
              <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={handleSkipToStore}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#C26715] hover:bg-[#AB580D] text-white font-bold text-sm sm:text-base transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isRtl ? 'استكشف المتجر والتشكيلات' : 'Enter The Atelier Store'}</span>
                  {isRtl ? (
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  ) : (
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={onExploreFlavors}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#FAF6F0] hover:bg-[#F2EAE0] text-[#2B170E] border border-[#E8DFD3] font-bold text-sm sm:text-base transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-[#C26715]" />
                  <span>{isRtl ? 'تصفح النكهات الـ 12' : 'Explore All 12 Flavors'}</span>
                </button>
              </div>
            </div>
          </motion.div>

        </div>

        {/* 
          BOTTOM CONTROLS & FLOATING SCENE TRACKER
        */}
        <div className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 flex items-center justify-between pointer-events-auto">
          
          {/* Initial Scroll Prompt (Fades as user scrolls) */}
          <motion.div
            style={{ opacity: s1ScrollIndicatorOpacity }}
            className="flex items-center gap-2 text-xs font-bold text-[#7A6B63]"
          >
            <div className="w-5 h-8 rounded-full border-2 border-[#C26715]/50 flex items-start justify-center p-1">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1.5 h-1.5 rounded-full bg-[#C26715]"
              />
            </div>
            <span className="hidden sm:inline">
              {isRtl ? 'مرر للأسفل لاكتشاف حكاية توماكت' : 'Scroll down to unveil the brand story'}
            </span>
          </motion.div>

          {/* Interactive 5-Scene Pagination Dots */}
          <div className="flex items-center gap-2 sm:gap-3 bg-[#FAF6F0]/90 backdrop-blur-md px-3 sm:px-4 py-2 rounded-full border border-[#E8DFD3] shadow-xs mx-auto sm:mx-0">
            {scenes.map((scene) => {
              const isActive = activeScene === scene.id;
              return (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => scrollToScene(scene.id)}
                  className={`group relative flex items-center gap-1.5 transition-all cursor-pointer ${
                    isActive ? 'scale-105' : 'opacity-60 hover:opacity-100'
                  }`}
                  title={isRtl ? scene.titleAr : scene.titleEn}
                  aria-label={`Jump to ${scene.titleEn}`}
                >
                  <span
                    className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
                      isActive
                        ? 'w-6 sm:w-8 bg-[#C26715]'
                        : 'w-2 sm:w-2.5 bg-[#CDBEB0] group-hover:bg-[#7A6B63]'
                    }`}
                  />
                  {isActive && (
                    <span className="hidden lg:inline text-[11px] font-bold text-[#2B170E] whitespace-nowrap">
                      {isRtl ? scene.titleAr : scene.titleEn}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Transition indicator at end */}
          <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-[#C26715]">
            <span>{isRtl ? 'المتجر بالأسفل' : 'Store Below'}</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </div>

        </div>

        {/* 
          SEAMLESS GRADIENT WIPE AT BOTTOM OF VIEWPORT
          Guides the visual transition into the store sections below without any hard cut
        */}
        <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-[#FAF6F0] to-transparent pointer-events-none z-20" />

      </div>
    </div>
  );
};
