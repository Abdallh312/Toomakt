import React, { useState } from 'react';
import { X, Search, Check, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRODUCTS, CATEGORIES } from '../data/toomaktData';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (p: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectProduct }) => {
  const { addToCart } = useCart();
  const { isRtl } = useLanguage();
  const [query, setQuery] = useState('');
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const popularPills = [
    { label: 'mango', arabic: 'مانجو' },
    { label: 'berry', arabic: 'توت' },
    { label: 'citrus', arabic: 'حمضيات' },
    { label: 'gift boxes', arabic: 'صناديق هدايا' },
  ];

  const results = query.trim() === ''
    ? PRODUCTS.slice(0, 3) // Show suggested items when empty
    : PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.tagline.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        (p.category && p.category.toLowerCase().includes(query.toLowerCase())) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(query.toLowerCase())))
      );

  const handleQuickAdd = (p: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(p, 1);
    setJustAddedId(p.id);
    setTimeout(() => setJustAddedId(null), 1500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        />

        <div className="flex min-h-full items-start justify-center p-4 pt-16 sm:pt-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            className="w-full max-w-2xl bg-[#FAF7F2] rounded-2xl border border-[#E8E2D7] shadow-2xl overflow-hidden"
          >
            {/* Search Input Bar */}
            <div className="p-4 sm:p-6 border-b border-[#E8E2D7] flex items-center gap-3 bg-white">
              <Search className="w-5 h-5 text-[#736B63] shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isRtl ? 'ابحث في مجموعة توماكت...' : 'Search the collection...'}
                className="w-full bg-transparent text-base sm:text-lg text-[#1A1A1A] placeholder:text-[#9B938A] focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 text-[#736B63] hover:text-[#1A1A1A] rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 text-[#736B63] hover:text-[#1A1A1A] rounded-full transition-colors ml-1"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Popular Pill Shortcuts */}
            <div className="px-6 py-3.5 bg-[#F4EFEA] border-b border-[#E8E2D7] flex items-center gap-2 overflow-x-auto text-xs">
              <span className="text-[#736B63] uppercase tracking-wider font-semibold text-[10px] shrink-0">
                {isRtl ? 'الأكثر بحثاً:' : 'POPULAR:'}
              </span>
              {popularPills.map(p => (
                <button
                  key={p.label}
                  onClick={() => setQuery(p.label)}
                  className="px-3 py-1 bg-white hover:bg-[#1A1A1A] hover:text-[#FAF7F2] rounded-full border border-[#E8E2D7] text-[#1A1A1A] transition-colors shrink-0"
                >
                  {isRtl ? p.arabic : p.label}
                </button>
              ))}
            </div>

            {/* Results or Suggestions List */}
            <div className="p-6 max-h-[440px] overflow-y-auto space-y-3">
              <div className="text-[11px] font-semibold text-[#736B63] uppercase tracking-wider mb-2">
                {query.trim() === ''
                  ? (isRtl ? 'مقترح لك' : 'SUGGESTED FOR YOU')
                  : (isRtl ? `النتائج (${results.length})` : `RESULTS (${results.length})`)}
              </div>

              {results.length === 0 ? (
                <div className="py-12 text-center text-[#736B63]">
                  <p className="font-serif text-lg mb-1">{isRtl ? 'لم يتم العثور على نتائج' : 'No flavors found'}</p>
                  <p className="text-xs font-light">{isRtl ? 'جرب البحث عن المانجو أو التوت أو الهدايا' : 'Try searching for mango, berry, or gift boxes'}</p>
                </div>
              ) : (
                results.map(product => (
                  <div
                    key={product.id}
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    className="p-3 bg-white border border-[#E8E2D7] rounded-xl flex items-center justify-between hover:border-[#1A1A1A] hover:shadow-soft transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg border border-[#E8E2D7] bg-[#FAF7F2] shrink-0 group-hover:scale-105 transition-transform"
                      />
                      <div>
                        <h4 className="font-serif text-base font-normal text-[#1A1A1A] group-hover:text-[#3C1322] transition-colors">
                          {product.name}
                        </h4>
                        <p className="text-xs text-[#736B63] font-light line-clamp-1">
                          {product.tagline}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-medium text-[#1A1A1A]">
                        EGP {product.price.toLocaleString()}
                      </span>
                      <button
                        onClick={(e) => handleQuickAdd(product, e)}
                        className={`p-2 rounded-full border transition-all ${
                          justAddedId === product.id
                            ? 'bg-[#3C1322] text-[#FAF7F2] border-[#3C1322]'
                            : 'border-[#E8E2D7] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#FAF7F2]'
                        }`}
                        title="Quick Add"
                      >
                        {justAddedId === product.id ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <ShoppingBag className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Escape hint */}
            <div className="px-6 py-2.5 bg-[#F4EFEA] border-t border-[#E8E2D7] text-[11px] text-[#736B63] flex justify-between items-center">
              <span>{isRtl ? 'اضغط ESC للإغلاق' : 'Press ESC to close'}</span>
              <span>{isRtl ? 'توماكت · حلويات حرفية' : 'toomakt · Artisanal Confectionery'}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
