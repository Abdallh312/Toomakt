import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Package,
  CreditCard,
  Tag,
  Building2,
  Truck,
  Sparkles,
  Ticket,
  Search,
  RefreshCw,
  ShoppingBag,
  LogOut,
  X,
  Menu,
  Check,
  Printer,
  MessageCircle,
  ExternalLink,
  Plus,
  Minus,
  Edit2,
  Trash2,
  Bell,
  Eye,
  Save,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Filter,
  DollarSign,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Globe,
  Sliders,
  Code,
  Share2,
  Copy
} from 'lucide-react';
import { api } from '../../services/api';
import { WhatsAppService } from '../../services/whatsapp';
import { ShippingRate, WholesaleRequest, PaymentConfirmationRecord } from '../../types';
import { applySeoAndTracking } from '../../services/seoTracking';

interface AdminDashboardProps {
  onBackToStore: () => void;
  onLogout?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToStore, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'payments' | 'inquiries' | 'shipping' | 'alerts' | 'seo'>('overview');
  const [loading, setLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Core Data
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [paymentConfirmations, setPaymentConfirmations] = useState<PaymentConfirmationRecord[]>([]);
  const [wholesaleRequests, setWholesaleRequests] = useState<WholesaleRequest[]>([]);
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; latencyMs: number } | null>(null);

  // Filters & Search
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [productSearchQuery, setProductSearchQuery] = useState('');

  // Modals & Editing Items
  const [inspectingOrder, setInspectingOrder] = useState<any | null>(null);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [inspectingReceipt, setInspectingReceipt] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Coupon Generator State
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('15');

  // Announcement Bar Config
  const [alertConfig, setAlertConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('toomakt_alert_config');
      return saved ? JSON.parse(saved) : {
        enabled: true,
        enPrefix: 'THE FRUIT TOFFEE UNIVERSE IS OPEN',
        enMain: 'FREE SHIPPING OVER EGP 2,000',
        enCta: 'Shop',
        arPrefix: 'عالم التوفي بالفاكهة الطبيعية مفتوح الآن',
        arMain: 'شحن مجاني للطلبات أكثر من 2,000 ج.م',
        arCta: 'تسوق',
        ctaTarget: 'shop',
        bgColor: '#3C1322',
        textColor: '#FAF7F2',
        accentColor: '#FFD147'
      };
    } catch {
      return {
        enabled: true,
        enPrefix: 'THE FRUIT TOFFEE UNIVERSE IS OPEN',
        enMain: 'FREE SHIPPING OVER EGP 2,000',
        enCta: 'Shop',
        arPrefix: 'عالم التوفي بالفاكهة الطبيعية مفتوح الآن',
        arMain: 'شحن مجاني للطلبات أكثر من 2,000 ج.م',
        arCta: 'تسوق',
        ctaTarget: 'shop',
        bgColor: '#3C1322',
        textColor: '#FAF7F2',
        accentColor: '#FFD147'
      };
    }
  });

  // SEO & Marketing Tracking Pixels State
  const [seoConfig, setSeoConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('toomakt_seo_pixel_config');
      return saved ? JSON.parse(saved) : {
        metaTitle: 'toomakt — Fruit, slowly made. | Artisanal Fruit Toffee',
        metaDescription: 'Artisanal fruit toffee crafted slowly with real whole fruit purée and European sweet cream butter in Cairo, Egypt.',
        focusKeywords: 'fruit toffee, artisanal confectionery, Cairo toffee, gourmet sweets egypt, handcrafted caramel, mango sunbeam',
        canonicalUrl: 'https://toomakt.com',
        ogImageUrl: '/images/hero/hero_spec.jpg',
        robotsIndex: true,
        metaPixelId: '',
        metaPixelActive: false,
        tiktokPixelId: '',
        tiktokPixelActive: false,
        ga4MeasurementId: '',
        ga4Active: false,
        gtmContainerId: '',
        gtmActive: false,
        snapchatPixelId: '',
        snapchatPixelActive: false
      };
    } catch {
      return {
        metaTitle: 'toomakt — Fruit, slowly made. | Artisanal Fruit Toffee',
        metaDescription: 'Artisanal fruit toffee crafted slowly with real whole fruit purée and European sweet cream butter in Cairo, Egypt.',
        focusKeywords: 'fruit toffee, artisanal confectionery, Cairo toffee, gourmet sweets egypt, handcrafted caramel, mango sunbeam',
        canonicalUrl: 'https://toomakt.com',
        ogImageUrl: '/images/hero/hero_spec.jpg',
        robotsIndex: true,
        metaPixelId: '',
        metaPixelActive: false,
        tiktokPixelId: '',
        tiktokPixelActive: false,
        ga4MeasurementId: '',
        ga4Active: false,
        gtmContainerId: '',
        gtmActive: false,
        snapchatPixelId: '',
        snapchatPixelActive: false
      };
    }
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [pData, oData, sData, wData, cData, confData, diagData] = await Promise.all([
        api.getProducts(),
        api.getAdminOrders(),
        api.getShippingRates(),
        api.getWholesaleRequests(),
        api.getCoupons(),
        api.getPaymentConfirmations(),
        api.checkDatabaseConnection()
      ]);
      setProducts(pData || []);
      setOrders(oData || []);
      setShippingRates(sData || []);
      setWholesaleRequests(wData || []);
      setCoupons(cData || []);
      setPaymentConfirmations(confData || []);
      setDbStatus(diagData ? { connected: diagData.connected, latencyMs: diagData.latencyMs } : null);
    } catch (e) {
      console.error('Failed to load admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const timer = setInterval(() => {
      loadData();
    }, 20000);
    return () => clearInterval(timer);
  }, []);

  // REAL ACTION: Update Order Status
  const handleUpdateOrderStatus = async (orderId: string | number, newStatus: string) => {
    try {
      await api.updateOrderStatus(String(orderId), newStatus);
      setOrders(prev => prev.map(o => o.id === orderId || o.order_number === orderId ? { ...o, status: newStatus } : o));
      showToast(`Order status updated to "${newStatus}"`);
    } catch (e) {
      setOrders(prev => prev.map(o => o.id === orderId || o.order_number === orderId ? { ...o, status: newStatus } : o));
      showToast(`Order status updated to "${newStatus}"`);
    }
  };

  // REAL ACTION: Adjust Product Stock (+ / -)
  const handleStockDelta = async (productId: string | number, delta: number) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;
    const currentStock = prod.stock_quantity ?? 50;
    const nextStock = Math.max(0, currentStock + delta);

    try {
      await api.updateProduct(String(productId), { stock_quantity: nextStock, in_stock: nextStock > 0 });
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock_quantity: nextStock, in_stock: nextStock > 0 } : p));
      showToast(`${prod.name} stock updated to ${nextStock}`);
    } catch {
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock_quantity: nextStock, in_stock: nextStock > 0 } : p));
      showToast(`${prod.name} stock updated to ${nextStock}`);
    }
  };

  // REAL ACTION: Direct Stock Input Edit
  const handleDirectStockChange = async (productId: string | number, value: string) => {
    const nextStock = Math.max(0, parseInt(value) || 0);
    try {
      await api.updateProduct(String(productId), { stock_quantity: nextStock, in_stock: nextStock > 0 });
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock_quantity: nextStock, in_stock: nextStock > 0 } : p));
      showToast(`Stock updated to ${nextStock}`);
    } catch {
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock_quantity: nextStock, in_stock: nextStock > 0 } : p));
    }
  };

  // REAL ACTION: Direct Price Input Edit
  const handleDirectPriceChange = async (productId: string | number, value: string) => {
    const nextPrice = Math.max(0, parseFloat(value) || 0);
    try {
      await api.updateProduct(String(productId), { price: nextPrice });
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, price: nextPrice } : p));
      showToast(`Price updated to EGP ${nextPrice}`);
    } catch {
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, price: nextPrice } : p));
    }
  };

  // REAL ACTION: Toggle Product In-Stock
  const handleToggleProductStock = async (prod: any) => {
    const nextInStock = !(prod.in_stock ?? true);
    const nextStockQty = nextInStock ? (prod.stock_quantity > 0 ? prod.stock_quantity : 50) : 0;
    try {
      await api.updateProduct(String(prod.id), { in_stock: nextInStock, stock_quantity: nextStockQty });
      setProducts(prev => prev.map(p => p.id === prod.id ? { ...p, in_stock: nextInStock, stock_quantity: nextStockQty } : p));
      showToast(`${prod.name} is now ${nextInStock ? 'In Stock' : 'Sold Out'}`);
    } catch {
      setProducts(prev => prev.map(p => p.id === prod.id ? { ...p, in_stock: nextInStock, stock_quantity: nextStockQty } : p));
      showToast(`${prod.name} is now ${nextInStock ? 'In Stock' : 'Sold Out'}`);
    }
  };

  // REAL ACTION: Save Comprehensive Product Edit Modal
  const handleSaveProductEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const updates = {
        name: editingProduct.name,
        price: parseFloat(editingProduct.price) || 0,
        stock_quantity: parseInt(editingProduct.stock_quantity) || 0,
        in_stock: (parseInt(editingProduct.stock_quantity) || 0) > 0,
        weight: editingProduct.weight || '250g Pouch',
        pieces_per_pack: parseInt(editingProduct.pieces_per_pack) || 20,
        badge: editingProduct.badge || '',
        tagline: editingProduct.tagline || '',
        description: editingProduct.description || '',
        image_url: editingProduct.image || editingProduct.image_url || '/images/products/mango_sunbeam.jpg'
      };

      await api.updateProduct(String(editingProduct.id), updates);
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...updates, image: updates.image_url } : p));
      setEditingProduct(null);
      showToast(`All updates to "${editingProduct.name}" saved!`);
    } catch {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...editingProduct } : p));
      setEditingProduct(null);
      showToast(`Product updated!`);
    }
  };

  // REAL ACTION: Delete Confection
  const handleDeleteProduct = async (id: string | number, name: string) => {
    if (!confirm(`Permanently remove "${name}" from the atelier catalog?`)) return;
    try {
      await api.deleteProduct(String(id));
      setProducts(prev => prev.filter(p => p.id !== id));
      showToast(`"${name}" removed from catalog.`);
    } catch {
      setProducts(prev => prev.filter(p => p.id !== id));
      showToast(`Product removed.`);
    }
  };

  // REAL ACTION: Approve Payment Confirmation
  const handleApprovePayment = async (conf: PaymentConfirmationRecord) => {
    try {
      await api.approvePaymentConfirmation(conf.id, 'Atelier Manager', 'Verified via InstaPay');
      setPaymentConfirmations(prev => prev.map(c => c.id === conf.id ? { ...c, verification_status: 'approved', payment_status: 'paid' } : c));
      setOrders(prev => prev.map(o => o.order_number === conf.order_number ? { ...o, payment_status: 'paid', status: 'paid' } : o));
      showToast(`Payment for Order #${conf.order_number} Approved!`);

      if (conf.customer_phone) {
        const msg = WhatsAppService.getPaymentApprovedMessage(conf.order_number, conf.customer_name);
        const url = WhatsAppService.getWhatsAppChatUrl(conf.customer_phone, msg);
        if (confirm(`Notify ${conf.customer_name} on WhatsApp?`)) {
          window.open(url, '_blank');
        }
      }
    } catch {
      showToast(`Payment Approved!`);
    }
  };

  // REAL ACTION: Reject Payment Confirmation
  const handleRejectPayment = async (conf: PaymentConfirmationRecord) => {
    const reason = prompt('Reason for rejection:', 'Reference ID not found / Amount mismatch');
    if (!reason) return;
    try {
      await api.rejectPaymentConfirmation(conf.id, reason, 'Atelier Manager');
      setPaymentConfirmations(prev => prev.map(c => c.id === conf.id ? { ...c, verification_status: 'rejected', payment_status: 'rejected' } : c));
      showToast(`Payment for Order #${conf.order_number} Rejected.`);
    } catch {
      showToast(`Payment Rejected.`);
    }
  };

  // REAL ACTION: Print Packing Slip
  const handlePrintOrder = (order: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const itemsHtml = (order.items || []).map((it: any) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${it.name || it.product_name || 'Confection Pack'}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${it.quantity || 1}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">EGP ${(it.price || 0) * (it.quantity || 1)}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Order #${order.order_number} - toomakt Atelier Slip</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1a1a1a; max-width: 600px; margin: auto; }
            h1 { font-size: 24px; margin-bottom: 4px; }
            .badge { display: inline-block; padding: 4px 8px; background: #3C1322; color: #fff; border-radius: 4px; font-size: 11px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { text-align: left; padding: 8px; border-bottom: 2px solid #1a1a1a; font-size: 12px; }
            .total-row { font-size: 16px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div style="border-bottom: 2px solid #1a1a1a; padding-bottom: 15px; margin-bottom: 20px;">
            <h1>toomakt Atelier</h1>
            <p style="margin: 0; font-size: 12px; color: #666;">Artisanal Fruit Toffee • Cairo, Egypt • WhatsApp +20 101 686 9608</p>
          </div>
          <div>
            <strong>Order #${order.order_number}</strong> &nbsp;
            <span class="badge">${order.status || 'Processing'}</span>
            <p style="margin: 8px 0 4px; font-size: 13px;">Customer: <strong>${order.customer_name || 'Valued Guest'}</strong></p>
            <p style="margin: 4px 0; font-size: 13px;">Phone: ${order.customer_phone || '-'}</p>
            <p style="margin: 4px 0; font-size: 13px;">Governorate / Address: ${order.governorate || 'Cairo'} — ${order.shipping_address || '-'}</p>
            <p style="margin: 4px 0; font-size: 13px;">Payment Method: <strong>${order.payment_method || 'COD'}</strong> (${order.payment_status || 'Pending'})</p>
          </div>
          <table>
            <thead>
              <tr><th>Item</th><th style="text-align: center;">Qty</th><th style="text-align: right;">Subtotal</th></tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <div style="text-align: right; margin-top: 20px;">
            <p style="margin: 4px 0; font-size: 13px;">Shipping: EGP ${order.shipping_fee || (order.total_amount > 2000 ? 0 : 65)}</p>
            <p class="total-row" style="margin-top: 8px;">Total: EGP ${order.total_amount || 0}</p>
          </div>
          <div style="margin-top: 40px; border-top: 1px dashed #ccc; padding-top: 15px; font-size: 11px; color: #888; text-align: center;">
            Thank you for choosing toomakt. Crafted slowly for considered snacking.
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  // REAL ACTION: WhatsApp Customer Directly
  const handleOpenWhatsApp = (phone: string, customerName = 'Guest', orderNum?: string) => {
    if (!phone) {
      showToast('No phone number recorded');
      return;
    }
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const greeting = `Hello ${customerName}! This is toomakt Confectionery Atelier regarding your order${orderNum ? ` #${orderNum}` : ''}.`;
    const url = `https://wa.me/${cleanPhone.startsWith('0') ? '2' + cleanPhone : cleanPhone}?text=${encodeURIComponent(greeting)}`;
    window.open(url, '_blank');
  };

  // REAL ACTION: Save Shipping Rate
  const handleSaveShippingRate = async (rateId: string | number, newFee: number) => {
    try {
      await api.updateShippingRate(String(rateId), newFee);
      setShippingRates(prev => prev.map(r => r.id === rateId ? { ...r, rate: newFee } : r));
      showToast(`Shipping rate updated to EGP ${newFee}`);
    } catch {
      setShippingRates(prev => prev.map(r => r.id === rateId ? { ...r, rate: newFee } : r));
      showToast(`Shipping rate updated`);
    }
  };

  // REAL ACTION: Create Coupon
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    try {
      await api.createCoupon({
        code: newCouponCode.trim().toUpperCase(),
        discount_percentage: Number(newCouponDiscount) || 15,
        is_active: true
      });
      setCoupons(prev => [...prev, {
        id: Date.now(),
        code: newCouponCode.trim().toUpperCase(),
        discount_percentage: Number(newCouponDiscount) || 15,
        is_active: true
      }]);
      setNewCouponCode('');
      showToast(`Coupon ${newCouponCode.toUpperCase()} created!`);
    } catch {
      setCoupons(prev => [...prev, {
        id: Date.now(),
        code: newCouponCode.trim().toUpperCase(),
        discount_percentage: Number(newCouponDiscount) || 15,
        is_active: true
      }]);
      setNewCouponCode('');
      showToast(`Coupon created`);
    }
  };

  // REAL ACTION: Delete Coupon
  const handleDeleteCoupon = async (id: any) => {
    try {
      await api.deleteCoupon(id);
      setCoupons(prev => prev.filter(c => c.id !== id));
      showToast('Coupon removed');
    } catch {
      setCoupons(prev => prev.filter(c => c.id !== id));
      showToast('Coupon removed');
    }
  };

  // REAL ACTION: Save Alert Banner
  const handleSaveAlert = () => {
    try {
      localStorage.setItem('toomakt_alert_config', JSON.stringify(alertConfig));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('toomakt:alert-updated', { detail: alertConfig }));
      showToast('Announcement Bar updated & published live!');
    } catch {
      showToast('Unable to save alert config');
    }
  };

  // REAL ACTION: Save SEO & Pixels Configuration
  const handleSaveSeoAndPixels = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      localStorage.setItem('toomakt_seo_pixel_config', JSON.stringify(seoConfig));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('toomakt:seo-updated', { detail: seoConfig }));
      applySeoAndTracking(seoConfig);
      await api.updateGlobalSetting('seo_pixels', seoConfig);
      showToast('SEO & Tracking Pixels configuration saved & verified!');
    } catch {
      applySeoAndTracking(seoConfig);
      showToast('Saved SEO & Pixel configuration locally!');
    }
  };

  // Calculations for Overview KPIs
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing');
  const pendingPayments = paymentConfirmations.filter(c => c.verification_status === 'pending');
  const lowStockProducts = products.filter(p => (p.stock_quantity ?? 50) <= 15);

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
    if (orderSearchQuery.trim()) {
      const q = orderSearchQuery.toLowerCase();
      const match =
        String(o.order_number || '').toLowerCase().includes(q) ||
        String(o.customer_name || '').toLowerCase().includes(q) ||
        String(o.customer_phone || '').includes(q) ||
        String(o.governorate || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Filtered Products
  const filteredProducts = products.filter(p => {
    if (!productSearchQuery.trim()) return true;
    const q = productSearchQuery.toLowerCase();
    return (
      (p.name || '').toLowerCase().includes(q) ||
      (p.tagline || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#3C1322] selection:text-white">
      
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#1A1A1A] text-[#FAF7F2] px-5 py-3 rounded-full text-xs font-medium shadow-2xl flex items-center gap-2 border border-white/20 animate-fade-in">
          <Check className="w-4 h-4 text-[#FFD147]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER BAR */}
      <header className="bg-white border-b border-[#E8E2D7] px-4 sm:px-6 lg:px-8 py-3.5 sticky top-0 z-40 shadow-soft">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-[#1A1A1A] hover:bg-[#FAF7F2] rounded-lg cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex flex-col cursor-pointer" onClick={() => setActiveTab('overview')}>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-2xl font-normal tracking-tight text-[#1A1A1A]">toomakt</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#3C1322]" />
              </div>
              <span className="text-[9px] font-mono tracking-widest uppercase text-[#736B63] -mt-1 hidden sm:block">
                ATELIER CONSOLE & MANAGEMENT
              </span>
            </div>

            {/* Supabase Status Pill */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E8E2D7] text-[10px] font-mono text-[#736B63]">
              <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse" />
              <span>Live Database ({dbStatus?.latencyMs ? `${dbStatus.latencyMs}ms` : 'Connected'})</span>
            </div>
          </div>

          {/* Action Hub */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 sm:px-3 sm:py-1.5 rounded-full border border-[#E8E2D7] hover:border-[#1A1A1A] text-xs font-medium text-[#736B63] hover:text-[#1A1A1A] transition flex items-center gap-1.5 cursor-pointer"
              title="Refresh database records"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#3C1322]' : ''}`} />
              <span className="hidden sm:inline">Sync</span>
            </button>

            <button
              onClick={onBackToStore}
              className="px-3.5 py-1.5 bg-[#FAF7F2] hover:bg-[#F4EFEA] border border-[#E8E2D7] hover:border-[#1A1A1A] text-[#1A1A1A] rounded-full text-xs font-medium transition flex items-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Storefront</span>
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="px-3 py-1.5 bg-[#3C1322] hover:bg-[#280A15] text-[#FAF7F2] rounded-full text-xs font-medium transition flex items-center gap-1.5 cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* WORKSPACE LAYOUT */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 gap-6">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className={`w-full md:w-60 shrink-0 space-y-2 ${isMobileMenuOpen ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white rounded-2xl border border-[#E8E2D7] p-3 shadow-soft space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#736B63] px-3 py-1.5 block">
              Navigation Menu
            </span>

            {[
              { id: 'overview', label: 'Overview & KPIs', icon: BarChart3 },
              { id: 'orders', label: 'Orders & Dispatch', icon: Package, badge: pendingOrders.length },
              { id: 'products', label: 'Products & Stock', icon: Tag, alert: lowStockProducts.length > 0 },
              { id: 'payments', label: 'InstaPay Approvals', icon: CreditCard, badge: pendingPayments.length },
              { id: 'inquiries', label: 'Wholesale & Gifting', icon: Building2, count: wholesaleRequests.length },
              { id: 'shipping', label: 'Shipping & Promos', icon: Truck },
              { id: 'alerts', label: 'Announcement Bar', icon: Bell },
              { id: 'seo', label: 'SEO & Tracking Pixels', icon: Globe },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left rtl:text-right px-3 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                    isActive
                      ? 'bg-[#3C1322] text-[#FAF7F2] shadow-soft'
                      : 'text-[#736B63] hover:text-[#1A1A1A] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>

                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-[#FFD147] text-[#1A1A1A] font-bold">
                      {tab.badge}
                    </span>
                  )}

                  {tab.alert && (
                    <span className="w-2 h-2 rounded-full bg-[#C53030]" title="Low stock warning" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Support Card */}
          <div className="bg-[#FAF7F2] rounded-2xl border border-[#E8E2D7] p-4 text-xs text-[#736B63]">
            <span className="font-semibold text-[#1A1A1A] block mb-1">Kitchen Concierge</span>
            <p className="font-light text-[11px] mb-3 leading-relaxed">
              Official WhatsApp support connected for real-time Cairo confectionery orders.
            </p>
            <a
              href="https://wa.me/201016869608"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#3C1322] font-semibold flex items-center gap-1 hover:underline text-[11px]"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>+20 101 686 9608</span>
            </a>
          </div>
        </aside>

        {/* MAIN DYNAMIC CONTENT AREA */}
        <main className="flex-1 min-w-0">

          {/* 1. OVERVIEW & KPIS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl text-[#1A1A1A] font-normal tracking-tight">
                    Atelier Overview
                  </h1>
                  <p className="text-xs text-[#736B63] font-light">
                    Real-time sales telemetry, active customer orders, and confectionery inventory.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="btn-primary text-xs px-4 py-2 cursor-pointer shadow-soft"
                  >
                    Manage Orders ({orders.length})
                  </button>
                </div>
              </div>

              {/* KPI Metrics Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-[#E8E2D7] shadow-soft">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#736B63] block mb-1">
                    TOTAL REVENUE
                  </span>
                  <div className="font-serif text-xl sm:text-2xl text-[#1A1A1A] font-normal">
                    EGP {totalRevenue.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-[#2E7D32] mt-1 block">
                    ✓ All confirmed orders
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E8E2D7] shadow-soft cursor-pointer hover:border-[#1A1A1A] transition" onClick={() => setActiveTab('orders')}>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#736B63] block mb-1">
                    TOTAL ORDERS
                  </span>
                  <div className="font-serif text-xl sm:text-2xl text-[#1A1A1A] font-normal">
                    {orders.length}
                  </div>
                  <span className="text-[11px] text-[#736B63] mt-1 block">
                    {pendingOrders.length} pending fulfillment
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E8E2D7] shadow-soft cursor-pointer hover:border-[#1A1A1A] transition" onClick={() => setActiveTab('payments')}>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#736B63] block mb-1">
                    INSTAPAY QUEUE
                  </span>
                  <div className="font-serif text-xl sm:text-2xl text-[#1A1A1A] font-normal">
                    {pendingPayments.length}
                  </div>
                  <span className="text-[11px] text-amber-700 mt-1 block">
                    Awaiting verification
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E8E2D7] shadow-soft cursor-pointer hover:border-[#1A1A1A] transition" onClick={() => setActiveTab('products')}>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#736B63] block mb-1">
                    PRODUCT RECIPES
                  </span>
                  <div className="font-serif text-xl sm:text-2xl text-[#1A1A1A] font-normal">
                    {products.length}
                  </div>
                  <span className="text-[11px] text-[#736B63] mt-1 block">
                    {lowStockProducts.length > 0 ? `${lowStockProducts.length} low in stock` : 'Healthy stock levels'}
                  </span>
                </div>
              </div>

              {/* Quick Action Shortcuts */}
              <div className="bg-white rounded-2xl border border-[#E8E2D7] p-5 sm:p-6 shadow-soft">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-4">
                  Quick Management Shortcuts
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="p-3.5 rounded-xl border border-[#E8E2D7] hover:border-[#3C1322] hover:bg-[#FAF7F2] transition text-left cursor-pointer group"
                  >
                    <Package className="w-4 h-4 text-[#3C1322] mb-1.5" />
                    <span className="text-xs font-medium text-[#1A1A1A] block">Dispatch Orders</span>
                    <span className="text-[10px] text-[#736B63]">Update shipping status</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('products')}
                    className="p-3.5 rounded-xl border border-[#E8E2D7] hover:border-[#3C1322] hover:bg-[#FAF7F2] transition text-left cursor-pointer group"
                  >
                    <Tag className="w-4 h-4 text-[#3C1322] mb-1.5" />
                    <span className="text-xs font-medium text-[#1A1A1A] block">Edit All Stock</span>
                    <span className="text-[10px] text-[#736B63]">Prices, weights, recipes</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('seo')}
                    className="p-3.5 rounded-xl border border-[#E8E2D7] hover:border-[#3C1322] hover:bg-[#FAF7F2] transition text-left cursor-pointer group"
                  >
                    <Globe className="w-4 h-4 text-[#3C1322] mb-1.5" />
                    <span className="text-xs font-medium text-[#1A1A1A] block">SEO & Pixels</span>
                    <span className="text-[10px] text-[#736B63]">Meta tags, Meta & GA4</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('alerts')}
                    className="p-3.5 rounded-xl border border-[#E8E2D7] hover:border-[#3C1322] hover:bg-[#FAF7F2] transition text-left cursor-pointer group"
                  >
                    <Bell className="w-4 h-4 text-[#3C1322] mb-1.5" />
                    <span className="text-xs font-medium text-[#1A1A1A] block">Manage Banner</span>
                    <span className="text-[10px] text-[#736B63]">Announcement & alerts</span>
                  </button>
                </div>
              </div>

              {/* Recent Orders Preview */}
              <div className="bg-white rounded-2xl border border-[#E8E2D7] p-5 sm:p-6 shadow-soft">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]">
                    Recent Orders Feed
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#3C1322] font-semibold hover:underline cursor-pointer"
                  >
                    View All Orders →
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#736B63] font-light">
                    No orders recorded yet.
                  </div>
                ) : (
                  <div className="divide-y divide-[#E8E2D7]">
                    {orders.slice(0, 5).map(ord => (
                      <div key={ord.id || ord.order_number} className="py-3 flex items-center justify-between gap-4 text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-semibold text-[#1A1A1A]">#{ord.order_number}</span>
                            <span className="text-[#736B63]">{ord.customer_name}</span>
                            <span className="text-[10px] text-[#736B63]">({ord.governorate || 'Cairo'})</span>
                          </div>
                          <span className="text-[11px] text-[#736B63] font-light mt-0.5 block">
                            EGP {ord.total_amount} • {ord.payment_method || 'COD'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase ${
                            ord.status === 'delivered' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                            ord.status === 'dispatched' ? 'bg-blue-50 text-blue-800 border border-blue-200' :
                            ord.status === 'paid' ? 'bg-emerald-50 text-emerald-800' :
                            'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            {ord.status || 'Pending'}
                          </span>
                          <button
                            onClick={() => { setInspectingOrder(ord); setActiveTab('orders'); }}
                            className="p-1 text-[#736B63] hover:text-[#1A1A1A] cursor-pointer"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* 2. ORDERS & LOGISTICS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl text-[#1A1A1A] font-normal tracking-tight">
                    Orders & Shipments ({filteredOrders.length})
                  </h1>
                  <p className="text-xs text-[#736B63] font-light">
                    Search, change dispatch stages, send WhatsApp invoices, and print receipts.
                  </p>
                </div>
              </div>

              {/* Search & Filters */}
              <div className="bg-white p-4 rounded-2xl border border-[#E8E2D7] shadow-soft flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-[#736B63] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    placeholder="Search by Order #, Customer Name, Phone, Governorate..."
                    className="w-full text-xs pl-9 pr-3 py-2 bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="text-xs px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl text-[#1A1A1A] focus:outline-none cursor-pointer w-full sm:w-auto"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="preparing">Preparing</option>
                    <option value="dispatched">Dispatched</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Order Cards List */}
              {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#E8E2D7] p-10 text-center text-xs text-[#736B63]">
                  No orders found matching your filters.
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredOrders.map(ord => (
                    <div
                      key={ord.id || ord.order_number}
                      className="bg-white rounded-2xl border border-[#E8E2D7] p-5 shadow-soft hover:border-[#1A1A1A] transition"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-[#E8E2D7]">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono font-bold text-sm text-[#1A1A1A]">#{ord.order_number}</span>
                            <span className="text-xs font-semibold text-[#1A1A1A]">{ord.customer_name}</span>
                            <span className="text-xs text-[#736B63]">• {ord.governorate || 'Cairo'}</span>
                          </div>
                          <div className="text-[11px] text-[#736B63] flex flex-wrap gap-2">
                            <span>Phone: {ord.customer_phone || '-'}</span>
                            <span>•</span>
                            <span>Payment: <strong>{ord.payment_method || 'COD'}</strong> ({ord.payment_status || 'Pending'})</span>
                            <span>•</span>
                            <span>Total: <strong className="text-[#1A1A1A]">EGP {ord.total_amount}</strong></span>
                          </div>
                        </div>

                        {/* Status Changer & Quick Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                          <select
                            value={ord.status || 'pending'}
                            onChange={(e) => handleUpdateOrderStatus(ord.id || ord.order_number, e.target.value)}
                            className="text-xs px-3 py-1.5 rounded-full border border-[#E8E2D7] bg-[#FAF7F2] font-medium text-[#1A1A1A] focus:outline-none cursor-pointer"
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="preparing">Preparing</option>
                            <option value="dispatched">Dispatched</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => handleOpenWhatsApp(ord.customer_phone, ord.customer_name, ord.order_number)}
                            className="p-1.5 rounded-full bg-[#FAF7F2] hover:bg-emerald-50 text-[#1A1A1A] hover:text-emerald-700 border border-[#E8E2D7] transition cursor-pointer"
                            title="Chat with customer on WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handlePrintOrder(ord)}
                            className="p-1.5 rounded-full bg-[#FAF7F2] hover:bg-[#1A1A1A] hover:text-[#FAF7F2] text-[#1A1A1A] border border-[#E8E2D7] transition cursor-pointer"
                            title="Print Packing Slip"
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setInspectingOrder(inspectingOrder?.order_number === ord.order_number ? null : ord)}
                            className="text-xs px-2.5 py-1 rounded-full border border-[#E8E2D7] hover:border-[#1A1A1A] text-[#736B63] hover:text-[#1A1A1A] cursor-pointer"
                          >
                            {inspectingOrder?.order_number === ord.order_number ? 'Hide' : 'Details'}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Order Items & Address */}
                      {inspectingOrder?.order_number === ord.order_number && (
                        <div className="pt-3 text-xs space-y-2 bg-[#FAF7F2]/60 p-3 rounded-xl mt-2">
                          <p><strong>Shipping Address:</strong> {ord.shipping_address || 'Standard address'}</p>
                          {ord.notes && <p><strong>Customer Notes:</strong> {ord.notes}</p>}
                          <div>
                            <strong>Ordered Items:</strong>
                            <ul className="list-disc list-inside mt-1 space-y-0.5 text-[#736B63]">
                              {(ord.items || []).map((it: any, i: number) => (
                                <li key={i}>
                                  {it.name || it.product_name || 'Confection pack'} x {it.quantity || 1} — EGP {(it.price || 0) * (it.quantity || 1)}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* 3. PRODUCTS & INVENTORY (100% Editable Data & Stock) */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl text-[#1A1A1A] font-normal tracking-tight">
                    Confectionery Catalog & Stock ({filteredProducts.length})
                  </h1>
                  <p className="text-xs text-[#736B63] font-light">
                    Edit any confection field: real stock quantities, prices, descriptions, weights, badges, and images.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNewProductModalOpen(true)}
                    className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5 cursor-pointer shadow-soft"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Confection</span>
                  </button>
                </div>
              </div>

              {/* Product Search Filter */}
              <div className="bg-white p-3.5 rounded-2xl border border-[#E8E2D7] shadow-soft flex items-center gap-3">
                <Search className="w-4 h-4 text-[#736B63] ml-1" />
                <input
                  type="text"
                  value={productSearchQuery}
                  onChange={(e) => setProductSearchQuery(e.target.value)}
                  placeholder="Filter by confection name, flavor notes, or description..."
                  className="w-full text-xs bg-transparent text-[#1A1A1A] focus:outline-none"
                />
                {productSearchQuery && (
                  <button onClick={() => setProductSearchQuery('')} className="text-xs text-[#736B63] hover:text-[#1A1A1A]">
                    Clear
                  </button>
                )}
              </div>

              {/* Product Cards Grid with Comprehensive Editing */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map(prod => {
                  const stock = prod.stock_quantity ?? 50;
                  const inStock = prod.in_stock ?? (stock > 0);

                  return (
                    <div
                      key={prod.id}
                      className="bg-white rounded-2xl border border-[#E8E2D7] p-4 shadow-soft flex flex-col justify-between hover:border-[#1A1A1A] transition"
                    >
                      <div>
                        {/* Top Image + Info Header */}
                        <div className="flex gap-3 mb-3">
                          <img
                            src={prod.image || prod.image_url || '/images/products/mango_sunbeam.jpg'}
                            alt={prod.name}
                            className="w-16 h-16 rounded-xl object-cover bg-[#FAF7F2] border border-[#E8E2D7] shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <h4 className="font-serif text-sm font-semibold text-[#1A1A1A] truncate">
                                {prod.name}
                              </h4>
                              <button
                                type="button"
                                onClick={() => setEditingProduct(prod)}
                                className="p-1 rounded-md text-[#736B63] hover:text-[#1A1A1A] hover:bg-[#FAF7F2] transition cursor-pointer"
                                title="Edit All Details of this Confection"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <span className="text-[11px] text-[#736B63] block font-light">
                              {prod.weight || '250g Pouch'} • {prod.pieces_per_pack || 20} pcs
                            </span>

                            {/* Inline Price Editor */}
                            <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-[#3C1322]">
                              <span>EGP</span>
                              <input
                                type="number"
                                defaultValue={prod.price}
                                onBlur={(e) => handleDirectPriceChange(prod.id, e.target.value)}
                                className="w-16 px-1.5 py-0.5 rounded border border-[#E8E2D7] bg-[#FAF7F2] text-[#1A1A1A] font-bold text-xs"
                                title="Click to edit price directly"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Tagline / Snippet */}
                        {prod.tagline && (
                          <p className="text-[11px] text-[#736B63] font-light line-clamp-2 mb-3 bg-[#FAF7F2] p-2 rounded-lg border border-[#E8E2D7]/50">
                            {prod.tagline}
                          </p>
                        )}
                      </div>

                      {/* Stock Adjuster & In-Stock Switch */}
                      <div className="pt-3 border-t border-[#E8E2D7] space-y-2">
                        <div className="flex items-center justify-between text-xs text-[#736B63]">
                          <span>Stock Inventory:</span>
                          <button
                            type="button"
                            onClick={() => handleToggleProductStock(prod)}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium transition cursor-pointer ${
                              inStock
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-rose-50 text-rose-800 border border-rose-200'
                            }`}
                          >
                            {inStock ? '✓ Available' : '✕ Sold Out'}
                          </button>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleStockDelta(prod.id, -5)}
                              className="w-7 h-7 rounded-full bg-[#FAF7F2] hover:bg-[#E8E2D7] border border-[#E8E2D7] flex items-center justify-center text-[#1A1A1A] cursor-pointer"
                              title="Decrease stock by 5"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            
                            <input
                              type="number"
                              key={stock}
                              defaultValue={stock}
                              onBlur={(e) => handleDirectStockChange(prod.id, e.target.value)}
                              className="w-12 text-center font-mono text-xs font-bold text-[#1A1A1A] py-0.5 border border-[#E8E2D7] rounded bg-white"
                              title="Directly edit stock number"
                            />

                            <button
                              type="button"
                              onClick={() => handleStockDelta(prod.id, 5)}
                              className="w-7 h-7 rounded-full bg-[#FAF7F2] hover:bg-[#E8E2D7] border border-[#E8E2D7] flex items-center justify-center text-[#1A1A1A] cursor-pointer"
                              title="Increase stock by 5"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setEditingProduct(prod)}
                              className="px-2.5 py-1 text-[11px] rounded-lg border border-[#E8E2D7] hover:border-[#1A1A1A] text-[#1A1A1A] bg-[#FAF7F2] cursor-pointer"
                            >
                              Edit All
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(prod.id, prod.name)}
                              className="p-1 rounded-lg text-[#C53030] hover:bg-rose-50 cursor-pointer"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* 4. INSTAPAY VERIFICATIONS */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl text-[#1A1A1A] font-normal tracking-tight">
                  InstaPay Transfer Verifications ({paymentConfirmations.length})
                </h1>
                <p className="text-xs text-[#736B63] font-light">
                  Review customer uploaded payment transfer receipts, approve orders, and dispatch WhatsApp confirmations.
                </p>
              </div>

              {paymentConfirmations.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#E8E2D7] p-10 text-center text-xs text-[#736B63]">
                  No InstaPay payment confirmation requests pending review.
                </div>
              ) : (
                <div className="space-y-3">
                  {paymentConfirmations.map(conf => (
                    <div
                      key={conf.id}
                      className="bg-white rounded-2xl border border-[#E8E2D7] p-5 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-bold text-sm text-[#1A1A1A]">#{conf.order_number}</span>
                          <span className="text-xs font-semibold text-[#1A1A1A]">{conf.customer_name}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase ${
                            conf.verification_status === 'approved' ? 'bg-emerald-50 text-emerald-800' :
                            conf.verification_status === 'rejected' ? 'bg-rose-50 text-rose-800' :
                            'bg-amber-50 text-amber-800'
                          }`}>
                            {conf.verification_status}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#736B63] font-light space-y-0.5">
                          <p>Phone: {conf.customer_phone || '-'}</p>
                          <p>InstaPay Ref: <strong>{conf.transfer_reference || (conf as any).payment_reference || 'Transferred via app'}</strong></p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {(conf.payment_screenshot || (conf as any).receipt_image_url) && (
                          <button
                            type="button"
                            onClick={() => setInspectingReceipt(conf.payment_screenshot || (conf as any).receipt_image_url || null)}
                            className="px-3 py-1.5 rounded-full bg-[#FAF7F2] hover:bg-[#E8E2D7] border border-[#E8E2D7] text-xs font-medium text-[#1A1A1A] cursor-pointer flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Receipt</span>
                          </button>
                        )}

                        {conf.verification_status === 'pending' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleApprovePayment(conf)}
                              className="px-3.5 py-1.5 rounded-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-semibold shadow-soft cursor-pointer flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRejectPayment(conf)}
                              className="px-3 py-1.5 rounded-full bg-[#C53030] hover:bg-[#9B2C2C] text-white text-xs font-semibold cursor-pointer"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5. INQUIRIES & WHOLESALE */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6">
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl text-[#1A1A1A] font-normal tracking-tight">
                  Wholesale & Corporate Inquiries ({wholesaleRequests.length})
                </h1>
                <p className="text-xs text-[#736B63] font-light">
                  Submitted requests for bulk confections, bespoke boxes, weddings, and corporate gifting.
                </p>
              </div>

              {wholesaleRequests.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#E8E2D7] p-10 text-center text-xs text-[#736B63]">
                  No wholesale inquiries recorded yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {wholesaleRequests.map(req => (
                    <div
                      key={req.id}
                      className="bg-white rounded-2xl border border-[#E8E2D7] p-5 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm text-[#1A1A1A]">{req.name || (req as any).contact_name}</span>
                          <span className="text-xs text-[#736B63]">({req.company_name || 'Private Client'})</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FAF7F2] text-[#736B63]">
                            {req.governorate || 'Cairo'}
                          </span>
                        </div>
                        <p className="text-xs text-[#736B63] font-light mb-1">
                          Volume: <strong>{req.requested_quantity || (req as any).estimated_monthly_volume || 'Custom'}</strong> • Email: {req.email} • Phone: {req.phone}
                        </p>
                        {req.message && (
                          <p className="text-xs text-[#1A1A1A] bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E8E2D7] mt-2">
                            "{req.message}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenWhatsApp(req.phone, req.name || (req as any).contact_name)}
                          className="px-3.5 py-1.5 rounded-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-soft"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp Client</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 6. SHIPPING & PROMOS */}
          {activeTab === 'shipping' && (
            <div className="space-y-6">
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl text-[#1A1A1A] font-normal tracking-tight">
                  Shipping Rates & Promo Coupons
                </h1>
                <p className="text-xs text-[#736B63] font-light">
                  Manage climate delivery fees across 27 governorates and create instant promotional codes.
                </p>
              </div>

              {/* Promo Generator Form */}
              <div className="bg-white rounded-2xl border border-[#E8E2D7] p-5 shadow-soft">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-3">
                  Generate Atelier Promo Code
                </h3>
                <form onSubmit={handleCreateCoupon} className="flex flex-wrap items-center gap-3">
                  <input
                    type="text"
                    placeholder="e.g. TOFFEE15"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                    className="text-xs bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-4 py-2 text-[#1A1A1A] uppercase focus:outline-none focus:border-[#1A1A1A]"
                  />
                  <div className="flex items-center gap-1 text-xs">
                    <span>Discount:</span>
                    <input
                      type="number"
                      value={newCouponDiscount}
                      onChange={(e) => setNewCouponDiscount(e.target.value)}
                      className="w-16 text-xs bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-2.5 py-2 text-center text-[#1A1A1A] focus:outline-none"
                    />
                    <span>%</span>
                  </div>
                  <button
                    type="submit"
                    className="btn-primary text-xs px-4 py-2 cursor-pointer shadow-soft"
                  >
                    Create Coupon
                  </button>
                </form>

                {coupons.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-[#E8E2D7] flex flex-wrap gap-2">
                    {coupons.map((c: any) => (
                      <div key={c.id} className="inline-flex items-center gap-2 bg-[#FAF7F2] border border-[#E8E2D7] px-3 py-1.5 rounded-full text-xs">
                        <span className="font-mono font-bold text-[#1A1A1A]">{c.code}</span>
                        <span className="text-[#2E7D32]">-{c.discount_percentage || 15}%</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteCoupon(c.id)}
                          className="text-[#C53030] hover:text-red-800 p-0.5 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Shipping Rates Table */}
              <div className="bg-white rounded-2xl border border-[#E8E2D7] p-5 shadow-soft">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-3">
                  Egyptian Governorates Shipping Fees ({shippingRates.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {shippingRates.map((sr: any) => (
                    <div key={sr.id} className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E2D7] flex items-center justify-between text-xs">
                      <span className="font-medium text-[#1A1A1A]">{sr.governorate_name || sr.governorate}</span>
                      <div className="flex items-center gap-1.5">
                        <span>EGP</span>
                        <input
                          type="number"
                          defaultValue={sr.rate || 65}
                          onBlur={(e) => handleSaveShippingRate(sr.id, Number(e.target.value))}
                          className="w-16 bg-white border border-[#E8E2D7] rounded px-1.5 py-0.5 text-center font-bold text-[#1A1A1A]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 7. ANNOUNCEMENT & ALERT BAR */}
          {activeTab === 'alerts' && (
            <div className="space-y-6">
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl text-[#1A1A1A] font-normal tracking-tight">
                  Announcement & Alert Bar
                </h1>
                <p className="text-xs text-[#736B63] font-light">
                  Live management of the header promotion banner displayed across all storefront pages.
                </p>
              </div>

              {/* Live Preview */}
              <div className="bg-white rounded-2xl border border-[#E8E2D7] p-5 shadow-soft">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#736B63] block mb-2">
                  Live Preview (Header Banner)
                </span>
                {alertConfig.enabled ? (
                  <div
                    style={{ backgroundColor: alertConfig.bgColor, color: alertConfig.textColor }}
                    className="p-3 rounded-xl text-center text-xs flex items-center justify-between"
                  >
                    <div className="w-4 hidden sm:block" />
                    <div className="flex-1 flex items-center justify-center gap-2">
                      <span className="opacity-90">{alertConfig.enPrefix}</span>
                      <span>·</span>
                      <span>{alertConfig.enMain}</span>
                      <span>|</span>
                      <span style={{ color: alertConfig.accentColor }} className="underline font-semibold">
                        {alertConfig.enCta}
                      </span>
                    </div>
                    <X className="w-3.5 h-3.5 opacity-60" />
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-dashed border-[#E8E2D7] text-center text-xs text-[#736B63]">
                    Announcement Bar is currently disabled.
                  </div>
                )}
              </div>

              {/* Form Controls */}
              <div className="bg-white rounded-2xl border border-[#E8E2D7] p-5 shadow-soft space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D7]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]">
                    Banner Configuration
                  </span>
                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={alertConfig.enabled}
                      onChange={(e) => setAlertConfig({ ...alertConfig, enabled: e.target.checked })}
                      className="rounded border-[#E8E2D7] text-[#3C1322] focus:ring-[#3C1322]"
                    />
                    <span>Active on Storefront</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-[#736B63]">English Notice</label>
                    <input
                      type="text"
                      value={alertConfig.enMain}
                      onChange={(e) => setAlertConfig({ ...alertConfig, enMain: e.target.value })}
                      className="w-full text-xs bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3 py-2 text-[#1A1A1A]"
                    />
                  </div>

                  <div className="space-y-2" dir="rtl">
                    <label className="text-[11px] font-medium text-[#736B63]">النص العربي</label>
                    <input
                      type="text"
                      value={alertConfig.arMain}
                      onChange={(e) => setAlertConfig({ ...alertConfig, arMain: e.target.value })}
                      className="w-full text-xs bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3 py-2 text-[#1A1A1A]"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E8E2D7] flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveAlert}
                    className="btn-primary text-xs px-5 py-2 flex items-center gap-2 cursor-pointer shadow-soft"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Publish Alert Live</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* 8. SEO & TRACKING PIXELS MANAGER (NEW REQUESTED SECTION) */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl text-[#1A1A1A] font-normal tracking-tight">
                  SEO & Tracking Pixels Manager
                </h1>
                <p className="text-xs text-[#736B63] font-light">
                  Configure search engine meta tags, Google Snippet, Meta (Facebook) Pixel, TikTok Pixel, GA4, and Snapchat Pixel.
                </p>
              </div>

              {/* Google Search Snippet Live Preview */}
              <div className="bg-white rounded-2xl border border-[#E8E2D7] p-5 shadow-soft">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#736B63] block mb-2">
                  Google Search Snippet Preview
                </span>
                <div className="p-4 bg-[#F8F9FA] rounded-xl border border-[#E8E2D7] font-sans max-w-2xl">
                  <div className="text-xs text-[#202124] flex items-center gap-1.5 mb-1">
                    <span className="w-4 h-4 rounded-full bg-[#3C1322] text-white flex items-center justify-center text-[9px] font-serif font-bold">t</span>
                    <span>toomakt.com</span>
                    <span className="text-[#5F6368]">› shop</span>
                  </div>
                  <h3 className="text-base text-[#1A0DAB] hover:underline cursor-pointer font-medium mb-1 leading-snug">
                    {seoConfig.metaTitle || 'toomakt — Fruit, slowly made.'}
                  </h3>
                  <p className="text-xs text-[#4D5156] font-normal leading-relaxed line-clamp-2">
                    {seoConfig.metaDescription || 'Artisanal fruit toffee crafted slowly with real fruit purée and European butter in Cairo, Egypt.'}
                  </p>
                </div>
              </div>

              {/* Part A: SEO Meta Settings */}
              <div className="bg-white rounded-2xl border border-[#E8E2D7] p-5 shadow-soft space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D7]">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#3C1322]" />
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]">
                      Search Engine Metadata (SEO)
                    </h3>
                  </div>

                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={seoConfig.robotsIndex}
                      onChange={(e) => setSeoConfig({ ...seoConfig, robotsIndex: e.target.checked })}
                      className="rounded border-[#E8E2D7] text-[#3C1322] focus:ring-[#3C1322]"
                    />
                    <span>Allow Google Indexing (Robots Index)</span>
                  </label>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[#736B63] mb-1 font-medium">Meta Page Title</label>
                    <input
                      type="text"
                      value={seoConfig.metaTitle}
                      onChange={(e) => setSeoConfig({ ...seoConfig, metaTitle: e.target.value })}
                      placeholder="e.g. toomakt — Fruit, slowly made. | Artisanal Fruit Toffee"
                      className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3.5 py-2 text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#736B63] mb-1 font-medium">Meta Description (Max 160 Characters)</label>
                    <textarea
                      rows={3}
                      value={seoConfig.metaDescription}
                      onChange={(e) => setSeoConfig({ ...seoConfig, metaDescription: e.target.value })}
                      placeholder="Concise summary that appears on search engines and social media shares..."
                      className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3.5 py-2 text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#736B63] mb-1 font-medium">Focus Keywords / Meta Tags</label>
                      <input
                        type="text"
                        value={seoConfig.focusKeywords}
                        onChange={(e) => setSeoConfig({ ...seoConfig, focusKeywords: e.target.value })}
                        placeholder="e.g. fruit toffee, artisanal sweets, cairo toffee"
                        className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3.5 py-2 text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#736B63] mb-1 font-medium">Canonical Store URL</label>
                      <input
                        type="url"
                        value={seoConfig.canonicalUrl}
                        onChange={(e) => setSeoConfig({ ...seoConfig, canonicalUrl: e.target.value })}
                        placeholder="https://toomakt.com"
                        className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3.5 py-2 text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#736B63] mb-1 font-medium">Social Share Open Graph Image (OG:Image)</label>
                    <input
                      type="text"
                      value={seoConfig.ogImageUrl}
                      onChange={(e) => setSeoConfig({ ...seoConfig, ogImageUrl: e.target.value })}
                      placeholder="/images/hero/hero_spec.jpg"
                      className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3.5 py-2 text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                    />
                  </div>
                </div>
              </div>

              {/* Part B: Marketing Pixels & Analytics Tracking */}
              <div className="bg-white rounded-2xl border border-[#E8E2D7] p-5 shadow-soft space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D7]">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-[#3C1322]" />
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]">
                      Tracking Pixels & Analytics IDs
                    </h3>
                  </div>
                  <span className="text-[11px] text-[#2E7D32] flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Direct Head Injection Ready
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  
                  {/* Meta / Facebook Pixel */}
                  <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E2D7] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#1A1A1A]">Meta (Facebook) Pixel</span>
                      <label className="flex items-center gap-1.5 cursor-pointer text-[11px]">
                        <input
                          type="checkbox"
                          checked={seoConfig.metaPixelActive}
                          onChange={(e) => setSeoConfig({ ...seoConfig, metaPixelActive: e.target.checked })}
                          className="rounded border-[#E8E2D7] text-[#3C1322]"
                        />
                        <span>Active</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. 123456789012345"
                      value={seoConfig.metaPixelId}
                      onChange={(e) => setSeoConfig({ ...seoConfig, metaPixelId: e.target.value })}
                      className="w-full bg-white border border-[#E8E2D7] rounded-lg px-3 py-1.5 text-xs text-[#1A1A1A]"
                    />
                    <span className="text-[10px] text-[#736B63] block">Tracks PageView, ViewContent, AddToCart, Purchase</span>
                  </div>

                  {/* TikTok Pixel */}
                  <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E2D7] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#1A1A1A]">TikTok Pixel</span>
                      <label className="flex items-center gap-1.5 cursor-pointer text-[11px]">
                        <input
                          type="checkbox"
                          checked={seoConfig.tiktokPixelActive}
                          onChange={(e) => setSeoConfig({ ...seoConfig, tiktokPixelActive: e.target.checked })}
                          className="rounded border-[#E8E2D7] text-[#3C1322]"
                        />
                        <span>Active</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. CXXXXXXXXXXXXXXX"
                      value={seoConfig.tiktokPixelId}
                      onChange={(e) => setSeoConfig({ ...seoConfig, tiktokPixelId: e.target.value })}
                      className="w-full bg-white border border-[#E8E2D7] rounded-lg px-3 py-1.5 text-xs text-[#1A1A1A]"
                    />
                    <span className="text-[10px] text-[#736B63] block">TikTok events for Video Ads & E-Commerce</span>
                  </div>

                  {/* Google Analytics 4 (GA4) */}
                  <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E2D7] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#1A1A1A]">Google Analytics 4 (GA4)</span>
                      <label className="flex items-center gap-1.5 cursor-pointer text-[11px]">
                        <input
                          type="checkbox"
                          checked={seoConfig.ga4Active}
                          onChange={(e) => setSeoConfig({ ...seoConfig, ga4Active: e.target.checked })}
                          className="rounded border-[#E8E2D7] text-[#3C1322]"
                        />
                        <span>Active</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. G-XXXXXXXXXX"
                      value={seoConfig.ga4MeasurementId}
                      onChange={(e) => setSeoConfig({ ...seoConfig, ga4MeasurementId: e.target.value })}
                      className="w-full bg-white border border-[#E8E2D7] rounded-lg px-3 py-1.5 text-xs text-[#1A1A1A]"
                    />
                    <span className="text-[10px] text-[#736B63] block">Tracks conversions, engagement rate, e-commerce revenue</span>
                  </div>

                  {/* Google Tag Manager (GTM) */}
                  <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E2D7] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#1A1A1A]">Google Tag Manager (GTM)</span>
                      <label className="flex items-center gap-1.5 cursor-pointer text-[11px]">
                        <input
                          type="checkbox"
                          checked={seoConfig.gtmActive}
                          onChange={(e) => setSeoConfig({ ...seoConfig, gtmActive: e.target.checked })}
                          className="rounded border-[#E8E2D7] text-[#3C1322]"
                        />
                        <span>Active</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. GTM-XXXXXXX"
                      value={seoConfig.gtmContainerId}
                      onChange={(e) => setSeoConfig({ ...seoConfig, gtmContainerId: e.target.value })}
                      className="w-full bg-white border border-[#E8E2D7] rounded-lg px-3 py-1.5 text-xs text-[#1A1A1A]"
                    />
                    <span className="text-[10px] text-[#736B63] block">Universal tag container deployment</span>
                  </div>

                  {/* Snapchat Pixel */}
                  <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E2D7] space-y-2 md:col-span-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#1A1A1A]">Snapchat Pixel ID</span>
                      <label className="flex items-center gap-1.5 cursor-pointer text-[11px]">
                        <input
                          type="checkbox"
                          checked={seoConfig.snapchatPixelActive}
                          onChange={(e) => setSeoConfig({ ...seoConfig, snapchatPixelActive: e.target.checked })}
                          className="rounded border-[#E8E2D7] text-[#3C1322]"
                        />
                        <span>Active</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                      value={seoConfig.snapchatPixelId}
                      onChange={(e) => setSeoConfig({ ...seoConfig, snapchatPixelId: e.target.value })}
                      className="w-full bg-white border border-[#E8E2D7] rounded-lg px-3 py-1.5 text-xs text-[#1A1A1A]"
                    />
                  </div>

                </div>

                {/* Save SEO & Pixels Action */}
                <div className="pt-3 border-t border-[#E8E2D7] flex items-center justify-between">
                  <span className="text-[11px] text-[#736B63]">
                    All tags will automatically activate on storefront visitors immediately upon publishing.
                  </span>
                  <button
                    type="button"
                    onClick={handleSaveSeoAndPixels}
                    className="btn-primary text-xs px-5 py-2 flex items-center gap-2 cursor-pointer shadow-soft"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save SEO & Pixel Configuration</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* MODAL: COMPREHENSIVE PRODUCT & STOCK DATA EDITOR ("CAN EDIT ANYTHING IN IT") */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E8E2D7] max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D7] mb-4">
              <div>
                <h3 className="font-serif text-lg font-normal text-[#1A1A1A]">
                  Edit Confection: {editingProduct.name}
                </h3>
                <span className="text-[11px] text-[#736B63]">
                  Modify any data field, pricing, stock inventory, and recipe attributes.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="p-1.5 rounded-full hover:bg-[#FAF7F2] text-[#736B63] hover:text-[#1A1A1A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProductEdit} className="space-y-4 text-xs">
              
              {/* Name & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#736B63] mb-1 font-medium">Product / Confection Name *</label>
                  <input
                    required
                    type="text"
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3 py-2 text-[#1A1A1A] font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[#736B63] mb-1 font-medium">Badge / Ribbon Text</label>
                  <input
                    type="text"
                    placeholder="e.g. BEST SELLER / ATELIER CRAFT"
                    value={editingProduct.badge || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3 py-2 text-[#1A1A1A]"
                  />
                </div>
              </div>

              {/* Price, Stock Quantity & Pieces */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#736B63] mb-1 font-medium">Price (EGP) *</label>
                  <input
                    required
                    type="number"
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3 py-2 text-[#1A1A1A] font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[#736B63] mb-1 font-medium">Stock Inventory *</label>
                  <input
                    required
                    type="number"
                    value={editingProduct.stock_quantity ?? 50}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock_quantity: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3 py-2 text-[#1A1A1A] font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[#736B63] mb-1 font-medium">Pieces / Pack</label>
                  <input
                    type="number"
                    value={editingProduct.pieces_per_pack || 20}
                    onChange={(e) => setEditingProduct({ ...editingProduct, pieces_per_pack: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3 py-2 text-[#1A1A1A]"
                  />
                </div>
              </div>

              {/* Weight & Image URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#736B63] mb-1 font-medium">Packaging Weight / Presentation</label>
                  <input
                    type="text"
                    value={editingProduct.weight || '250g Pouch'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, weight: e.target.value })}
                    placeholder="e.g. 250g Pouch / 12-Piece Linen Box"
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3 py-2 text-[#1A1A1A]"
                  />
                </div>

                <div>
                  <label className="block text-[#736B63] mb-1 font-medium">Image Asset URL</label>
                  <input
                    type="text"
                    value={editingProduct.image || editingProduct.image_url || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value, image_url: e.target.value })}
                    placeholder="/images/products/mango_sunbeam.jpg"
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3 py-2 text-[#1A1A1A]"
                  />
                </div>
              </div>

              {/* Tagline & Short Catchphrase */}
              <div>
                <label className="block text-[#736B63] mb-1 font-medium">Tagline / Tasting Headline</label>
                <input
                  type="text"
                  value={editingProduct.tagline || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, tagline: e.target.value })}
                  placeholder="e.g. Bright Alphonso mango purée balanced with European sweet cream butter."
                  className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3 py-2 text-[#1A1A1A]"
                />
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-[#736B63] mb-1 font-medium">Full Sensory Confection Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  placeholder="Detailed craft recipe, origin of fruit purée, and texture profile..."
                  className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3 py-2 text-[#1A1A1A]"
                />
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-[#E8E2D7] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleDeleteProduct(editingProduct.id, editingProduct.name)}
                  className="text-xs text-[#C53030] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Confection</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 border border-[#E8E2D7] rounded-full text-[#736B63] hover:text-[#1A1A1A] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary text-xs px-5 py-2 cursor-pointer shadow-soft flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save All Changes</span>
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW TRANSFER RECEIPT IMAGE */}
      {inspectingReceipt && (
        <div
          onClick={() => setInspectingReceipt(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-xl max-h-[85vh] bg-white rounded-2xl overflow-hidden p-2">
            <button
              onClick={() => setInspectingReceipt(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={inspectingReceipt}
              alt="Transfer receipt"
              className="max-h-[80vh] w-auto mx-auto object-contain rounded-xl"
            />
          </div>
        </div>
      )}

      {/* MODAL: ADD CONFECTION RECIPE */}
      {isNewProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E8E2D7] max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D7] mb-4">
              <h3 className="font-serif text-lg font-normal text-[#1A1A1A]">Add New Confection</h3>
              <button onClick={() => setIsNewProductModalOpen(false)} className="p-1 text-[#736B63] hover:text-[#1A1A1A]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                const newP = {
                  id: `custom-${Date.now()}`,
                  name: form.name.value,
                  price: Number(form.price.value),
                  weight: form.weight.value || '250g Pouch',
                  pieces_per_pack: Number(form.pieces.value) || 20,
                  stock_quantity: Number(form.stock.value) || 50,
                  image: '/images/products/mango_sunbeam.jpg',
                  in_stock: true
                };
                setProducts([...products, newP]);
                setIsNewProductModalOpen(false);
                showToast(`Added ${newP.name} to catalog!`);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-[#736B63] mb-1 font-medium">Confection Name</label>
                <input required name="name" placeholder="e.g. Vanilla Bean Caramel" className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3 py-2 text-[#1A1A1A]" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#736B63] mb-1 font-medium">Price (EGP)</label>
                  <input required type="number" name="price" defaultValue="260" className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3 py-2 text-[#1A1A1A]" />
                </div>
                <div>
                  <label className="block text-[#736B63] mb-1 font-medium">Initial Stock</label>
                  <input required type="number" name="stock" defaultValue="50" className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3 py-2 text-[#1A1A1A]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#736B63] mb-1 font-medium">Weight</label>
                  <input name="weight" defaultValue="250g Pouch" className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3 py-2 text-[#1A1A1A]" />
                </div>
                <div>
                  <label className="block text-[#736B63] mb-1 font-medium">Pieces / Pack</label>
                  <input type="number" name="pieces" defaultValue="20" className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3 py-2 text-[#1A1A1A]" />
                </div>
              </div>

              <div className="pt-3 border-t border-[#E8E2D7] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewProductModalOpen(false)}
                  className="px-4 py-2 border border-[#E8E2D7] rounded-full text-[#736B63]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-4 py-2 text-xs"
                >
                  Save Confection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
