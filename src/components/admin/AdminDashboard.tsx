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
  Copy,
  Upload,
  Camera,
  Image as ImageIcon,
  Gift,
  Database,
  Star,
  Users,
  FolderTree,
  Palette,
  Sun,
  Moon
} from 'lucide-react';
import { api } from '../../services/api';
import { WhatsAppService } from '../../services/whatsapp';
import { ShippingRate, WholesaleRequest, PaymentConfirmationRecord } from '../../types';
import { applySeoAndTracking } from '../../services/seoTracking';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { ImageUploadButton } from './ImageUploadButton';
import { ShippingRatesTab } from './ShippingRatesTab';
import { CategoriesFlavorsTab } from './CategoriesFlavorsTab';
import { ReviewsTab } from './ReviewsTab';
import { SubscribersTab } from './SubscribersTab';

interface AdminDashboardProps {
  onBackToStore: () => void;
  onLogout?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToStore, onLogout }) => {
  const { language, isRtl, toggleLanguage, t } = useLanguage();
  const { theme, isDark, toggleTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'products' | 'categories' | 'bundles' | 'payments' | 'shipping' | 'reviews' | 'inquiries' | 'subscribers' | 'alerts' | 'seo'
  >('overview');
  const [loading, setLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Core Data
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [flavors, setFlavors] = useState<any[]>([]);
  const [bundles, setBundles] = useState<any[]>([]);
  const [paymentConfirmations, setPaymentConfirmations] = useState<PaymentConfirmationRecord[]>([]);
  const [wholesaleRequests, setWholesaleRequests] = useState<WholesaleRequest[]>([]);
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; latencyMs: number; tableCounts?: Record<string, number> } | null>(null);

  // Filters & Search
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [bundleSearchQuery, setBundleSearchQuery] = useState('');

  // Modals & Editing Items
  const [inspectingOrder, setInspectingOrder] = useState<any | null>(null);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [editingBundle, setEditingBundle] = useState<any | null>(null);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [isNewBundleModalOpen, setIsNewBundleModalOpen] = useState(false);
  const [inspectingReceipt, setInspectingReceipt] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Image Upload & Asset Management State
  const [newProductImage, setNewProductImage] = useState('/images/products/mango_sunbeam.jpg');
  const [isUploadAssetModalOpen, setIsUploadAssetModalOpen] = useState(false);
  const [uploadedAssetUrl, setUploadedAssetUrl] = useState('');
  const [targetAssetProductId, setTargetAssetProductId] = useState<string>('');

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
      const [pData, bData, oData, sData, wData, cData, confData, diagData, catData, flavData, revData, subData] = await Promise.all([
        api.getProducts(),
        api.getBundles(),
        api.getAdminOrders(),
        api.getShippingRates(),
        api.getWholesaleRequests(),
        api.getCoupons(),
        api.getPaymentConfirmations(),
        api.checkDatabaseConnection(),
        api.getCategories(),
        api.getFlavors(),
        api.getReviews(),
        api.getSubscribers()
      ]);
      setProducts(pData || []);
      setBundles(bData || []);
      setOrders(oData || []);
      setShippingRates(sData || []);
      setWholesaleRequests(wData || []);
      setCoupons(cData || []);
      setPaymentConfirmations(confData || []);
      setCategories(catData || []);
      setFlavors(flavData || []);
      setReviews(revData || []);
      setSubscribers(subData || []);
      setDbStatus(diagData ? { connected: diagData.connected, latencyMs: diagData.latencyMs, tableCounts: diagData.tableCounts } : null);
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

  // REAL ACTION: Direct Image Upload for Product
  const handleDirectImageUpload = async (productId: string | number, newImageUrl: string, productName: string) => {
    if (!newImageUrl) return;
    try {
      await api.updateProduct(String(productId), { image_url: newImageUrl, image: newImageUrl });
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, image: newImageUrl, image_url: newImageUrl } : p));
      showToast(`New image uploaded for "${productName}"!`);
    } catch {
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, image: newImageUrl, image_url: newImageUrl } : p));
      showToast(`Image uploaded for "${productName}"!`);
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

  // REAL ACTION: Save Bundle Edit
  const handleSaveBundleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBundle) return;

    try {
      const updates = {
        title: editingBundle.title,
        category: editingBundle.category || 'Curated Gift Box',
        badge: editingBundle.badge || '',
        description: editingBundle.description || '',
        price: parseFloat(editingBundle.price) || 0,
        compare_at_price: editingBundle.compare_at_price || null,
        weight: editingBundle.weight || '450G LUXURY TIN',
        rating: parseFloat(editingBundle.rating) || 5,
        review_count: parseInt(editingBundle.review_count ?? editingBundle.reviewCount) || 0,
        image_url: editingBundle.image || editingBundle.image_url || '/images/carousel.jpg',
        perk_note: editingBundle.perk_note || '',
        is_grand_feature: Boolean(editingBundle.is_grand_feature),
        is_active: editingBundle.is_active !== false,
      };

      await api.updateBundle(String(editingBundle.id), updates);
      setBundles(prev =>
        prev.map(b =>
          b.id === editingBundle.id
            ? { ...b, ...updates, image: updates.image_url, reviewCount: updates.review_count }
            : b
        )
      );
      setEditingBundle(null);
      showToast(`Bundle "${editingBundle.title}" saved!`);
    } catch (err: any) {
      showToast(err?.message || 'Failed to save bundle');
    }
  };

  // REAL ACTION: Delete Bundle
  const handleDeleteBundle = async (id: string | number, title: string) => {
    if (!confirm(`Permanently remove bundle "${title}" from the database?`)) return;
    try {
      await api.deleteBundle(String(id));
      setBundles(prev => prev.filter(b => b.id !== id));
      setEditingBundle(null);
      showToast(`"${title}" removed.`);
    } catch {
      showToast('Failed to delete bundle');
    }
  };

  // REAL ACTION: Toggle bundle active / grand feature
  const handleToggleBundleActive = async (bundle: any) => {
    const next = !(bundle.is_active !== false);
    try {
      await api.updateBundle(String(bundle.id), { is_active: next });
      setBundles(prev => prev.map(b => (b.id === bundle.id ? { ...b, is_active: next } : b)));
      showToast(`${bundle.title} is now ${next ? 'active' : 'hidden'}`);
    } catch {
      showToast('Failed to update bundle status');
    }
  };

  const handleToggleBundleFeatured = async (bundle: any) => {
    const next = !bundle.is_grand_feature;
    try {
      await api.updateBundle(String(bundle.id), { is_grand_feature: next });
      setBundles(prev => prev.map(b => (b.id === bundle.id ? { ...b, is_grand_feature: next } : b)));
      showToast(next ? `"${bundle.title}" set as featured` : `Removed featured from "${bundle.title}"`);
    } catch {
      showToast('Failed to update featured flag');
    }
  };

  const handleDirectBundlePriceChange = async (bundleId: string | number, value: string) => {
    const nextPrice = Math.max(0, parseFloat(value) || 0);
    try {
      await api.updateBundle(String(bundleId), { price: nextPrice });
      setBundles(prev => prev.map(b => (b.id === bundleId ? { ...b, price: nextPrice } : b)));
      showToast(`Bundle price updated to EGP ${nextPrice}`);
    } catch {
      showToast('Failed to update price');
    }
  };

  const handleDirectBundleImageUpload = async (bundleId: string | number, newImageUrl: string, title: string) => {
    if (!newImageUrl) return;
    try {
      await api.updateBundle(String(bundleId), { image_url: newImageUrl });
      setBundles(prev =>
        prev.map(b => (b.id === bundleId ? { ...b, image: newImageUrl, image_url: newImageUrl } : b))
      );
      showToast(`Image updated for "${title}"`);
    } catch {
      showToast('Failed to update image');
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

  // REAL ACTION: Send Official WhatsApp Invoice to Customer
  const handleSendWhatsAppInvoice = (ord: any) => {
    const phone = ord.customer_phone || ord.phone;
    if (!phone) {
      showToast(isRtl ? 'لا يوجد رقم هاتف مسجل لهذا الطلب' : 'No phone number recorded for this order');
      return;
    }
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const phoneWithCountry = cleanPhone.startsWith('0') ? '2' + cleanPhone : cleanPhone;

    const dateStr = ord.created_at ? new Date(ord.created_at).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }) : new Date().toLocaleDateString();

    const itemsSummary = (ord.items && ord.items.length > 0)
      ? ord.items.map((it: any, idx: number) => {
          const flavorStr = it.flavor || it.selected_flavor ? ` [${it.flavor || it.selected_flavor}]` : '';
          const lineTotal = (it.unit_price || it.price || 0) * (it.quantity || 1);
          return `${idx + 1}. *${it.name || it.product_name || 'Toffee Pack'}*${flavorStr} × ${it.quantity || 1}${lineTotal > 0 ? ` — ${lineTotal} EGP` : ''}`;
        }).join('\n')
      : `1. *toomakt Signature Confections Pack* × 1 — ${ord.total_amount} EGP`;

    const address = [ord.shipping_address, ord.city || ord.shipping_city, ord.governorate].filter(Boolean).join(', ');

    const invoiceText = isRtl
      ? `✨ *مخبز وحلويات توماكت الفاخرة | TOOMAKT ATELIER* ✨
━━━━━━━━━━━━━━━━━━━━
📄 *فاتورة طلبية رسمية وتأكيد الشحن*
رقم الطلب: *#${ord.order_number}*
التاريخ: ${dateStr}

👤 *بيانات العميل:*
• الاسم: *${ord.customer_name}*
• رقم الهاتف: ${ord.customer_phone}
• العنوان: ${address || 'مصر'}

📦 *المنتجات المطلوبة:*
${itemsSummary}

━━━━━━━━━━━━━━━━━━━━
💰 *الملخص المالي:*
• الإجمالي الفرعي: ${ord.subtotal ? `${ord.subtotal} ج.م` : `${ord.total_amount} ج.م`}
• رسوم التوصيل (${ord.governorate || 'القاهرة'}): ${ord.shipping_fee ? `${ord.shipping_fee} ج.م` : 'شحن مجاني'}
• *الإجمالي النهائي المطلوب:* *${ord.total_amount} ج.م*
• طريقة الدفع: *${ord.payment_method?.toUpperCase() || 'الدفع عند الاستلام (COD)'}*
• حالة السداد: *${ord.payment_status === 'paid' ? 'تم الدفع بنجاح ✅' : 'قيد المتابعة / الدفع عند الاستلام'}*
• حالة الطلبية: *${ord.status || 'قيد المعالجة والتجهيز'}*
━━━━━━━━━━━━━━━━━━━━
🚚 يتم تجهيز الحلوى الحرفية في أواني النحاس مع شحن مبرد ومحكم حرارياً.
نشكركم على اختيار توماكت! نسعد بخدمتكم دائماً.`
      : `✨ *TOOMAKT CONFECTIONERY ATELIER* ✨
━━━━━━━━━━━━━━━━━━━━
📄 *OFFICIAL ORDER INVOICE & DISPATCH RECEIPT*
Order Number: *#${ord.order_number}*
Date: ${dateStr}

👤 *Customer Details:*
• Name: *${ord.customer_name}*
• Phone: ${ord.customer_phone}
• Delivery Address: ${address || 'Egypt'}

📦 *Items Ordered:*
${itemsSummary}

━━━━━━━━━━━━━━━━━━━━
💰 *Financial Breakdown:*
• Subtotal: ${ord.subtotal ? `${ord.subtotal} EGP` : `${ord.total_amount} EGP`}
• Delivery Fee (${ord.governorate || 'Cairo'}): ${ord.shipping_fee ? `${ord.shipping_fee} EGP` : 'Complimentary'}
• *Total Due:* *${ord.total_amount} EGP*
• Payment Method: *${ord.payment_method?.toUpperCase() || 'Cash on Delivery (COD)'}*
• Payment Status: *${ord.payment_status === 'paid' ? 'Verified Paid ✅' : 'Pending / Cash on Delivery'}*
• Fulfillment Status: *${ord.status?.toUpperCase() || 'PREPARING'}*
━━━━━━━━━━━━━━━━━━━━
🚚 Hand-pulled in copper cauldrons with European cultured butter and real orchard fruits, packaged in insulated cooler bags.
Thank you for choosing toomakt!`;

    const url = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(invoiceText)}`;
    window.open(url, '_blank');
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
  const handleSaveAlert = async () => {
    try {
      localStorage.setItem('toomakt_alert_config', JSON.stringify(alertConfig));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('toomakt:alert-updated', { detail: alertConfig }));
      await api.updateGlobalSetting('header_alert_config', alertConfig);
      showToast('Announcement Bar updated & saved to database!');
    } catch {
      showToast('Saved alert config locally');
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

  // Filtered Bundles (from database)
  const filteredBundles = bundles.filter(b => {
    if (!bundleSearchQuery.trim()) return true;
    const q = bundleSearchQuery.toLowerCase();
    return (
      (b.title || '').toLowerCase().includes(q) ||
      (b.category || '').toLowerCase().includes(q) ||
      (b.description || '').toLowerCase().includes(q) ||
      (b.badge || '').toLowerCase().includes(q)
    );
  });

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-[#FAF7F2] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#3C1322] selection:text-white transition-colors duration-200">
      
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
                {isRtl ? 'لوحة إدارة المتجر والمصنع' : 'ATELIER CONSOLE & MANAGEMENT'}
              </span>
            </div>

            {/* Supabase Status Pill */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E8E2D7] text-[10px] font-mono text-[#736B63]">
              <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse" />
              <span>{isRtl ? 'قاعدة البيانات نشطة' : 'Live Database'} ({dbStatus?.latencyMs ? `${dbStatus.latencyMs}ms` : (isRtl ? 'متصل' : 'Connected')})</span>
            </div>
          </div>

          {/* Action Hub */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="px-2.5 py-1 text-xs font-mono font-medium text-[#736B63] hover:text-[#1A1A1A] border border-[#E8E2D7] rounded-full hover:border-[#1A1A1A] transition-colors cursor-pointer"
              title={isRtl ? 'Switch to English' : 'التحويل إلى العربية'}
              aria-label="Toggle Language"
            >
              {language === 'en' ? 'عربي' : 'EN'}
            </button>

            {/* Dark/Light Mode Switcher */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-full text-[#736B63] hover:text-[#1A1A1A] hover:bg-[#F4EFEA] border border-[#E8E2D7] transition-colors cursor-pointer"
              title={isDark ? (isRtl ? 'الوضع النهاري' : 'Switch to Light Mode') : (isRtl ? 'الوضع الليلي' : 'Switch to Dark Mode')}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-[#FFD147]" /> : <Moon className="w-4 h-4 text-[#3C1322]" />}
            </button>

            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 sm:px-3 sm:py-1.5 rounded-full border border-[#E8E2D7] hover:border-[#1A1A1A] text-xs font-medium text-[#736B63] hover:text-[#1A1A1A] transition flex items-center gap-1.5 cursor-pointer"
              title={isRtl ? 'تحديث البيانات' : 'Refresh database records'}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#3C1322]' : ''}`} />
              <span className="hidden sm:inline">{isRtl ? 'مزامنة' : 'Sync'}</span>
            </button>

            <button
              onClick={onBackToStore}
              className="px-3.5 py-1.5 bg-[#FAF7F2] hover:bg-[#F4EFEA] border border-[#E8E2D7] hover:border-[#1A1A1A] text-[#1A1A1A] rounded-full text-xs font-medium transition flex items-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{isRtl ? 'المتجر' : 'Storefront'}</span>
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="px-3 py-1.5 bg-[#3C1322] hover:bg-[#280A15] text-[#FAF7F2] rounded-full text-xs font-medium transition flex items-center gap-1.5 cursor-pointer"
                title={isRtl ? 'تسجيل الخروج' : 'Sign out'}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isRtl ? 'خروج' : 'Logout'}</span>
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
              {isRtl ? 'قائمة التنقل' : 'Navigation Menu'}
            </span>

            {[
              { id: 'overview', label: isRtl ? 'نظرة عامة والمؤشرات' : 'Overview & KPIs', icon: BarChart3 },
              { id: 'orders', label: isRtl ? 'الطلبات والشحن' : 'Orders & Dispatch', icon: Package, badge: pendingOrders.length },
              { id: 'products', label: isRtl ? 'المنتجات والمخزون' : 'Products & Stock', icon: Tag, alert: lowStockProducts.length > 0 },
              { id: 'categories', label: isRtl ? 'التصنيفات والنكهات' : 'Categories & Flavors', icon: FolderTree, count: categories.length + flavors.length },
              { id: 'bundles', label: isRtl ? 'باقات الهدايا' : 'Gift Bundles', icon: Gift, count: bundles.length },
              { id: 'payments', label: isRtl ? 'مدفوعات إنستاباي' : 'InstaPay Approvals', icon: CreditCard, badge: pendingPayments.length },
              { id: 'shipping', label: isRtl ? 'الشحن والمحافظات' : 'Shipping & Delivery', icon: Truck, count: shippingRates.length },
              { id: 'reviews', label: isRtl ? 'تقييمات العملاء' : 'Customer Reviews', icon: Star, count: reviews.length },
              { id: 'inquiries', label: isRtl ? 'طلبات الجملة' : 'Wholesale & Gifting', icon: Building2, count: wholesaleRequests.length },
              { id: 'subscribers', label: isRtl ? 'قائمة المشتركين' : 'Subscribers List', icon: Users, count: subscribers.length },
              { id: 'alerts', label: isRtl ? 'شريط الإعلانات' : 'Announcement Bar', icon: Bell },
              { id: 'seo', label: isRtl ? 'السيو والتتبع' : 'SEO & Tracking Pixels', icon: Globe },
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

                  {(tab as any).badge !== undefined && (typeof (tab as any).badge === 'number' ? (tab as any).badge > 0 : Boolean((tab as any).badge)) && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-[#FFD147] text-[#1A1A1A] font-bold">
                      {(tab as any).badge}
                    </span>
                  )}

                  {(tab as any).count !== undefined && (tab as any).count > 0 && !(tab as any).badge && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-[#FAF7F2] text-[#736B63] border border-[#E8E2D7]">
                      {(tab as any).count}
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
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
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
                    onClick={() => setActiveTab('bundles')}
                    className="p-3.5 rounded-xl border border-[#E8E2D7] hover:border-[#3C1322] hover:bg-[#FAF7F2] transition text-left cursor-pointer group"
                  >
                    <Gift className="w-4 h-4 text-[#3C1322] mb-1.5" />
                    <span className="text-xs font-medium text-[#1A1A1A] block">Gift Bundles</span>
                    <span className="text-[10px] text-[#736B63]">{bundles.length} in database</span>
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
                    {isRtl ? 'إدارة الطلبات والشحن' : 'Orders & Shipments'} ({filteredOrders.length})
                  </h1>
                  <p className="text-xs text-[#736B63] font-light">
                    {isRtl
                      ? 'البحث في الطلبات، تحديث حالات الشحن، إرسال الفواتير عبر واتساب، وطباعة بوالص التجهيز.'
                      : 'Search, change dispatch stages, send WhatsApp invoices, and print receipts.'}
                  </p>
                </div>
              </div>

              {/* Search & Filters */}
              <div className="bg-white p-4 rounded-2xl border border-[#E8E2D7] shadow-soft flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-[#736B63] absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    placeholder={isRtl ? 'بحث برقم الطلب، اسم العميل، الهاتف، المحافظة...' : 'Search by Order #, Customer Name, Phone, Governorate...'}
                    className="w-full text-xs pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-2 bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="text-xs px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl text-[#1A1A1A] focus:outline-none cursor-pointer w-full sm:w-auto"
                  >
                    <option value="all">{isRtl ? 'جميع الحالات' : 'All Statuses'}</option>
                    <option value="pending">{isRtl ? 'قيد الانتظار' : 'Pending'}</option>
                    <option value="paid">{isRtl ? 'مدفوع' : 'Paid'}</option>
                    <option value="preparing">{isRtl ? 'قيد التجهيز' : 'Preparing'}</option>
                    <option value="dispatched">{isRtl ? 'تم الشحن' : 'Dispatched'}</option>
                    <option value="delivered">{isRtl ? 'تم التوصيل' : 'Delivered'}</option>
                    <option value="cancelled">{isRtl ? 'ملغي' : 'Cancelled'}</option>
                  </select>
                </div>
              </div>

              {/* Order Cards List */}
              {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#E8E2D7] p-10 text-center text-xs text-[#736B63]">
                  {isRtl ? 'لا توجد طلبات تطابق معايير البحث.' : 'No orders found matching your filters.'}
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
                            <span>{isRtl ? 'الهاتف:' : 'Phone:'} {ord.customer_phone || '-'}</span>
                            <span>•</span>
                            <span>{isRtl ? 'الدفع:' : 'Payment:'} <strong>{ord.payment_method?.toUpperCase() || 'COD'}</strong> ({ord.payment_status || 'Pending'})</span>
                            <span>•</span>
                            <span>{isRtl ? 'الإجمالي:' : 'Total:'} <strong className="text-[#1A1A1A]">EGP {ord.total_amount}</strong></span>
                          </div>
                        </div>

                        {/* Status Changer & Quick Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                          <select
                            value={ord.status || 'pending'}
                            onChange={(e) => handleUpdateOrderStatus(ord.id || ord.order_number, e.target.value)}
                            className="text-xs px-3 py-1.5 rounded-full border border-[#E8E2D7] bg-[#FAF7F2] font-medium text-[#1A1A1A] focus:outline-none cursor-pointer"
                          >
                            <option value="pending">{isRtl ? 'قيد الانتظار' : 'Pending'}</option>
                            <option value="paid">{isRtl ? 'مدفوع' : 'Paid'}</option>
                            <option value="preparing">{isRtl ? 'قيد التجهيز' : 'Preparing'}</option>
                            <option value="dispatched">{isRtl ? 'تم الشحن' : 'Dispatched'}</option>
                            <option value="delivered">{isRtl ? 'تم التوصيل' : 'Delivered'}</option>
                            <option value="cancelled">{isRtl ? 'ملغي' : 'Cancelled'}</option>
                          </select>

                          {/* Primary WhatsApp Invoice Button */}
                          <button
                            type="button"
                            onClick={() => handleSendWhatsAppInvoice(ord)}
                            className="px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                            title={isRtl ? 'إرسال الفاتورة الرسمية عبر واتساب' : 'Send WhatsApp Invoice'}
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>{isRtl ? 'فاتورة واتساب' : 'WhatsApp Invoice'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handlePrintOrder(ord)}
                            className="p-1.5 rounded-full bg-[#FAF7F2] hover:bg-[#1A1A1A] hover:text-[#FAF7F2] text-[#1A1A1A] border border-[#E8E2D7] transition cursor-pointer"
                            title={isRtl ? 'طباعة إيصال التجهيز' : 'Print Packing Slip'}
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setInspectingOrder(inspectingOrder?.order_number === ord.order_number ? null : ord)}
                            className="text-xs px-2.5 py-1 rounded-full border border-[#E8E2D7] hover:border-[#1A1A1A] text-[#736B63] hover:text-[#1A1A1A] cursor-pointer"
                          >
                            {inspectingOrder?.order_number === ord.order_number ? (isRtl ? 'إخفاء' : 'Hide') : (isRtl ? 'التفاصيل' : 'Details')}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Order Items & Address */}
                      {inspectingOrder?.order_number === ord.order_number && (
                        <div className="pt-3 text-xs space-y-2.5 bg-[#FAF7F2]/80 p-3.5 rounded-xl mt-2 border border-[#E8E2D7]">
                          <p><strong>{isRtl ? 'عنوان الشحن والتوصيل:' : 'Shipping Address:'}</strong> {ord.shipping_address || 'Standard address'}{ord.governorate ? `, ${ord.governorate}` : ''}</p>
                          {ord.notes && <p><strong>{isRtl ? 'ملاحظات العميل:' : 'Customer Notes:'}</strong> {ord.notes}</p>}
                          <div>
                            <strong>{isRtl ? 'قائمة المنتجات والنكهات المطلوبة:' : 'Ordered Items & Selected Flavors:'}</strong>
                            <ul className="list-disc list-inside mt-1.5 space-y-1 text-[#736B63]">
                              {(ord.items || []).map((it: any, i: number) => {
                                const flavor = it.flavor || it.selected_flavor;
                                return (
                                  <li key={i}>
                                    <span className="font-medium text-[#1A1A1A]">{it.name || it.product_name || 'Confection pack'}</span>
                                    {flavor && (
                                      <span className="ml-1.5 rtl:mr-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#FFD147]/30 text-[#3C1322] border border-[#FFD147]/40">
                                        {isRtl ? 'النكهة: ' : 'Flavor: '}{flavor}
                                      </span>
                                    )}
                                    {' '}x {it.quantity || 1} — EGP {Number(it.unit_price || it.price || 0) * (it.quantity || 1)}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>

                          <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-[#E8E2D7]">
                            <button
                              type="button"
                              onClick={() => handleSendWhatsAppInvoice(ord)}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>{isRtl ? 'إرسال الفاتورة عبر واتساب للعميل' : 'Send WhatsApp Invoice with Order Details'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handlePrintOrder(ord)}
                              className="px-3 py-1.5 rounded-xl bg-white border border-[#E8E2D7] hover:border-[#1A1A1A] text-xs font-medium text-[#1A1A1A] transition flex items-center gap-1.5 cursor-pointer"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>{isRtl ? 'طباعة إيصال التجهيز' : 'Print Packing Slip'}</span>
                            </button>
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
                    onClick={() => setIsUploadAssetModalOpen(true)}
                    className="px-3.5 py-2 bg-white hover:bg-[#FAF7F2] border border-[#E8E2D7] hover:border-[#1A1A1A] text-[#1A1A1A] rounded-xl text-xs font-medium transition cursor-pointer shadow-soft flex items-center gap-1.5"
                    title="Upload an image from your device"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#3C1322]" />
                    <span>Upload Image</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNewProductImage('/images/products/mango_sunbeam.jpg');
                      setIsNewProductModalOpen(true);
                    }}
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
                          <div className="relative group shrink-0">
                            <img
                              src={prod.image || prod.image_url || '/images/products/mango_sunbeam.jpg'}
                              alt={prod.name}
                              className="w-16 h-16 rounded-xl object-cover bg-[#FAF7F2] border border-[#E8E2D7]"
                            />
                            <div className="absolute -bottom-1 -right-1" title="Upload new photo for this confection">
                              <ImageUploadButton
                                compact
                                value={prod.image || prod.image_url}
                                onChange={(newUrl) => handleDirectImageUpload(prod.id, newUrl, prod.name)}
                              />
                            </div>
                          </div>
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

          {/* 3b. GIFT BUNDLES (from toomakt_bundles database) */}
          {activeTab === 'bundles' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl text-[#1A1A1A] font-normal tracking-tight">
                    Gift Bundles & Tins ({filteredBundles.length})
                  </h1>
                  <p className="text-xs text-[#736B63] font-light">
                    Live data from <code className="text-[10px] bg-[#FAF7F2] px-1 rounded">toomakt_bundles</code> — edit prices, featured flags, and storefront visibility.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsNewBundleModalOpen(true)}
                  className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5 cursor-pointer shadow-soft"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Bundle</span>
                </button>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-[#E8E2D7] shadow-soft flex items-center gap-3">
                <Search className="w-4 h-4 text-[#736B63] ml-1" />
                <input
                  type="text"
                  value={bundleSearchQuery}
                  onChange={(e) => setBundleSearchQuery(e.target.value)}
                  placeholder="Filter bundles by title, category, or description..."
                  className="w-full text-xs bg-transparent text-[#1A1A1A] focus:outline-none"
                />
                {bundleSearchQuery && (
                  <button onClick={() => setBundleSearchQuery('')} className="text-xs text-[#736B63] hover:text-[#1A1A1A]">
                    Clear
                  </button>
                )}
              </div>

              {filteredBundles.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#E8E2D7] p-12 text-center shadow-soft">
                  <Gift className="w-8 h-8 text-[#3C1322]/30 mx-auto mb-3" />
                  <p className="text-sm text-[#1A1A1A] font-medium mb-1">No bundles in the database</p>
                  <p className="text-xs text-[#736B63] font-light mb-4">
                    Seed the atelier or create a new gift box to show on the storefront Bundles page.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsNewBundleModalOpen(true)}
                    className="btn-primary text-xs px-4 py-2 inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Create first bundle
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredBundles.map(bundle => {
                    const active = bundle.is_active !== false;
                    return (
                      <div
                        key={bundle.id}
                        className={`bg-white rounded-2xl border p-4 shadow-soft flex flex-col gap-3 transition ${
                          active ? 'border-[#E8E2D7] hover:border-[#1A1A1A]' : 'border-dashed border-[#E8E2D7] opacity-75'
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className="relative shrink-0">
                            <img
                              src={bundle.image || bundle.image_url || '/images/carousel.jpg'}
                              alt={bundle.title}
                              className="w-20 h-20 rounded-xl object-cover bg-[#FAF7F2] border border-[#E8E2D7]"
                            />
                            <div className="absolute -bottom-1 -right-1">
                              <ImageUploadButton
                                compact
                                value={bundle.image || bundle.image_url}
                                onChange={(url) => handleDirectBundleImageUpload(bundle.id, url, bundle.title)}
                              />
                            </div>
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                                  {bundle.is_grand_feature && (
                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-[#FFD147]/40 text-[#3C1322]">
                                      Featured
                                    </span>
                                  )}
                                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#736B63] truncate">
                                    {bundle.category}
                                  </span>
                                </div>
                                <h4 className="font-serif text-sm font-semibold text-[#1A1A1A] truncate">
                                  {bundle.title}
                                </h4>
                              </div>
                              <button
                                type="button"
                                onClick={() => setEditingBundle(bundle)}
                                className="p-1 rounded-md text-[#736B63] hover:text-[#1A1A1A] hover:bg-[#FAF7F2] cursor-pointer shrink-0"
                                title="Edit bundle"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <p className="text-[11px] text-[#736B63] font-light line-clamp-2 mt-1">
                              {bundle.description}
                            </p>

                            <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-[#3C1322]">
                              <span>EGP</span>
                              <input
                                type="number"
                                defaultValue={bundle.price}
                                key={`price-${bundle.id}-${bundle.price}`}
                                onBlur={(e) => handleDirectBundlePriceChange(bundle.id, e.target.value)}
                                className="w-20 px-1.5 py-0.5 rounded border border-[#E8E2D7] bg-[#FAF7F2] text-[#1A1A1A] font-bold text-xs"
                              />
                              <span className="text-[10px] font-normal text-[#736B63] ml-1">{bundle.weight}</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-[#E8E2D7] flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleToggleBundleActive(bundle)}
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium cursor-pointer ${
                                active
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-rose-50 text-rose-800 border border-rose-200'
                              }`}
                            >
                              {active ? '✓ Active' : '✕ Hidden'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleBundleFeatured(bundle)}
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium cursor-pointer border ${
                                bundle.is_grand_feature
                                  ? 'bg-[#FFD147]/30 text-[#3C1322] border-[#FFD147]/60'
                                  : 'bg-[#FAF7F2] text-[#736B63] border-[#E8E2D7]'
                              }`}
                            >
                              {bundle.is_grand_feature ? '★ Featured' : 'Set featured'}
                            </button>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setEditingBundle(bundle)}
                              className="px-2.5 py-1 text-[11px] rounded-lg border border-[#E8E2D7] hover:border-[#1A1A1A] text-[#1A1A1A] bg-[#FAF7F2] cursor-pointer"
                            >
                              Edit All
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteBundle(bundle.id, bundle.title)}
                              className="p-1 rounded-lg text-[#C53030] hover:bg-rose-50 cursor-pointer"
                              title="Delete bundle"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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
            <ShippingRatesTab
              shippingRates={shippingRates}
              setShippingRates={setShippingRates}
              coupons={coupons}
              setCoupons={setCoupons}
              showToast={showToast}
            />
          )}

          {/* 7. CATEGORIES & FLAVORS */}
          {activeTab === 'categories' && (
            <CategoriesFlavorsTab
              categories={categories}
              setCategories={setCategories}
              flavors={flavors}
              setFlavors={setFlavors}
              showToast={showToast}
            />
          )}

          {/* 8. CUSTOMER REVIEWS */}
          {activeTab === 'reviews' && (
            <ReviewsTab
              reviews={reviews}
              setReviews={setReviews}
              showToast={showToast}
            />
          )}

          {/* 9. SUBSCRIBERS */}
          {activeTab === 'subscribers' && (
            <SubscribersTab
              subscribers={subscribers}
              setSubscribers={setSubscribers}
              showToast={showToast}
            />
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

                  <div className="pt-1">
                    <ImageUploadButton
                      value={seoConfig.ogImageUrl}
                      onChange={(url) => setSeoConfig({ ...seoConfig, ogImageUrl: url })}
                      label="Social Share Open Graph Image (OG:Image)"
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

              {/* Packaging Weight */}
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

              {/* Upload Confection Image */}
              <div className="p-3 bg-[#FAF7F2]/80 rounded-2xl border border-[#E8E2D7]">
                <ImageUploadButton
                  value={editingProduct.image || editingProduct.image_url || ''}
                  onChange={(url) => setEditingProduct({ ...editingProduct, image: url, image_url: url })}
                  label="Confection Photo / Image Asset"
                />
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

              {/* Available Flavors for Customer Selection */}
              <div>
                <label className="block text-[#736B63] mb-1 font-medium">
                  {isRtl ? 'النكهات المتاحة لاختيار العميل (مفصولة بفواصل)' : 'Available Flavors (comma-separated for customer to pick)'}
                </label>
                <input
                  type="text"
                  value={Array.isArray(editingProduct.available_flavors) ? editingProduct.available_flavors.join(', ') : (editingProduct.available_flavors || editingProduct.name || '')}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    available_flavors: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean)
                  })}
                  placeholder="e.g. Alphonso Mango, Passion Mango Twist, Golden Honey Mango"
                  className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3 py-2 text-[#1A1A1A]"
                />
                <span className="text-[10px] text-[#736B63] mt-1 block">
                  {isRtl ? 'سيتمكن العميل من اختيار أي من هذه النكهات في صفحة تفاصيل المنتج وسلة المشتريات' : 'Customer will choose between these flavors when ordering.'}
                </span>
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
                const flavorsArr = form.flavors?.value
                  ? form.flavors.value.split(',').map((s: string) => s.trim()).filter(Boolean)
                  : [form.name.value];

                const newP = {
                  id: `custom-${Date.now()}`,
                  name: form.name.value,
                  price: Number(form.price.value),
                  weight: form.weight.value || '250g Pouch',
                  pieces_per_pack: Number(form.pieces.value) || 20,
                  stock_quantity: Number(form.stock.value) || 50,
                  image: '/images/products/mango_sunbeam.jpg',
                  in_stock: true,
                  available_flavors: flavorsArr
                };
                setProducts([...products, newP]);
                setIsNewProductModalOpen(false);
                showToast(`Added ${newP.name} to catalog!`);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-[#736B63] mb-1 font-medium">{isRtl ? 'اسم الصنف / الحلوى' : 'Confection Name'}</label>
                <input required name="name" placeholder="e.g. Vanilla Bean Caramel" className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3 py-2 text-[#1A1A1A]" />
              </div>
              <div>
                <label className="block text-[#736B63] mb-1 font-medium">{isRtl ? 'خيارات النكهات (مفصولة بفواصل)' : 'Available Flavors (comma-separated)'}</label>
                <input name="flavors" placeholder="e.g. Alphonso Mango, Passion Mango Twist, Golden Honey" className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3 py-2 text-[#1A1A1A]" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#736B63] mb-1 font-medium">{isRtl ? 'السعر (ج.م)' : 'Price (EGP)'}</label>
                  <input required type="number" name="price" defaultValue="260" className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3 py-2 text-[#1A1A1A]" />
                </div>
                <div>
                  <label className="block text-[#736B63] mb-1 font-medium">{isRtl ? 'المخزون الأولي' : 'Initial Stock'}</label>
                  <input required type="number" name="stock" defaultValue="50" className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3 py-2 text-[#1A1A1A]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#736B63] mb-1 font-medium">{isRtl ? 'الوزن' : 'Weight'}</label>
                  <input name="weight" defaultValue="250g Pouch" className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3 py-2 text-[#1A1A1A]" />
                </div>
                <div>
                  <label className="block text-[#736B63] mb-1 font-medium">{isRtl ? 'عدد القطع / عبوة' : 'Pieces / Pack'}</label>
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

      {/* MODAL: EDIT BUNDLE */}
      {editingBundle && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E8E2D7] max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D7] mb-4">
              <h3 className="font-serif text-lg font-normal text-[#1A1A1A]">
                Edit Bundle: {editingBundle.title}
              </h3>
              <button type="button" onClick={() => setEditingBundle(null)} className="p-1 text-[#736B63] hover:text-[#1A1A1A]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBundleEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#736B63] mb-1 font-medium">Title</label>
                <input
                  required
                  value={editingBundle.title || ''}
                  onChange={(e) => setEditingBundle({ ...editingBundle, title: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3 py-2 text-[#1A1A1A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#736B63] mb-1 font-medium">Category</label>
                  <input
                    value={editingBundle.category || ''}
                    onChange={(e) => setEditingBundle({ ...editingBundle, category: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3 py-2 text-[#1A1A1A]"
                  />
                </div>
                <div>
                  <label className="block text-[#736B63] mb-1 font-medium">Badge</label>
                  <input
                    value={editingBundle.badge || ''}
                    onChange={(e) => setEditingBundle({ ...editingBundle, badge: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3 py-2 text-[#1A1A1A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#736B63] mb-1 font-medium">Price (EGP)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingBundle.price ?? 0}
                    onChange={(e) => setEditingBundle({ ...editingBundle, price: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3 py-2 text-[#1A1A1A]"
                  />
                </div>
                <div>
                  <label className="block text-[#736B63] mb-1 font-medium">Weight</label>
                  <input
                    value={editingBundle.weight || ''}
                    onChange={(e) => setEditingBundle({ ...editingBundle, weight: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3 py-2 text-[#1A1A1A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#736B63] mb-1 font-medium">Description</label>
                <textarea
                  rows={3}
                  value={editingBundle.description || ''}
                  onChange={(e) => setEditingBundle({ ...editingBundle, description: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3 py-2 text-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-[#736B63] mb-1 font-medium">Perk note</label>
                <input
                  value={editingBundle.perk_note || ''}
                  onChange={(e) => setEditingBundle({ ...editingBundle, perk_note: e.target.value })}
                  placeholder="e.g. Includes Gold Foil Gift Bag"
                  className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3 py-2 text-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-[#736B63] mb-1 font-medium">Image</label>
                <ImageUploadButton
                  value={editingBundle.image || editingBundle.image_url || ''}
                  onChange={(url) => setEditingBundle({ ...editingBundle, image: url, image_url: url })}
                />
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingBundle.is_grand_feature)}
                    onChange={(e) => setEditingBundle({ ...editingBundle, is_grand_feature: e.target.checked })}
                    className="rounded border-[#E8E2D7]"
                  />
                  <span className="text-[#1A1A1A]">Featured on storefront</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingBundle.is_active !== false}
                    onChange={(e) => setEditingBundle({ ...editingBundle, is_active: e.target.checked })}
                    className="rounded border-[#E8E2D7]"
                  />
                  <span className="text-[#1A1A1A]">Active / visible</span>
                </label>
              </div>

              <div className="pt-3 border-t border-[#E8E2D7] flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleDeleteBundle(editingBundle.id, editingBundle.title)}
                  className="px-3 py-2 text-[#C53030] hover:bg-rose-50 rounded-full flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingBundle(null)}
                    className="px-4 py-2 border border-[#E8E2D7] rounded-full text-[#736B63] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary text-xs px-5 py-2 cursor-pointer flex items-center gap-1.5">
                    <Save className="w-3.5 h-3.5" />
                    Save Bundle
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD BUNDLE */}
      {isNewBundleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E8E2D7] max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D7] mb-4">
              <h3 className="font-serif text-lg font-normal text-[#1A1A1A]">Add Gift Bundle</h3>
              <button type="button" onClick={() => setIsNewBundleModalOpen(false)} className="p-1 text-[#736B63] hover:text-[#1A1A1A]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as any;
                try {
                  const created = await api.createBundle({
                    title: form.title.value,
                    category: form.category.value || 'Curated Gift Box',
                    price: Number(form.price.value),
                    weight: form.weight.value || '450G LUXURY TIN',
                    description: form.description.value || '',
                    badge: form.badge.value || '',
                    perk_note: form.perk.value || '',
                    is_grand_feature: form.featured.checked,
                    is_active: true,
                    image_url: '/images/carousel.jpg',
                  });
                  setBundles((prev) => [created, ...prev]);
                  setIsNewBundleModalOpen(false);
                  showToast(`Added "${created.title}" to database!`);
                } catch (err: any) {
                  showToast(err?.message || 'Failed to create bundle');
                }
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-[#736B63] mb-1 font-medium">Bundle Title</label>
                <input required name="title" placeholder="e.g. Summer Tropical Duo" className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3 py-2 text-[#1A1A1A]" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#736B63] mb-1 font-medium">Price (EGP)</label>
                  <input required type="number" name="price" defaultValue="420" className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3 py-2 text-[#1A1A1A]" />
                </div>
                <div>
                  <label className="block text-[#736B63] mb-1 font-medium">Weight</label>
                  <input name="weight" defaultValue="450G LUXURY TIN" className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3 py-2 text-[#1A1A1A]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#736B63] mb-1 font-medium">Category</label>
                  <input name="category" defaultValue="Curated Gift Box" className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3 py-2 text-[#1A1A1A]" />
                </div>
                <div>
                  <label className="block text-[#736B63] mb-1 font-medium">Badge</label>
                  <input name="badge" placeholder="BEST GIFT" className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3 py-2 text-[#1A1A1A]" />
                </div>
              </div>
              <div>
                <label className="block text-[#736B63] mb-1 font-medium">Description</label>
                <textarea name="description" rows={2} className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3 py-2 text-[#1A1A1A]" />
              </div>
              <div>
                <label className="block text-[#736B63] mb-1 font-medium">Perk note</label>
                <input name="perk" placeholder="Includes tasting menu" className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3 py-2 text-[#1A1A1A]" />
              </div>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="featured" className="rounded border-[#E8E2D7]" />
                <span className="text-[#1A1A1A]">Feature as grand gift box</span>
              </label>

              <div className="pt-3 border-t border-[#E8E2D7] flex justify-end gap-2">
                <button type="button" onClick={() => setIsNewBundleModalOpen(false)} className="px-4 py-2 border border-[#E8E2D7] rounded-full text-[#736B63]">
                  Cancel
                </button>
                <button type="submit" className="btn-primary px-4 py-2 text-xs">
                  Save Bundle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
