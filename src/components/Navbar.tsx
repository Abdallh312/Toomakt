import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  ArrowRight,
  Gift,
  Sun,
  Moon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { navigateTo } from '../utils/navigation';

interface NavbarProps {
  onNavigateSection?: (id: string) => void;
  onNavigateView?: (view: string) => void;
  currentView?: string;
  onSearchQuery?: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigateView,
  currentView = 'home',
  onSearchQuery,
}) => {
  const { totalCount, setIsCartOpen } = useCart();
  const { language, isRtl, toggleLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleLinkClick = (target: string) => {
    if (onNavigateView) {
      onNavigateView(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
    setSearchOpen(false);
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    const query = searchValue.trim();
    if (onSearchQuery) {
      onSearchQuery(query);
    }
    if (onNavigateView) {
      onNavigateView('shop');
    } else {
      navigateTo('shop');
    }
    window.dispatchEvent(new CustomEvent('toomakt:search', { detail: query }));
    setSearchOpen(false);
  };

  const navLinks = [
    { id: 'home', label: isRtl ? 'الرئيسية' : 'Home', target: 'home' },
    { id: 'products', label: isRtl ? 'المنتجات' : 'Products', target: 'shop' },
    { id: 'bundles', label: isRtl ? 'الباقات' : 'Bundles', target: 'bundles', accent: true },
    { id: 'about', label: isRtl ? 'عن توماكت' : 'About', target: 'our-story' },
    { id: 'contact', label: isRtl ? 'اتصل بنا' : 'Contact', target: 'wholesale' },
  ];

  const isLinkActive = (target: string) => {
    if (target === 'home') return currentView === 'home' || !currentView;
    if (target === 'shop') return currentView === 'shop' || currentView === 'products';
    if (target === 'bundles') return currentView === 'bundles' || currentView === 'gifts';
    if (target === 'our-story') {
      return ['our-story', 'about', 'ingredients', 'faq', 'shipping'].includes(currentView);
    }
    if (target === 'wholesale') return currentView === 'wholesale' || currentView === 'contact';
    return currentView === target;
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FAF7F2]/90 backdrop-blur-xl shadow-[0_8px_30px_rgba(26,21,18,0.06)] border-b border-[#E8E2D7]/70 py-2.5 sm:py-3'
          : 'bg-gradient-to-b from-[#FAF7F2] to-[#FAF7F2]/95 border-b border-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          {/* Brand */}
          <button
            type="button"
            onClick={() => handleLinkClick('home')}
            className="cursor-pointer group flex flex-col items-start select-none shrink-0 text-left rtl:text-right"
            aria-label="toomakt home"
          >
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-[#1A1A1A] lowercase group-hover:text-[#3C1322] transition-colors duration-300">
                toomakt
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#3C1322] inline-block mb-1 group-hover:scale-125 transition-transform" />
            </div>
            <span className="text-[9px] font-mono tracking-[0.22em] uppercase text-[#736B63]/75 -mt-0.5 hidden sm:block">
              {isRtl ? 'معمل التوفي الحرفي' : 'ATELIER DU TOFFEE'}
            </span>
          </button>

          {/* Desktop links */}
          <nav
            className="hidden md:flex items-center gap-1 lg:gap-1.5 px-2 py-1 rounded-full bg-white/50 border border-[#E8E2D7]/60"
            aria-label="Primary"
          >
            {navLinks.map((link) => {
              const active = isLinkActive(link.target);
              const isBundles = link.id === 'bundles';

              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleLinkClick(link.target)}
                  className={`relative px-3.5 lg:px-4 py-2 rounded-full text-sm tracking-wide transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    active
                      ? 'bg-[#3C1322] text-[#FAF7F2] font-medium shadow-soft'
                      : 'text-[#736B63] hover:text-[#1A1A1A] hover:bg-[#F4EFEA]/80 font-light'
                  }`}
                >
                  {isBundles && (
                    <Gift className={`w-3.5 h-3.5 ${active ? 'text-[#FFD147]' : 'text-[#3C1322]/70'}`} />
                  )}
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <div className="relative flex items-center">
              <AnimatePresence>
                {searchOpen ? (
                  <motion.form
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 220, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    onSubmit={handleSearchSubmit}
                    className="flex items-center overflow-hidden bg-white border border-[#E8E2D7] rounded-full px-3 py-1.5 shadow-soft mr-1 rtl:mr-0 rtl:ml-1"
                  >
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder={isRtl ? 'ابحث في النكهات...' : 'Search confections...'}
                      className="w-full text-xs bg-transparent text-[#1A1A1A] focus:outline-none placeholder-[#736B63]/60 font-light"
                    />
                    {searchValue.trim() ? (
                      <button
                        type="submit"
                        className="text-[11px] font-semibold text-[#3C1322] hover:underline px-1 shrink-0 cursor-pointer"
                      >
                        {isRtl ? 'بحث' : 'Go'}
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setSearchOpen(false)}
                      className="p-1 text-[#736B63] hover:text-[#1A1A1A] cursor-pointer ml-1 rtl:ml-0 rtl:mr-1 shrink-0"
                      aria-label="Close search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.form>
                ) : null}
              </AnimatePresence>

              <button
                type="button"
                onClick={() => {
                  if (searchOpen && searchValue.trim()) {
                    handleSearchSubmit();
                  } else {
                    setSearchOpen(!searchOpen);
                  }
                }}
                className={`p-2 rounded-full transition-all cursor-pointer ${
                  searchOpen
                    ? 'bg-[#3C1322] text-[#FAF7F2]'
                    : 'text-[#1A1A1A] hover:text-[#3C1322] hover:bg-[#F4EFEA]'
                }`}
                title={isRtl ? 'البحث في المتجر' : 'Search Collection'}
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={toggleLanguage}
              className="hidden sm:inline-flex px-2.5 py-1 text-xs font-mono font-medium text-[#736B63] hover:text-[#1A1A1A] border border-[#E8E2D7] rounded-full hover:border-[#1A1A1A] transition-colors cursor-pointer"
              title={isRtl ? 'Switch to English' : 'التحويل إلى العربية'}
              aria-label="Toggle Language"
            >
              {language === 'en' ? 'عربي' : 'EN'}
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-full text-[#736B63] hover:text-[#1A1A1A] hover:bg-[#F4EFEA] border border-[#E8E2D7] transition-colors cursor-pointer"
              title={isDark ? (isRtl ? 'تفعيل الوضع النهاري' : 'Switch to Light Mode') : (isRtl ? 'تفعيل الوضع الليلي' : 'Switch to Dark Mode')}
              aria-label="Toggle Dark/Light Mode"
            >
              {isDark ? <Sun className="w-4 h-4 text-[#FFD147]" /> : <Moon className="w-4 h-4 text-[#3C1322]" />}
            </button>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative px-3 sm:px-4 py-1.5 sm:py-2 bg-[#1A1A1A] hover:bg-[#3C1322] text-[#FAF7F2] rounded-full transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer shadow-soft hover:shadow-soft-md shrink-0 active:scale-[0.97]"
              title="Shopping Bag"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#FAF7F2] shrink-0" />
              <span className="font-medium text-xs tracking-wide">
                <span className="hidden sm:inline">{isRtl ? 'الحقيبة ' : 'Bag '}</span>
                <span>({totalCount})</span>
              </span>
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#FFD147] border-2 border-[#FAF7F2]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#1A1A1A] hover:bg-[#F4EFEA] rounded-full cursor-pointer"
              aria-label="Toggle Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="md:hidden border-t border-[#E8E2D7] bg-[#FAF7F2] px-5 py-5 shadow-soft"
          >
            <form onSubmit={handleSearchSubmit} className="mb-4">
              <div className="flex items-center bg-white border border-[#E8E2D7] rounded-full px-3.5 py-2.5">
                <Search className="w-3.5 h-3.5 text-[#736B63] mr-2 rtl:mr-0 rtl:ml-2" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={isRtl ? 'ابحث في النكهات...' : 'Search confections...'}
                  className="w-full text-xs bg-transparent text-[#1A1A1A] focus:outline-none font-light"
                />
                <button type="submit" className="text-xs text-[#3C1322] font-semibold cursor-pointer">
                  {isRtl ? 'بحث' : 'Search'}
                </button>
              </div>
            </form>

            <div className="flex flex-col gap-1.5">
              {navLinks.map((link) => {
                const active = isLinkActive(link.target);
                const isBundles = link.id === 'bundles';

                return (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => handleLinkClick(link.target)}
                    className={`text-left rtl:text-right py-3.5 px-3.5 rounded-2xl text-base font-medium transition-colors flex items-center justify-between cursor-pointer ${
                      active
                        ? 'bg-[#3C1322] text-[#FAF7F2] font-semibold'
                        : 'text-[#1A1A1A] hover:bg-[#F4EFEA]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {isBundles && <Gift className={`w-4 h-4 ${active ? 'text-[#FFD147]' : 'text-[#3C1322]'}`} />}
                      {link.label}
                    </span>
                    <ArrowRight className="w-4 h-4 opacity-50 rtl:rotate-180" />
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-[#E8E2D7] flex items-center justify-between">
              <button
                type="button"
                onClick={toggleLanguage}
                className="px-3 py-1.5 text-xs font-mono font-medium text-[#736B63] border border-[#E8E2D7] rounded-full"
              >
                {language === 'en' ? 'عربي' : 'EN'}
              </button>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#736B63]/70">
                {isRtl ? 'معمل القاهرة' : 'Cairo Atelier'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
