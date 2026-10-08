import React, { useRef, useState } from 'react';
import { ArrowRight, ArrowLeft, Play, Pause, Volume2, VolumeX, Film, Sparkles, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { ScrollReveal } from './ScrollReveal';

interface HeroSectionProps {
  onShopNow: () => void;
  onExploreProcess?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onShopNow,
  onExploreProcess,
}) => {
  const { isRtl } = useLanguage();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [activeMediaTab, setActiveMediaTab] = useState<'video' | 'gallery'>('video');
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);

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
      id: 'tasting',
      src: '/videos/toomakt_tasting_ritual.mp4',
      poster: '/images/hero/hero_tasting_poster.webp',
      labelAr: 'طقوس التذوق',
      labelEn: 'Tasting Ritual',
      badgeAr: 'طقوس تقديم وتذوق التوفي · كريستال فاخر',
      badgeEn: 'Tasting Ritual · Crystal Service',
    },
    {
      id: 'factory',
      src: '/videos/toomakt_factory_tour.mp4',
      poster: '/images/hero/hero_factory_poster.webp',
      labelAr: 'جولة المصنع',
      labelEn: 'Factory Tour',
      badgeAr: 'جولة داخل خطوط الإنتاج · القاهرة',
      badgeEn: 'Factory Tour · Cairo Production',
    },
  ];

  const currentVideo = heroVideos[selectedVideoIndex];

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

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleProcessClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onExploreProcess) {
      onExploreProcess();
    } else {
      const el = document.getElementById('our-approach');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#FAF7F2] dark:bg-[#0C080A] pt-8 pb-14 sm:pt-12 sm:pb-20 md:pt-16 md:pb-24 border-b border-[#E8E2D7] dark:border-[#2A1622] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-6 flex flex-col justify-center text-left rtl:text-right">
            {/* Elegant Minimal Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-3 sm:mb-4 px-3 py-1.5 rounded-full bg-white/90 dark:bg-[#181014] border border-[#E8E2D7] dark:border-[#341F2B] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#8B2D5C] animate-pulse" />
              <span className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-[#736B63] dark:text-[#B0A396]">
                {isRtl ? 'معمل حلوى التوفي الحرفي بالقاهرة' : 'ARTISANAL FRUIT TOFFEE ATELIER'}
              </span>
            </div>

            {/* Editorial Serif Heading - Instant paint for Core Web Vitals (FCP / LCP) */}
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-[68px] leading-[1.1] font-normal text-[#1A1A1A] dark:text-[#FAF5EE] tracking-tight mb-4 sm:mb-6">
              {isRtl ? (
                <>
                  فاكهة طبيعية،<br />
                  <span className="italic font-normal">صُنعت ببطء.</span>
                </>
              ) : (
                <>
                  Fruit,<br />
                  <span className="italic font-normal">slowly made.</span>
                </>
              )}
            </h1>

            {/* Thoughtful Description */}
            <p className="text-sm sm:text-base md:text-lg text-[#736B63] dark:text-[#B0A396] max-w-xl leading-relaxed mb-6 sm:mb-8 font-light">
              {isRtl
                ? 'حلوى توفي غنية بطبقات الفواكه الحقيقية والزبدة الأوروبية النقية. تُصنع في قدور نحاسية بدفعات صغيرة طازجة لتذوب بنعومة مع كل قضمة.'
                : 'Layered fruit toffee with a clean finish. Made slowly in small batches for considered snacking.'}
            </p>

            {/* Action Buttons */}
            <ScrollReveal delay={0.28} yOffset={15}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-6">
                <button
                  type="button"
                  onClick={onShopNow}
                  className="btn-primary w-full sm:w-auto text-center cursor-pointer shadow-soft hover:shadow-soft-md flex items-center justify-center gap-2"
                >
                  <span>{isRtl ? 'استكشف المنتجات' : 'Explore The Products'}</span>
                  <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={handleProcessClick}
                  className="btn-link text-sm font-medium justify-center sm:justify-start py-2 sm:py-0 cursor-pointer text-[#736B63] hover:text-[#1A1A1A] dark:text-[#B0A396] dark:hover:text-[#FAF5EE]"
                >
                  <span>{isRtl ? 'تعرف على طريقتنا ←' : 'Discover our process →'}</span>
                </button>
              </div>
            </ScrollReveal>

            {/* Trust Badges */}
            <ScrollReveal delay={0.35} yOffset={15}>
              <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-[#E8E2D7] dark:border-[#2A1622] grid grid-cols-3 gap-2 sm:gap-4">
                <div>
                  <span className="block text-[11px] sm:text-xs font-semibold text-[#1A1A1A] dark:text-[#FAF5EE] uppercase tracking-wider">
                    {isRtl ? 'بيوريه طبيعي 100%' : '100% Real Fruit'}
                  </span>
                  <span className="block text-[10px] sm:text-[11px] text-[#736B63] dark:text-[#B0A396] mt-0.5 font-light">
                    {isRtl ? 'فواكه منتقاة بعناية' : 'Sun-ripened purées'}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] sm:text-xs font-semibold text-[#1A1A1A] dark:text-[#FAF5EE] uppercase tracking-wider">
                    {isRtl ? 'زبدة أوروبية' : 'European Butter'}
                  </span>
                  <span className="block text-[10px] sm:text-[11px] text-[#736B63] dark:text-[#B0A396] mt-0.5 font-light">
                    {isRtl ? 'قوام ناعم يذوب' : 'Rich golden caramel'}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] sm:text-xs font-semibold text-[#1A1A1A] dark:text-[#FAF5EE] uppercase tracking-wider">
                    {isRtl ? 'دفعات صغيرة' : 'Small Batches'}
                  </span>
                  <span className="block text-[10px] sm:text-[11px] text-[#736B63] dark:text-[#B0A396] mt-0.5 font-light">
                    {isRtl ? 'في معاملنا بالقاهرة' : 'Artisanal craft'}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Hero Video & Drive Confections Showcase */}
          <div className="lg:col-span-6 relative w-full">
            <ScrollReveal delay={0.15} yOffset={25}>
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E8E2D7] dark:border-[#2A1622] bg-[#0E0A0C] shadow-soft-lg group">
                
                {/* Media Switcher Tab Header */}
                <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
                  <div className="flex items-center gap-1.5 p-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 shadow-soft">
                    <button
                      type="button"
                      onClick={() => setActiveMediaTab('video')}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                        activeMediaTab === 'video'
                          ? 'bg-white text-[#1A1A1A] shadow-xs'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      <Film className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'أفلام المعمل' : 'Atelier Films'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveMediaTab('gallery')}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                        activeMediaTab === 'gallery'
                          ? 'bg-white text-[#1A1A1A] shadow-xs'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'منتجات المعمل' : 'Confections'}</span>
                    </button>
                  </div>

                  {activeMediaTab === 'video' && (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={togglePlay}
                        className="w-8 h-8 rounded-full bg-black/70 backdrop-blur-md text-white hover:bg-white hover:text-[#1A1A1A] border border-white/10 transition-colors flex items-center justify-center cursor-pointer shadow-soft"
                        aria-label={isPlaying ? 'Pause video' : 'Play video'}
                      >
                        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                      </button>

                      <button
                        type="button"
                        onClick={toggleMute}
                        className="w-8 h-8 rounded-full bg-black/70 backdrop-blur-md text-white hover:bg-white hover:text-[#1A1A1A] border border-white/10 transition-colors flex items-center justify-center cursor-pointer shadow-soft"
                        aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                      >
                        {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}
                </div>

                {/* Sub-bar with video clips selector */}
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
                            ? 'bg-white/95 text-[#1A1A1A] border-white font-semibold shadow-xs'
                            : 'bg-black/50 text-white/80 hover:text-white border-white/10 hover:bg-black/70'
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
                        transition={{ duration: 0.35 }}
                        className="w-full h-full relative cursor-pointer flex items-center justify-center overflow-hidden"
                        onClick={() => togglePlay()}
                      >
                        {/* Ambient backdrop video - desktop only to prevent mobile CPU/bandwidth choke */}
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

                        {/* Foreground crisp HD video with poster and metadata preload */}
                        <video
                          ref={videoRef}
                          key={`main-${currentVideo.id}`}
                          src={currentVideo.src}
                          poster={currentVideo.poster}
                          preload="metadata"
                          autoPlay
                          loop
                          muted={isMuted}
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
                        transition={{ duration: 0.35 }}
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
                  <div className="bg-[#FAF7F2]/95 dark:bg-[#1A1512]/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#E8E2D7] dark:border-white/10 shadow-soft-md flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#88C057] animate-pulse" />
                    <span className="text-xs font-medium text-[#1A1A1A] dark:text-[#FAF7F2]">
                      {activeMediaTab === 'video'
                        ? (isRtl ? currentVideo.badgeAr : currentVideo.badgeEn)
                        : (isRtl ? 'تشكيلة منتجات توماكت الأصلية' : 'Official TooMakt Collection')}
                    </span>
                  </div>

                  <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white/90 border border-white/10 text-[11px] font-mono">
                    <Sparkles className="w-3 h-3 text-[#FFD147]" />
                    <span>{isRtl ? 'طازج يدوياً' : 'Freshly Handcrafted'}</span>
                  </div>
                </div>

              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
};
