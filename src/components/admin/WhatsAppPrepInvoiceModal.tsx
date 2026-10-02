import React, { useState } from 'react';
import { MessageCircle, Copy, Check, Download, ExternalLink, X, Package, ShieldCheck } from 'lucide-react';
import { WhatsAppService } from '../../services/whatsapp';

interface WhatsAppPrepInvoiceModalProps {
  order: any;
  onClose: () => void;
}

export const WhatsAppPrepInvoiceModal: React.FC<WhatsAppPrepInvoiceModalProps> = ({ order, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  const invoiceMessage = WhatsAppService.getOrderPreparingMessage(order);
  const customerPhone = order.customer_phone || '';
  const waUrl = WhatsAppService.getWhatsAppChatUrl(customerPhone, invoiceMessage);

  const handleCopy = () => {
    navigator.clipboard.writeText(invoiceMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendWhatsApp = () => {
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#2B170E] border border-amber-900/80 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-900/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-600/50 flex items-center justify-center text-emerald-400">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">Order #{order.order_number} is PREPARING</h3>
              <p className="text-xs text-amber-200/60">Finalized WhatsApp Invoice Ready for Dispatch</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-amber-400/80 hover:text-white hover:bg-white/10 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verification guarantee notice */}
        <div className="p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-xl flex items-center gap-2.5 text-emerald-300 text-xs">
          <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-400" />
          <span>Payment verified & approved. Customer order is now in confectionery preparation.</span>
        </div>

        {/* Formatted Invoice Preview */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              WhatsApp Invoice Message Preview
            </span>
            <span className="text-[10px] text-amber-300/50 font-mono">
              To: {order.customer_name} ({customerPhone || 'No phone'})
            </span>
          </div>

          <div className="bg-amber-950/70 border border-amber-900/50 rounded-2xl p-4 font-mono text-xs text-amber-100 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
            {invoiceMessage}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-amber-900/60">
          <button
            onClick={handleCopy}
            className="w-full py-2.5 px-4 bg-amber-950 hover:bg-amber-900 text-amber-200 border border-amber-800/60 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Invoice Text'}</span>
          </button>

          <button
            onClick={handleSendWhatsApp}
            disabled={!customerPhone}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Send via WhatsApp</span>
          </button>
        </div>

        <div className="flex items-center justify-between pt-2 text-[11px] text-amber-300/60">
          <a
            href={`http://127.0.0.1:8000/api/orders/${order.order_number}/invoice/`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 hover:text-white underline"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Official PDF Invoice</span>
          </a>
          <button onClick={onClose} className="hover:text-white underline">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
