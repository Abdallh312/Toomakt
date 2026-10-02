import React, { useState, useEffect } from 'react';
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
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
  const { totalCount, setIsCartOpen } = useCart();
  const { language, isRtl, toggleLanguage } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    { id: 'shop', label: isRtl ? 'المتجر' : 'Shop', type: 'view' as const, target: 'shop' },
    { id: 'collections', label: isRtl ? 'المجموعات' : 'Collections', type: 'section' as const, target: 'the-collection' },
    { id: 'ingredients', label: isRtl ? 'مكوناتنا' : 'Our Ingredients', type: 'view' as const, target: 'ingredients' },
    { id: 'about', label: isRtl ? 'عن توماكت' : 'About', type: 'view' as const, target: 'our-story' }
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 border-b border-[#E8E2D7] ${
        isScrolled
          ? 'bg-[#FAF7F2]/95 backdrop-blur-md shadow-soft py-3'
          : 'bg-[#FAF7F2] py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo - Custom editorial serif typography */}
          <div
            onClick={() => {
              if (onNavigateView) onNavigateView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="cursor-pointer group flex items-center select-none"
          >
            <span className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#1A1A1A] lowercase group-hover:text-[#3C1322] transition-colors">
              toomakt
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link => {
              const isActive = link.type === 'view' ? currentView === link.target : false;

              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.type, link.target)}
                  className={`text-sm font-medium transition-colors hover:text-[#3C1322] cursor-pointer ${
                    isActive
                      ? 'text-[#1A1A1A] font-semibold underline underline-offset-8 decoration-1'
                      : 'text-[#736B63]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Action Hub & Utilities */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Button */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-[#1A1A1A] hover:text-[#3C1322] hover:bg-[#F4EFEA] rounded-full transition-colors cursor-pointer"
              title={isRtl ? 'البحث' : 'Search'}
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="p-2 text-[#1A1A1A] hover:text-[#C84B5B] hover:bg-[#F4EFEA] rounded-full transition-colors cursor-pointer"
              title={isRtl ? 'المفضلة' : 'Wishlist'}
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4" />
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1 text-xs font-medium text-[#736B63] hover:text-[#1A1A1A] border border-[#E8E2D7] rounded-full hover:border-[#1A1A1A] transition-colors cursor-pointer"
              title={isRtl ? 'Switch to English' : 'التحويل إلى العربية'}
              aria-label="Toggle Language"
            >
              {language === 'en' ? 'عربي' : 'EN'}
            </button>

            {/* Shopping Bag Button (Pill matching Figma Frame 1 & 2) */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="px-4 py-1.5 sm:py-2 bg-[#1A1A1A] hover:bg-[#3C1322] text-[#FAF7F2] rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-soft hover:shadow-soft-md"
              title="Shopping Bag"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#FAF7F2] shrink-0" />
              <span className="font-medium text-xs tracking-wide">
                {isRtl ? `الحقيبة (${totalCount})` : `Bag (${totalCount})`}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#1A1A1A] hover:bg-[#F4EFEA] rounded-full cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-[#E8E2D7] bg-[#FAF7F2] px-6 py-4"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.type, link.target)}
                  className="text-left rtl:text-right py-2 text-base font-medium text-[#1A1A1A] hover:text-[#3C1322] border-b border-[#E8E2D7]/60"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
