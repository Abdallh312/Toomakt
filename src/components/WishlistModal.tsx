import React from 'react';
import { X, Heart, Plus, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { FLAVOR_VAULT_PRODUCTS } from '../data/toomaktData';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({ isOpen, onClose }) => {
  const { addToCart } = useCart();
  const { isRtl } = useLanguage();
  const savedItem = FLAVOR_VAULT_PRODUCTS[1]; // Berry Afterglow as sample saved item

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto select-none">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-[#1F1127]/60 backdrop-blur-xs transition-opacity"
      />

      <div className="flex min-h-full items-start justify-center p-4 pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-[#FFFDF5] rounded-3xl border-3 border-[#1F1127] shadow-neo-xl overflow-hidden p-6 sm:p-7"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b-2 border-[#1F1127]">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#FF4D8D] fill-[#FF4D8D]" />
              <h3 className="font-display font-black text-xl text-[#1F1127] uppercase">
                {isRtl ? 'قائمتك المفضلة' : 'SAVED WEATHER BITES'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full border-2 border-[#1F1127] bg-[#FFE842] text-[#1F1127] hover:bg-[#FF5E2B] hover:text-white flex items-center justify-center transition-colors cursor-pointer shadow-neo-sm"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Saved Items List */}
          <div className="mt-5 space-y-3">
            <div className="p-4 rounded-2xl bg-[#FF4D8D]/15 border-2 border-[#1F1127] shadow-neo-sm flex items-center justify-between gap-4">
              <div className="w-14 h-14 rounded-xl border-2 border-[#1F1127] bg-[#FFFDF5] p-1 flex items-center justify-center shrink-0">
                <img
                  src={savedItem.image}
                  alt={savedItem.name}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex-1">
                <span className="badge-neo bg-[#FF4D8D] text-white text-[9px] px-2 py-0.2 mb-1">
                  SAVED FORECAST
                </span>
                <h4 className="font-display font-black text-base text-[#1F1127] uppercase">
                  {savedItem.name}
                </h4>
                <span className="font-mono font-bold text-xs text-[#FF5E2B]">
                  {savedItem.price} EGP
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  addToCart(savedItem, 1);
                  onClose();
                }}
                className="btn-neo bg-[#1F1127] hover:bg-[#FF5E2B] text-white p-3 rounded-full transition-colors cursor-pointer shadow-neo-sm flex items-center justify-center"
                title="Add to Bag"
              >
                <ShoppingBag className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
