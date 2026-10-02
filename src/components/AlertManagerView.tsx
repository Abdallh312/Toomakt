import React, { useState, useEffect } from 'react';
import {
  Bell,
  Eye,
  Save,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Check,
  AlertCircle,
  Palette,
  Globe,
  Sliders,
  X
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AlertConfig {
  enabled: boolean;
  enPrefix: string;
  enMain: string;
  enCta: string;
  arPrefix: string;
  arMain: string;
  arCta: string;
  ctaTarget: string;
  bgColor: string;
  textColor: string;
  accentColor: string;
}

const DEFAULT_CONFIG: AlertConfig = {
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

const PRESETS: { title: string; desc: string; config: Partial<AlertConfig> }[] = [
  {
    title: 'Free Shipping Threshold',
    desc: 'Classic luxury announcement highlighting complimentary shipping for orders over 2,000 EGP',
    config: {
      enPrefix: 'THE FRUIT TOFFEE UNIVERSE IS OPEN',
      enMain: 'FREE SHIPPING OVER EGP 2,000',
      enCta: 'Shop Collection',
      arPrefix: 'عالم التوفي بالفاكهة الطبيعية مفتوح الآن',
      arMain: 'شحن مجاني للطلبات أكثر من 2,000 ج.م',
      arCta: 'تسوق المجموعة',
      ctaTarget: 'shop',
      bgColor: '#3C1322',
      textColor: '#FAF7F2',
      accentColor: '#FFD147'
    }
  },
  {
    title: 'Fresh Cairo Atelier Batch',
    desc: 'Alert visitors about fresh, limited-quantity small batches cooked today',
    config: {
      enPrefix: 'FRESH BATCH FROM CAIRO ATELIER',
      enMain: 'HAND-COOKED IN COPPER KETTLES TODAY',
      enCta: 'Taste Now',
      arPrefix: 'دفعة طازجة من معملنا بالقاهرة',
      arMain: 'طُبخت اليوم ببطء في قدور نحاسية',
      arCta: 'تذوق الآن',
      ctaTarget: 'shop',
      bgColor: '#1A1512',
      textColor: '#FAF7F2',
      accentColor: '#FFD147'
    }
  },
  {
    title: 'Seasonal Fruit & Gift Box',
    desc: 'Promote bespoke corporate and festive gifting sets',
    config: {
      enPrefix: 'SUMMER FRUIT HARVEST 2026',
      enMain: 'BESPOKE 6-CANISTER GIFT BOXES NOW AVAILABLE',
      enCta: 'Explore Gifting',
      arPrefix: 'موسم حصاد الفاكهة 2026',
      arMain: 'صناديق الهدايا الفاخرة المكونة من 6 علب متوفرة الآن',
      arCta: 'استكشف الهدايا',
      ctaTarget: 'wholesale',
      bgColor: '#5B172E',
      textColor: '#FAF7F2',
      accentColor: '#FFE082'
    }
  },
  {
    title: 'Cold-Chain Delivery Notice',
    desc: 'Reassure customers regarding chilled temperature control during warm weather',
    config: {
      enPrefix: 'TEMPERATURE-CONTROLLED LOGISTICS',
      enMain: 'CHILLED COLD-CHAIN DISPATCH ACROSS ALL EGYPTIAN GOVERNORATES',
      enCta: 'Delivery Details',
      arPrefix: 'شحن مبرد خاضع للرقابة الحرارية',
      arMain: 'توصيل مبرد سريع لجميع محافظات مصر',
      arCta: 'تفاصيل الشحن',
      ctaTarget: 'shipping',
      bgColor: '#263428',
      textColor: '#FAF7F2',
      accentColor: '#A3E635'
    }
  }
];

const COLOR_PALETTES = [
  { name: 'Atelier Cacao', bg: '#3C1322', text: '#FAF7F2', accent: '#FFD147' },
  { name: 'Espresso Noir', bg: '#1A1512', text: '#FAF7F2', accent: '#FFD147' },
  { name: 'Velvet Berry', bg: '#60142C', text: '#FAF7F2', accent: '#FFDE7D' },
  { name: 'Warm Caramel', bg: '#78350F', text: '#FAF7F2', accent: '#FDE68A' },
  { name: 'Forest Olive', bg: '#253427', text: '#FAF7F2', accent: '#BEF264' },
  { name: 'Clean Minimalist Light', bg: '#FAF7F2', text: '#1A1A1A', accent: '#3C1322' }
];

interface AlertManagerViewProps {
  onBackToStore?: () => void;
  onNavigateView?: (view: string) => void;
}

export const AlertManagerView: React.FC<AlertManagerViewProps> = ({
  onBackToStore,
  onNavigateView
}) => {
  const { isRtl } = useLanguage();
  const [config, setConfig] = useState<AlertConfig>(() => {
    try {
      const saved = localStorage.getItem('toomakt_alert_config');
      return saved ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) } : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  });

  const [previewLang, setPreviewLang] = useState<'en' | 'ar'>('en');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [dismissResetSuccess, setDismissResetSuccess] = useState(false);

  const handleSave = () => {
    try {
      localStorage.setItem('toomakt_alert_config', JSON.stringify(config));
      // Dispatch both native storage event and custom toomakt event for instantaneous UI sync
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('toomakt:alert-updated', { detail: config }));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      alert('Unable to persist alert configuration');
    }
  };

  const handleResetDismiss = () => {
    try {
      sessionStorage.removeItem('toomakt_alert_dismissed');
      window.dispatchEvent(new CustomEvent('toomakt:alert-reset-dismiss'));
      setDismissResetSuccess(true);
      setTimeout(() => setDismissResetSuccess(false), 3000);
    } catch {}
  };

  const handleResetToDefault = () => {
    if (confirm('Reset alert configuration to atelier factory defaults?')) {
      setConfig(DEFAULT_CONFIG);
      localStorage.setItem('toomakt_alert_config', JSON.stringify(DEFAULT_CONFIG));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('toomakt:alert-updated', { detail: DEFAULT_CONFIG }));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  const applyPreset = (presetConfig: Partial<AlertConfig>) => {
    setConfig(prev => ({ ...prev, ...presetConfig }));
  };

  return (
    <div className="bg-[#FAF7F2] text-[#1A1A1A] min-h-screen py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation Breadcrumb & Back */}
        <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E8E2D7]">
          <div className="flex items-center gap-2 text-xs font-mono text-[#736B63] uppercase tracking-wider">
            <button
              onClick={() => onBackToStore ? onBackToStore() : (window.location.hash = '')}
              className="hover:text-[#1A1A1A] transition-colors cursor-pointer"
            >
              TOOMAKT
            </button>
            <span>/</span>
            <span className="text-[#1A1A1A] font-semibold">ALERT SYSTEM MANAGEMENT</span>
          </div>

          <button
            onClick={() => onBackToStore ? onBackToStore() : (window.location.hash = '')}
            className="text-xs font-medium text-[#736B63] hover:text-[#1A1A1A] underline underline-offset-4 cursor-pointer"
          >
            ← Return to Store
          </button>
        </div>

        {/* Header Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3C1322]/5 text-[#3C1322] text-xs font-semibold uppercase tracking-wider mb-2">
            <Bell className="w-3.5 h-3.5" />
            <span>GLOBAL ANNOUNCEMENT SYSTEM</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] font-normal tracking-tight mb-2">
            Announcement & Alert Manager
          </h1>
          <p className="text-sm text-[#736B63] font-light max-w-2xl">
            Configure, style, and publish the high-priority header banner displayed across all pages of toomakt in real time.
          </p>
        </div>

        {/* 1. LIVE INTERACTIVE PREVIEW */}
        <div className="bg-white rounded-2xl border border-[#E8E2D7] p-5 sm:p-6 mb-8 shadow-soft">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#3C1322]" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#1A1A1A]">
                Live Preview (Top Announcement Bar)
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#736B63]">Preview Language:</span>
              <button
                type="button"
                onClick={() => setPreviewLang('en')}
                className={`px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                  previewLang === 'en'
                    ? 'bg-[#1A1A1A] text-[#FAF7F2] font-semibold'
                    : 'bg-[#F4EFEA] text-[#736B63] hover:text-[#1A1A1A]'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setPreviewLang('ar')}
                className={`px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                  previewLang === 'ar'
                    ? 'bg-[#1A1A1A] text-[#FAF7F2] font-semibold'
                    : 'bg-[#F4EFEA] text-[#736B63] hover:text-[#1A1A1A]'
                }`}
              >
                العربية
              </button>
            </div>
          </div>

          {/* Banner Container Preview */}
          {config.enabled ? (
            <div
              style={{ backgroundColor: config.bgColor, color: config.textColor }}
              className="rounded-xl py-2.5 px-4 overflow-hidden shadow-inner flex items-center justify-between text-xs transition-all border border-black/10"
              dir={previewLang === 'ar' ? 'rtl' : 'ltr'}
            >
              <div className="w-4 hidden sm:block" />
              <div className="flex-1 flex items-center justify-center gap-2 text-center text-[11px] sm:text-xs font-medium">
                <span className="opacity-90">
                  {previewLang === 'ar' ? config.arPrefix : config.enPrefix}
                </span>
                <span className="opacity-40">·</span>
                <span>
                  {previewLang === 'ar' ? config.arMain : config.enMain}
                </span>
                <span className="opacity-40">|</span>
                <span
                  style={{ color: config.accentColor }}
                  className="underline underline-offset-4 font-semibold cursor-pointer"
                >
                  {previewLang === 'ar' ? config.arCta : config.enCta}
                </span>
              </div>
              <div className="p-1 rounded-full opacity-60">
                <X className="w-3.5 h-3.5" />
              </div>
            </div>
          ) : (
            <div className="rounded-xl py-4 px-4 bg-[#F4EFEA] border border-dashed border-[#E8E2D7] text-center text-xs text-[#736B63]">
              The global announcement bar is currently <strong>disabled</strong> and will not appear on the website.
            </div>
          )}
        </div>

        {/* 2. CURATED ONE-CLICK PRESETS */}
        <div className="bg-white rounded-2xl border border-[#E8E2D7] p-5 sm:p-6 mb-8 shadow-soft">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-[#3C1322]" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#1A1A1A]">
              Quick Atelier Presets
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(p.config)}
                className="text-left rtl:text-right p-3.5 rounded-xl border border-[#E8E2D7] hover:border-[#3C1322] hover:bg-[#FAF7F2] transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-[#1A1A1A] group-hover:text-[#3C1322]">
                    {p.title}
                  </span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#F4EFEA] text-[#736B63]">
                    Apply
                  </span>
                </div>
                <p className="text-[11px] text-[#736B63] font-light leading-snug">
                  {p.desc}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* 3. CONFIGURATION CONTROLS FORM */}
        <div className="bg-white rounded-2xl border border-[#E8E2D7] p-5 sm:p-6 mb-8 shadow-soft">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#1A1A1A] mb-5 pb-3 border-b border-[#E8E2D7] flex items-center justify-between">
            <span>Announcement Content & Visibility</span>
            {/* Global Switch */}
            <label className="flex items-center gap-2 text-xs font-medium cursor-pointer select-none">
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                className="rounded border-[#E8E2D7] text-[#3C1322] focus:ring-[#3C1322] w-4 h-4"
              />
              <span>Banner Active</span>
            </label>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            
            {/* English Content Box */}
            <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E8E2D7]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] block mb-3">
                English Text (LTR)
              </span>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#736B63] mb-1">
                    Prefix / Eyebrow
                  </label>
                  <input
                    type="text"
                    value={config.enPrefix}
                    onChange={(e) => setConfig({ ...config, enPrefix: e.target.value })}
                    className="w-full text-xs bg-white border border-[#E8E2D7] rounded-lg px-3 py-2 text-[#1A1A1A] focus:outline-none focus:border-[#3C1322]"
                    placeholder="e.g. THE FRUIT TOFFEE UNIVERSE IS OPEN"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#736B63] mb-1">
                    Main Notice
                  </label>
                  <input
                    type="text"
                    value={config.enMain}
                    onChange={(e) => setConfig({ ...config, enMain: e.target.value })}
                    className="w-full text-xs bg-white border border-[#E8E2D7] rounded-lg px-3 py-2 text-[#1A1A1A] focus:outline-none focus:border-[#3C1322]"
                    placeholder="e.g. FREE SHIPPING OVER EGP 2,000"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#736B63] mb-1">
                    Action Button Label
                  </label>
                  <input
                    type="text"
                    value={config.enCta}
                    onChange={(e) => setConfig({ ...config, enCta: e.target.value })}
                    className="w-full text-xs bg-white border border-[#E8E2D7] rounded-lg px-3 py-2 text-[#1A1A1A] focus:outline-none focus:border-[#3C1322]"
                    placeholder="e.g. Shop"
                  />
                </div>
              </div>
            </div>

            {/* Arabic Content Box */}
            <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E8E2D7]" dir="rtl">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] block mb-3">
                النص العربي (RTL)
              </span>

              <div className="space-y-3 text-right">
                <div>
                  <label className="block text-[11px] font-medium text-[#736B63] mb-1">
                    المقدمة / الترويسة
                  </label>
                  <input
                    type="text"
                    value={config.arPrefix}
                    onChange={(e) => setConfig({ ...config, arPrefix: e.target.value })}
                    className="w-full text-xs bg-white border border-[#E8E2D7] rounded-lg px-3 py-2 text-[#1A1A1A] focus:outline-none focus:border-[#3C1322]"
                    placeholder="مثال: عالم التوفي بالفاكهة الطبيعية مفتوح الآن"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#736B63] mb-1">
                    الرسالة الرئيسية
                  </label>
                  <input
                    type="text"
                    value={config.arMain}
                    onChange={(e) => setConfig({ ...config, arMain: e.target.value })}
                    className="w-full text-xs bg-white border border-[#E8E2D7] rounded-lg px-3 py-2 text-[#1A1A1A] focus:outline-none focus:border-[#3C1322]"
                    placeholder="مثال: شحن مجاني للطلبات أكثر من 2,000 ج.م"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#736B63] mb-1">
                    نص زر الإجراء
                  </label>
                  <input
                    type="text"
                    value={config.arCta}
                    onChange={(e) => setConfig({ ...config, arCta: e.target.value })}
                    className="w-full text-xs bg-white border border-[#E8E2D7] rounded-lg px-3 py-2 text-[#1A1A1A] focus:outline-none focus:border-[#3C1322]"
                    placeholder="مثال: تسوق"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Action Destination */}
          <div className="mb-6">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
              Action Destination (When Visitor Clicks CTA)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'shop', label: 'All Products (#shop)' },
                { id: 'our-story', label: 'Our Story (#about)' },
                { id: 'wholesale', label: 'Contact & Wholesale (#contact)' },
                { id: 'shipping', label: 'Shipping & Delivery' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setConfig({ ...config, ctaTarget: opt.id })}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                    config.ctaTarget === opt.id
                      ? 'bg-[#3C1322] text-[#FAF7F2] border-[#3C1322]'
                      : 'bg-white text-[#736B63] border-[#E8E2D7] hover:border-[#1A1A1A]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color Palettes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
              Atelier Theme & Mood Palette
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {COLOR_PALETTES.map((palette, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setConfig({
                    ...config,
                    bgColor: palette.bg,
                    textColor: palette.text,
                    accentColor: palette.accent
                  })}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    config.bgColor === palette.bg
                      ? 'border-[#3C1322] shadow-soft ring-2 ring-[#3C1322]/20'
                      : 'border-[#E8E2D7] hover:border-[#1A1A1A]'
                  }`}
                >
                  <div
                    className="w-full h-6 rounded-md border border-black/10 flex items-center justify-center text-[10px] font-bold"
                    style={{ backgroundColor: palette.bg, color: palette.accent }}
                  >
                    Aa
                  </div>
                  <span className="text-[10px] text-[#736B63] font-medium truncate w-full">
                    {palette.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. ACTIONS FOOTER */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E8E2D7]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleResetDismiss}
              className="text-xs text-[#736B63] hover:text-[#1A1A1A] underline underline-offset-4 cursor-pointer"
            >
              Reset Dismissed Status (Un-hide Bar)
            </button>
            <span className="text-[#E8E2D7]">|</span>
            <button
              type="button"
              onClick={handleResetToDefault}
              className="text-xs text-[#C53030] hover:underline cursor-pointer"
            >
              Factory Defaults
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {saveSuccess && (
              <span className="text-xs text-[#2E7D32] flex items-center gap-1 font-medium">
                <Check className="w-3.5 h-3.5" />
                Alert system updated & published!
              </span>
            )}

            {dismissResetSuccess && (
              <span className="text-xs text-[#2E7D32] flex items-center gap-1 font-medium">
                <Check className="w-3.5 h-3.5" />
                Alert unhidden for this session!
              </span>
            )}

            <button
              type="button"
              onClick={handleSave}
              className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer shadow-soft hover:shadow-soft-md"
            >
              <Save className="w-4 h-4" />
              <span>Publish Alert Changes</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
