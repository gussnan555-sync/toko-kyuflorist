'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Order, OrderStatus } from '@/types';
import { Package, Clock, Truck, CheckCircle2, ChevronRight, Copy, Check, AlertCircle, Sparkles, Building2, Lock, LogIn } from 'lucide-react';

export const OrdersScreen: React.FC = () => {
  const { orders, cancelOrder, setActiveTab, showToast, isGuest, openAuthModal } = useApp();
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [copiedBankId, setCopiedBankId] = useState<string | null>(null);

  const formatRupiah = (val: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);

  const handleCopyAccount = (acc: string, id: string) => {
    navigator.clipboard.writeText(acc.replace(/[^0-9]/g, ''));
    setCopiedBankId(id);
    showToast('Nomor rekening disalin! 📋', 'success');
    setTimeout(() => setCopiedBankId(null), 2000);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Menunggu Pembayaran':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: Clock,
          label: 'Menunggu Pembayaran',
        };
      case 'Sedang Dirangkai':
        return {
          bg: 'bg-pink-50 text-pink-700 border-pink-200',
          icon: Sparkles,
          label: 'Sedang Dirangkai Florist',
        };
      case 'Dalam Pengiriman':
        return {
          bg: 'bg-sky-50 text-sky-700 border-sky-200',
          icon: Truck,
          label: 'Dalam Pengiriman Kurir',
        };
      case 'Selesai':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: CheckCircle2,
          label: 'Pesanan Selesai',
        };
      case 'Dibatalkan':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: AlertCircle,
          label: 'Dibatalkan',
        };
      default:
        return {
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
          icon: Clock,
          label: status,
        };
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-safe-nav">
      {/* Header */}
      <div className="p-4 bg-gradient-to-b from-pink-50/70 to-white border-b border-pink-100 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-pink-500" />
            <h1 className="text-lg font-bold text-slate-800">Daftar Pesanan</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Lacak status & riwayat rangkaian bungamu ({orders.length} pesanan)
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1">
        {isGuest ? (
          <div className="flex flex-col items-center justify-center text-center py-16 px-4">
            <div className="w-20 h-20 rounded-full bg-pink-50 border border-pink-100 flex items-center justify-center mb-4 text-pink-400">
              <Lock className="w-9 h-9" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Masuk untuk Melihat Riwayat Pesanan</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
              Sebagai tamu, riwayat pesanan belum dapat ditampilkan. Silakan masuk dengan email akun Anda untuk melacak pesanan.
            </p>
            <button
              onClick={() => openAuthModal('Masuk untuk melihat riwayat dan status pesanan')}
              className="mt-5 px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 text-white font-bold text-xs shadow-md shadow-pink-500/25 flex items-center gap-2 transition-all active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              Masuk / Daftar Akun
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 px-4">
            <div className="w-20 h-20 rounded-full bg-pink-50 border border-pink-100 flex items-center justify-center mb-4 text-pink-300">
              <Package className="w-10 h-10" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Belum Ada Pesanan</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
              Kamu belum memiliki pesanan aktif. Pesan buket bunga segar favoritmu sekarang!
            </p>
            <button
              onClick={() => setActiveTab('home')}
              className="mt-5 px-5 py-2.5 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-semibold text-xs shadow-md shadow-pink-500/20 flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              Pesan Bunga Sekarang
            </button>
          </div>
        ) : (
          <div className="space-y-3.5">
            {orders.map((order) => {
              const statusInfo = getStatusBadge(order.status);
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-pink-100/90 shadow-sm p-3.5 space-y-3 hover:shadow-md transition-all"
                >
                  {/* Top Order Row */}
                  <div className="flex items-center justify-between border-b border-pink-50 pb-2.5">
                    <div>
                      <span className="text-xs font-bold text-slate-800 tracking-wide">
                        {order.orderNumber}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusInfo.bg}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {statusInfo.label}
                    </div>
                  </div>

                  {/* Branch & Shipping Info */}
                  <div className="flex items-center justify-between text-[11px] bg-pink-50/40 p-2 rounded-xl border border-pink-100/50">
                    <span className="flex items-center gap-1 text-slate-700">
                      <Building2 className="w-3.5 h-3.5 text-pink-500" />
                      {order.branch.split(' (')[0]}
                    </span>
                    <span className="font-semibold text-pink-600">
                      {order.shippingMethod}
                    </span>
                  </div>

                  {/* Items List Preview */}
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-2.5 items-center">
                        <div className="w-11 h-11 rounded-lg overflow-hidden bg-pink-50 shrink-0 border border-pink-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-xs text-slate-800 truncate">
                            {item.productName}
                          </h4>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                            <span>{item.colorName}</span>
                            <span>•</span>
                            <span>{item.size}</span>
                            <span>•</span>
                            <span>{item.quantity}x</span>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-slate-800">
                          {formatRupiah(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Bank Transfer Instructions for Pending Orders */}
                  {order.status === 'Menunggu Pembayaran' && (
                    <div className="bg-slate-900 text-white p-3 rounded-xl text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Transfer ke {order.paymentBank.bankName}:</span>
                        <span className="text-pink-400 font-semibold">Total: {formatRupiah(order.totalAmount)}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="font-mono text-sm font-bold text-amber-300 tracking-wider">
                          {order.paymentBank.accountNumber}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyAccount(order.paymentBank.accountNumber, order.id)}
                          className="px-2 py-0.5 bg-white/20 hover:bg-white/30 text-white rounded text-[10px] font-semibold flex items-center gap-1 transition-colors"
                        >
                          {copiedBankId === order.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          {copiedBankId === order.id ? 'Tersalin' : 'Salin Rekening'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Total & Action Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-pink-50">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Total Pesanan:</span>
                      <span className="text-xs sm:text-sm font-bold text-pink-600">
                        {formatRupiah(order.totalAmount)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {order.status === 'Menunggu Pembayaran' && (
                        <button
                          onClick={() => cancelOrder(order.id)}
                          className="text-[11px] text-rose-500 hover:text-rose-600 font-medium px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
                        >
                          Batalkan
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedOrderDetails(order)}
                        className="text-xs bg-pink-50 hover:bg-pink-100 text-pink-700 font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-colors"
                      >
                        Lihat Detail
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-pink-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-base">Detail Pesanan</h3>
                <span className="text-xs text-pink-600 font-mono font-semibold">
                  {selectedOrderDetails.orderNumber}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="p-1.5 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3.5 text-xs">
              {/* Status */}
              <div className="p-3 bg-pink-50 rounded-xl flex items-center justify-between">
                <span className="text-slate-600">Status Pesanan:</span>
                <span className="font-bold text-pink-700">{selectedOrderDetails.status}</span>
              </div>

              {/* Recipient */}
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="font-bold text-slate-800 block">Alamat Penerima:</span>
                <p className="text-slate-700 font-medium">
                  {selectedOrderDetails.shippingAddress.recipientName} ({selectedOrderDetails.shippingAddress.phoneNumber})
                </p>
                <p className="text-slate-600">{selectedOrderDetails.shippingAddress.fullAddress}</p>
                {selectedOrderDetails.shippingAddress.notes && (
                  <p className="text-pink-600 italic">Catatan: {selectedOrderDetails.shippingAddress.notes}</p>
                )}
              </div>

              {/* Items */}
              <div className="space-y-2">
                <span className="font-bold text-slate-800 block">Rangkaian Bunga:</span>
                {selectedOrderDetails.items.map((item, i) => (
                  <div key={i} className="p-2.5 bg-white border border-pink-100 rounded-xl space-y-1">
                    <div className="flex justify-between font-semibold text-slate-800">
                      <span>{item.productName} ({item.quantity}x)</span>
                      <span>{formatRupiah(item.price * item.quantity)}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Warna: {item.colorName} • Ukuran: {item.size}
                    </div>
                    {item.greetingCardText && (
                      <p className="text-[11px] text-pink-700 bg-pink-50 p-1.5 rounded-lg italic">
                        💌 &ldquo;{item.greetingCardText}&rdquo;
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Cost Summary */}
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span>{formatRupiah(selectedOrderDetails.subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Ongkir ({selectedOrderDetails.shippingMethod}):</span>
                  <span>{formatRupiah(selectedOrderDetails.shippingCost)}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 text-sm pt-1.5 border-t border-slate-200">
                  <span>Total Pembayaran:</span>
                  <span className="text-pink-600">{formatRupiah(selectedOrderDetails.totalAmount)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border-t border-pink-100">
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="w-full py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
