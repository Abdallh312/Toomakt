import React, { useState, useEffect } from 'react';
import {
  Check,
  Search,
  Package,
  Truck,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
  Banknote,
  Printer,
  MessageCircle,
  Copy,
  ArrowLeft,
  ShoppingBag,
  AlertCircle,
  Phone,
  Mail,
  Calendar,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

interface TrackOrderViewProps {
  initialOrderNumber?: string;
  onBackToShop?: () => void;
}

export const TrackOrderView: React.FC<TrackOrderViewProps> = ({ initialOrderNumber, onBackToShop }) => {
  const { isRtl } = useLanguage();
  
  // Extract initial query only if explicitly provided in URL search params (?order=... or ?id=...)
  const getInitialQuery = () => {
    if (initialOrderNumber && initialOrderNumber.trim()) {
      return initialOrderNumber.trim();
    }
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlOrder = params.get('order') || params.get('q') || params.get('id');
      if (urlOrder) return urlOrder.trim();
    }
    return '';
  };

  const [orderQuery, setOrderQuery] = useState(getInitialQuery);
  const [orderData, setOrderData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Auto-fetch ONLY if a valid explicit query exists in the URL params
  useEffect(() => {
    const q = getInitialQuery();
    if (q) {
      fetchOrder(q);
    }
  }, [initialOrderNumber]);

  const fetchOrder = async (queryNum: string) => {
    if (!queryNum.trim()) return;
    setLoading(true);
    setErrorMsg(null);

    // Sync URL query without reloading
    try {
      const clean = queryNum.trim();
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('order', clean);
      window.history.replaceState({}, '', currentUrl.pathname + '?' + currentUrl.searchParams.toString());
    } catch {}

    try {
      const data = await api.trackOrder(queryNum.trim());
      if (data) {
        setOrderData(data);
      } else {
        setOrderData(null);
        setErrorMsg(
          isRtl
            ? 'لم يتم العثور على أي طلب مطابق. يرجى التحقق من رقم الطلب أو رقم الهاتف المسجل والمحاولة مرة أخرى.'
            : 'No matching order found. Please verify your order number or registered phone number.'
        );
      }
    } catch {
      setErrorMsg(isRtl ? 'حدث خطأ أثناء الاستعلام عن الطلب. يرجى المحاولة لاحقاً.' : 'Network error while connecting to tracking server.');
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;
    fetchOrder(orderQuery.trim());
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Determine active timeline step based on status
  const getFulfillmentStep = (status: string = ''): number => {
    const s = status.toLowerCase();
    if (['delivered', 'completed'].includes(s)) return 4;
    if (['shipped', 'out_for_delivery', 'dispatched', 'in_transit'].includes(s)) return 3;
    if (['kitchen', 'batching', 'processing', 'preparing', 'packed'].includes(s)) return 2;
    return 1; // pending, confirmed
  };

  const isCard =
    orderData?.payment_method === 'card' ||
    orderData?.payment_method === 'visa' ||
    orderData?.payment_method === 'paymob' ||
    orderData?.payment_status === 'paid';

  const items: any[] = orderData?.items || [];
  const totalAmount = Number(orderData?.total_amount || 0).toFixed(2);
  const subtotal = Number(orderData?.subtotal || 0).toFixed(2);
  const shippingFee = Number(orderData?.shipping_fee || 50).toFixed(2);
  const discountAmount = Number(orderData?.discount_amount || 0).toFixed(2);
  const currentStep = getFulfillmentStep(orderData?.status);

  const formattedDate = orderData?.created_at
    ? new Date(orderData.created_at).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '';

  // WhatsApp Support Link
  const whatsappMsg = orderData
    ? `Hello Toomakt! I am tracking my order #${orderData.order_number} (${orderData.customer_name}). Could you please update me on delivery status?`
    : `Hello Toomakt! I have an inquiry about tracking my order.`;
  const whatsappUrl = `https://wa.me/201024542139?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#120D11] py-10 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb (Hidden in Print) */}
        {onBackToShop && (
          <div className="no-print flex items-center justify-between">
            <button
              onClick={onBackToShop}
              className="btn-secondary text-xs flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isRtl ? 'العودة للمتجر' : 'RETURN TO COLLECTION'}</span>
            </button>
            <div className="text-xs text-[#736B63] dark:text-[#9C8E83] flex items-center gap-1.5 font-light">
              <Truck className="w-3.5 h-3.5 text-[#3C1322] dark:text-[#E8BD6D]" />
              <span>{isRtl ? 'تتبع مباشر للشحنات في كافة المحافظات المصرية' : 'Express climate dispatch across Egypt'}</span>
            </div>
          </div>
        )}

        {/* Section Header (Hidden in Print) */}
        <div className="no-print text-center max-w-xl mx-auto">
          <span className="text-[11px] font-semibold text-[#736B63] dark:text-[#9C8E83] uppercase tracking-widest block mb-2">
            {isRtl ? 'غرفة التتبع المباشر للطلبات' : 'LIVE ATELIER TELEMETRY'}
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#1A1A1A] dark:text-[#F7F3EC] tracking-tight">
            {isRtl ? 'تتبع مسار شحنة طلبك' : 'Track Your Confectionery Order'}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#736B63] dark:text-[#C8BEB5] font-light leading-relaxed">
            {isRtl
              ? 'تابع مراحل طهي التوفي في المراجل النحاسية وحتى وصول الصندوق المبرد إلى باب منزلك.'
              : 'Monitor your fruit toffee from artisan copper kettle batching to protective thermal delivery.'}
          </p>
        </div>

        {/* Search Bar Form (Hidden in Print) */}
        <div className="no-print space-y-3">
          <form onSubmit={handleTrack} className="max-w-xl mx-auto">
            <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-[#1B1419] border border-[#E8E2D7] dark:border-[#33242E] rounded-full shadow-soft focus-within:border-[#1A1A1A] dark:focus-within:border-[#E8BD6D] transition-colors">
              <div className="pl-4 text-[#736B63] dark:text-[#9C8E83]">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder={isRtl ? 'أدخل رقم الطلب أو رقم الهاتف المسجل...' : 'Enter your order number or phone number...'}
                value={orderQuery}
                onChange={e => setOrderQuery(e.target.value)}
                className="flex-1 bg-transparent px-2 py-2 text-xs sm:text-sm text-[#1A1A1A] dark:text-[#F7F3EC] font-mono focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading || !orderQuery.trim()}
                className="btn-primary py-2.5 px-6 text-xs font-semibold uppercase tracking-wider cursor-pointer disabled:opacity-50 transition shadow-soft"
              >
                {loading ? (isRtl ? 'جاري البحث...' : 'LOCATING...') : (isRtl ? 'تتبع الآن' : 'TRACK NOW')}
              </button>
            </div>
          </form>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="no-print max-w-xl mx-auto p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-2xl text-xs text-red-800 dark:text-red-300 flex items-center gap-3 shadow-xs animate-fade-in">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
            <div className="flex-1">
              <strong>{isRtl ? 'تعذر العثور على الطلب' : 'Order Not Found'}</strong>
              <p className="mt-0.5">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Order Details & Tracking Card */}
        {orderData && (
          <div className="space-y-6 animate-fade-in">
            {/* Top Telemetry Header */}
            <div className="bg-white dark:bg-[#1B1419] rounded-3xl p-6 sm:p-8 border border-[#E8E2D7] dark:border-[#33242E] shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E8E2D7] dark:border-[#33242E]">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FAF7F2] dark:bg-[#241A21] text-[#3C1322] dark:text-[#E8BD6D] border border-[#E8E2D7] dark:border-[#33242E]">
                      {isCard ? (
                        <span className="flex items-center gap-1 text-emerald-800 dark:text-emerald-400">
                          <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400 inline" />
                          <span>{isRtl ? 'مدفوع بالفيزا (Paymob 3D-Secure)' : 'Paid via Visa (Paymob 3D-Secure)'}</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[#3C1322] dark:text-[#E8BD6D]">
                          <Banknote className="w-3 h-3 text-[#3C1322] dark:text-[#E8BD6D] inline" />
                          <span>{isRtl ? 'الدفع عند الاستلام (كاش للمندوب)' : 'Cash on Delivery (COD)'}</span>
                        </span>
                      )}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                      orderData.status === 'delivered' || orderData.status === 'completed'
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                        : orderData.status === 'cancelled'
                        ? 'bg-red-100 dark:bg-red-950/60 text-red-900 dark:text-red-300 border-red-200 dark:border-red-800/60'
                        : 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800/60'
                    }`}>
                      {orderData.status?.toUpperCase() || 'PROCESSING'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#1A1A1A] dark:text-[#F7F3EC]">
                      #{orderData.order_number}
                    </h2>
                    <button
                      onClick={() => handleCopy(orderData.order_number, 'ord')}
                      className="text-[#736B63] dark:text-[#9C8E83] hover:text-[#1A1A1A] dark:hover:text-[#E8BD6D] p-1 cursor-pointer transition"
                      title="Copy Order Number"
                    >
                      {copiedKey === 'ord' ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <p className="text-xs text-[#736B63] dark:text-[#C8BEB5] font-light mt-1">
                    {orderData.customer_name} • {orderData.governorate || 'Cairo'}, Egypt {formattedDate ? `• ${formattedDate}` : ''}
                  </p>

                  {orderData.tracking_number && (
                    <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#3C1322] dark:text-[#E8BD6D] bg-[#FAF7F2] dark:bg-[#241A21] px-2.5 py-1 rounded-lg border border-[#E8E2D7] dark:border-[#33242E]">
                      <Truck className="w-3.5 h-3.5 text-[#3C1322] dark:text-[#E8BD6D]" />
                      <span>Tracking Ref: <strong>{orderData.tracking_number}</strong></span>
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#736B63] dark:text-[#9C8E83] block">
                    {isRtl ? 'إجمالي الطلب' : 'Total Amount'}
                  </span>
                  <span className="font-serif text-2xl font-normal text-[#3C1322] dark:text-[#E8BD6D] mt-0.5 block">
                    {totalAmount} EGP
                  </span>
                </div>
              </div>

              {/* 4-Step Dynamic Atelier Timeline */}
              <div className="pt-6">
                <h3 className="font-serif text-base font-normal text-[#1A1A1A] dark:text-[#F7F3EC] mb-5">
                  {isRtl ? 'مسار الشحن والتسليم المباشر' : 'Live Fulfillment Telemetry'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  
                  {/* Step 1: Confirmed */}
                  <div className={`p-4 rounded-2xl border transition-all ${
                    currentStep > 1
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40'
                      : currentStep === 1
                      ? 'bg-[#3C1322]/5 dark:bg-[#E8BD6D]/10 border-2 border-[#3C1322] dark:border-[#E8BD6D]'
                      : 'bg-[#FAF7F2] dark:bg-[#241A21] border-[#E8E2D7] dark:border-[#33242E] opacity-60'
                  }`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-2.5 shadow-xs ${
                      currentStep > 1
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#3C1322] dark:bg-[#E8BD6D] text-[#FAF7F2] dark:text-[#120D11]'
                    }`}>
                      {currentStep > 1 ? <Check className="w-4 h-4" /> : '1'}
                    </div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-[#F7F3EC] flex items-center gap-1.5">
                      <span>1. {isRtl ? 'تم تأكيد الطلب' : 'Order Confirmed'}</span>
                      {currentStep === 1 && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />}
                    </h4>
                    <p className="text-[11px] text-[#736B63] dark:text-[#C8BEB5] font-light mt-1">
                      {isCard ? 'Payment authorized & verified via Paymob.' : 'Order queued for fresh preparation.'}
                    </p>
                  </div>

                  {/* Step 2: In Kitchen */}
                  <div className={`p-4 rounded-2xl border transition-all ${
                    currentStep > 2
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40'
                      : currentStep === 2
                      ? 'bg-[#3C1322]/5 dark:bg-[#E8BD6D]/10 border-2 border-[#3C1322] dark:border-[#E8BD6D]'
                      : 'bg-[#FAF7F2] dark:bg-[#241A21] border-[#E8E2D7] dark:border-[#33242E] opacity-60'
                  }`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-2.5 ${
                      currentStep > 2
                        ? 'bg-emerald-600 text-white'
                        : currentStep === 2
                        ? 'bg-[#3C1322] dark:bg-[#E8BD6D] text-[#FAF7F2] dark:text-[#120D11] animate-pulse'
                        : 'bg-neutral-200 dark:bg-[#33242E] text-[#736B63] dark:text-[#9C8E83]'
                    }`}>
                      {currentStep > 2 ? <Check className="w-4 h-4" /> : '2'}
                    </div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-[#F7F3EC] flex items-center gap-1.5">
                      <span>2. {isRtl ? 'تجهيز الدفعة' : 'Atelier Batching'}</span>
                      {currentStep === 2 && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />}
                    </h4>
                    <p className="text-[11px] text-[#736B63] dark:text-[#C8BEB5] font-light mt-1">
                      {isRtl ? 'سحب التوفي في أواني النحاس بالفاكهة الطبيعية.' : 'Copper kettle pulling and flavor sealing.'}
                    </p>
                  </div>

                  {/* Step 3: Courier Packing */}
                  <div className={`p-4 rounded-2xl border transition-all ${
                    currentStep > 3
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40'
                      : currentStep === 3
                      ? 'bg-[#3C1322]/5 dark:bg-[#E8BD6D]/10 border-2 border-[#3C1322] dark:border-[#E8BD6D]'
                      : 'bg-[#FAF7F2] dark:bg-[#241A21] border-[#E8E2D7] dark:border-[#33242E] opacity-60'
                  }`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-2.5 ${
                      currentStep > 3
                        ? 'bg-emerald-600 text-white'
                        : currentStep === 3
                        ? 'bg-[#3C1322] dark:bg-[#E8BD6D] text-[#FAF7F2] dark:text-[#120D11] animate-pulse'
                        : 'bg-neutral-200 dark:bg-[#33242E] text-[#736B63] dark:text-[#9C8E83]'
                    }`}>
                      {currentStep > 3 ? <Check className="w-4 h-4" /> : '3'}
                    </div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-[#F7F3EC] flex items-center gap-1.5">
                      <span>3. {isRtl ? 'التغليف المبرد' : 'Climate Packing'}</span>
                      {currentStep === 3 && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />}
                    </h4>
                    <p className="text-[11px] text-[#736B63] dark:text-[#C8BEB5] font-light mt-1">
                      {isRtl ? 'عزل حراري لحماية جودة الشحن حتى التسليم.' : 'Thermal protective boxes for delicate texture.'}
                    </p>
                  </div>

                  {/* Step 4: Doorstep Delivery */}
                  <div className={`p-4 rounded-2xl border transition-all ${
                    currentStep === 4
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-2 border-emerald-600 text-emerald-900 dark:text-emerald-200'
                      : 'bg-[#FAF7F2] dark:bg-[#241A21] border-[#E8E2D7] dark:border-[#33242E] opacity-60'
                  }`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-2.5 ${
                      currentStep === 4
                        ? 'bg-emerald-600 text-white'
                        : 'bg-neutral-200 dark:bg-[#33242E] text-[#736B63] dark:text-[#9C8E83]'
                    }`}>
                      {currentStep === 4 ? <Check className="w-4 h-4" /> : '4'}
                    </div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-[#F7F3EC] flex items-center gap-1.5">
                      <span>4. {isRtl ? 'التوصيل للباب' : 'Doorstep Courier'}</span>
                      {currentStep === 4 && (
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold inline-flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>{isRtl ? 'تم التوصيل' : 'Delivered'}</span>
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] text-[#736B63] dark:text-[#C8BEB5] font-light mt-1">
                      {isRtl ? `توصيل سريع لمحافظة ${orderData.governorate || 'Cairo'}.` : `Direct express courier delivery across Egypt.`}
                    </p>
                  </div>

                </div>
              </div>

              {/* Custom Detailed Timeline Log (if order has timestamped timeline events) */}
              {Array.isArray(orderData.timeline) && orderData.timeline.length > 0 && (
                <div className="mt-6 pt-6 border-t border-[#E8E2D7] dark:border-[#33242E] space-y-3">
                  <h4 className="font-serif text-sm font-semibold text-[#1A1A1A] dark:text-[#F7F3EC]">
                    {isRtl ? 'سجل العمليات والتحركات بالتاريخ' : 'Atelier Dispatch Log'}
                  </h4>
                  <div className="space-y-2 text-xs">
                    {orderData.timeline.map((evt: any, i: number) => (
                      <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#241A21] border border-[#E8E2D7] dark:border-[#33242E]">
                        <Clock className="w-3.5 h-3.5 text-[#3C1322] dark:text-[#E8BD6D] shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <strong className="text-[#1A1A1A] dark:text-[#F7F3EC] block">{evt.title}</strong>
                          <span className="text-[#736B63] dark:text-[#C8BEB5] text-[11px]">{evt.desc}</span>
                        </div>
                        {evt.time && (
                          <span className="text-[10px] font-mono text-[#736B63] dark:text-[#9C8E83]">
                            {new Date(evt.time).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Order Items & Destination Details */}
            <div className="bg-white dark:bg-[#1B1419] rounded-3xl p-6 sm:p-8 border border-[#E8E2D7] dark:border-[#33242E] shadow-soft space-y-6">
              <h3 className="font-serif text-lg font-normal text-[#1A1A1A] dark:text-[#F7F3EC] pb-3 border-b border-[#E8E2D7] dark:border-[#33242E]">
                {isRtl ? 'تفاصيل محتويات الشحنة' : 'Package Contents & Destination'}
              </h3>

              {/* Items List */}
              <div className="space-y-4">
                {items.length > 0 ? (
                  items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-4 pb-4 border-b border-[#E8E2D7] dark:border-[#33242E] last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] dark:bg-[#241A21] border border-[#E8E2D7] dark:border-[#33242E] flex items-center justify-center overflow-hidden shrink-0">
                          <Package className="w-5 h-5 text-[#3C1322] dark:text-[#E8BD6D]" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-[#1A1A1A] dark:text-[#F7F3EC]">{item.name}</h4>
                          {item.flavor && (
                            <span className="text-[10px] text-[#3C1322] dark:text-[#E8BD6D] bg-[#FFD147]/20 dark:bg-[#E8BD6D]/20 border border-[#FFD147]/30 dark:border-[#E8BD6D]/30 px-1.5 py-0.2 rounded inline-block mt-0.5 font-medium">
                              {item.flavor}
                            </span>
                          )}
                          <span className="text-xs text-[#736B63] dark:text-[#C8BEB5] font-light block mt-0.5">
                            Qty: {item.quantity} × EGP {Number(item.unit_price).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-sm font-semibold text-[#1A1A1A] dark:text-[#F7F3EC]">
                        EGP {(Number(item.unit_price) * Number(item.quantity)).toFixed(2)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#736B63] dark:text-[#C8BEB5] font-light">
                    {isRtl ? 'مجموعة حلوى التوفي الفاخرة المعبأة يدوياً.' : 'Artisanal hand-crafted toffee collection.'}
                  </p>
                )}
              </div>

              {/* Destination & Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#E8E2D7] dark:border-[#33242E] text-xs text-[#736B63] dark:text-[#C8BEB5]">
                <div className="space-y-2">
                  <span className="font-bold text-[10px] uppercase tracking-wider text-[#1A1A1A] dark:text-[#F7F3EC] block">
                    {isRtl ? 'عنوان التوصيل' : 'Delivery Destination'}
                  </span>
                  <p className="flex items-center gap-1.5 text-[#1A1A1A] dark:text-[#F7F3EC]">
                    <MapPin className="w-3.5 h-3.5 text-[#3C1322] dark:text-[#E8BD6D] shrink-0" />
                    <span>
                      {orderData.shipping_address || `${orderData.governorate}, Egypt`}
                      {orderData.building_number ? ` · Bldg ${orderData.building_number}` : ''}
                      {orderData.apartment_floor ? ` · Apt ${orderData.apartment_floor}` : ''}
                    </span>
                  </p>
                  {orderData.customer_phone && (
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#3C1322] dark:text-[#E8BD6D] shrink-0" />
                      <span>{orderData.customer_phone}</span>
                    </p>
                  )}
                  {orderData.customer_email && (
                    <p className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#3C1322] dark:text-[#E8BD6D] shrink-0" />
                      <span>{orderData.customer_email}</span>
                    </p>
                  )}
                  {orderData.delivery_notes && (
                    <p className="text-[11px] italic bg-[#FAF7F2] dark:bg-[#241A21] p-2 rounded-lg border border-[#E8E2D7] dark:border-[#33242E] text-[#736B63] dark:text-[#C8BEB5]">
                      Note: {orderData.delivery_notes}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-[10px] uppercase tracking-wider text-[#1A1A1A] dark:text-[#F7F3EC] block">
                    {isRtl ? 'الحساب المالي' : 'Financials'}
                  </span>
                  <div className="flex justify-between">
                    <span>{isRtl ? 'المنتجات' : 'Subtotal'}</span>
                    <span className="font-medium text-[#1A1A1A] dark:text-[#F7F3EC]">EGP {subtotal}</span>
                  </div>
                  {Number(discountAmount) > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                      <span>{isRtl ? 'الخصم' : 'Discount'}</span>
                      <span>-EGP {discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>{isRtl ? 'الشحن' : 'Shipping'} ({orderData.governorate || 'Cairo'})</span>
                    <span className="font-medium text-[#1A1A1A] dark:text-[#F7F3EC]">EGP {shippingFee}</span>
                  </div>
                  <div className="flex justify-between text-sm font-serif font-normal text-[#1A1A1A] dark:text-[#F7F3EC] pt-2 border-t border-[#E8E2D7] dark:border-[#33242E]">
                    <span>{isRtl ? 'المجموع النهائي' : 'Total Due'}</span>
                    <span className="font-semibold text-[#3C1322] dark:text-[#E8BD6D]">EGP {totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Concierge & Action Bar (Hidden in Print) */}
            <div className="no-print flex flex-wrap items-center justify-between gap-4 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-semibold py-3.5 px-6 rounded-full flex items-center justify-center gap-2 shadow-sm transition hover:shadow-md cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>{isRtl ? 'تواصل مع خدمة العملاء على واتساب' : 'WhatsApp Atelier Support'}</span>
              </a>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => window.print()}
                  className="btn-secondary flex-1 sm:flex-initial text-xs py-3.5 px-5 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>{isRtl ? 'طباعة' : 'Print'}</span>
                </button>

                {onBackToShop && (
                  <button
                    onClick={onBackToShop}
                    className="btn-primary flex-1 sm:flex-initial text-xs py-3.5 px-6 flex items-center justify-center gap-2 cursor-pointer shadow-soft"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{isRtl ? 'تصفح المزيد' : 'SHOP COLLECTION'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
