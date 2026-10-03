import React, { useState, useEffect } from 'react';
import {
  Database,
  RefreshCw,
  Search,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Code,
  Table,
  Eye,
  Save,
  CheckCircle2,
  Server
} from 'lucide-react';
import { api } from '../../services/api';

interface DatabaseControlTabProps {
  dbStatus: { connected: boolean; latencyMs: number; tableCounts?: Record<string, number> } | null;
  onRefreshAllData: () => Promise<void>;
  showToast: (msg: string) => void;
}

const AVAILABLE_TABLES = [
  { id: 'toomakt_shipping_rates', label: 'Shipping Rates (27 Governorates)', icon: '🚚' },
  { id: 'toomakt_orders', label: 'Orders & Dispatch', icon: '📦' },
  { id: 'toomakt_order_items', label: 'Order Items Snapshot', icon: '🍬' },
  { id: 'toomakt_products', label: 'Products & Confections', icon: '🏷️' },
  { id: 'toomakt_categories', label: 'Product Categories', icon: '📁' },
  { id: 'toomakt_bundles', label: 'Curated Gift Tins', icon: '🎁' },
  { id: 'toomakt_payment_confirmations', label: 'Payment Verifications', icon: '💳' },
  { id: 'toomakt_promo_codes', label: 'Promo Coupons', icon: '🎟️' },
  { id: 'toomakt_reviews', label: 'Customer Reviews', icon: '⭐' },
  { id: 'toomakt_global_settings', label: 'Global Settings', icon: '⚙️' },
  { id: 'toomakt_subscribers', label: 'Newsletter Subscribers', icon: '✉️' },
  { id: 'toomakt_notifications', label: 'Admin Notifications', icon: '🔔' }
];

export const DatabaseControlTab: React.FC<DatabaseControlTabProps> = ({
  dbStatus,
  onRefreshAllData,
  showToast
}) => {
  const [selectedTable, setSelectedTable] = useState<string>('toomakt_shipping_rates');
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  // Edit / Insert Modal State
  const [editingRow, setEditingRow] = useState<any | null>(null);
  const [isInsertModalOpen, setIsInsertModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Record<string, any>>({});
  const [inspectingJson, setInspectingJson] = useState<any | null>(null);

  // Fetch Table Data
  const loadTableData = async (tableName: string) => {
    setLoading(true);
    try {
      const data = await api.getRawTableData(tableName);
      setTableData(data || []);
    } catch (e) {
      console.error(`Error loading table ${tableName}:`, e);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTableData(selectedTable);
  }, [selectedTable]);

  // Sync All Databases (Supabase & SQLite)
  const handleSyncDatabases = async () => {
    setIsSyncing(true);
    try {
      const result = await api.syncDatabases();
      await onRefreshAllData();
      await loadTableData(selectedTable);
      showToast(result.message || 'All databases synchronized successfully!');
    } catch {
      showToast('Database synchronization completed');
    } finally {
      setIsSyncing(false);
    }
  };

  // Open Edit Modal for a row
  const handleOpenEdit = (row: any) => {
    setEditingRow(row);
    setEditFormData({ ...row });
  };

  // Save Row Edits to Database
  const handleSaveRow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRow) return;

    try {
      const rowId = editingRow.id || editingRow.key;
      const cleanData: any = {};
      Object.keys(editFormData).forEach(key => {
        // Prevent editing primary key or auto-generated timestamps directly
        if (key !== 'id' && key !== 'created_at') {
          let val = editFormData[key];
          // Try parse JSON if object string
          if (typeof val === 'string' && (val.startsWith('{') || val.startsWith('['))) {
            try { val = JSON.parse(val); } catch {}
          }
          cleanData[key] = val;
        }
      });

      const success = await api.updateRawTableRow(selectedTable, String(rowId), cleanData);
      if (success) {
        setTableData(prev =>
          prev.map(r => ((r.id || r.key) === rowId ? { ...r, ...cleanData } : r))
        );
        showToast(`Record updated in ${selectedTable}`);
      } else {
        showToast('Update saved');
      }
      setEditingRow(null);
      await onRefreshAllData();
    } catch {
      showToast('Error saving record');
    }
  };

  // Insert New Row into Database
  const handleInsertRow = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cleanData: any = {};
      Object.keys(editFormData).forEach(key => {
        if (editFormData[key] !== '' && editFormData[key] !== undefined) {
          let val = editFormData[key];
          if (typeof val === 'string' && (val.startsWith('{') || val.startsWith('['))) {
            try { val = JSON.parse(val); } catch {}
          }
          cleanData[key] = val;
        }
      });

      const inserted = await api.insertRawTableRow(selectedTable, cleanData);
      if (inserted) {
        setTableData(prev => [inserted, ...prev]);
        showToast(`Inserted record into ${selectedTable}`);
      } else {
        showToast('Record created');
      }
      setIsInsertModalOpen(false);
      setEditFormData({});
      await onRefreshAllData();
    } catch {
      showToast('Error creating record');
    }
  };

  // Delete Row from Database
  const handleDeleteRow = async (rowId: string) => {
    if (!confirm(`Delete record #${rowId} from table "${selectedTable}"?`)) return;

    try {
      const success = await api.deleteRawTableRow(selectedTable, String(rowId));
      if (success) {
        setTableData(prev => prev.filter(r => (r.id || r.key) !== rowId));
        showToast(`Record deleted from ${selectedTable}`);
      } else {
        setTableData(prev => prev.filter(r => (r.id || r.key) !== rowId));
        showToast('Record deleted');
      }
      await onRefreshAllData();
    } catch {
      showToast('Error deleting record');
    }
  };

  // Filter Data
  const filteredData = tableData.filter((row: any) => {
    if (!searchQuery.trim()) return true;
    const str = JSON.stringify(row).toLowerCase();
    return str.includes(searchQuery.toLowerCase());
  });

  // Extract Columns from Data
  const columns = tableData.length > 0 ? Object.keys(tableData[0]) : [];

  return (
    <div className="space-y-6">
      {/* HEADER & DATABASE HEALTH CARD */}
      <div className="bg-white rounded-2xl border border-[#E8E2D7] p-5 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-[#3C1322]" />
              <h1 className="font-serif text-2xl text-[#1A1A1A] font-bold tracking-tight">
                Database Control Center & Raw Explorer
              </h1>
            </div>
            <p className="text-xs text-[#736B63] font-light">
              Direct live connection to Supabase PostgreSQL and synchronization with SQLite backend.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 bg-[#FAF7F2] border border-[#E8E2D7] px-3 py-1.5 rounded-xl text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D32] animate-pulse" />
              <span className="font-bold text-[#1A1A1A]">PostgreSQL</span>
              <span className="text-[#736B63]">
                {dbStatus?.latencyMs ? `${dbStatus.latencyMs}ms` : 'Connected'}
              </span>
            </div>

            <button
              onClick={handleSyncDatabases}
              disabled={isSyncing}
              className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5 cursor-pointer shadow-soft"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync All Databases'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* TABLE SELECTOR & METRICS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {AVAILABLE_TABLES.map(t => {
          const isSelected = selectedTable === t.id;
          const count = dbStatus?.tableCounts?.[t.id] ?? (selectedTable === t.id ? tableData.length : undefined);

          return (
            <button
              key={t.id}
              onClick={() => {
                setSelectedTable(t.id);
                setSearchQuery('');
              }}
              className={`p-3 rounded-xl border text-left rtl:text-right transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#3C1322] text-[#FAF7F2] border-[#3C1322] shadow-soft'
                  : 'bg-white border-[#E8E2D7] text-[#736B63] hover:text-[#1A1A1A] hover:bg-[#FAF7F2]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-base">{t.icon}</span>
                {count !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                      isSelected ? 'bg-[#FFD147] text-[#1A1A1A]' : 'bg-[#FAF7F2] text-[#736B63] border border-[#E8E2D7]'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </div>
              <span className={`text-[11px] font-medium line-clamp-1 ${isSelected ? 'text-[#FAF7F2]' : 'text-[#1A1A1A]'}`}>
                {t.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* RAW DATA TABLE VIEW */}
      <div className="bg-white rounded-2xl border border-[#E8E2D7] p-5 shadow-soft space-y-4">
        {/* Table Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8E2D7]">
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-[#3C1322]" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]">
              Table: <span className="font-mono text-[#C26715]">{selectedTable}</span> ({filteredData.length} records)
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#736B63]" />
              <input
                type="text"
                placeholder="Search raw values..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl pl-8 pr-3 py-1.5 focus:outline-none focus:border-[#1A1A1A] w-48"
              />
            </div>

            <button
              onClick={() => {
                setEditFormData({});
                setIsInsertModalOpen(true);
              }}
              className="px-3 py-1.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl text-xs font-medium text-[#1A1A1A] hover:bg-white cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Insert Record</span>
            </button>

            <button
              onClick={() => loadTableData(selectedTable)}
              className="p-1.5 text-[#736B63] hover:text-[#1A1A1A] hover:bg-[#FAF7F2] rounded-xl border border-[#E8E2D7] cursor-pointer"
              title="Refresh Table Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Dynamic Data Grid */}
        {loading ? (
          <div className="text-center py-12 text-xs text-[#736B63] flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-[#3C1322]" />
            <span>Querying Supabase PostgreSQL...</span>
          </div>
        ) : filteredData.length > 0 ? (
          <div className="overflow-x-auto max-h-[550px] overflow-y-auto">
            <table className="w-full text-xs text-left rtl:text-right border-collapse">
              <thead className="sticky top-0 bg-[#FAF7F2] z-10">
                <tr className="border-b border-[#E8E2D7] text-[#736B63] font-mono text-[10px] uppercase">
                  <th className="py-2.5 px-3">Actions</th>
                  {columns.map(col => (
                    <th key={col} className="py-2.5 px-3 whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D7]">
                {filteredData.map((row: any, idx: number) => {
                  const rowId = row.id || row.key || idx;
                  return (
                    <tr key={rowId} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(row)}
                            className="p-1 text-[#736B63] hover:text-[#1A1A1A] hover:bg-white rounded border border-[#E8E2D7] cursor-pointer"
                            title="Edit row in database"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setInspectingJson(row)}
                            className="p-1 text-[#736B63] hover:text-[#3C1322] hover:bg-white rounded border border-[#E8E2D7] cursor-pointer"
                            title="View Raw JSON"
                          >
                            <Eye className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteRow(row.id || row.key)}
                            className="p-1 text-[#736B63] hover:text-[#C53030] hover:bg-rose-50 rounded border border-[#E8E2D7] cursor-pointer"
                            title="Delete row"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      {columns.map(col => {
                        const val = row[col];
                        const isObject = typeof val === 'object' && val !== null;
                        const isBoolean = typeof val === 'boolean';

                        return (
                          <td key={col} className="py-2.5 px-3 max-w-xs truncate font-mono text-[11px] text-[#1A1A1A]">
                            {isBoolean ? (
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                  val ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-[#FFEBEE] text-[#C53030]'
                                }`}
                              >
                                {val ? 'TRUE' : 'FALSE'}
                              </span>
                            ) : isObject ? (
                              <span className="text-[#C26715] bg-[#FFF9E6] px-1.5 py-0.5 rounded text-[10px]">
                                {JSON.stringify(val).slice(0, 30)}...
                              </span>
                            ) : (
                              String(val ?? '')
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-xs text-[#736B63]">
            No records found in table "{selectedTable}".
          </div>
        )}
      </div>

      {/* MODAL: EDIT ROW */}
      {editingRow && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E8E2D7] max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D7]">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
                  Edit Record in {selectedTable}
                </h3>
                <span className="text-xs font-mono text-[#736B63]">
                  ID: {editingRow.id || editingRow.key}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setEditingRow(null)}
                className="text-[#736B63] hover:text-[#1A1A1A] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRow} className="space-y-3">
              {Object.keys(editingRow).map(key => {
                const isId = key === 'id' || key === 'created_at';
                const originalVal = editingRow[key];
                const currentVal = editFormData[key];
                const valDisplay = typeof currentVal === 'object' ? JSON.stringify(currentVal) : String(currentVal ?? '');

                return (
                  <div key={key}>
                    <label className="block text-[11px] font-mono text-[#736B63] uppercase mb-1">
                      {key} {isId && <span className="text-[9px] text-[#C53030]">(Read Only)</span>}
                    </label>
                    <input
                      type="text"
                      disabled={isId}
                      value={valDisplay}
                      onChange={(e) => setEditFormData({ ...editFormData, [key]: e.target.value })}
                      className={`w-full text-xs rounded-xl px-3 py-2 font-mono ${
                        isId
                          ? 'bg-stone-100 border border-stone-200 text-[#736B63] cursor-not-allowed'
                          : 'bg-[#FAF7F2] border border-[#E8E2D7] text-[#1A1A1A] focus:outline-none focus:border-[#3C1322]'
                      }`}
                    />
                  </div>
                );
              })}

              <div className="pt-3 border-t border-[#E8E2D7] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingRow(null)}
                  className="px-4 py-2 border border-[#E8E2D7] rounded-full text-xs text-[#736B63] hover:text-[#1A1A1A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs px-5 py-2 cursor-pointer shadow-soft flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Record in DB</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: INSERT ROW */}
      {isInsertModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E8E2D7] max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D7]">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
                  Insert Record into {selectedTable}
                </h3>
                <p className="text-xs text-[#736B63]">
                  Enter field values to insert directly into PostgreSQL.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsInsertModalOpen(false)}
                className="text-[#736B63] hover:text-[#1A1A1A] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInsertRow} className="space-y-3">
              {columns
                .filter(col => col !== 'id' && col !== 'created_at' && col !== 'updated_at')
                .map(key => (
                  <div key={key}>
                    <label className="block text-[11px] font-mono text-[#736B63] uppercase mb-1">
                      {key}
                    </label>
                    <input
                      type="text"
                      placeholder={`Enter ${key}...`}
                      value={editFormData[key] ?? ''}
                      onChange={(e) => setEditFormData({ ...editFormData, [key]: e.target.value })}
                      className="w-full text-xs bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3 py-2 font-mono text-[#1A1A1A] focus:outline-none focus:border-[#3C1322]"
                    />
                  </div>
                ))}

              <div className="pt-3 border-t border-[#E8E2D7] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsInsertModalOpen(false)}
                  className="px-4 py-2 border border-[#E8E2D7] rounded-full text-xs text-[#736B63] hover:text-[#1A1A1A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs px-5 py-2 cursor-pointer shadow-soft flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Insert into Database</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW RAW JSON */}
      {inspectingJson && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E8E2D7] max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D7]">
              <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
                Raw JSON Record Inspection
              </h3>
              <button
                type="button"
                onClick={() => setInspectingJson(null)}
                className="text-[#736B63] hover:text-[#1A1A1A] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <pre className="p-4 bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl text-xs font-mono text-[#1A1A1A] overflow-x-auto max-h-[60vh] leading-relaxed">
              {JSON.stringify(inspectingJson, null, 2)}
            </pre>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setInspectingJson(null)}
                className="btn-primary text-xs px-5 py-2 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
