import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Check, ShieldCheck, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { navigateTo } from '../utils/navigation';

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
          className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        />

        {/* Drawer Window */}
        <motion.div
          initial={{ x: isRtl ? -480 : 480 }}
          animate={{ x: 0 }}
          exit={{ x: isRtl ? -480 : 480 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="relative w-full max-w-lg bg-[#FAF7F2] text-[#1A1A1A] h-full shadow-2xl flex flex-col z-10 border-l border-[#E8E2D7] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#E8E2D7] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-2xl font-normal text-[#1A1A1A]">
                {isRtl ? 'حقيبة التسوق' : 'Your bag'}
              </h2>
              <span className="text-xs text-[#736B63] font-mono">
                ({items.reduce((s, i) => s + i.quantity, 0)} {items.reduce((s, i) => s + i.quantity, 0) === 1 ? 'item' : 'items'})
              </span>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-[#736B63] hover:text-[#1A1A1A] hover:bg-[#F4EFEA] rounded-full transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="bg-[#F4EFEA] px-6 py-3 border-b border-[#E8E2D7]">
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
              <span>
                {amountToFreeShipping <= 0 ? (
                  <span className="text-[#3C1322] font-semibold">
                    {isRtl ? '🎉 مبروك! حصلت على شحن مجاني' : '🎉 You unlocked free shipping!'}
                  </span>
                ) : (
                  <span>
                    {isRtl
                      ? `أضف EGP ${amountToFreeShipping.toFixed(0)} للحصول على شحن مجاني`
                      : `Add EGP ${amountToFreeShipping.toFixed(0)} for free shipping`}
                  </span>
                )}
              </span>
              <span className="text-[#736B63] font-mono">
                {shippingPercent}%
              </span>
            </div>
            <div className="w-full bg-[#E8E2D7] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#3C1322] h-full transition-all duration-500 rounded-full"
                style={{ width: `${shippingPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <ShoppingBag className="w-12 h-12 text-[#9B938A] mb-4 stroke-1" />
                <h3 className="font-serif text-xl font-normal text-[#1A1A1A] mb-2">
                  {isRtl ? 'حقيبتك فارغة' : 'Your bag is empty'}
                </h3>
                <p className="text-sm text-[#736B63] max-w-xs mb-6 font-light">
                  {isRtl
                    ? 'استكشف تشكيلتنا الحرفية من الفواكه والزبدة الأوروبية.'
                    : 'Explore our collection of slowly crafted fruit toffee in small batches.'}
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    if (onNavigateView) onNavigateView('shop');
                  }}
                  className="btn-primary"
                >
                  {isRtl ? 'تصفح المجموعة' : 'Explore collection'}
                </button>
              </div>
            ) : (
              items.map(item => (
                <div
                  key={item.product.id}
                  className="bg-white border border-[#E8E2D7] rounded-xl p-4 flex gap-4 items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.image || '/images/products/mango_sunbeam.jpg'}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg border border-[#E8E2D7] bg-[#FAF7F2] shrink-0"
                    />
                    <div>
                      <h4 className="font-serif text-base font-normal text-[#1A1A1A] line-clamp-1">
                        {item.product.name}
                      </h4>
                      <span className="text-xs text-[#736B63] block mt-0.5">
                        {item.product.weight || '250g Pouch'} · EGP {item.product.price}
                      </span>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="w-6 h-6 rounded-md border border-[#E8E2D7] hover:border-[#1A1A1A] flex items-center justify-center text-xs transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-xs font-medium w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="w-6 h-6 rounded-md border border-[#E8E2D7] hover:border-[#1A1A1A] flex items-center justify-center text-xs transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-right rtl:text-left flex flex-col items-end justify-between self-stretch">
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-[#9B938A] hover:text-[#C84B5B] transition-colors p-1"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <span className="font-medium text-sm text-[#1A1A1A]">
                      EGP {(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}

            {/* Order Note */}
            {items.length > 0 && (
              <div className="pt-2">
                <label className="block text-xs font-medium text-[#736B63] uppercase tracking-wider mb-2">
                  {isRtl ? 'ملاحظة خاصة بالطلب' : 'Add a note to your order'}
                </label>
                <textarea
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder={isRtl ? 'تعليمات خاصة بالتغليف أو التوصيل...' : 'Special gift instructions or delivery requests...'}
                  rows={2}
                  className="w-full text-xs p-3 rounded-xl border border-[#E8E2D7] bg-white focus:outline-none focus:border-[#1A1A1A] transition-colors resize-none placeholder:text-[#9B938A]"
                />
              </div>
            )}
          </div>

          {/* Footer & Checkout Summary */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#E8E2D7] bg-[#F4EFEA]/60 space-y-4">
              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder={isRtl ? 'كود الخصم (مثل TOOMAKT10)' : 'Promo code (e.g. TOOMAKT10)'}
                  className="flex-1 text-xs px-3.5 py-2.5 bg-white border border-[#E8E2D7] rounded-full focus:outline-none focus:border-[#1A1A1A] uppercase tracking-wider"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#3C1322] text-[#FAF7F2] rounded-full text-xs font-medium transition-colors"
                >
                  {isRtl ? 'تطبيق' : 'Apply'}
                </button>
              </form>
              {promoError && (
                <p className="text-[11px] text-[#C84B5B]">
                  {isRtl ? 'كود غير صحيح' : 'Invalid promo code. Try TOOMAKT10'}
                </p>
              )}
              {promoApplied && (
                <p className="text-[11px] text-[#88C057] flex items-center gap-1 font-medium">
                  <Check className="w-3.5 h-3.5" />
                  {isRtl ? 'تم تطبيق الخصم بنجاح!' : 'Promo applied successfully!'}
                </p>
              )}

              {/* Subtotal, Shipping, Total */}
              <div className="space-y-1.5 text-xs text-[#736B63] pt-2">
                <div className="flex justify-between">
                  <span>{isRtl ? 'المجموع الفرعي' : 'Subtotal'}</span>
                  <span className="font-mono text-[#1A1A1A]">EGP {subtotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#88C057]">
                    <span>{isRtl ? 'الخصم' : 'Discount'}</span>
                    <span className="font-mono">-EGP {discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{isRtl ? 'الشحن' : 'Shipping'}</span>
                  <span className="font-mono text-[#1A1A1A]">
                    {shippingCost === 0 ? (isRtl ? 'مجاني' : 'FREE') : `EGP ${shippingCost}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-[#1A1A1A] pt-2 border-t border-[#E8E2D7]">
                  <span>{isRtl ? 'الإجمالي التقديري' : 'Estimated Total'}</span>
                  <span className="font-mono">EGP {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleProceedCheckout}
                className="w-full btn-primary py-3 text-sm font-medium tracking-wide flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isRtl ? 'المتابعة إلى إتمام الطلب' : 'Continue to checkout'}</span>
              </button>

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-4 text-[10px] text-[#736B63] pt-1">
                <div className="flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5 text-[#88C057]" />
                  <span>{isRtl ? 'تغليف قابل للتدوير' : 'Recyclable packaging'}</span>
                </div>
                <span>·</span>
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#3C1322]" />
                  <span>{isRtl ? 'دفع آمن بالاستلام أو إنستاباي' : 'Cash or InstaPay'}</span>
                </div>
              </div>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
