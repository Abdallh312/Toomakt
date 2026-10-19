import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Menu, X, Search, ChevronRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { navigateTo } from '../utils/navigation';

interface NavbarProps {
  onNavigateSection?: (sectionId: string) => void;
  onNavigateView?: (view: string) => void;
  currentView?: string;
  onSearchQuery?: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigateSection,
  onNavigateView,
  currentView = 'home',
  onSearchQuery,
}) => {
  const { totalCount, setIsCartOpen } = useCart();
  const { language, setLanguage, isRtl } = useLanguage();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isCompact, setIsCompact] = useState(false);
  const lastScrollYRef = useRef(0);
  const [activeLandingSection, setActiveLandingSection] = useState<string>('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const lastScrollY = lastScrollYRef.current;
      const scrollDiff = currentScrollY - lastScrollY;

      // Dynamic compact pill compression
      setIsCompact(currentScrollY > 48);

      // Smart direction-aware hide & reveal
      if (currentScrollY < 60) {
        setIsVisible(true);
      } else if (scrollDiff > 8) {
        // Scrolling down -> gracefully slide up
        setIsVisible(false);
      } else if (scrollDiff < -6) {
        // Scrolling up -> immediately reveal
        setIsVisible(true);
      }

      lastScrollYRef.current = currentScrollY;

      // In-page section highlight tracking if on home view
      if (currentView === 'home') {
        const sections = [
          { target: 'contact', el: document.getElementById('our-branches-trail') },
          { target: 'about',   el: document.getElementById('the-toomakt-spirit') },
          { target: 'bundles', el: document.getElementById('bundles') },
          { target: 'shop',    el: document.getElementById('meet-your-sweet-side') },
        ];

        let found = '';
        for (const sec of sections) {
          if (sec.el) {
            const rect = sec.el.getBoundingClientRect();
            if (rect.top <= 240) {
              found = sec.target;
              break;
            }
          }
        }
        setActiveLandingSection(found);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const toggleLanguage = () => setLanguage(language === 'en' ? 'ar' : 'en');

  const handleLinkClick = (target: string) => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    if (target.startsWith('#')) {
      const id = target.substring(1);
      if (onNavigateSection) {
        onNavigateSection(id);
      } else {
        const el = document.getElementById(id);
        if (el) {
          if ((window as any).lenis) {
            (window as any).lenis.scrollTo(el, { offset: -70, duration: 1.15 });
          } else {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    } else {
      if (onNavigateView) {
        onNavigateView(target);
      } else {
        navigateTo(target);
      }
    }
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = searchValue.trim();
    if (!q) return;
    if (onSearchQuery) onSearchQuery(q);
    else if (onNavigateView) onNavigateView('shop');
    window.dispatchEvent(new CustomEvent('toomakt:search', { detail: q }));
    setSearchOpen(false);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { id: 'shop',      labelAr: 'المُنتجات',       labelEn: 'Products',      target: 'shop' },
    { id: 'bundles',   labelAr: 'الباقات المختارة', labelEn: 'Bundles',       target: 'bundles' },
    { id: 'about',     labelAr: 'حِكَايَتُنَا',     labelEn: 'Our story',     target: 'about' },
    { id: 'contact',   labelAr: 'فُرُوعُنَا',       labelEn: 'Our branches',  target: 'contact' },
  ];

  const isActive = (target: string) => {
    if (currentView === 'home' && activeLandingSection) {
      return activeLandingSection === target;
    }
    return (
      currentView === target ||
      (target === 'about'   && currentView === 'our-story') ||
      (target === 'shop'    && currentView === 'products') ||
      (target === 'contact' && currentView === 'wholesale')
    );
  };

  const showNavbar = isVisible || mobileMenuOpen || searchOpen;

  return (
    <>
      {/* Floating Direction-Aware Dynamic Island Navigation Header */}
      <motion.header
        initial={{ y: 0, opacity: 1 }}
        animate={{
          y: showNavbar ? 0 : -96,
          opacity: showNavbar ? 1 : 0,
        }}
        transition={{
          y: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
          opacity: { duration: 0.22 },
        }}
        className="fixed top-2.5 sm:top-4 inset-x-0 z-50 px-3 sm:px-6 pointer-events-none transition-all"
      >
        <nav
          aria-label="Main Navigation"
          className={`pointer-events-auto mx-auto rounded-full flex items-center justify-between transition-all duration-300 ease-out ${
            isCompact
              ? 'max-w-5xl h-13 sm:h-14 px-3.5 sm:px-5 bg-white/95 backdrop-blur-2xl border border-[#22120C]/10 shadow-[0_12px_36px_rgba(34,18,12,0.06)]'
              : 'max-w-6xl h-15 sm:h-[4.25rem] px-4.5 sm:px-6 bg-white/90 backdrop-blur-xl border border-[#22120C]/08 shadow-[0_8px_30px_rgba(34,18,12,0.04)]'
          }`}
        >
          {/* Left: Brand Identity */}
          <button
            type="button"
            onClick={() => handleLinkClick('home')}
            className="group flex items-center gap-2.5 sm:gap-3 cursor-pointer focus:outline-none"
            aria-label="toomakt home"
          >
            <img
              src="/images/logos/toomakt_logo_main.png"
              alt="toomakt logo"
              className={`w-auto object-contain transition-all duration-300 group-hover:scale-105 ${
                isCompact ? 'h-6 sm:h-7' : 'h-7 sm:h-8'
              }`}
            />
            <div className="flex items-center gap-2">
              <span
                className={`font-serif text-[#22120C] tracking-tight group-hover:text-[#E890A8] transition-all lowercase leading-none ${
                  isCompact ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-[1.7rem]'
                }`}
              >
                toomakt
              </span>
            </div>
          </button>

          {/* Center: Desktop Navigation Links (Pill Track) */}
          <div className="hidden lg:flex items-center bg-[#22120C]/[0.03] p-1 rounded-full border border-[#22120C]/06">
            {navLinks.map((link) => {
              const active = isActive(link.target);
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleLinkClick(link.target)}
                  className={`relative px-4 py-1.5 rounded-full text-xs font-sans font-medium transition-all duration-200 cursor-pointer ${
                    active
                      ? 'text-white font-semibold'
                      : 'text-[#22120C]/75 hover:text-[#22120C]'
                  }`}
                >
                  {/* Active Indicator Sliding Pill */}
                  {active && (
                    <motion.div
                      layoutId="navActivePill"
                      className="absolute inset-0 rounded-full bg-[#E890A8] shadow-xs"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{isRtl ? link.labelAr : link.labelEn}</span>
                </button>
              );
            })}
          </div>

          {/* Right: Actions Suite */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Search Input / Trigger */}
            <div className="relative">
              <AnimatePresence>
                {searchOpen ? (
                  <motion.form
                    key="search-form"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 190, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    onSubmit={handleSearchSubmit}
                    className="overflow-hidden flex items-center border border-[#E890A8]/40 bg-white rounded-full px-3 py-1.5 shadow-sm"
                  >
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder={isRtl ? 'بحث...' : 'Search...'}
                      className="w-full text-xs bg-transparent text-[#22120C] placeholder-[#22120C]/40 focus:outline-none border-none shadow-none font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setSearchOpen(false)}
                      className="text-[#22120C]/50 hover:text-[#22120C] transition-colors cursor-pointer shrink-0 ml-1 rtl:ml-0 rtl:mr-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.form>
                ) : (
                  <button
                    key="search-btn"
                    type="button"
                    onClick={() => setSearchOpen(true)}
                    className="w-9 h-9 rounded-full hover:bg-[#22120C]/[0.06] border border-[#22120C]/10 text-[#22120C]/75 hover:text-[#E890A8] flex items-center justify-center transition-all cursor-pointer"
                    aria-label="Search"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                )}
              </AnimatePresence>
            </div>

            {/* Language Switcher Pill */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="h-9 px-3.5 rounded-full border border-[#22120C]/15 hover:border-[#E890A8]/40 hover:bg-[#22120C]/[0.04] text-xs font-mono font-semibold text-[#22120C]/80 hover:text-[#E890A8] transition-all cursor-pointer flex items-center justify-center"
              aria-label="Toggle language"
            >
              {language === 'en' ? 'عربي' : 'EN'}
            </button>

            {/* Shopping Tasting Bag Drawer Trigger */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="h-9 group relative flex items-center gap-1.5 px-3.5 rounded-full border border-[#22120C]/15 hover:border-[#E890A8]/40 hover:bg-[#22120C]/[0.04] text-[#22120C] transition-all cursor-pointer"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
              <span className="font-mono text-xs font-bold text-[#E890A8]">
                {totalCount}
              </span>
              {totalCount > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#E890A8] animate-pulse" />
              )}
            </button>

            {/* "Say hello" Desktop CTA Button */}
            <button
              type="button"
              onClick={() => handleLinkClick('contact')}
              className="hidden sm:inline-flex items-center justify-center gap-2 h-9 px-5 rounded-full bg-[#E890A8] hover:bg-[#6AACE9] text-white text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 shadow-[0_4px_16px_rgba(232,144,168,0.35)] hover:shadow-[0_4px_16px_rgba(106,172,233,0.45)] cursor-pointer group whitespace-nowrap shrink-0 leading-none"
            >
              <span className="translate-y-px">{isRtl ? 'تَوَاصَلْ' : 'Say hello'}</span>
              <ArrowUpRight className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 rounded-full border border-[#22120C]/15 text-[#22120C] hover:bg-[#22120C]/[0.06] flex items-center justify-center transition-colors cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Drawer Menu (Floating Frosted Panel) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-3 top-20 z-40 max-w-lg mx-auto bg-white/98 backdrop-blur-2xl rounded-3xl border border-[#22120C]/12 shadow-[0_20px_50px_rgba(34,18,12,0.18)] p-6 text-[#22120C] lg:hidden"
          >
            {/* Mobile Navigation Links */}
            <nav className="space-y-1.5 pt-2">
              {navLinks.map((link) => {
                const active = isActive(link.target);
                return (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => handleLinkClick(link.target)}
                    className={`w-full text-left rtl:text-right py-3.5 px-4 rounded-2xl flex items-center justify-between text-base font-serif transition-colors ${
                      active
                        ? 'bg-[#E890A8]/12 text-[#E890A8] font-semibold'
                        : 'text-[#22120C] hover:bg-[#22120C]/[0.04]'
                    }`}
                  >
                    <span>{isRtl ? link.labelAr : link.labelEn}</span>
                    <ChevronRight className="w-4 h-4 text-[#22120C]/30 rtl:rotate-180" />
                  </button>
                );
              })}
            </nav>

            {/* Mobile Drawer Bottom Actions */}
            <div className="pt-6 mt-4 space-y-3.5 border-t border-[#22120C]/10">
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={toggleLanguage}
                  className="flex-1 py-3 rounded-full border border-[#22120C]/20 text-xs font-mono font-semibold text-[#22120C] hover:border-[#E890A8] hover:text-[#E890A8] transition-colors"
                >
                  {language === 'en' ? 'التحويل إلى العربية' : 'Switch to English'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-3 rounded-full bg-[#E890A8] hover:bg-[#6AACE9] text-white text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isRtl ? `الحقيبة (${totalCount})` : `Bag (${totalCount})`}</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-[#22120C]/50 pt-1">
                <span>HOTLINE: 01024542139</span>
                <span>CAIRO · ATELIER</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
