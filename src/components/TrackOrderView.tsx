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
  CreditCard,
  Printer,
  MessageCircle,
  Copy,
  ArrowLeft,
  ShoppingBag,
  AlertCircle,
  Phone,
  Mail,
} from 'lucide-react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

interface TrackOrderViewProps {
  initialOrderNumber?: string;
  onBackToShop?: () => void;
}

export const TrackOrderView: React.FC<TrackOrderViewProps> = ({ initialOrderNumber, onBackToShop }) => {
  const { isRtl } = useLanguage();
  const [orderQuery, setOrderQuery] = useState(initialOrderNumber || '');
  const [orderData, setOrderData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Auto-fetch if initialOrderNumber is passed
  useEffect(() => {
    if (initialOrderNumber && initialOrderNumber.trim()) {
      fetchOrder(initialOrderNumber.trim());
    }
  }, [initialOrderNumber]);

  const fetchOrder = async (queryNum: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await api.trackOrder(queryNum.trim());
      if (data) {
        setOrderData(data);
      } else {
        setErrorMsg(
          isRtl
            ? 'لم يتم العثور على الطلب. يرجى التأكد من رقم الطلب (مثال: ORD-2026-624503).'
            : 'Order not found. Please verify your order number (e.g. ORD-2026-624503).'
        );
      }
    } catch {
      setErrorMsg(isRtl ? 'حدث خطأ أثناء الاستعلام عن الطلب.' : 'Error querying order tracking server.');
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

  const isCard =
    orderData?.payment_method === 'card' ||
    orderData?.payment_method === 'visa' ||
    orderData?.payment_method === 'paymob' ||
    orderData?.payment_status === 'paid';

  const items: any[] = orderData?.items || [];
  const totalAmount = Number(orderData?.total_amount || 0).toFixed(2);
  const subtotal = Number(orderData?.subtotal || 0).toFixed(2);
  const shippingFee = Number(orderData?.shipping_fee || 50).toFixed(2);

  // WhatsApp Support Link
  const whatsappMsg = orderData
    ? `Hello Toomakt! I am tracking my order #${orderData.order_number}. Could you please update me on delivery timing?`
    : `Hello Toomakt! I have an inquiry about tracking my order.`;
  const whatsappUrl = `https://wa.me/201000000000?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-10 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        {onBackToShop && (
          <div className="flex items-center justify-between">
            <button
              onClick={onBackToShop}
              className="btn-secondary text-xs flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isRtl ? 'العودة للمتجر' : 'RETURN TO COLLECTION'}</span>
            </button>
            <div className="text-xs text-[#736B63] flex items-center gap-1.5 font-light">
              <Truck className="w-3.5 h-3.5 text-[#3C1322]" />
              <span>{isRtl ? 'تتبع مباشر للشحنات في كافة المحافظات' : 'Live courier dispatch across all governorates'}</span>
            </div>
          </div>
        )}

        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto">
          <span className="text-[11px] font-semibold text-[#736B63] uppercase tracking-widest block mb-2">
            {isRtl ? 'غرفة تتبع الطلبات الحية' : 'LIVE ATELIER TELEMETRY'}
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#1A1A1A] tracking-tight">
            {isRtl ? 'تتبع شحنة طلبك' : 'Track Your Confectionery Order'}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#736B63] font-light leading-relaxed">
            {isRtl
              ? 'تابع مراحل طهي التوفي في المراجل النحاسية وحتى خروج الصندوق المبرد مع المندوب.'
              : 'Monitor your fruit toffee from artisan copper kettles to protective climate doorstep delivery.'}
          </p>
        </div>

        {/* Search Bar Form */}
        <form onSubmit={handleTrack} className="max-w-xl mx-auto">
          <div className="flex items-center gap-2 p-1.5 bg-white border border-[#E8E2D7] rounded-full shadow-soft focus-within:border-[#1A1A1A] transition-colors">
            <div className="pl-4 text-[#736B63]">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder={isRtl ? 'أدخل رقم الطلب (مثال: ORD-2026-624503)' : 'ENTER ORDER # (e.g. ORD-2026-624503)'}
              value={orderQuery}
              onChange={e => setOrderQuery(e.target.value.toUpperCase())}
              className="flex-1 bg-transparent px-2 py-2 text-xs sm:text-sm text-[#1A1A1A] font-mono focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-primary py-2.5 px-6 text-xs font-semibold uppercase tracking-wider cursor-pointer disabled:opacity-50"
            >
              {loading ? (isRtl ? 'جاري البحث...' : 'LOCATING...') : (isRtl ? 'تتبع الطلب' : 'TRACK ORDER')}
            </button>
          </div>
        </form>

        {/* Error Alert */}
        {errorMsg && (
          <div className="max-w-xl mx-auto p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-800 flex items-center gap-3 shadow-xs">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Order Details & Tracking Card */}
        {orderData && (
          <div className="space-y-6 animate-fade-in">
            {/* Top Telemetry Header */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D7] shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E8E2D7]">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#3C1322] border border-[#E8E2D7]">
                      {isCard ? (
                        <span className="flex items-center gap-1 text-emerald-800">
                          <ShieldCheck className="w-3 h-3 text-emerald-600 inline" />
                          <span>{isRtl ? 'مدفوع بالفيزا (Paymob)' : 'Paid via Visa (Paymob)'}</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[#3C1322]">
                          <Banknote className="w-3 h-3 text-[#3C1322] inline" />
                          <span>{isRtl ? 'الدفع عند الاستلام (كاش)' : 'Cash on Delivery (COD)'}</span>
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                      {orderData.status?.toUpperCase() || 'PROCESSING'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#1A1A1A]">
                      #{orderData.order_number}
                    </h2>
                    <button
                      onClick={() => handleCopy(orderData.order_number, 'ord')}
                      className="text-[#736B63] hover:text-[#1A1A1A] p-1 cursor-pointer"
                      title="Copy Order Number"
                    >
                      {copiedKey === 'ord' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <p className="text-xs text-[#736B63] font-light mt-1">
                    {orderData.customer_name} • {orderData.governorate || 'Cairo'}, Egypt
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#736B63] block">
                    {isRtl ? 'إجمالي الطلب' : 'Total Amount'}
                  </span>
                  <span className="font-serif text-2xl font-normal text-[#3C1322] mt-0.5 block">
                    {totalAmount} EGP
                  </span>
                </div>
              </div>

              {/* 4-Step Interactive Atelier Timeline */}
              <div className="pt-6">
                <h3 className="font-serif text-base font-normal text-[#1A1A1A] mb-5">
                  {isRtl ? 'مسار الشحن والتسليم المباشر' : 'Live Fulfillment Telemetry'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Step 1: Confirmed */}
                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D7]">
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold mb-2.5 shadow-xs">
                      <Check className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
                      1. {isRtl ? 'تم تأكيد الطلب' : 'Order Confirmed'}
                    </h4>
                    <p className="text-[11px] text-[#736B63] font-light mt-1">
                      {isCard ? 'Payment verified securely by Paymob.' : 'Order queued for immediate preparation.'}
                    </p>
                  </div>

                  {/* Step 2: In Kitchen */}
                  <div className="p-4 rounded-2xl bg-[#3C1322]/5 border-2 border-[#3C1322]">
                    <div className="w-7 h-7 rounded-full bg-[#3C1322] text-[#FAF7F2] flex items-center justify-center text-xs font-bold mb-2.5 animate-pulse">
                      2
                    </div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#3C1322] flex items-center gap-1.5">
                      <span>2. {isRtl ? 'تجهيز الدفعة' : 'Atelier Batching'}</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                    </h4>
                    <p className="text-[11px] text-[#736B63] font-light mt-1">
                      {isRtl ? 'سحب التوفي في أواني النحاس بالفاكهة الطبيعية.' : 'Copper kettle pulling and flavor sealing.'}
                    </p>
                  </div>

                  {/* Step 3: Courier Packing */}
                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D7] opacity-80">
                    <div className="w-7 h-7 rounded-full bg-neutral-200 text-[#736B63] flex items-center justify-center text-xs font-bold mb-2.5">
                      3
                    </div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
                      3. {isRtl ? 'التغليف المبرد' : 'Climate Packing'}
                    </h4>
                    <p className="text-[11px] text-[#736B63] font-light mt-1">
                      {isRtl ? 'عزل حراري لحماية جودة الشحن حتى التسليم.' : 'Thermal protective boxes for delicate texture.'}
                    </p>
                  </div>

                  {/* Step 4: Doorstep Delivery */}
                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D7] opacity-80">
                    <div className="w-7 h-7 rounded-full bg-neutral-200 text-[#736B63] flex items-center justify-center text-xs font-bold mb-2.5">
                      4
                    </div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
                      4. {isRtl ? 'التوصيل للباب' : 'Doorstep Courier'}
                    </h4>
                    <p className="text-[11px] text-[#736B63] font-light mt-1">
                      {isRtl ? `توصيل سريع لمحافظة ${orderData.governorate || 'Cairo'}.` : `Direct express delivery across Egypt.`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items & Destination Details */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D7] shadow-soft space-y-6">
              <h3 className="font-serif text-lg font-normal text-[#1A1A1A] pb-3 border-b border-[#E8E2D7]">
                {isRtl ? 'تفاصيل محتويات الشحنة' : 'Package Contents & Destination'}
              </h3>

              {/* Items List */}
              <div className="space-y-4">
                {items.length > 0 ? (
                  items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-4 pb-4 border-b border-[#E8E2D7] last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8E2D7] flex items-center justify-center overflow-hidden shrink-0">
                          <Package className="w-5 h-5 text-[#3C1322]" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-[#1A1A1A]">{item.name}</h4>
                          <span className="text-xs text-[#736B63] font-light">
                            Qty: {item.quantity} × EGP {Number(item.unit_price).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-sm font-semibold text-[#1A1A1A]">
                        EGP {(Number(item.unit_price) * Number(item.quantity)).toFixed(2)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#736B63] font-light">
                    {isRtl ? 'مجموعة حلوى التوفي الفاخرة المعبأة يدوياً.' : 'Artisanal hand-crafted toffee collection.'}
                  </p>
                )}
              </div>

              {/* Destination & Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#E8E2D7] text-xs text-[#736B63]">
                <div className="space-y-2">
                  <span className="font-bold text-[10px] uppercase tracking-wider text-[#1A1A1A] block">
                    {isRtl ? 'عنوان التوصيل' : 'Delivery Destination'}
                  </span>
                  <p className="flex items-center gap-1.5 text-[#1A1A1A]">
                    <MapPin className="w-3.5 h-3.5 text-[#3C1322] shrink-0" />
                    <span>{orderData.shipping_address || `${orderData.governorate}, Egypt`}</span>
                  </p>
                  {orderData.customer_phone && (
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#3C1322] shrink-0" />
                      <span>{orderData.customer_phone}</span>
                    </p>
                  )}
                  {orderData.customer_email && (
                    <p className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#3C1322] shrink-0" />
                      <span>{orderData.customer_email}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-[10px] uppercase tracking-wider text-[#1A1A1A] block">
                    {isRtl ? 'الحساب المالي' : 'Financials'}
                  </span>
                  <div className="flex justify-between">
                    <span>{isRtl ? 'المنتجات' : 'Subtotal'}</span>
                    <span className="font-medium text-[#1A1A1A]">EGP {subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isRtl ? 'الشحن' : 'Shipping'} ({orderData.governorate})</span>
                    <span className="font-medium text-[#1A1A1A]">EGP {shippingFee}</span>
                  </div>
                  <div className="flex justify-between text-sm font-serif font-normal text-[#1A1A1A] pt-2 border-t border-[#E8E2D7]">
                    <span>{isRtl ? 'المجموع النهائي' : 'Total Due'}</span>
                    <span className="font-semibold text-[#3C1322]">EGP {totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Concierge & Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-semibold py-3 px-6 rounded-full flex items-center justify-center gap-2 shadow-sm transition hover:shadow-md cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>{isRtl ? 'تواصل مع خدمة العملاء على واتساب' : 'WhatsApp Atelier Support'}</span>
              </a>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => window.print()}
                  className="btn-secondary flex-1 sm:flex-initial text-xs py-3 px-5 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>{isRtl ? 'طباعة' : 'Print'}</span>
                </button>

                {onBackToShop && (
                  <button
                    onClick={onBackToShop}
                    className="btn-primary flex-1 sm:flex-initial text-xs py-3 px-6 flex items-center justify-center gap-2 cursor-pointer"
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
