import React, { useState, useEffect, useRef } from 'react';
import {
  ShoppingBag,
  Menu,
  X,
  Search,
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
  onNavigateSection?: (sectionId: string) => void;
  onNavigateView?: (view: string) => void;
  currentView?: string;
  onSearchQuery?: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigateSection,
  onNavigateView,
  currentView,
  onSearchQuery,
}) => {
  const { totalCount, setIsCartOpen } = useCart();
  const { language, setLanguage, isRtl } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const handleLinkClick = (target: string) => {
    setMobileMenuOpen(false);
    if (target.startsWith('#')) {
      const sectionId = target.substring(1);
      if (onNavigateSection) {
        onNavigateSection(sectionId);
      } else {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
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
    const query = searchValue.trim();
    if (!query) return;

    if (onSearchQuery) {
      onSearchQuery(query);
    } else if (onNavigateView) {
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
      return currentView ? ['our-story', 'about', 'ingredients', 'faq', 'shipping'].includes(currentView) : false;
    }
    if (target === 'wholesale') return currentView === 'wholesale' || currentView === 'contact';
    return currentView === target;
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FAF7F2]/90 dark:bg-[#120D11]/90 backdrop-blur-xl shadow-[0_8px_30px_rgba(26,21,18,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.45)] border-b border-[#E8E2D7]/70 dark:border-[#33242E] py-2.5 sm:py-3'
          : 'bg-gradient-to-b from-[#FAF7F2] to-[#FAF7F2]/95 dark:from-[#120D11] dark:to-[#120D11]/95 border-b border-transparent dark:border-[#261A23] py-3.5 sm:py-4'
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
              <span className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-[#1A1A1A] dark:text-[#F7F3EC] lowercase group-hover:text-[#3C1322] dark:group-hover:text-[#E8BD6D] transition-colors duration-300">
                toomakt
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#3C1322] dark:bg-[#E8BD6D] inline-block mb-1 group-hover:scale-125 transition-transform" />
            </div>
            <span className="text-[9px] font-mono tracking-[0.22em] uppercase text-[#736B63]/75 dark:text-[#C8BEB5] -mt-0.5 hidden sm:block">
              {isRtl ? 'معمل التوفي الحرفي' : 'ATELIER DU TOFFEE'}
            </span>
          </button>

          {/* Desktop links */}
          <nav
            className="hidden md:flex items-center gap-1 lg:gap-1.5 px-2 py-1 rounded-full bg-white/70 dark:bg-[#1B1419]/90 border border-[#E8E2D7]/80 dark:border-[#33242E] backdrop-blur-md shadow-xs"
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
                      ? 'bg-[#3C1322] dark:bg-[#E8BD6D] text-[#FAF7F2] dark:text-[#120D11] font-semibold shadow-[0_2px_12px_rgba(232,189,109,0.25)]'
                      : 'text-[#736B63] dark:text-[#C8BEB5] hover:text-[#1A1A1A] dark:hover:text-[#F7F3EC] hover:bg-[#F4EFEA]/80 dark:hover:bg-[#241A21] font-normal'
                  }`}
                >
                  {isBundles && (
                    <Gift
                      className={`w-3.5 h-3.5 ${
                        active
                          ? 'text-[#E8BD6D] dark:text-[#120D11]'
                          : 'text-[#3C1322]/70 dark:text-[#E8BD6D]'
                      }`}
                    />
                  )}
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Search Input */}
            <div className="relative flex items-center">
              <AnimatePresence>
                {searchOpen ? (
                  <motion.form
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 220, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    onSubmit={handleSearchSubmit}
                    className="flex items-center overflow-hidden bg-white dark:bg-[#1B1419] border border-[#E8E2D7] dark:border-[#33242E] rounded-full px-3 py-1.5 shadow-soft mr-1 rtl:mr-0 rtl:ml-1"
                  >
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder={isRtl ? 'ابحث في النكهات...' : 'Search confections...'}
                      className="w-full text-xs bg-transparent text-[#1A1A1A] dark:text-[#F7F3EC] focus:outline-none placeholder-[#736B63]/60 dark:placeholder-[#9C8E83] font-light"
                    />
                    {searchValue.trim() ? (
                      <button
                        type="submit"
                        className="text-[11px] font-semibold text-[#3C1322] dark:text-[#E8BD6D] hover:underline px-1 shrink-0 cursor-pointer"
                      >
                        {isRtl ? 'بحث' : 'Go'}
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setSearchOpen(false)}
                      className="p-1 text-[#736B63] dark:text-[#9C8E83] hover:text-[#1A1A1A] dark:hover:text-white cursor-pointer ml-1 rtl:ml-0 rtl:mr-1 shrink-0"
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
                    : 'text-[#1A1A1A] dark:text-[#F7F3EC] hover:text-[#3C1322] dark:hover:text-[#E8BD6D] hover:bg-[#F4EFEA] dark:hover:bg-[#241A21]'
                }`}
                title={isRtl ? 'البحث في المتجر' : 'Search Collection'}
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            {/* Language Switcher */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="hidden sm:inline-flex px-2.5 py-1 text-xs font-mono font-medium text-[#736B63] dark:text-[#C8BEB5] hover:text-[#1A1A1A] dark:hover:text-[#F7F3EC] border border-[#E8E2D7] dark:border-[#33242E] rounded-full hover:border-[#1A1A1A] dark:hover:border-[#E8BD6D] transition-colors cursor-pointer"
              title={isRtl ? 'Switch to English' : 'التحويل إلى العربية'}
              aria-label="Toggle Language"
            >
              {language === 'en' ? 'عربي' : 'EN'}
            </button>

            {/* Theme Toggle (Dark / Light) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-full text-[#736B63] dark:text-[#E8BD6D] hover:text-[#1A1A1A] dark:hover:text-[#F7F3EC] hover:bg-[#F4EFEA] dark:hover:bg-[#241A21] border border-[#E8E2D7] dark:border-[#33242E] transition-colors cursor-pointer"
              title={
                isDark
                  ? isRtl
                    ? 'تفعيل الوضع النهاري'
                    : 'Switch to Light Mode'
                  : isRtl
                  ? 'تفعيل الوضع الليلي'
                  : 'Switch to Dark Mode'
              }
              aria-label="Toggle Dark/Light Mode"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-[#E8BD6D]" />
              ) : (
                <Moon className="w-4 h-4 text-[#3C1322]" />
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative px-3 sm:px-4 py-1.5 sm:py-2 bg-[#1A1A1A] dark:bg-[#1B1419] border border-transparent dark:border-[#E8BD6D]/40 hover:bg-[#3C1322] dark:hover:bg-[#E8BD6D] text-[#FAF7F2] dark:text-[#E8BD6D] dark:hover:text-[#120D11] rounded-full transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer shadow-soft hover:shadow-soft-md shrink-0 active:scale-[0.97]"
              title="Shopping Bag"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
              <span className="font-semibold text-xs tracking-wide">
                <span className="hidden sm:inline">{isRtl ? 'الحقيبة ' : 'Bag '}</span>
                <span>({totalCount})</span>
              </span>
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#E8BD6D] dark:bg-[#E8BD6D] border-2 border-[#FAF7F2] dark:border-[#120D11]" />
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#1A1A1A] dark:text-[#F7F3EC] hover:bg-[#F4EFEA] dark:hover:bg-[#241A21] rounded-full cursor-pointer"
              aria-label="Toggle Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="md:hidden bg-[#FAF7F2] dark:bg-[#171015] border-b border-[#E8E2D7] dark:border-[#33242E] px-4 py-4 space-y-2"
          >
            <div className="flex items-center justify-between px-3 pb-3 border-b border-[#E8E2D7] dark:border-[#33242E] mb-2">
              <span className="font-serif text-xl font-normal text-[#1A1A1A] dark:text-[#F7F3EC] lowercase">toomakt</span>
              <span className="text-[9px] font-mono tracking-widest text-[#736B63] dark:text-[#C8BEB5] uppercase">
                {isRtl ? 'معمل التوفي · القاهرة' : 'ATELIER DU TOFFEE · CAIRO'}
              </span>
            </div>
            {navLinks.map((link) => {
              const active = isLinkActive(link.target);
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.target)}
                  className={`w-full text-left rtl:text-right px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? 'bg-[#3C1322] dark:bg-[#E8BD6D] text-[#FAF7F2] dark:text-[#120D11] font-semibold'
                      : 'text-[#736B63] dark:text-[#C8BEB5] hover:bg-[#F4EFEA] dark:hover:bg-[#241A21]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
