import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { navigateTo } from '../utils/navigation';
import { api } from '../services/api';

interface AnnouncementBarProps {
  onNavigateView?: (view: string) => void;
}

interface AlertConfig {
  enabled: boolean;
  enPrefix: string;
  enMain: string;
  enCta: string;
  arPrefix: string;
  arMain: string;
  arCta: string;
  ctaTarget: string;
  bgColor?: string;
  textColor?: string;
  accentColor?: string;
}

const DEFAULT_CONFIG: AlertConfig = {
  enabled: true,
  enPrefix: 'THE FRUIT TOFFEE UNIVERSE',
  enMain: 'Free shipping on Egyptian orders over 2,000 EGP',
  enCta: 'Explore Shop',
  arPrefix: 'عالم التوفي بالفاكهة الطبيعية',
  arMain: 'شحن مجاني لكافة محافظات مصر للطلبات أكثر من 2,000 ج.م',
  arCta: 'تسوق الآن',
  ctaTarget: 'shop',
};

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onNavigateView }) => {
  const { isRtl } = useLanguage();
  const { isDark } = useTheme();

  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem('toomakt_alert_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  const [alertConfig, setAlertConfig] = useState<AlertConfig>(() => {
    try {
      const saved = localStorage.getItem('toomakt_alert_config');
      return saved ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) } : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  });

  useEffect(() => {
    // Fetch live alert config from database
    api.getGlobalSetting('toomakt_alert_config')
      .then((dbConfig: any) => {
        if (dbConfig && typeof dbConfig === 'object') {
          setAlertConfig((prev) => ({ ...prev, ...dbConfig }));
        }
      })
      .catch(() => {});

    // Listen for custom alert updates from alert manager
    const handleUpdate = (e?: any) => {
      try {
        if (e && e.detail) {
          setAlertConfig((prev) => ({ ...prev, ...e.detail }));
        } else {
          const saved = localStorage.getItem('toomakt_alert_config');
          if (saved) {
            setAlertConfig((prev) => ({ ...prev, ...JSON.parse(saved) }));
          }
        }
      } catch {}
    };

    const handleResetDismiss = () => {
      setDismissed(false);
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('toomakt:alert-updated', handleUpdate);
    window.addEventListener('toomakt:alert-reset-dismiss', handleResetDismiss);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('toomakt:alert-updated', handleUpdate);
      window.removeEventListener('toomakt:alert-reset-dismiss', handleResetDismiss);
    };
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem('toomakt_alert_dismissed', 'true');
    } catch {}
  };

  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = alertConfig.ctaTarget || 'shop';
    if (onNavigateView) {
      onNavigateView(target);
    } else {
      navigateTo(target);
    }
  };

  if (dismissed || !alertConfig.enabled) return null;

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        aria-label="Announcement"
        className={`w-full relative z-50 overflow-hidden select-none border-b transition-colors duration-300 ${
          isDark
            ? 'bg-gradient-to-r from-[#190B13] via-[#24101C] to-[#190B13] text-[#FAF5EE] border-[#381F2E]'
            : 'bg-gradient-to-r from-[#2B0E19] via-[#3C1322] to-[#2B0E19] text-[#FAF7F2] border-[#200A13]'
        }`}
      >
        {/* Subtle Ambient Shimmer */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400/10 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3 relative z-10">
          {/* Left Decorative Spacer */}
          <div className="hidden lg:flex items-center gap-2 w-28 shrink-0">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD147] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFD147]" />
            </span>
            <span className="text-[10px] font-mono tracking-widest uppercase opacity-75 text-[#FFD147]">
              {isRtl ? 'إشعار المعمل' : 'DISPATCH'}
            </span>
          </div>

          {/* Central Message Container */}
          <div className="flex-1 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-center text-xs font-medium tracking-normal sm:tracking-wide">
            {/* Pill Badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border shadow-xs ${
                isDark
                  ? 'bg-[#3A1C2C]/80 text-[#FFD147] border-[#5E2F48]'
                  : 'bg-white/10 text-[#FFD147] border-white/15'
              }`}
            >
              <Sparkles className="w-3 h-3 text-[#FFD147] animate-pulse" />
              <span>{isRtl ? alertConfig.arPrefix : alertConfig.enPrefix}</span>
            </span>

            {/* Separator */}
            <span className="hidden sm:inline text-white/30">•</span>

            {/* Main Alert Text */}
            <span className="text-[11px] sm:text-xs text-[#FAF7F2]/95 font-medium">
              {isRtl ? alertConfig.arMain : alertConfig.enMain}
            </span>

            {/* Action CTA Button */}
            <button
              type="button"
              onClick={handleCtaClick}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold tracking-normal transition-all duration-200 cursor-pointer shadow-xs active:scale-95 ${
                isDark
                  ? 'bg-[#FFD147] hover:bg-[#FFE082] text-[#1A1A1A] hover:shadow-[0_0_12px_rgba(255,209,71,0.4)]'
                  : 'bg-[#FFD147] hover:bg-[#FFE082] text-[#3C1322] hover:shadow-[0_0_12px_rgba(255,209,71,0.3)]'
              }`}
            >
              <span>{isRtl ? alertConfig.arCta : alertConfig.enCta}</span>
              {isRtl ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
            </button>
          </div>

          {/* Right Dismiss Button */}
          <div className="flex items-center justify-end w-auto sm:w-28 shrink-0">
            <button
              type="button"
              onClick={handleDismiss}
              className="p-1 rounded-full text-[#FAF7F2]/70 hover:text-white hover:bg-white/15 transition-all duration-200 cursor-pointer shrink-0"
              title={isRtl ? 'إغلاق الإشعار' : 'Dismiss announcement'}
              aria-label="Dismiss announcement"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};
