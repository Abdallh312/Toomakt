import React, { useState } from 'react';
import {
  CheckCircle2,
  Printer,
  MessageCircle,
  ShoppingBag,
  ArrowRight,
  Truck,
  Clock,
  MapPin,
  Package,
  Hash,
  CreditCard,
  Banknote,
  Receipt,
  Mail,
  Sparkles,
  ShieldCheck,
  Copy,
  Check,
  Calendar,
  Phone,
  ArrowLeft,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { WhatsAppService } from '../services/whatsapp';

interface OrderSuccessViewProps {
  order: any;
  onContinueShopping: () => void;
}

export const OrderSuccessView: React.FC<OrderSuccessViewProps> = ({ order, onContinueShopping }) => {
  const { isRtl } = useLanguage();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

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
  const governorate = order.governorate || 'Cairo';
  const totalAmount = Number(order.total_amount || 0).toFixed(2);
  const subtotal = Number(order.subtotal || 0).toFixed(2);
  const shippingFee = Number(order.shipping_fee || 50).toFixed(2);
  const discountAmount = Number(order.discount_amount || 0).toFixed(2);
  
  // Payment Method: 'card' (Visa / Mastercard via Paymob) or 'cod' (Cash on Delivery)
  const isCard = order.payment_method === 'card' || order.payment_method === 'visa' || order.payment_method === 'paymob' || order.payment_status === 'paid';
  const paymentStatus = order.payment_status || (isCard ? 'paid' : 'pending');

  const items: any[] = order.items || [];
  const fullAddress = order.shipping_address || `${governorate}, Egypt`;

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // WhatsApp Support Link
  const whatsappMsg = `Hello Toomakt! I just placed order #${orderNumber} (${totalAmount} EGP via ${isCard ? 'Visa' : 'Cash on Delivery'}). Please let me know when it dispatches!`;
  const whatsappUrl = `https://wa.me/201000000000?text=${encodeURIComponent(whatsappMsg)}`;

  // Print invoice
  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* ======================================================== */}
        {/* HERO SUCCESS HEADER CARD                                 */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl border border-[#E8E2D7] shadow-soft overflow-hidden text-center relative">
          {/* Subtle Top Accent Bar */}
          <div className={`h-2 w-full ${isCard ? 'bg-[#3C1322]' : 'bg-[#FFD147]'}`} />

          <div className="p-8 sm:p-12 relative z-10">
            {/* Glowing Icon Badge */}
            <div className="relative inline-flex items-center justify-center mb-6">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 ${
                  isCard
                    ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                    : 'bg-[#3C1322] text-[#FAF7F2] shadow-[#3C1322]/20'
                }`}
              >
                {isCard ? (
                  <CheckCircle2 className="w-10 h-10" />
                ) : (
                  <Package className="w-10 h-10 text-[#FFD147]" />
                )}
              </div>
              <div className="absolute -inset-3 bg-[#FFD147]/15 rounded-full blur-xl -z-10" />
            </div>

            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest mb-3 border bg-[#FAF7F2]">
              {isCard ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-800">
                    {isRtl ? 'تم الدفع بالفيزا عبر Paymob 3D-Secure' : 'Visa Payment Verified · Paymob 3D-Secure'}
                  </span>
                </>
              ) : (
                <>
                  <Banknote className="w-3.5 h-3.5 text-[#3C1322]" />
                  <span className="text-[#3C1322]">
                    {isRtl ? 'الدفع عند الاستلام (كاش للمندوب)' : 'Cash on Delivery · Due Upon Arrival'}
                  </span>
                </>
              )}
            </div>

            {/* Main Title */}
            <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#1A1A1A] tracking-tight mb-3">
              {isCard
                ? (isRtl ? 'تم تأكيد الدفع واستلام طلبك!' : 'Payment Verified & Order Confirmed!')
                : (isRtl ? 'تم استلام طلبك بنجاح!' : 'Thank you for your order!')}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-[#736B63] font-light max-w-xl mx-auto leading-relaxed">
              {isCard
                ? (isRtl
                    ? `شكراً لك ${customerName}! تم خصم مبلغ ${totalAmount} ج.م بنجاح عبر البطاقة البنكية، ويجري الآن تجهيز طلبك في معملنا.`
                    : `Thank you, ${customerName}! Your payment of ${totalAmount} EGP was verified securely by Paymob. Our master confectioners have begun hand-pulling your batch.`)
                : (isRtl
                    ? `شكراً لك ${customerName}! تم تسجيل طلبك برقم #${orderNumber}. يرجى تجهيز مبلغ ${totalAmount} ج.م نقداً لمندوب الشحن عند الاستلام.`
                    : `Thank you, ${customerName}! Your order #${orderNumber} is confirmed. Please have exact cash of ${totalAmount} EGP ready for our courier upon delivery.`)}
            </p>

            {/* Quick Metrics Bar */}
            <div className="mt-8 pt-8 border-t border-[#E8E2D7] grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#E8E2D7]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#736B63] block">
                  {isRtl ? 'رقم الطلب' : 'Order No.'}
                </span>
                <div className="flex items-center justify-center gap-1.5 mt-1">
                  <span className="font-mono text-xs sm:text-sm font-semibold text-[#1A1A1A]">
                    {orderNumber}
                  </span>
                  <button
                    onClick={() => handleCopy(orderNumber, 'ord')}
                    className="text-[#736B63] hover:text-[#1A1A1A] cursor-pointer"
                    title="Copy Order Number"
                  >
                    {copiedKey === 'ord' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#E8E2D7]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#736B63] block">
                  {isRtl ? 'طريقة الدفع' : 'Payment Method'}
                </span>
                <span className="text-xs sm:text-sm font-medium text-[#1A1A1A] mt-1 block">
                  {isCard ? 'Visa (Paymob)' : 'Cash on Delivery'}
                </span>
              </div>

              <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#E8E2D7]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#736B63] block">
                  {isRtl ? 'المحافظة' : 'Governorate'}
                </span>
                <span className="text-xs sm:text-sm font-medium text-[#1A1A1A] mt-1 block">
                  {governorate}
                </span>
              </div>

              <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#E8E2D7]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#736B63] block">
                  {isRtl ? 'المبلغ الإجمالي' : 'Total Amount'}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-[#3C1322] mt-1 block">
                  {totalAmount} EGP
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* ARTISAN ATELIER JOURNEY (STATUS TIMELINE)                */}
        {/* ======================================================== */}
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

        {/* ======================================================== */}
        {/* OFFICIAL ORDER RECEIPT & SUMMARY                         */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D7] shadow-soft space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D7]">
            <div className="flex items-center gap-3">
              <Receipt className="w-5 h-5 text-[#3C1322]" />
              <h2 className="font-serif text-lg font-normal text-[#1A1A1A]">
                {isRtl ? 'تفاصيل الفاتورة الرسمية' : 'Official Order Receipt'}
              </h2>
            </div>
            <button
              onClick={handlePrintReceipt}
              className="text-xs text-[#736B63] hover:text-[#1A1A1A] flex items-center gap-1.5 cursor-pointer p-2 rounded-xl hover:bg-neutral-50 transition"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4" />
              <span>{isRtl ? 'طباعة الفاتورة' : 'Print Receipt'}</span>
            </button>
          </div>

          {/* Items Table */}
          <div className="space-y-4">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-4 pb-4 border-b border-[#E8E2D7] last:border-b-0"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-xl bg-[#FAF7F2] border border-[#E8E2D7] flex items-center justify-center overflow-hidden shrink-0">
                    <img
                      src={item.image || '/images/products/mango_sunbeam.jpg'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-[#1A1A1A]">
                      {item.name}
                    </h4>
                    {item.flavor && (
                      <span className="text-[11px] font-medium text-[#3C1322] bg-[#FFD147]/25 border border-[#FFD147]/40 px-2 py-0.5 rounded-full inline-block mt-0.5">
                        {isRtl ? 'النكهة: ' : 'Flavor: '}{item.flavor}
                      </span>
                    )}
                    <span className="text-xs text-[#736B63] font-light block mt-0.5">
                      Qty: {item.quantity} × EGP {Number(item.unit_price).toFixed(2)}
                    </span>
                  </div>
                </div>

                <span className="font-mono text-sm font-semibold text-[#1A1A1A]">
                  EGP {(Number(item.unit_price) * Number(item.quantity)).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Math & Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#E8E2D7]">
            {/* Delivery Details */}
            <div className="space-y-2 text-xs text-[#736B63]">
              <span className="font-bold text-[10px] uppercase tracking-wider text-[#1A1A1A] block mb-1">
                {isRtl ? 'بيانات المستلم والشحن' : 'Recipient & Delivery Details'}
              </span>
              <p className="flex items-center gap-1.5 text-[#1A1A1A]">
                <MapPin className="w-3.5 h-3.5 text-[#3C1322] shrink-0" />
                <span>{fullAddress}</span>
              </p>
              {order.customer_phone && (
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#3C1322] shrink-0" />
                  <span>{order.customer_phone}</span>
                </p>
              )}
              {order.customer_email && (
                <p className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#3C1322] shrink-0" />
                  <span>{order.customer_email}</span>
                </p>
              )}
            </div>

            {/* Financial Summary */}
            <div className="space-y-2 text-xs text-[#736B63]">
              <div className="flex justify-between">
                <span>{isRtl ? 'قيمة المنتجات' : 'Subtotal'}</span>
                <span className="font-medium text-[#1A1A1A]">EGP {subtotal}</span>
              </div>
              {Number(discountAmount) > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>{isRtl ? 'الخصم' : 'Discount'}</span>
                  <span>-EGP {discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{isRtl ? 'الشحن' : 'Shipping'} ({governorate})</span>
                <span className="font-medium text-[#1A1A1A]">EGP {shippingFee}</span>
              </div>
              <div className="flex justify-between text-base font-serif font-normal text-[#1A1A1A] pt-3 border-t border-[#E8E2D7]">
                <span>{isRtl ? 'المجموع النهائي' : 'Total Amount'}</span>
                <span className="font-semibold text-[#3C1322]">EGP {totalAmount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* ACTIONS & CONTACT                                        */}
        {/* ======================================================== */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <button
            onClick={onContinueShopping}
            className="btn-secondary w-full sm:w-auto text-xs py-3 px-6 flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isRtl ? 'العودة للتسوق والمزيد' : 'CONTINUE SHOPPING'}</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handlePrintReceipt}
              className="btn-secondary flex-1 sm:flex-initial text-xs py-3 px-5 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{isRtl ? 'طباعة' : 'Print'}</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-semibold py-3 px-6 rounded-full flex items-center justify-center gap-2 shadow-sm transition hover:shadow-md cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>{isRtl ? 'تواصل عبر واتساب' : 'WhatsApp Atelier'}</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
