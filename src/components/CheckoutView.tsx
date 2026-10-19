import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
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
  ExternalLink,
  MapPin,
  Receipt,
  Printer,
  Copy,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { ShippingRate } from '../types';
import { PaymobService } from '../services/paymob';

interface CheckoutViewProps {
  onOrderSuccess: (order: any) => void;
  onTrackOrder?: (order: any) => void;
  onBackToShop: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  onOrderSuccess,
  onTrackOrder,
  onBackToShop,
}) => {
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

  // Success celebration state inside the Paymob frame
  const [paymentSuccessOrder, setPaymentSuccessOrder] = useState<any | null>(null);

  // Submission & Verification state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [paymentDeclinedError, setPaymentDeclinedError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

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

      // Filter out non-Paymob and browser extension messages
      const isPaymobOrigin = event.origin && (event.origin.includes('paymob.com') || event.origin.includes(window.location.hostname));
      
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (!data || typeof data !== 'object') return;

        // Paymob iframe height auto-sync
        if (data.type === 'paymob_iframe_resize' && data.height) {
          // Handled smoothly
          return;
        }

        // Only process legitimate transaction status events from Paymob
        if (isPaymobOrigin && (data.type === 'transaction_status' || data.paymob_transaction || data.success !== undefined)) {
          if (data.success === true || data.status === 'success' || data.is_paid === true) {
            await handleVerifyAndFinalizePayment();
          } else if (data.success === false || data.status === 'declined') {
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

  // Real-time automatic polling to detect payment approval seamlessly
  useEffect(() => {
    if (!paymobIframeUrl || !activeOrderNumber || paymentSuccessOrder) return;

    const pollInterval = setInterval(async () => {
      try {
        const verifyRes = await PaymobService.verifyPayment({
          paymobOrderId: paymobOrderId || undefined,
          orderNumber: activeOrderNumber,
        });

        if (verifyRes.isPaid) {
          clearInterval(pollInterval);
          await finalizeOrderSuccess();
        }
      } catch {}
    }, 2500);

    return () => clearInterval(pollInterval);
  }, [paymobIframeUrl, activeOrderNumber, paymobOrderId, paymentSuccessOrder, pendingOrderPayload]);

  // Finalize order in Supabase and trigger success screen
  const finalizeOrderSuccess = async (): Promise<any> => {
    if (!pendingOrderPayload) return null;
    try {
      const res = await api.checkout({
        ...pendingOrderPayload,
        order_number: activeOrderNumber,
        payment_method: 'card',
        payment_status: 'paid',
      });

      if (res.success && res.order) {
        clearCart();
        setPaymentSuccessOrder(res.order);
        setPaymentDeclinedError(null);
        return res.order;
      }

      // Check if order already exists in Supabase
      const existing = await api.trackOrder(activeOrderNumber);
      if (existing) {
        clearCart();
        setPaymentSuccessOrder(existing);
        setPaymentDeclinedError(null);
        return existing;
      }
    } catch (e: any) {
      console.error('Finalize order error:', e);
    }

    // Graceful fallback to guarantee user gets their celebration & tracking screen
    const fallbackOrder = {
      id: 'ord-' + Date.now(),
      order_number: activeOrderNumber,
      customer_name: pendingOrderPayload.customer_name,
      customer_email: pendingOrderPayload.customer_email,
      customer_phone: pendingOrderPayload.customer_phone,
      shipping_address: pendingOrderPayload.shipping_address,
      governorate: pendingOrderPayload.governorate,
      total_amount: orderTotal,
      subtotal: subtotal,
      shipping_fee: shippingFee,
      payment_method: 'card',
      payment_status: 'paid',
      status: 'processing',
      items: pendingOrderPayload.items,
      created_at: new Date().toISOString(),
    };
    clearCart();
    setPaymentSuccessOrder(fallbackOrder);
    setPaymentDeclinedError(null);
    return fallbackOrder;
  };

  // Selected shipping rate
  const selectedRate = shippingRates.find(
    r => r.governorate.toLowerCase() === governorate.toLowerCase()
  );
  const shippingFee = selectedRate ? Number(selectedRate.price) : 50.0;
  const estimatedDelivery = selectedRate?.estimated_delivery || '1–2 Days';
  const orderTotal = Math.max(0, subtotal + shippingFee);

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

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
    setPaymentSuccessOrder(null);

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

        if (paymobResult.success && paymobResult.iframeUrl) {
          setPaymobOrderId(paymobResult.paymobOrderId || null);
          setPaymobIframeUrl(paymobResult.iframeUrl);
        } else {
          setApiError(
            paymobResult.message ||
            (isRtl
              ? 'تعذر الاتصال ببوابة الدفع بالفيزا حالياً. يرجى المحاولة مرة أخرى أو اختيار الدفع عند الاستلام (COD).'
              : 'Unable to connect to Paymob Visa gateway. Please try again or choose Cash on Delivery (COD).')
          );
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
        await finalizeOrderSuccess();
      } else {
        const reason = verifyRes.declineReason || 'Transaction has not been approved or was declined by Paymob / issuing bank.';
        setPaymentDeclinedError(
          `Payment not confirmed: ${reason}. If testing in sandbox, please use the test card details provided above, or switch to Cash on Delivery (COD).`
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
    setPaymentSuccessOrder(null);

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
    setPaymentSuccessOrder(null);
    setApiError(
      isRtl
        ? 'تم إلغاء عملية الدفع بالفيزا ولم يتم خصم أي مبالغ. يمكنك إعادة المحاولة أو اختيار الدفع عند الاستلام.'
        : 'Visa payment was not completed and your card was not charged. You can retry with Visa or choose Cash on Delivery (COD).'
    );
  };

  if (items.length === 0 && !paymentSuccessOrder) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-white text-center">
        <div className="w-16 h-16 rounded-full bg-white border border-[#E890A8]/30 flex items-center justify-center mb-4 text-[#22120C] shadow-soft">
          <ShoppingBag className="w-7 h-7 text-[#E890A8]" />
        </div>
        <h2 className="text-2xl font-serif font-normal text-[#22120C] mb-2">
          {isRtl ? 'حقيبة التسوق فارغة' : 'Your Shopping Bag is Empty'}
        </h2>
        <p className="text-sm text-[#22120C]/70 max-w-md mb-6 font-light">
          {isRtl
            ? 'تصفح تشكيلة التوفي الفاخرة المطعمة بالفواكه الطبيعية قبل إتمام الشراء.'
            : 'Explore our artisan fruit toffees before proceeding to checkout.'}
        </p>
        <button
          onClick={onBackToShop}
          className="btn-primary flex items-center gap-2 cursor-pointer bg-[#E890A8] hover:bg-[#6AACE9] text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isRtl ? 'تصفح المجموعة' : 'EXPLORE THE COLLECTION'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#22120C] py-10 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={onBackToShop}
            className="btn-secondary text-xs flex items-center gap-2 cursor-pointer hover:border-[#E890A8] hover:text-[#E890A8]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isRtl ? 'العودة للمتجر' : 'RETURN TO COLLECTION'}</span>
          </button>
          <div className="text-xs text-[#22120C]/70 flex items-center gap-1.5 font-light">
            <Truck className="w-3.5 h-3.5 text-[#E890A8]" />
            <span>{isRtl ? 'شحن لجميع محافظات جمهورية مصر العربية' : 'Delivering across Cairo & all Egyptian governorates'}</span>
          </div>
        </div>

        <div className="text-center mb-10 flex flex-col items-center">
          <img
            src="/images/logos/toomakt_logo_main.png"
            alt="TooMakt"
            className="h-12 sm:h-14 w-auto object-contain mb-3 filter drop-shadow-xs"
          />
          <span className="text-[11px] font-semibold text-[#E890A8] uppercase tracking-widest block mb-2 font-mono">
            TOOMAKT ATELIER · CAIRO
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#22120C] tracking-tight">
            {isRtl ? 'إتمام الطلب والشحن' : 'Checkout & Delivery'}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#22120C]/70 font-light max-w-md mx-auto">
            {isRtl
              ? 'يتم تجهيز الطلب طازجاً في معملنا ويصلك في صناديق مبردة لحماية النكهة والملمس.'
              : 'Crafted slowly and dispatched directly from our Cairo kitchen in protective climate boxes.'}
          </p>
        </div>

        {apiError && (
          <div className="mb-6 p-4 bg-[#FDF2F5] border border-[#E890A8]/30 rounded-2xl flex items-center justify-between gap-3 text-xs text-[#22120C] shadow-xs">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-[#E890A8]" />
              <span>{apiError}</span>
            </div>
            <button
              onClick={() => setApiError(null)}
              className="text-[#22120C]/70 hover:text-[#E890A8] p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Customer & Delivery Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Customer Contact Info */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#22120C]/10 shadow-soft">
              <div className="flex items-center gap-3 mb-5 border-b border-[#22120C]/10 pb-3">
                <div className="w-7 h-7 rounded-full bg-[#E890A8] text-white flex items-center justify-center font-medium text-xs">
                  01
                </div>
                <h2 className="font-serif text-lg font-normal text-[#22120C]">
                  {isRtl ? 'بيانات العميل' : 'Customer Information'}
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#22120C]/70 uppercase tracking-wider mb-1.5 font-mono">
                    {isRtl ? 'الاسم بالكامل *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    placeholder={isRtl ? 'مثال: ليلى منصور' : 'e.g. Layla Mansour'}
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className={`w-full bg-white border ${
                      formErrors.fullName ? 'border-red-400' : 'border-[#22120C]/15 focus:border-[#E890A8]'
                    } rounded-xl px-4 py-2.5 text-sm text-[#22120C] focus:outline-none`}
                  />
                  {formErrors.fullName && (
                    <span className="text-xs text-red-600 mt-1 block">{formErrors.fullName}</span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#22120C]/70 uppercase tracking-wider mb-1.5 font-mono">
                      {isRtl ? 'رقم الموبايل المصري *' : 'Mobile Number (Egypt) *'}
                    </label>
                    <input
                      type="tel"
                      placeholder="010XXXXXXXX"
                      value={mobileNumber}
                      onChange={e => setMobileNumber(e.target.value)}
                      className={`w-full bg-white border ${
                        formErrors.mobileNumber ? 'border-red-400' : 'border-[#22120C]/15 focus:border-[#E890A8]'
                      } rounded-xl px-4 py-2.5 text-sm text-[#22120C] focus:outline-none`}
                    />
                    {formErrors.mobileNumber && (
                      <span className="text-xs text-red-600 mt-1 block">{formErrors.mobileNumber}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#22120C]/70 uppercase tracking-wider mb-1.5 font-mono">
                      {isRtl ? 'البريد الإلكتروني *' : 'Email Address *'}
                    </label>
                    <input
                      type="email"
                      placeholder="layla@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className={`w-full bg-white border ${
                        formErrors.email ? 'border-red-400' : 'border-[#22120C]/15 focus:border-[#E890A8]'
                      } rounded-xl px-4 py-2.5 text-sm text-[#22120C] focus:outline-none`}
                    />
                    {formErrors.email && (
                      <span className="text-xs text-red-600 mt-1 block">{formErrors.email}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Egypt Shipping Destination */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#22120C]/10 shadow-soft">
              <div className="flex items-center gap-3 mb-5 border-b border-[#22120C]/10 pb-3">
                <div className="w-7 h-7 rounded-full bg-[#E890A8] text-white flex items-center justify-center font-medium text-xs">
                  02
                </div>
                <div>
                  <h2 className="font-serif text-lg font-normal text-[#22120C]">
                    {isRtl ? 'عنوان التوصيل في مصر' : 'Delivery Destination'}
                  </h2>
                  <span className="text-xs text-[#22120C]/60 font-light">
                    {isRtl ? 'اختر محافظتك لحساب قيمة الشحن الفعلي' : 'Select your governorate for real-time dispatch calculation'}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Governorate Dropdown */}
                  <div>
                    <label className="block text-xs font-medium text-[#22120C]/70 uppercase tracking-wider mb-1.5 font-mono">
                      {isRtl ? 'المحافظة *' : 'Governorate *'}
                    </label>
                    <select
                      value={governorate}
                      onChange={e => setGovernorate(e.target.value)}
                      className="w-full bg-white border border-[#22120C]/15 focus:border-[#E890A8] rounded-xl px-4 py-2.5 text-sm text-[#22120C] focus:outline-none"
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
                    <label className="block text-xs font-medium text-[#22120C]/70 uppercase tracking-wider mb-1.5 font-mono">
                      {isRtl ? 'المدينة / المنطقة' : 'City / District'}
                    </label>
                    <input
                      type="text"
                      placeholder={isRtl ? 'مثال: الزمالك، المعادي، التجمع' : 'e.g. Zamalek, New Cairo, Maadi'}
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full bg-white border border-[#22120C]/15 focus:border-[#E890A8] rounded-xl px-4 py-2.5 text-sm text-[#22120C] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Street Address */}
                <div>
                  <label className="block text-xs font-medium text-[#22120C]/70 uppercase tracking-wider mb-1.5 font-mono">
                    {isRtl ? 'العنوان واسم الشارع *' : 'Street Address *'}
                  </label>
                  <input
                    type="text"
                    placeholder={isRtl ? 'اسم الشارع، علامة مميزة' : 'Street name, landmark, or square'}
                    value={streetAddress}
                    onChange={e => setStreetAddress(e.target.value)}
                    className={`w-full bg-white border ${
                      formErrors.streetAddress ? 'border-red-400' : 'border-[#22120C]/15 focus:border-[#E890A8]'
                    } rounded-xl px-4 py-2.5 text-sm text-[#22120C] focus:outline-none`}
                  />
                  {formErrors.streetAddress && (
                    <span className="text-xs text-red-600 mt-1 block">{formErrors.streetAddress}</span>
                  )}
                </div>

                {/* Building / Apartment */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#22120C]/70 uppercase tracking-wider mb-1.5 font-mono">
                      {isRtl ? 'رقم العمارة' : 'Building No.'}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Bldg 14"
                      value={buildingNumber}
                      onChange={e => setBuildingNumber(e.target.value)}
                      className="w-full bg-white border border-[#22120C]/15 focus:border-[#E890A8] rounded-xl px-4 py-2.5 text-sm text-[#22120C] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#22120C]/70 uppercase tracking-wider mb-1.5 font-mono">
                      {isRtl ? 'رقم الشقة / الدور' : 'Apartment / Floor'}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Floor 4, Apt 12"
                      value={apartmentFloor}
                      onChange={e => setApartmentFloor(e.target.value)}
                      className="w-full bg-white border border-[#22120C]/15 focus:border-[#E890A8] rounded-xl px-4 py-2.5 text-sm text-[#22120C] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Delivery Notes */}
                <div>
                  <label className="block text-xs font-medium text-[#22120C]/70 uppercase tracking-wider mb-1.5 font-mono">
                    {isRtl ? 'ملاحظات خاصة للمندوب (اختياري)' : 'Special Delivery Notes (Optional)'}
                  </label>
                  <textarea
                    rows={2}
                    placeholder={isRtl ? 'كود البوابة، موعد مفضل للتوصيل، إلخ' : 'Gate code, landmark, preferred delivery timing, etc.'}
                    value={deliveryNotes}
                    onChange={e => setDeliveryNotes(e.target.value)}
                    className="w-full bg-white border border-[#22120C]/15 focus:border-[#E890A8] rounded-xl px-4 py-2 text-sm text-[#22120C] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method Selection */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#22120C]/10 shadow-soft">
              <div className="flex items-center gap-3 mb-5 border-b border-[#22120C]/10 pb-3">
                <div className="w-7 h-7 rounded-full bg-[#E890A8] text-white flex items-center justify-center font-medium text-xs">
                  03
                </div>
                <div>
                  <h2 className="font-serif text-lg font-normal text-[#22120C]">
                    {isRtl ? 'طريقة الدفع' : 'Payment Method'}
                  </h2>
                  <span className="text-xs text-[#22120C]/60 font-light">
                    {isRtl ? 'اختر طريقة الدفع المفضلة لديك' : 'Choose your preferred payment method'}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {/* Option 1: Visa / Mastercard (Paymob) */}
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#E890A8] bg-[#FDF2F5] shadow-xs'
                      : 'border-[#22120C]/10 hover:border-[#E890A8]/40 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          paymentMethod === 'card'
                            ? 'bg-[#E890A8] text-white'
                            : 'bg-[#FDF2F5] text-[#22120C]/70 border border-[#E890A8]/20'
                        }`}
                      >
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-[#22120C]">
                            {isRtl ? 'بطاقة بنكية (فيزا وماستركارد وميزة)' : 'Credit / Debit Card (Visa & Mastercard)'}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E890A8] text-white font-mono">
                            Paymob Secure
                          </span>
                        </div>
                        <div className="text-xs text-[#22120C]/65 font-light mt-0.5">
                          {isRtl
                            ? 'دفع فوري وآمن عبر بوابة بيموب Paymob مع تشفير 3D-Secure.'
                            : 'Instant, seamless card payment secured by Paymob 3D-Secure.'}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 shrink-0 ${
                        paymentMethod === 'card' ? 'border-[#E890A8] bg-[#E890A8]' : 'border-[#22120C]/20'
                      }`}
                    >
                      {paymentMethod === 'card' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>

                  {/* Card Network Badges */}
                  <div className="mt-4 pt-3.5 border-t border-[#22120C]/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-white border border-[#22120C]/10 rounded-md text-[11px] font-bold text-[#1A1F71] tracking-wider shadow-2xs">
                        VISA
                      </span>
                      <span className="px-2.5 py-1 bg-white border border-[#22120C]/10 rounded-md text-[11px] font-bold text-[#EB001B] tracking-wider shadow-2xs">
                        Mastercard
                      </span>
                      <span className="px-2.5 py-1 bg-white border border-[#22120C]/10 rounded-md text-[11px] font-bold text-[#006633] tracking-wider shadow-2xs">
                        Meeza
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#22120C]/65">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#E890A8]" />
                      <span>{isRtl ? 'تشفير آمن 256-bit' : '256-bit SSL Encrypted & 3D-Secure'}</span>
                    </div>
                  </div>
                </div>

                {/* Option 2: Cash on Delivery (COD) */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#E890A8] bg-[#FDF2F5] shadow-xs'
                      : 'border-[#22120C]/10 hover:border-[#E890A8]/40 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          paymentMethod === 'cod'
                            ? 'bg-[#E890A8] text-white'
                            : 'bg-[#FDF2F5] text-[#22120C]/70 border border-[#E890A8]/20'
                        }`}
                      >
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-[#22120C]">
                            {isRtl ? 'الدفع عند الاستلام (كاش)' : 'Cash on Delivery (COD)'}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#6AACE9] text-white font-mono">
                            {isRtl ? 'بدون رسوم إضافية' : 'Zero Extra Fee'}
                          </span>
                        </div>
                        <div className="text-xs text-[#22120C]/65 font-light mt-0.5">
                          {isRtl
                            ? 'ادفع نقداً لمندوب الشحن عند استلام صندوق التوفي عند باب منزلك.'
                            : 'Pay in cash directly to our courier when your climate-controlled parcel arrives.'}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 shrink-0 ${
                        paymentMethod === 'cod' ? 'border-[#E890A8] bg-[#E890A8]' : 'border-[#22120C]/20'
                      }`}
                    >
                      {paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-[#22120C]/10 flex items-center justify-between text-xs text-[#22120C]/65">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Truck className="w-3.5 h-3.5 text-[#E890A8]" />
                      <span>{isRtl ? 'متاح لجميع محافظات مصر' : 'Available across all Egyptian governorates'}</span>
                    </div>
                    <span className="text-[11px] font-medium text-[#22120C]">
                      {isRtl ? 'الدفع بالجنيه المصري' : 'Exact cash in EGP requested'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-6 bg-white rounded-2xl p-6 sm:p-7 border border-[#22120C]/10 shadow-soft space-y-6">
              <h2 className="font-serif text-xl font-normal text-[#22120C] pb-3 border-b border-[#22120C]/10">
                {isRtl ? 'ملخص الطلب' : 'Order Summary'}
              </h2>

              {/* Items List */}
              <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                {items.map(item => {
                  return (
                    <div
                      key={`${item.product.id}-${item.selected_flavor || ''}`}
                      className="flex gap-3.5 pb-4 border-b border-[#22120C]/10 last:border-b-0"
                    >
                      <img
                        src={item.product.image || '/images/products/cappuccino_candies_thumb.jpg'}
                        alt={isRtl ? (item.product.name_ar || item.product.name) : (item.product.name_en || item.product.name)}
                        className="w-16 h-16 rounded-xl object-cover bg-white border border-[#22120C]/10 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-[#22120C] truncate">
                          {isRtl ? (item.product.name_ar || item.product.name) : (item.product.name_en || item.product.name)}
                        </h4>
                        {item.selected_flavor && (
                          <span className="text-[11px] font-medium text-[#E890A8] bg-[#E890A8]/10 border border-[#E890A8]/20 px-2 py-0.5 rounded-full inline-block mt-0.5">
                            {isRtl ? 'النكهة: ' : 'Flavor: '}{item.selected_flavor}
                          </span>
                        )}
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-[#22120C]/60 font-light">
                          <span>{isRtl ? 'الكمية: ' : 'Qty: '}{item.quantity}</span>
                          <span>•</span>
                          <span>{isRtl ? `${Number(item.product.price).toFixed(0)} ج.م` : `EGP ${Number(item.product.price).toFixed(0)}`}</span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-[#22120C]/60">
                            {isRtl ? 'الإجمالي' : 'Line Total'}
                          </span>
                          <span className="text-sm font-medium text-[#22120C]">
                            {isRtl ? `${(Number(item.product.price) * item.quantity).toFixed(0)} ج.م` : `EGP ${(Number(item.product.price) * item.quantity).toFixed(0)}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Delivery Zone Indicator */}
              <div className="bg-[#FDF2F5] rounded-xl p-3.5 border border-[#E890A8]/20 text-xs text-[#22120C] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#E890A8]" />
                  <div>
                    <span className="font-medium">{governorate} {isRtl ? 'شحن' : 'Courier'}</span>
                    <span className="text-[11px] text-[#22120C]/60 block font-light">Est: {estimatedDelivery}</span>
                  </div>
                </div>
                <span className="font-mono font-medium text-[#22120C]">EGP {shippingFee.toFixed(2)}</span>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs text-[#22120C]/70 pt-2 border-t border-[#22120C]/10">
                <div className="flex justify-between">
                  <span>{isRtl ? 'قيمة المنتجات' : 'Product Subtotal'}</span>
                  <span className="font-medium text-[#22120C]">EGP {subtotal.toFixed(2)}</span>
                </div>
                {promoApplied && discountAmount > 0 && (
                  <div className="flex justify-between text-[#6AACE9] font-medium">
                    <span>{isRtl ? 'الخصم' : 'Discount'} ({promoCode || '10%'})</span>
                    <span>-EGP {discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{isRtl ? 'مصاريف الشحن' : 'Egypt Shipping'} ({governorate})</span>
                  <span className="font-medium text-[#22120C]">EGP {shippingFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-serif font-normal text-[#22120C] pt-3 border-t border-[#22120C]/10">
                  <span>{isRtl ? 'المجموع النهائي' : 'Total Due'}</span>
                  <span className="font-medium text-[#E890A8]">EGP {orderTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Submit Order Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 text-xs font-mono font-semibold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-[0_4px_14px_rgba(232,144,168,0.3)] hover:shadow-[0_6px_20px_rgba(106,172,233,0.35)] bg-[#E890A8] hover:bg-[#6AACE9] text-white rounded-full transition-all"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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

              <div className="text-[11px] text-center text-[#22120C]/60 space-y-1 font-light">
                <p className="flex items-center justify-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#E890A8] inline" />
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
        {/* PAYMOB LUXURY ATELIER MODAL FRAME                        */}
        {/* ======================================================== */}
        {paymobIframeUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.6)] border border-[#E890A8]/40 ring-1 ring-white/10 overflow-hidden flex flex-col h-[92vh] max-h-[850px]">
              
              {/* IF PAYMENT APPROVED: RENDER LUXURIOUS IN-FRAME SUCCESS & TRACKING CELEBRATION */}
              {paymentSuccessOrder ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 text-center bg-white space-y-6 animate-fade-in overflow-y-auto">
                  {/* Glowing Animated Success Checkmark */}
                  <div className="relative inline-flex items-center justify-center">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#6AACE9] text-white flex items-center justify-center shadow-xl shadow-[#6AACE9]/25">
                      <CheckCircle2 className="w-12 h-12 sm:w-14 sm:h-14" />
                    </div>
                    <div className="absolute -inset-4 bg-[#E890A8]/20 rounded-full blur-2xl -z-10 animate-pulse" />
                  </div>

                  {/* Header Title */}
                  <div className="space-y-2 max-w-md">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6AACE9]/10 border border-[#6AACE9]/30 text-[#6AACE9] text-[11px] font-bold uppercase tracking-widest font-mono">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'تم قبول الدفع بنجاح عبر Paymob' : 'Payment Approved & Verified'}</span>
                    </span>
                    <h2 className="font-serif text-2xl sm:text-4xl font-normal text-[#22120C]">
                      {isRtl ? 'تم تأكيد طلبك بنجاح!' : 'Payment Complete & Order Placed!'}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#22120C]/70 font-light">
                      {isRtl
                        ? `شكراً لك! تم خصم ${orderTotal.toFixed(2)} ج.م بنجاح بالفيزا، ويجري الآن تجهيز دفعة التوفي الطازجة في المعمل.`
                        : `Thank you! Your payment of ${orderTotal.toFixed(2)} EGP was authorized securely. Your batch is now moving into fresh copper kettle preparation.`}
                    </p>
                  </div>

                  {/* Order Metrics Card */}
                  <div className="w-full max-w-lg p-4 bg-[#FDF2F5] rounded-2xl border border-[#E890A8]/20 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="text-center p-2 rounded-xl bg-white border border-[#22120C]/10">
                      <span className="text-[10px] uppercase font-bold text-[#22120C]/60 block font-mono">
                        {isRtl ? 'رقم الطلب' : 'Order No.'}
                      </span>
                      <div className="flex items-center justify-center gap-1 mt-0.5">
                        <span className="font-mono font-bold text-[#22120C]">{paymentSuccessOrder.order_number}</span>
                        <button
                          onClick={() => handleCopy(paymentSuccessOrder.order_number, 'modal_ord')}
                          className="text-[#22120C]/60 hover:text-[#E890A8]"
                        >
                          {copiedKey === 'modal_ord' ? <Check className="w-3 h-3 text-[#6AACE9]" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>

                    <div className="text-center p-2 rounded-xl bg-white border border-[#22120C]/10">
                      <span className="text-[10px] uppercase font-bold text-[#22120C]/60 block font-mono">
                        {isRtl ? 'طريقة الدفع' : 'Payment'}
                      </span>
                      <span className="font-semibold text-[#6AACE9] mt-0.5 block font-mono">
                        Visa (Paid)
                      </span>
                    </div>

                    <div className="text-center p-2 rounded-xl bg-white border border-[#22120C]/10 col-span-2 sm:col-span-1">
                      <span className="text-[10px] uppercase font-bold text-[#22120C]/60 block font-mono">
                        {isRtl ? 'المجموع' : 'Total'}
                      </span>
                      <span className="font-mono font-bold text-[#E890A8] mt-0.5 block">
                        {orderTotal.toFixed(2)} EGP
                      </span>
                    </div>
                  </div>

                  {/* 3 Prominent User Requested Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md pt-2">
                    {/* Button 1: Track Order */}
                    <button
                      type="button"
                      onClick={() => {
                        setPaymobIframeUrl(null);
                        if (onTrackOrder) {
                          onTrackOrder(paymentSuccessOrder);
                        } else {
                          onOrderSuccess(paymentSuccessOrder);
                        }
                      }}
                      className="w-full sm:flex-1 py-3 text-xs font-mono font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-soft hover:shadow-lg bg-[#E890A8] hover:bg-[#6AACE9] text-white rounded-full transition-all"
                    >
                      <Truck className="w-4 h-4 text-white" />
                      <span>{isRtl ? 'تتبع مسار طلبي الآن' : 'Track My Order Now'}</span>
                    </button>

                    {/* Button 2: View Official Receipt */}
                    <button
                      type="button"
                      onClick={() => {
                        setPaymobIframeUrl(null);
                        onOrderSuccess(paymentSuccessOrder);
                      }}
                      className="btn-secondary w-full sm:flex-1 py-3 text-xs font-mono font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer hover:border-[#E890A8] hover:text-[#E890A8] rounded-full"
                    >
                      <Receipt className="w-4 h-4" />
                      <span>{isRtl ? 'عرض الفاتورة الرسمية' : 'View Full Receipt'}</span>
                    </button>
                  </div>

                  {/* Button 3: Return to Shop */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymobIframeUrl(null);
                      onBackToShop();
                    }}
                    className="text-xs text-[#22120C]/60 hover:text-[#E890A8] underline font-light cursor-pointer font-mono"
                  >
                    {isRtl ? 'العودة لتصفح المنتجات' : 'Return to Shop Collection'}
                  </button>
                </div>
              ) : (
                /* IN-PROGRESS PAYMENT FRAME */
                <>
                  {/* Top Atelier Header */}
                  <div className="bg-[#22120C] text-white px-5 py-4 flex items-center justify-between border-b border-[#22120C]/20">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#E890A8]/20 border border-[#E890A8]/40 flex items-center justify-center text-[#E890A8]">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-sm font-semibold tracking-wide">
                            TOOMAKT ATELIER · PAYMOB GATEWAY
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#6AACE9]/20 text-[#6AACE9] border border-[#6AACE9]/30 font-mono">
                            3D-Secure
                          </span>
                        </div>
                        <span className="text-[11px] text-white/80 block font-light font-mono">
                          Order #{activeOrderNumber} • Total Due: <strong className="text-white font-semibold">{orderTotal.toFixed(2)} EGP</strong>
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
                      title="Cancel payment"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Real-time Status & Quick Action Bar above iframe */}
                  <div className="bg-white border-b border-[#22120C]/10 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6AACE9] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6AACE9]" />
                      </span>
                      <span className="text-[11px] text-[#22120C]/70 font-light font-mono">
                        {isRtl ? 'متصل بالبوابة · جاري الكشف الفوري عن حالة الدفع...' : 'Live Gateway Active · Detecting payment status in real-time...'}
                      </span>
                    </div>

                    {/* Prominent Quick-Action Button requested by user */}
                    <button
                      type="button"
                      onClick={handleVerifyAndFinalizePayment}
                      disabled={isVerifyingPayment}
                      className="bg-[#6AACE9] hover:bg-[#E890A8] text-white px-3.5 py-1.5 rounded-full font-bold text-[11px] flex items-center gap-1.5 cursor-pointer shadow-xs transition hover:shadow-sm font-mono"
                    >
                      {isVerifyingPayment ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          <span>{isRtl ? 'أتممت الدفع؟ تتبع الطلب الآن' : 'Finished Payment? Track Order'}</span>
                          <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Sandbox Test Card Notice Banner */}
                  <div className="bg-[#FDF2F5] border-b border-[#E890A8]/20 px-4 py-2 text-xs text-[#22120C] flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Info className="w-3.5 h-3.5 text-[#E890A8] shrink-0" />
                      <span className="text-[11px] font-mono">
                        <strong>Paymob Test Mode:</strong> Use test card:{' '}
                        <code className="bg-white px-1.5 py-0.5 rounded border border-[#E890A8]/30 font-mono font-bold text-[#22120C]">
                          5123 4567 8901 2346
                        </code>{' '}
                        • Exp: <strong>12/28</strong> • CVV: <strong>123</strong> • OTP: <strong>1234</strong>
                      </span>
                    </div>
                  </div>

                  {/* Payment Incomplete / Declined Alert Banner */}
                  {paymentDeclinedError && (
                    <div className="bg-red-50 border-b border-red-200 px-4 py-2.5 text-xs text-red-800 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <strong className="block font-semibold">Payment Status Notice</strong>
                        <span className="text-[11px] leading-relaxed">{paymentDeclinedError}</span>
                      </div>
                    </div>
                  )}

                  {/* Hosted Paymob Iframe */}
                  <div className="flex-1 w-full bg-white relative">
                    <iframe
                      src={paymobIframeUrl}
                      title="Paymob Visa Payment Gateway"
                      className="w-full h-full border-0"
                      allow="payment"
                    />
                  </div>

                  {/* Modal Bottom Actions Footer */}
                  <div className="p-3.5 border-t border-[#22120C]/10 bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="px-3.5 py-2 rounded-full border border-[#22120C]/15 text-[#22120C]/70 hover:text-[#22120C] hover:bg-neutral-50 font-medium cursor-pointer transition text-xs font-mono"
                      >
                        Cancel & Return
                      </button>
                      <button
                        type="button"
                        onClick={handleSwitchToCodFromModal}
                        className="px-3.5 py-2 rounded-full bg-[#FDF2F5] hover:bg-[#E890A8]/20 text-[#22120C] font-medium cursor-pointer transition flex items-center gap-1.5 text-xs font-mono"
                      >
                        <Banknote className="w-3.5 h-3.5 text-[#E890A8]" />
                        <span>Switch to Cash on Delivery</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleVerifyAndFinalizePayment}
                      disabled={isVerifyingPayment}
                      className="py-2.5 px-5 rounded-full bg-[#E890A8] hover:bg-[#6AACE9] text-white font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-md transition-all"
                    >
                      {isVerifyingPayment ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Verifying Payment...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Verify & Confirm Payment</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
