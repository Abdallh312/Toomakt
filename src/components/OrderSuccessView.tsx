import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Download,
  MessageCircle,
  ShoppingBag,
  ArrowRight,
  Truck,
  Clock,
  MapPin,
  Package,
  Hash,
  Banknote,
  Receipt,
  Mail,
  Layers,
  Sparkles,
  ShieldCheck,
  Upload,
  Copy,
  Check,
  AlertCircle,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';
import { api } from '../services/api';
import { WhatsAppService } from '../services/whatsapp';

interface OrderSuccessViewProps {
  order: any;
  onContinueShopping: () => void;
}

export const OrderSuccessView: React.FC<OrderSuccessViewProps> = ({ order: initialOrder, onContinueShopping }) => {
  const [order, setOrder] = useState<any>(initialOrder);
  const [transferReference, setTransferReference] = useState('');
  const [customerPhone, setCustomerPhone] = useState(initialOrder?.customer_phone || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(
    initialOrder?.payment_status === 'waiting_verification'
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Poll for live payment status changes from admin (every 10s)
  useEffect(() => {
    if (!order?.order_number) return;
    const interval = setInterval(async () => {
      try {
        const liveOrder = await api.trackOrder(order.order_number);
        if (liveOrder) {
          setOrder((prev: any) => ({ ...prev, ...liveOrder }));
          if (liveOrder.payment_status === 'waiting_verification') {
            setSubmissionSuccess(true);
          }
        }
      } catch {}
    }, 10000);

    return () => clearInterval(interval);
  }, [order?.order_number]);

  const handleManualRefresh = async () => {
    if (!order?.order_number) return;
    setIsRefreshing(true);
    try {
      const liveOrder = await api.trackOrder(order.order_number);
      if (liveOrder) {
        setOrder((prev: any) => ({ ...prev, ...liveOrder }));
        if (liveOrder.payment_status === 'waiting_verification') {
          setSubmissionSuccess(true);
        }
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!order) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center bg-[#FAF6F0] mx-auto">
        <div className="w-16 h-16 rounded-full bg-[#FAF0E4] border border-[#E5C39E] flex items-center justify-center mx-auto mb-4 text-[#C26715]">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif font-black text-[#2B170E] mb-2 text-center">
          No Active Order Found
        </h2>
        <p className="text-xs sm:text-sm text-[#705335] max-w-sm mx-auto mb-6 text-center">
          It looks like there is no active order session. Explore our handcrafted confectionery collection.
        </p>
        <button
          onClick={onContinueShopping}
          className="bg-[#C26715] hover:bg-[#994709] text-white px-8 py-3 rounded-full font-bold text-xs uppercase tracking-wider shadow-md transition-all inline-flex items-center gap-2 mx-auto cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Return to Shop</span>
        </button>
      </div>
    );
  }

  const orderNumber = order.order_number || 'ORD-2026-000000';
  const customerName = order.customer_name || 'Valued Customer';
  const governorate = order.governorate || 'Cairo';
  const totalAmount = Number(order.total_amount || 0).toFixed(2);
  const isInstaPay = order.payment_method === 'instapay' || order.payment_method === 'bank';
  const paymentStatus = order.payment_status || 'pending';
  const isPaid = paymentStatus === 'paid';
  const isRejected = paymentStatus === 'rejected';
  const isWaitingVerification = paymentStatus === 'waiting_verification' || submissionSuccess;
  const address = order.shipping_address || 'Address provided';

  const items: any[] = order.items || [];

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // File selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setErrorMessage('File size must be under 8MB.');
        return;
      }
      setSelectedFile(file);
      setErrorMessage(null);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Payment Screenshot Form
  const handleSubmitPaymentConfirmation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !transferReference.trim()) {
      setErrorMessage('Please upload your transfer screenshot or enter your transaction reference number.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await api.submitPaymentConfirmation(orderNumber, {
        transfer_amount: Number(order.total_amount),
        transfer_reference: transferReference.trim(),
        customer_phone: customerPhone.trim(),
        screenshot_file: selectedFile || undefined,
        payment_screenshot: previewUrl || undefined
      });

      if (res.success) {
        setSubmissionSuccess(true);
        if (res.order) {
          setOrder((prev: any) => ({ ...prev, ...res.order }));
        }
      } else {
        setErrorMessage(res.message || 'Failed to submit payment confirmation.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error submitting payment confirmation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Download Invoice handler
  const handleDownloadInvoice = () => {
    const invoiceUrl = `http://127.0.0.1:8000/api/orders/${orderNumber}/invoice/`;
    window.open(invoiceUrl, '_blank');
  };

  // WhatsApp pre-filled contact link
  const whatsappInvoiceText = isInstaPay
    ? WhatsAppService.getPaymentInstructionsMessage(order)
    : WhatsAppService.getOrderCreatedMessage(order);
  const whatsappUrl = WhatsAppService.generateWhatsAppUrl(
    order.customer_phone || WhatsAppService.defaultConfig.phone,
    whatsappInvoiceText
  );

  return (
    <div className="min-h-[calc(100vh-120px)] bg-[#FAF6F0] flex items-center justify-center py-6 sm:py-10 md:py-14 px-3 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto my-auto">
        <div className="bg-white rounded-3xl shadow-xl border border-[#E8DDD0] overflow-hidden transition-all mx-auto">
          {/* Header Banner */}
          <div
            className={`text-white text-center py-8 sm:py-10 px-4 sm:px-6 relative overflow-hidden transition-colors ${
              isPaid
                ? 'bg-[#15803D]'
                : isRejected
                ? 'bg-[#BE123C]'
                : isWaitingVerification
                ? 'bg-[#92400E]'
                : 'bg-[#994709]'
            }`}
          >
            <div className="relative z-10 mx-auto max-w-lg">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/15 backdrop-blur-xs flex items-center justify-center mx-auto mb-3.5 border border-white/30 shadow-inner">
                {isPaid ? (
                  <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-200" />
                ) : isRejected ? (
                  <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-rose-200" />
                ) : isWaitingVerification ? (
                  <Clock className="w-10 h-10 sm:w-12 sm:h-12 text-amber-200 animate-pulse" />
                ) : (
                  <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-amber-300" />
                )}
              </div>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-black/25 backdrop-blur-xs text-[11px] font-extrabold uppercase tracking-widest text-amber-200 border border-white/15 mb-2">
                {isPaid ? (
                  <span>Payment Approved & Verified</span>
                ) : isRejected ? (
                  <span>Payment Verification Required</span>
                ) : isWaitingVerification ? (
                  <span>Waiting for Admin Verification</span>
                ) : isInstaPay ? (
                  <span>Waiting for Payment Confirmation</span>
                ) : (
                  <span>Order Confirmed (Cash on Delivery)</span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black tracking-tight text-white">
                {isPaid
                  ? 'Payment Verified & Approved!'
                  : isRejected
                  ? 'Payment Verification Notice'
                  : isWaitingVerification
                  ? 'Payment Proof Submitted'
                  : isInstaPay
                  ? 'Complete Your InstaPay Transfer'
                  : 'Thank you for your order!'}
              </h1>

              <p className="mt-2 text-xs sm:text-sm text-amber-100/90 leading-relaxed max-w-md mx-auto">
                {isPaid
                  ? 'Your transaction has been approved by atelier management. Your batch is moving into fresh preparation.'
                  : isRejected
                  ? order.payment_rejection_reason || 'The submitted payment proof could not be verified. Please submit an updated screenshot below.'
                  : isWaitingVerification
                  ? 'Your payment screenshot has been submitted. Your order is now waiting for admin verification.'
                  : isInstaPay
                  ? 'Please transfer the exact total via InstaPay, then send or upload your receipt screenshot to begin atelier preparation.'
                  : 'We have received your order. Our confectioners are freshly hand-pulling your batch in the atelier.'}
              </p>
            </div>

            {/* Background Glows */}
            <div className="absolute -right-12 -bottom-12 w-52 h-52 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-12 -top-12 w-52 h-52 bg-black/20 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Details Section */}
          <div className="p-4 sm:p-6 md:p-8 space-y-6">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-[#FAF5EE] border border-[#EADCCB]">
              <div className="flex flex-col items-center justify-center text-center p-3 rounded-xl bg-white border border-[#F0E6D8] shadow-2xs">
                <span className="text-[10px] text-[#8C7B71] uppercase font-bold tracking-wider">Order No.</span>
                <span className="font-mono text-xs sm:text-sm font-black text-[#994709] mt-0.5">{orderNumber}</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center p-3 rounded-xl bg-white border border-[#F0E6D8] shadow-2xs">
                <span className="text-[10px] text-[#8C7B71] uppercase font-bold tracking-wider">Method</span>
                <span className="text-xs sm:text-sm font-bold text-[#2B170E] mt-0.5">
                  {isInstaPay ? 'InstaPay Transfer' : 'Cash on Delivery'}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center text-center p-3 rounded-xl bg-white border border-[#F0E6D8] shadow-2xs">
                <span className="text-[10px] text-[#8C7B71] uppercase font-bold tracking-wider">Governorate</span>
                <span className="text-xs sm:text-sm font-bold text-[#2B170E] mt-0.5">{governorate}</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center p-3 rounded-xl bg-white border border-[#F0E6D8] shadow-2xs">
                <span className="text-[10px] text-[#8C7B71] uppercase font-bold tracking-wider">Total</span>
                <span className="text-xs sm:text-sm font-black text-[#C26715] mt-0.5">{totalAmount} EGP</span>
              </div>
            </div>

            {/* INSTAPAY TRANSFER & CONFIRMATION WORKFLOW */}
            {isInstaPay && !isPaid && (
              <div className="border-2 border-[#E5C39E] bg-[#FFF9F2] rounded-3xl p-5 sm:p-6 space-y-5 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0E2D2]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#FAF0E4] text-[#C26715] flex items-center justify-center font-black text-sm">
                      1
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-sm sm:text-base text-[#2B170E]">
                        Official InstaPay Account Details
                      </h3>
                      <p className="text-[11px] text-[#705335]">
                        Transfer the exact amount of <strong>{totalAmount} EGP</strong> to our account:
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleManualRefresh}
                    disabled={isRefreshing}
                    title="Check latest status"
                    className="p-2 rounded-full bg-white border border-[#E5C39E] text-[#994709] hover:bg-[#FAF0E4] transition"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                {/* Account Details Copy Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Address */}
                  <div className="p-3 bg-white rounded-xl border border-[#E8DDD0] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#8C7B71] block">InstaPay Address (IPA)</span>
                      <span className="font-mono font-black text-sm text-[#2B170E]">toomakt@instapay</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy('toomakt@instapay', 'ipa')}
                      className="px-2.5 py-1.5 rounded-lg bg-[#FAF0E4] hover:bg-[#F3E2CF] text-[#994709] font-bold text-[11px] flex items-center gap-1 transition"
                    >
                      {copiedKey === 'ipa' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'ipa' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* Phone */}
                  <div className="p-3 bg-white rounded-xl border border-[#E8DDD0] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#8C7B71] block">Mobile Number</span>
                      <span className="font-mono font-black text-sm text-[#2B170E]">01000000000</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy('01000000000', 'phone')}
                      className="px-2.5 py-1.5 rounded-lg bg-[#FAF0E4] hover:bg-[#F3E2CF] text-[#994709] font-bold text-[11px] flex items-center gap-1 transition"
                    >
                      {copiedKey === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'phone' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* Exact Amount */}
                  <div className="p-3 bg-white rounded-xl border border-[#E8DDD0] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#8C7B71] block">Transfer Amount</span>
                      <span className="font-mono font-black text-sm text-[#C26715]">{totalAmount} EGP</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(totalAmount, 'amount')}
                      className="px-2.5 py-1.5 rounded-lg bg-[#FAF0E4] hover:bg-[#F3E2CF] text-[#994709] font-bold text-[11px] flex items-center gap-1 transition"
                    >
                      {copiedKey === 'amount' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'amount' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* Account Name */}
                  <div className="p-3 bg-white rounded-xl border border-[#E8DDD0]">
                    <span className="text-[10px] uppercase font-bold text-[#8C7B71] block">Account Name & Bank</span>
                    <span className="font-semibold text-xs text-[#2B170E]">toomakt Confectionery (CIB Egypt)</span>
                  </div>
                </div>

                {/* STEP 2: Screenshot Submission Options */}
                <div className="pt-2">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-full bg-[#FAF0E4] text-[#C26715] flex items-center justify-center font-black text-sm">
                      2
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#2B170E]">
                        Submit Payment Screenshot
                      </h4>
                      <p className="text-[11px] text-[#705335]">
                        Choose either WhatsApp or instant website upload:
                      </p>
                    </div>
                  </div>

                  {/* WhatsApp Quick Action */}
                  <div className="mb-4">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white p-3.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-md transition hover:shadow-lg"
                    >
                      <MessageCircle className="w-4 h-4 fill-current shrink-0" />
                      <span>Send Screenshot on WhatsApp with Invoice Info</span>
                    </a>
                  </div>

                  {/* Direct Website Screenshot Upload Form */}
                  <form onSubmit={handleSubmitPaymentConfirmation} className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8DDD0] space-y-3.5">
                    <span className="text-xs font-bold text-[#2B170E] block">
                      Or Upload Your Receipt Screenshot Directly:
                    </span>

                    {/* File Dropzone */}
                    <div className="border-2 border-dashed border-[#E5C39E] rounded-xl p-4 text-center hover:bg-[#FAF5EE] transition relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      {previewUrl ? (
                        <div className="flex flex-col items-center gap-2">
                          <img src={previewUrl} alt="Receipt preview" className="max-h-32 rounded-lg border border-[#E8DDD0] object-contain shadow-xs" />
                          <span className="text-xs font-bold text-[#C26715]">Screenshot selected (Click to change)</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-2 text-[#705335]">
                          <Upload className="w-6 h-6 text-[#C26715] mb-1.5" />
                          <span className="text-xs font-bold text-[#2B170E]">Click or drag transfer screenshot here</span>
                          <span className="text-[10px] text-[#8C7B71] mt-0.5">JPG, PNG, WebP up to 8MB</span>
                        </div>
                      )}
                    </div>

                    {/* Transfer Reference / Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#705335] mb-1">
                          Transfer Reference No. (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. TXN-984210"
                          value={transferReference}
                          onChange={e => setTransferReference(e.target.value)}
                          className="w-full bg-[#FAF6F0] border border-[#E8DDD0] rounded-xl px-3 py-2 text-xs text-[#2B170E] focus:outline-none focus:border-[#C26715]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#705335] mb-1">
                          Sender Mobile / InstaPay ID
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 01012345678"
                          value={customerPhone}
                          onChange={e => setCustomerPhone(e.target.value)}
                          className="w-full bg-[#FAF6F0] border border-[#E8DDD0] rounded-xl px-3 py-2 text-xs text-[#2B170E] focus:outline-none focus:border-[#C26715]"
                        />
                      </div>
                    </div>

                    {errorMessage && (
                      <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    {submissionSuccess && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-800 flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                        <div>
                          <strong className="block font-bold">Your payment screenshot has been submitted.</strong>
                          <span>Your order is now waiting for admin verification.</span>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#C26715] hover:bg-[#994709] text-white py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Submitting Payment Proof...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Submit Payment Proof for Verification</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* ORDER ITEMS LIST */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#422C20] flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#C26715]" />
                  <span>Ordered Confections & Packs</span>
                </h3>
                <span className="text-[11px] font-semibold text-[#8C7B71] flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-[#C26715]" />
                  <span>{items.reduce((sum, it) => sum + (it.quantity || 1), 0)} Total Packs</span>
                </span>
              </div>

              <div className="divide-y divide-[#F0E6D8] border border-[#E8DDD0] rounded-2xl bg-white overflow-hidden shadow-2xs">
                {items.length > 0 ? (
                  items.map((it, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 sm:p-4 flex items-center justify-between gap-3 text-xs sm:text-sm hover:bg-[#FAF5EE]/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={it.image_url || '/images/canister.jpg'}
                          alt={it.product_name_snapshot || it.name}
                          className="w-12 h-12 rounded-xl object-cover bg-[#FAF5EE] border border-[#E8DDD0] shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-[#2B170E] truncate">
                            {it.product_name_snapshot || it.name}
                          </div>
                          <div className="text-[11px] text-[#705335] mt-0.5">
                            {it.quantity} Pack(s) • {it.pieces_per_pack_snapshot || 20} pieces/pack
                          </div>
                        </div>
                      </div>
                      <div className="text-right font-black text-[#2B170E] shrink-0 text-xs sm:text-sm font-mono">
                        {Number(it.total_price || (it.unit_price * it.quantity)).toFixed(2)} EGP
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-[#705335]">Confections recorded in order</div>
                )}
              </div>
            </div>

            {/* Delivery Summary */}
            <div className="bg-[#FFF9F2] border border-[#E5C39E] rounded-2xl p-4 sm:p-5 space-y-2 text-xs text-[#5A4738]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C26715] shrink-0 mt-0.5" />
                <span><strong>Destination:</strong> {address}, {governorate}, Egypt</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-[#C26715] shrink-0 mt-0.5" />
                <span><strong>Courier Dispatch:</strong> Express Cold-Chain Delivery (1–2 business days)</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#C26715] shrink-0 mt-0.5" />
                <span><strong>Receipt Confirmation:</strong> Sent to {order.customer_email || 'your email'}</span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-1">
              <button
                type="button"
                onClick={handleDownloadInvoice}
                className="w-full bg-[#FAF0E4] hover:bg-[#F3E2CF] text-[#994709] border border-[#E5C39E] py-3.5 px-5 rounded-full font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2.5 shadow-xs cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Official PDF Invoice</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white py-3.5 px-5 rounded-full font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2.5 shadow-xs cursor-pointer text-center"
              >
                <MessageCircle className="w-4 h-4 fill-current shrink-0" />
                <span>WhatsApp Atelier Support</span>
              </a>
            </div>

            {/* Return / Continue Shopping */}
            <div className="pt-4 text-center flex justify-center">
              <button
                onClick={onContinueShopping}
                className="btn-neo bg-[#FF5E2B] text-white py-4 px-10 text-xs sm:text-sm font-black uppercase tracking-wider transition inline-flex items-center justify-center gap-2.5 shadow-neo hover:bg-[#ff480e] cursor-pointer mx-auto"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>CONTINUE TASTING & SHOPPING</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
