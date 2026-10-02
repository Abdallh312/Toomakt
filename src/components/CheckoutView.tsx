import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Package,
  Clock,
  Sparkles,
  ShoppingBag,
  CreditCard,
  Banknote
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { analytics } from '../services/analytics';
import { WhatsAppService } from '../services/whatsapp';
import { ShippingRate } from '../types';

interface CheckoutViewProps {
  onOrderSuccess: (order: any) => void;
  onBackToShop: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({ onOrderSuccess, onBackToShop }) => {
  const { items, subtotal, promoApplied, promoCode, discountAmount, clearCart } = useCart();
  const { t, isRtl, formatPrice } = useLanguage();

  // Shipping rates from API
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [loadingRates, setLoadingRates] = useState(true);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [governorate, setGovernorate] = useState('Cairo');
  const [city, setCity] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [buildingNumber, setBuildingNumber] = useState('');
  const [apartmentFloor, setApartmentFloor] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'instapay' | 'cod'>('instapay');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  // Fetch live Egyptian shipping rates
  useEffect(() => {
    let isMounted = true;
    const loadRates = async () => {
      setLoadingRates(true);
      try {
        const res = await api.getShippingRates();
        if (isMounted && res && res.length > 0) {
          setShippingRates(res);
          // Default to first active or Cairo
          const cairoRate = res.find(r => r.governorate.toLowerCase() === 'cairo');
          if (cairoRate) {
            setGovernorate(cairoRate.governorate);
          } else {
            setGovernorate(res[0].governorate);
          }
        }
      } catch (err) {
        console.error('Failed to load shipping rates:', err);
      } finally {
        if (isMounted) setLoadingRates(false);
      }
    };
    loadRates();
    return () => {
      isMounted = false;
    };
  }, []);

  // Selected shipping rate
  const selectedRate = shippingRates.find(
    r => r.governorate.toLowerCase() === governorate.toLowerCase()
  );
  const shippingFee = selectedRate ? Number(selectedRate.price) : 50.0;
  const estimatedDelivery = selectedRate?.estimated_delivery || '1–2 Days';

  const orderTotal = Math.max(0, subtotal + shippingFee);

  // Validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!fullName.trim()) errors.fullName = 'Full name is required.';
    if (!mobileNumber.trim()) {
      errors.mobileNumber = 'Mobile number is required.';
    } else if (!/^(010|011|012|015|\+20)\d{7,10}$/.test(mobileNumber.replace(/\s+/g, ''))) {
      errors.mobileNumber = 'Please enter a valid Egyptian mobile number (e.g. 01012345678).';
    }
    if (!email.trim()) {
      errors.email = 'Email address is required for order confirmation.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!governorate) errors.governorate = 'Please select your Egyptian governorate.';
    if (!streetAddress.trim()) errors.streetAddress = 'Detailed street address is required.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (items.length === 0) {
      setApiError('Your cart is empty. Please add confections to order.');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customer_name: fullName.trim(),
        customer_phone: mobileNumber.trim(),
        customer_email: email.trim(),
        governorate: governorate,
        shipping_city: city.trim() || governorate,
        shipping_address: streetAddress.trim(),
        building_number: buildingNumber.trim(),
        apartment_floor: apartmentFloor.trim(),
        delivery_notes: deliveryNotes.trim(),
        payment_method: paymentMethod,
        promo_code: promoApplied ? (promoCode || 'TOOMAKT10') : undefined,
        items: items.map(item => ({
          item_id: item.product.id,
          quantity: item.quantity,
          unit_price: Number(item.product.price),
          name: item.product.name,
          image: item.product.image
        }))
      };

      const res = await api.checkout(orderPayload);

      if (res.success && res.order) {
        clearCart();
        onOrderSuccess(res.order);
      } else {
        setApiError(res.message || res.error || 'Failed to place order. Please verify your details.');
      }
    } catch (err: any) {
      console.error('Order checkout exception:', err);
      setApiError(err.message || 'An unexpected error occurred while confirming your order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-[#FAF6F0] text-center">
        <div className="w-20 h-20 rounded-full bg-[#FAF0E4] border border-[#E5C39E] flex items-center justify-center mb-4 text-[#C26715]">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-serif font-black text-[#2B170E] mb-2">
          Your Shopping Bag is Empty
        </h2>
        <p className="text-sm text-[#705335] max-w-md mb-6">
          Explore our artisan fruit-marbled toffee confections before proceeding to checkout.
        </p>
        <button
          onClick={onBackToShop}
          className="bg-[#C26715] hover:bg-[#994709] text-white px-8 py-3 rounded-full font-bold text-sm shadow-md transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Explore Confections</span>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={onBackToShop}
            className="btn-neo bg-[#FFFDF5] text-[#1F1127] px-4 py-2 text-xs flex items-center gap-2 cursor-pointer shadow-neo-sm hover:bg-[#FFE842]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN TO SHOPPING</span>
          </button>
          <div className="badge-neo bg-[#C4E86E] text-[#1F1127] text-[10px]">
            <Truck className="w-3.5 h-3.5 mr-1" />
            <span>DELIVERING TO ALL 27 GOVERNORATES</span>
          </div>
        </div>

        <div className="text-center mb-10">
          <span className="badge-neo bg-[#FFE842] text-[#1F1127] mb-2">
            TASTE LAB DISPATCH
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-black text-[#1F1127] tracking-tight uppercase">
            CHECKOUT & DELIVERY
          </h1>
          <p className="mt-2 text-xs sm:text-sm font-bold text-[#1F1127]/80">
            Freshly pulled in our Cairo atelier and packed in insulated cooler boxes for safe transit.
          </p>
        </div>

        {apiError && (
          <div className="mb-6 p-4 bg-[#FF4D8D]/20 border-2 border-[#1F1127] rounded-2xl shadow-neo-sm flex items-center gap-3 text-xs font-bold text-[#1F1127]">
            <AlertCircle className="w-5 h-5 shrink-0 text-[#FF5E2B]" />
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Customer & Delivery Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Customer Contact Info */}
            <div className="bg-[#FFFDF5] rounded-2xl p-6 sm:p-7 border-2 border-[#1F1127] shadow-neo">
              <div className="flex items-center gap-3 mb-5 border-b-2 border-[#1F1127]/15 pb-3">
                <div className="w-8 h-8 rounded-full bg-[#1F1127] text-[#FFE842] border-2 border-[#1F1127] flex items-center justify-center font-black text-xs font-display">
                  01
                </div>
                <h2 className="text-lg font-display font-black text-[#1F1127] uppercase">
                  Customer Information
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#422C20] uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ahmed Mahmoud"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className={`w-full bg-[#FAF6F0] border ${
                      formErrors.fullName ? 'border-red-400' : 'border-[#E8DDD0]'
                    } rounded-xl px-4 py-2.5 text-sm text-[#2B170E] focus:outline-none focus:border-[#C26715]`}
                  />
                  {formErrors.fullName && (
                    <span className="text-xs text-red-600 mt-1 block">{formErrors.fullName}</span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#422C20] uppercase tracking-wider mb-1.5">
                      Mobile Number (Egypt) *
                    </label>
                    <input
                      type="tel"
                      placeholder="010XXXXXXXX"
                      value={mobileNumber}
                      onChange={e => setMobileNumber(e.target.value)}
                      className={`w-full bg-[#FAF6F0] border ${
                        formErrors.mobileNumber ? 'border-red-400' : 'border-[#E8DDD0]'
                      } rounded-xl px-4 py-2.5 text-sm text-[#2B170E] focus:outline-none focus:border-[#C26715]`}
                    />
                    {formErrors.mobileNumber && (
                      <span className="text-xs text-red-600 mt-1 block">{formErrors.mobileNumber}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#422C20] uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="ahmed@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className={`w-full bg-[#FAF6F0] border ${
                        formErrors.email ? 'border-red-400' : 'border-[#E8DDD0]'
                      } rounded-xl px-4 py-2.5 text-sm text-[#2B170E] focus:outline-none focus:border-[#C26715]`}
                    />
                    {formErrors.email && (
                      <span className="text-xs text-red-600 mt-1 block">{formErrors.email}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Egypt Shipping Destination */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-[#E8DDD0]">
              <div className="flex items-center gap-3 mb-5 border-b border-[#F0E6D8] pb-3">
                <div className="w-8 h-8 rounded-full bg-[#FAF0E4] text-[#C26715] flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h2 className="text-lg font-serif font-bold text-[#2B170E]">
                    Delivery Destination (Egypt Only)
                  </h2>
                  <span className="text-[11px] text-[#705335]">
                    Select your governorate for real-time shipping calculation
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Governorate Dropdown */}
                  <div>
                    <label className="block text-xs font-bold text-[#422C20] uppercase tracking-wider mb-1.5">
                      Governorate *
                    </label>
                    <select
                      value={governorate}
                      onChange={e => setGovernorate(e.target.value)}
                      className="w-full bg-[#FAF6F0] border border-[#E8DDD0] rounded-xl px-4 py-2.5 text-sm text-[#2B170E] focus:outline-none focus:border-[#C26715] font-medium"
                    >
                      {shippingRates.map(rate => (
                        <option key={rate.id} value={rate.governorate}>
                          {rate.governorate} — {rate.price} EGP ({rate.estimated_delivery})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* City/District */}
                  <div>
                    <label className="block text-xs font-bold text-[#422C20] uppercase tracking-wider mb-1.5">
                      City / District
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Zamalek, Nasr City, Smouha"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full bg-[#FAF6F0] border border-[#E8DDD0] rounded-xl px-4 py-2.5 text-sm text-[#2B170E] focus:outline-none focus:border-[#C26715]"
                    />
                  </div>
                </div>

                {/* Street Address */}
                <div>
                  <label className="block text-xs font-bold text-[#422C20] uppercase tracking-wider mb-1.5">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    placeholder="Street name, landmark, or square"
                    value={streetAddress}
                    onChange={e => setStreetAddress(e.target.value)}
                    className={`w-full bg-[#FAF6F0] border ${
                      formErrors.streetAddress ? 'border-red-400' : 'border-[#E8DDD0]'
                    } rounded-xl px-4 py-2.5 text-sm text-[#2B170E] focus:outline-none focus:border-[#C26715]`}
                  />
                  {formErrors.streetAddress && (
                    <span className="text-xs text-red-600 mt-1 block">{formErrors.streetAddress}</span>
                  )}
                </div>

                {/* Building / Apartment */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#422C20] uppercase tracking-wider mb-1.5">
                      Building No.
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Bldg 14"
                      value={buildingNumber}
                      onChange={e => setBuildingNumber(e.target.value)}
                      className="w-full bg-[#FAF6F0] border border-[#E8DDD0] rounded-xl px-4 py-2.5 text-sm text-[#2B170E] focus:outline-none focus:border-[#C26715]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#422C20] uppercase tracking-wider mb-1.5">
                      Apartment / Floor
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Floor 4, Apt 12"
                      value={apartmentFloor}
                      onChange={e => setApartmentFloor(e.target.value)}
                      className="w-full bg-[#FAF6F0] border border-[#E8DDD0] rounded-xl px-4 py-2.5 text-sm text-[#2B170E] focus:outline-none focus:border-[#C26715]"
                    />
                  </div>
                </div>

                {/* Delivery Notes */}
                <div>
                  <label className="block text-xs font-bold text-[#422C20] uppercase tracking-wider mb-1.5">
                    Special Delivery Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Gate code, landmark, preferred delivery timing, etc."
                    value={deliveryNotes}
                    onChange={e => setDeliveryNotes(e.target.value)}
                    className="w-full bg-[#FAF6F0] border border-[#E8DDD0] rounded-xl px-4 py-2 text-sm text-[#2B170E] focus:outline-none focus:border-[#C26715]"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-[#E8DDD0]">
              <div className="flex items-center gap-3 mb-5 border-b border-[#F0E6D8] pb-3">
                <div className="w-8 h-8 rounded-full bg-[#FAF0E4] text-[#C26715] flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h2 className="text-lg font-serif font-bold text-[#2B170E]">
                  Payment Method
                </h2>
              </div>

              <div className="space-y-3.5">
                {/* 1. InstaPay / Bank Transfer */}
                <label
                  className={`flex flex-col p-4 rounded-2xl border-2 transition cursor-pointer ${
                    paymentMethod === 'instapay'
                      ? 'border-[#C26715] bg-[#FFF9F2] shadow-sm'
                      : 'border-[#E8DDD0] hover:border-[#D1B89D] bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="instapay"
                      checked={paymentMethod === 'instapay'}
                      onChange={() => setPaymentMethod('instapay')}
                      className="w-4 h-4 text-[#C26715] focus:ring-[#C26715]"
                    />
                    <div className="w-10 h-10 rounded-full bg-[#C26715]/10 text-[#C26715] flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5 text-[#C26715]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#2B170E]">
                          InstaPay / Bank Transfer
                        </span>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FAF0E4] text-[#994709] border border-[#E5C39E]">
                          Recommended
                        </span>
                      </div>
                      <div className="text-xs text-[#705335]">
                        Instant transfer confirmation via WhatsApp receipt verification.
                      </div>
                    </div>
                  </div>

                  {paymentMethod === 'instapay' && (
                    <div className="mt-3.5 pt-3 border-t border-[#F2E5D5] text-xs text-[#523B2B] space-y-2 bg-[#FAF5EE]/80 p-3 rounded-xl border border-[#EADCCB]">
                      <div className="font-bold text-[#2B170E] flex items-center justify-between">
                        <span>Official InstaPay Account Details:</span>
                        <span className="text-[11px] font-bold text-[#994709]">Atelier Cairo</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        <div className="bg-white p-2 rounded-lg border border-[#E8DDD0]">
                          <span className="text-[#8C7B71] block font-semibold">InstaPay Address</span>
                          <span className="font-mono font-bold text-[#2B170E] select-all">toomakt@instapay</span>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-[#E8DDD0]">
                          <span className="text-[#8C7B71] block font-semibold">Mobile Number</span>
                          <span className="font-mono font-bold text-[#2B170E] select-all">01000000000</span>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-[#E8DDD0] sm:col-span-2">
                          <span className="text-[#8C7B71] block font-semibold">Account / Bank</span>
                          <span className="font-semibold text-[#2B170E]">toomakt Confectionery (CIB Egypt)</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#855B36] italic">
                        * Once placed, you will be prompted to submit your payment transfer screenshot via WhatsApp for immediate atelier verification.
                      </p>
                    </div>
                  )}
                </label>

                {/* 2. Cash on Delivery (COD) */}
                <label
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-[#C26715] bg-[#FFF9F2] shadow-sm'
                      : 'border-[#E8DDD0] hover:border-[#D1B89D] bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="w-4 h-4 text-[#C26715] focus:ring-[#C26715]"
                  />
                  <div className="w-10 h-10 rounded-full bg-[#FAF0E4] text-[#994709] flex items-center justify-center shrink-0">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-[#2B170E]">
                      Cash on Delivery (COD)
                    </div>
                    <div className="text-xs text-[#705335]">
                      Pay in Egyptian Pounds upon courier arrival at your address.
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#DCFCE7] text-emerald-800">
                    Active
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-6 bg-white rounded-3xl p-6 sm:p-7 shadow-lg border border-[#E8DDD0] space-y-6">
              <h2 className="text-xl font-serif font-black text-[#2B170E] pb-3 border-b border-[#F0E6D8]">
                Order Summary
              </h2>

              {/* Items List */}
              <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                {items.map(item => {
                  const pieces = item.product.pieces_per_pack || 20;
                  return (
                    <div
                      key={item.product.id}
                      className="flex gap-3.5 pb-4 border-b border-[#F0E6D8] last:border-b-0"
                    >
                      <img
                        src={item.product.image || '/images/canister.jpg'}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-xl object-cover bg-[#FAF5EE] border border-[#EADCCB] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-[#2B170E] truncate">
                          {item.product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-[#705335]">
                          <span className="font-semibold">{item.quantity} Pack(s)</span>
                          <span>•</span>
                          <span className="text-amber-800 font-medium">{pieces} Pieces / Pack</span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-[#8C7B71]">
                            {Number(item.product.price).toFixed(2)} EGP / pack
                          </span>
                          <span className="text-sm font-bold text-[#2B170E]">
                            {(Number(item.product.price) * item.quantity).toFixed(2)} EGP
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Delivery Zone Indicator */}
              <div className="bg-[#FAF5EE] rounded-2xl p-3.5 border border-[#EADCCB] text-xs text-[#422C20] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#C26715]" />
                  <div>
                    <span className="font-bold">{governorate} Courier</span>
                    <span className="text-[11px] text-[#705335] block">Est: {estimatedDelivery}</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-[#C26715]">{shippingFee.toFixed(2)} EGP</span>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs text-[#555] pt-2 border-t border-[#F0E6D8]">
                <div className="flex justify-between">
                  <span>Product Subtotal</span>
                  <span className="font-bold text-[#2B170E]">{subtotal.toFixed(2)} EGP</span>
                </div>
                {promoApplied && discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Tasting Circle Discount ({promoCode || '10%'})</span>
                    <span>-{discountAmount.toFixed(2)} EGP</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Egypt Shipping ({governorate})</span>
                  <span className="font-bold text-[#2B170E]">{shippingFee.toFixed(2)} EGP</span>
                </div>
                <div className="flex justify-between text-base font-serif font-black text-[#994709] pt-3 border-t border-[#E8DDD0]">
                  <span>Total Due (Cash on Delivery)</span>
                  <span>{orderTotal.toFixed(2)} EGP</span>
                </div>
              </div>

              {/* Submit Order Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#C26715] hover:bg-[#994709] disabled:bg-gray-400 text-white py-4 rounded-full font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Order...</span>
                  </div>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Confirm Order ({orderTotal.toFixed(2)} EGP)</span>
                  </>
                )}
              </button>

              <div className="text-[11px] text-center text-[#8C7B71] space-y-1">
                <p className="flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-stone-500 inline" />
                  <span>100% Satisfaction Guaranteed • Artisanal Batch No. 08</span>
                </p>
                <p>Pay upon delivery. We will email your invoice immediately.</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
