import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Truck,
  Gift,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Clock,
  Flame,
  Info,
  CheckCircle2,
  Package
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { navigateTo } from '../utils/navigation';
import { api } from '../services/api';

interface AnnouncementBarProps {
  onNavigateView?: (view: string) => void;
}

interface AnnouncementItem {
  id: string;
  badgeAr: string;
  badgeEn: string;
  headlineAr: string;
  headlineEn: string;
  subtextAr: string;
  subtextEn: string;
  ctaAr: string;
  ctaEn: string;
  target: string;
  iconType: 'truck' | 'sparkles' | 'gift';
  metricAr: string;
  metricEn: string;
}

const CURATED_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'shipping',
    badgeAr: 'شحن مبرد فاخر',
    badgeEn: 'CLIMATE LOGISTICS',
    headlineAr: 'شحن مبرد مجاني لكافة محافظات مصر الـ 27 للطلبات فوق 2,000 ج.م',
    headlineEn: 'Free climate-controlled thermal delivery across Egypt on orders over 2,000 EGP',
    subtextAr: 'صناديق شحن حرارية معزولة وعبوات تبريد آمنة تحمي قوام الحلوى ونكهتها حتى التسليم.',
    subtextEn: 'Thermal-insulated boxes & cold-chain protection safeguard delicate fruit toffee texture.',
    ctaAr: 'تسوّق الآن',
    ctaEn: 'Shop Now',
    metricAr: '27 محافظة',
    metricEn: '27 GOVERNORATES',
    target: 'shop',
    iconType: 'truck',
  },
  {
    id: 'craft',
    badgeAr: 'معمل النحاس',
    badgeEn: 'COPPER ATELIER',
    headlineAr: 'فاكهة طبيعية 100% وزبدة أوروبية نقية مطهوة ببطء في مراجل نحاسية',
    headlineEn: '100% Real fruit purées & European sweet cream butter simmered in copper kettles',
    subtextAr: 'تطهى على نار هادئة بحرارة 245°F دقيقة بدون شراب ذرة أو زيوت مهدرجة أو ملونات صناعية.',
    subtextEn: 'Slow-simmered in small batches. Zero high-fructose corn syrup, zero palm oil, zero synthetic dyes.',
    ctaAr: 'اكتشف الطريقة',
    ctaEn: 'Our Craft',
    metricAr: 'نقاء تام',
    metricEn: 'PURE RECIPE',
    target: 'our-story',
    iconType: 'sparkles',
  },
  {
    id: 'gifts',
    badgeAr: 'صناديق الهدايا',
    badgeEn: 'LUXURY GIFTING',
    headlineAr: 'صناديق هدايا التذوق الفاخرة وعلب الإهداء المحفورة لجميع المناسبات والشركات',
    headlineEn: 'Curated presentation gift boxes & keepsake tins ready for personal & corporate gifting',
    subtextAr: 'تغليف كتاني فاخر مع أشرطة سحب وبطاقات إهداء مخصصة جاهزة للإهداء المباشر.',
    subtextEn: 'Linen-embossed packaging, satin pull ribbons, and custom handwritten calligraphy cards.',
    ctaAr: 'استكشف الباقات',
    ctaEn: 'View Gifts',
    metricAr: 'علب تذكارية',
    metricEn: 'KEEPSAKE TINS',
    target: 'bundles',
    iconType: 'gift',
  },
];

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onNavigateView }) => {
  const { isRtl } = useLanguage();
  const { isDark } = useTheme();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem('toomakt_alert_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  const [customAlert, setCustomAlert] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('toomakt_alert_config');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    api.getGlobalSetting('toomakt_alert_config')
      .then((dbConfig: any) => {
        if (dbConfig && typeof dbConfig === 'object') {
          setCustomAlert(dbConfig);
        }
      })
      .catch(() => {});

    const handleUpdate = (e?: any) => {
      try {
        if (e && e.detail) {
          setCustomAlert(e.detail);
        } else {
          const saved = localStorage.getItem('toomakt_alert_config');
          if (saved) setCustomAlert(JSON.parse(saved));
        }
      } catch {}
    };

    const handleResetDismiss = () => setDismissed(false);

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('toomakt:alert-updated', handleUpdate);
    window.addEventListener('toomakt:alert-reset-dismiss', handleResetDismiss);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('toomakt:alert-updated', handleUpdate);
      window.removeEventListener('toomakt:alert-reset-dismiss', handleResetDismiss);
    };
  }, []);

  // Auto-rotate announcement messages smoothly every 6.0s (paused when hovered or drawer open)
  useEffect(() => {
    if (isPaused || isDrawerOpen || dismissed || customAlert?.enabled === false) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CURATED_ANNOUNCEMENTS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, isDrawerOpen, dismissed, customAlert]);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem('toomakt_alert_dismissed', 'true');
    } catch {}
  };

  const currentItem = customAlert && customAlert.enabled
    ? {
        id: 'custom',
        badgeAr: customAlert.arPrefix || 'إشعار المعمل',
        badgeEn: customAlert.enPrefix || 'ANNOUNCEMENT',
        headlineAr: customAlert.arMain || 'أهلاً بكم في معمل توماكت للحلويات الفاخرة',
        headlineEn: customAlert.enMain || 'Welcome to Toomakt Artisanal Confectionery',
        subtextAr: 'خدمة راقية وجودة حرفية متناهية في كل دفعة تُطهى في معملنا.',
        subtextEn: 'Artisanal excellence in every copper kettle batch prepared in our Cairo atelier.',
        ctaAr: customAlert.arCta || 'تسوق الآن',
        ctaEn: customAlert.enCta || 'Shop Now',
        target: customAlert.ctaTarget || 'shop',
        metricAr: 'إشعار خاص',
        metricEn: 'SPECIAL NOTICE',
        iconType: 'sparkles' as const,
      }
    : CURATED_ANNOUNCEMENTS[currentIndex];

  const handleCtaClick = (e: React.MouseEvent, targetOverride?: string) => {
    e.preventDefault();
    const target = targetOverride || currentItem.target || 'shop';
    if (target === 'shop' || target === 'products') {
      const el = document.getElementById('featured-products');
      if (el) {
        if ((window as any).scrollToSmooth) {
          (window as any).scrollToSmooth(el, -30);
        } else {
          el.scrollIntoView({ behavior: 'smooth' });
        }
        setIsDrawerOpen(false);
        return;
      }
    }
    setIsDrawerOpen(false);
    if (onNavigateView) {
      onNavigateView(target);
    } else {
      navigateTo(target);
    }
  };

  const renderIcon = (type: string, className = 'w-3.5 h-3.5') => {
    switch (type) {
      case 'truck':
        return <Truck className={`${className} text-[#E8BD6D]`} />;
      case 'gift':
        return <Gift className={`${className} text-[#E8BD6D]`} />;
      default:
        return <Sparkles className={`${className} text-[#E8BD6D]`} />;
    }
  };

  if (dismissed || (customAlert && customAlert.enabled === false)) return null;

  return (
    <AnimatePresence>
      <motion.aside
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        exit={{ height: 0, opacity: 0, y: -8 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        aria-label="Atelier Announcement"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="w-full relative z-50 select-none border-b transition-colors duration-300 bg-gradient-to-r from-[#190F16] via-[#2A1624] to-[#190F16] text-[#F7F3EC] border-[#E8BD6D]/20 shadow-[0_4px_24px_rgba(0,0,0,0.25)]"
      >
        {/* Subtle Overhead Ambient Starlight Sheen */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,rgba(232,189,109,0.20),transparent)] pointer-events-none" />

        {/* 1. COMPACT RIBBON BAR */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-3 relative z-10">
          
          {/* LEFT: Live Telemetry Capsule Badge */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-[#E8BD6D]/20 backdrop-blur-md">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E8BD6D] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E8BD6D]" />
              </span>
              <span className="text-[10px] font-mono tracking-widest uppercase font-semibold text-[#E8BD6D]/95">
                {isRtl ? 'معمل القاهرة المباشر' : 'CAIRO ATELIER'}
              </span>
            </div>

            <span className="text-[10px] font-mono text-[#C8BEB5]/60 uppercase tracking-wider hidden xl:inline">
              {currentItem.metricEn}
            </span>
          </div>

          {/* CENTER: Rotating Editorial Announcement */}
          <div className="flex-1 flex items-center justify-center min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentItem.id + currentIndex}
                initial={{ opacity: 0, y: 7 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -7 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="flex items-center justify-center gap-2 sm:gap-3 text-center flex-nowrap min-w-0"
              >
                {/* Luminous Jewel Capsule with SVG Lucide Icon */}
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-[#E8BD6D]/15 text-[#E8BD6D] border border-[#E8BD6D]/30 shadow-xs backdrop-blur-xs shrink-0">
                  {renderIcon(currentItem.iconType)}
                  <span>{isRtl ? currentItem.badgeAr : currentItem.badgeEn}</span>
                </span>

                <span className="hidden md:inline text-[#E8BD6D]/40 font-light shrink-0">•</span>

                {/* Editorial Announcement Copy */}
                <p className="text-[11px] sm:text-xs text-[#F7F3EC] font-normal tracking-tight sm:tracking-normal truncate max-w-sm md:max-w-md lg:max-w-xl">
                  {isRtl ? currentItem.headlineAr : currentItem.headlineEn}
                </p>

                {/* Tactile Champagne Honey Gold Pill CTA */}
                <button
                  type="button"
                  onClick={(e) => handleCtaClick(e)}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-normal transition-all duration-200 cursor-pointer shadow-[0_2px_12px_rgba(232,189,109,0.3)] hover:shadow-[0_4px_20px_rgba(232,189,109,0.5)] hover:scale-103 active:scale-97 bg-gradient-to-r from-[#E8BD6D] via-[#F2CE7F] to-[#E8BD6D] text-[#140D12] shrink-0"
                >
                  <ShoppingBag className="w-3 h-3 text-[#140D12]" />
                  <span>{isRtl ? currentItem.ctaAr : currentItem.ctaEn}</span>
                  <ArrowIcon className="w-3 h-3 text-[#140D12]" />
                </button>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT: Interactive Perks Drawer Trigger & Carousel Controls */}
          <div className="flex items-center justify-end gap-1.5 shrink-0">
            {/* Interactive "Atelier Perks" Drawer Trigger Button */}
            <button
              type="button"
              onClick={() => setIsDrawerOpen((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase transition-all duration-200 cursor-pointer border ${
                isDrawerOpen
                  ? 'bg-[#E8BD6D] text-[#140D12] border-[#E8BD6D] shadow-sm font-bold'
                  : 'bg-white/5 hover:bg-white/10 text-[#E8BD6D] border-[#E8BD6D]/25 hover:border-[#E8BD6D]/50'
              }`}
              title={isRtl ? 'استعراض مزايا المعمل وتفاصيل الشحن' : 'Explore Atelier Perks & Logistics'}
              aria-expanded={isDrawerOpen}
            >
              <Sparkles className="w-3 h-3 text-current" />
              <span className="hidden sm:inline">
                {isRtl ? (isDrawerOpen ? 'إغلاق المزايا' : 'مزايا المعمل') : (isDrawerOpen ? 'Close Perks' : 'Atelier Perks')}
              </span>
              {isDrawerOpen ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>

            {/* Carousel navigation pills (desktop) */}
            {!customAlert?.enabled && CURATED_ANNOUNCEMENTS.length > 1 && (
              <div className="hidden sm:flex items-center gap-1 px-1">
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => (prev - 1 + CURATED_ANNOUNCEMENTS.length) % CURATED_ANNOUNCEMENTS.length)}
                  className="p-1 text-white/50 hover:text-white transition-colors cursor-pointer"
                  aria-label="Previous announcement"
                >
                  <ChevronLeft className="w-3 h-3 rtl:rotate-180" />
                </button>
                <div className="flex items-center gap-1">
                  {CURATED_ANNOUNCEMENTS.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrentIndex(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        currentIndex === i
                          ? 'w-4 bg-[#E8BD6D]'
                          : 'w-1.5 bg-white/20 hover:bg-white/50'
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => (prev + 1) % CURATED_ANNOUNCEMENTS.length)}
                  className="p-1 text-white/50 hover:text-white transition-colors cursor-pointer"
                  aria-label="Next announcement"
                >
                  <ChevronRight className="w-3 h-3 rtl:rotate-180" />
                </button>
              </div>
            )}

            {/* Dismiss Close Button */}
            <button
              type="button"
              onClick={handleDismiss}
              className="p-1 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer shrink-0"
              title={isRtl ? 'إغلاق الإشعار' : 'Dismiss announcement'}
              aria-label="Dismiss announcement"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* 2. ULTRA-FINE LUXURY TIMER HAIRLINE (Pauses on hover/open) */}
        {!customAlert?.enabled && (
          <div className="w-full h-[1.5px] bg-white/5 overflow-hidden">
            <motion.div
              key={`progress-${currentIndex}-${isPaused || isDrawerOpen}`}
              initial={{ width: '0%' }}
              animate={{ width: isPaused || isDrawerOpen ? '0%' : '100%' }}
              transition={{
                duration: isPaused || isDrawerOpen ? 0 : 6.0,
                ease: 'linear'
              }}
              className="h-full bg-gradient-to-r from-[#E8BD6D]/40 via-[#E8BD6D] to-[#F2CE7F]"
            />
          </div>
        )}

        {/* 3. EXPANDABLE ATELIER CONCIERGE TRAY (DRAWER UI) */}
        <AnimatePresence>
          {isDrawerOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden border-t border-[#E8E2D7]/15 bg-[#140C12]/95 backdrop-blur-xl"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                
                {/* Tray Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#E8BD6D] block mb-1">
                      {isRtl ? 'خدمات وضمانات المعمل الحرفية' : 'TOOMAKT ATELIER PLEDGES & CONCIERGE'}
                    </span>
                    <h3 className="font-serif text-lg sm:text-2xl text-[#F7F3EC] font-normal tracking-tight">
                      {isRtl ? 'كل ما تحتاج معرفته عن الشحن والمكونات والهدايا' : 'Crafted slowly. Dispatched in pristine climate control.'}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => handleCtaClick(e, 'shop')}
                      className="px-4 py-2 rounded-full text-xs font-semibold bg-[#E8BD6D] hover:bg-[#F2CE7F] text-[#140D12] transition-colors shadow-sm cursor-pointer"
                    >
                      <span>{isRtl ? 'تسوق التشكيلة كاملة' : 'Explore All Confections'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsDrawerOpen(false)}
                      className="px-3 py-2 rounded-full text-xs font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'إغلاق' : 'Close'}</span>
                    </button>
                  </div>
                </div>

                {/* 3 Luxury Bento Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                  
                  {/* Card 1: Climate Shipping */}
                  <div
                    onClick={(e) => handleCtaClick(e, 'cms/shipping')}
                    className="p-5 rounded-2xl bg-white/5 hover:bg-white/8 border border-white/10 hover:border-[#E8BD6D]/40 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-[#E8BD6D]/15 text-[#E8BD6D] flex items-center justify-center border border-[#E8BD6D]/25">
                          <Truck className="w-5 h-5 text-[#E8BD6D]" />
                        </div>
                        <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full bg-white/10 text-[#E8BD6D]">
                          {isRtl ? 'مجاني فوق 2,000 ج.م' : 'FREE > 2,000 EGP'}
                        </span>
                      </div>
                      <h4 className="font-serif text-base text-[#F7F3EC] group-hover:text-[#E8BD6D] transition-colors mb-2">
                        {isRtl ? 'الشحن المبرد المعزول' : 'Climate-Controlled Dispatch'}
                      </h4>
                      <p className="text-xs text-[#C8BEB5] font-light leading-relaxed mb-4">
                        {isRtl
                          ? 'صناديق شحن حرارية معزولة مع عبوات تبريد آمنة لضمان وصول التوفي بالقوام الأصلي نفسه حتى في أشد أيام الصيف حرارة بكافة المحافظات الـ 27.'
                          : 'Custom insulated thermal boxes with food-safe cooling packs guarantee factory-fresh chew and texture across Cairo, Alexandria, Delta, and all 27 governorates.'}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#E8BD6D] font-medium">
                      <span>{isRtl ? 'تفاصيل أوقات التوصيل' : 'Governorate Delivery Schedule'}</span>
                      <ArrowIcon className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Card 2: Pure Kettle Recipe */}
                  <div
                    onClick={(e) => handleCtaClick(e, 'our-story')}
                    className="p-5 rounded-2xl bg-white/5 hover:bg-white/8 border border-white/10 hover:border-[#E8BD6D]/40 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-[#E8BD6D]/15 text-[#E8BD6D] flex items-center justify-center border border-[#E8BD6D]/25">
                          <Sparkles className="w-5 h-5 text-[#E8BD6D]" />
                        </div>
                        <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full bg-white/10 text-[#E8BD6D]">
                          {isRtl ? '100% طبيعي' : '100% CLEAN LABEL'}
                        </span>
                      </div>
                      <h4 className="font-serif text-base text-[#F7F3EC] group-hover:text-[#E8BD6D] transition-colors mb-2">
                        {isRtl ? 'فاكهة حقيقية وقدور نحاسية' : 'Copper Kettle Simmering'}
                      </h4>
                      <p className="text-xs text-[#C8BEB5] font-light leading-relaxed mb-4">
                        {isRtl
                          ? 'نطهو بيوريه الفاكهة الطبيعية الكاملة مع زبدة النورماندي بنسبة دسم 84% على نار هادئة. خالي تماماً من شراب الذرة، وزيت النخيل، والنكهات الاصطناعية.'
                          : 'Slow-simmered at 245°F in genuine French copper cauldrons with real fruit purée and sweet European butter. Zero glucose syrups, zero palm oil, zero synthetic dyes.'}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#E8BD6D] font-medium">
                      <span>{isRtl ? 'اقرأ قصة التأسيس' : 'Read Our Full Atelier Story'}</span>
                      <ArrowIcon className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Card 3: Luxury Gifting */}
                  <div
                    onClick={(e) => handleCtaClick(e, 'bundles')}
                    className="p-5 rounded-2xl bg-white/5 hover:bg-white/8 border border-white/10 hover:border-[#E8BD6D]/40 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-[#E8BD6D]/15 text-[#E8BD6D] flex items-center justify-center border border-[#E8BD6D]/25">
                          <Gift className="w-5 h-5 text-[#E8BD6D]" />
                        </div>
                        <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full bg-white/10 text-[#E8BD6D]">
                          {isRtl ? 'جاهزة للإهداء' : 'GIFT READY'}
                        </span>
                      </div>
                      <h4 className="font-serif text-base text-[#F7F3EC] group-hover:text-[#E8BD6D] transition-colors mb-2">
                        {isRtl ? 'صناديق وعلب الهدايا الفاخرة' : 'Curated Keepsake Tins'}
                      </h4>
                      <p className="text-xs text-[#C8BEB5] font-light leading-relaxed mb-4">
                        {isRtl
                          ? 'علب معدنية محفورة وصناديق كتانية أنيقة مصحوبة بأشرطة حريرية وبطاقات إهداء مخصصة. مثالية للمناسبات العائلية وهدايا الشركات الفاخرة.'
                          : 'Embossed heirloom tins and linen presentation boxes tied with satin ribbons and personalized calligraphy notes. Perfect for weddings and corporate appreciation.'}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#E8BD6D] font-medium">
                      <span>{isRtl ? 'استعراض باقات الهدايا' : 'Browse Luxury Bundles'}</span>
                      <ArrowIcon className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                    </div>
                  </div>

                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.aside>
    </AnimatePresence>
  );
};

