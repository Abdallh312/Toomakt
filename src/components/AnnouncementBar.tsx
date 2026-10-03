import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
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

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onNavigateView }) => {
  const { isRtl } = useLanguage();
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
    api.getGlobalSetting('toomakt_alert_config').then((dbConfig: any) => {
      if (dbConfig && typeof dbConfig === 'object') {
        setAlertConfig(prev => ({ ...prev, ...dbConfig }));
      }
    }).catch(() => {});
    // Listen for custom alert updates from alert manager
    const handleUpdate = (e?: any) => {
      try {
        if (e && e.detail) {
          setAlertConfig(prev => ({ ...prev, ...e.detail }));
        } else {
          const saved = localStorage.getItem('toomakt_alert_config');
          if (saved) {
            setAlertConfig(prev => ({ ...prev, ...JSON.parse(saved) }));
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
    <div
      style={{
        backgroundColor: alertConfig.bgColor || '#3C1322',
        color: alertConfig.textColor || '#FAF7F2'
      }}
      className="text-xs py-2 px-3 sm:px-4 overflow-hidden relative z-50 select-none border-b border-black/15 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Spacer for symmetry */}
        <div className="w-5 hidden sm:block" />

        {/* Centered Announcement Message */}
        <div className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2.5 text-[11px] sm:text-xs font-medium tracking-wide text-center">
          <span className="hidden md:inline opacity-90">
            {isRtl ? alertConfig.arPrefix : alertConfig.enPrefix}
          </span>
          <span className="hidden md:inline opacity-40">·</span>
          <span>
            {isRtl ? alertConfig.arMain : alertConfig.enMain}
          </span>
          <span className="opacity-40">|</span>
          <button
            onClick={handleCtaClick}
            style={{ color: alertConfig.accentColor || '#FFD147' }}
            className="underline underline-offset-4 hover:opacity-80 transition-opacity font-semibold cursor-pointer"
          >
            {isRtl ? alertConfig.arCta : alertConfig.enCta}
          </button>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={handleDismiss}
          className="p-1 rounded-full text-current opacity-70 hover:opacity-100 hover:bg-white/10 transition-colors cursor-pointer shrink-0"
          title={isRtl ? 'إغلاق الإشعار' : 'Dismiss alert'}
          aria-label="Dismiss alert"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
