import React, { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  MessageCircle,
  Search,
  Check,
  AlertTriangle,
  User,
  Phone,
  DollarSign,
  FileText,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Download,
  X
} from 'lucide-react';
import { PaymentConfirmationRecord } from '../../types';
import { WhatsAppService } from '../../services/whatsapp';

interface PaymentVerificationsTabProps {
  confirmations: PaymentConfirmationRecord[];
  orders: any[];
  onApprove: (conf: PaymentConfirmationRecord) => Promise<void>;
  onReject: (conf: PaymentConfirmationRecord, reason: string, notes?: string) => Promise<void>;
  onInspectOrder?: (order: any) => void;
}

export const PaymentVerificationsTab: React.FC<PaymentVerificationsTabProps> = ({
  confirmations,
  orders,
  onApprove,
  onReject,
  onInspectOrder
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Reject modal state
  const [rejectingRecord, setRejectingRecord] = useState<PaymentConfirmationRecord | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectNotes, setRejectNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Filtered list
  const filtered = confirmations.filter(c => {
    const matchesFilter = filter === 'all' || c.verification_status === filter;
    const matchesSearch = !searchQuery ||
      c.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.customer_phone && c.customer_phone.includes(searchQuery)) ||
      (c.transfer_reference && c.transfer_reference.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const pendingCount = confirmations.filter(c => c.verification_status === 'pending').length;

  const handleOpenRejectModal = (conf: PaymentConfirmationRecord) => {
    setRejectingRecord(conf);
    setRejectReason('');
    setRejectNotes('');
  };

  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingRecord || !rejectReason.trim()) return;
    setIsProcessing(true);
    try {
      await onReject(rejectingRecord, rejectReason.trim(), rejectNotes);
      setRejectingRecord(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 flex items-center gap-1 w-fit">
            <CheckCircle className="w-3 h-3" /> Approved (Paid)
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-950/80 border border-rose-700/60 text-rose-300 flex items-center gap-1 w-fit">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-950/80 border border-amber-600/60 text-amber-300 flex items-center gap-1 w-fit animate-pulse">
            <Clock className="w-3 h-3" /> Pending Review
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-3xl font-black text-amber-100">InstaPay Payment Verifications</h2>
            {pendingCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-mono text-xs font-black animate-pulse">
                {pendingCount} Pending
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-amber-200/60 mt-1">
            Review and approve customer bank transfer & InstaPay screenshots before fulfilling orders.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-amber-400/60 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search order #, customer, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 bg-[#2B170E] border border-amber-900/60 rounded-xl text-xs text-amber-200 placeholder-amber-400/40 focus:outline-none w-full sm:w-64"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-[#2B170E] p-1.5 rounded-2xl border border-amber-900/40 w-fit">
        {(['pending', 'all', 'approved', 'rejected'] as const).map((key) => {
          const count = key === 'all'
            ? confirmations.length
            : confirmations.filter(c => c.verification_status === key).length;

          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition flex items-center gap-1.5 ${
                filter === key
                  ? 'bg-[#C26715] text-white shadow-md'
                  : 'text-amber-200/60 hover:text-white'
              }`}
            >
              <span>{key === 'pending' ? 'Pending Review' : key}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                filter === key ? 'bg-amber-950 text-amber-200' : 'bg-amber-950/40 text-amber-400/70'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Confirmation List */}
      {filtered.length === 0 ? (
        <div className="bg-[#2B170E] rounded-3xl border border-amber-900/40 p-12 text-center text-amber-200/50">
          <ShieldCheck className="w-12 h-12 mx-auto mb-3 text-amber-400/30" />
          <p className="text-base font-bold text-amber-200">No payment confirmations in this queue.</p>
          <span className="text-xs text-amber-300/40 mt-1 block">
            When customers choose InstaPay and submit their transfer screenshot, it will appear here for one-click approval.
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((conf) => {
            const relatedOrder = orders.find(o => o.order_number === conf.order_number);
            const isPending = conf.verification_status === 'pending';

            return (
              <div
                key={conf.id}
                className={`bg-[#2B170E] rounded-2xl border p-5 transition shadow-lg ${
                  isPending ? 'border-amber-500/50 bg-[#2D180E]' : 'border-amber-900/40 opacity-90'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  {/* Left: Order Info & Customer */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-bold font-serif text-amber-300">
                        Order #{conf.order_number}
                      </span>
                      {getStatusBadge(conf.verification_status)}
                      <span className="text-[10px] text-amber-300/40 font-mono">
                        Submitted: {new Date(conf.submission_date).toLocaleString()}
                      </span>
                    </div>

                    {/* Customer & Amount details */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-amber-950/40 p-3 rounded-xl border border-amber-900/30 font-sans">
                      <div>
                        <span className="text-[10px] text-amber-400 font-bold uppercase block">Customer</span>
                        <div className="font-semibold text-white mt-0.5">{conf.customer_name}</div>
                        <div className="text-amber-300 font-mono text-[11px] flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-amber-400" />
                          <span>{conf.customer_phone || 'No phone'}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-amber-400 font-bold uppercase block">Transfer Details</span>
                        <div className="font-bold text-emerald-400 font-mono text-sm mt-0.5">
                          {Number(conf.transfer_amount || conf.order_total).toFixed(2)} EGP
                        </div>
                        <div className="text-amber-200/60 text-[10px] font-mono mt-0.5">
                          Ref: <span className="text-amber-300 font-semibold">{conf.transfer_reference || 'N/A'}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-amber-400 font-bold uppercase block">Order Total & Shipping</span>
                        <div className="font-semibold text-white font-mono text-xs mt-0.5">
                          Total: {Number(conf.order_total).toFixed(2)} EGP
                        </div>
                        <div className="text-amber-200/60 text-[10px] font-mono mt-0.5">
                          Shipping: {Number(conf.shipping_fee || 50).toFixed(2)} EGP
                        </div>
                      </div>
                    </div>

                    {/* Review Notes or Rejection Reason if any */}
                    {conf.rejection_reason && (
                      <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-800/40 text-rose-200 text-xs flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span><strong>Rejection Reason:</strong> {conf.rejection_reason}</span>
                      </div>
                    )}
                    {conf.admin_notes && (
                      <div className="text-[11px] text-amber-200/60 italic">
                        Admin Note: {conf.admin_notes} (Reviewed by {conf.admin_reviewer || 'Admin'})
                      </div>
                    )}
                  </div>

                  {/* Middle: Screenshot Thumbnail */}
                  <div className="flex flex-col items-center justify-center shrink-0">
                    {conf.payment_screenshot ? (
                      <div
                        onClick={() => setLightboxImage(conf.payment_screenshot || null)}
                        className="group relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border-2 border-amber-600/60 cursor-pointer shadow-md bg-black/40 flex items-center justify-center"
                        title="Click to view full screenshot"
                      >
                        <img
                          src={conf.payment_screenshot}
                          alt={`Receipt ${conf.order_number}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold gap-1">
                          <Eye className="w-4 h-4" /> Zoom
                        </div>
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-xl border border-dashed border-amber-800/60 flex flex-col items-center justify-center text-amber-300/40 text-[10px] p-2 text-center">
                        <FileText className="w-6 h-6 mb-1 opacity-40" />
                        <span>No image provided (Ref code only)</span>
                      </div>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-col gap-2 shrink-0 lg:w-48">
                    {isPending ? (
                      <>
                        <button
                          onClick={() => onApprove(conf)}
                          className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>Approve Payment</span>
                        </button>

                        <button
                          onClick={() => handleOpenRejectModal(conf)}
                          className="w-full py-2 px-3 bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-800/60 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject Screenshot</span>
                        </button>
                      </>
                    ) : (
                      <div className="text-center py-2 text-xs font-mono text-amber-300/60 flex items-center justify-center gap-1">
                        {conf.verification_status === 'approved' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400 inline" />
                            <span>Verified by </span>
                          </>
                        ) : (
                          <>
                            <X className="w-3.5 h-3.5 text-rose-400 inline" />
                            <span>Rejected by </span>
                          </>
                        )}
                        <span className="font-bold text-white">{conf.admin_reviewer || 'Admin'}</span>
                      </div>
                    )}

                    {/* WhatsApp Chat link with client */}
                    {conf.customer_phone && (
                      <a
                        href={WhatsAppService.getWhatsAppChatUrl(
                          conf.customer_phone,
                          `Hello ${conf.customer_name}, regarding your order #${conf.order_number} and InstaPay payment...`
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2 px-3 bg-amber-950 hover:bg-amber-900 text-emerald-400 border border-amber-800/60 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat on WhatsApp</span>
                      </a>
                    )}

                    {relatedOrder && onInspectOrder && (
                      <button
                        onClick={() => onInspectOrder(relatedOrder)}
                        className="w-full py-1.5 text-[11px] text-amber-300/70 hover:text-white transition underline"
                      >
                        View Full Order Details →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal for Payment Screenshot */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl border border-amber-900/60 shadow-2xl">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 bg-black/70 hover:bg-black text-white px-3 py-1.5 rounded-full text-xs font-semibold z-10 transition flex items-center gap-1.5"
            >
              <X className="w-4 h-4" />
              <span>Close</span>
            </button>
            <img
              src={lightboxImage}
              alt="Payment Screenshot Fullscreen"
              className="w-full h-auto max-h-[85vh] object-contain"
            />
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectingRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#2B170E] border border-rose-900/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-amber-900/60 pb-3">
              <div className="flex items-center gap-2 text-rose-300">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <h3 className="font-serif text-lg font-bold">Reject Payment Screenshot</h3>
              </div>
              <button
                onClick={() => setRejectingRecord(null)}
                className="p-1 rounded-lg text-amber-300 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-amber-200/70">
              Order #{rejectingRecord.order_number} for customer <strong>{rejectingRecord.customer_name}</strong> will be marked as REJECTED. A notification will be generated and a WhatsApp message will be sent with your reason.
            </p>

            {/* Quick Reason Presets */}
            <div>
              <span className="text-[10px] text-amber-400 font-bold uppercase block mb-1.5">
                Quick Rejection Presets
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Transfer amount does not match order total',
                  'Screenshot is blurry or unreadable',
                  'Transfer reference not found in bank account',
                  'Duplicate screenshot already used for another order'
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setRejectReason(preset)}
                    className="text-[10px] px-2.5 py-1 bg-amber-950 border border-amber-800/60 rounded-lg text-amber-200/90 hover:bg-amber-900 transition text-left"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleConfirmReject} className="space-y-3 text-xs">
              <div>
                <label className="block text-amber-400 font-bold mb-1">
                  Reason for Rejection (Visible to Customer via WhatsApp) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Explain why the transfer could not be verified..."
                  className="w-full px-3 py-2 bg-amber-950 border border-amber-800/60 rounded-xl text-white placeholder-amber-400/40 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-amber-400 font-bold mb-1">
                  Internal Admin Notes (Optional)
                </label>
                <input
                  type="text"
                  value={rejectNotes}
                  onChange={(e) => setRejectNotes(e.target.value)}
                  placeholder="E.g. Checked CIB online banking at 14:30 - no matching transaction."
                  className="w-full px-3 py-2 bg-amber-950 border border-amber-800/60 rounded-xl text-white placeholder-amber-400/40 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-amber-900/60">
                <button
                  type="button"
                  onClick={() => setRejectingRecord(null)}
                  className="px-4 py-2 bg-amber-950 text-amber-200 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-6 py-2 bg-rose-700 hover:bg-rose-600 text-white rounded-xl font-bold uppercase tracking-wider transition"
                >
                  {isProcessing ? 'Rejecting...' : 'Confirm Rejection & Send WhatsApp'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
