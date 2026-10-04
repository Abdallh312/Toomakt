import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  AlertTriangle,
  AlertCircle,
  ShoppingBag,
  CreditCard,
  X,
  Filter,
  Sparkles,
} from 'lucide-react';
import { AdminNotificationRecord } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface NotificationDropdownProps {
  notifications: AdminNotificationRecord[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onSelectNotification?: (notif: AdminNotificationRecord) => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onSelectNotification,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'orders' | 'payments' | 'system'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'orders') return n.notification_type === 'new_order';
    if (activeTab === 'payments')
      return (
        n.notification_type === 'payment_confirmation' ||
        n.notification_type === 'payment_approved' ||
        n.notification_type === 'payment_rejected'
      );
    if (activeTab === 'system')
      return (
        n.notification_type === 'low_stock' ||
        n.notification_type === 'out_of_stock' ||
        n.notification_type === 'wholesale_inquiry'
      );
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'payment_confirmation':
        return <CreditCard className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'payment_approved':
        return <Check className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'payment_rejected':
        return <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />;
      case 'low_stock':
      case 'out_of_stock':
        return <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />;
      case 'new_order':
      default:
        return <ShoppingBag className="w-4 h-4 text-emerald-500 shrink-0" />;
    }
  };

  const formatTimestamp = (dateStr?: string) => {
    if (!dateStr) return 'Just now';
    try {
      const d = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return d.toLocaleDateString();
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2.5 rounded-2xl transition-all duration-200 flex items-center justify-center cursor-pointer active:scale-95 ${
          isDark
            ? 'bg-[#1C1217] hover:bg-[#281A22] text-[#FFD147] border border-[#3E2332] shadow-md'
            : 'bg-white hover:bg-[#F4EFEA] text-[#3C1322] border border-[#E8E2D7] shadow-sm'
        }`}
        title="Admin Notifications"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 px-1.5 items-center justify-center rounded-full bg-rose-500 text-white text-[10px] font-black shadow-lg ring-2 ring-white dark:ring-[#140D11]">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`absolute right-0 mt-3 w-84 sm:w-96 rounded-2xl shadow-2xl z-50 overflow-hidden border backdrop-blur-2xl text-xs ${
              isDark
                ? 'bg-[#150F13]/95 border-[#3E2332] text-[#FAF5EE] shadow-[0_25px_60px_rgba(0,0,0,0.7)]'
                : 'bg-white/95 border-[#E8E2D7] text-[#1A1A1A] shadow-[0_20px_50px_rgba(60,19,34,0.12)]'
            }`}
          >
            {/* Header */}
            <div
              className={`p-4 border-b flex items-center justify-between ${
                isDark ? 'bg-[#1E141B] border-[#341F2B]' : 'bg-[#FAF7F2] border-[#E8E2D7]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-sm tracking-tight">Notifications</span>
                {unreadCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-500 text-[10px] font-bold border border-rose-500/30">
                    {unreadCount} new
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                    All caught up
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllRead}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-[#FFD147] hover:underline cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark read</span>
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className={`p-1 rounded-full transition cursor-pointer ${
                    isDark ? 'text-[#8C8075] hover:text-white' : 'text-[#9B938A] hover:text-black'
                  }`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div
              className={`flex items-center px-3 py-2 border-b gap-1 overflow-x-auto ${
                isDark ? 'bg-[#181015] border-[#2C1924]' : 'bg-[#F9F6F1] border-[#EDE6DB]'
              }`}
            >
              {[
                { id: 'all', label: 'All', icon: null },
                { id: 'orders', label: 'Orders', icon: ShoppingBag },
                { id: 'payments', label: 'Payments', icon: CreditCard },
                { id: 'system', label: 'Alerts', icon: AlertTriangle },
              ].map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition cursor-pointer shrink-0 ${
                      activeTab === tab.id
                        ? isDark
                          ? 'bg-[#FFD147] text-[#1A1A1A] font-bold shadow-xs'
                          : 'bg-[#3C1322] text-white font-bold shadow-xs'
                        : isDark
                        ? 'text-[#A69A8E] hover:bg-[#281A22]'
                        : 'text-[#736B63] hover:bg-[#EAE3D2]'
                    }`}
                  >
                    {TabIcon && <TabIcon className="w-3 h-3" />}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Notification List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-[#E8E2D7]/50 dark:divide-[#2E1B25]">
              {filteredNotifications.length === 0 ? (
                <div className="py-10 text-center flex flex-col items-center justify-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      isDark ? 'bg-[#22161E] text-[#8C8075]' : 'bg-[#FAF7F2] text-[#9B938A]'
                    }`}
                  >
                    <Bell className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-medium">No notifications in this tab</p>
                  <p className={`text-[11px] mt-0.5 ${isDark ? 'text-[#8C8075]' : 'text-[#9B938A]'}`}>
                    You're completely up to date!
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      if (!notif.is_read) onMarkRead(notif.id);
                      onSelectNotification?.(notif);
                    }}
                    className={`p-3.5 flex items-start gap-3 transition cursor-pointer relative ${
                      !notif.is_read
                        ? isDark
                          ? 'bg-[#22151D]/60 hover:bg-[#2B1B25]'
                          : 'bg-[#FAF6EF]/70 hover:bg-[#F4EFEA]'
                        : isDark
                        ? 'hover:bg-[#1C1217]'
                        : 'hover:bg-[#FDFBF7]'
                    }`}
                  >
                    {/* Unread dot */}
                    {!notif.is_read && (
                      <span className="absolute top-4 left-2 w-1.5 h-1.5 rounded-full bg-rose-500" />
                    )}

                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                        isDark ? 'bg-[#20151C] border-[#3C2230]' : 'bg-white border-[#E8E2D7]'
                      }`}
                    >
                      {getIcon(notif.notification_type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-xs truncate">{notif.title}</span>
                        <span
                          className={`text-[10px] shrink-0 flex items-center gap-1 ${
                            isDark ? 'text-[#8C8075]' : 'text-[#9B938A]'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(notif.created_at)}
                        </span>
                      </div>

                      <p
                        className={`text-[11px] mt-0.5 line-clamp-2 leading-relaxed ${
                          isDark ? 'text-[#C7BCB1]' : 'text-[#6B6158]'
                        }`}
                      >
                        {notif.message}
                      </p>

                      {notif.related_order_number && (
                        <span
                          className={`inline-block mt-1.5 px-2 py-0.5 text-[10px] font-mono font-bold rounded-md border ${
                            isDark
                              ? 'bg-[#281822] text-[#FFD147] border-[#442839]'
                              : 'bg-[#FAF7F2] text-[#3C1322] border-[#E8E2D7]'
                          }`}
                        >
                          Order #{notif.related_order_number}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
