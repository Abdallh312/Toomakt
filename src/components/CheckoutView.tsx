import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  Banknote,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { ShippingRate } from '../types';

interface CheckoutViewProps {
  onOrderSuccess: (order: any) => void;
  onBackToShop: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({ onOrderSuccess, onBackToShop }) => {
  const { items, subtotal, promoApplied, promoCode, discountAmount, clearCart } = useCart();
  const { isRtl } = useLanguage();

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
      setApiError('Your cart is empty. Please add items to your bag before checking out.');
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
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-[#FAF7F2] text-center">
        <div className="w-16 h-16 rounded-full bg-white border border-[#E8E2D7] flex items-center justify-center mb-4 text-[#1A1A1A] shadow-soft">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-serif font-normal text-[#1A1A1A] mb-2">
          Your Shopping Bag is Empty
        </h2>
        <p className="text-sm text-[#736B63] max-w-md mb-6 font-light">
          Explore our artisan fruit toffees before proceeding to checkout.
        </p>
        <button
          onClick={onBackToShop}
          className="btn-primary flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>EXPLORE THE COLLECTION</span>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={onBackToShop}
            className="btn-secondary text-xs flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN TO COLLECTION</span>
          </button>
          <div className="text-xs text-[#736B63] flex items-center gap-1.5 font-light">
            <Truck className="w-3.5 h-3.5 text-[#3C1322]" />
            <span>Delivering across Cairo & all Egyptian governorates</span>
          </div>
        </div>

        <div className="text-center mb-12">
          <span className="text-[11px] font-semibold text-[#736B63] uppercase tracking-widest block mb-2">
            TOOMAKT ATELIER
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#1A1A1A] tracking-tight">
            Checkout & Delivery
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#736B63] font-light">
            Crafted slowly and dispatched directly from our Cairo kitchen in protective climate boxes.
          </p>
        </div>

        {apiError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-xs text-red-700">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Customer & Delivery Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Customer Contact Info */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E8E2D7] shadow-soft">
              <div className="flex items-center gap-3 mb-5 border-b border-[#E8E2D7] pb-3">
                <div className="w-7 h-7 rounded-full bg-[#1A1A1A] text-[#FAF7F2] flex items-center justify-center font-medium text-xs">
                  01
                </div>
                <h2 className="font-serif text-lg font-normal text-[#1A1A1A]">
                  Customer Information
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#736B63] uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Layla Mansour"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className={`w-full bg-[#FAF7F2] border ${
                      formErrors.fullName ? 'border-red-400' : 'border-[#E8E2D7]'
                    } rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]`}
                  />
                  {formErrors.fullName && (
                    <span className="text-xs text-red-600 mt-1 block">{formErrors.fullName}</span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#736B63] uppercase tracking-wider mb-1.5">
                      Mobile Number (Egypt) *
                    </label>
                    <input
                      type="tel"
                      placeholder="010XXXXXXXX"
                      value={mobileNumber}
                      onChange={e => setMobileNumber(e.target.value)}
                      className={`w-full bg-[#FAF7F2] border ${
                        formErrors.mobileNumber ? 'border-red-400' : 'border-[#E8E2D7]'
                      } rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]`}
                    />
                    {formErrors.mobileNumber && (
                      <span className="text-xs text-red-600 mt-1 block">{formErrors.mobileNumber}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#736B63] uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="layla@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className={`w-full bg-[#FAF7F2] border ${
                        formErrors.email ? 'border-red-400' : 'border-[#E8E2D7]'
                      } rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]`}
                    />
                    {formErrors.email && (
                      <span className="text-xs text-red-600 mt-1 block">{formErrors.email}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Egypt Shipping Destination */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E8E2D7] shadow-soft">
              <div className="flex items-center gap-3 mb-5 border-b border-[#E8E2D7] pb-3">
                <div className="w-7 h-7 rounded-full bg-[#1A1A1A] text-[#FAF7F2] flex items-center justify-center font-medium text-xs">
                  02
                </div>
                <div>
                  <h2 className="font-serif text-lg font-normal text-[#1A1A1A]">
                    Delivery Destination
                  </h2>
                  <span className="text-xs text-[#736B63] font-light">
                    Select your governorate for real-time dispatch calculation
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Governorate Dropdown */}
                  <div>
                    <label className="block text-xs font-medium text-[#736B63] uppercase tracking-wider mb-1.5">
                      Governorate *
                    </label>
                    <select
                      value={governorate}
                      onChange={e => setGovernorate(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                    >
                      {shippingRates.map(rate => (
                        <option key={rate.id} value={rate.governorate}>
                          {rate.governorate} — EGP {rate.price} ({rate.estimated_delivery})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* City/District */}
                  <div>
                    <label className="block text-xs font-medium text-[#736B63] uppercase tracking-wider mb-1.5">
                      City / District
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Zamalek, New Cairo, Maadi"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                    />
                  </div>
                </div>

                {/* Street Address */}
                <div>
                  <label className="block text-xs font-medium text-[#736B63] uppercase tracking-wider mb-1.5">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    placeholder="Street name, landmark, or square"
                    value={streetAddress}
                    onChange={e => setStreetAddress(e.target.value)}
                    className={`w-full bg-[#FAF7F2] border ${
                      formErrors.streetAddress ? 'border-red-400' : 'border-[#E8E2D7]'
                    } rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]`}
                  />
                  {formErrors.streetAddress && (
                    <span className="text-xs text-red-600 mt-1 block">{formErrors.streetAddress}</span>
                  )}
                </div>

                {/* Building / Apartment */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#736B63] uppercase tracking-wider mb-1.5">
                      Building No.
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Bldg 14"
                      value={buildingNumber}
                      onChange={e => setBuildingNumber(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#736B63] uppercase tracking-wider mb-1.5">
                      Apartment / Floor
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Floor 4, Apt 12"
                      value={apartmentFloor}
                      onChange={e => setApartmentFloor(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                    />
                  </div>
                </div>

                {/* Delivery Notes */}
                <div>
                  <label className="block text-xs font-medium text-[#736B63] uppercase tracking-wider mb-1.5">
                    Special Delivery Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Gate code, landmark, preferred delivery timing, etc."
                    value={deliveryNotes}
                    onChange={e => setDeliveryNotes(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-4 py-2 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E8E2D7] shadow-soft">
              <div className="flex items-center gap-3 mb-5 border-b border-[#E8E2D7] pb-3">
                <div className="w-7 h-7 rounded-full bg-[#1A1A1A] text-[#FAF7F2] flex items-center justify-center font-medium text-xs">
                  03
                </div>
                <h2 className="font-serif text-lg font-normal text-[#1A1A1A]">
                  Payment Method
                </h2>
              </div>

              <div className="space-y-3.5">
                {/* 1. InstaPay / Bank Transfer */}
                <label
                  className={`flex flex-col p-4 rounded-xl border transition cursor-pointer ${
                    paymentMethod === 'instapay'
                      ? 'border-[#3C1322] bg-[#FAF7F2] shadow-soft'
                      : 'border-[#E8E2D7] hover:border-[#1A1A1A] bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="instapay"
                      checked={paymentMethod === 'instapay'}
                      onChange={() => setPaymentMethod('instapay')}
                      className="w-4 h-4 text-[#3C1322] focus:ring-[#3C1322]"
                    />
                    <div className="w-9 h-9 rounded-full bg-[#3C1322]/10 text-[#3C1322] flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-[#3C1322]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[#1A1A1A]">
                          InstaPay / Bank Transfer
                        </span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#3C1322] text-[#FAF7F2]">
                          Recommended
                        </span>
                      </div>
                      <div className="text-xs text-[#736B63] font-light">
                        Instant transfer confirmation via WhatsApp receipt verification.
                      </div>
                    </div>
                  </div>

                  {paymentMethod === 'instapay' && (
                    <div className="mt-3.5 pt-3 border-t border-[#E8E2D7] text-xs text-[#736B63] space-y-2 bg-white p-3.5 rounded-xl border border-[#E8E2D7]">
                      <div className="font-medium text-[#1A1A1A] flex items-center justify-between">
                        <span>Official InstaPay Account Details:</span>
                        <span className="text-[11px] font-normal text-[#3C1322]">Toomakt Atelier Cairo</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        <div className="bg-[#FAF7F2] p-2 rounded-lg border border-[#E8E2D7]">
                          <span className="text-[#736B63] block font-light">InstaPay Address</span>
                          <span className="font-mono font-medium text-[#1A1A1A] select-all">toomakt@instapay</span>
                        </div>
                        <div className="bg-[#FAF7F2] p-2 rounded-lg border border-[#E8E2D7]">
                          <span className="text-[#736B63] block font-light">Mobile Number</span>
                          <span className="font-mono font-medium text-[#1A1A1A] select-all">01000000000</span>
                        </div>
                        <div className="bg-[#FAF7F2] p-2 rounded-lg border border-[#E8E2D7] sm:col-span-2">
                          <span className="text-[#736B63] block font-light">Account / Bank</span>
                          <span className="font-medium text-[#1A1A1A]">toomakt Confectionery (CIB Egypt)</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#736B63] italic font-light">
                        * Once placed, you will be prompted to submit your payment transfer screenshot via WhatsApp for immediate atelier verification.
                      </p>
                    </div>
                  )}
                </label>

                {/* 2. Cash on Delivery (COD) */}
                <label
                  className={`flex items-center gap-3 p-4 rounded-xl border transition cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-[#3C1322] bg-[#FAF7F2] shadow-soft'
                      : 'border-[#E8E2D7] hover:border-[#1A1A1A] bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="w-4 h-4 text-[#3C1322] focus:ring-[#3C1322]"
                  />
                  <div className="w-9 h-9 rounded-full bg-[#FAF7F2] text-[#1A1A1A] flex items-center justify-center shrink-0 border border-[#E8E2D7]">
                    <Banknote className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-[#1A1A1A]">
                      Cash on Delivery (COD)
                    </div>
                    <div className="text-xs text-[#736B63] font-light">
                      Pay in Egyptian Pounds upon courier arrival at your address.
                    </div>
                  </div>
                  <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FAF7F2] text-[#736B63] border border-[#E8E2D7]">
                    Active
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-6 bg-white rounded-2xl p-6 sm:p-7 border border-[#E8E2D7] shadow-soft space-y-6">
              <h2 className="font-serif text-xl font-normal text-[#1A1A1A] pb-3 border-b border-[#E8E2D7]">
                Order Summary
              </h2>

              {/* Items List */}
              <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                {items.map(item => {
                  return (
                    <div
                      key={item.product.id}
                      className="flex gap-3.5 pb-4 border-b border-[#E8E2D7] last:border-b-0"
                    >
                      <img
                        src={item.product.image || '/images/products/mango_sunbeam.jpg'}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-xl object-cover bg-[#FAF7F2] border border-[#E8E2D7] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-[#1A1A1A] truncate">
                          {item.product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-[#736B63] font-light">
                          <span>Qty: {item.quantity}</span>
                          <span>•</span>
                          <span>EGP {Number(item.product.price).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-[#736B63]">
                            Line Total
                          </span>
                          <span className="text-sm font-medium text-[#1A1A1A]">
                            EGP {(Number(item.product.price) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Delivery Zone Indicator */}
              <div className="bg-[#FAF7F2] rounded-xl p-3.5 border border-[#E8E2D7] text-xs text-[#1A1A1A] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#3C1322]" />
                  <div>
                    <span className="font-medium">{governorate} Courier</span>
                    <span className="text-[11px] text-[#736B63] block font-light">Est: {estimatedDelivery}</span>
                  </div>
                </div>
                <span className="font-mono font-medium text-[#1A1A1A]">EGP {shippingFee.toFixed(2)}</span>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs text-[#736B63] pt-2 border-t border-[#E8E2D7]">
                <div className="flex justify-between">
                  <span>Product Subtotal</span>
                  <span className="font-medium text-[#1A1A1A]">EGP {subtotal.toFixed(2)}</span>
                </div>
                {promoApplied && discountAmount > 0 && (
                  <div className="flex justify-between text-[#88C057] font-medium">
                    <span>Discount ({promoCode || '10%'})</span>
                    <span>-EGP {discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Egypt Shipping ({governorate})</span>
                  <span className="font-medium text-[#1A1A1A]">EGP {shippingFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-serif font-normal text-[#1A1A1A] pt-3 border-t border-[#E8E2D7]">
                  <span>Total Due</span>
                  <span className="font-medium">EGP {orderTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Submit Order Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-4 text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#FAF7F2] border-t-transparent rounded-full animate-spin" />
                    <span>Processing Order...</span>
                  </div>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Order · EGP {orderTotal.toFixed(2)}</span>
                  </>
                )}
              </button>

              <div className="text-[11px] text-center text-[#736B63] space-y-1 font-light">
                <p className="flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#3C1322] inline" />
                  <span>Artisan small batch · Dispatched fresh</span>
                </p>
                <p>Official invoice and tracking link will be sent immediately.</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
