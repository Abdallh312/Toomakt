import React, { useState } from 'react';
import { X, Search, ArrowRight, Plus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FLAVOR_VAULT_PRODUCTS } from '../data/toomaktData';
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

  const suggestedTags = [
    { label: 'MANGO SUNBEAM', color: '#FFE842' },
    { label: 'BERRY AFTERGLOW', color: '#FF4D8D' },
    { label: 'CITRUS COMET', color: '#C4E86E' },
    { label: 'PEACH DAYDREAM', color: '#FFB088' },
    { label: 'GUAVA HOTLINE', color: '#FF6B6B' },
  ];

  const results = query.trim() === ''
    ? []
    : FLAVOR_VAULT_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.tagline.toLowerCase().includes(query.toLowerCase()) ||
        (p.mood && p.mood.toLowerCase().includes(query.toLowerCase())) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))) ||
        p.fruitNotes.some(n => n.toLowerCase().includes(query.toLowerCase()))
      );

  const handleQuickAdd = (p: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(p, 1);
    setJustAddedId(p.id);
    setTimeout(() => setJustAddedId(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto select-none">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-[#1F1127]/60 backdrop-blur-xs"
      />

      <div className="flex min-h-full items-start justify-center p-4 pt-16 sm:pt-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="relative w-full max-w-2xl bg-[#FFFDF5] rounded-3xl border-3 border-[#1F1127] shadow-neo-xl overflow-hidden p-6 sm:p-8"
        >
          {/* Header (Figma Frame 3) */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-[#1F1127]">
            <div>
              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#FF5E2B] block">
                TOOMAKT / TASTE LAB
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-[#1F1127] uppercase tracking-tight">
                {isRtl ? 'البحث في معمل النكهات.' : 'SEARCH THE TASTE LAB.'}
              </h2>
            </div>

            {/* Close Button in Yellow Circle */}
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-full border-2 border-[#1F1127] bg-[#FFE842] hover:bg-[#FF5E2B] hover:text-white flex items-center justify-center transition-colors cursor-pointer shadow-neo-sm"
              title="Close Search"
            >
              <X className="w-5 h-5 text-[#1F1127]" />
            </button>
          </div>

          {/* Search Input Bar */}
          <div className="relative mb-6">
            <div className="flex items-center gap-3 bg-[#F5EFE6] rounded-full border-2 border-[#1F1127] px-4 py-3.5 shadow-neo-sm">
              <Search className="w-5 h-5 text-[#1F1127] shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isRtl ? 'ابحث عن فاكهة، نكهة، أو مزاج...' : 'Search fruit or mood...'}
                className="w-full bg-transparent text-sm sm:text-base font-bold text-[#1F1127] placeholder-[#1F1127]/50 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="text-xs font-mono font-bold text-[#1F1127]/60 hover:text-[#1F1127]"
                >
                  CLEAR
                </button>
              )}
            </div>
          </div>

          {/* Suggested Filter Tags (Figma Frame 3) */}
          <div className="mb-6">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1F1127]/70 block mb-2">
              QUICK SUGGESTIONS:
            </span>
            <div className="flex flex-wrap gap-2">
              {suggestedTags.map((tag) => (
                <button
                  key={tag.label}
                  type="button"
                  onClick={() => setQuery(tag.label)}
                  className="badge-neo text-[10px] py-1 px-3 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-neo-sm"
                  style={{ backgroundColor: tag.color }}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Results / Empty State */}
          <div className="mt-4">
            {query.trim() === '' ? (
              <div className="py-10 text-center border-2 border-dashed border-[#1F1127]/20 rounded-2xl bg-[#F5EFE6]/50">
                <span className="font-display font-black text-xs sm:text-sm uppercase text-[#1F1127] block mb-1">
                  NO SEARCH YET
                </span>
                <p className="text-xs font-bold text-[#1F1127]/70">
                  Start typing to find your next bright, buttery bite.
                </p>
              </div>
            ) : results.length === 0 ? (
              <div className="py-10 text-center border-2 border-dashed border-[#1F1127]/20 rounded-2xl bg-[#F5EFE6]/50">
                <span className="font-display font-black text-sm uppercase text-[#1F1127] block mb-1">
                  NO WEATHER FOUND FOR "{query}"
                </span>
                <p className="text-xs font-bold text-[#1F1127]/70">
                  Try searching for "Mango", "Berry", "Citrus", or "Box".
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {results.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    className="p-3.5 rounded-2xl border-2 border-[#1F1127] shadow-neo-sm hover:shadow-neo transition-all flex items-center justify-between gap-4 cursor-pointer"
                    style={{ backgroundColor: product.cardBgColor || '#FFE842' }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl border-2 border-[#1F1127] bg-[#FFFDF5] p-1 flex items-center justify-center shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <h4 className="font-display font-black text-sm uppercase text-[#1F1127]">
                          {product.name}
                        </h4>
                        <p className="text-[11px] font-bold text-[#1F1127]/80 line-clamp-1">
                          {product.tagline}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-display font-black text-sm text-[#1F1127]">
                        {product.price} EGP
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(product, e)}
                        className="w-8 h-8 rounded-full border-2 border-[#1F1127] bg-[#1F1127] text-white hover:bg-[#FF5E2B] flex items-center justify-center transition-colors cursor-pointer"
                      >
                        {justAddedId === product.id ? <Check className="w-4 h-4 text-[#C4E86E]" /> : <Plus className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
