import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ShoppingBag,
  CreditCard,
  Lock,
  X,
  Banknote,
  RotateCcw,
  Sparkles,
  Check,
  Info,
  Clock,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { ShippingRate } from '../types';
import { PaymobService } from '../services/paymob';

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
  
  // Payment Method: 'card' (Visa / Mastercard via Paymob) or 'cod' (Cash on Delivery)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');
  const [paymobIframeUrl, setPaymobIframeUrl] = useState<string | null>(null);
  const [paymobOrderId, setPaymobOrderId] = useState<number | string | null>(null);
  const [activeOrderNumber, setActiveOrderNumber] = useState<string>('');
  const [pendingOrderPayload, setPendingOrderPayload] = useState<any>(null);

  // Submission & Verification state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [paymentDeclinedError, setPaymentDeclinedError] = useState<string | null>(null);
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

  // Listen for Paymob iframe postMessage events
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (!event.data || !paymobIframeUrl) return;
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data.type === 'transaction_status' || data.success !== undefined) {
          if (data.success === true || data.status === 'success') {
            await handleVerifyAndFinalizePayment();
          } else if (data.success === false) {
            setPaymentDeclinedError(
              'Paymob reported this card transaction as DECLINED. In test mode, make sure to use the Paymob Test Card, or switch to Cash on Delivery.'
            );
          }
        }
      } catch {}
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [paymobIframeUrl, pendingOrderPayload, paymobOrderId, activeOrderNumber]);

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
    if (!fullName.trim()) errors.fullName = isRtl ? 'الاسم بالكامل مطلوب.' : 'Full name is required.';
    if (!mobileNumber.trim()) {
      errors.mobileNumber = isRtl ? 'رقم الهاتف مطلوب.' : 'Mobile number is required.';
    } else if (!/^(010|011|012|015|\+20)\d{7,10}$/.test(mobileNumber.replace(/\s+/g, ''))) {
      errors.mobileNumber = isRtl
        ? 'يرجى إدخال رقم موبايل مصري صحيح (مثال: 01012345678).'
        : 'Please enter a valid Egyptian mobile number (e.g. 01012345678).';
    }
    if (!email.trim()) {
      errors.email = isRtl ? 'البريد الإلكتروني مطلوب.' : 'Email address is required for order confirmation.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = isRtl ? 'يرجى إدخال بريد إلكتروني صحيح.' : 'Please enter a valid email address.';
    }
    if (!governorate) errors.governorate = isRtl ? 'يرجى اختيار المحافظة.' : 'Please select your Egyptian governorate.';
    if (!streetAddress.trim()) errors.streetAddress = isRtl ? 'العنوان التفصيلي مطلوب.' : 'Detailed street address is required.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Order Handler
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setPaymentDeclinedError(null);

    if (items.length === 0) {
      setApiError(isRtl ? 'حقيبة التسوق فارغة.' : 'Your cart is empty. Please add items before checking out.');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const generatedOrderNumber = `ORD-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      setActiveOrderNumber(generatedOrderNumber);

      const orderPayload = {
        order_number: generatedOrderNumber,
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
          name: item.selected_flavor ? `${item.product.name} (${item.selected_flavor})` : item.product.name,
          flavor: item.selected_flavor,
          image: item.product.image,
        })),
      };

      if (paymentMethod === 'cod') {
        // Direct Cash on Delivery: create order immediately in Supabase
        const res = await api.checkout({
          ...orderPayload,
          payment_method: 'cod',
          payment_status: 'pending',
        });

        if (res.success && res.order) {
          clearCart();
          onOrderSuccess(res.order);
        } else {
          setApiError(res.message || res.error || 'Failed to place Cash on Delivery order. Please try again.');
        }
      } else {
        // Visa / Mastercard via Paymob:
        // DO NOT create completed order in DB yet. Only initialize payment session!
        setPendingOrderPayload(orderPayload);

        const paymobResult = await PaymobService.initiateCardPayment({
          orderNumber: generatedOrderNumber,
          amountEgp: orderTotal,
          customerName: fullName.trim(),
          customerEmail: email.trim(),
          customerPhone: mobileNumber.trim(),
          shippingAddress: streetAddress.trim(),
          shippingCity: city.trim() || governorate,
          governorate: governorate,
          buildingNumber: buildingNumber.trim(),
          apartmentFloor: apartmentFloor.trim(),
          items: orderPayload.items.map(it => ({
            name: it.name,
            unit_price: it.unit_price,
            quantity: it.quantity,
          })),
        });

        if (paymobResult.iframeUrl) {
          setPaymobOrderId(paymobResult.paymobOrderId || null);
          setPaymobIframeUrl(paymobResult.iframeUrl);
        } else if (paymobResult.isSandboxDemo) {
          // Fallback simulation when no live Paymob credentials are configured
          const res = await api.checkout({
            ...orderPayload,
            payment_method: 'card',
            payment_status: 'paid',
          });
          if (res.success && res.order) {
            clearCart();
            onOrderSuccess(res.order);
          } else {
            setApiError(res.message || res.error || 'Error processing card checkout.');
          }
        } else {
          setApiError('Unable to connect to Paymob card gateway. Please try again or choose Cash on Delivery.');
        }
      }
    } catch (err: any) {
      console.error('Order checkout exception:', err);
      setApiError(err.message || 'An unexpected error occurred while confirming your order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Verify and finalize Visa card payment
  const handleVerifyAndFinalizePayment = async () => {
    if (!pendingOrderPayload) return;
    setIsVerifyingPayment(true);
    setPaymentDeclinedError(null);

    try {
      const verifyRes = await PaymobService.verifyPayment({
        paymobOrderId: paymobOrderId || undefined,
        orderNumber: activeOrderNumber || pendingOrderPayload.order_number,
      });

      if (verifyRes.isPaid) {
        // Genuine payment verified by Paymob!
        const res = await api.checkout({
          ...pendingOrderPayload,
          order_number: activeOrderNumber,
          payment_method: 'card',
          payment_status: 'paid',
        });

        if (res.success && res.order) {
          clearCart();
          setPaymobIframeUrl(null);
          onOrderSuccess(res.order);
          return;
        } else {
          setPaymentDeclinedError(res.message || 'Payment confirmed, but order creation failed in database.');
        }
      } else {
        // Payment declined or incomplete
        const reason = verifyRes.declineReason || 'Transaction was declined by Paymob / issuing bank.';
        setPaymentDeclinedError(
          `Payment could not be confirmed: ${reason}. In test sandbox mode, only Paymob test cards are accepted. You can try with the test card or switch to Cash on Delivery (COD).`
        );
      }
    } catch (err: any) {
      setPaymentDeclinedError('Could not verify transaction with Paymob gateway: ' + (err.message || 'Unknown error'));
    } finally {
      setIsVerifyingPayment(false);
    }
  };

  // Switch to Cash on Delivery from inside the Paymob modal
  const handleSwitchToCodFromModal = async () => {
    if (!pendingOrderPayload) return;
    setIsSubmitting(true);
    setPaymobIframeUrl(null);
    setPaymentDeclinedError(null);

    try {
      const res = await api.checkout({
        ...pendingOrderPayload,
        payment_method: 'cod',
        payment_status: 'pending',
      });
      if (res.success && res.order) {
        clearCart();
        onOrderSuccess(res.order);
      } else {
        setApiError('Failed to convert order to Cash on Delivery: ' + (res.message || ''));
      }
    } catch (err: any) {
      setApiError(err.message || 'Failed to switch to Cash on Delivery.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close modal without finalizing (DOES NOT navigate to Order Success)
  const handleCloseModal = () => {
    setPaymobIframeUrl(null);
    setPaymentDeclinedError(null);
    setApiError(
      isRtl
        ? 'تم إلغاء عملية الدفع بالفيزا ولم يتم خصم أي مبالغ. يمكنك إعادة المحاولة أو اختيار الدفع عند الاستلام.'
        : 'Visa payment was not completed and your card was not charged. You can retry with Visa or choose Cash on Delivery (COD).'
    );
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-[#FAF7F2] text-center">
        <div className="w-16 h-16 rounded-full bg-white border border-[#E8E2D7] flex items-center justify-center mb-4 text-[#1A1A1A] shadow-soft">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-serif font-normal text-[#1A1A1A] mb-2">
          {isRtl ? 'حقيبة التسوق فارغة' : 'Your Shopping Bag is Empty'}
        </h2>
        <p className="text-sm text-[#736B63] max-w-md mb-6 font-light">
          {isRtl
            ? 'تصفح تشكيلة التوفي الفاخرة المطعمة بالفواكه الطبيعية قبل إتمام الشراء.'
            : 'Explore our artisan fruit toffees before proceeding to checkout.'}
        </p>
        <button
          onClick={onBackToShop}
          className="btn-primary flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isRtl ? 'تصفح المجموعة' : 'EXPLORE THE COLLECTION'}</span>
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
            <span>{isRtl ? 'العودة للمتجر' : 'RETURN TO COLLECTION'}</span>
          </button>
          <div className="text-xs text-[#736B63] flex items-center gap-1.5 font-light">
            <Truck className="w-3.5 h-3.5 text-[#3C1322]" />
            <span>{isRtl ? 'شحن لجميع محافظات جمهورية مصر العربية' : 'Delivering across Cairo & all Egyptian governorates'}</span>
          </div>
        </div>

        <div className="text-center mb-10">
          <span className="text-[11px] font-semibold text-[#736B63] uppercase tracking-widest block mb-2">
            TOOMAKT ATELIER
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#1A1A1A] tracking-tight">
            {isRtl ? 'إتمام الطلب والشحن' : 'Checkout & Delivery'}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#736B63] font-light">
            {isRtl
              ? 'يتم تجهيز الطلب طازجاً في معملنا ويصلك في صناديق مبردة لحماية النكهة والملمس.'
              : 'Crafted slowly and dispatched directly from our Cairo kitchen in protective climate boxes.'}
          </p>
        </div>

        {apiError && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-3 text-xs text-amber-900 shadow-xs">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
              <span>{apiError}</span>
            </div>
            <button
              onClick={() => setApiError(null)}
              className="text-amber-700 hover:text-amber-900 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
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
                  {isRtl ? 'بيانات العميل' : 'Customer Information'}
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#736B63] uppercase tracking-wider mb-1.5">
                    {isRtl ? 'الاسم بالكامل *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    placeholder={isRtl ? 'مثال: ليلى منصور' : 'e.g. Layla Mansour'}
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
                      {isRtl ? 'رقم الموبايل المصري *' : 'Mobile Number (Egypt) *'}
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
                      {isRtl ? 'البريد الإلكتروني *' : 'Email Address *'}
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
                    {isRtl ? 'عنوان التوصيل في مصر' : 'Delivery Destination'}
                  </h2>
                  <span className="text-xs text-[#736B63] font-light">
                    {isRtl ? 'اختر محافظتك لحساب قيمة الشحن الفعلي' : 'Select your governorate for real-time dispatch calculation'}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Governorate Dropdown */}
                  <div>
                    <label className="block text-xs font-medium text-[#736B63] uppercase tracking-wider mb-1.5">
                      {isRtl ? 'المحافظة *' : 'Governorate *'}
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
                      {isRtl ? 'المدينة / المنطقة' : 'City / District'}
                    </label>
                    <input
                      type="text"
                      placeholder={isRtl ? 'مثال: الزمالك، المعادي، التجمع' : 'e.g. Zamalek, New Cairo, Maadi'}
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                    />
                  </div>
                </div>

                {/* Street Address */}
                <div>
                  <label className="block text-xs font-medium text-[#736B63] uppercase tracking-wider mb-1.5">
                    {isRtl ? 'العنوان واسم الشارع *' : 'Street Address *'}
                  </label>
                  <input
                    type="text"
                    placeholder={isRtl ? 'اسم الشارع، علامة مميزة' : 'Street name, landmark, or square'}
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
                      {isRtl ? 'رقم العمارة' : 'Building No.'}
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
                      {isRtl ? 'رقم الشقة / الدور' : 'Apartment / Floor'}
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
                    {isRtl ? 'ملاحظات خاصة للمندوب (اختياري)' : 'Special Delivery Notes (Optional)'}
                  </label>
                  <textarea
                    rows={2}
                    placeholder={isRtl ? 'كود البوابة، موعد مفضل للتوصيل، إلخ' : 'Gate code, landmark, preferred delivery timing, etc.'}
                    value={deliveryNotes}
                    onChange={e => setDeliveryNotes(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-4 py-2 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method Selection (Visa / Paymob & Cash on Delivery) */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E8E2D7] shadow-soft">
              <div className="flex items-center gap-3 mb-5 border-b border-[#E8E2D7] pb-3">
                <div className="w-7 h-7 rounded-full bg-[#1A1A1A] text-[#FAF7F2] flex items-center justify-center font-medium text-xs">
                  03
                </div>
                <div>
                  <h2 className="font-serif text-lg font-normal text-[#1A1A1A]">
                    {isRtl ? 'طريقة الدفع' : 'Payment Method'}
                  </h2>
                  <span className="text-xs text-[#736B63] font-light">
                    {isRtl ? 'اختر طريقة الدفع المفضلة لديك' : 'Choose your preferred payment method'}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {/* Option 1: Pay with Visa / Mastercard (Paymob) */}
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#3C1322] bg-[#FAF7F2] shadow-sm'
                      : 'border-[#E8E2D7] hover:border-[#1A1A1A]/30 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          paymentMethod === 'card'
                            ? 'bg-[#3C1322] text-[#FAF7F2]'
                            : 'bg-[#FAF7F2] text-[#736B63] border border-[#E8E2D7]'
                        }`}
                      >
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-[#1A1A1A]">
                            {isRtl ? 'بطاقة بنكية (فيزا وماستركارد وميزة)' : 'Credit / Debit Card (Visa & Mastercard)'}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#3C1322] text-[#FAF7F2]">
                            Paymob Secure
                          </span>
                        </div>
                        <div className="text-xs text-[#736B63] font-light mt-0.5">
                          {isRtl
                            ? 'دفع فوري وآمن عبر بوابة بيموب Paymob مع تشفير 3D-Secure.'
                            : 'Instant, seamless card payment secured by Paymob 3D-Secure.'}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 shrink-0 ${
                        paymentMethod === 'card' ? 'border-[#3C1322] bg-[#3C1322]' : 'border-[#C4BCB3]'
                      }`}
                    >
                      {paymentMethod === 'card' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>

                  {/* Card Network Badges */}
                  <div className="mt-4 pt-3.5 border-t border-[#E8E2D7] flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-white border border-[#E8E2D7] rounded-md text-[11px] font-bold text-[#1A1F71] tracking-wider shadow-2xs">
                        VISA
                      </span>
                      <span className="px-2.5 py-1 bg-white border border-[#E8E2D7] rounded-md text-[11px] font-bold text-[#EB001B] tracking-wider shadow-2xs">
                        Mastercard
                      </span>
                      <span className="px-2.5 py-1 bg-white border border-[#E8E2D7] rounded-md text-[11px] font-bold text-[#006633] tracking-wider shadow-2xs">
                        Meeza
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#736B63]">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#3C1322]" />
                      <span>{isRtl ? 'تشفير آمن 256-bit' : '256-bit SSL Encrypted & 3D-Secure'}</span>
                    </div>
                  </div>
                </div>

                {/* Option 2: Cash on Delivery (COD) */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#3C1322] bg-[#FAF7F2] shadow-sm'
                      : 'border-[#E8E2D7] hover:border-[#1A1A1A]/30 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          paymentMethod === 'cod'
                            ? 'bg-[#3C1322] text-[#FAF7F2]'
                            : 'bg-[#FAF7F2] text-[#736B63] border border-[#E8E2D7]'
                        }`}
                      >
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-[#1A1A1A]">
                            {isRtl ? 'الدفع عند الاستلام (كاش)' : 'Cash on Delivery (COD)'}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-700 text-white">
                            {isRtl ? 'بدون رسوم إضافية' : 'Zero Extra Fee'}
                          </span>
                        </div>
                        <div className="text-xs text-[#736B63] font-light mt-0.5">
                          {isRtl
                            ? 'ادفع نقداً لمندوب الشحن عند استلام صندوق التوفي عند باب منزلك.'
                            : 'Pay in cash directly to our courier when your climate-controlled parcel arrives.'}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 shrink-0 ${
                        paymentMethod === 'cod' ? 'border-[#3C1322] bg-[#3C1322]' : 'border-[#C4BCB3]'
                      }`}
                    >
                      {paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-[#E8E2D7] flex items-center justify-between text-xs text-[#736B63]">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Truck className="w-3.5 h-3.5 text-[#3C1322]" />
                      <span>{isRtl ? 'متاح لجميع محافظات مصر' : 'Available across all Egyptian governorates'}</span>
                    </div>
                    <span className="text-[11px] font-medium text-[#1A1A1A]">
                      {isRtl ? 'الدفع بالجنيه المصري' : 'Exact cash in EGP requested'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-6 bg-white rounded-2xl p-6 sm:p-7 border border-[#E8E2D7] shadow-soft space-y-6">
              <h2 className="font-serif text-xl font-normal text-[#1A1A1A] pb-3 border-b border-[#E8E2D7]">
                {isRtl ? 'ملخص الطلب' : 'Order Summary'}
              </h2>

              {/* Items List */}
              <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                {items.map(item => {
                  return (
                    <div
                      key={`${item.product.id}-${item.selected_flavor || ''}`}
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
                        {item.selected_flavor && (
                          <span className="text-[11px] font-medium text-[#3C1322] bg-[#FFD147]/25 border border-[#FFD147]/40 px-2 py-0.5 rounded-full inline-block mt-0.5">
                            {isRtl ? 'النكهة: ' : 'Flavor: '}{item.selected_flavor}
                          </span>
                        )}
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-[#736B63] font-light">
                          <span>Qty: {item.quantity}</span>
                          <span>•</span>
                          <span>EGP {Number(item.product.price).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-[#736B63]">
                            {isRtl ? 'الإجمالي' : 'Line Total'}
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
                    <span className="font-medium">{governorate} {isRtl ? 'شحن' : 'Courier'}</span>
                    <span className="text-[11px] text-[#736B63] block font-light">Est: {estimatedDelivery}</span>
                  </div>
                </div>
                <span className="font-mono font-medium text-[#1A1A1A]">EGP {shippingFee.toFixed(2)}</span>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs text-[#736B63] pt-2 border-t border-[#E8E2D7]">
                <div className="flex justify-between">
                  <span>{isRtl ? 'قيمة المنتجات' : 'Product Subtotal'}</span>
                  <span className="font-medium text-[#1A1A1A]">EGP {subtotal.toFixed(2)}</span>
                </div>
                {promoApplied && discountAmount > 0 && (
                  <div className="flex justify-between text-[#88C057] font-medium">
                    <span>{isRtl ? 'الخصم' : 'Discount'} ({promoCode || '10%'})</span>
                    <span>-EGP {discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{isRtl ? 'مصاريف الشحن' : 'Egypt Shipping'} ({governorate})</span>
                  <span className="font-medium text-[#1A1A1A]">EGP {shippingFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-serif font-normal text-[#1A1A1A] pt-3 border-t border-[#E8E2D7]">
                  <span>{isRtl ? 'المجموع النهائي' : 'Total Due'}</span>
                  <span className="font-medium text-[#3C1322]">EGP {orderTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Submit Order Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-4 text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-soft hover:shadow-lg transition-all"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#FAF7F2] border-t-transparent rounded-full animate-spin" />
                    <span>{isRtl ? 'جاري المعالجة...' : 'Processing Order...'}</span>
                  </div>
                ) : paymentMethod === 'card' ? (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>{isRtl ? `الدفع بالفيزا · ${orderTotal.toFixed(2)} ج.م` : `Proceed to Visa Payment · EGP ${orderTotal.toFixed(2)}`}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isRtl ? `تأكيد الطلب (الدفع عند الاستلام) · ${orderTotal.toFixed(2)} ج.م` : `Confirm Order (Cash on Delivery) · EGP ${orderTotal.toFixed(2)}`}</span>
                  </>
                )}
              </button>

              <div className="text-[11px] text-center text-[#736B63] space-y-1 font-light">
                <p className="flex items-center justify-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#3C1322] inline" />
                  <span>
                    {paymentMethod === 'card'
                      ? (isRtl ? 'بوابة دفع إلكتروني مشفرة 256-bit عبر Paymob' : '256-Bit SSL Encrypted Checkout Powered by Paymob')
                      : (isRtl ? 'الدفع نقداً عند استلام شحنتك' : 'Payment upon physical package delivery')}
                  </span>
                </p>
                <p>
                  {isRtl
                    ? 'يتم إرسال إشعار فوري بتأكيد الطلب وتفاصيل المتابعة.'
                    : 'Official order receipt & dispatch updates provided immediately.'}
                </p>
              </div>
            </div>
          </div>
        </form>

        {/* ======================================================== */}
        {/* PAYMOB SECURE 3D-SECURE VISA PAYMENT MODAL               */}
        {/* ======================================================== */}
        {paymobIframeUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs">
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[90vh]">
              {/* Modal Top Header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E8E2D7] bg-[#FAF7F2]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#3C1322] text-white flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-serif text-sm font-semibold text-[#1A1A1A] block">
                      Paymob 3D-Secure Visa Payment
                    </span>
                    <span className="text-[11px] text-[#736B63]">
                      Order #{activeOrderNumber} • Total: <strong className="text-[#1A1A1A]">{orderTotal.toFixed(2)} EGP</strong>
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="p-1.5 rounded-full text-[#736B63] hover:text-[#1A1A1A] hover:bg-black/5 cursor-pointer transition-colors"
                  title="Close payment window"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sandbox Test Card Notice Banner */}
              <div className="bg-amber-50/90 border-b border-amber-200 px-4 py-2.5 text-xs text-amber-900 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>Paymob Sandbox Mode:</strong> Real bank cards are declined in test mode. Use Test Card:{' '}
                    <code className="bg-white px-2 py-0.5 rounded border border-amber-300 font-mono font-bold text-amber-950">
                      5123 4567 8901 2346
                    </code>{' '}
                    • Exp: <strong>12/28</strong> • CVV: <strong>123</strong> • OTP: <strong>1234</strong>
                  </span>
                </div>
              </div>

              {/* Payment Decline Notification Banner inside Modal */}
              {paymentDeclinedError && (
                <div className="bg-red-50 border-b border-red-200 px-4 py-3 text-xs text-red-800 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <strong className="block font-semibold">Payment Incomplete / Declined</strong>
                    <span>{paymentDeclinedError}</span>
                    <div className="mt-2 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleSwitchToCodFromModal}
                        className="font-bold text-xs underline text-red-900 hover:text-black cursor-pointer"
                      >
                        Switch to Cash on Delivery (COD) instead
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Paymob Hosted Iframe */}
              <div className="flex-1 w-full bg-[#FAF7F2] relative">
                <iframe
                  src={paymobIframeUrl}
                  title="Paymob Visa Payment Gateway"
                  className="w-full h-full border-0"
                  allow="payment"
                />
              </div>

              {/* Modal Footer with Verification and Cancel Actions */}
              <div className="p-4 border-t border-[#E8E2D7] bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 rounded-xl border border-[#E8E2D7] text-[#736B63] hover:text-[#1A1A1A] hover:bg-neutral-50 font-medium cursor-pointer transition"
                  >
                    Cancel & Return to Checkout
                  </button>
                  <button
                    type="button"
                    onClick={handleSwitchToCodFromModal}
                    className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-[#1A1A1A] font-medium cursor-pointer transition flex items-center gap-1.5"
                  >
                    <Banknote className="w-3.5 h-3.5" />
                    <span>Pay with Cash on Delivery</span>
                  </button>
                </div>

                {/* Primary Button: MUST VERIFY PAYMENT BEFORE ORDER SUCCESS */}
                <button
                  type="button"
                  onClick={handleVerifyAndFinalizePayment}
                  disabled={isVerifyingPayment}
                  className="btn-primary py-2.5 px-6 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-soft"
                >
                  {isVerifyingPayment ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying with Paymob...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verify & Confirm Payment</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
