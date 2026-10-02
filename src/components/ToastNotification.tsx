import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

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

  useEffect(() => {
    if (!toast) return;
    const duration = toast.duration || 4500;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />,
    info: <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
  };

  const borderMap = {
    success: 'border-emerald-500/40 shadow-emerald-950/20',
    warning: 'border-amber-500/40 shadow-amber-950/20',
    info: 'border-sky-500/40 shadow-sky-950/20'
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`fixed top-4 sm:top-6 z-50 pointer-events-none w-full max-w-sm px-4 ${
        isRtl ? 'left-0 sm:left-6' : 'right-0 sm:right-6'
      }`}
    >
      <AnimatePresence>
        <motion.div
          key={toast.title + toast.message}
          initial={{ opacity: 0, y: -25, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 450, damping: 30 }}
          className={`pointer-events-auto bg-[#24130B]/95 backdrop-blur-xl border ${borderMap[toast.type]} text-[#FFF7EC] rounded-2xl shadow-2xl p-4 relative overflow-hidden`}
        >
          {/* Subtle radial glow */}
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#C26715]/15 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-start gap-3 relative z-10">
            {iconMap[toast.type]}

            <div className="flex-1 min-w-0 pr-4">
              <h4 className="text-xs sm:text-sm font-black text-white tracking-wide flex items-center gap-1.5">
                <span>{toast.title}</span>
              </h4>
              <p className="text-[11px] sm:text-xs text-[#EADCCE] mt-0.5 leading-relaxed">
                {toast.message}
              </p>

              {toast.actionLabel && toast.onAction && (
                <button
                  type="button"
                  onClick={() => {
                    toast.onAction?.();
                    onClose();
                  }}
                  className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C26715] hover:bg-[#994709] text-white text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-3 h-3" />
                  <span>{toast.actionLabel}</span>
                  <ArrowRight className={`w-3 h-3 ${isRtl ? 'rotate-180' : ''}`} />
                </button>
              )}
            </div>

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="text-[#D4C3B2] hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
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
            className={`absolute bottom-0 left-0 h-1 ${
              toast.type === 'success'
                ? 'bg-emerald-400/70'
                : toast.type === 'warning'
                ? 'bg-amber-400/70'
                : 'bg-sky-400/70'
            }`}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
