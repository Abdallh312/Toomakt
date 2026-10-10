import React, { useState } from 'react';
import {
  CheckCircle2,
  Printer,
  MessageCircle,
  ShoppingBag,
  Truck,
  Clock,
  MapPin,
  Package,
  Receipt,
  Mail,
  ShieldCheck,
  Copy,
  Check,
  Phone,
  ArrowLeft,
  Eye,
  X,
  FileText,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface OrderSuccessViewProps {
  order: any;
  onContinueShopping: () => void;
  onTrackOrder?: (orderNumber: string) => void;
}

export const OrderSuccessView: React.FC<OrderSuccessViewProps> = ({
  order,
  onContinueShopping,
  onTrackOrder,
}) => {
  const { isRtl } = useLanguage();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-[#FAF7F2] text-center font-sans">
        <div className="w-16 h-16 rounded-full bg-white border border-[#E8E2D7] flex items-center justify-center mb-4 text-[#1A1A1A] shadow-soft">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-serif font-normal text-[#1A1A1A] mb-2">
          {isRtl ? 'لا يوجد طلب نشط حالياً' : 'No Active Order Found'}
        </h2>
        <p className="text-sm text-[#736B63] max-w-md mb-6 font-light">
          {isRtl
            ? 'لم يتم العثور على جلسة طلب نشطة. يمكنك تصفح تشكيلتنا الحرفية من التوفي الفاخر.'
            : 'Explore our artisan confectionery collection and discover fresh fruit toffees.'}
        </p>
        <button
          onClick={onContinueShopping}
          className="btn-primary flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isRtl ? 'العودة للمتجر' : 'RETURN TO COLLECTION'}</span>
        </button>
      </div>
    );
  }

  const orderNumber = order.order_number || 'ORD-2026-000000';
  const customerName = order.customer_name || 'Valued Customer';
  const customerPhone = order.customer_phone || '';
  const customerEmail = order.customer_email || '';
  const governorate = order.governorate || 'Cairo';
  const shippingAddress = order.shipping_address || `${governorate}, Egypt`;
  const buildingNumber = order.building_number || '';
  const apartmentFloor = order.apartment_floor || '';
  const deliveryNotes = order.delivery_notes || '';
  
  const totalAmount = Number(order.total_amount || 0).toFixed(2);
  const subtotal = Number(order.subtotal || 0).toFixed(2);
  const shippingFee = Number(order.shipping_fee || 50).toFixed(2);
  const discountAmount = Number(order.discount_amount || 0).toFixed(2);
  
  const orderDate = order.created_at ? new Date(order.created_at) : new Date();
  const formattedDate = orderDate.toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = orderDate.toLocaleTimeString(isRtl ? 'ar-EG' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Payment Method: 'card' (Visa / Mastercard via Paymob) or 'cod' (Cash on Delivery)
  const isCard = order.payment_method === 'card' || order.payment_method === 'visa' || order.payment_method === 'paymob' || order.payment_status === 'paid';
  const items: any[] = order.items || [];

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // WhatsApp Support Link
  const whatsappMsg = `Hello Toomakt! I just placed order #${orderNumber} (${totalAmount} EGP via ${isCard ? 'Visa' : 'Cash on Delivery'}). Please let me know when it dispatches!`;
  const whatsappUrl = `https://wa.me/201024542139?text=${encodeURIComponent(whatsappMsg)}`;

  // Print invoice handler
  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. ON-SCREEN INTERACTIVE SHOPPING & CELEBRATION VIEW (.screen-only)        */}
      {/* ========================================================================= */}
      <div className="screen-only min-h-screen bg-[#FAF7F2] dark:bg-[#120D11] py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* HERO SUCCESS HEADER CARD */}
          <div className="bg-white dark:bg-[#1B1419] rounded-3xl border border-[#E8E2D7] dark:border-[#33242E] shadow-soft overflow-hidden text-center relative">
            <div className={`h-2 w-full ${isCard ? 'bg-[#3C1322] dark:bg-[#E8BD6D]' : 'bg-[#E8BD6D]'}`} />

            <div className="p-8 sm:p-12 relative z-10">
              {/* Brand Logo */}
              <div className="mb-5">
                <img
                  src="/images/logos/toomakt_logo_main.png"
                  alt="TooMakt"
                  className="h-10 sm:h-12 w-auto object-contain mx-auto filter drop-shadow-xs"
                />
              </div>

              {/* Glowing Icon Badge */}
              <div className="relative inline-flex items-center justify-center mb-6">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 ${
                    isCard
                      ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                      : 'bg-[#3C1322] dark:bg-[#241A21] text-[#FAF7F2] dark:text-[#E8BD6D] shadow-[#3C1322]/20'
                  }`}
                >
                  {isCard ? (
                    <CheckCircle2 className="w-10 h-10" />
                  ) : (
                    <Package className="w-10 h-10 text-[#E8BD6D]" />
                  )}
                </div>
                <div className="absolute -inset-3 bg-[#E8BD6D]/20 rounded-full blur-xl -z-10" />
              </div>

              {/* Status Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest mb-3 border bg-[#FAF7F2] dark:bg-[#241A21] border-[#E8E2D7] dark:border-[#33242E]">
                {isCard ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-800 dark:text-emerald-300">
                      {isRtl ? 'تم الدفع بالفيزا عبر Paymob 3D-Secure' : 'Visa Payment Verified · Paymob 3D-Secure'}
                    </span>
                  </>
                ) : (
                  <>
                    <Package className="w-3.5 h-3.5 text-[#3C1322] dark:text-[#E8BD6D]" />
                    <span className="text-[#3C1322] dark:text-[#E8BD6D]">
                      {isRtl ? 'الدفع عند الاستلام (كاش للمندوب)' : 'Cash on Delivery · Due Upon Arrival'}
                    </span>
                  </>
                )}
              </div>

              {/* Main Title */}
              <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#1A1A1A] dark:text-[#F7F3EC] tracking-tight mb-3">
                {isCard
                  ? (isRtl ? 'تم تأكيد الدفع واستلام طلبك!' : 'Payment Verified & Order Confirmed!')
                  : (isRtl ? 'تم استلام طلبك بنجاح!' : 'Thank you for your order!')}
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-[#736B63] dark:text-[#C8BEB5] font-light max-w-xl mx-auto leading-relaxed">
                {isCard
                  ? (isRtl
                      ? `شكراً لك ${customerName}! تم التحقق من سداد مبلغ ${totalAmount} ج.م بالفيزا بنجاح، وبدأ صانعو الحلوى في تجهيز دفعتك الطازجة.`
                      : `Thank you, ${customerName}! Your payment of ${totalAmount} EGP was verified securely by Paymob. Our master confectioners have begun hand-pulling your batch.`)
                  : (isRtl
                      ? `شكراً لك ${customerName}! تم تسجيل طلبك برقم #${orderNumber}. يرجى تجهيز مبلغ ${totalAmount} ج.م نقداً لمندوب الشحن عند الاستلام.`
                      : `Thank you, ${customerName}! Your order #${orderNumber} is confirmed. Please have exact cash of ${totalAmount} EGP ready for our courier upon delivery.`)}
              </p>

              {/* Quick Metrics Bar */}
              <div className="mt-8 pt-8 border-t border-[#E8E2D7] dark:border-[#33242E] grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-[#FAF7F2] dark:bg-[#241A21] rounded-2xl border border-[#E8E2D7] dark:border-[#33242E]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#736B63] dark:text-[#9C8E83] block">
                    {isRtl ? 'رقم الطلب' : 'Order No.'}
                  </span>
                  <div className="flex items-center justify-center gap-1.5 mt-1">
                    <span className="font-mono text-xs sm:text-sm font-semibold text-[#1A1A1A] dark:text-[#F7F3EC]">
                      {orderNumber}
                    </span>
                    <button
                      onClick={() => handleCopy(orderNumber, 'ord')}
                      className="text-[#736B63] dark:text-[#9C8E83] hover:text-[#1A1A1A] dark:hover:text-[#E8BD6D] cursor-pointer"
                      title="Copy Order Number"
                    >
                      {copiedKey === 'ord' ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-[#FAF7F2] dark:bg-[#241A21] rounded-2xl border border-[#E8E2D7] dark:border-[#33242E]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#736B63] dark:text-[#9C8E83] block">
                    {isRtl ? 'طريقة الدفع' : 'Payment Method'}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-[#1A1A1A] dark:text-[#F7F3EC] mt-1 block">
                    {isCard ? 'Visa (Paymob)' : 'Cash on Delivery'}
                  </span>
                </div>

                <div className="p-3 bg-[#FAF7F2] dark:bg-[#241A21] rounded-2xl border border-[#E8E2D7] dark:border-[#33242E]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#736B63] dark:text-[#9C8E83] block">
                    {isRtl ? 'المحافظة' : 'Governorate'}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-[#1A1A1A] dark:text-[#F7F3EC] mt-1 block">
                    {governorate}
                  </span>
                </div>

                <div className="p-3 bg-[#FAF7F2] dark:bg-[#241A21] rounded-2xl border border-[#E8E2D7] dark:border-[#33242E]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#736B63] dark:text-[#9C8E83] block">
                    {isRtl ? 'المبلغ الإجمالي' : 'Total Amount'}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-[#3C1322] dark:text-[#E8BD6D] mt-1 block">
                    {totalAmount} EGP
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ARTISAN ATELIER JOURNEY (STATUS TIMELINE) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D7] shadow-soft">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#E8E2D7]">
              <Clock className="w-5 h-5 text-[#3C1322]" />
              <div>
                <h2 className="font-serif text-lg font-normal text-[#1A1A1A]">
                  {isRtl ? 'مراحل تجهيز وتوصيل الطلب' : 'Atelier Dispatch Journey'}
                </h2>
                <span className="text-xs text-[#736B63] font-light">
                  {isRtl ? 'نعتني بكل تفصيلة من المطبخ وحتى باب منزلك' : 'Crafted with patient European technique and protective climate packing'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              {/* Step 1: Confirmed */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D7] relative">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold mb-3 shadow-xs">
                  <Check className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                  1. {isRtl ? 'تم تأكيد الطلب' : 'Order Confirmed'}
                </h4>
                <p className="text-[11px] text-[#736B63] font-light mt-1">
                  {isCard ? 'Payment authorized & verified via Paymob.' : 'Order queued for immediate preparation.'}
                </p>
              </div>

              {/* Step 2: In Kitchen */}
              <div className="p-4 rounded-2xl bg-[#3C1322]/5 border-2 border-[#3C1322] relative">
                <div className="w-7 h-7 rounded-full bg-[#3C1322] text-[#FAF7F2] flex items-center justify-center text-xs font-bold mb-3 animate-pulse">
                  2
                </div>
                <h4 className="text-xs font-bold text-[#3C1322] uppercase tracking-wider flex items-center gap-1.5">
                  <span>2. {isRtl ? 'تجهيز الدفعة' : 'Atelier Preparation'}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                </h4>
                <p className="text-[11px] text-[#736B63] font-light mt-1">
                  {isRtl ? 'سحب التوفي في أواني النحاس وتعبئته يدوياً.' : 'Fresh copper kettle pulling and wax pouch sealing.'}
                </p>
              </div>

              {/* Step 3: Courier Dispatch */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D7] relative opacity-75">
                <div className="w-7 h-7 rounded-full bg-neutral-200 text-[#736B63] flex items-center justify-center text-xs font-bold mb-3">
                  3
                </div>
                <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                  3. {isRtl ? 'صندوق الشحن المبرد' : 'Climate Dispatch'}
                </h4>
                <p className="text-[11px] text-[#736B63] font-light mt-1">
                  {isRtl ? 'تغليف عازل للحرارة لحماية جودة الشحن.' : 'Insulated thermal boxes protecting delicate texture.'}
                </p>
              </div>

              {/* Step 4: Doorstep Delivery */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D7] relative opacity-75">
                <div className="w-7 h-7 rounded-full bg-neutral-200 text-[#736B63] flex items-center justify-center text-xs font-bold mb-3">
                  4
                </div>
                <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                  4. {isRtl ? 'التسليم عند بابك' : 'Doorstep Arrival'}
                </h4>
                <p className="text-[11px] text-[#736B63] font-light mt-1">
                  {isRtl ? `توصيل سريع لمحافظة ${governorate}.` : `Direct courier delivery in ${governorate}.`}
                </p>
              </div>
            </div>
          </div>

          {/* OFFICIAL ORDER RECEIPT & SUMMARY CARD */}
          <div className="bg-white dark:bg-[#1B1419] rounded-3xl p-6 sm:p-8 border border-[#E8E2D7] dark:border-[#33242E] shadow-soft space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E8E2D7] dark:border-[#33242E]">
              <div className="flex items-center gap-3">
                <Receipt className="w-5 h-5 text-[#3C1322] dark:text-[#E8BD6D]" />
                <h2 className="font-serif text-lg font-normal text-[#1A1A1A] dark:text-[#F7F3EC]">
                  {isRtl ? 'تفاصيل الفاتورة الرسمية' : 'Official Order Receipt'}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowInvoiceModal(true)}
                  className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer"
                  title="Preview Invoice"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'معاينة الفاتورة' : 'Preview Invoice'}</span>
                </button>
                <button
                  onClick={handlePrintReceipt}
                  className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 cursor-pointer shadow-soft"
                  title="Print Official Invoice"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'طباعة / حفظ PDF' : 'Print / Save PDF'}</span>
                </button>
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-4">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-4 pb-4 border-b border-[#E8E2D7] dark:border-[#33242E] last:border-b-0"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-xl bg-[#FAF7F2] dark:bg-[#241A21] border border-[#E8E2D7] dark:border-[#33242E] flex items-center justify-center overflow-hidden shrink-0">
                      <img
                        src={item.image || '/images/products/mango_sunbeam.jpg'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-[#1A1A1A] dark:text-[#F7F3EC]">
                        {item.name}
                      </h4>
                      {item.flavor && (
                        <span className="text-[11px] font-medium text-[#3C1322] dark:text-[#E8BD6D] bg-[#FFD147]/25 dark:bg-[#E8BD6D]/20 border border-[#FFD147]/40 dark:border-[#E8BD6D]/30 px-2 py-0.5 rounded-full inline-block mt-0.5">
                          {isRtl ? 'النكهة: ' : 'Flavor: '}{item.flavor}
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
              ))}
            </div>

            {/* Pricing Math & Destination */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#E8E2D7] dark:border-[#33242E]">
              {/* Delivery Details */}
              <div className="space-y-2 text-xs text-[#736B63] dark:text-[#C8BEB5]">
                <span className="font-bold text-[10px] uppercase tracking-wider text-[#1A1A1A] dark:text-[#F7F3EC] block mb-1">
                  {isRtl ? 'بيانات المستلم والشحن' : 'Recipient & Delivery Details'}
                </span>
                <p className="flex items-center gap-1.5 text-[#1A1A1A] dark:text-[#F7F3EC]">
                  <MapPin className="w-3.5 h-3.5 text-[#3C1322] dark:text-[#E8BD6D] shrink-0" />
                  <span>{shippingAddress} {buildingNumber ? `· Bldg ${buildingNumber}` : ''} {apartmentFloor ? `· Apt ${apartmentFloor}` : ''}</span>
                </p>
                {customerPhone && (
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#3C1322] dark:text-[#E8BD6D] shrink-0" />
                    <span>{customerPhone}</span>
                  </p>
                )}
                {customerEmail && (
                  <p className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#3C1322] dark:text-[#E8BD6D] shrink-0" />
                    <span>{customerEmail}</span>
                  </p>
                )}
              </div>

              {/* Financial Summary */}
              <div className="space-y-2 text-xs text-[#736B63] dark:text-[#C8BEB5]">
                <div className="flex justify-between">
                  <span>{isRtl ? 'قيمة المنتجات' : 'Subtotal'}</span>
                  <span className="font-medium text-[#1A1A1A] dark:text-[#F7F3EC]">EGP {subtotal}</span>
                </div>
                {Number(discountAmount) > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                    <span>{isRtl ? 'الخصم' : 'Discount'}</span>
                    <span>-EGP {discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{isRtl ? 'الشحن' : 'Shipping'} ({governorate})</span>
                  <span className="font-medium text-[#1A1A1A] dark:text-[#F7F3EC]">EGP {shippingFee}</span>
                </div>
                <div className="flex justify-between text-base font-serif font-normal text-[#1A1A1A] dark:text-[#F7F3EC] pt-3 border-t border-[#E8E2D7] dark:border-[#33242E]">
                  <span>{isRtl ? 'المجموع النهائي' : 'Total Amount'}</span>
                  <span className="font-semibold text-[#3C1322] dark:text-[#E8BD6D]">EGP {totalAmount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ON-SCREEN ACTIONS */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {onTrackOrder && (
                <button
                  onClick={() => onTrackOrder(orderNumber)}
                  className="btn-primary w-full sm:w-auto text-xs py-3.5 px-6 flex items-center justify-center gap-2 cursor-pointer shadow-soft hover:shadow-lg"
                >
                  <Truck className="w-4 h-4 text-[#E8BD6D] dark:text-[#120D11]" />
                  <span>{isRtl ? 'تتبع مسار الطلب مباشرة' : 'TRACK THIS ORDER LIVE'}</span>
                </button>
              )}

              <button
                onClick={onContinueShopping}
                className="btn-secondary w-full sm:w-auto text-xs py-3.5 px-6 flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isRtl ? 'العودة للتسوق والمزيد' : 'CONTINUE SHOPPING'}</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handlePrintReceipt}
                className="btn-secondary flex-1 sm:flex-initial text-xs py-3.5 px-5 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>{isRtl ? 'طباعة الفاتورة' : 'Print Invoice'}</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-semibold py-3.5 px-6 rounded-full flex items-center justify-center gap-2 shadow-sm transition hover:shadow-md cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>{isRtl ? 'تواصل عبر واتساب' : 'WhatsApp Atelier'}</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DEDICATED OFFICIAL PRINTABLE INVOICE (.print-only / .printable-invoice) */}
      {/* This renders exclusively during window.print() on a single crisp A4 page  */}
      {/* ========================================================================= */}
      <div className="print-only printable-invoice bg-white text-[#1A1A1A] p-8 max-w-3xl mx-auto font-sans">
        <div className="border border-[#1A1A1A] p-6 space-y-6">
          
          {/* Atelier Invoice Header */}
          <div className="flex items-start justify-between border-b-2 border-[#1A1A1A] pb-5">
            <div className="flex items-center gap-3">
              <img
                src="/images/logos/toomakt_logo_main.png"
                alt="TOOMAKT"
                className="h-10 w-auto object-contain"
              />
              <div>
                <span className="font-serif text-3xl font-bold tracking-tight text-[#3C1322] block leading-none">
                  TOOMAKT
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-[#736B63] block mt-1">
                  Atelier du Toffee · Cairo
                </span>
                <span className="text-xs text-[#1A1A1A] font-medium block mt-1">
                  Official Purchase & Delivery Invoice · فاتورة رسمية
                </span>
              </div>
            </div>

            <div className="text-right space-y-1">
              <span className="inline-block px-3 py-1 rounded bg-[#FAF7F2] border border-[#1A1A1A] text-xs font-mono font-bold">
                {orderNumber}
              </span>
              <div className="text-[11px] text-[#736B63] space-y-0.5 mt-1">
                <div>Date: <strong className="text-[#1A1A1A] font-semibold">{formattedDate}</strong></div>
                <div>Time: <strong className="text-[#1A1A1A] font-semibold">{formattedTime}</strong></div>
                <div>Status:{' '}
                  <strong className={isCard ? 'text-emerald-700 font-bold' : 'text-[#3C1322] font-bold'}>
                    {isCard ? 'PAID · VISA 3D-SECURE' : 'PENDING · CASH ON DELIVERY'}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Client & Destination 2-Column Info */}
          <div className="grid grid-cols-2 gap-6 text-xs border-b border-[#E8E2D7] pb-5">
            <div className="space-y-1 bg-[#FAF7F2] p-3 rounded border border-[#E8E2D7]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#736B63] block">
                Customer / Billed To
              </span>
              <div className="font-bold text-sm text-[#1A1A1A]">{customerName}</div>
              {customerPhone && <div className="text-[#736B63]">Phone: <strong className="text-[#1A1A1A]">{customerPhone}</strong></div>}
              {customerEmail && <div className="text-[#736B63]">Email: <strong className="text-[#1A1A1A]">{customerEmail}</strong></div>}
            </div>

            <div className="space-y-1 bg-[#FAF7F2] p-3 rounded border border-[#E8E2D7]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#736B63] block">
                Delivery Destination
              </span>
              <div className="font-bold text-sm text-[#1A1A1A]">{governorate}, Egypt</div>
              <div className="text-[#736B63]">{shippingAddress}</div>
              {(buildingNumber || apartmentFloor) && (
                <div className="text-[#736B63]">
                  {buildingNumber ? `Bldg ${buildingNumber}` : ''} {apartmentFloor ? `· Apt ${apartmentFloor}` : ''}
                </div>
              )}
              {deliveryNotes && <div className="text-[10px] italic text-[#736B63]">Notes: {deliveryNotes}</div>}
            </div>
          </div>

          {/* Itemized Confectionery Table */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#736B63] block">
              Itemized Confectionery Batch
            </span>
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-[#1A1A1A] bg-[#FAF7F2] text-[#1A1A1A] text-left">
                  <th className="py-2 px-2.5 font-bold">#</th>
                  <th className="py-2 px-2.5 font-bold">Item Description & Flavor</th>
                  <th className="py-2 px-2.5 font-bold text-center">Qty</th>
                  <th className="py-2 px-2.5 font-bold text-right">Unit Price</th>
                  <th className="py-2 px-2.5 font-bold text-right">Total (EGP)</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => (
                  <tr key={idx} className="border-b border-[#E8E2D7]">
                    <td className="py-2 px-2.5 font-mono text-[#736B63]">{idx + 1}</td>
                    <td className="py-2 px-2.5">
                      <strong className="text-[#1A1A1A] block">{it.name}</strong>
                      {it.flavor && (
                        <span className="text-[10px] text-[#3C1322] font-medium block">
                          Flavor: {it.flavor}
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-2.5 text-center font-semibold">{it.quantity}</td>
                    <td className="py-2 px-2.5 text-right font-mono">EGP {Number(it.unit_price).toFixed(2)}</td>
                    <td className="py-2 px-2.5 text-right font-mono font-bold">
                      EGP {(Number(it.unit_price) * Number(it.quantity)).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Math */}
          <div className="flex justify-end pt-2">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between py-0.5">
                <span className="text-[#736B63]">Subtotal:</span>
                <span className="font-mono font-semibold">EGP {subtotal}</span>
              </div>
              {Number(discountAmount) > 0 && (
                <div className="flex justify-between py-0.5 text-emerald-700">
                  <span>Discount:</span>
                  <span className="font-mono font-semibold">-EGP {discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between py-0.5">
                <span className="text-[#736B63]">Shipping ({governorate}):</span>
                <span className="font-mono font-semibold">EGP {shippingFee}</span>
              </div>
              <div className="flex justify-between py-2 border-t-2 border-[#1A1A1A] text-sm font-bold text-[#3C1322]">
                <span>Grand Total:</span>
                <span className="font-mono text-base font-extrabold">EGP {totalAmount}</span>
              </div>
              <div className="text-[10px] text-right text-[#736B63]">
                Payment Status: <strong className="text-[#1A1A1A]">{isCard ? 'Settled via Visa' : 'Due upon physical arrival'}</strong>
              </div>
            </div>
          </div>

          {/* Atelier Care & Authenticity Seal */}
          <div className="pt-4 border-t border-[#E8E2D7] grid grid-cols-2 gap-4 items-center text-[10px] text-[#736B63]">
            <div>
              <strong className="text-[#1A1A1A] block font-semibold">Atelier Craft & Care Guarantee:</strong>
              <span>
                All Toomakt confectionery is cooked fresh in European copper kettles using whole natural fruits and pure butter without preservatives.
                Store sealed at 18°C–22°C.
              </span>
            </div>
            <div className="text-right space-y-0.5">
              <div className="font-serif text-[#3C1322] font-semibold text-xs">TOOMAKT CONFECTIONERY ATELIER</div>
              <div>support@toomakt.com · WhatsApp: +20 10 2454 2139</div>
              <div>www.toomakt.com · Cairo, Egypt</div>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. ON-SCREEN INVOICE MODAL (Preview Before Print)                          */}
      {/* ========================================================================= */}
      {showInvoiceModal && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#E8E2D7] flex flex-col max-h-[90vh] overflow-hidden">
            
            {/* Modal Top Bar */}
            <div className="p-4 bg-[#FAF7F2] border-b border-[#E8E2D7] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#3C1322]" />
                <span className="font-serif text-sm font-semibold text-[#1A1A1A]">
                  {isRtl ? 'معاينة الفاتورة الرسمية' : 'Official Invoice Preview'}
                </span>
                <span className="text-[11px] font-mono text-[#736B63]">#{orderNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="btn-primary text-xs py-1.5 px-3.5 flex items-center gap-1.5 cursor-pointer shadow-soft"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'طباعة الآن' : 'Print Now'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(false)}
                  className="p-1.5 rounded-full hover:bg-neutral-200 text-[#736B63] hover:text-[#1A1A1A] cursor-pointer transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Invoice Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 bg-white text-xs">
              <div className="border border-[#1A1A1A] p-6 space-y-6 rounded-2xl shadow-xs">
                
                {/* Header */}
                <div className="flex items-start justify-between border-b-2 border-[#1A1A1A] pb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src="/images/logos/toomakt_logo_main.png"
                      alt="TOOMAKT"
                      className="h-9 w-auto object-contain"
                    />
                    <div>
                      <span className="font-serif text-2xl font-bold tracking-tight text-[#3C1322] block leading-none">
                        TOOMAKT
                      </span>
                      <span className="text-[10px] tracking-widest uppercase font-semibold text-[#736B63] block mt-1">
                        Atelier du Toffee · Cairo
                      </span>
                      <span className="text-xs text-[#1A1A1A] font-medium block mt-1">
                        Official Tax & Delivery Receipt · فاتورة رسمية
                      </span>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="inline-block px-2.5 py-1 rounded bg-[#FAF7F2] border border-[#1A1A1A] font-mono font-bold text-xs">
                      {orderNumber}
                    </span>
                    <div className="text-[11px] text-[#736B63]">
                      Date: <strong className="text-[#1A1A1A]">{formattedDate}</strong>
                    </div>
                  </div>
                </div>

                {/* Recipient Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#E8E2D7]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#736B63] block mb-1">
                      Customer Details
                    </span>
                    <div className="font-bold text-[#1A1A1A]">{customerName}</div>
                    {customerPhone && <div className="text-[#736B63]">Phone: {customerPhone}</div>}
                    {customerEmail && <div className="text-[#736B63]">Email: {customerEmail}</div>}
                  </div>

                  <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#E8E2D7]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#736B63] block mb-1">
                      Delivery Destination
                    </span>
                    <div className="font-bold text-[#1A1A1A]">{governorate}, Egypt</div>
                    <div className="text-[#736B63]">{shippingAddress}</div>
                  </div>
                </div>

                {/* Items */}
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b-2 border-[#1A1A1A] bg-[#FAF7F2]">
                      <th className="py-2 px-2 text-left">Item</th>
                      <th className="py-2 px-2 text-center">Qty</th>
                      <th className="py-2 px-2 text-right">Unit Price</th>
                      <th className="py-2 px-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((it, idx) => (
                      <tr key={idx} className="border-b border-[#E8E2D7]">
                        <td className="py-2 px-2">
                          <strong>{it.name}</strong>
                          {it.flavor && <div className="text-[10px] text-[#3C1322]">Flavor: {it.flavor}</div>}
                        </td>
                        <td className="py-2 px-2 text-center">{it.quantity}</td>
                        <td className="py-2 px-2 text-right font-mono">EGP {Number(it.unit_price).toFixed(2)}</td>
                        <td className="py-2 px-2 text-right font-mono font-bold">
                          EGP {(Number(it.unit_price) * Number(it.quantity)).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals */}
                <div className="flex justify-end pt-2">
                  <div className="w-60 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-[#736B63]">Subtotal:</span>
                      <span className="font-mono">EGP {subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#736B63]">Shipping:</span>
                      <span className="font-mono">EGP {shippingFee}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t-2 border-[#1A1A1A] text-sm font-bold text-[#3C1322]">
                      <span>Grand Total:</span>
                      <span className="font-mono font-extrabold">EGP {totalAmount}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Bottom Footer */}
            <div className="p-4 bg-[#FAF7F2] border-t border-[#E8E2D7] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowInvoiceModal(false)}
                className="btn-secondary text-xs py-2 px-4 cursor-pointer"
              >
                {isRtl ? 'إغلاق' : 'Close Preview'}
              </button>
              <button
                type="button"
                onClick={handlePrintReceipt}
                className="btn-primary text-xs py-2 px-6 flex items-center gap-2 cursor-pointer shadow-soft"
              >
                <Printer className="w-4 h-4" />
                <span>{isRtl ? 'طباعة / حفظ الفاتورة كـ PDF' : 'Print / Save as PDF'}</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
