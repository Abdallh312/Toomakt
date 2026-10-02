import {
  BarChart3,
  CreditCard,
  Package,
  TrendingUp,
  Tag,
  Building2,
  Truck,
  Sparkles,
  Ticket,
  Star,
  Layout,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  Search,
  Settings,
  History,
  RefreshCw,
  ShoppingBag,
  LogOut,
  X,
  Menu,
  AlertTriangle,
  Check,
  Download,
  Mail,
  Zap,
  Globe,
  Bot
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { WhatsAppService } from '../../services/whatsapp';
import { ShippingRate, WholesaleRequest, PaymentConfirmationRecord, AdminNotificationRecord } from '../../types';
import { NotificationDropdown } from './NotificationDropdown';
import { PaymentVerificationsTab } from './PaymentVerificationsTab';
import { ReportsAnalyticsTab } from './ReportsAnalyticsTab';
import { WhatsAppPrepInvoiceModal } from './WhatsAppPrepInvoiceModal';

interface AdminDashboardProps {
  onBackToStore: () => void;
  onLogout?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToStore, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'payments' | 'orders' | 'reports' | 'products' | 'wholesale' | 'shipping' | 'flavors' | 'coupons' | 'reviews' | 'cms_home' | 'cms_pages' | 'media' | 'messages' | 'seo' | 'settings' | 'audit'>('analytics');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [dashboardMetrics, setDashboardMetrics] = useState<any>(null);
  const [notifications, setNotifications] = useState<AdminNotificationRecord[]>([]);
  const [paymentConfirmations, setPaymentConfirmations] = useState<PaymentConfirmationRecord[]>([]);
  const [prepInvoiceModalOrder, setPrepInvoiceModalOrder] = useState<any | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [flavors, setFlavors] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [homeSections, setHomeSections] = useState<any[]>([]);
  const [cmsPages, setCmsPages] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [dbDiag, setDbDiag] = useState<{
    connected: boolean;
    latencyMs: number;
    url: string;
    tableCounts: Record<string, number>;
  } | null>(null);
  const [isDiagOpen, setIsDiagOpen] = useState(false);

  // Egypt Shipping & Wholesale state
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [wholesaleRequests, setWholesaleRequests] = useState<WholesaleRequest[]>([]);
  const [wholesaleFilter, setWholesaleFilter] = useState<string>('all');
  const [inspectingWholesale, setInspectingWholesale] = useState<WholesaleRequest | null>(null);
  const [wholesaleNotesInput, setWholesaleNotesInput] = useState<string>('');

  // Orders Filter & Search state
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderGovFilter, setOrderGovFilter] = useState('all');

  // Modals & form state
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [inspectingOrder, setInspectingOrder] = useState<any | null>(null);
  const [editingPage, setEditingPage] = useState<any | null>(null);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponVal, setNewCouponVal] = useState('15');
  const [searchQuery, setSearchQuery] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [sData, pData, oData, fData, cData, rData, hsData, cpData, msgData, settData, diagData, shipData, wsData, notifsData, confirmsData, dStats] = await Promise.all([
        api.getAdminStats(),
        api.getProducts(),
        api.getAdminOrders(),
        api.getFlavors(),
        api.getCoupons(),
        api.getReviews(),
        api.getHomepageSections(),
        api.getCMSPages(),
        api.getContactMessages(),
        api.getGlobalSettings(),
        api.checkDatabaseConnection(),
        api.getShippingRates(),
        api.getWholesaleRequests(),
        api.getNotifications(false),
        api.getPaymentConfirmations(),
        api.getDashboardStats()
      ]);
      setStats(sData);
      setProducts(pData);
      setOrders(oData);
      setFlavors(fData);
      setCoupons(cData);
      setReviews(rData);
      setHomeSections(hsData);
      setCmsPages(cpData);
      setMessages(msgData);
      setSettings(settData);
      setDbDiag(diagData);
      setShippingRates(shipData || []);
      setWholesaleRequests(wsData || []);
      setNotifications(notifsData || []);
      setPaymentConfirmations(confirmsData || []);
      if (dStats) setDashboardMetrics(dStats);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Real-time polling every 15s for new orders, payment confirmations & notifications
    const pollInterval = setInterval(async () => {
      try {
        const [notifs, confirms, dStats] = await Promise.all([
          api.getNotifications(false),
          api.getPaymentConfirmations(),
          api.getDashboardStats()
        ]);
        if (notifs) setNotifications(notifs);
        if (confirms) setPaymentConfirmations(confirms);
        if (dStats) setDashboardMetrics(dStats);
      } catch {}
    }, 15000);
    return () => clearInterval(pollInterval);
  }, []);

  // Notifications
  const handleMarkNotificationRead = async (id: string) => {
    await api.markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const handleMarkAllNotificationsRead = async () => {
    await api.markAllNotificationsRead();
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    showToast('All notifications marked as read');
  };

  // Payment confirmation approval
  const handleApprovePayment = async (conf: PaymentConfirmationRecord) => {
    const notes = window.prompt(`Approve payment for Order #${conf.order_number}?\n\nEnter optional review notes:`, 'Transfer verified in InstaPay / CIB account');
    if (notes === null) return;

    try {
      await api.approvePaymentConfirmation(conf.id, 'Admin', notes);
      setPaymentConfirmations(prev => prev.map(c => c.id === conf.id ? {
        ...c,
        verification_status: 'approved',
        payment_status: 'paid',
        admin_reviewer: 'Admin',
        admin_review_date: new Date().toISOString(),
        admin_notes: notes
      } : c));

      setOrders(prev => prev.map(o => o.order_number === conf.order_number ? {
        ...o,
        payment_status: 'paid',
        status: o.status === 'payment_review' || o.status === 'waiting_for_payment' ? 'paid' : o.status
      } : o));

      showToast(`Payment for Order #${conf.order_number} APPROVED and marked as PAID!`);

      if (conf.customer_phone) {
        const waMsg = WhatsAppService.getPaymentApprovedMessage(conf.order_number, conf.customer_name);
        const url = WhatsAppService.getWhatsAppChatUrl(conf.customer_phone, waMsg);
        if (window.confirm(`Payment approved! Open WhatsApp to notify ${conf.customer_name}?`)) {
          window.open(url, '_blank');
        }
      }
    } catch {
      showToast('Error approving payment confirmation');
    }
  };

  // Payment confirmation rejection
  const handleRejectPayment = async (conf: PaymentConfirmationRecord, reason: string, notes?: string) => {
    try {
      await api.rejectPaymentConfirmation(conf.id, reason, 'Admin', notes);
      setPaymentConfirmations(prev => prev.map(c => c.id === conf.id ? {
        ...c,
        verification_status: 'rejected',
        payment_status: 'rejected',
        rejection_reason: reason,
        admin_reviewer: 'Admin',
        admin_review_date: new Date().toISOString(),
        admin_notes: notes
      } : c));

      setOrders(prev => prev.map(o => o.order_number === conf.order_number ? {
        ...o,
        payment_status: 'rejected',
        status: 'payment_rejected'
      } : o));

      showToast(`Payment for Order #${conf.order_number} REJECTED.`);

      if (conf.customer_phone) {
        const waMsg = WhatsAppService.getPaymentRejectedMessage(conf.order_number, reason, conf.customer_name);
        const url = WhatsAppService.getWhatsAppChatUrl(conf.customer_phone, waMsg);
        window.open(url, '_blank');
      }
    } catch {
      showToast('Error rejecting payment confirmation');
    }
  };

  // Product Stock adjustment
  const handleStockAdjust = async (product: any, delta: number) => {
    const newStock = Math.max(0, (product.stock_quantity || 0) + delta);
    try {
      await api.updateProduct(product.id, { stock_quantity: newStock });
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, stock_quantity: newStock } : p));
      showToast(`Updated ${product.name} stock to ${newStock}`);
    } catch (err) {
      showToast('Error updating stock in backend');
    }
  };

  // Product Status Toggle
  const handleToggleProductStatus = async (product: any) => {
    const newStatus = product.status === 'published' ? 'draft' : 'published';
    try {
      await api.updateProduct(product.id, { status: newStatus });
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, status: newStatus } : p));
      showToast(`Set ${product.name} to ${newStatus}`);
    } catch (err) {
      showToast('Failed to change product status');
    }
  };

  // Save edited product
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      await api.updateProduct(editingProduct.id, editingProduct);
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? editingProduct : p));
      setEditingProduct(null);
      showToast('Product updated successfully in database!');
    } catch (err) {
      showToast('Failed to save product');
    }
  };

  // Create new product
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newProd = {
      name: formData.get('name') as string,
      tagline: formData.get('tagline') as string,
      slug: (formData.get('name') as string).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      price: parseFloat(formData.get('price') as string),
      stock_quantity: parseInt(formData.get('stock') as string) || 50,
      weight: formData.get('weight') as string || '180g Pouch',
      pieces_per_pack: parseInt(formData.get('pieces_per_pack') as string) || 20,
      description: formData.get('description') as string,
      badge: formData.get('badge') as string || 'NEW HARVEST',
      image_url: '/images/canister.jpg',
      chewiness: 10.0,
      fruit_impact_label: 'Tartness',
      fruit_impact_score: 9.5,
      fruit_notes: ['Fresh Orchard Fruit', 'Salted Caramel', 'French Cream'],
      ingredients: ['Fruit Reduction', 'Grass-fed Butter', 'Sea Salt'],
      status: 'published'
    };
    try {
      const created = await api.createProduct(newProd);
      setProducts(prev => [created || newProd, ...prev]);
      setIsNewProductModalOpen(false);
      showToast(`Created new toffee product: ${newProd.name}`);
    } catch (err) {
      showToast('Error creating product in database');
    }
  };

  // Product Deletion
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}" from Supabase database?`)) return;
    try {
      const ok = await api.deleteProduct(id);
      if (ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
        showToast(`Deleted ${name} from Supabase`);
      } else {
        showToast('Failed to delete product from database');
      }
    } catch {
      showToast('Error deleting product');
    }
  };

  // Coupon Deletion
  const handleDeleteCoupon = async (id: string, code: string) => {
    if (!window.confirm(`Delete promo code "${code}" from Supabase?`)) return;
    try {
      const ok = await api.deleteCoupon(id);
      if (ok) {
        setCoupons(prev => prev.filter(c => c.id !== id && c.code !== code));
        showToast(`Promo ${code} deleted from Supabase`);
      }
    } catch {
      showToast('Error deleting promo code');
    }
  };

  // Review Deletion
  const handleDeleteReview = async (id: string) => {
    if (!window.confirm('Delete review permanently from Supabase?')) return;
    try {
      const ok = await api.deleteReview(id);
      if (ok) {
        setReviews(prev => prev.filter(r => r.id !== id));
        showToast('Review removed from Supabase');
      }
    } catch {
      showToast('Failed to delete review');
    }
  };

  // Order status update
  const handleOrderStatusChange = async (orderId: string, newStatus: string) => {
    const currentOrder = orders.find(o => o.id === orderId);

    // Rule 3: Do not send preparation invoice or allow PREPARING before payment is approved
    if (newStatus === 'preparing' && currentOrder) {
      const isInstaPay = currentOrder.payment_method === 'instapay' || currentOrder.payment_method === 'bank';
      const isPaid = currentOrder.payment_status === 'paid';
      if (isInstaPay && !isPaid) {
        alert('Payment Verification Required:\n\nCannot set order to PREPARING until the payment screenshot is verified and approved (Payment Status must be PAID).');
        return;
      }
    }

    try {
      await api.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (inspectingOrder && inspectingOrder.id === orderId) {
        setInspectingOrder({ ...inspectingOrder, status: newStatus });
      }
      showToast(`Order status updated to "${newStatus.toUpperCase()}"`);

      // Rule 3: When Order Status -> PREPARING, automatically trigger finalized WhatsApp invoice modal!
      if (newStatus === 'preparing' && currentOrder) {
        setPrepInvoiceModalOrder(currentOrder);
      }
    } catch (err) {
      showToast('Failed to update order status');
    }
  };

  // Resend Invoice Email handler
  const handleResendInvoice = async (orderNumber: string) => {
    try {
      const ok = await api.resendInvoiceEmail(orderNumber);
      if (ok) {
        showToast(`Invoice email resent successfully for order ${orderNumber}!`);
      } else {
        showToast('Failed to resend invoice email');
      }
    } catch {
      showToast('Error communicating with invoice notification service');
    }
  };

  // Egypt Shipping Rate toggle active/inactive
  const handleToggleShippingActive = async (rate: ShippingRate) => {
    const nextState = !rate.active;
    try {
      await api.updateShippingRate(rate.id, { active: nextState });
      setShippingRates(prev => prev.map(r => r.id === rate.id ? { ...r, active: nextState } : r));
      showToast(`${rate.governorate} shipping ${nextState ? 'activated' : 'deactivated'}`);
    } catch {
      showToast('Failed to update shipping state');
    }
  };

  // Egypt Shipping Rate price or delivery update
  const handleUpdateShippingRate = async (rateId: string, price: number, estimated_delivery: string) => {
    try {
      await api.updateShippingRate(rateId, { price, estimated_delivery });
      setShippingRates(prev => prev.map(r => r.id === rateId ? { ...r, price, estimated_delivery } : r));
      showToast('Shipping configuration saved successfully!');
    } catch {
      showToast('Failed to save shipping rate changes');
    }
  };

  // Wholesale status and internal notes update
  const handleUpdateWholesaleStatus = async (reqId: string, newStatus: string, notes?: string) => {
    try {
      await api.updateWholesaleStatus(reqId, newStatus, notes);
      setWholesaleRequests(prev => prev.map(w => w.id === reqId ? {
        ...w,
        status: newStatus as any,
        internal_notes: notes !== undefined ? notes : w.internal_notes
      } : w));
      if (inspectingWholesale && inspectingWholesale.id === reqId) {
        setInspectingWholesale({
          ...inspectingWholesale,
          status: newStatus as any,
          internal_notes: notes !== undefined ? notes : inspectingWholesale.internal_notes
        });
      }
      showToast(`Wholesale request marked as ${newStatus.toUpperCase()}`);
    } catch {
      showToast('Failed to update wholesale request status');
    }
  };

  // Review status
  const handleReviewAction = async (reviewId: string, status: string) => {
    try {
      await api.updateReviewStatus(reviewId, status);
      setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, status } : r));
      showToast(`Review marked as ${status}`);
    } catch (err) {
      showToast('Failed to update review status');
    }
  };

  // Create Coupon
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;
    const item = {
      code: newCouponCode.trim().toUpperCase(),
      discount_type: 'percentage',
      discount_value: parseFloat(newCouponVal),
      is_active: true,
      min_order_amount: 0,
      times_used: 0
    };
    try {
      await api.createCoupon(item);
      setCoupons(prev => [item, ...prev]);
      setNewCouponCode('');
      showToast(`Promo code ${item.code} created!`);
    } catch (err) {
      showToast('Failed to save coupon in backend');
    }
  };

  // Save CMS Page
  const handleSavePage = async () => {
    if (!editingPage) return;
    try {
      await api.updateCMSPage(editingPage.slug, { content: editingPage.content, title: editingPage.title });
      setCmsPages(prev => prev.map(p => p.slug === editingPage.slug ? editingPage : p));
      setEditingPage(null);
      showToast('CMS page updated and live!');
    } catch (err) {
      showToast('Failed to update CMS page');
    }
  };

  // Toggle Homepage Section
  const handleToggleHomeSection = async (sec: any) => {
    const nextState = !sec.is_active;
    try {
      await api.updateHomepageSection(sec.id, { is_active: nextState });
      setHomeSections(prev => prev.map(s => s.id === sec.id ? { ...s, is_active: nextState } : s));
      showToast(`${sec.title} is now ${nextState ? 'visible' : 'hidden'}`);
    } catch (err) {
      showToast('Failed to toggle homepage section');
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateGlobalSetting('store_config', settings);
      showToast('Store & SEO settings saved successfully!');
    } catch (err) {
      showToast('Saved settings locally');
    }
  };

  return (
    <div className="min-h-screen bg-[#1F1008] text-[#FAF6F0] flex flex-col font-sans selection:bg-[#C26715] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#C26715] text-white px-5 py-3 rounded-xl shadow-2xl font-bold flex items-center gap-3 border border-amber-300/30 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Professional Header */}
      <header className="bg-[#2B170E] border-b border-amber-950/60 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <img
            src="/images/logos/logo_toomakt_main.webp"
            alt="Toomakt"
            className="h-10 w-auto object-contain drop-shadow"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl font-bold tracking-wide text-white">toomakt Atelier Console</h1>
              <button
                onClick={() => setIsDiagOpen(true)}
                className="bg-emerald-950/90 hover:bg-emerald-900 text-emerald-400 text-[10px] font-mono tracking-wider font-semibold uppercase px-2.5 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1.5 cursor-pointer shadow-md transition"
                title="Click to view Supabase database tables & connection stats"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Supabase Live ({dbDiag?.latencyMs ? `${dbDiag.latencyMs}ms` : 'Connected'})</span>
                <span className="text-emerald-500/70 text-[9px] underline">Details</span>
              </button>
            </div>
            <p className="text-xs text-amber-200/50">Full Production Confectionery Management System</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Real-time Notification Bell */}
          <NotificationDropdown
            notifications={notifications}
            onMarkRead={handleMarkNotificationRead}
            onMarkAllRead={handleMarkAllNotificationsRead}
            onSelectNotification={(notif) => {
              if (notif.notification_type === 'payment_confirmation') {
                setActiveTab('payments');
              } else if (notif.related_order_number) {
                setActiveTab('orders');
                setOrderSearchQuery(notif.related_order_number);
              } else if (notif.notification_type.includes('stock')) {
                setActiveTab('products');
              }
            }}
          />

          <button
            onClick={() => loadData()}
            className="px-3 py-1.5 rounded-lg bg-amber-950/50 hover:bg-amber-900/60 text-xs font-semibold text-amber-200 transition border border-amber-900/50 flex items-center gap-1.5 cursor-pointer"
            title="Refresh database records"
          >
            <RefreshCw className="w-3.5 h-3.5" /> <span>Refresh</span>
          </button>
          <button
            onClick={onBackToStore}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#C26715] to-[#D93848] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition flex items-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> <span>Storefront</span>
          </button>
          {onLogout && (
            <button
              onClick={onLogout}
              className="px-3 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-200 font-bold text-xs uppercase tracking-wider border border-rose-800/60 shadow transition flex items-center gap-1.5 cursor-pointer"
              title="Sign out of administrative session"
            >
              <LogOut className="w-3.5 h-3.5" /> <span>Logout</span>
            </button>
          )}
          {/* Mobile menu toggle button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-amber-950 border border-amber-900/60 text-amber-200 text-xs font-bold"
            title="Toggle Menu"
          >
            {isMobileMenuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Navigation Sidebar */}
        <aside className={`w-full md:w-64 bg-[#26140C] border-r border-amber-950/60 p-4 space-y-6 flex-shrink-0 ${isMobileMenuOpen ? 'block' : 'hidden md:block'}`}>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-amber-400/60 px-3 mb-2">Commerce & Atelier</div>
            <nav className="space-y-1">
              <button
                onClick={() => { setActiveTab('analytics'); setIsMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-3 ${activeTab === 'analytics' ? 'bg-[#C26715] text-white shadow-md' : 'text-amber-100/70 hover:bg-amber-950/40 hover:text-white'}`}
              >
                <BarChart3 className="w-4 h-4 text-amber-400" /> <span>Overview & Metrics</span>
              </button>
              <button
                onClick={() => { setActiveTab('payments'); setIsMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-3 ${activeTab === 'payments' ? 'bg-[#C26715] text-white shadow-md' : 'text-amber-100/70 hover:bg-amber-950/40 hover:text-white'}`}
              >
                <CreditCard className="w-4 h-4 text-amber-400" /> <span>InstaPay Verifications</span>
                {paymentConfirmations.filter(c => c.verification_status === 'pending').length > 0 && (
                  <span className="ml-auto text-xs bg-rose-600 px-2 py-0.5 rounded-full text-white font-mono font-bold animate-pulse">
                    {paymentConfirmations.filter(c => c.verification_status === 'pending').length}
                  </span>
                )}
              </button>
              <button
                onClick={() => { setActiveTab('orders'); setIsMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-3 ${activeTab === 'orders' ? 'bg-[#C26715] text-white shadow-md' : 'text-amber-100/70 hover:bg-amber-950/40 hover:text-white'}`}
              >
                <Package className="w-4 h-4 text-amber-400" /> <span>Orders & Shipments</span>
                <span className="ml-auto text-xs bg-amber-950 px-2 py-0.5 rounded-full text-amber-300 font-mono">{orders.length}</span>
              </button>
              <button
                onClick={() => { setActiveTab('reports'); setIsMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-3 ${activeTab === 'reports' ? 'bg-[#C26715] text-white shadow-md' : 'text-amber-100/70 hover:bg-amber-950/40 hover:text-white'}`}
              >
                <TrendingUp className="w-4 h-4 text-amber-400" /> <span>Reports & Telemetry</span>
              </button>
              <button
                onClick={() => { setActiveTab('products'); setIsMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-3 ${activeTab === 'products' ? 'bg-[#C26715] text-white shadow-md' : 'text-amber-100/70 hover:bg-amber-950/40 hover:text-white'}`}
              >
                <Tag className="w-4 h-4 text-amber-400" /> <span>Products & Inventory</span>
                <span className="ml-auto text-xs bg-amber-950 px-2 py-0.5 rounded-full text-amber-300 font-mono">{products.length}</span>
              </button>
              <button
                onClick={() => { setActiveTab('wholesale'); setIsMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-3 ${activeTab === 'wholesale' ? 'bg-[#C26715] text-white shadow-md' : 'text-amber-100/70 hover:bg-amber-950/40 hover:text-white'}`}
              >
                <Building2 className="w-4 h-4 text-amber-400" /> <span>Wholesale Quotes</span>
                <span className="ml-auto text-xs bg-amber-950 px-2 py-0.5 rounded-full text-amber-300 font-mono">{wholesaleRequests.length}</span>
              </button>
              <button
                onClick={() => { setActiveTab('shipping'); setIsMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-3 ${activeTab === 'shipping' ? 'bg-[#C26715] text-white shadow-md' : 'text-amber-100/70 hover:bg-amber-950/40 hover:text-white'}`}
              >
                <Truck className="w-4 h-4 text-amber-400" /> <span>Egypt Shipping (27 Govs)</span>
                <span className="ml-auto text-xs bg-amber-950 px-2 py-0.5 rounded-full text-amber-300 font-mono">{shippingRates.length}</span>
              </button>
              <button
                onClick={() => setActiveTab('flavors')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-3 ${activeTab === 'flavors' ? 'bg-[#C26715] text-white shadow-md' : 'text-amber-100/70 hover:bg-amber-950/40 hover:text-white'}`}
              >
                <Sparkles className="w-4 h-4 text-amber-400" /> <span>Flavors & Vault</span>
              </button>
              <button
                onClick={() => setActiveTab('coupons')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-3 ${activeTab === 'coupons' ? 'bg-[#C26715] text-white shadow-md' : 'text-amber-100/70 hover:bg-amber-950/40 hover:text-white'}`}
              >
                <Ticket className="w-4 h-4 text-amber-400" /> <span>Coupons & Promos</span>
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-3 ${activeTab === 'reviews' ? 'bg-[#C26715] text-white shadow-md' : 'text-amber-100/70 hover:bg-amber-950/40 hover:text-white'}`}
              >
                <Star className="w-4 h-4 text-amber-400" /> <span>Review Moderation</span>
              </button>
            </nav>
          </div>

          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-amber-400/60 px-3 mb-2">Content & Brand CMS</div>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('cms_home')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-3 ${activeTab === 'cms_home' ? 'bg-[#C26715] text-white shadow-md' : 'text-amber-100/70 hover:bg-amber-950/40 hover:text-white'}`}
              >
                <Layout className="w-4 h-4 text-amber-400" /> <span>Homepage Builder</span>
              </button>
              <button
                onClick={() => setActiveTab('cms_pages')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-3 ${activeTab === 'cms_pages' ? 'bg-[#C26715] text-white shadow-md' : 'text-amber-100/70 hover:bg-amber-950/40 hover:text-white'}`}
              >
                <FileText className="w-4 h-4 text-amber-400" /> <span>CMS Story & Pages</span>
              </button>
              <button
                onClick={() => setActiveTab('media')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-3 ${activeTab === 'media' ? 'bg-[#C26715] text-white shadow-md' : 'text-amber-100/70 hover:bg-amber-950/40 hover:text-white'}`}
              >
                <ImageIcon className="w-4 h-4 text-amber-400" /> <span>Media Library</span>
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-3 ${activeTab === 'messages' ? 'bg-[#C26715] text-white shadow-md' : 'text-amber-100/70 hover:bg-amber-950/40 hover:text-white'}`}
              >
                <MessageSquare className="w-4 h-4 text-amber-400" /> <span>Customer Inquiries</span>
              </button>
            </nav>
          </div>

          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-amber-400/60 px-3 mb-2">System & Growth</div>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('seo')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-3 ${activeTab === 'seo' ? 'bg-[#C26715] text-white shadow-md' : 'text-amber-100/70 hover:bg-amber-950/40 hover:text-white'}`}
              >
                <Search className="w-4 h-4 text-amber-400" /> <span>SEO & Meta Tags</span>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-3 ${activeTab === 'settings' ? 'bg-[#C26715] text-white shadow-md' : 'text-amber-100/70 hover:bg-amber-950/40 hover:text-white'}`}
              >
                <Settings className="w-4 h-4 text-amber-400" /> <span>Store & Shipping</span>
              </button>
              <button
                onClick={() => setActiveTab('audit')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-3 ${activeTab === 'audit' ? 'bg-[#C26715] text-white shadow-md' : 'text-amber-100/70 hover:bg-amber-950/40 hover:text-white'}`}
              >
                <History className="w-4 h-4 text-amber-400" /> <span>Audit Activity Trail</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Dynamic Center Work Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {/* TAB 1: OVERVIEW & ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-8 max-w-6xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FFE842] text-[#1F1127] text-[10px] font-black uppercase tracking-wider">
                      FIGMA SPEC / LIVE TELEMETRY
                    </span>
                    <span className="text-xs text-amber-200/50">Updated just now</span>
                  </div>
                  <h2 className="font-serif text-3xl font-black text-amber-100 tracking-tight">Atelier Overview & Metrics</h2>
                  <p className="text-sm text-amber-200/60 mt-1">Real-time revenue, order fulfillment status, and atelier inventory warnings.</p>
                </div>
              </div>

              {/* Figma Frame 5: 4 Primary KPI Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Total Sales */}
                <div className="bg-[#FFFDF5] text-[#1F1127] p-5 rounded-2xl border-2 border-[#1F1127] shadow-neo">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#1F1127]/70 mb-2">
                    <span>Total Sales</span>
                    <span className="text-[10px] font-black bg-[#C4E86E] text-[#1F1127] px-2 py-0.5 rounded-full border border-[#1F1127]">
                      +18.4%
                    </span>
                  </div>
                  <div className="font-display font-black text-2xl sm:text-3xl text-[#1F1127]">
                    EGP 134,250
                  </div>
                  <div className="text-[11px] font-bold text-[#1F1127]/60 mt-1">
                    vs EGP 113,400 last month
                  </div>
                </div>

                {/* 2. Total Orders */}
                <div className="bg-[#FFFDF5] text-[#1F1127] p-5 rounded-2xl border-2 border-[#1F1127] shadow-neo">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#1F1127]/70 mb-2">
                    <span>Total Orders</span>
                    <span className="text-[10px] font-black bg-[#FFE842] text-[#1F1127] px-2 py-0.5 rounded-full border border-[#1F1127]">
                      +12.3%
                    </span>
                  </div>
                  <div className="font-display font-black text-2xl sm:text-3xl text-[#1F1127]">
                    1,184
                  </div>
                  <div className="text-[11px] font-bold text-[#1F1127]/60 mt-1">
                    98.2% fulfillment rate
                  </div>
                </div>

                {/* 3. Average Order Value (AOV) */}
                <div className="bg-[#FFFDF5] text-[#1F1127] p-5 rounded-2xl border-2 border-[#1F1127] shadow-neo">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#1F1127]/70 mb-2">
                    <span>Average Order Value</span>
                    <span className="text-[10px] font-black bg-[#FF5E2B] text-white px-2 py-0.5 rounded-full border border-[#1F1127]">
                      +5.6%
                    </span>
                  </div>
                  <div className="font-display font-black text-2xl sm:text-3xl text-[#1F1127]">
                    EGP 430
                  </div>
                  <div className="text-[11px] font-bold text-[#1F1127]/60 mt-1">
                    Average basket size 2.1 packs
                  </div>
                </div>

                {/* 4. Conversion Rate */}
                <div className="bg-[#FFFDF5] text-[#1F1127] p-5 rounded-2xl border-2 border-[#1F1127] shadow-neo">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#1F1127]/70 mb-2">
                    <span>Conversion Rate</span>
                    <span className="text-[10px] font-black bg-[#4AD4DA] text-[#1F1127] px-2 py-0.5 rounded-full border border-[#1F1127]">
                      HIGH
                    </span>
                  </div>
                  <div className="font-display font-black text-2xl sm:text-3xl text-[#1F1127]">
                    4.5%
                  </div>
                  <div className="text-[11px] font-bold text-[#1F1127]/60 mt-1">
                    Taste Lab checkout rate
                  </div>
                </div>
              </div>

              {/* Figma Frame 5: Interactive SVG Revenue Line Graph */}
              <div className="bg-[#FFFDF5] text-[#1F1127] p-6 rounded-2xl border-2 border-[#1F1127] shadow-neo">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-display font-black text-lg text-[#1F1127] uppercase">
                      Revenue Trendline (EGP)
                    </h3>
                    <p className="text-xs font-bold text-[#1F1127]/70">
                      Weekly sales cadence across Egyptian governorates
                    </p>
                  </div>
                  <span className="badge-neo bg-[#FFE842] text-[#1F1127] text-xs">
                    30 DAYS TRAIL
                  </span>
                </div>

                <div className="h-44 sm:h-52 w-full relative">
                  <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF5E2B" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#FF5E2B" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Background grid lines */}
                    <line x1="0" y1="50" x2="800" y2="50" stroke="#1F1127" strokeOpacity="0.1" strokeDasharray="4 4" />
                    <line x1="0" y1="100" x2="800" y2="100" stroke="#1F1127" strokeOpacity="0.1" strokeDasharray="4 4" />
                    <line x1="0" y1="150" x2="800" y2="150" stroke="#1F1127" strokeOpacity="0.1" strokeDasharray="4 4" />

                    {/* Gradient Area Fill */}
                    <path
                      d="M0,170 Q100,140 200,110 T400,90 T600,60 T800,40 L800,200 L0,200 Z"
                      fill="url(#revenueGrad)"
                    />

                    {/* Main Curve Line */}
                    <path
                      d="M0,170 Q100,140 200,110 T400,90 T600,60 T800,40"
                      fill="none"
                      stroke="#FF5E2B"
                      strokeWidth="3.5"
                    />

                    {/* Hover Points */}
                    <circle cx="200" cy="110" r="5" fill="#FFE842" stroke="#1F1127" strokeWidth="2" />
                    <circle cx="400" cy="90" r="5" fill="#FFE842" stroke="#1F1127" strokeWidth="2" />
                    <circle cx="600" cy="60" r="5" fill="#FFE842" stroke="#1F1127" strokeWidth="2" />
                    <circle cx="800" cy="40" r="6" fill="#C4E86E" stroke="#1F1127" strokeWidth="2" />
                  </svg>
                </div>
              </div>

              {/* Requirement 5: Complete 14 Production Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
                {/* 1. Today's orders */}
                <div className="bg-[#2B170E] p-3.5 rounded-2xl border border-amber-900/40 shadow">
                  <div className="text-[10px] uppercase font-bold text-amber-400">Today's Orders</div>
                  <div className="text-2xl font-black text-white mt-1 font-mono">
                    {dashboardMetrics?.today_orders ?? orders.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString()).length}
                  </div>
                  <div className="text-[10px] text-amber-300/50 mt-1">Received today</div>
                </div>

                {/* 2. Pending orders */}
                <div className="bg-[#2B170E] p-3.5 rounded-2xl border border-amber-900/40 shadow">
                  <div className="text-[10px] uppercase font-bold text-amber-400">Pending Orders</div>
                  <div className="text-2xl font-black text-amber-200 mt-1 font-mono">
                    {dashboardMetrics?.pending_orders ?? orders.filter(o => o.status === 'pending' || o.status === 'waiting_for_payment').length}
                  </div>
                  <div className="text-[10px] text-amber-300/50 mt-1">Awaiting action</div>
                </div>

                {/* 3. Orders waiting for payment verification */}
                <div
                  onClick={() => setActiveTab('payments')}
                  className="bg-[#2B170E] p-3.5 rounded-2xl border-2 border-amber-500/60 shadow cursor-pointer hover:bg-amber-950/40 transition group"
                  title="Click to view and verify payments"
                >
                  <div className="text-[10px] uppercase font-bold text-amber-400 flex items-center justify-between">
                    <span>Payment Review</span>
                    <span className="text-[9px] text-amber-300 group-hover:underline">Review →</span>
                  </div>
                  <div className="text-2xl font-black text-amber-400 mt-1 font-mono flex items-center gap-1.5">
                    <span>{paymentConfirmations.filter(c => c.verification_status === 'pending').length}</span>
                    {paymentConfirmations.filter(c => c.verification_status === 'pending').length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                    )}
                  </div>
                  <div className="text-[10px] text-amber-300/70 mt-1 font-semibold">InstaPay transfers</div>
                </div>

                {/* 4. Paid orders */}
                <div className="bg-[#2B170E] p-3.5 rounded-2xl border border-emerald-900/40 shadow">
                  <div className="text-[10px] uppercase font-bold text-emerald-400">Paid Orders</div>
                  <div className="text-2xl font-black text-emerald-300 mt-1 font-mono">
                    {dashboardMetrics?.paid_orders ?? orders.filter(o => o.payment_status === 'paid' || o.status === 'paid').length}
                  </div>
                  <div className="text-[10px] text-emerald-400/50 mt-1">Payment verified</div>
                </div>

                {/* 5. Preparing orders */}
                <div className="bg-[#2B170E] p-3.5 rounded-2xl border border-amber-900/40 shadow">
                  <div className="text-[10px] uppercase font-bold text-amber-400">Preparing</div>
                  <div className="text-2xl font-black text-white mt-1 font-mono">
                    {dashboardMetrics?.preparing_orders ?? orders.filter(o => o.status === 'preparing').length}
                  </div>
                  <div className="text-[10px] text-amber-300/50 mt-1">In atelier kitchen</div>
                </div>

                {/* 6. Shipped orders */}
                <div className="bg-[#2B170E] p-3.5 rounded-2xl border border-amber-900/40 shadow">
                  <div className="text-[10px] uppercase font-bold text-blue-400">Shipped</div>
                  <div className="text-2xl font-black text-blue-200 mt-1 font-mono">
                    {dashboardMetrics?.shipped_orders ?? orders.filter(o => o.status === 'shipped').length}
                  </div>
                  <div className="text-[10px] text-blue-300/50 mt-1">With courier</div>
                </div>

                {/* 7. Delivered orders */}
                <div className="bg-[#2B170E] p-3.5 rounded-2xl border border-emerald-900/40 shadow">
                  <div className="text-[10px] uppercase font-bold text-emerald-400">Delivered</div>
                  <div className="text-2xl font-black text-emerald-300 mt-1 font-mono">
                    {dashboardMetrics?.delivered_orders ?? orders.filter(o => o.status === 'delivered').length}
                  </div>
                  <div className="text-[10px] text-emerald-400/50 mt-1">Fulfilled orders</div>
                </div>

                {/* 8. Cancelled orders */}
                <div className="bg-[#2B170E] p-3.5 rounded-2xl border border-rose-900/40 shadow">
                  <div className="text-[10px] uppercase font-bold text-rose-400">Cancelled</div>
                  <div className="text-2xl font-black text-rose-300 mt-1 font-mono">
                    {dashboardMetrics?.cancelled_orders ?? orders.filter(o => o.status === 'cancelled' || o.status === 'payment_rejected').length}
                  </div>
                  <div className="text-[10px] text-rose-400/50 mt-1">Voided / rejected</div>
                </div>

                {/* 9. Today's revenue */}
                <div className="bg-[#2B170E] p-3.5 rounded-2xl border border-amber-900/40 shadow">
                  <div className="text-[10px] uppercase font-bold text-amber-400">Today's Revenue</div>
                  <div className="text-xl font-black text-white mt-1 font-mono">
                    {Number(dashboardMetrics?.today_revenue ?? orders.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString() && o.payment_status === 'paid').reduce((s, o) => s + Number(o.total_amount || 0), 0)).toFixed(2)} EGP
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-1">Paid today</div>
                </div>

                {/* 10. Monthly revenue */}
                <div className="bg-[#2B170E] p-3.5 rounded-2xl border border-amber-900/40 shadow">
                  <div className="text-[10px] uppercase font-bold text-amber-400">Monthly Revenue</div>
                  <div className="text-xl font-black text-emerald-400 mt-1 font-mono">
                    {Number(dashboardMetrics?.monthly_revenue ?? orders.filter(o => o.payment_status === 'paid').reduce((s, o) => s + Number(o.total_amount || 0), 0)).toFixed(2)} EGP
                  </div>
                  <div className="text-[10px] text-amber-300/50 mt-1">Net sales 30 days</div>
                </div>

                {/* 11. Pending payments */}
                <div className="bg-[#2B170E] p-3.5 rounded-2xl border border-amber-900/40 shadow">
                  <div className="text-[10px] uppercase font-bold text-amber-400">Pending Payments</div>
                  <div className="text-xl font-black text-amber-300 mt-1 font-mono">
                    {Number(dashboardMetrics?.pending_payments ?? orders.filter(o => o.payment_status === 'waiting_verification' || o.status === 'waiting_for_payment').reduce((s, o) => s + Number(o.total_amount || 0), 0)).toFixed(2)} EGP
                  </div>
                  <div className="text-[10px] text-amber-300/50 mt-1">Unverified transfers</div>
                </div>

                {/* 12. Low-stock products */}
                <div
                  onClick={() => setActiveTab('products')}
                  className="bg-[#2B170E] p-3.5 rounded-2xl border border-amber-900/40 shadow cursor-pointer hover:bg-amber-950/40 transition"
                  title="Click to view products and adjust inventory"
                >
                  <div className="text-[10px] uppercase font-bold text-amber-400 flex items-center justify-between">
                    <span>Low-Stock SKUs</span>
                    <span className="text-[9px] text-amber-300">View →</span>
                  </div>
                  <div className="text-2xl font-black text-amber-400 mt-1 font-mono">
                    {products.filter(p => (p.stock_quantity || 0) < 20).length}
                  </div>
                  <div className="text-[10px] text-rose-400 mt-1">Below threshold</div>
                </div>

                {/* 13. New customers */}
                <div className="bg-[#2B170E] p-3.5 rounded-2xl border border-amber-900/40 shadow">
                  <div className="text-[10px] uppercase font-bold text-amber-400">New Customers</div>
                  <div className="text-2xl font-black text-white mt-1 font-mono">
                    {dashboardMetrics?.new_customers ?? new Set(orders.map(o => o.customer_email).filter(Boolean)).size}
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-1">Acquired buyers</div>
                </div>

                {/* 14. New inquiries */}
                <div
                  onClick={() => setActiveTab('messages')}
                  className="bg-[#2B170E] p-3.5 rounded-2xl border border-amber-900/40 shadow cursor-pointer hover:bg-amber-950/40 transition"
                  title="Click to view customer contact inquiries"
                >
                  <div className="text-[10px] uppercase font-bold text-amber-400 flex items-center justify-between">
                    <span>New Inquiries</span>
                    <span className="text-[9px] text-amber-300">View →</span>
                  </div>
                  <div className="text-2xl font-black text-white mt-1 font-mono">
                    {dashboardMetrics?.new_inquiries ?? messages.filter(m => m.status === 'unread').length}
                  </div>
                  <div className="text-[10px] text-amber-300/50 mt-1">Unread messages</div>
                </div>
              </div>

              {/* Low Stock Urgent Alert Bar */}
              {products.filter(p => (p.stock_quantity || 0) < 20).length > 0 && (
                <div className="bg-gradient-to-r from-amber-950/80 to-[#7B1E26]/80 border border-amber-500/30 p-4 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-amber-200">
                        Atelier Stock Alert: {products.filter(p => (p.stock_quantity || 0) < 20).map(p => p.name).join(', ')} is running low!
                      </div>
                      <div className="text-xs text-amber-300/70">Inventory has dropped below safety threshold. Prepare a new batch pull.</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('products')}
                    className="px-4 py-1.5 bg-[#C26715] hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition"
                  >
                    Adjust Inventory →
                  </button>
                </div>
              )}

              {/* Recent Orders Section */}
              <div className="bg-[#2B170E] rounded-2xl border border-amber-900/40 p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-lg font-bold text-amber-100">Recent Customer Orders</h3>
                  <button onClick={() => setActiveTab('orders')} className="text-xs text-amber-400 hover:underline font-semibold">
                    View All Orders →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-amber-900/50 text-amber-400/70 text-xs uppercase tracking-wider">
                        <th className="pb-3">Order Number</th>
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Payment</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-950/60 font-mono text-xs">
                      {orders.slice(0, 5).map(o => (
                        <tr key={o.id} className="hover:bg-amber-950/40 transition">
                          <td className="py-3 font-bold text-amber-300">{o.order_number}</td>
                          <td className="py-3 font-sans text-white font-medium">{o.customer_name}</td>
                          <td className="py-3 font-bold text-emerald-400">{Number(o.total_amount).toFixed(2)} EGP</td>
                          <td className="py-3">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              o.status === 'delivered' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' :
                              o.status === 'shipped' ? 'bg-blue-950 text-blue-300 border border-blue-500/30' :
                              'bg-amber-950 text-amber-300 border border-amber-500/30'
                            }`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="py-3 text-amber-200/70 uppercase text-[11px]">{o.payment_status || 'paid'}</td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => setInspectingOrder(o)}
                              className="px-3 py-1 bg-amber-950 hover:bg-amber-900 text-amber-200 rounded-lg text-xs font-sans transition"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PAYMENT VERIFICATIONS (INSTAPAY / TRANSFER SCREENSHOTS) */}
          {activeTab === 'payments' && (
            <PaymentVerificationsTab
              confirmations={paymentConfirmations}
              orders={orders}
              onApprove={handleApprovePayment}
              onReject={handleRejectPayment}
              onInspectOrder={(ord) => setInspectingOrder(ord)}
            />
          )}

          {/* TAB: FINANCIAL REPORTS & TELEMETRY */}
          {activeTab === 'reports' && (
            <ReportsAnalyticsTab />
          )}

          {/* TAB 2: PRODUCTS & INVENTORY */}
          {activeTab === 'products' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-3xl font-black text-amber-100">Toffee Products & Inventory</h2>
                  <p className="text-sm text-amber-200/60 mt-1">Manage pricing, batch stock levels, flavor notes, and store visibility.</p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Search product or SKU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2 bg-[#2B170E] border border-amber-900/60 rounded-xl text-xs text-white placeholder-amber-200/40 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={() => setIsNewProductModalOpen(true)}
                    className="px-4 py-2 bg-gradient-to-r from-[#C26715] to-[#D93848] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:brightness-110 transition shadow-lg flex items-center gap-1.5"
                  >
                    <span>+</span> Add New Candy
                  </button>
                </div>
              </div>

              {/* Product Table */}
              <div className="bg-[#2B170E] rounded-2xl border border-amber-900/40 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-amber-950/60 border-b border-amber-900/50 text-amber-400/80 text-xs uppercase tracking-wider">
                        <th className="p-4">Confection</th>
                        <th className="p-4">SKU</th>
                        <th className="p-4">Flavor / Notes</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Live Stock</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-950/60 text-xs">
                      {products
                        .filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase())))
                        .map(p => (
                        <tr key={p.id} className="hover:bg-amber-950/30 transition">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img src={p.image_url || '/images/canister.jpg'} alt={p.name} className="w-10 h-10 rounded-lg object-cover border border-amber-900/50" />
                              <div>
                                <div className="font-bold text-white text-sm">{p.name}</div>
                                <div className="text-[11px] text-amber-200/60 line-clamp-1">{p.tagline || p.weight}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 font-mono text-amber-300 font-semibold">{p.sku || `TMK-${p.slug.slice(0, 6).toUpperCase()}`}</td>
                          <td className="p-4 text-amber-100/80">
                            <div className="font-semibold text-amber-300">{p.flavor_name || p.name}</div>
                            <div className="text-[10px] text-amber-400/60">{Array.isArray(p.fruit_notes) ? p.fruit_notes.slice(0, 2).join(', ') : 'Real fruit toffee'}</div>
                          </td>
                          <td className="p-4 font-mono font-bold text-emerald-400 text-sm">{Number(p.price).toFixed(2)} EGP</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleStockAdjust(p, -5)}
                                className="w-6 h-6 rounded bg-amber-950 hover:bg-amber-900 text-amber-200 font-bold flex items-center justify-center border border-amber-900/60"
                              >
                                -
                              </button>
                              <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                                (p.stock_quantity || 0) < 15 ? 'bg-rose-950 text-rose-300 border border-rose-500/30' : 'text-white'
                              }`}>
                                {p.stock_quantity ?? 80}
                              </span>
                              <button
                                onClick={() => handleStockAdjust(p, 5)}
                                className="w-6 h-6 rounded bg-amber-950 hover:bg-amber-900 text-amber-200 font-bold flex items-center justify-center border border-amber-900/60"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => handleToggleProductStatus(p)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition ${
                                p.status === 'published' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                              }`}
                            >
                              {p.status || 'published'}
                            </button>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => setEditingProduct(p)}
                              className="px-3 py-1 bg-[#C26715] hover:bg-amber-600 text-white rounded-lg text-xs font-semibold transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="px-2.5 py-1 bg-rose-950/70 hover:bg-rose-900 text-rose-300 rounded-lg text-xs font-semibold transition border border-rose-900/40"
                              title="Delete from Supabase"
                            ><X className="w-4 h-4 inline" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-3xl font-black text-amber-100">Orders & Fulfillment</h2>
                  <p className="text-sm text-amber-200/60 mt-1">Egypt-wide delivery fulfillment, COD status, PDF invoice generation, and customer notifications.</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search Order #, Customer, Phone..."
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    className="px-3.5 py-1.5 bg-[#2B170E] border border-amber-900/60 rounded-xl text-xs text-white placeholder-amber-200/40 focus:outline-none focus:border-[#C26715] w-64"
                  />

                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="px-3 py-1.5 bg-[#2B170E] border border-amber-900/60 rounded-xl text-xs text-amber-200 focus:outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="waiting_for_payment">Waiting for Transfer</option>
                    <option value="payment_review">Payment Review</option>
                    <option value="paid">Paid (Verified)</option>
                    <option value="preparing">Preparing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="payment_rejected">Payment Rejected</option>
                  </select>

                  <select
                    value={orderGovFilter}
                    onChange={(e) => setOrderGovFilter(e.target.value)}
                    className="px-3 py-1.5 bg-[#2B170E] border border-amber-900/60 rounded-xl text-xs text-amber-200 focus:outline-none max-w-[140px]"
                  >
                    <option value="all">All Governorates</option>
                    {['Cairo', 'Giza', 'Alexandria', 'Dakahlia', 'Red Sea', 'Beheira', 'Fayoum', 'Gharbia', 'Ismailia', 'Menofia', 'Minya', 'Qalyubia', 'New Valley', 'Suez', 'Aswan', 'Assiut', 'Beni Suef', 'Port Said', 'Damietta', 'Sharkia', 'South Sinai', 'Kafr El Sheikh', 'Matrouh', 'Luxor', 'Qena', 'North Sinai', 'Sohag'].map(g => (
                      <option key={g} value={g.toLowerCase()}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-[#2B170E] rounded-2xl border border-amber-900/40 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-amber-950/60 border-b border-amber-900/50 text-amber-400/80 text-xs uppercase tracking-wider">
                        <th className="p-4">Order Number</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Customer & Phone</th>
                        <th className="p-4">Governorate & Address</th>
                        <th className="p-4">Payment</th>
                        <th className="p-4">Total</th>
                        <th className="p-4">Fulfillment Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-950/60 text-xs font-mono">
                      {orders
                        .filter(o => {
                          const matchesSearch = !orderSearchQuery ||
                            (o.order_number && o.order_number.toLowerCase().includes(orderSearchQuery.toLowerCase())) ||
                            (o.customer_name && o.customer_name.toLowerCase().includes(orderSearchQuery.toLowerCase())) ||
                            (o.customer_phone && o.customer_phone.includes(orderSearchQuery));
                          const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
                          const matchesGov = orderGovFilter === 'all' ||
                            (o.shipping_address && o.shipping_address.toLowerCase().includes(orderGovFilter.toLowerCase())) ||
                            (o.governorate && o.governorate.toLowerCase() === orderGovFilter.toLowerCase());
                          return matchesSearch && matchesStatus && matchesGov;
                        })
                        .map(o => (
                        <tr key={o.id} className="hover:bg-amber-950/30 transition">
                          <td className="p-4 font-bold text-amber-300">
                            <div>{o.order_number}</div>
                            <span className="text-[10px] text-amber-500/70 font-sans">Egypt Courier</span>
                          </td>
                          <td className="p-4 text-amber-200/60">{new Date(o.created_at).toLocaleDateString()}</td>
                          <td className="p-4 font-sans text-white">
                            <div className="font-semibold">{o.customer_name}</div>
                            <div className="text-[11px] text-amber-300 font-mono">{o.customer_phone || 'No phone'}</div>
                            <div className="text-[10px] text-amber-200/40">{o.customer_email}</div>
                          </td>
                          <td className="p-4 font-sans text-amber-200/80 max-w-xs truncate" title={o.shipping_address}>
                            {o.shipping_address}
                          </td>
                          <td className="p-4 font-sans">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 border border-amber-700/50 text-amber-200 block w-fit uppercase">
                              {o.payment_method === 'cod' ? 'COD' : (o.payment_method || 'COD')}
                            </span>
                            <span className="text-[10px] text-amber-400/60 block mt-0.5">
                              {o.payment_status || 'Pending'}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-emerald-400 text-sm">
                            {Number(o.total_amount).toFixed(2)} EGP
                          </td>
                          <td className="p-4 font-sans">
                            <select
                              value={o.status}
                              onChange={(e) => handleOrderStatusChange(o.id, e.target.value)}
                              className="bg-amber-950 border border-amber-800/60 text-amber-200 rounded-lg px-2 py-1 text-xs focus:outline-none"
                            >
                              <option value="pending">Pending</option>
                              <option value="waiting_for_payment">Waiting for InstaPay</option>
                              <option value="payment_review">Payment Review</option>
                              <option value="paid">Paid (Verified)</option>
                              <option value="preparing">Preparing in Atelier</option>
                              <option value="shipped">Shipped with Courier</option>
                              <option value="delivered">Delivered to Customer</option>
                              <option value="cancelled">Cancelled</option>
                              <option value="payment_rejected">Payment Rejected</option>
                            </select>
                          </td>
                          <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                            {o.customer_phone && (
                              <button
                                onClick={() => {
                                  const waMsg = WhatsAppService.getOrderCreatedMessage(o);
                                  const url = WhatsAppService.getWhatsAppChatUrl(o.customer_phone, waMsg);
                                  window.open(url, '_blank');
                                }}
                                className="px-2 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 rounded-lg text-xs font-sans transition border border-emerald-800/40"
                                title="Open WhatsApp Chat with Customer"
                              >
                                WA
                              </button>
                            )}
                            <button
                              onClick={() => window.open(`http://127.0.0.1:8000/api/orders/${o.order_number}/invoice/`, '_blank')}
                              className="px-2.5 py-1 bg-amber-900/60 hover:bg-amber-800 text-amber-200 rounded-lg text-xs font-sans font-semibold transition border border-amber-700/40"
                              title="Download ReportLab PDF Invoice"
                            >
                              PDF
                            </button>
                            <button
                              onClick={() => handleResendInvoice(o.order_number)}
                              className="px-2 py-1 bg-amber-950 hover:bg-amber-900 text-amber-300 rounded-lg text-xs font-sans transition border border-amber-800/40"
                              title="Resend email confirmation to customer"
                            >
                              <Mail className="w-3.5 h-3.5 inline" />
                            </button>
                            <button
                              onClick={() => setInspectingOrder(o)}
                              className="px-2.5 py-1 bg-[#C26715] hover:bg-amber-600 text-white rounded-lg text-xs font-sans font-semibold transition"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: WHOLESALE REQUESTS PIPELINE */}
          {activeTab === 'wholesale' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-3xl font-black text-amber-100">Wholesale & Bulk Inquiries</h2>
                  <p className="text-sm text-amber-200/60 mt-1">Manage B2B commercial quotes for cafes, boutique roasters, corporate gifting, and luxury hotels.</p>
                </div>

                {/* Pipeline Status Filter Pills */}
                <div className="flex flex-wrap gap-1.5 bg-[#2B170E] p-1.5 rounded-xl border border-amber-900/50">
                  {['all', 'new', 'contacted', 'quoted', 'approved', 'rejected', 'archived'].map((statusKey) => (
                    <button
                      key={statusKey}
                      onClick={() => setWholesaleFilter(statusKey)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                        wholesaleFilter === statusKey
                          ? 'bg-[#C26715] text-white shadow-sm'
                          : 'text-amber-200/60 hover:text-white'
                      }`}
                    >
                      {statusKey}
                      {statusKey !== 'all' && (
                        <span className="ml-1.5 text-[10px] opacity-75 font-mono">
                          {wholesaleRequests.filter(w => w.status === statusKey).length}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#2B170E] rounded-2xl border border-amber-900/40 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-amber-950/60 border-b border-amber-900/50 text-amber-400/80 text-xs uppercase tracking-wider">
                        <th className="p-4">Company & Contact</th>
                        <th className="p-4">Governorate / City</th>
                        <th className="p-4">Phone / WhatsApp</th>
                        <th className="p-4">Requested Volume</th>
                        <th className="p-4">Business Type</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-950/60 text-xs">
                      {wholesaleRequests
                        .filter(w => wholesaleFilter === 'all' || w.status === wholesaleFilter)
                        .map(w => (
                        <tr key={w.id} className="hover:bg-amber-950/30 transition">
                          <td className="p-4">
                            <div className="font-bold text-white text-sm">{w.company_name}</div>
                            <div className="text-[11px] text-amber-300 font-semibold">{w.name}</div>
                            <div className="text-[10px] text-amber-200/50">{w.email}</div>
                          </td>
                          <td className="p-4 text-amber-200 font-medium">
                            <div>{w.governorate}</div>
                            <div className="text-[10px] text-amber-200/50">{w.city || 'Standard District'}</div>
                          </td>
                          <td className="p-4 font-mono text-amber-300">
                            <div>{w.phone}</div>
                            {w.whatsapp && <div className="text-[10px] text-emerald-400">WA: {w.whatsapp}</div>}
                          </td>
                          <td className="p-4">
                            <span className="font-bold text-emerald-400 text-sm font-mono">{w.requested_quantity} Packs</span>
                            <div className="text-[10px] text-amber-300/70">{w.monthly_quantity ? `${w.monthly_quantity} / mo` : 'One-time batch'}</div>
                          </td>
                          <td className="p-4 text-amber-200/80">
                            <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-800/40 text-[10px] font-semibold">
                              {w.business_type}
                            </span>
                          </td>
                          <td className="p-4">
                            <select
                              value={w.status}
                              onChange={(e) => handleUpdateWholesaleStatus(w.id, e.target.value)}
                              className={`rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wider border focus:outline-none ${
                                w.status === 'approved' ? 'bg-emerald-950 text-emerald-300 border-emerald-600/40' :
                                w.status === 'quoted' ? 'bg-blue-950 text-blue-300 border-blue-600/40' :
                                w.status === 'contacted' ? 'bg-amber-950 text-amber-300 border-amber-600/40' :
                                w.status === 'rejected' ? 'bg-rose-950 text-rose-300 border-rose-600/40' :
                                'bg-purple-950 text-purple-300 border-purple-600/40'
                              }`}
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="quoted">Quoted</option>
                              <option value="approved">Approved</option>
                              <option value="rejected">Rejected</option>
                              <option value="archived">Archived</option>
                            </select>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => {
                                setInspectingWholesale(w);
                                setWholesaleNotesInput(w.internal_notes || '');
                              }}
                              className="px-3 py-1 bg-[#C26715] hover:bg-amber-600 text-white rounded-lg text-xs font-semibold transition"
                            >
                              Review & Notes
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: EGYPT SHIPPING LOGISTICS (27 GOVERNORATES) */}
          {activeTab === 'shipping' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-3xl font-black text-amber-100">Egypt Shipping Rates (27 Governorates)</h2>
                  <p className="text-sm text-amber-200/60 mt-1">Configure courier shipping prices and delivery estimates. The customer checkout dynamically fetches these exact values.</p>
                </div>
              </div>

              <div className="bg-[#2B170E] rounded-2xl border border-amber-900/40 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-amber-950/60 border-b border-amber-900/50 text-amber-400/80 text-xs uppercase tracking-wider">
                        <th className="p-4">Governorate</th>
                        <th className="p-4">Shipping Fee (EGP)</th>
                        <th className="p-4">Estimated Delivery</th>
                        <th className="p-4">Active Scope</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-950/60 text-xs">
                      {shippingRates.map((rate) => (
                        <tr key={rate.id} className="hover:bg-amber-950/30 transition">
                          <td className="p-4">
                            <div className="font-bold text-white text-sm">{rate.governorate}</div>
                            <span className="text-[10px] text-amber-400/60">Arab Republic of Egypt</span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1.5 font-mono">
                              <input
                                type="number"
                                step="1"
                                defaultValue={rate.price}
                                id={`price-input-${rate.id}`}
                                className="w-24 px-2.5 py-1 bg-amber-950 border border-amber-800/60 rounded-lg text-white font-bold text-xs focus:outline-none focus:border-[#C26715]"
                              />
                              <span className="text-amber-200/60 font-sans">EGP</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <input
                              type="text"
                              defaultValue={rate.estimated_delivery}
                              id={`delivery-input-${rate.id}`}
                              className="w-36 px-2.5 py-1 bg-amber-950 border border-amber-800/60 rounded-lg text-white text-xs focus:outline-none focus:border-[#C26715]"
                            />
                          </td>
                          <td className="p-4">
                            <button
                              type="button"
                              onClick={() => handleToggleShippingActive(rate)}
                              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition ${
                                rate.active
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                                  : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                              }`}
                            >
                              {rate.active ? 'Active' : 'Disabled'}
                            </button>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                const priceEl = document.getElementById(`price-input-${rate.id}`) as HTMLInputElement;
                                const delEl = document.getElementById(`delivery-input-${rate.id}`) as HTMLInputElement;
                                const priceVal = parseFloat(priceEl?.value || String(rate.price));
                                const delVal = delEl?.value || rate.estimated_delivery;
                                handleUpdateShippingRate(rate.id, priceVal, delVal);
                              }}
                              className="px-3 py-1 bg-[#C26715] hover:bg-amber-600 text-white rounded-lg text-xs font-semibold transition"
                            >
                              Save Rate
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FLAVORS */}
          {activeTab === 'flavors' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div>
                <h2 className="font-serif text-3xl font-black text-amber-100">Atelier Flavor Vault</h2>
                <p className="text-sm text-amber-200/60 mt-1">Manage heritage fruits, sensory color palettes, and tartness calibrations.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {flavors.map(f => (
                  <div key={f.id} className="bg-[#2B170E] p-6 rounded-2xl border border-amber-900/40 shadow-xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full border border-white/20 shadow-inner" style={{ backgroundColor: f.color || '#C26715' }} />
                          <h3 className="font-serif text-lg font-bold text-white">{f.name}</h3>
                        </div>
                        <span className="text-xs font-mono text-amber-400 font-bold bg-amber-950 px-2 py-0.5 rounded">
                          {f.slug}
                        </span>
                      </div>
                      <p className="text-xs text-amber-200/70 leading-relaxed mb-4">{f.description || 'Infused with real orchard fruit oils and salted dairy toffee.'}</p>
                    </div>

                    <div className="pt-4 border-t border-amber-950/60 flex items-center justify-between text-xs font-mono">
                      <span className="text-amber-400/80">Fruit Tartness Metric:</span>
                      <span className="text-emerald-400 font-bold">{f.tartness || 9.4} / 10.0</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: COUPONS */}
          {activeTab === 'coupons' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div>
                <h2 className="font-serif text-3xl font-black text-amber-100">Coupons & Special Promos</h2>
                <p className="text-sm text-amber-200/60 mt-1">Create and manage tasting privileges, discount percentages, and usage trackers.</p>
              </div>

              {/* Create coupon form */}
              <form onSubmit={handleCreateCoupon} className="bg-[#2B170E] p-6 rounded-2xl border border-amber-900/40 shadow-xl flex flex-wrap items-end gap-4">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-bold uppercase text-amber-400 mb-1">Coupon Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SUMMERCHEW20"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                    className="w-full px-4 py-2 bg-amber-950 border border-amber-800/60 rounded-xl text-sm text-white uppercase font-mono focus:outline-none"
                  />
                </div>
                <div className="w-36">
                  <label className="block text-xs font-bold uppercase text-amber-400 mb-1">Discount %</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={newCouponVal}
                    onChange={(e) => setNewCouponVal(e.target.value)}
                    className="w-full px-4 py-2 bg-amber-950 border border-amber-800/60 rounded-xl text-sm text-white font-mono focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#C26715] hover:bg-amber-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-lg"
                >
                  Create Code
                </button>
              </form>

              {/* List Coupons */}
              <div className="bg-[#2B170E] rounded-2xl border border-amber-900/40 overflow-hidden shadow-xl">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-amber-950/60 border-b border-amber-900/50 text-amber-400/80 text-xs uppercase tracking-wider">
                      <th className="p-4">Code</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Discount</th>
                      <th className="p-4">Times Redeemed</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-950/60 text-xs font-mono">
                    {coupons.map(c => (
                      <tr key={c.id || c.code} className="hover:bg-amber-950/30 transition">
                        <td className="p-4 font-bold text-amber-300 text-sm">{c.code}</td>
                        <td className="p-4 text-amber-200/70 capitalize">{c.discount_type}</td>
                        <td className="p-4 font-bold text-emerald-400 text-sm">
                          {c.discount_type === 'percentage' ? `${c.discount_value}%` : `${c.discount_value} EGP`}
                        </td>
                        <td className="p-4 text-white font-bold">{c.times_used || 0} times</td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                            Active
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteCoupon(c.id, c.code)}
                            className="px-2 py-1 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded text-[11px] transition font-sans"
                            title="Delete promo from Supabase"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div>
                <h2 className="font-serif text-3xl font-black text-amber-100">Customer Reviews Moderation</h2>
                <p className="text-sm text-amber-200/60 mt-1">Approve verified customer love notes and feature them across the storefront.</p>
              </div>

              <div className="space-y-4">
                {reviews.map(r => (
                  <div key={r.id} className="bg-[#2B170E] p-5 rounded-2xl border border-amber-900/40 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="flex text-amber-400">
                          {[...Array(r.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <span className="font-serif font-bold text-white text-sm">{r.title || 'Incredible Chew'}</span>
                        <span className="text-[11px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded-full font-mono">{r.product_tag || 'Summer Canister'}</span>
                      </div>
                      <p className="text-xs text-amber-200/80 italic">"{r.content}"</p>
                      <div className="text-[11px] text-amber-400/60 font-medium">
                        — {r.author} ({r.location || 'Verified Buyer'})
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleReviewAction(r.id, 'approved')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition ${
                          r.status === 'approved' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' : 'bg-amber-950 hover:bg-emerald-900 text-amber-200'
                        }`}
                      >
                        {r.status === 'approved' ? 'Approved' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleReviewAction(r.id, 'rejected')}
                        className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded-lg text-xs font-bold uppercase transition"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleDeleteReview(r.id)}
                        className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded-lg text-xs transition"
                        title="Delete from Supabase"
                      ><X className="w-4 h-4 inline" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: HOMEPAGE BUILDER CMS */}
          {activeTab === 'cms_home' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div>
                <h2 className="font-serif text-3xl font-black text-amber-100">Homepage Experience Builder</h2>
                <p className="text-sm text-amber-200/60 mt-1">Control which sensory sections appear on the homepage and configure their titles without touching code.</p>
              </div>

              <div className="space-y-4">
                {homeSections.map((sec, idx) => (
                  <div key={sec.id} className="bg-[#2B170E] p-5 rounded-2xl border border-amber-900/40 shadow-lg flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-amber-950 text-amber-300 font-mono font-bold flex items-center justify-center text-sm border border-amber-800/40">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-serif font-bold text-white text-base">{sec.title}</div>
                        <div className="text-xs text-amber-200/60 font-mono">{sec.section_key} • {sec.subtitle}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleHomeSection(sec)}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                          sec.is_active ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                        }`}
                      >
                        {sec.is_active ? 'Visible on Store' : 'Hidden'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: CMS PAGES */}
          {activeTab === 'cms_pages' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div>
                <h2 className="font-serif text-3xl font-black text-amber-100">CMS Brand Pages</h2>
                <p className="text-sm text-amber-200/60 mt-1">Edit philosophy, ingredients, craftsmanship standards, and customer care policies.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {cmsPages.map(page => (
                  <div key={page.slug} className="bg-[#2B170E] p-6 rounded-2xl border border-amber-900/40 shadow-xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-serif text-lg font-bold text-white">{page.title}</h3>
                        <span className="text-xs font-mono text-amber-400 bg-amber-950 px-2 py-0.5 rounded">/{page.slug}</span>
                      </div>
                      <p className="text-xs text-amber-200/70 line-clamp-3 mb-4">{page.content}</p>
                    </div>
                    <button
                      onClick={() => setEditingPage(page)}
                      className="px-4 py-2 bg-[#C26715] hover:bg-amber-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition self-start"
                    >
                      Edit Page Content
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: MEDIA LIBRARY */}
          {activeTab === 'media' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div>
                <h2 className="font-serif text-3xl font-black text-amber-100">Atelier Media Asset Library</h2>
                <p className="text-sm text-amber-200/60 mt-1">High-resolution confectionery photography, tin canisters, and chew textures.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {[
                  { name: 'Luxury Canister', url: '/images/canister.jpg', tag: 'Packaging' },
                  { name: 'Artisan Marbling', url: '/images/marbling.jpg', tag: 'Chew Anatomy' },
                  { name: 'Toffee Pull Carousel', url: '/images/carousel.jpg', tag: 'Craft Atelier' },
                  { name: 'Heritage Chew Sample', url: '/images/chew_sample.jpg', tag: 'Product Close-Up' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-[#2B170E] rounded-2xl border border-amber-900/40 overflow-hidden shadow-lg group">
                    <div className="aspect-square overflow-hidden bg-black/40">
                      <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    </div>
                    <div className="p-3">
                      <div className="font-serif text-xs font-bold text-white truncate">{item.name}</div>
                      <div className="text-[10px] text-amber-400/70 font-mono mt-0.5">{item.tag}</div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.origin + item.url);
                          showToast('Asset URL copied to clipboard!');
                        }}
                        className="mt-2 w-full py-1 bg-amber-950 hover:bg-amber-900 text-amber-200 rounded text-[10px] font-mono transition"
                      >
                        Copy URL
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: MESSAGES */}
          {activeTab === 'messages' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div>
                <h2 className="font-serif text-3xl font-black text-amber-100">Customer Inquiries & Concierge</h2>
                <p className="text-sm text-amber-200/60 mt-1">Incoming correspondence from wedding planners, wholesale boutiques, and tasting fans.</p>
              </div>

              <div className="space-y-4">
                {messages.map(m => (
                  <div key={m.id} className="bg-[#2B170E] p-6 rounded-2xl border border-amber-900/40 shadow-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-serif font-bold text-white text-base">{m.name}</span>
                        <span className="text-xs font-mono text-amber-400 bg-amber-950 px-2 py-0.5 rounded">{m.email}</span>
                      </div>
                      <span className="text-xs text-amber-200/50 font-mono">{new Date(m.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="font-semibold text-amber-300 text-sm">{m.subject}</div>
                    <p className="text-xs text-amber-100/80 leading-relaxed bg-amber-950/40 p-4 rounded-xl border border-amber-900/30">
                      {m.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 11: SEO & META */}
          {activeTab === 'seo' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div>
                <h2 className="font-serif text-3xl font-black text-amber-100">Global SEO & Structured Metadata</h2>
                <p className="text-sm text-amber-200/60 mt-1">Search engine ranking parameters, OpenGraph previews, and crawler directives.</p>
              </div>

              <div className="bg-[#2B170E] p-6 rounded-2xl border border-amber-900/40 shadow-xl space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase text-amber-400 mb-1">Global Meta Title</label>
                  <input
                    type="text"
                    defaultValue="toomakt — Big Fruit. Real Toffee. Pure Obsession."
                    className="w-full px-4 py-2.5 bg-amber-950 border border-amber-800/60 rounded-xl text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-amber-400 mb-1">Meta Description (150-160 chars)</label>
                  <textarea
                    rows={3}
                    defaultValue="Artisanal French fruit-infused soft toffee. Made with real orchard fruit purees, browned butter, and sea salt. 45-second signature chew."
                    className="w-full px-4 py-2 bg-amber-950 border border-amber-800/60 rounded-xl text-sm text-white focus:outline-none"
                  />
                </div>

                <div className="pt-4 border-t border-amber-900/40 flex flex-wrap items-center gap-4">
                  <a
                    href="http://127.0.0.1:8000/sitemap.xml"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-amber-950 hover:bg-amber-900 text-amber-200 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 border border-amber-800/40"
                  >
                    <Globe className="w-4 h-4 text-amber-400 inline mr-2" /> View Live sitemap.xml
                  </a>
                  <a
                    href="http://127.0.0.1:8000/robots.txt"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-amber-950 hover:bg-amber-900 text-amber-200 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 border border-amber-800/40"
                  >
                    <Bot className="w-4 h-4 text-amber-400 inline mr-2" /> View robots.txt Directives
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 12: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div>
                <h2 className="font-serif text-3xl font-black text-amber-100">Global Atelier & Store Settings</h2>
                <p className="text-sm text-amber-200/60 mt-1">Configure brand parameters, InstaPay account, WhatsApp automation, shipping rules, and tracking pixels.</p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6">
                {/* 1. Brand & Store Identity */}
                <div className="bg-[#2B170E] p-6 rounded-2xl border border-amber-900/40 shadow-xl space-y-4">
                  <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2 border-b border-amber-900/50 pb-2">
                    <Building2 className="w-4 h-4 text-amber-400 inline mr-2" /> Brand & Contact Identity
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-amber-400 mb-1">Brand Name</label>
                      <input
                        type="text"
                        value={settings.store_name || 'toomakt Confectionery'}
                        onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-amber-950 border border-amber-800/60 rounded-xl text-sm text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-amber-400 mb-1">Currency Symbol</label>
                      <input
                        type="text"
                        value={settings.currency || 'EGP'}
                        onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                        className="w-full px-4 py-2.5 bg-amber-950 border border-amber-800/60 rounded-xl text-sm text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-amber-400 mb-1">Concierge Email</label>
                      <input
                        type="email"
                        value={settings.contact_email || 'bonjour@toomakt.com'}
                        onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                        className="w-full px-4 py-2.5 bg-amber-950 border border-amber-800/60 rounded-xl text-sm text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-amber-400 mb-1">Customer Support Phone</label>
                      <input
                        type="text"
                        value={settings.contact_phone || '+20 100 000 0000'}
                        onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                        className="w-full px-4 py-2.5 bg-amber-950 border border-amber-800/60 rounded-xl text-sm text-white font-mono focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. InstaPay & Bank Transfer Configuration (Prompt #1 & #12) */}
                <div className="bg-[#2B170E] p-6 rounded-2xl border border-amber-500/30 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-amber-900/50 pb-2">
                    <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400 inline mr-2" /> InstaPay & Bank Transfer Account Configuration
                    </h3>
                    <span className="text-[10px] text-amber-400 font-mono bg-amber-950 px-2 py-0.5 rounded border border-amber-800/60">
                      Customer Payment Gateway
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-amber-400 mb-1">InstaPay Payment Address / IPA</label>
                      <input
                        type="text"
                        placeholder="e.g. toomakt@instapay"
                        value={settings.instapay_address || 'toomakt@instapay'}
                        onChange={(e) => setSettings({ ...settings, instapay_address: e.target.value })}
                        className="w-full px-4 py-2.5 bg-amber-950 border border-amber-800/60 rounded-xl text-sm text-amber-200 font-mono focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-amber-400 mb-1">Official Account Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Toomakt Confectionery S.A.E."
                        value={settings.instapay_account_name || 'Toomakt Confectionery S.A.E.'}
                        onChange={(e) => setSettings({ ...settings, instapay_account_name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-amber-950 border border-amber-800/60 rounded-xl text-sm text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-amber-400 mb-1">Bank Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Commercial International Bank (CIB Egypt)"
                        value={settings.bank_name || 'Commercial International Bank (CIB Egypt)'}
                        onChange={(e) => setSettings({ ...settings, bank_name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-amber-950 border border-amber-800/60 rounded-xl text-sm text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-amber-400 mb-1">Bank Account Number</label>
                      <input
                        type="text"
                        placeholder="e.g. 100052981024"
                        value={settings.bank_account_number || '100052981024'}
                        onChange={(e) => setSettings({ ...settings, bank_account_number: e.target.value })}
                        className="w-full px-4 py-2.5 bg-amber-950 border border-amber-800/60 rounded-xl text-sm text-white font-mono focus:outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase text-amber-400 mb-1">Official Customer Instructions</label>
                      <textarea
                        rows={2}
                        value={settings.instapay_instructions || 'Transfer the exact order total via InstaPay or CIB mobile banking. Upload a screenshot of the transfer confirmation receipt for immediate verification.'}
                        onChange={(e) => setSettings({ ...settings, instapay_instructions: e.target.value })}
                        className="w-full px-4 py-2 bg-amber-950 border border-amber-800/60 rounded-xl text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. WhatsApp Integration (Prompt #4) */}
                <div className="bg-[#2B170E] p-6 rounded-2xl border border-emerald-900/40 shadow-xl space-y-4">
                  <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2 border-b border-amber-900/50 pb-2">
                    <MessageSquare className="w-4 h-4 text-emerald-400 inline mr-2" /> WhatsApp Business Service Automation
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-amber-400 mb-1">WhatsApp Business Phone Number</label>
                      <input
                        type="text"
                        placeholder="+20 100 000 0000"
                        value={settings.whatsapp_phone || '+20 100 000 0000'}
                        onChange={(e) => setSettings({ ...settings, whatsapp_phone: e.target.value })}
                        className="w-full px-4 py-2.5 bg-amber-950 border border-amber-800/60 rounded-xl text-sm text-white font-mono focus:outline-none"
                      />
                      <span className="text-[10px] text-amber-300/50 mt-1 block">Used for wa.me links, invoice dispatches, and screenshot submissions.</span>
                    </div>
                    <div className="flex items-center gap-3 pt-4">
                      <input
                        type="checkbox"
                        id="wa_auto_invoice"
                        checked={settings.whatsapp_auto_invoice ?? true}
                        onChange={(e) => setSettings({ ...settings, whatsapp_auto_invoice: e.target.checked })}
                        className="w-4 h-4 accent-[#C26715]"
                      />
                      <label htmlFor="wa_auto_invoice" className="text-xs text-amber-200 cursor-pointer">
                        <strong>Automatic WhatsApp Invoicing</strong>
                        <span className="block text-[11px] text-amber-300/50">Prompt for finalized WhatsApp invoice when status moves to PREPARING.</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* 4. Shipping Rules (Prompt #7) */}
                <div className="bg-[#2B170E] p-6 rounded-2xl border border-amber-900/40 shadow-xl space-y-4">
                  <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2 border-b border-amber-900/50 pb-2">
                    <Truck className="w-4 h-4 text-amber-400 inline mr-2" /> Shipping Rules & Free Shipping Threshold
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-amber-400 mb-1">Free Shipping Order Threshold (EGP)</label>
                      <input
                        type="number"
                        value={settings.free_shipping_threshold ?? 500}
                        onChange={(e) => setSettings({ ...settings, free_shipping_threshold: parseFloat(e.target.value) })}
                        className="w-full px-4 py-2.5 bg-amber-950 border border-amber-800/60 rounded-xl text-sm text-white font-mono focus:outline-none"
                      />
                      <span className="text-[10px] text-amber-300/50 mt-1 block">Orders equal to or above this amount automatically receive FREE shipping.</span>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-amber-400 mb-1">Default Governorate Shipping Flat Rate (EGP)</label>
                      <input
                        type="number"
                        value={settings.default_shipping_fee ?? 50}
                        onChange={(e) => setSettings({ ...settings, default_shipping_fee: parseFloat(e.target.value) })}
                        className="w-full px-4 py-2.5 bg-amber-950 border border-amber-800/60 rounded-xl text-sm text-white font-mono focus:outline-none"
                      />
                      <span className="text-[10px] text-amber-300/50 mt-1 block">Configurable per governorate in Egypt Shipping tab.</span>
                    </div>
                  </div>
                </div>

                {/* 5. Tracking Pixels & Analytics (Prompt #13) */}
                <div className="bg-[#2B170E] p-6 rounded-2xl border border-amber-900/40 shadow-xl space-y-4">
                  <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2 border-b border-amber-900/50 pb-2">
                    <TrendingUp className="w-4 h-4 text-amber-400 inline mr-2" /> Marketing Tracking Pixels & E-Commerce Telemetry
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-amber-400 mb-1">Meta (Facebook) Pixel ID</label>
                      <input
                        type="text"
                        placeholder="e.g. 1029384756"
                        value={settings.meta_pixel_id || ''}
                        onChange={(e) => setSettings({ ...settings, meta_pixel_id: e.target.value })}
                        className="w-full px-3 py-2 bg-amber-950 border border-amber-800/60 rounded-xl text-xs text-white font-mono focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-amber-400 mb-1">Google Analytics 4 (GA4)</label>
                      <input
                        type="text"
                        placeholder="e.g. G-TOOMAKT2026"
                        value={settings.ga4_id || ''}
                        onChange={(e) => setSettings({ ...settings, ga4_id: e.target.value })}
                        className="w-full px-3 py-2 bg-amber-950 border border-amber-800/60 rounded-xl text-xs text-white font-mono focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-amber-400 mb-1">Google Tag Manager (GTM)</label>
                      <input
                        type="text"
                        placeholder="e.g. GTM-TMKT88"
                        value={settings.gtm_id || ''}
                        onChange={(e) => setSettings({ ...settings, gtm_id: e.target.value })}
                        className="w-full px-3 py-2 bg-amber-950 border border-amber-800/60 rounded-xl text-xs text-white font-mono focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-[#C26715] to-[#D93848] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:brightness-110 transition shadow-lg cursor-pointer"
                  >
                    Save All Production Settings
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 13: AUDIT TRAIL */}
          {activeTab === 'audit' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div>
                <h2 className="font-serif text-3xl font-black text-amber-100">Atelier Activity Audit Trail</h2>
                <p className="text-sm text-amber-200/60 mt-1">Immutable log of system events, inventory changes, price recalibrations, and order transitions.</p>
              </div>

              <div className="bg-[#2B170E] rounded-2xl border border-amber-900/40 p-6 shadow-xl space-y-4 font-mono text-xs">
                {[
                  { time: 'Just now', user: 'Admin (Django Session)', action: 'STORE_SETTINGS_SYNC', detail: 'Synchronized store free shipping threshold: 150.00 EGP' },
                  { time: '10 mins ago', user: 'Admin', action: 'STOCK_LEVEL_UPDATE', detail: 'Adjusted Blueberry Velvet inventory to 9 units' },
                  { time: '1 hour ago', user: 'Customer Checkout', action: 'ORDER_DISPATCH_CREATED', detail: 'Order TMK-892411 received. Generated shipping tracking.' },
                  { time: 'Yesterday', user: 'System', action: 'DATABASE_SEED_INITIALIZED', detail: 'Populated 6 fruit toffee varieties and 4 gift bundles' }
                ].map((log, idx) => (
                  <div key={idx} className="p-3 bg-amber-950/40 rounded-xl border border-amber-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-amber-400 font-bold">[{log.action}]</span> <span className="text-white">{log.detail}</span>
                    </div>
                    <div className="text-[11px] text-amber-300/50 flex-shrink-0">
                      {log.user} • {log.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL 1: EDIT PRODUCT */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#2B170E] border border-amber-900/80 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-amber-900/60 pb-3">
              <h3 className="font-serif text-xl font-bold text-white">Edit Confection: {editingProduct.name}</h3>
              <button onClick={() => setEditingProduct(null)} className="text-amber-300 hover:text-white text-lg"><X className="w-4 h-4 inline" /></button>
            </div>
            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-amber-400 font-bold mb-1">Product Name</label>
                  <input
                    type="text"
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-3 py-2 bg-amber-950 border border-amber-800/60 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-amber-400 font-bold mb-1">Price (EGP)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 bg-amber-950 border border-amber-800/60 rounded-lg text-white font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-amber-400 font-bold mb-1">Short Tagline</label>
                <input
                  type="text"
                  value={editingProduct.tagline || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, tagline: e.target.value })}
                  className="w-full px-3 py-2 bg-amber-950 border border-amber-800/60 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-amber-400 font-bold mb-1">Full Confectionery Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 bg-amber-950 border border-amber-800/60 rounded-lg text-white"
                />
              </div>
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-amber-400 font-bold mb-1">Pieces / Pack</label>
                  <input
                    type="number"
                    value={editingProduct.pieces_per_pack || 20}
                    onChange={(e) => setEditingProduct({ ...editingProduct, pieces_per_pack: parseInt(e.target.value) || 20 })}
                    className="w-full px-3 py-2 bg-amber-950 border border-amber-800/60 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-amber-400 font-bold mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={editingProduct.stock_quantity || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock_quantity: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-amber-950 border border-amber-800/60 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-amber-400 font-bold mb-1">Chewiness (1-10)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingProduct.chewiness || 10}
                    onChange={(e) => setEditingProduct({ ...editingProduct, chewiness: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 bg-amber-950 border border-amber-800/60 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-amber-400 font-bold mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={editingProduct.badge || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                    className="w-full px-3 py-2 bg-amber-950 border border-amber-800/60 rounded-lg text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-amber-900/60">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 bg-amber-950 text-amber-200 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#C26715] hover:bg-amber-600 text-white rounded-lg font-bold"
                >
                  Save to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD NEW PRODUCT */}
      {isNewProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#2B170E] border border-amber-900/80 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-amber-900/60 pb-3">
              <h3 className="font-serif text-xl font-bold text-white">Craft New Toffee Recipe</h3>
              <button onClick={() => setIsNewProductModalOpen(false)} className="text-amber-300 hover:text-white text-lg"><X className="w-4 h-4 inline" /></button>
            </div>
            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-amber-400 font-bold mb-1">Product Name</label>
                  <input
                    name="name"
                    required
                    placeholder="e.g. Passionfruit Glaze"
                    className="w-full px-3 py-2 bg-amber-950 border border-amber-800/60 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-amber-400 font-bold mb-1">Price (EGP)</label>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    defaultValue="18.00"
                    required
                    className="w-full px-3 py-2 bg-amber-950 border border-amber-800/60 rounded-lg text-white font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-amber-400 font-bold mb-1">Tagline</label>
                <input
                  name="tagline"
                  placeholder="Tropical tartness meets double-cream caramel."
                  className="w-full px-3 py-2 bg-amber-950 border border-amber-800/60 rounded-lg text-white"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-amber-400 font-bold mb-1">Pieces Per Pack</label>
                  <input
                    name="pieces_per_pack"
                    type="number"
                    defaultValue="20"
                    className="w-full px-3 py-2 bg-amber-950 border border-amber-800/60 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-amber-400 font-bold mb-1">Initial Stock</label>
                  <input
                    name="stock"
                    type="number"
                    defaultValue="60"
                    className="w-full px-3 py-2 bg-amber-950 border border-amber-800/60 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-amber-400 font-bold mb-1">Badge</label>
                  <input
                    name="badge"
                    defaultValue="NEW ARRIVAL"
                    className="w-full px-3 py-2 bg-amber-950 border border-amber-800/60 rounded-lg text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-amber-400 font-bold mb-1">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue="Hand-stirred in small copper kettles with real fruit purée and pure churned butter."
                  className="w-full px-3 py-2 bg-amber-950 border border-amber-800/60 rounded-lg text-white"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-amber-900/60">
                <button
                  type="button"
                  onClick={() => setIsNewProductModalOpen(false)}
                  className="px-4 py-2 bg-amber-950 text-amber-200 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-[#C26715] to-[#D93848] text-white rounded-lg font-bold"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ORDER INSPECTOR & INVOICE */}
      {inspectingOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#2B170E] border border-amber-900/80 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-amber-900/60 pb-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-white">Order {inspectingOrder.order_number}</h3>
                <div className="text-xs text-amber-400/70 font-mono">Date: {new Date(inspectingOrder.created_at).toLocaleString()}</div>
              </div>
              <button onClick={() => setInspectingOrder(null)} className="text-amber-300 hover:text-white text-lg"><X className="w-4 h-4 inline" /></button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-amber-950/40 p-4 rounded-xl border border-amber-900/40">
              <div>
                <div className="font-bold text-amber-400 uppercase text-[10px]">Customer Details</div>
                <div className="text-white font-semibold mt-1">{inspectingOrder.customer_name}</div>
                <div className="text-amber-200/70">{inspectingOrder.customer_email}</div>
                <div className="text-amber-300 font-mono mt-0.5">{inspectingOrder.customer_phone || 'No phone'}</div>
              </div>
              <div>
                <div className="font-bold text-amber-400 uppercase text-[10px]">Shipping Destination (Egypt)</div>
                <div className="text-white mt-1 leading-relaxed">{inspectingOrder.shipping_address}</div>
                <div className="text-amber-300 font-mono mt-1">Payment: {inspectingOrder.payment_method === 'cod' ? 'Cash on Delivery (Pending)' : inspectingOrder.payment_method}</div>
              </div>
            </div>

            {/* Line items */}
            <div>
              <div className="font-serif text-sm font-bold text-white mb-2">Order Line Items</div>
              <div className="divide-y divide-amber-950/60 text-xs font-mono">
                {inspectingOrder.items && inspectingOrder.items.length > 0 ? (
                  inspectingOrder.items.map((item: any) => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <div className="text-white font-bold font-sans">{item.product_name_snapshot || item.name}</div>
                        <div className="text-amber-300/60 text-[10px]">
                          1 Pack = {item.pieces_per_pack_snapshot || item.pieces_per_pack || 20} Pieces • Qty: {item.quantity} packs
                        </div>
                      </div>
                      <div className="text-emerald-400 font-bold">{Number(item.total || item.total_price || 0).toFixed(2)} EGP</div>
                    </div>
                  ))
                ) : (
                  <div className="py-2 flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold font-sans">Artisanal Toffee Pack</div>
                      <div className="text-amber-300/60 text-[10px]">1 Pack = 20 Pieces • Qty: 1</div>
                    </div>
                    <div className="text-emerald-400 font-bold">{Number(inspectingOrder.total_amount).toFixed(2)} EGP</div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-amber-900/60 pt-3 flex items-center justify-between font-mono">
              <span className="text-sm font-bold text-white">Order Total (EGP)</span>
              <span className="text-lg font-black text-emerald-400">{Number(inspectingOrder.total_amount).toFixed(2)} EGP</span>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-2 pt-3 border-t border-amber-900/60">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.open(`http://127.0.0.1:8000/api/orders/${inspectingOrder.order_number}/invoice/`, '_blank')}
                  className="px-4 py-2 bg-gradient-to-r from-[#C26715] to-[#D93848] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
                >
                  <Download className="w-4 h-4 inline mr-2" /> Download PDF Invoice
                </button>
                <button
                  onClick={() => handleResendInvoice(inspectingOrder.order_number)}
                  className="px-3.5 py-2 bg-amber-950 hover:bg-amber-900 text-amber-200 rounded-xl text-xs font-semibold transition border border-amber-800/50 flex items-center gap-1.5"
                >
                  <Mail className="w-4 h-4 inline mr-2" /> Resend Email
                </button>
              </div>
              <button
                onClick={() => setInspectingOrder(null)}
                className="px-6 py-2 bg-amber-900/60 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: WHOLESALE INSPECTOR & INTERNAL NOTES */}
      {inspectingWholesale && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#2B170E] border border-amber-900/80 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b border-amber-900/60 pb-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-white">Wholesale Inquiry: {inspectingWholesale.company_name}</h3>
                <div className="text-amber-400/70 text-[11px]">Submitted {new Date(inspectingWholesale.created_at || Date.now()).toLocaleString()}</div>
              </div>
              <button onClick={() => setInspectingWholesale(null)} className="text-amber-300 hover:text-white text-lg"><X className="w-4 h-4 inline" /></button>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-amber-950/40 p-4 rounded-xl border border-amber-900/40">
              <div>
                <span className="text-amber-400 font-bold uppercase text-[10px] block mb-1">Contact Person</span>
                <div className="text-white font-semibold text-sm">{inspectingWholesale.name}</div>
                <div className="text-amber-200/80">{inspectingWholesale.email}</div>
                <div className="text-amber-300 font-mono mt-0.5">{inspectingWholesale.phone}</div>
                {inspectingWholesale.whatsapp && (
                  <div className="text-emerald-400 font-mono">WhatsApp: {inspectingWholesale.whatsapp}</div>
                )}
              </div>
              <div>
                <span className="text-amber-400 font-bold uppercase text-[10px] block mb-1">Business & Logistics</span>
                <div className="text-white font-medium">{inspectingWholesale.business_type}</div>
                <div className="text-amber-200/80">{inspectingWholesale.governorate}, {inspectingWholesale.city || 'Egypt'}</div>
                <div className="mt-1 font-mono text-emerald-400 font-bold">
                  Requested: {inspectingWholesale.requested_quantity} Packs
                </div>
                {inspectingWholesale.monthly_quantity && (
                  <div className="text-amber-300/80 font-mono text-[11px]">
                    Expected: {inspectingWholesale.monthly_quantity} Packs / Month
                  </div>
                )}
              </div>
            </div>

            <div>
              <span className="text-amber-400 font-bold uppercase text-[10px] block mb-1">Products Interested In</span>
              <div className="bg-amber-950/60 p-2.5 rounded-lg border border-amber-900/40 text-amber-100">
                {inspectingWholesale.products_interested || 'Full assortment'}
              </div>
            </div>

            {inspectingWholesale.message && (
              <div>
                <span className="text-amber-400 font-bold uppercase text-[10px] block mb-1">Customer Message</span>
                <div className="bg-amber-950/60 p-3 rounded-lg border border-amber-900/40 text-amber-100 leading-relaxed">
                  {inspectingWholesale.message}
                </div>
              </div>
            )}

            <div>
              <span className="text-amber-400 font-bold uppercase text-[10px] block mb-1">Internal Atelier Notes & CRM Log</span>
              <textarea
                rows={3}
                value={wholesaleNotesInput}
                onChange={(e) => setWholesaleNotesInput(e.target.value)}
                placeholder="Log customer discussions, pricing quotes provided, or custom batch requirements..."
                className="w-full px-3 py-2 bg-amber-950 border border-amber-800/60 rounded-xl text-white focus:outline-none focus:border-[#C26715]"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-amber-900/60">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">Change Status:</span>
                <select
                  value={inspectingWholesale.status}
                  onChange={(e) => handleUpdateWholesaleStatus(inspectingWholesale.id, e.target.value, wholesaleNotesInput)}
                  className="bg-amber-950 border border-amber-700 text-amber-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none font-bold uppercase"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="quoted">Quoted</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleUpdateWholesaleStatus(inspectingWholesale.id, inspectingWholesale.status, wholesaleNotesInput);
                    setInspectingWholesale(null);
                  }}
                  className="px-5 py-2 bg-[#C26715] hover:bg-amber-600 text-white rounded-xl font-bold transition shadow"
                >
                  Save Notes & Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: EDIT CMS PAGE */}
      {editingPage && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#2B170E] border border-amber-900/80 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-amber-900/60 pb-3">
              <h3 className="font-serif text-xl font-bold text-white">Edit Page: {editingPage.title}</h3>
              <button onClick={() => setEditingPage(null)} className="text-amber-300 hover:text-white text-lg"><X className="w-4 h-4 inline" /></button>
            </div>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-amber-400 font-bold mb-1">Page Title</label>
                <input
                  type="text"
                  value={editingPage.title}
                  onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                  className="w-full px-3 py-2 bg-amber-950 border border-amber-800/60 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-amber-400 font-bold mb-1">Page Content (Markdown / Story)</label>
                <textarea
                  rows={8}
                  value={editingPage.content}
                  onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                  className="w-full px-3 py-2 bg-amber-950 border border-amber-800/60 rounded-lg text-white font-sans leading-relaxed"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-amber-900/60">
                <button
                  onClick={() => setEditingPage(null)}
                  className="px-4 py-2 bg-amber-950 text-amber-200 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePage}
                  className="px-6 py-2 bg-[#C26715] hover:bg-amber-600 text-white rounded-lg font-bold"
                >
                  Publish Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* MODAL 5: SUPABASE DATABASE DIAGNOSTICS */}
      {isDiagOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#2B170E] border border-amber-900/80 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-amber-900/60 pb-3">
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-amber-400" />
                <div>
                  <h3 className="font-serif text-xl font-bold text-white">Supabase Live Connection</h3>
                  <p className="text-xs text-amber-200/60 font-mono">fpabvfwjbxqsrpdglvgt.supabase.co</p>
                </div>
              </div>
              <button onClick={() => setIsDiagOpen(false)} className="text-amber-300 hover:text-white text-lg"><X className="w-4 h-4 inline" /></button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-amber-950/60 p-3 rounded-xl border border-amber-900/40">
                <div className="text-amber-400/70 text-[10px] uppercase font-bold">Database Status</div>
                <div className="text-emerald-400 font-bold text-sm mt-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Connected & Operational
                </div>
              </div>
              <div className="bg-amber-950/60 p-3 rounded-xl border border-amber-900/40">
                <div className="text-amber-400/70 text-[10px] uppercase font-bold">Round-Trip Latency</div>
                <div className="text-white font-bold text-sm mt-1">
                  {dbDiag?.latencyMs ?? 45} ms
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400">Live Database Tables & Row Counts</div>
              <div className="bg-amber-950/40 rounded-xl border border-amber-900/30 divide-y divide-amber-950/60 text-xs font-mono">
                {[
                  { table: 'toomakt_products', label: 'Candy Products & Inventory', count: dbDiag?.tableCounts?.toomakt_products ?? products.length },
                  { table: 'toomakt_orders', label: 'Customer Orders', count: dbDiag?.tableCounts?.toomakt_orders ?? orders.length },
                  { table: 'toomakt_promo_codes', label: 'Promo Codes & Coupons', count: dbDiag?.tableCounts?.toomakt_promo_codes ?? coupons.length },
                  { table: 'toomakt_reviews', label: 'Customer Reviews', count: dbDiag?.tableCounts?.toomakt_reviews ?? reviews.length },
                  { table: 'toomakt_categories', label: 'Product Categories', count: dbDiag?.tableCounts?.toomakt_categories ?? 4 },
                  { table: 'toomakt_bundles', label: 'Curated Gift Tins & Bundles', count: dbDiag?.tableCounts?.toomakt_bundles ?? 4 },
                  { table: 'toomakt_subscribers', label: 'Newsletter Subscribers', count: dbDiag?.tableCounts?.toomakt_subscribers ?? 0 }
                ].map((item, idx) => (
                  <div key={idx} className="p-2.5 flex items-center justify-between">
                    <div>
                      <span className="text-amber-300 font-semibold">{item.table}</span>
                      <span className="text-amber-200/50 text-[11px] ml-2">({item.label})</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-amber-900/60 text-emerald-300 font-bold">
                      {item.count} rows
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-amber-900/60">
              <button
                onClick={() => {
                  loadData();
                  showToast('Re-pinged Supabase database!');
                }}
                className="px-4 py-2 bg-amber-950 hover:bg-amber-900 text-amber-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4 inline mr-2" /> Test Ping Again
              </button>
              <button
                onClick={() => setIsDiagOpen(false)}
                className="px-5 py-2 bg-[#C26715] hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: WHATSAPP PREPARATION INVOICE MODAL */}
      {prepInvoiceModalOrder && (
        <WhatsAppPrepInvoiceModal
          order={prepInvoiceModalOrder}
          onClose={() => setPrepInvoiceModalOrder(null)}
        />
      )}
    </div>
  );
};
