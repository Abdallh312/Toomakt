import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, X, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export interface ToastData {
  id?: string;
  type: 'success' | 'warning' | 'info';
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
}

interface ToastNotificationProps {
  toast: ToastData | null;
  onClose: () => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ toast, onClose }) => {
  const { isRtl } = useLanguage();
  const { isDark } = useTheme();

  useEffect(() => {
    if (!toast) return;
    const duration = toast.duration || 4500;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  // Thematic styling maps for both Light and Dark modes
  const themeStyles = {
    success: {
      lightBadge: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
      darkBadge: 'bg-emerald-950/70 text-emerald-300 border-emerald-700/50',
      iconColor: 'text-emerald-500 dark:text-emerald-400',
      glow: 'from-emerald-500/20 via-transparent to-transparent',
      progress: 'bg-gradient-to-r from-emerald-500 to-teal-400',
      actionBg: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/20',
      tagText: isRtl ? 'تم بنجاح' : 'Success',
    },
    warning: {
      lightBadge: 'bg-amber-50 text-amber-900 border-amber-200/80',
      darkBadge: 'bg-amber-950/70 text-amber-300 border-amber-700/50',
      iconColor: 'text-amber-500 dark:text-amber-400',
      glow: 'from-amber-500/20 via-transparent to-transparent',
      progress: 'bg-gradient-to-r from-amber-500 to-orange-400',
      actionBg: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-900/20',
      tagText: isRtl ? 'تنبيه' : 'Notice',
    },
    info: {
      lightBadge: 'bg-plum-50 text-[#3C1322] border-[#E8E2D7]',
      darkBadge: 'bg-[#2A1620] text-[#FFD147] border-[#4A2D3C]',
      iconColor: 'text-[#3C1322] dark:text-[#FFD147]',
      glow: 'from-[#FFD147]/15 via-transparent to-transparent',
      progress: 'bg-gradient-to-r from-[#3C1322] to-[#FFD147]',
      actionBg: 'bg-[#1A1A1A] dark:bg-[#FFD147] dark:text-[#1A1A1A] hover:bg-[#3C1322] text-[#FAF7F2]',
      tagText: isRtl ? 'معلومات' : 'Atelier Info',
    },
  }[toast.type];

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`fixed top-4 sm:top-6 z-50 pointer-events-none w-full max-w-md px-3 sm:px-4 ${
        isRtl ? 'left-0 sm:left-6' : 'right-0 sm:right-6'
      }`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={(toast.id || '') + toast.title + toast.message}
          initial={{ opacity: 0, y: -30, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 500, damping: 32 }}
          className={`pointer-events-auto relative overflow-hidden rounded-2xl p-4 sm:p-5 backdrop-blur-2xl transition-all duration-300 shadow-2xl ${
            isDark
              ? 'bg-[#150F13]/95 border border-[#3A222F] text-[#FAF5EE] shadow-[0_20px_50px_rgba(0,0,0,0.6)]'
              : 'bg-white/95 border border-[#E8E2D7] text-[#1A1A1A] shadow-[0_20px_45px_-10px_rgba(60,19,34,0.12)]'
          }`}
        >
          {/* Subtle Ambient Radial Glow */}
          <div
            className={`absolute -top-12 -right-12 w-40 h-40 bg-gradient-radial ${themeStyles.glow} rounded-full blur-2xl pointer-events-none`}
          />

          <div className="flex items-start gap-3.5 relative z-10">
            {/* Pulsing Icon Halo */}
            <div className="relative shrink-0 mt-0.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                  isDark ? 'bg-[#22161E] border border-[#3E2332]' : 'bg-[#FAF7F2] border border-[#E8E2D7]'
                }`}
              >
                {toast.type === 'success' && <CheckCircle2 className={`w-5 h-5 ${themeStyles.iconColor}`} />}
                {toast.type === 'warning' && <AlertTriangle className={`w-5 h-5 ${themeStyles.iconColor}`} />}
                {toast.type === 'info' && <Sparkles className={`w-5 h-5 ${themeStyles.iconColor}`} />}
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 min-w-0 pr-2">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded-md border ${
                    isDark ? themeStyles.darkBadge : themeStyles.lightBadge
                  }`}
                >
                  {themeStyles.tagText}
                </span>
                <span className={`text-[10px] ${isDark ? 'text-[#8C8075]' : 'text-[#9B938A]'}`}>
                  {isRtl ? 'الآن' : 'Just now'}
                </span>
              </div>

              <h4 className="text-sm font-semibold tracking-tight font-serif flex items-center gap-1.5">
                <span>{toast.title}</span>
              </h4>

              <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-[#C9BFB5]' : 'text-[#6B6158]'}`}>
                {toast.message}
              </p>

              {/* Action Button */}
              {toast.actionLabel && toast.onAction && (
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      toast.onAction?.();
                      onClose();
                    }}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium shadow-md transition-all duration-200 cursor-pointer active:scale-95 ${themeStyles.actionBg}`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{toast.actionLabel}</span>
                    <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              )}
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className={`p-1 rounded-full transition-colors cursor-pointer shrink-0 ${
                isDark
                  ? 'text-[#8C8075] hover:text-[#FAF5EE] hover:bg-white/10'
                  : 'text-[#9B938A] hover:text-[#1A1A1A] hover:bg-black/5'
              }`}
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Animated Countdown Progress Bar */}
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: (toast.duration || 4500) / 1000, ease: 'linear' }}
            className={`absolute bottom-0 left-0 h-1 ${themeStyles.progress}`}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
