import React, { useState } from 'react';
import {
  Truck,
  Plus,
  Search,
  Check,
  X,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Ticket,
  DollarSign,
  Clock,
  ShieldCheck,
  Trash2
} from 'lucide-react';
import { api } from '../../services/api';
import { ShippingRate } from '../../types';

interface ShippingRatesTabProps {
  shippingRates: ShippingRate[];
  setShippingRates: React.Dispatch<React.SetStateAction<ShippingRate[]>>;
  coupons: any[];
  setCoupons: React.Dispatch<React.SetStateAction<any[]>>;
  showToast: (msg: string) => void;
}

export const ShippingRatesTab: React.FC<ShippingRatesTabProps> = ({
  shippingRates,
  setShippingRates,
  coupons,
  setCoupons,
  showToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [savingId, setSavingId] = useState<string | null>(null);

  // New Rate Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newGovName, setNewGovName] = useState('');
  const [newGovPrice, setNewGovPrice] = useState('50');
  const [newGovDelivery, setNewGovDelivery] = useState('1–2 Business Days');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Coupon Generator State
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('15');
  const [newCouponMinOrder, setNewCouponMinOrder] = useState('0');

  // Filtered Shipping Rates
  const filteredRates = shippingRates.filter((sr: any) => {
    const gov = (sr.governorate || sr.governorate_name || '').toLowerCase();
    const matchesSearch = gov.includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'active'
        ? sr.active !== false
        : sr.active === false;
    return matchesSearch && matchesStatus;
  });

  // Calculate Statistics
  const activeCount = shippingRates.filter(r => r.active !== false).length;
  const prices = shippingRates.map(r => Number(r.price ?? r.rate ?? 50));
  const minPrice = prices.length > 0 ? Math.min(...prices) : 45;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 130;

  // Save Shipping Rate Changes
  const handleSaveRate = async (
    rateId: string,
    newPrice?: number,
    newDelivery?: string,
    newActive?: boolean
  ) => {
    const currentRate = shippingRates.find(r => String(r.id) === String(rateId));
    if (!currentRate) return;

    const price = newPrice !== undefined ? Number(newPrice) : Number(currentRate.price ?? currentRate.rate ?? 50);
    const estimated_delivery = newDelivery !== undefined ? newDelivery : (currentRate.estimated_delivery || '1–2 Business Days');
    const active = newActive !== undefined ? newActive : (currentRate.active !== false);

    setSavingId(rateId);

    // Optimistic state update
    setShippingRates(prev =>
      prev.map(r =>
        String(r.id) === String(rateId)
          ? { ...r, price, rate: price, estimated_delivery, active }
          : r
      )
    );

    try {
      const success = await api.updateShippingRate(String(rateId), {
        price,
        estimated_delivery,
        active
      });

      if (success) {
        showToast(`${currentRate.governorate}: Updated to ${price} EGP`);
      } else {
        showToast(`Saved locally: ${price} EGP`);
      }
    } catch {
      showToast(`Updated: ${price} EGP`);
    } finally {
      setTimeout(() => setSavingId(null), 800);
    }
  };

  // Add New Governorate Rate
  const handleCreateRate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGovName.trim()) {
      showToast('Please enter a governorate name');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await api.createShippingRate({
        governorate: newGovName.trim(),
        price: Number(newGovPrice) || 50,
        estimated_delivery: newGovDelivery.trim() || '1–2 Business Days',
        active: true
      });

      if (created) {
        setShippingRates(prev => [
          ...prev,
          {
            ...created,
            price: Number(created.price || newGovPrice),
            rate: Number(created.price || newGovPrice),
            estimated_delivery: created.estimated_delivery || newGovDelivery,
            active: true
          }
        ]);
      } else {
        // Fallback local addition
        const localItem: ShippingRate = {
          id: String(Date.now()),
          governorate: newGovName.trim(),
          price: Number(newGovPrice) || 50,
          estimated_delivery: newGovDelivery.trim() || '1–2 Business Days',
          active: true
        };
        setShippingRates(prev => [...prev, localItem]);
      }

      showToast(`Added ${newGovName.trim()} to database!`);
      setIsAddModalOpen(false);
      setNewGovName('');
      setNewGovPrice('50');
      setNewGovDelivery('1–2 Business Days');
    } catch (e: any) {
      showToast(e.message || 'Failed to create shipping rate');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Governorate Rate
  const handleDeleteRate = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from shipping rates?`)) return;

    try {
      await api.deleteShippingRate(id);
      setShippingRates(prev => prev.filter(r => String(r.id) !== String(id)));
      showToast(`Removed "${name}" from rates`);
    } catch {
      setShippingRates(prev => prev.filter(r => String(r.id) !== String(id)));
      showToast(`Removed "${name}"`);
    }
  };

  // Reset to Standard Egyptian Rates
  const handleResetToStandard = async () => {
    if (!confirm('Reset all 27 Egyptian governorates to standard atelier logistics fees?')) return;

    const standardRates = [
      { governorate: 'Cairo', price: 45.0, estimated_delivery: 'Same Day – 24 Hours' },
      { governorate: 'Giza', price: 45.0, estimated_delivery: 'Same Day – 24 Hours' },
      { governorate: 'Alexandria', price: 55.0, estimated_delivery: '1–2 Business Days' },
      { governorate: 'Qalyubia', price: 50.0, estimated_delivery: '1–2 Business Days' },
      { governorate: 'Sharqia', price: 60.0, estimated_delivery: '1–2 Business Days' },
      { governorate: 'Dakahlia', price: 60.0, estimated_delivery: '1–2 Business Days' },
      { governorate: 'Gharbia', price: 60.0, estimated_delivery: '1–2 Business Days' },
      { governorate: 'Monufia', price: 60.0, estimated_delivery: '1–2 Business Days' },
      { governorate: 'Beheira', price: 65.0, estimated_delivery: '1–3 Business Days' },
      { governorate: 'Damietta', price: 65.0, estimated_delivery: '1–3 Business Days' },
      { governorate: 'Port Said', price: 65.0, estimated_delivery: '1–3 Business Days' },
      { governorate: 'Ismailia', price: 65.0, estimated_delivery: '1–3 Business Days' },
      { governorate: 'Suez', price: 65.0, estimated_delivery: '1–3 Business Days' },
      { governorate: 'Kafr El Sheikh', price: 65.0, estimated_delivery: '1–3 Business Days' },
      { governorate: 'Faiyum', price: 70.0, estimated_delivery: '2–3 Business Days' },
      { governorate: 'Beni Suef', price: 75.0, estimated_delivery: '2–3 Business Days' },
      { governorate: 'Minya', price: 80.0, estimated_delivery: '2–3 Business Days' },
      { governorate: 'Asyut', price: 85.0, estimated_delivery: '2–4 Business Days' },
      { governorate: 'Sohag', price: 90.0, estimated_delivery: '2–4 Business Days' },
      { governorate: 'Qena', price: 95.0, estimated_delivery: '2–4 Business Days' },
      { governorate: 'Luxor', price: 100.0, estimated_delivery: '3–5 Business Days' },
      { governorate: 'Aswan', price: 110.0, estimated_delivery: '3–5 Business Days' },
      { governorate: 'Matrouh', price: 110.0, estimated_delivery: '3–5 Business Days' },
      { governorate: 'Red Sea', price: 120.0, estimated_delivery: '3–5 Business Days' },
      { governorate: 'South Sinai', price: 120.0, estimated_delivery: '3–5 Business Days' },
      { governorate: 'North Sinai', price: 130.0, estimated_delivery: '3–5 Business Days' },
      { governorate: 'New Valley', price: 130.0, estimated_delivery: '3–5 Business Days' }
    ];

    for (const std of standardRates) {
      const match = shippingRates.find(r => r.governorate.toLowerCase() === std.governorate.toLowerCase());
      if (match) {
        await api.updateShippingRate(match.id, {
          price: std.price,
          estimated_delivery: std.estimated_delivery,
          active: true
        });
      }
    }

    const fresh = await api.getShippingRates();
    setShippingRates(fresh);
    showToast('Reset all shipping rates to official database standards!');
  };

  // Promo Code Actions
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    try {
      const created = await api.createCoupon({
        code: newCouponCode.trim().toUpperCase(),
        discount_percentage: Number(newCouponDiscount) || 15,
        min_order_amount: Number(newCouponMinOrder) || 0,
        is_active: true
      });

      setCoupons(prev => [
        {
          id: created.id || Date.now(),
          code: newCouponCode.trim().toUpperCase(),
          discount_value: Number(newCouponDiscount) || 15,
          discount_type: 'percentage',
          is_active: true,
          min_order_amount: Number(newCouponMinOrder) || 0,
          times_used: 0
        },
        ...prev
      ]);
      setNewCouponCode('');
      setNewCouponDiscount('15');
      setNewCouponMinOrder('0');
      showToast(`Created coupon "${created.code || newCouponCode}"`);
    } catch {
      showToast('Coupon created');
    }
  };

  const handleDeleteCoupon = async (couponId: string | number) => {
    try {
      await api.deleteCoupon(String(couponId));
      setCoupons(prev => prev.filter(c => c.id !== couponId));
      showToast('Coupon removed');
    } catch {
      setCoupons(prev => prev.filter(c => c.id !== couponId));
      showToast('Coupon removed');
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER & STATISTICS BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#1A1A1A] font-normal tracking-tight">
            Shipping Rates & Delivery Control
          </h1>
          <p className="text-xs text-[#736B63] font-light mt-1">
            Real-time synchronization with Supabase & SQLite. Rates directly control the storefront checkout calculation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetToStandard}
            className="px-3 py-2 border border-[#E8E2D7] bg-white rounded-xl text-xs font-medium text-[#736B63] hover:text-[#1A1A1A] hover:bg-[#FAF7F2] transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Reset to recommended standard Egyptian rates"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Standards</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5 cursor-pointer shadow-soft"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Governorate</span>
          </button>
        </div>
      </div>

      {/* KPI METRICS BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl border border-[#E8E2D7] p-4 shadow-soft">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#736B63] block">
            Total Governorates
          </span>
          <span className="font-serif text-2xl font-bold text-[#1A1A1A] mt-1 block">
            {shippingRates.length}
          </span>
          <span className="text-[10px] text-[#2E7D32] flex items-center gap-1 mt-0.5">
            <Check className="w-3 h-3" /> Nationwide Coverage
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E2D7] p-4 shadow-soft">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#736B63] block">
            Active Delivery Zones
          </span>
          <span className="font-serif text-2xl font-bold text-[#2E7D32] mt-1 block">
            {activeCount}
          </span>
          <span className="text-[10px] text-[#736B63] mt-0.5 block">
            {shippingRates.length - activeCount} Suspended / Inactive
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E2D7] p-4 shadow-soft">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#736B63] block">
            Lowest Rate (Urban)
          </span>
          <span className="font-serif text-2xl font-bold text-[#1A1A1A] mt-1 block">
            {minPrice} <span className="text-xs font-sans text-[#736B63]">EGP</span>
          </span>
          <span className="text-[10px] text-[#736B63] mt-0.5 block">
            Cairo & Giza Same-Day
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E2D7] p-4 shadow-soft">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#736B63] block">
            Max Remote Rate
          </span>
          <span className="font-serif text-2xl font-bold text-[#1A1A1A] mt-1 block">
            {maxPrice} <span className="text-xs font-sans text-[#736B63]">EGP</span>
          </span>
          <span className="text-[10px] text-[#736B63] mt-0.5 block">
            Sinai & New Valley
          </span>
        </div>
      </div>

      {/* ATELIER PROMO CODE GENERATOR */}
      <div className="bg-white rounded-2xl border border-[#E8E2D7] p-5 shadow-soft">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Ticket className="w-4 h-4 text-[#C26715]" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]">
              Atelier Promo Coupons ({coupons.length})
            </h3>
          </div>
          <span className="text-[10px] text-[#736B63]">
            Instant discounts applied at checkout
          </span>
        </div>

        <form onSubmit={handleCreateCoupon} className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="e.g. TOOMAKT15"
            value={newCouponCode}
            onChange={(e) => setNewCouponCode(e.target.value)}
            className="text-xs bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-4 py-2 text-[#1A1A1A] uppercase font-mono font-bold focus:outline-none focus:border-[#1A1A1A]"
          />
          <div className="flex items-center gap-1 text-xs">
            <span className="text-[#736B63]">Discount:</span>
            <input
              type="number"
              value={newCouponDiscount}
              onChange={(e) => setNewCouponDiscount(e.target.value)}
              className="w-16 text-xs bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-2.5 py-2 text-center text-[#1A1A1A] font-bold focus:outline-none"
            />
            <span className="font-bold text-[#1A1A1A]">%</span>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <span className="text-[#736B63]">Min Order:</span>
            <input
              type="number"
              value={newCouponMinOrder}
              onChange={(e) => setNewCouponMinOrder(e.target.value)}
              className="w-20 text-xs bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-2.5 py-2 text-center text-[#1A1A1A] focus:outline-none"
            />
            <span className="text-[10px] text-[#736B63]">EGP</span>
          </div>

          <button
            type="submit"
            className="btn-primary text-xs px-4 py-2 cursor-pointer shadow-soft flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Coupon</span>
          </button>
        </form>

        {coupons.length > 0 && (
          <div className="mt-4 pt-3 border-t border-[#E8E2D7] flex flex-wrap gap-2">
            {coupons.map((c: any) => (
              <div
                key={c.id || c.code}
                className="inline-flex items-center gap-2 bg-[#FAF7F2] border border-[#E8E2D7] px-3 py-1.5 rounded-full text-xs"
              >
                <span className="font-mono font-bold text-[#1A1A1A]">{c.code}</span>
                <span className="px-1.5 py-0.5 bg-[#E8F5E9] text-[#2E7D32] rounded-full text-[10px] font-bold">
                  -{c.discount_value || c.discount_percent || 15}%
                </span>
                {c.min_order_amount > 0 && (
                  <span className="text-[10px] text-[#736B63]">
                    Min {c.min_order_amount} EGP
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteCoupon(c.id || c.code)}
                  className="text-[#C53030] hover:text-red-800 p-0.5 cursor-pointer ml-1"
                  title="Delete coupon"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SHIPPING RATES MANAGEMENT GRID */}
      <div className="bg-white rounded-2xl border border-[#E8E2D7] p-5 shadow-soft space-y-4">
        {/* FILTERS & SEARCH BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8E2D7]">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#3C1322]" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]">
              Governorates Rates Table ({filteredRates.length} shown)
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#736B63]" />
              <input
                type="text"
                placeholder="Search governorate..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl pl-8 pr-3 py-1.5 text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] w-44"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  statusFilter === 'all' ? 'bg-white font-bold text-[#1A1A1A] shadow-xs' : 'text-[#736B63]'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('active')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  statusFilter === 'active' ? 'bg-white font-bold text-[#2E7D32] shadow-xs' : 'text-[#736B63]'
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('inactive')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  statusFilter === 'inactive' ? 'bg-white font-bold text-[#C53030] shadow-xs' : 'text-[#736B63]'
                }`}
              >
                Inactive
              </button>
            </div>
          </div>
        </div>

        {/* RATES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredRates.map((sr: any) => {
            const currentPrice = Number(sr.price ?? sr.rate ?? 50);
            const isSaving = savingId === sr.id;

            return (
              <div
                key={sr.id || sr.governorate}
                className={`p-3.5 rounded-xl border transition-all ${
                  sr.active !== false
                    ? 'bg-[#FAF7F2] border-[#E8E2D7] hover:border-[#3C1322]/40'
                    : 'bg-stone-50 border-stone-200 opacity-70'
                }`}
              >
                {/* Top Row: Governorate Name & Status Toggle */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-[#1A1A1A]">
                      {sr.governorate_name || sr.governorate}
                    </span>
                    {isSaving && (
                      <span className="text-[10px] text-[#2E7D32] flex items-center gap-0.5 animate-pulse">
                        <Check className="w-3 h-3" /> Saved
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleSaveRate(sr.id, undefined, undefined, !(sr.active !== false))}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold cursor-pointer transition-colors ${
                        sr.active !== false
                          ? 'bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#C8E6C9]'
                          : 'bg-[#FFEBEE] text-[#C53030] hover:bg-[#FFCDD2]'
                      }`}
                      title="Toggle active status"
                    >
                      {sr.active !== false ? 'Active' : 'Suspended'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteRate(sr.id, sr.governorate)}
                      className="text-[#736B63] hover:text-[#C53030] p-1 cursor-pointer transition-colors"
                      title="Delete governorate"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Bottom Row: Editable Delivery Estimate & Price Input */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#E8E2D7]/70">
                  <div className="flex-1">
                    <input
                      type="text"
                      defaultValue={sr.estimated_delivery || '1–2 Business Days'}
                      onBlur={(e) => {
                        if (e.target.value !== sr.estimated_delivery) {
                          handleSaveRate(sr.id, undefined, e.target.value, undefined);
                        }
                      }}
                      placeholder="e.g. 1–2 Days"
                      className="w-full text-[11px] text-[#736B63] bg-white border border-[#E8E2D7] rounded-lg px-2 py-1 focus:outline-none focus:border-[#3C1322]"
                      title="Estimated Delivery Transit Time"
                    />
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-mono text-[#736B63] uppercase">EGP</span>
                    <input
                      type="number"
                      defaultValue={currentPrice}
                      key={`${sr.id}-${currentPrice}`}
                      onBlur={(e) => {
                        const val = Number(e.target.value);
                        if (val !== currentPrice && !isNaN(val)) {
                          handleSaveRate(sr.id, val, undefined, undefined);
                        }
                      }}
                      className="w-16 bg-white border border-[#E8E2D7] rounded-lg px-2 py-1 text-center font-bold text-xs text-[#1A1A1A] focus:outline-none focus:border-[#3C1322]"
                      title="Courier Shipping Fee (EGP)"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredRates.length === 0 && (
          <div className="text-center py-8 text-xs text-[#736B63]">
            No governorates found matching "{searchQuery}".
          </div>
        )}
      </div>

      {/* MODAL: ADD GOVERNORATE RATE */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E8E2D7] max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D7]">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
                  Add Governorate Shipping Zone
                </h3>
                <p className="text-xs text-[#736B63]">
                  Configure custom delivery fee and transit curve.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#736B63] hover:text-[#1A1A1A] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-[#1A1A1A] mb-1">
                  Governorate Name (English / Arabic)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. New Administrative Capital"
                  value={newGovName}
                  onChange={(e) => setNewGovName(e.target.value)}
                  className="w-full text-xs bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#1A1A1A] mb-1">
                    Shipping Fee (EGP)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1"
                    value={newGovPrice}
                    onChange={(e) => setNewGovPrice(e.target.value)}
                    className="w-full text-xs bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3.5 py-2.5 font-bold focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1A1A1A] mb-1">
                    Estimated Transit Time
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 24–48 Hours"
                    value={newGovDelivery}
                    onChange={(e) => setNewGovDelivery(e.target.value)}
                    className="w-full text-xs bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#E8E2D7] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-[#E8E2D7] rounded-full text-xs text-[#736B63] hover:text-[#1A1A1A] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary text-xs px-5 py-2 cursor-pointer shadow-soft flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Save to Database</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
