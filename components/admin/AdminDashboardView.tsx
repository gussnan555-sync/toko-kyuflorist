'use client';

import React, { useState } from 'react';
import { useAdmin, AdminOrder } from '@/context/AdminContext';
import {
  LayoutDashboard, ShoppingBag, Users, Package, LogOut,
  TrendingUp, RefreshCw, Search, Filter, ChevronDown,
  CheckCircle2, Clock, Truck, XCircle, Banknote, Eye,
  Flower2, AlertCircle, X, Pencil, Trash2,
  ChevronRight, Menu, Bell, Plus, Save, ImagePlus, Palette, Tags
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type AdminTab = 'dashboard' | 'orders' | 'customers' | 'products' | 'categories' | 'payments';

const formatRupiahInput = (value: string | number) => {
  const digits = String(value).replace(/\D/g, '');
  return digits ? `Rp ${Number(digits).toLocaleString('id-ID')}` : '';
};

const rupiahValue = (value: string | number) => Number(String(value).replace(/\D/g, '')) || 0;

// ─── Sidebar ─────────────────────────────────────────────────────────────────
interface SidebarProps {
  activeTab: AdminTab;
  setActiveTab: (t: AdminTab) => void;
  adminEmail: string;
  onSignOut: () => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}

function Sidebar({ activeTab, setActiveTab, adminEmail, onSignOut, collapsed, setCollapsed, mobileOpen, setMobileOpen }: SidebarProps) {
  const navItems: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'orders', label: 'Pesanan', icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'customers', label: 'Pelanggan', icon: <Users className="w-5 h-5" /> },
    { id: 'products', label: 'Produk', icon: <Package className="w-5 h-5" /> },
    { id: 'categories', label: 'Kategori', icon: <Tags className="w-5 h-5" /> },
    { id: 'payments', label: 'Pembayaran', icon: <Banknote className="w-5 h-5" /> },
  ];

  return (
    <aside className={`fixed left-0 top-0 h-full bg-slate-900 border-r border-slate-700/60 flex flex-col transition-all duration-300 z-40 ${collapsed ? 'w-16' : 'w-60'} ${mobileOpen ? 'max-lg:translate-x-0' : 'max-lg:-translate-x-full'}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-700/60">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shrink-0 shadow-md shadow-pink-500/30">
          <Flower2 className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-white font-bold text-sm leading-tight">KyuFlorist</p>
            <p className="text-pink-400 text-[10px] font-medium">Admin Panel</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-slate-500 hover:text-slate-300 transition-colors"
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => { setActiveTab(item.id); setMobileOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === item.id
                ? 'bg-gradient-to-r from-pink-500/20 to-rose-500/10 text-pink-400 border border-pink-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
            {!collapsed && activeTab === item.id && <ChevronRight className="w-4 h-4 ml-auto text-pink-400" />}
          </button>
        ))}
      </nav>

      {/* User Info + Sign Out */}
      <div className="p-3 border-t border-slate-700/60">
        {!collapsed && (
          <div className="mb-2 px-2">
            <p className="text-[11px] text-slate-500 truncate">{adminEmail}</p>
          </div>
        )}
        <button
          onClick={onSignOut}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 text-sm transition-all ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Keluar</span>}
        </button>
      </div>
    </aside>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon, color }: {
  label: string; value: string; sub?: string;
  icon: React.ReactNode; color: string;
}) {
  return (
    <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5 flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-slate-400 text-xs font-medium">{label}</p>
        <p className="text-white text-xl font-bold mt-0.5 truncate">{value}</p>
        {sub && <p className="text-slate-500 text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
const ORDER_STATUS_META: Record<string, { color: string; icon: React.ReactNode }> = {
  'Menunggu Pembayaran': { color: 'bg-amber-500/15 text-amber-400 border-amber-500/20', icon: <Clock className="w-3 h-3" /> },
  'Diproses': { color: 'bg-blue-500/15 text-blue-400 border-blue-500/20', icon: <RefreshCw className="w-3 h-3" /> },
  'Sedang Dirangkai': { color: 'bg-violet-500/15 text-violet-400 border-violet-500/20', icon: <Flower2 className="w-3 h-3" /> },
  'Dalam Pengiriman': { color: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20', icon: <Truck className="w-3 h-3" /> },
  'Selesai': { color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', icon: <CheckCircle2 className="w-3 h-3" /> },
  'Dibatalkan': { color: 'bg-rose-500/15 text-rose-400 border-rose-500/20', icon: <XCircle className="w-3 h-3" /> },
};

function StatusBadge({ status }: { status: string }) {
  const meta = ORDER_STATUS_META[status] ?? { color: 'bg-slate-500/15 text-slate-400 border-slate-500/20', icon: <AlertCircle className="w-3 h-3" /> };
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${meta.color}`}>
      {meta.icon}{status}
    </span>
  );
}

const PAYMENT_STATUS_META: Record<string, string> = {
  'Belum Bayar': 'bg-red-500/15 text-red-400 border-red-500/20',
  'Sudah Transfer': 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  'Terverifikasi': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
};

function PaymentBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${PAYMENT_STATUS_META[status] ?? 'bg-slate-500/15 text-slate-400 border-slate-500/20'}`}>
      <Banknote className="w-3 h-3" />{status}
    </span>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');
const fmtDate = (s: string) => new Date(s).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

// ─── Order Detail Modal ───────────────────────────────────────────────────────
function OrderDetailModal({ order, onClose, onUpdateStatus }: {
  order: AdminOrder;
  onClose: () => void;
  onUpdateStatus: (id: string, status: string, pay?: string) => Promise<{ success: boolean }>;
}) {
  const [status, setStatus] = useState(order.status);
  const [payStatus, setPayStatus] = useState(order.paymentStatus);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onUpdateStatus(order.id, status, payStatus);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-700">
          <div>
            <p className="text-white font-bold text-base">#{order.orderNumber}</p>
            <p className="text-slate-400 text-xs mt-0.5">{fmtDate(order.createdAt)}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-700 text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Customer & Recipient */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700/40 rounded-xl p-4">
              <p className="text-slate-400 text-[11px] font-semibold uppercase tracking-wide mb-2">Pelanggan</p>
              <p className="text-white text-sm font-semibold">{order.customerName || '-'}</p>
              <p className="text-slate-400 text-xs">{order.customerEmail}</p>
            </div>
            <div className="bg-slate-700/40 rounded-xl p-4">
              <p className="text-slate-400 text-[11px] font-semibold uppercase tracking-wide mb-2">Penerima</p>
              <p className="text-white text-sm font-semibold">{order.recipientName}</p>
              <p className="text-slate-400 text-xs">{order.recipientPhone}</p>
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-slate-700/40 rounded-xl p-4">
            <p className="text-slate-400 text-[11px] font-semibold uppercase tracking-wide mb-2">Alamat Pengiriman</p>
            <p className="text-white text-sm">{order.fullAddress}</p>
            <p className="text-slate-400 text-xs mt-1">{order.districtCity}, {order.postalCode}</p>
            {order.shippingNotes && <p className="text-amber-400 text-xs mt-1">Catatan: {order.shippingNotes}</p>}
            <div className="mt-2 flex gap-2 flex-wrap">
              <span className="text-[11px] bg-slate-600/50 text-slate-300 px-2 py-0.5 rounded-full">{order.shippingMethod}</span>
              <span className="text-[11px] bg-slate-600/50 text-slate-300 px-2 py-0.5 rounded-full">{order.branch}</span>
            </div>
          </div>

          {/* Items */}
          <div>
            <p className="text-slate-400 text-[11px] font-semibold uppercase tracking-wide mb-2">Item Pesanan</p>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="bg-slate-700/40 rounded-xl p-3 flex gap-3 items-start">
                  {item.productImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.productImage} alt={item.productName} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-sm font-medium truncate">{item.productName}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.colorName} · {item.size} · x{item.quantity}</p>
                    {item.greetingCardText && (
                      <p className="text-pink-400 text-[11px] mt-1 italic">&ldquo;{item.greetingCardText}&rdquo;</p>
                    )}
                  </div>
                  <p className="text-white text-sm font-semibold shrink-0">{fmt(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-slate-700/40 rounded-xl p-4">
            <p className="text-slate-400 text-[11px] font-semibold uppercase tracking-wide mb-3">Pembayaran</p>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal</span><span>{fmt(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Ongkir</span><span>{order.shippingCost > 0 ? fmt(order.shippingCost) : 'Gratis'}</span>
              </div>
              <div className="flex justify-between text-white font-bold border-t border-slate-600 pt-1.5 mt-1.5">
                <span>Total</span><span className="text-pink-400">{fmt(order.totalAmount)}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Bank: {order.paymentBank?.bankName} · {order.paymentBank?.accountNumber}
              </p>
            </div>
          </div>

          {/* Status Editor */}
          <div className="bg-slate-700/40 rounded-xl p-4 space-y-3">
            <p className="text-slate-400 text-[11px] font-semibold uppercase tracking-wide">Update Status</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Status Pesanan</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                >
                  {Object.keys(ORDER_STATUS_META).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Status Pembayaran</label>
                <select
                  value={payStatus}
                  onChange={e => setPayStatus(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                >
                  {Object.keys(PAYMENT_STATUS_META).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 hover:from-pink-400 hover:to-rose-500 transition disabled:opacity-60"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard Tab ────────────────────────────────────────────────────────────
function DashboardTab() {
  const { allOrders, allProfiles, isDataLoading, fetchAllData } = useAdmin();

  const totalRevenue = allOrders.filter(o => o.status !== 'Dibatalkan').reduce((s, o) => s + o.totalAmount, 0);
  const pendingOrders = allOrders.filter(o => o.status === 'Menunggu Pembayaran').length;
  const completedOrders = allOrders.filter(o => o.status === 'Selesai').length;
  const processingOrders = allOrders.filter(o => !['Selesai', 'Dibatalkan', 'Menunggu Pembayaran'].includes(o.status)).length;
  const recentOrders = allOrders.slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-xl font-bold">Dashboard</h2>
          <p className="text-slate-400 text-sm mt-0.5">Ringkasan performa toko</p>
        </div>
        <button onClick={fetchAllData} disabled={isDataLoading}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-700 border border-slate-600 px-4 py-2 rounded-xl transition">
          <RefreshCw className={`w-4 h-4 ${isDataLoading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Pendapatan" value={fmt(totalRevenue)}
          sub={`${allOrders.filter(o => o.status !== 'Dibatalkan').length} pesanan valid`}
          icon={<TrendingUp className="w-5 h-5 text-emerald-400" />} color="bg-emerald-500/15" />
        <StatCard label="Menunggu Bayar" value={String(pendingOrders)} sub="Perlu dikonfirmasi"
          icon={<Clock className="w-5 h-5 text-amber-400" />} color="bg-amber-500/15" />
        <StatCard label="Sedang Diproses" value={String(processingOrders)} sub="Sedang berjalan"
          icon={<Truck className="w-5 h-5 text-blue-400" />} color="bg-blue-500/15" />
        <StatCard label="Total Pelanggan" value={String(allProfiles.length)}
          sub={`${completedOrders} pesanan selesai`}
          icon={<Users className="w-5 h-5 text-violet-400" />} color="bg-violet-500/15" />
      </div>

      {/* Status Distribution */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {Object.entries(ORDER_STATUS_META).map(([status, meta]) => {
          const count = allOrders.filter(o => o.status === status).length;
          return (
            <div key={status} className={`flex items-center gap-3 p-3 rounded-xl border ${meta.color} bg-slate-800/50`}>
              <span className="text-lg">{meta.icon}</span>
              <div>
                <p className="text-[11px] font-semibold">{status}</p>
                <p className="text-lg font-bold">{count}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-slate-800 border border-slate-700/60 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-700/60">
          <h3 className="text-white font-semibold text-sm flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-pink-400" /> Pesanan Terbaru
          </h3>
          <span className="text-xs text-slate-500">{recentOrders.length} dari {allOrders.length}</span>
        </div>
        {isDataLoading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-6 h-6 text-pink-400 animate-spin" />
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">Belum ada pesanan</div>
        ) : (
          <div className="divide-y divide-slate-700/40">
            {recentOrders.map(order => (
              <div key={order.id} className="flex items-center gap-4 p-4 hover:bg-slate-700/20 transition">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white text-sm font-semibold">#{order.orderNumber}</span>
                    <StatusBadge status={order.status} />
                    <PaymentBadge status={order.paymentStatus} />
                  </div>
                  <p className="text-slate-400 text-xs mt-0.5 truncate">{order.customerName || order.customerEmail}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-white text-sm font-semibold">{fmt(order.totalAmount)}</p>
                  <p className="text-slate-500 text-[11px]">{fmtDate(order.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Orders Tab ───────────────────────────────────────────────────────────────
function OrdersTab() {
  const { allOrders, isDataLoading, fetchAllData, updateOrderStatus, deleteOrder } = useAdmin();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPayment, setFilterPayment] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = allOrders.filter(o => {
    const q = search.toLowerCase();
    const matchSearch = !search || o.orderNumber.toLowerCase().includes(q)
      || o.customerEmail.toLowerCase().includes(q) || o.recipientName.toLowerCase().includes(q);
    const matchStatus = filterStatus === 'All' || o.status === filterStatus;
    const matchPay = filterPayment === 'All' || o.paymentStatus === filterPayment;
    return matchSearch && matchStatus && matchPay;
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus pesanan ini? Tindakan tidak bisa dibatalkan.')) return;
    setDeletingId(id);
    await deleteOrder(id);
    setDeletingId(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-xl font-bold">Manajemen Pesanan</h2>
          <p className="text-slate-400 text-sm mt-0.5">{filtered.length} dari {allOrders.length} pesanan</p>
        </div>
        <button onClick={fetchAllData} disabled={isDataLoading}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-700 border border-slate-600 px-4 py-2 rounded-xl transition">
          <RefreshCw className={`w-4 h-4 ${isDataLoading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari order, email, nama..."
            className="w-full bg-slate-800 border border-slate-700 text-white text-sm pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/40 placeholder-slate-500" />
        </div>
        <div className="relative">
          <Filter className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-300 text-sm pl-8 pr-8 py-2.5 rounded-xl focus:outline-none appearance-none">
            <option value="All">Semua Status</option>
            {Object.keys(ORDER_STATUS_META).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        <div className="relative">
          <Banknote className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <select value={filterPayment} onChange={e => setFilterPayment(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-300 text-sm pl-8 pr-8 py-2.5 rounded-xl focus:outline-none appearance-none">
            <option value="All">Semua Pembayaran</option>
            {Object.keys(PAYMENT_STATUS_META).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-800 border border-slate-700/60 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/60">
                {['Order', 'Pelanggan', 'Status Pesanan', 'Pembayaran', 'Total', 'Aksi'].map(h => (
                  <th key={h} className={`text-xs font-semibold text-slate-500 px-4 py-3 uppercase tracking-wide ${h === 'Total' || h === 'Aksi' ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40">
              {isDataLoading ? (
                <tr><td colSpan={6} className="text-center py-12 text-slate-500"><RefreshCw className="w-5 h-5 animate-spin inline" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-slate-500 text-sm">Tidak ada pesanan ditemukan</td></tr>
              ) : filtered.map(order => (
                <tr key={order.id} className="hover:bg-slate-700/20 transition">
                  <td className="px-4 py-3">
                    <p className="text-white text-sm font-semibold">#{order.orderNumber}</p>
                    <p className="text-slate-500 text-[11px]">{fmtDate(order.createdAt)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-slate-200 text-sm">{order.customerName || '-'}</p>
                    <p className="text-slate-500 text-[11px] truncate max-w-[160px]">{order.customerEmail}</p>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                  <td className="px-4 py-3"><PaymentBadge status={order.paymentStatus} /></td>
                  <td className="px-4 py-3 text-right">
                    <p className="text-white text-sm font-semibold">{fmt(order.totalAmount)}</p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setSelectedOrder(order)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition" title="Lihat & Edit">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => setSelectedOrder(order)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition" title="Edit Status">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(order.id)} disabled={deletingId === order.id}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition" title="Hapus">
                        {deletingId === order.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onUpdateStatus={updateOrderStatus} />
      )}
    </div>
  );
}

// ─── Customers Tab ────────────────────────────────────────────────────────────
function CustomersTab() {
  const { allProfiles, allOrders, isDataLoading, fetchAllData } = useAdmin();
  const [search, setSearch] = useState('');

  const filtered = allProfiles.filter(p => {
    const q = search.toLowerCase();
    return !search || p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q) || p.phone.includes(q);
  });

  const getOrderCount = (uid: string) => allOrders.filter(o => o.userId === uid).length;
  const getTotalSpend = (uid: string) =>
    allOrders.filter(o => o.userId === uid && o.status !== 'Dibatalkan').reduce((s, o) => s + o.totalAmount, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-xl font-bold">Data Pelanggan</h2>
          <p className="text-slate-400 text-sm mt-0.5">{filtered.length} dari {allProfiles.length} pelanggan</p>
        </div>
        <button onClick={fetchAllData} disabled={isDataLoading}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-700 border border-slate-600 px-4 py-2 rounded-xl transition">
          <RefreshCw className={`w-4 h-4 ${isDataLoading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama, email, atau nomor hp..."
          className="w-full bg-slate-800 border border-slate-700 text-white text-sm pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/40 placeholder-slate-500" />
      </div>

      <div className="bg-slate-800 border border-slate-700/60 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/60">
                {['Pelanggan', 'Kontak', 'Lokasi', 'Pesanan', 'Total Belanja', 'Bergabung'].map((h, i) => (
                  <th key={h} className={`text-xs font-semibold text-slate-500 px-4 py-3 uppercase tracking-wide ${i >= 3 ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40">
              {isDataLoading ? (
                <tr><td colSpan={6} className="text-center py-12 text-slate-500"><RefreshCw className="w-5 h-5 animate-spin inline" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-slate-500 text-sm">Tidak ada pelanggan</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-700/20 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white text-sm font-bold shrink-0 overflow-hidden">
                        {p.avatarUrl
                          // eslint-disable-next-line @next/next/no-img-element
                          ? <img src={p.avatarUrl} alt={p.name} className="w-full h-full object-cover" />
                          : p.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{p.name}</p>
                        <p className="text-slate-500 text-[11px]">{p.id.slice(0, 12)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-slate-300 text-sm truncate max-w-[180px]">{p.email}</p>
                    <p className="text-slate-500 text-[11px]">{p.phone || '-'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-slate-300 text-xs truncate max-w-[160px]">{p.districtCity || '-'}</p>
                    <p className="text-slate-500 text-[11px]">{p.postalCode || '-'}</p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-white font-semibold">{getOrderCount(p.id)}</span>
                    <span className="text-slate-500 text-xs ml-1">pesanan</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <p className="text-emerald-400 font-semibold text-sm">{fmt(getTotalSpend(p.id))}</p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <p className="text-slate-400 text-xs">{fmtDate(p.createdAt)}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ProductEditor({ product, onClose }: { product?: import('@/types').Product; onClose: () => void }) {
  const { saveProduct, uploadProductImages, categories } = useAdmin();
  const [name, setName] = useState(product?.name ?? '');
  const [tagline, setTagline] = useState(product?.tagline ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [price, setPrice] = useState(String(product?.price ?? ''));
  const [discountPercent, setDiscountPercent] = useState(product?.originalPrice && product.price < product.originalPrice ? String(Math.round((1 - product.price / product.originalPrice) * 100)) : '');
  const [category, setCategory] = useState(product?.category ?? categories[0]?.name ?? '');
  const [stock, setStock] = useState(String(product?.stock ?? 0));
  const [existingImages, setExistingImages] = useState(product?.images ?? []);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [tags, setTags] = useState((product?.tags ?? []).join(', '));
  const [colors, setColors] = useState(product?.colors ?? [{ name: '', hex: '#FFB3C6', image: '', price: Number(product?.price ?? 0), stock: 0, isActive: true }]);
  const [variantFiles, setVariantFiles] = useState<Record<number, File>>({});
  const [showColors, setShowColors] = useState(product?.showColors !== false);
  const [showSizes, setShowSizes] = useState(product?.showSizes !== false);
  const [isBestSeller, setIsBestSeller] = useState(product?.isBestSeller ?? product?.tags.some(tag => tag.toLowerCase() === 'best seller') ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const inputClass = 'w-full bg-slate-900 border border-slate-600 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-500/40';
  const save = async () => {
    if (!name.trim() || !price || existingImages.length + newImages.length === 0) return;
    setSaving(true);
    setError('');
    const uploadResult = await uploadProductImages(newImages);
    if (!uploadResult.success || !uploadResult.urls) {
      setError(uploadResult.error ?? 'Foto gagal diunggah.');
      setSaving(false);
      return;
    }
    const imageList = [...existingImages, ...uploadResult.urls].slice(0, 10);
    const uploadedVariants = await Promise.all(colors.map(async (variant, index) => {
      const file = variantFiles[index];
      if (!file) return variant;
      const result = await uploadProductImages([file]);
      return result.urls?.[0] ? { ...variant, image: result.urls[0] } : variant;
    }));
    const numericPrice = rupiahValue(price);
    const numericDiscount = Math.min(90, Math.max(0, Number(discountPercent) || 0));
    if (uploadedVariants.some(variant => !variant.image)) {
      setError('Setiap varian wajib memiliki foto.');
      setSaving(false);
      return;
    }
    const result = await saveProduct({
      name: name.trim(), tagline, description, price: numericPrice,
      originalPrice: numericDiscount > 0 ? Math.round(numericPrice / (1 - numericDiscount / 100)) : undefined, category,
      image: imageList[0], images: imageList, colors: uploadedVariants.filter(color => color.name.trim()),
      tags: tags.split(',').map(value => value.trim()).filter(Boolean), stock: Number(stock) || 0,
      rating: product?.rating ?? 0, reviewsCount: product?.reviewsCount ?? 0,
      orderCount: product?.orderCount ?? 0, viewsCount: product?.viewsCount ?? 0, isBestSeller,
      showColors, showSizes,
    }, product?.id);
    setSaving(false);
    if (result.success) onClose();
    else setError(result.error ?? 'Produk gagal disimpan.');
  };

  const handleImageSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    const remainingSlots = 10 - existingImages.length;
    setNewImages(selected.slice(0, remainingSlots));
    setError(selected.length > remainingSlots ? `Maksimal 10 foto. ${remainingSlots} foto yang dipilih.` : '');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-700">
          <div><h3 className="text-white font-bold">{product ? 'Edit Produk' : 'Tambah Produk'}</h3><p className="text-slate-400 text-xs mt-1">Kelola detail, galeri, dan varian warna.</p></div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="sm:col-span-2 text-xs text-slate-400">Nama produk *<input autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="Contoh: Buket Mawar Pink" className={`${inputClass} mt-1`} /></label>
      <label className="text-xs text-slate-400">Harga jual *<input inputMode="numeric" value={formatRupiahInput(price)} onChange={e => setPrice(e.target.value.replace(/\D/g, ''))} placeholder="Rp 350.000" className={`${inputClass} mt-1`} /><span className="block text-[11px] text-slate-500 mt-1">Format otomatis Rupiah</span></label>
            <label className="text-xs text-slate-400">Stok tersedia *<input type="number" min="0" value={stock} onChange={e => setStock(e.target.value)} placeholder="Contoh: 10" className={`${inputClass} mt-1`} /></label>
            <label className="text-xs text-slate-400">Kategori<select value={category} onChange={e => setCategory(e.target.value)} className={`${inputClass} mt-1`}>{categories.map(item => <option key={item.id} value={item.name}>{item.name}</option>)}</select></label>
            <label className="text-xs text-slate-400 sm:col-span-2">Foto produk *<input type="file" accept="image/*" multiple onChange={handleImageSelection} disabled={existingImages.length >= 10} className={`${inputClass} mt-1 file:mr-3 file:border-0 file:bg-pink-500 file:text-white file:px-3 file:py-1.5 file:rounded-lg file:text-xs`} /><span className="block text-[11px] text-slate-500 mt-1">Pilih maksimal 10 foto. Setiap foto maksimal 5 MB.</span></label>
            {(existingImages.length > 0 || newImages.length > 0) && <div className="sm:col-span-2 grid grid-cols-2 sm:grid-cols-5 gap-2">{existingImages.map((image, index) => <div key={image} className="relative aspect-square rounded-lg overflow-hidden bg-slate-700"><img src={image} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" /><button type="button" onClick={() => setExistingImages(prev => prev.filter((_, imageIndex) => imageIndex !== index))} className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:bg-rose-500" title="Hapus foto"><X className="w-3 h-3" /></button></div>)}{newImages.map((file, index) => <div key={`${file.name}-${index}`} className="aspect-square rounded-lg bg-pink-500/10 border border-pink-500/30 p-2 flex flex-col justify-between"><ImagePlus className="w-5 h-5 text-pink-300" /><span className="text-[10px] text-slate-300 break-words line-clamp-3">{file.name}</span></div>)}</div>}
            <label className="sm:col-span-2 text-xs text-slate-400">Cerita singkat produk<textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Jelaskan isi atau keunggulan bunga ini" className={`${inputClass} mt-1 resize-y`} /></label>
          </div>

          <details className="border border-slate-700 rounded-xl">
            <summary className="cursor-pointer list-none px-4 py-3 text-sm text-slate-300 font-medium flex items-center justify-between">Pengaturan tambahan <ChevronDown className="w-4 h-4 text-slate-500" /></summary>
            <div className="p-4 pt-1 space-y-4 border-t border-slate-700">
              <label className="block text-xs text-slate-400">Kalimat pendek untuk produk<input value={tagline} onChange={e => setTagline(e.target.value)} placeholder="Contoh: Buket cantik untuk hadiah ulang tahun" className={`${inputClass} mt-1`} /></label>
              <label className="block text-xs text-slate-400">Diskon (%)<input type="number" min="0" max="90" value={discountPercent} onChange={e => setDiscountPercent(e.target.value)} placeholder="Contoh: 20" className={`${inputClass} mt-1`} /><span className="block text-[11px] text-slate-500 mt-1">Harga sebelum diskon dihitung otomatis</span></label>
              <label className="block text-xs text-slate-400">Label produk (pisahkan dengan koma)<input value={tags} onChange={e => setTags(e.target.value)} placeholder="Contoh: Best Seller, Wisuda" className={`${inputClass} mt-1`} /></label>
              <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={isBestSeller} onChange={e => setIsBestSeller(e.target.checked)} />Tampilkan emblem Best Seller</label>
              <div className="space-y-2 rounded-xl border border-slate-700 bg-slate-900/40 p-3">
                <p className="text-xs font-semibold text-slate-300">Pilihan di halaman produk</p>
                <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={showColors} onChange={e => setShowColors(e.target.checked)} />Tampilkan pilihan warna & foto varian</label>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2"><p className="text-xs text-slate-400 flex items-center gap-1"><Palette className="w-3.5 h-3.5" />Varian produk</p><button type="button" onClick={() => setColors(prev => [...prev, { name: '', hex: '#FFFFFF', image: '', price: Number(price) || 0, stock: 0, isActive: true }])} className="text-xs text-pink-400 hover:text-pink-300 flex items-center gap-1"><Plus className="w-3.5 h-3.5" />Tambah varian</button></div>
                <div className="space-y-3">{colors.map((variant, index) => <div key={index} className="rounded-xl border border-slate-700 bg-slate-900/50 p-3 space-y-3"><div className="flex items-center justify-between"><p className="text-xs font-semibold text-slate-300">Varian {String.fromCharCode(65 + index)}</p><button type="button" onClick={() => setColors(prev => prev.filter((_, i) => i !== index))} className="p-1 text-slate-500 hover:text-rose-400" title="Hapus varian"><Trash2 className="w-4 h-4" /></button></div><div className="grid sm:grid-cols-3 gap-3"><label className="block text-[11px] text-slate-400">Nama varian<input value={variant.name} onChange={e => setColors(prev => prev.map((item, i) => i === index ? { ...item, name: e.target.value } : item))} placeholder="Contoh: Pink" className={`${inputClass} mt-1`} /></label><label className="block text-[11px] text-slate-400">Harga varian<input type="number" min="0" value={variant.price ?? ''} onChange={e => setColors(prev => prev.map((item, i) => i === index ? { ...item, price: Number(e.target.value) } : item))} placeholder="Contoh: 50000" className={`${inputClass} mt-1`} /></label><label className="block text-[11px] text-slate-400">Stok varian<input type="number" min="0" value={variant.stock ?? ''} onChange={e => setColors(prev => prev.map((item, i) => i === index ? { ...item, stock: Number(e.target.value) } : item))} placeholder="Contoh: 10" className={`${inputClass} mt-1`} /></label></div><div><p className="text-[11px] text-slate-400 mb-1">Foto varian *</p><div className="flex items-center gap-3"><label className="relative w-16 h-16 rounded-lg border border-dashed border-slate-600 bg-slate-800 overflow-hidden cursor-pointer shrink-0">{(variantFiles[index] || variant.image) ? <img src={variantFiles[index] ? URL.createObjectURL(variantFiles[index]) : variant.image} alt="Preview varian" className="w-full h-full object-cover" /> : <ImagePlus className="w-5 h-5 text-slate-500 absolute inset-0 m-auto" />}<input type="file" accept="image/*" className="hidden" onChange={e => { const file = e.target.files?.[0]; if (file) setVariantFiles(prev => ({ ...prev, [index]: file })); }} /></label><span className="text-[11px] text-slate-500">Klik kotak foto untuk upload. Preview akan tampil di sini.</span></div></div></div>)}</div>
              </div>
            </div>
          </details>
        </div>
        {error && <p className="px-5 pb-3 text-xs text-rose-400">{error}</p>}
        <div className="flex justify-end gap-2 px-5 pb-5"><button onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-slate-700">Batal</button><button onClick={save} disabled={saving || !name.trim() || !price || existingImages.length + newImages.length === 0} className="px-4 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-400 text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50">{saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}Simpan</button></div>
      </div>
    </div>
  );
}

function ProductsTab() {
  const { products, deleteProduct, fetchAllData, isDataLoading } = useAdmin();
  const [editing, setEditing] = useState<import('@/types').Product | null | undefined>(undefined);
  const handleDelete = async (id: string) => { if (confirm('Hapus produk ini?')) await deleteProduct(id); };
  return <div className="space-y-5">
    <div className="flex items-center justify-between"><div><h2 className="text-white text-xl font-bold">Katalog Produk</h2><p className="text-slate-400 text-sm mt-0.5">{products.length} produk dari Supabase</p></div><div className="flex gap-2"><button onClick={fetchAllData} className="p-2.5 rounded-xl bg-slate-700 text-slate-300 hover:text-white" title="Refresh"><RefreshCw className={`w-4 h-4 ${isDataLoading ? 'animate-spin' : ''}`} /></button><button onClick={() => setEditing(null)} className="px-4 py-2.5 rounded-xl bg-pink-500 text-white text-sm font-semibold flex items-center gap-2"><Plus className="w-4 h-4" />Tambah Produk</button></div></div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{products.map(product => <div key={product.id} className="bg-slate-800 border border-slate-700/60 rounded-2xl overflow-hidden"><div className="aspect-[4/3] bg-slate-700">{product.image && <img src={product.image} alt={product.name} className="w-full h-full object-cover" />}</div><div className="p-4"><div className="flex justify-between gap-3"><div className="min-w-0"><h3 className="text-white text-sm font-semibold truncate">{product.name}</h3><p className="text-slate-400 text-xs mt-1">{product.category} · Stok {product.stock}</p></div><p className="text-pink-400 text-sm font-bold shrink-0">{fmt(product.price)}</p></div><p className="text-slate-500 text-xs mt-2 line-clamp-2">{product.tagline || 'Tanpa tagline'}</p><div className="flex items-center justify-between mt-4"><span className="text-xs text-slate-500">{product.images.length} gambar · {product.colors.length} warna</span><div className="flex gap-1"><button onClick={() => setEditing(product)} className="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10" title="Edit"><Pencil className="w-4 h-4" /></button><button onClick={() => handleDelete(product.id)} className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10" title="Hapus"><Trash2 className="w-4 h-4" /></button></div></div></div></div>)}</div>
    {products.length === 0 && <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-12 text-center text-slate-500 text-sm">Belum ada produk. Tambahkan produk pertama dari Supabase.</div>}
    {editing !== undefined && <ProductEditor product={editing ?? undefined} onClose={() => setEditing(undefined)} />}
  </div>;
}

function CategoriesTab() {
  const { categories, saveCategory, deleteCategory, fetchAllData } = useAdmin();
  const emptyForm = { name: '', iconName: 'Flower', sortOrder: 1, isActive: true };
  const [editing, setEditing] = useState<import('@/types').ProductCategory | null | undefined>(undefined);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const inputClass = 'w-full bg-slate-900 border border-slate-600 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-500/40';

  const open = (category?: import('@/types').ProductCategory) => {
    setForm(category ? { name: category.name, iconName: category.iconName, sortOrder: category.sortOrder, isActive: category.isActive } : { ...emptyForm, sortOrder: categories.length + 1 });
    setError('');
    setEditing(category ?? null);
  };

  const save = async () => {
    if (!form.name.trim()) {
      setError('Nama kategori wajib diisi.');
      return;
    }
    const result = await saveCategory({ ...form, name: form.name.trim() }, editing && editing !== null ? editing.id : undefined);
    if (result.success) setEditing(undefined);
    else setError(result.error ?? 'Kategori gagal disimpan.');
  };

  return <div className="space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-white text-xl font-bold">Kategori Produk</h2><p className="text-slate-400 text-sm mt-0.5">Atur pilihan kategori yang muncul di toko.</p></div><div className="flex gap-2"><button onClick={fetchAllData} className="p-2.5 rounded-xl bg-slate-700 text-slate-300 hover:text-white" title="Refresh"><RefreshCw className="w-4 h-4" /></button><button onClick={() => open()} className="px-4 py-2.5 rounded-xl bg-pink-500 text-white text-sm font-semibold flex items-center gap-2"><Plus className="w-4 h-4" />Tambah Kategori</button></div></div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{categories.map(category => <div key={category.id} className="bg-slate-800 border border-slate-700/60 rounded-2xl p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-pink-500/15 text-pink-400 flex items-center justify-center"><Tags className="w-5 h-5" /></div><div className="flex-1 min-w-0"><p className="text-white text-sm font-semibold truncate">{category.name}</p><p className="text-slate-500 text-xs">{category.isActive ? 'Tampil di toko' : 'Disembunyikan'}</p></div><button onClick={() => open(category)} className="p-2 text-slate-400 hover:text-amber-400" title="Edit"><Pencil className="w-4 h-4" /></button><button onClick={() => { if (confirm('Hapus kategori ini?')) deleteCategory(category.id); }} className="p-2 text-slate-400 hover:text-rose-400" title="Hapus"><Trash2 className="w-4 h-4" /></button></div>)}</div>
    {editing !== undefined && <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"><div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md p-5"><div className="flex justify-between items-center mb-5"><h3 className="text-white font-bold">{editing ? 'Edit Kategori' : 'Tambah Kategori'}</h3><button onClick={() => setEditing(undefined)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button></div><label className="text-xs text-slate-400 block">Nama kategori<input autoFocus value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Contoh: Ulang Tahun" className={`${inputClass} mt-1`} /></label><label className="text-xs text-slate-400 block mt-3">Urutan tampil<input type="number" min="1" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: Number(e.target.value) || 1 })} className={`${inputClass} mt-1`} /></label><label className="flex items-center gap-2 text-sm text-slate-300 mt-4"><input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />Tampilkan di toko</label>{error && <p className="text-xs text-rose-400 mt-3">{error}</p>}<div className="flex justify-end gap-2 mt-5"><button onClick={() => setEditing(undefined)} className="px-4 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-slate-700">Batal</button><button onClick={save} className="px-4 py-2.5 rounded-xl bg-pink-500 text-white text-sm font-semibold">Simpan</button></div></div></div>}
  </div>;
}

function PaymentMethodsTab() {
  const { paymentMethods, savePaymentMethod, deletePaymentMethod, fetchAllData } = useAdmin();
  const blank = { bankName: '', accountNumber: '', accountHolder: '', logo: '', color: '#64748B', isActive: true, sortOrder: 0 };
  const [editing, setEditing] = useState<import('@/types').PaymentMethod | null | undefined>(undefined);
  const [form, setForm] = useState(blank);
  const open = (method?: import('@/types').PaymentMethod) => { setForm(method ? { bankName: method.bankName, accountNumber: method.accountNumber, accountHolder: method.accountHolder, logo: method.logo, color: method.color, isActive: method.isActive, sortOrder: method.sortOrder } : blank); setEditing(method ?? null); };
  const save = async () => { const result = await savePaymentMethod(form, editing && editing !== null ? editing.id : undefined); if (result.success) setEditing(undefined); };
  const inputClass = 'w-full bg-slate-900 border border-slate-600 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-500/40';
  return <div className="space-y-5"><div className="flex items-center justify-between"><div><h2 className="text-white text-xl font-bold">Metode Pembayaran</h2><p className="text-slate-400 text-sm mt-0.5">Atur rekening yang tampil di checkout.</p></div><div className="flex gap-2"><button onClick={fetchAllData} className="p-2.5 rounded-xl bg-slate-700 text-slate-300 hover:text-white"><RefreshCw className="w-4 h-4" /></button><button onClick={() => open()} className="px-4 py-2.5 rounded-xl bg-pink-500 text-white text-sm font-semibold flex items-center gap-2"><Plus className="w-4 h-4" />Tambah Metode</button></div></div>
    <div className="bg-slate-800 border border-slate-700/60 rounded-2xl overflow-hidden divide-y divide-slate-700/50">{paymentMethods.map(method => <div key={method.id} className="p-4 flex items-center gap-4"><div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: method.color }}>{method.logo || method.bankName.slice(0, 3).toUpperCase()}</div><div className="flex-1 min-w-0"><p className="text-white text-sm font-semibold">{method.bankName}</p><p className="text-slate-400 text-xs">{method.accountNumber} · {method.accountHolder}</p></div><span className={`text-xs px-2 py-1 rounded-full ${method.isActive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-700 text-slate-500'}`}>{method.isActive ? 'Aktif' : 'Nonaktif'}</span><button onClick={() => open(method)} className="p-2 text-slate-400 hover:text-amber-400"><Pencil className="w-4 h-4" /></button><button onClick={() => { if (confirm('Hapus metode pembayaran ini?')) deletePaymentMethod(method.id); }} className="p-2 text-slate-400 hover:text-rose-400"><Trash2 className="w-4 h-4" /></button></div>)}</div>
    {editing !== undefined && <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"><div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg p-5"><div className="flex justify-between items-center mb-5"><h3 className="text-white font-bold">{editing ? 'Edit Metode Pembayaran' : 'Tambah Metode Pembayaran'}</h3><button onClick={() => setEditing(undefined)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button></div><div className="space-y-3"><label className="text-xs text-slate-400 block">Nama bank<input value={form.bankName} onChange={e => setForm({ ...form, bankName: e.target.value })} className={`${inputClass} mt-1`} /></label><label className="text-xs text-slate-400 block">Nomor rekening<input value={form.accountNumber} onChange={e => setForm({ ...form, accountNumber: e.target.value })} className={`${inputClass} mt-1`} /></label><label className="text-xs text-slate-400 block">Nama pemilik<input value={form.accountHolder} onChange={e => setForm({ ...form, accountHolder: e.target.value })} className={`${inputClass} mt-1`} /></label><div className="grid grid-cols-2 gap-3"><label className="text-xs text-slate-400 block">Logo<input value={form.logo} onChange={e => setForm({ ...form, logo: e.target.value })} className={`${inputClass} mt-1`} /></label><label className="text-xs text-slate-400 block">Warna<input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} className={`${inputClass} h-10 mt-1 p-1`} /></label></div><label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />Tampilkan di checkout</label></div><div className="flex justify-end gap-2 mt-5"><button onClick={() => setEditing(undefined)} className="px-4 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-slate-700">Batal</button><button onClick={save} disabled={!form.bankName || !form.accountNumber || !form.accountHolder} className="px-4 py-2.5 rounded-xl bg-pink-500 text-white text-sm font-semibold disabled:opacity-50">Simpan</button></div></div></div>}
  </div>;
}

// ─── Main Admin Dashboard View ────────────────────────────────────────────────
export function AdminDashboardView() {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { adminUser, adminSignOut } = useAdmin();

  if (!adminUser) return null;

  const mainMargin = sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60';

  return (
    <div className="min-h-screen bg-slate-900">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        adminEmail={adminUser.email}
        onSignOut={adminSignOut}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />

      <div className={`${mainMargin} transition-all duration-300 min-h-screen flex flex-col`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur border-b border-slate-700/60 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 -ml-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700" aria-label="Buka menu"><Menu className="w-5 h-5" /></button>
            <span className="text-slate-500 text-sm">Admin</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-white text-sm font-medium capitalize">{activeTab}</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition">
              <Bell className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white text-[10px] font-bold">
                {adminUser.email.charAt(0).toUpperCase()}
              </div>
              <span className="text-slate-300 text-xs font-medium truncate max-w-[120px]">{adminUser.email}</span>
              <span className="text-[10px] bg-pink-500/20 text-pink-400 border border-pink-500/20 px-1.5 py-0.5 rounded-full font-semibold">
                {adminUser.role === 'super_admin' ? 'Super Admin' : 'Admin'}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {activeTab === 'dashboard' && <DashboardTab />}
          {activeTab === 'orders' && <OrdersTab />}
          {activeTab === 'customers' && <CustomersTab />}
          {activeTab === 'products' && <ProductsTab />}
          {activeTab === 'categories' && <CategoriesTab />}
          {activeTab === 'payments' && <PaymentMethodsTab />}
        </main>
      </div>
    </div>
  );
}
