import React, { useState, useEffect } from 'react';
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  Flame,
  Globe,
  Building2,
  Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenWishlist: () => void;
  onNavigateSection: (id: string) => void;
  onNavigateView?: (view: string) => void;
  currentView?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onOpenWishlist,
  onNavigateSection,
  onNavigateView,
  currentView = 'home'
}) => {
  const { totalCount, subtotal, setIsCartOpen } = useCart();
  const { language, setLanguage, isRtl, t, toggleLanguage } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (type: 'section' | 'view', target: string) => {
    if (type === 'view' && onNavigateView) {
      onNavigateView(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (currentView !== 'home' && onNavigateView) {
        onNavigateView('home');
        setTimeout(() => onNavigateSection(target), 120);
      } else {
        onNavigateSection(target);
      }
    }
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { id: 'shop', label: isRtl ? 'معمل النكهات' : 'Taste Lab', type: 'view' as const, target: 'shop', badge: isRtl ? 'جديد' : 'NEW', badgeColor: 'bg-[#FFE842] text-[#1F1127]' },
    { id: 'build-box', label: isRtl ? 'صمم بوكسك' : 'Build a Box', type: 'section' as const, target: 'build-a-box', badge: isRtl ? 'تفاعلي' : 'CUSTOM', badgeColor: 'bg-[#FF5E2B] text-white' },
    { id: 'our-story', label: isRtl ? 'قصتنا وحرفتنا' : 'Our Story', type: 'view' as const, target: 'our-story' },
    { id: 'wholesale', label: isRtl ? 'الجملة والشركات' : 'Wholesale', type: 'view' as const, target: 'wholesale' }
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 border-b-2 border-[#1F1127] ${
        isScrolled
          ? 'bg-[#F5EFE6]/95 backdrop-blur-md shadow-neo-sm py-2.5 sm:py-3'
          : 'bg-[#F5EFE6] py-3 sm:py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo */}
          <motion.div
            onClick={() => {
              if (onNavigateView) onNavigateView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer group flex items-center gap-2 select-none"
          >
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-2xl sm:text-3xl tracking-tight text-[#1F1127] lowercase">
                toomakt
              </span>
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#FF5E2B] border border-[#1F1127]" />
            </div>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-[#FFE842] border border-[#1F1127] text-[10px] font-bold tracking-wider text-[#1F1127] uppercase">
              Taste Lab
            </span>
          </motion.div>

          {/* Desktop Navigation Links */}
          <nav
            onMouseLeave={() => setHoveredNav(null)}
            className="hidden lg:flex items-center gap-2 bg-[#FFFDF5] px-3 py-1.5 rounded-full border-2 border-[#1F1127] shadow-neo-sm"
          >
            {navLinks.map(link => {
              const isActive = link.type === 'view' ? currentView === link.target : false;
              const isHovered = hoveredNav === link.id;

              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.type, link.target)}
                  onMouseEnter={() => setHoveredNav(link.id)}
                  className={`relative px-3.5 py-1 rounded-full text-xs font-bold transition-all uppercase tracking-wider flex items-center gap-1.5 cursor-pointer z-10 ${
                    isActive
                      ? 'bg-[#1F1127] text-[#FFFDF5]'
                      : 'text-[#1F1127] hover:bg-[#FFE842]/40'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider border border-[#1F1127] ${link.badgeColor}`}
                    >
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Hub & Utilities */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenSearch}
              className="p-2 text-[#1F1127] bg-[#FFFDF5] hover:bg-[#FFE842] rounded-full border-2 border-[#1F1127] shadow-neo-sm transition-colors cursor-pointer"
              title={isRtl ? 'البحث في معمل النكهات' : 'Search Taste Lab'}
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </motion.button>

            {/* Wishlist Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenWishlist}
              className="p-2 text-[#1F1127] bg-[#FFFDF5] hover:bg-[#FF4D8D]/30 rounded-full border-2 border-[#1F1127] shadow-neo-sm transition-colors cursor-pointer relative"
              title={isRtl ? 'المفضلة' : 'Wishlist'}
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4" />
            </motion.button>

            {/* Clean Language Switcher */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleLanguage}
              className="px-2.5 py-1 text-xs font-mono font-bold text-[#1F1127] bg-[#FFFDF5] hover:bg-[#FFE842] rounded-full border-2 border-[#1F1127] shadow-neo-sm transition-colors cursor-pointer"
              title={isRtl ? 'Switch to English' : 'التحويل إلى العربية'}
              aria-label="Toggle Language"
            >
              {language === 'en' ? 'عربي' : 'EN'}
            </motion.button>

            {/* Tasting Bag CTA (Solid Orange Pill with Counter) */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsCartOpen(true)}
              className="px-3.5 sm:px-4 py-1.5 sm:py-2 bg-[#FF5E2B] text-white rounded-full border-2 border-[#1F1127] shadow-neo hover:shadow-neo-lg transition-all flex items-center gap-2 cursor-pointer"
              title="Shopping Bag"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4 text-white shrink-0" />
              <span className="font-extrabold text-xs uppercase tracking-wider hidden sm:inline">
                {isRtl ? 'الحقيبة' : 'Bag'}
              </span>
              <span className="w-5 h-5 rounded-full bg-[#1F1127] text-[#FFE842] text-[11px] font-black flex items-center justify-center shrink-0">
                {totalCount}
              </span>
            </motion.button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#1F1127] bg-[#FFFDF5] rounded-full border-2 border-[#1F1127] shadow-neo-sm cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>


      {/* Animated Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="lg:hidden bg-[#FFFDF5] border-b-2 border-[#1F1127] shadow-neo overflow-hidden"
          >
            <div className="px-4 py-5 space-y-4">
              {/* Mobile Navigation Links */}
              <div className="flex flex-col space-y-2">
                {navLinks.map((link, idx) => (
                  <motion.button
                    key={link.id}
                    initial={{ opacity: 0, x: isRtl ? 15 : -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    onClick={() => handleLinkClick(link.type, link.target)}
                    className="flex items-center justify-between py-2.5 px-4 rounded-full border-2 border-[#1F1127] bg-[#F5EFE6] hover:bg-[#FFE842] font-black text-xs uppercase tracking-wider text-[#1F1127] transition-all cursor-pointer shadow-neo-sm"
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border border-[#1F1127] ${link.badgeColor}`}>
                        {link.badge}
                      </span>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Mobile Language Switcher Highlight */}
              <div className="pt-3 border-t-2 border-[#1F1127] flex items-center justify-between">
                <span className="text-xs font-bold text-[#1F1127]">
                  {isRtl ? 'اللغة / Language' : 'Language / اللغة'}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1 rounded-full text-xs font-black cursor-pointer border-2 border-[#1F1127] transition ${
                      language === 'en'
                        ? 'bg-[#FFE842] text-[#1F1127] shadow-neo-sm'
                        : 'bg-[#FFFDF5] text-[#1F1127]'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLanguage('ar')}
                    className={`px-3 py-1 rounded-full text-xs font-black cursor-pointer font-arabic border-2 border-[#1F1127] transition ${
                      language === 'ar'
                        ? 'bg-[#FFE842] text-[#1F1127] shadow-neo-sm'
                        : 'bg-[#FFFDF5] text-[#1F1127]'
                    }`}
                  >
                    العربية
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
