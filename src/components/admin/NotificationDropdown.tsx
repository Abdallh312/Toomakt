import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, CheckCheck, Clock, AlertTriangle, AlertCircle, ShoppingBag, CreditCard, X } from 'lucide-react';
import { AdminNotificationRecord } from '../../types';

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
  onSelectNotification
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.is_read).length;

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

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'border-l-4 border-rose-500 bg-rose-950/40 text-rose-200';
      case 'high':
        return 'border-l-4 border-amber-500 bg-amber-950/40 text-amber-200';
      case 'medium':
        return 'border-l-4 border-blue-500 bg-blue-950/30 text-blue-200';
      default:
        return 'border-l-4 border-amber-800/60 bg-amber-950/20 text-amber-100/80';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'payment_confirmation':
        return <CreditCard className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'payment_approved':
        return <Check className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'payment_rejected':
        return <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />;
      case 'low_stock':
      case 'out_of_stock':
        return <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />;
      case 'new_order':
      default:
        return <ShoppingBag className="w-4 h-4 text-emerald-400 shrink-0" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-amber-950/60 hover:bg-amber-900/60 text-amber-200 transition border border-amber-900/50 flex items-center justify-center cursor-pointer"
        title="Admin Notifications"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-600 text-white text-[10px] font-black animate-pulse shadow-sm">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Card */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#2B170E] border border-amber-900/80 rounded-2xl shadow-2xl z-50 overflow-hidden text-xs">
          {/* Header */}
          <div className="p-3.5 bg-amber-950/80 border-b border-amber-900/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-serif font-black text-white text-sm">Notifications</span>
              {unreadCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full bg-rose-900/80 text-rose-300 font-mono text-[10px] font-bold border border-rose-700/50">
                  {unreadCount} unread
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-800/50">
                  All caught up
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllRead}
                  className="text-[11px] text-amber-300 hover:text-white flex items-center gap-1 font-semibold transition"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-amber-400 hover:text-white p-1 rounded-lg transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-amber-950/60">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-amber-200/50">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-30 text-amber-400" />
                <p>No notifications yet</p>
                <span className="text-[10px] text-amber-300/40">Real-time alerts for orders, transfers, and inventory appear here.</span>
              </div>
            ) : (
              notifications.map((notif) => {
                const isUnread = !notif.is_read;
                return (
                  <div
                    key={notif.id}
                    onClick={() => {
                      if (onSelectNotification) onSelectNotification(notif);
                      if (isUnread) onMarkRead(notif.id);
                    }}
                    className={`p-3 transition cursor-pointer hover:bg-amber-900/30 ${getPriorityStyle(notif.priority)} ${
                      isUnread ? 'bg-amber-950/60' : 'opacity-80'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5">{getIcon(notif.notification_type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className={`font-bold truncate text-[11px] ${isUnread ? 'text-white' : 'text-amber-200/80'}`}>
                            {notif.title}
                          </span>
                          <span className="text-[9px] text-amber-300/50 font-mono shrink-0 flex items-center gap-0.5">
                            <Clock className="w-2.5 h-2.5" />
                            {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-100/70 mt-0.5 line-clamp-2 leading-relaxed">
                          {notif.message}
                        </p>
                        {notif.related_order_number && (
                          <div className="mt-1 flex items-center justify-between">
                            <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-950 px-1.5 py-0.5 rounded border border-amber-900/60">
                              Order #{notif.related_order_number}
                            </span>
                            {isUnread && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onMarkRead(notif.id);
                                }}
                                className="text-[10px] text-amber-300/80 hover:text-white flex items-center gap-0.5"
                              >
                                <Check className="w-3 h-3" /> Mark read
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
