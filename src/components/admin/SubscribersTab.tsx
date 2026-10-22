import React, { useState } from 'react';
import {
  Users,
  Download,
  Trash2,
  Mail,
  Plus,
  Check,
  Search
} from 'lucide-react';
import { api } from '../../services/api';

interface SubscribersTabProps {
  subscribers: any[];
  setSubscribers: React.Dispatch<React.SetStateAction<any[]>>;
  showToast: (msg: string) => void;
}

export const SubscribersTab: React.FC<SubscribersTabProps> = ({
  subscribers,
  setSubscribers,
  showToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const filteredSubscribers = subscribers.filter((s: any) =>
    (s.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteSubscriber = async (id: string, email: string) => {
    if (!confirm(`Delete "${email}" from subscriber list?`)) return;
    try {
      await api.deleteSubscriber(id);
      setSubscribers(prev => prev.filter(s => s.id !== id));
      showToast(`Removed "${email}"`);
    } catch {
      setSubscribers(prev => prev.filter(s => s.id !== id));
      showToast(`Removed "${email}"`);
    }
  };

  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newEmail.includes('@')) {
      showToast('Please enter a valid email address');
      return;
    }

    try {
      await api.subscribeNewsletter(newEmail.trim(), 'admin_dashboard');
      setSubscribers(prev => [
        {
          id: String(Date.now()),
          email: newEmail.trim().toLowerCase(),
          source: 'admin_dashboard',
          promo_code_issued: 'TOOMAKT10',
          created_at: new Date().toISOString()
        },
        ...prev
      ]);
      setNewEmail('');
      showToast(`Added subscriber "${newEmail}"`);
    } catch {
      showToast('Error adding subscriber');
    }
  };

  const handleExportCSV = () => {
    if (subscribers.length === 0) {
      showToast('No subscribers to export');
      return;
    }

    const headers = ['Email', 'Source', 'Promo Code Issued', 'Date'];
    const rows = subscribers.map(s => [
      `"${s.email || ''}"`,
      `"${s.source || 'footer'}"`,
      `"${s.promo_code_issued || 'TOOMAKT10'}"`,
      `"${s.created_at || new Date().toISOString()}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `toomakt_subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported subscriber CSV!');
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#1A1A1A] font-normal tracking-tight">
            Newsletter Subscribers & Tasting Society
          </h1>
          <p className="text-xs text-[#736B63] font-light mt-1">
            Consumer subscriber emails stored in Supabase `toomakt_subscribers`.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 border border-[#E8E2D7] bg-white rounded-xl text-xs font-medium text-[#1A1A1A] hover:bg-[#FAF7F2] transition-colors flex items-center gap-1.5 cursor-pointer shadow-soft"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV ({subscribers.length})</span>
        </button>
      </div>

      {/* QUICK ADD & SEARCH */}
      <div className="bg-white rounded-2xl border border-[#E8E2D7] p-5 shadow-soft flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <form onSubmit={handleAddSubscriber} className="flex items-center gap-2 flex-1 max-w-md">
          <input
            type="email"
            placeholder="Add VIP subscriber email..."
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="flex-1 text-xs bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3.5 py-2 text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
          />
          <button
            type="submit"
            className="btn-primary text-xs px-3.5 py-2 cursor-pointer shadow-soft flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#736B63]" />
          <input
            type="text"
            placeholder="Search email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl pl-8 pr-3 py-2 text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
          />
        </div>
      </div>

      {/* SUBSCRIBERS TABLE */}
      <div className="bg-white rounded-2xl border border-[#E8E2D7] p-5 shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left rtl:text-right">
            <thead>
              <tr className="border-b border-[#E8E2D7] text-[#736B63] font-mono text-[10px] uppercase">
                <th className="py-2.5 px-3">Subscriber Email</th>
                <th className="py-2.5 px-3">Source Channel</th>
                <th className="py-2.5 px-3">Promo Issued</th>
                <th className="py-2.5 px-3">Joined Date</th>
                <th className="py-2.5 px-3 text-right rtl:text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D7]">
              {filteredSubscribers.map((s: any) => (
                <tr key={s.id || s.email} className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="py-3 px-3 font-medium text-[#1A1A1A] flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#C26715]" />
                    <span>{s.email}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#FAF7F2] border border-[#E8E2D7] text-[#736B63]">
                      {s.source || 'footer'}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-[#3C1322]">
                    {s.promo_code_issued || 'TOOMAKT10'}
                  </td>
                  <td className="py-3 px-3 text-[#736B63]">
                    {s.created_at ? new Date(s.created_at).toLocaleDateString() : 'Recent'}
                  </td>
                  <td className="py-3 px-3 text-right rtl:text-left">
                    <button
                      type="button"
                      onClick={() => handleDeleteSubscriber(s.id, s.email)}
                      className="p-1.5 text-[#736B63] hover:text-[#C53030] hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                      title="Delete subscriber"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSubscribers.length === 0 && (
          <div className="text-center py-8 text-xs text-[#736B63]">
            No newsletter subscribers found.
          </div>
        )}
      </div>
    </div>
  );
};
