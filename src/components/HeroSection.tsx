import React, { useRef, useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Play, Pause, Film, Sparkles, Image as ImageIcon, ShoppingBag, Eye, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { ScrollReveal } from './ScrollReveal';
import { Product } from '../types';
import { PRODUCTS } from '../data/toomaktData';

interface HeroSectionProps {
  onShopNow: () => void;
  onExploreProcess?: () => void;
  onSelectProduct?: (product: Product) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onShopNow,
  onExploreProcess,
  onSelectProduct,
}) => {
  const { isRtl, formatPrice } = useLanguage();
  const { addToCart } = useCart();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeMediaTab, setActiveMediaTab] = useState<'video' | 'gallery'>('video');
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  // 4 Signature Atelier Films - All permanently muted & high definition
  const heroVideos = [
    {
      id: 'confection',
      src: '/videos/toomakt_confection_film.mp4',
      poster: '/images/hero/hero_confection_poster.webp',
      labelAr: 'فيلم التوفي الفاخر',
      labelEn: 'Confection Film',
      badgeAr: 'حلوى التوفي الفاخرة · من تصوير المعمل',
      badgeEn: 'Artisanal Toffee · Studio Reel',
    },
    {
      id: 'flavors',
      src: '/videos/toomakt_flavors_collection.mp4',
      poster: '/images/hero/hero_tasting_poster.webp',
      labelAr: 'تشكيلة النكهات',
      labelEn: 'Flavors Collection',
      badgeAr: 'تشكيلة النكهات والعلب الفاخرة',
      badgeEn: 'Curated Confections · Studio Reel',
    },
    {
      id: 'factory',
      src: '/videos/toomakt_factory_tour.mp4',
      poster: '/images/hero/hero_factory_poster.webp',
      labelAr: 'جولة المعمل',
      labelEn: 'Cairo Atelier',
      badgeAr: 'جولة داخل خطوط الإنتاج ومراجل النحاس',
      badgeEn: 'Copper Kettles · Cairo Atelier',
    },
    {
      id: 'tasting',
      src: '/videos/toomakt_tasting_ritual.mp4',
      poster: '/images/hero/hero_tasting_poster.webp',
      labelAr: 'طقوس التذوق',
      labelEn: 'Tasting Ritual',
      badgeAr: 'طقوس تقديم وتذوق التوفي · كريستال فاخر',
      badgeEn: 'Tasting Ritual · Crystal Service',
    },
  ];

  const currentVideo = heroVideos[selectedVideoIndex];

  // Strictly enforce 100% silence on any video playback
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.volume = 0;
    }
  }, [selectedVideoIndex, activeMediaTab]);

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleProcessClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onExploreProcess) {
      onExploreProcess();
    } else {
      const el = document.getElementById('our-approach') || document.getElementById('story-ritual');
      if (el) {
        if ((window as any).scrollToSmooth) {
          (window as any).scrollToSmooth(el, -30);
        } else {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  // Top 4 signature products for quick discovery in first fold
  const quickProducts = PRODUCTS.slice(0, 4);

  const handleQuickAdd = (e: React.MouseEvent, prod: Product) => {
    e.stopPropagation();
    addToCart(prod, 1);
    setAddedProductId(prod.id);
    setTimeout(() => setAddedProductId(null), 1500);
  };

  return (
    <section className="relative overflow-hidden bg-[#FAF7F2] dark:bg-[#120D11] pt-6 pb-12 sm:pt-10 sm:pb-16 md:pt-14 md:pb-20 border-b border-[#E8E2D7] dark:border-[#33242E] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Grid: Editorial Typography + Cinematic Video Theater */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-6 flex flex-col justify-center text-left rtl:text-right">
            {/* Elegant Minimal Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-3 sm:mb-4 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-[#1B1419] border border-[#E8E2D7] dark:border-[#33242E] shadow-xs w-fit">
              <span className="w-2 h-2 rounded-full bg-[#8B2D5C] animate-pulse" />
              <span className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-[#736B63] dark:text-[#C8BEB5]">
                {isRtl ? 'معمل حلوى التوفي الحرفي بالقاهرة' : 'ARTISANAL FRUIT TOFFEE ATELIER'}
              </span>
            </div>

            {/* Editorial Serif Heading */}
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-[66px] leading-[1.08] font-normal text-[#1A1A1A] dark:text-[#F7F3EC] tracking-tight mb-4 sm:mb-6">
              {isRtl ? (
                <>
                  فاكهة طبيعية،<br />
                  <span className="italic font-normal text-[#3C1322] dark:text-[#E8BD6D]">صُنعت ببطء وإتقان.</span>
                </>
              ) : (
                <>
                  Fruit,<br />
                  <span className="italic font-normal text-[#3C1322] dark:text-[#E8BD6D]">slowly made.</span>
                </>
              )}
            </h1>

            {/* Thoughtful Description */}
            <p className="text-sm sm:text-base md:text-lg text-[#736B63] dark:text-[#C8BEB5] max-w-xl leading-relaxed mb-6 sm:mb-8 font-light">
              {isRtl
                ? 'حلوى توفي ناعمة غنية ببيوريه الفواكه الحقيقية 100% والزبدة الأوروبية النقية. تُطهى ببطء في مراجل نحاسية لتذوب بسلاسة دون التصاق.'
                : 'Artisanal layered fruit toffee handcrafted in small batches. Made slowly with 100% sun-ripened purées and European butter.'}
            </p>

            {/* Action Buttons */}
            <ScrollReveal delay={0.15} yOffset={15}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-5">
                <button
                  type="button"
                  onClick={onShopNow}
                  className="btn-primary w-full sm:w-auto text-center cursor-pointer shadow-soft hover:shadow-soft-md flex items-center justify-center gap-2 group py-3 px-6"
                >
                  <ShoppingBag className="w-4 h-4 text-[#FFD147] dark:text-[#120D11]" />
                  <span>{isRtl ? 'تسوّق التشكيلة الآن' : 'Shop The Collection'}</span>
                  <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={handleProcessClick}
                  className="btn-secondary w-full sm:w-auto text-center cursor-pointer flex items-center justify-center gap-2 py-3 px-5 text-sm"
                >
                  <Film className="w-4 h-4 text-[#8B2D5C] dark:text-[#E8BD6D]" />
                  <span>{isRtl ? 'شاهد قصة الصناعة' : 'Watch Atelier Craft'}</span>
                </button>
              </div>
            </ScrollReveal>

            {/* Trust Badges */}
            <ScrollReveal delay={0.25} yOffset={15}>
              <div className="mt-8 sm:mt-10 pt-6 sm:pt-7 border-t border-[#E8E2D7] dark:border-[#33242E] grid grid-cols-3 gap-2 sm:gap-4">
                <div className="space-y-0.5">
                  <span className="block text-[11px] sm:text-xs font-semibold text-[#1A1A1A] dark:text-[#F7F3EC] uppercase tracking-wider">
                    {isRtl ? 'بيوريه طبيعي 100%' : '100% Real Fruit'}
                  </span>
                  <span className="block text-[10px] sm:text-[11px] text-[#736B63] dark:text-[#C8BEB5] font-light">
                    {isRtl ? 'فواكه منتقاة بعناية' : 'Sun-ripened purées'}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="block text-[11px] sm:text-xs font-semibold text-[#1A1A1A] dark:text-[#F7F3EC] uppercase tracking-wider">
                    {isRtl ? 'زبدة أوروبية' : 'European Butter'}
                  </span>
                  <span className="block text-[10px] sm:text-[11px] text-[#736B63] dark:text-[#C8BEB5] font-light">
                    {isRtl ? 'قوام ناعم يذوب' : 'Golden rich chew'}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="block text-[11px] sm:text-xs font-semibold text-[#1A1A1A] dark:text-[#F7F3EC] uppercase tracking-wider">
                    {isRtl ? 'شحن مبرد لـ 27 محافظة' : 'Climate Shipped'}
                  </span>
                  <span className="block text-[10px] sm:text-[11px] text-[#736B63] dark:text-[#C8BEB5] font-light">
                    {isRtl ? 'عبوات جل تبريد' : 'All 27 Governorates'}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Hero Video Cinema Player (100% Silent, Beautiful, Smooth) */}
          <div className="lg:col-span-6 relative w-full">
            <ScrollReveal delay={0.1} yOffset={20}>
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E8E2D7] dark:border-[#33242E] bg-[#0E0A0C] shadow-soft-lg group">
                
                {/* Media Switcher Tab Header */}
                <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
                  <div className="flex items-center gap-1.5 p-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 shadow-soft">
                    <button
                      type="button"
                      onClick={() => setActiveMediaTab('video')}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                        activeMediaTab === 'video'
                          ? 'bg-white text-[#1A1A1A] shadow-xs font-semibold'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      <Film className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'أفلام المعمل' : 'Atelier Cinema'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveMediaTab('gallery')}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                        activeMediaTab === 'gallery'
                          ? 'bg-white text-[#1A1A1A] shadow-xs font-semibold'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'منتجات المعمل' : 'Confections'}</span>
                    </button>
                  </div>

                  {/* Play / Pause toggle only - STRICTLY NO AUDIO CONTROL */}
                  {activeMediaTab === 'video' && (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={togglePlay}
                        className="w-8 h-8 rounded-full bg-black/70 backdrop-blur-md text-white hover:bg-white hover:text-[#1A1A1A] border border-white/10 transition-colors flex items-center justify-center cursor-pointer shadow-soft"
                        aria-label={isPlaying ? 'Pause video' : 'Play video'}
                        title={isPlaying ? 'Pause video' : 'Play video'}
                      >
                        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                      </button>

                      <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-[#F7F3EC]/90 border border-white/10">
                        <Sparkles className="w-3 h-3 text-[#E8BD6D]" />
                        <span>{isRtl ? 'صامت تماماً' : 'Silent Reel'}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Video Clips Chapter Selector */}
                {activeMediaTab === 'video' && (
                  <div className="absolute top-14 sm:top-16 left-3 right-3 sm:left-4 sm:right-4 z-30 flex items-center gap-1.5 overflow-x-auto no-scrollbar pointer-events-auto py-1">
                    {heroVideos.map((item, idx) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVideoIndex(idx);
                          setIsPlaying(true);
                        }}
                        className={`text-[10px] sm:text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer backdrop-blur-md border ${
                          selectedVideoIndex === idx
                            ? 'bg-white/95 text-[#1A1A1A] border-white font-semibold shadow-xs scale-102'
                            : 'bg-black/55 text-white/80 hover:text-white border-white/10 hover:bg-black/75'
                        }`}
                      >
                        {isRtl ? item.labelAr : item.labelEn}
                      </button>
                    ))}
                  </div>
                )}

                {/* Main Media Viewport */}
                <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] max-h-[520px] w-full bg-[#0E0A0C] overflow-hidden flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {activeMediaTab === 'video' ? (
                      <motion.div
                        key={`video-${currentVideo.id}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full relative cursor-pointer flex items-center justify-center overflow-hidden"
                        onClick={() => togglePlay()}
                      >
                        {/* Ambient backdrop video with heavy blur for luxury mood */}
                        <video
                          key={`ambient-${currentVideo.id}`}
                          src={currentVideo.src}
                          poster={currentVideo.poster}
                          preload="none"
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="hidden md:block absolute inset-0 w-full h-full object-cover scale-125 blur-2xl opacity-40 pointer-events-none select-none"
                        />

                        {/* Foreground HD video - 100% MUTED, NO SOUND EVER */}
                        <video
                          ref={videoRef}
                          key={`main-${currentVideo.id}`}
                          src={currentVideo.src}
                          poster={currentVideo.poster}
                          preload="metadata"
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="relative z-10 max-h-full max-w-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.7)]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none z-20" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="gallery-tab"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full relative"
                      >
                        <picture>
                          <source srcSet="/images/toomakt/hero_family_showcase.webp" type="image/webp" />
                          <img
                            src="/images/toomakt/hero_family_showcase.png"
                            alt="Toomakt artisanal fruit toffees & confections"
                            width="600"
                            height="450"
                            decoding="async"
                            loading="lazy"
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                        </picture>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Bottom Bar: Contextual Quality Badge */}
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-30 flex items-center justify-between pointer-events-none">
                  <div className="bg-[#FAF7F2]/95 dark:bg-[#1B1419]/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#E8E2D7] dark:border-[#33242E] shadow-soft-md flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#88C057] animate-pulse" />
                    <span className="text-xs font-medium text-[#1A1A1A] dark:text-[#F7F3EC]">
                      {activeMediaTab === 'video'
                        ? (isRtl ? currentVideo.badgeAr : currentVideo.badgeEn)
                        : (isRtl ? 'تشكيلة منتجات توماكت الأصلية' : 'Official TooMakt Collection')}
                    </span>
                  </div>

                  <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white/90 border border-white/10 text-[11px] font-mono">
                    <Sparkles className="w-3 h-3 text-[#E8BD6D]" />
                    <span>{isRtl ? 'طازج يدوياً' : 'Fresh Handcrafted'}</span>
                  </div>
                </div>

              </div>
            </ScrollReveal>
          </div>

        </div>

        {/* HERO INSTANT BESTSELLERS BAR: Easy to see and buy products right in first fold! */}
        <div className="mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-[#E8E2D7] dark:border-[#33242E]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E8BD6D]" />
              <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#1A1A1A] dark:text-[#F7F3EC]">
                {isRtl ? 'أبرز النكهات الأكثر طلباً (تسوّق فوري)' : 'Signature Bestsellers (Instant Shop)'}
              </h2>
            </div>
            <button
              type="button"
              onClick={onShopNow}
              className="text-xs font-medium text-[#3C1322] dark:text-[#E8BD6D] hover:underline flex items-center gap-1 w-fit cursor-pointer"
            >
              <span>{isRtl ? 'عرض كل الـ 14 منتج في الكتالوج' : 'View all 14 confections'}</span>
              <ArrowIcon className="w-3 h-3" />
            </button>
          </div>

          {/* 4 Quick Product Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {quickProducts.map((prod) => {
              const name = isRtl ? (prod.name_ar || prod.name) : (prod.name_en || prod.name);
              const flavor = isRtl ? (prod.flavor_ar || prod.flavor) : (prod.flavor_en || prod.flavor);
              const isAdded = addedProductId === prod.id;

              return (
                <div
                  key={prod.id}
                  onClick={() => onSelectProduct && onSelectProduct(prod)}
                  className="group bg-white dark:bg-[#1B1419] border border-[#E8E2D7] dark:border-[#33242E] rounded-xl sm:rounded-2xl p-2.5 sm:p-3 hover:border-[#1A1A1A] dark:hover:border-[#E8BD6D] hover:shadow-soft transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex items-start gap-2.5 sm:gap-3">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl bg-[#FAF7F2] dark:bg-[#120D11] overflow-hidden shrink-0 border border-[#E8E2D7]/60 dark:border-[#33242E]">
                      <img
                        src={prod.image}
                        alt={name}
                        width="80"
                        height="80"
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#736B63] dark:text-[#C8BEB5] block truncate">
                        {flavor || prod.category}
                      </span>
                      <h4 className="font-serif text-xs sm:text-sm font-medium text-[#1A1A1A] dark:text-[#F7F3EC] line-clamp-1 group-hover:text-[#3C1322] dark:group-hover:text-[#E8BD6D] transition-colors">
                        {name}
                      </h4>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-[#1A1A1A] dark:text-[#F7F3EC]">
                          {formatPrice(prod.price)}
                        </span>
                        {prod.badge && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#FAF7F2] dark:bg-[#241A21] text-[#736B63] dark:text-[#C8BEB5] border border-[#E8E2D7] dark:border-[#33242E] hidden sm:inline-block">
                            {isRtl ? (prod.badge_ar || prod.badge) : (prod.badge_en || prod.badge)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Row */}
                  <div className="mt-2.5 pt-2 border-t border-[#E8E2D7]/60 dark:border-[#33242E] flex items-center justify-between gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectProduct) onSelectProduct(prod);
                      }}
                      className="text-[10px] sm:text-[11px] font-medium text-[#736B63] dark:text-[#C8BEB5] hover:text-[#1A1A1A] dark:hover:text-[#F7F3EC] flex items-center gap-1 cursor-pointer py-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>{isRtl ? 'تفاصيل' : 'Details'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(e, prod)}
                      className={`px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-medium border transition-all flex items-center gap-1 cursor-pointer ${
                        isAdded
                          ? 'bg-[#3C1322] text-white border-[#3C1322]'
                          : 'bg-[#1A1A1A] dark:bg-[#2A1D27] text-white dark:text-[#E8BD6D] border-transparent dark:border-[#E8BD6D]/30 hover:bg-[#3C1322] dark:hover:bg-[#E8BD6D] dark:hover:text-[#120D11]'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>{isRtl ? 'أُضيف' : 'Added'}</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3 h-3" />
                          <span>{isRtl ? 'إضافة' : 'Add'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
