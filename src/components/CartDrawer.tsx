import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Check, ShieldCheck, Leaf, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { navigateTo } from '../utils/navigation';

interface CartDrawerProps {
  onOrderSuccess?: (order: any) => void;
  onNavigateView?: (view: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigateView }) => {
  const { isRtl, formatPrice } = useLanguage();
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
    discountAmount,
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState(false);
  const [orderNote, setOrderNote] = useState('');

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
    if (orderNote.trim()) {
      localStorage.setItem('toomakt_order_note', orderNote.trim());
    }
    if (onNavigateView) {
      onNavigateView('checkout');
    } else {
      navigateTo('checkout');
    }
  };

  const shippingCost = amountToFreeShipping <= 0 ? 0 : 65;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingCost);
  const shippingPercent = Math.min(
    100,
    Math.round(((freeShippingThreshold - amountToFreeShipping) / freeShippingThreshold) * 100)
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
          className="fixed inset-0 bg-[#22120C]/60 backdrop-blur-sm transition-opacity"
        />

        {/* Drawer Window */}
        <motion.div
          initial={{ x: isRtl ? -480 : 480 }}
          animate={{ x: 0 }}
          exit={{ x: isRtl ? -480 : 480 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="relative w-full max-w-lg bg-white text-[#22120C] h-full shadow-[0_0_60px_rgba(34,18,12,0.18)] flex flex-col z-10 border-l rtl:border-l-0 rtl:border-r border-[#22120C]/10 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#22120C]/10 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <img
                src="/images/logos/toomakt_logo_main.png"
                alt="Toomakt"
                className="h-7 w-auto object-contain"
              />
              <div className="h-4 w-px bg-[#22120C]/15" />
              <h2 className="font-serif text-2xl font-normal text-[#22120C]">
                {isRtl ? 'حقيبة التسوق' : 'Your Bag'}
              </h2>
              <span className="text-xs text-[#22120C]/60 font-mono">
                ({items.reduce((s, i) => s + i.quantity, 0)})
              </span>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-[#22120C]/60 hover:text-[#22120C] hover:bg-[#22120C]/8 rounded-full transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="bg-[#FDF2F5] px-6 py-3.5 border-b border-[#E890A8]/20">
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
              <span>
                {amountToFreeShipping <= 0 ? (
                  <span className="text-[#E890A8] font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#E890A8]" />
                    <span>{isRtl ? 'مبروك! حصلت على شحن مجاني' : 'You unlocked complimentary delivery!'}</span>
                  </span>
                ) : (
                  <span className="text-[#22120C]/70 text-[11px] font-mono">
                    {isRtl
                      ? `أضف ${amountToFreeShipping.toFixed(0)} ج.م للشحن المجاني`
                      : `Add EGP ${amountToFreeShipping.toFixed(0)} for free shipping`}
                  </span>
                )}
              </span>
              <span className="text-[#E890A8] font-mono text-xs font-semibold">
                {shippingPercent}%
              </span>
            </div>
            <div className="w-full bg-[#E890A8]/20 h-2 rounded-full overflow-hidden border border-[#E890A8]/30">
              <div
                className="bg-gradient-to-r from-[#E890A8] to-[#6AACE9] h-full transition-all duration-500 rounded-full"
                style={{ width: `${shippingPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <ShoppingBag className="w-12 h-12 text-[#22120C]/30 mb-4 stroke-1" />
                <h3 className="font-serif text-2xl font-normal text-[#22120C] mb-2">
                  {isRtl ? 'حقيبتك فارغة' : 'Your bag is empty'}
                </h3>
                <p className="text-xs text-[#22120C]/65 max-w-xs mb-6 font-light leading-relaxed">
                  {isRtl
                    ? 'استكشف تشكيلتنا الحرفية من الفواكه والزبدة المطهوة ببطء في مراجل النحاس.'
                    : 'Explore our small-batch slow-simmered fruit toffee and butter eclairs.'}
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    if (onNavigateView) onNavigateView('shop');
                  }}
                  className="px-8 py-3 rounded-full bg-[#E890A8] hover:bg-[#6AACE9] text-white font-medium text-xs font-mono tracking-wider uppercase transition-all shadow-[0_4px_16px_rgba(232,144,168,0.35)] hover:shadow-[0_4px_16px_rgba(106,172,233,0.45)] cursor-pointer"
                >
                  {isRtl ? 'تصفح التشكيلة' : 'Explore Collection'}
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selected_flavor || ''}`}
                  className="bg-white border border-[#E890A8]/20 rounded-2xl p-4 flex gap-4 items-center justify-between transition-colors hover:border-[#6AACE9]/50 shadow-xs"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-16 h-16 rounded-xl bg-[#FDF2F5] border border-[#E890A8]/15 p-2 flex items-center justify-center shrink-0">
                      <img
                        src={item.product.image || '/images/products/cappuccino_candies_thumb_isolated.png'}
                        alt={isRtl ? (item.product.name_ar || item.product.name) : (item.product.name_en || item.product.name)}
                        className="w-full h-full object-contain filter drop-shadow-sm"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-serif text-base font-normal text-[#22120C] truncate">
                        {isRtl ? (item.product.name_ar || item.product.name) : (item.product.name_en || item.product.name)}
                      </h4>
                      {item.selected_flavor && (
                        <span className="text-[10px] font-mono text-[#E890A8] bg-[#E890A8]/10 border border-[#E890A8]/25 px-2 py-0.5 rounded-full inline-block mt-0.5 font-semibold">
                          {item.selected_flavor}
                        </span>
                      )}
                      <span className="text-xs text-[#22120C]/65 block mt-0.5 font-mono">
                        {(isRtl ? item.product.pack_quantity_ar : item.product.pack_quantity_en) || item.product.pack_quantity || item.product.weight || '250g'} · {formatPrice(item.product.price)}
                      </span>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1, item.selected_flavor)}
                          className="w-6 h-6 rounded-md border border-[#22120C]/15 text-[#22120C] hover:border-[#E890A8] hover:text-[#E890A8] hover:bg-[#E890A8]/5 flex items-center justify-center text-xs transition-colors cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono text-xs font-semibold w-4 text-center text-[#22120C]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1, item.selected_flavor)}
                          className="w-6 h-6 rounded-md border border-[#22120C]/15 text-[#22120C] hover:border-[#E890A8] hover:text-[#E890A8] hover:bg-[#E890A8]/5 flex items-center justify-center text-xs transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-right rtl:text-left flex flex-col items-end justify-between self-stretch shrink-0">
                    <button
                      onClick={() => removeFromCart(item.product.id, item.selected_flavor)}
                      className="text-[#22120C]/40 hover:text-[#E890A8] transition-colors p-1 cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <span className="font-serif font-semibold text-base text-[#E890A8]">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))
            )}

            {/* Order Note */}
            {items.length > 0 && (
              <div className="pt-2">
                <label className="block text-[11px] font-mono text-[#22120C]/70 uppercase tracking-wider mb-2 font-medium">
                  {isRtl ? 'ملاحظة خاصة بالطلب أو بطاقة إهداء' : 'Order note or gift message'}
                </label>
                <textarea
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder={isRtl ? 'تعليمات خاصة بالتغليف أو التوصيل...' : 'Special gift instructions or delivery requests...'}
                  rows={2}
                  className="w-full text-xs p-3.5 rounded-xl border border-[#22120C]/15 bg-white text-[#22120C] focus:outline-none focus:border-[#E890A8] transition-colors resize-none placeholder:text-[#22120C]/40 font-mono"
                />
              </div>
            )}
          </div>

          {/* Footer & Checkout Summary */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#E890A8]/15 bg-[#FDF2F5] space-y-4">
              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder={isRtl ? 'كود الخصم (مثل TOOMAKT10)' : 'Promo code (e.g. TOOMAKT10)'}
                  className="flex-1 text-xs px-3.5 py-2.5 bg-white border border-[#22120C]/15 text-[#22120C] rounded-full focus:outline-none focus:border-[#E890A8] uppercase tracking-wider font-mono placeholder:text-[#22120C]/40"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#6AACE9] hover:bg-[#E890A8] text-white rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                >
                  {isRtl ? 'تطبيق' : 'Apply'}
                </button>
              </form>
              {promoError && (
                <p className="text-[11px] font-mono text-[#E890A8]">
                  {isRtl ? 'كود غير صحيح' : 'Invalid promo code. Try TOOMAKT10'}
                </p>
              )}
              {promoApplied && (
                <p className="text-[11px] font-mono text-[#6AACE9] flex items-center gap-1 font-medium">
                  <Check className="w-3.5 h-3.5" />
                  {isRtl ? 'تم تطبيق الخصم بنجاح!' : 'Promo applied successfully!'}
                </p>
              )}

              {/* Subtotal, Shipping, Total */}
              <div className="space-y-1.5 text-xs text-[#22120C]/75 pt-1">
                <div className="flex justify-between">
                  <span>{isRtl ? 'المجموع الفرعي' : 'Subtotal'}</span>
                  <span className="font-mono text-[#22120C] font-semibold">EGP {subtotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#E890A8]">
                    <span>{isRtl ? 'الخصم' : 'Discount'}</span>
                    <span className="font-mono font-semibold">-EGP {discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{isRtl ? 'الشحن' : 'Shipping'}</span>
                  <span className="font-mono text-[#22120C]">
                    {shippingCost === 0 ? (isRtl ? 'مجاني' : 'COMPLIMENTARY') : `EGP ${shippingCost}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-serif text-[#22120C] pt-2 border-t border-[#E890A8]/20 font-bold">
                  <span>{isRtl ? 'الإجمالي التقديري' : 'Estimated Total'}</span>
                  <span className="font-mono text-xl text-[#E890A8]">EGP {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleProceedCheckout}
                className="w-full py-3.5 rounded-full bg-[#E890A8] hover:bg-[#6AACE9] text-white text-xs font-mono font-bold tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer shadow-[0_6px_20px_rgba(232,144,168,0.35)] hover:shadow-[0_6px_20px_rgba(106,172,233,0.45)] transition-all"
              >
                <span>{isRtl ? 'المتابعة إلى إتمام الطلب' : 'Continue to Checkout'}</span>
              </button>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-[#22120C]/60 pt-1">
                <div className="flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5 text-[#E890A8]" />
                  <span>{isRtl ? 'فواكه وزبدة طبيعية' : '100% Pure Fruit & Butter'}</span>
                </div>
                <span>·</span>
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#6AACE9]" />
                  <span>{isRtl ? 'دفع بالاستلام أو إنستاباي' : 'Cash or InstaPay'}</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CartDrawer;
