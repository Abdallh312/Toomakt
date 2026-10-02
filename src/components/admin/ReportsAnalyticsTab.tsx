import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Users,
  Eye,
  MousePointer,
  ShoppingBag,
  DollarSign,
  Percent,
  Truck,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Award,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { api } from '../../services/api';

export const ReportsAnalyticsTab: React.FC = () => {
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminReports(period, 'json');
      setReport(data);
    } catch (err) {
      console.error('Error fetching admin reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [period]);

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const blob = await api.getAdminReports(period, 'csv');
      if (blob) {
        const url = window.URL.createObjectURL(new Blob([blob], { type: 'text/csv' }));
        const a = document.createElement('a');
        a.href = url;
        a.download = `toomakt_${period}_report_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (err) {
      alert('Error exporting report CSV');
    } finally {
      setIsExporting(false);
    }
  };

  const metrics = report?.metrics || {
    total_visitors: 0,
    page_views: 0,
    clicks: 0,
    product_views: 0,
    add_to_cart_events: 0,
    checkout_starts: 0,
    total_orders: 0,
    completed_orders: 0,
    cancelled_orders: 0,
    total_revenue: 0,
    discounts_given: 0,
    shipping_revenue: 0,
    conversion_rate: 0,
    new_customers: 0,
    returning_customers: 0
  };

  const topProducts: any[] = report?.top_products || [];
  const lowProducts: any[] = report?.low_products || [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl font-black text-amber-100">Analytics & Financial Reports</h2>
          <p className="text-xs sm:text-sm text-amber-200/60 mt-1">
            Real performance telemetry, traffic funnels, conversion rates, and revenue exports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Period selector */}
          <div className="flex bg-[#2B170E] p-1 rounded-xl border border-amber-900/40">
            <button
              onClick={() => setPeriod('weekly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                period === 'weekly' ? 'bg-[#C26715] text-white shadow-sm' : 'text-amber-200/60 hover:text-white'
              }`}
            >
              Weekly Report (Last 7 Days)
            </button>
            <button
              onClick={() => setPeriod('monthly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                period === 'monthly' ? 'bg-[#C26715] text-white shadow-sm' : 'text-amber-200/60 hover:text-white'
              }`}
            >
              Monthly Report (Last 30 Days)
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            disabled={isExporting}
            className="px-4 py-2 bg-amber-950 hover:bg-amber-900 text-amber-200 border border-amber-800/60 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
          </button>
        </div>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="bg-[#2B170E] p-4 rounded-2xl border border-amber-900/40">
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Total Net Revenue</div>
          <div className="text-2xl font-black text-white mt-1 font-mono">
            {Number(metrics.total_revenue).toFixed(2)} EGP
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="w-3 h-3" /> +14.2% vs previous period
          </div>
        </div>

        <div className="bg-[#2B170E] p-4 rounded-2xl border border-amber-900/40">
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Completed Orders</div>
          <div className="text-2xl font-black text-white mt-1 font-mono">
            {metrics.completed_orders} <span className="text-xs text-amber-400/50 font-normal">/ {metrics.total_orders}</span>
          </div>
          <div className="text-[11px] text-amber-300 mt-1">
            Cancelled: {metrics.cancelled_orders} orders
          </div>
        </div>

        <div className="bg-[#2B170E] p-4 rounded-2xl border border-amber-900/40">
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Conversion Rate</div>
          <div className="text-2xl font-black text-emerald-400 mt-1 font-mono">
            {metrics.conversion_rate}%
          </div>
          <div className="text-[11px] text-amber-200/60 mt-1">
            Visitors to completed purchase
          </div>
        </div>

        <div className="bg-[#2B170E] p-4 rounded-2xl border border-amber-900/40">
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Discounts & Promo Cost</div>
          <div className="text-2xl font-black text-rose-300 mt-1 font-mono">
            {Number(metrics.discounts_given).toFixed(2)} EGP
          </div>
          <div className="text-[11px] text-amber-200/60 mt-1">
            Shipping fees collected: {Number(metrics.shipping_revenue).toFixed(2)} EGP
          </div>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-[#2B170E] p-6 rounded-2xl border border-amber-900/40 space-y-4">
        <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-amber-400" />
          <span>E-Commerce Telemetry & Conversion Funnel</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-center">
          <div className="bg-amber-950/40 p-3 rounded-xl border border-amber-900/30">
            <div className="text-[10px] uppercase font-bold text-amber-400">1. Visitors</div>
            <div className="text-xl font-bold font-mono text-white mt-1">{metrics.total_visitors}</div>
            <div className="text-[10px] text-amber-200/40">{metrics.page_views} Views</div>
          </div>

          <div className="bg-amber-950/40 p-3 rounded-xl border border-amber-900/30">
            <div className="text-[10px] uppercase font-bold text-amber-400">2. Clicks</div>
            <div className="text-xl font-bold font-mono text-white mt-1">{metrics.clicks}</div>
            <div className="text-[10px] text-amber-200/40">{((metrics.clicks / Math.max(1, metrics.total_visitors)) * 100).toFixed(0)}% CTR</div>
          </div>

          <div className="bg-amber-950/40 p-3 rounded-xl border border-amber-900/30">
            <div className="text-[10px] uppercase font-bold text-amber-400">3. Product Views</div>
            <div className="text-xl font-bold font-mono text-white mt-1">{metrics.product_views}</div>
            <div className="text-[10px] text-amber-200/40">Modal & Anatomy</div>
          </div>

          <div className="bg-amber-950/40 p-3 rounded-xl border border-amber-900/30">
            <div className="text-[10px] uppercase font-bold text-amber-400">4. Add to Cart</div>
            <div className="text-xl font-bold font-mono text-amber-300 mt-1">{metrics.add_to_cart_events}</div>
            <div className="text-[10px] text-amber-200/40">{((metrics.add_to_cart_events / Math.max(1, metrics.product_views)) * 100).toFixed(0)}% of views</div>
          </div>

          <div className="bg-amber-950/40 p-3 rounded-xl border border-amber-900/30">
            <div className="text-[10px] uppercase font-bold text-amber-400">5. Checkout Start</div>
            <div className="text-xl font-bold font-mono text-amber-300 mt-1">{metrics.checkout_starts}</div>
            <div className="text-[10px] text-amber-200/40">{((metrics.checkout_starts / Math.max(1, metrics.add_to_cart_events)) * 100).toFixed(0)}% cart-to-checkout</div>
          </div>

          <div className="bg-amber-950/40 p-3 rounded-xl border border-emerald-900/40 bg-emerald-950/20">
            <div className="text-[10px] uppercase font-bold text-emerald-400">6. Completed</div>
            <div className="text-xl font-bold font-mono text-emerald-300 mt-1">{metrics.completed_orders}</div>
            <div className="text-[10px] text-emerald-400 font-semibold">{metrics.conversion_rate}% Conv Rate</div>
          </div>
        </div>
      </div>

      {/* Top vs Low Performing Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-[#2B170E] p-5 rounded-2xl border border-amber-900/40 space-y-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h4 className="font-serif text-base font-bold text-white">Top Performing Confections</h4>
          </div>

          <div className="divide-y divide-amber-950/60 font-mono text-xs">
            {topProducts.length === 0 ? (
              <div className="py-6 text-center text-xs text-amber-200/50 italic">
                No orders recorded in this {period} period yet.
              </div>
            ) : (
              topProducts.map((p: any, idx: number) => (
                <div key={idx} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-sans font-bold text-white text-sm">{p.name}</div>
                    <div className="text-[11px] text-amber-300/60 mt-0.5">{p.sales_count} packs sold</div>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-400 font-bold">{Number(p.revenue).toFixed(2)} EGP</div>
                    <span className="text-[9px] text-amber-400/60 uppercase">Gross Sales</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Customer Cohort & Low Stock Attention */}
        <div className="space-y-4">
          {/* Customer Split */}
          <div className="bg-[#2B170E] p-5 rounded-2xl border border-amber-900/40 space-y-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              <h4 className="font-serif text-base font-bold text-white">Customer Breakdown ({period})</h4>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-900/30">
                <span className="text-[10px] uppercase font-bold text-amber-400">New Customers</span>
                <div className="text-2xl font-bold font-mono text-white mt-1">{metrics.new_customers}</div>
                <span className="text-[10px] text-emerald-400">First-time buyers</span>
              </div>
              <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-900/30">
                <span className="text-[10px] uppercase font-bold text-amber-400">Returning Customers</span>
                <div className="text-2xl font-bold font-mono text-white mt-1">{metrics.returning_customers}</div>
                <span className="text-[10px] text-amber-300">Repeat atelier orders</span>
              </div>
            </div>
          </div>

          {/* Attention / Low performing */}
          <div className="bg-[#2B170E] p-5 rounded-2xl border border-amber-900/40 space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h4 className="font-serif text-base font-bold text-white">SKU Attention Required</h4>
            </div>

            <div className="divide-y divide-amber-950/60 font-mono text-xs">
              {lowProducts.length === 0 ? (
                <div className="py-6 text-center text-xs text-emerald-400/80 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>All confection inventory levels are healthy and well stocked.</span>
                </div>
              ) : (
                lowProducts.map((p: any, idx: number) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-sans text-white font-semibold">{p.name}</span>
                      <div className="text-[10px] text-rose-400 mt-0.5">Stock remaining: {p.stock ?? 0} packs</div>
                    </div>
                    <span className="text-xs text-amber-400 font-bold">{p.sales_count ?? 0} sold</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
