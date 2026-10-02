import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Truck, ArrowRight, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

interface CartDrawerProps {
  onOrderSuccess?: (order: any) => void;
  onNavigateView?: (view: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigateView }) => {
  const { isRtl } = useLanguage();
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    amountToFreeShipping,
    freeShippingThreshold,
    applyPromoCode,
    promoApplied,
    discountAmount
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const success = applyPromoCode(promoInput);
    if (!success) {
      setPromoError(true);
      setTimeout(() => setPromoError(false), 2500);
    } else {
      setPromoInput('');
    }
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    if (onNavigateView) {
      onNavigateView('checkout');
    }
  };

  const handleShopTasteLab = () => {
    setIsCartOpen(false);
    if (onNavigateView) {
      onNavigateView('shop');
    }
  };

  const shippingPercent = Math.min(
    100,
    Math.round(((freeShippingThreshold - amountToFreeShipping) / freeShippingThreshold) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-[#1F1127]/60 backdrop-blur-xs transition-opacity"
      />

      <div className={`fixed inset-y-0 ${isRtl ? 'left-0' : 'right-0'} max-w-full flex pl-10`}>
        <motion.div
          initial={{ x: isRtl ? -400 : 400 }}
          animate={{ x: 0 }}
          exit={{ x: isRtl ? -400 : 400 }}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          className="w-screen max-w-md bg-[#FFFDF5] border-l-2 border-[#1F1127] shadow-neo-xl flex flex-col justify-between overflow-hidden"
        >
          {/* Header (Figma Frame 2) */}
          <div className="p-6 border-b-2 border-[#1F1127] bg-[#F5EFE6] flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Orange Square with Shopping Bag Motif */}
              <div className="w-10 h-10 rounded-xl bg-[#FF5E2B] border-2 border-[#1F1127] shadow-neo-sm flex items-center justify-center text-white">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="font-display font-black text-sm sm:text-base uppercase tracking-tight text-[#1F1127] block">
                  {isRtl ? 'حقيبتك مليئة بالإمكانيات' : 'YOUR BAG IS FULL OF POSSIBILITY'}
                </span>
                <span className="text-[10px] font-mono font-bold text-[#1F1127]/70 uppercase">
                  {items.length} {items.length === 1 ? 'ITEM' : 'ITEMS'} IN FORECAST
                </span>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="w-8 h-8 rounded-full border-2 border-[#1F1127] bg-[#FFE842] hover:bg-[#FF5E2B] hover:text-white flex items-center justify-center transition-colors cursor-pointer shadow-neo-sm"
              title="Close Cart"
            >
              <X className="w-4 h-4 text-[#1F1127]" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="px-6 py-3.5 bg-[#FFFDF5] border-b-2 border-[#1F1127]">
            <div className="flex items-center justify-between text-xs font-bold text-[#1F1127] mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#FF5E2B]" />
                {amountToFreeShipping > 0 ? (
                  <span>
                    Add <strong className="font-mono text-[#FF5E2B]">{amountToFreeShipping.toFixed(0)} EGP</strong> for FREE delivery!
                  </span>
                ) : (
                  <span className="text-[#C4E86E] font-black bg-[#1F1127] px-2 py-0.5 rounded">
                    🎉 YOU UNLOCKED FREE SHIPPING!
                  </span>
                )}
              </span>
              <span className="text-[10px] font-mono font-bold text-[#1F1127]/70">
                2,500 EGP
              </span>
            </div>

            {/* Progress Bar with Weather Colors */}
            <div className="w-full h-3 rounded-full border-2 border-[#1F1127] bg-[#F5EFE6] overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-[#FF5E2B] transition-all duration-500"
                style={{ width: `${shippingPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              /* Empty State (Figma Frame 2) */
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 rounded-full border-3 border-[#1F1127] bg-[#FFE842] shadow-neo flex items-center justify-center mb-6">
                  <ShoppingBag className="w-9 h-9 text-[#1F1127]" />
                </div>
                <h3 className="font-display text-xl font-black text-[#1F1127] uppercase mb-2">
                  {isRtl ? 'حقيبتك فارغة الآن' : 'Your bag is empty'}
                </h3>
                <p className="text-xs sm:text-sm font-bold text-[#1F1127]/75 max-w-xs mb-8">
                  {isRtl
                    ? 'لم يتم إضافة أي قطع بعد. اختر أول قضمة طرية زبدية من معمل النكهات.'
                    : 'No items have been added yet. Pick your first bright, buttery bite in the Taste Lab.'}
                </p>
                <button
                  type="button"
                  onClick={handleShopTasteLab}
                  className="btn-neo bg-[#FF5E2B] text-white px-8 py-3.5 text-xs font-black uppercase tracking-wider hover:bg-[#ff480e] shadow-neo cursor-pointer"
                >
                  {isRtl ? 'تسوق معمل النكهات' : 'SHOP THE TASTE LAB'}
                </button>
              </div>
            ) : (
              /* Item Rows */
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="p-4 rounded-xl border-2 border-[#1F1127] bg-[#F5EFE6] shadow-neo-sm flex items-center gap-4"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-lg border-2 border-[#1F1127] bg-[#FFFDF5] p-1 flex items-center justify-center shrink-0 overflow-hidden">
                    <img
                      src={item.product.image || '/images/canister.jpg'}
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display font-black text-sm uppercase text-[#1F1127] truncate">
                      {item.product.name}
                    </h4>
                    <span className="font-mono font-bold text-xs text-[#FF5E2B] block">
                      {item.product.price} EGP
                    </span>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border-2 border-[#1F1127] rounded-full bg-white shadow-neo-sm">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-[#FFE842] rounded-l-full cursor-pointer text-[#1F1127]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center font-mono font-black text-xs text-[#1F1127]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-[#FFE842] rounded-r-full cursor-pointer text-[#1F1127]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-[#1F1127]/60 hover:text-[#FF5E2B] p-1 cursor-pointer transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <span className="font-mono font-black text-sm text-[#1F1127] shrink-0">
                    {(Number(item.product.price) * item.quantity).toFixed(0)} EGP
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action (Figma Frame 2) */}
          {items.length > 0 && (
            <div className="p-6 border-t-2 border-[#1F1127] bg-[#F5EFE6] space-y-4">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                  placeholder="PROMO CODE (e.g. JOY10)"
                  className="flex-1 py-2 px-3 rounded-full border-2 border-[#1F1127] bg-white text-xs font-mono font-bold text-[#1F1127] uppercase focus:outline-none"
                />
                <button
                  type="submit"
                  className="btn-neo bg-[#FFE842] text-[#1F1127] px-4 py-2 text-xs font-black uppercase hover:bg-black hover:text-white cursor-pointer"
                >
                  APPLY
                </button>
              </form>

              {promoApplied && (
                <div className="text-[11px] font-bold text-[#2E7D32] flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Promo code applied! (-{discountAmount.toFixed(0)} EGP)</span>
                </div>
              )}

              {/* Subtotal Row */}
              <div className="flex items-center justify-between text-sm font-bold text-[#1F1127]">
                <span className="uppercase tracking-wider">Subtotal:</span>
                <span className="font-display font-black text-xl text-[#1F1127]">
                  {subtotal.toFixed(0)} EGP
                </span>
              </div>

              {/* Checkout CTA */}
              <button
                type="button"
                onClick={handleProceedCheckout}
                className="btn-neo w-full bg-[#FF5E2B] text-white py-4 text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#ff480e] shadow-neo cursor-pointer"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
