import React, { useState } from 'react';
import { Check, Search, Package, Truck, Sparkles, MapPin } from 'lucide-react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export const TrackOrderView: React.FC = () => {
  const { isRtl } = useLanguage();
  const [orderQuery, setOrderQuery] = useState('');
  const [orderData, setOrderData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await api.trackOrder(orderQuery.trim());
      if (data) {
        setOrderData(data);
      } else {
        setErrorMsg('Order not found. Please verify your order number (e.g. TK-8491).');
      }
    } catch {
      setErrorMsg('Error querying order tracking server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 select-none">
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="badge-neo bg-[#FFE842] text-[#1F1127] mb-3">
          {isRtl ? 'تتبع فوري للطلب' : 'LIVE ATELIER TELEMETRY'}
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-black text-[#1F1127] uppercase tracking-tight mt-2">
          {isRtl ? 'تتبع بوكس طقس الفواكه' : 'TRACK YOUR WEATHER BOX'}
        </h1>
        <p className="text-xs sm:text-sm font-bold text-[#1F1127]/80 mt-2">
          {isRtl
            ? 'تابع رحلة البوكس من طهي المراجل النحاسية وحتى التوصيل المبرد على باب بيتك.'
            : 'Monitor your fruit weather confections from atelier preparation to doorstep delivery.'}
        </p>
      </div>

      <form onSubmit={handleTrack} className="max-w-md mx-auto flex gap-3 mb-10">
        <input
          type="text"
          placeholder="ENTER ORDER # (e.g. TK-8491)"
          value={orderQuery}
          onChange={(e) => setOrderQuery(e.target.value.toUpperCase())}
          className="flex-1 px-4 py-3 bg-[#FFFDF5] border-2 border-[#1F1127] rounded-full text-xs sm:text-sm text-[#1F1127] font-mono font-bold uppercase focus:outline-none shadow-neo-sm"
        />
        <button
          type="submit"
          className="btn-neo bg-[#FF5E2B] text-white px-7 py-3 text-xs font-black uppercase tracking-wider hover:bg-[#ff480e] shadow-neo cursor-pointer"
        >
          {loading ? 'LOOKING...' : 'TRACK'}
        </button>
      </form>

      {errorMsg && (
        <div className="max-w-md mx-auto p-4 bg-[#FF4D8D]/20 border-2 border-[#1F1127] text-[#1F1127] rounded-2xl text-xs font-bold text-center mb-8 shadow-neo-sm">
          {errorMsg}
        </div>
      )}

      {orderData && (
        <div className="bg-[#FFFDF5] rounded-3xl p-6 sm:p-8 border-3 border-[#1F1127] shadow-neo-lg space-y-8 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b-2 border-[#1F1127]/15">
            <div>
              <span className="badge-neo bg-[#C4E86E] text-[#1F1127] text-[10px] mb-1">
                VERIFIED HARVEST
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-[#1F1127] uppercase">
                {orderData.order_number}
              </h2>
              <span className="text-xs font-bold text-[#1F1127]/70">
                Destination: {orderData.customer_name} ({orderData.governorate || 'Cairo'}, Egypt)
              </span>
            </div>
            <div className="text-right">
              <span className="badge-neo bg-[#FFE842] text-[#1F1127] text-xs">
                STATUS: {orderData.status || 'SHIPPED'}
              </span>
              <div className="text-xs font-mono font-black text-[#FF5E2B] mt-1.5">
                Total: {Number(orderData.total_amount).toFixed(2)} EGP
              </div>
            </div>
          </div>

          {/* Timeline steps */}
          <div>
            <h3 className="font-display text-lg font-black text-[#1F1127] uppercase mb-6">
              Fulfillment Journey
            </h3>
            <div className="space-y-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#1F1127]">
              {[
                { title: 'Order Confirmed in Weather Forecast', desc: 'Atelier received your fruit selection.', active: true },
                { title: 'Cooked in French Copper Cauldrons', desc: 'Simmered with 100% natural fruit puree & Normandy butter.', active: true },
                { title: 'Packed in Thermal Insulated Cooler Box', desc: 'Protected against heat with temperature ice bricks.', active: true },
                { title: 'Dispatched with Express Courier', desc: `Carrier tracking: ${orderData.tracking_number || 'EXP-CAIRO-902'}`, active: orderData.status === 'shipped' || orderData.status === 'delivered' },
                { title: 'Delivered to Your Doorstep', desc: '100% Chance of Joy unlocked.', active: orderData.status === 'delivered' }
              ].map((step, idx) => (
                <div key={idx} className="flex items-start gap-4 relative">
                  <div className={`w-8 h-8 rounded-full border-2 border-[#1F1127] flex items-center justify-center text-xs font-black z-10 ${
                    step.active ? 'bg-[#FFE842] text-[#1F1127] shadow-neo-sm' : 'bg-gray-200 text-gray-400'
                  }`}>
                    {step.active ? <Check className="w-4 h-4" /> : idx + 1}
                  </div>
                  <div>
                    <div className="font-display text-sm font-black uppercase text-[#1F1127]">{step.title}</div>
                    <div className="text-xs font-bold text-[#1F1127]/70 mt-0.5">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
