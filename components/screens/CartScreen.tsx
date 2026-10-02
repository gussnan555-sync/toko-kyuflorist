'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, MessageSquareHeart, Sparkles, Lock, LogIn } from 'lucide-react';

export const CartScreen: React.FC = () => {
  const { cart, updateCartQuantity, removeFromCart, clearCart, cartTotal, openCheckout, setActiveTab, isGuest, openAuthModal } = useApp();

  const formatRupiah = (val: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="flex flex-col min-h-screen pb-safe-nav">
      {/* Header */}
      <div className="p-4 bg-gradient-to-b from-pink-50/70 to-white border-b border-pink-100 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-pink-500" />
            <h1 className="text-lg font-bold text-slate-800">Keranjang Belanja</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {cart.length} jenis bouquet siap diantarkan
          </p>
        </div>

        {cart.length > 0 && !isGuest && (
          <button
            onClick={clearCart}
            className="text-xs text-rose-500 hover:text-rose-600 font-medium flex items-center gap-1 hover:bg-rose-50 px-2.5 py-1 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Kosongkan
          </button>
        )}
      </div>

      {/* Body Content */}
      <div className="p-4 flex-1">
        {isGuest ? (
          <div className="flex flex-col items-center justify-center text-center py-16 px-4">
            <div className="w-20 h-20 rounded-full bg-pink-50 border border-pink-100 flex items-center justify-center mb-4 text-pink-400">
              <Lock className="w-9 h-9" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Masuk untuk Menggunakan Keranjang</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
              Sebagai tamu, Anda belum dapat menambahkan bunga ke keranjang atau checkout. Masuk dengan email Anda untuk mulai berbelanja!
            </p>
            <button
              onClick={() => openAuthModal('Masuk untuk mengakses keranjang dan belanja bunga')}
              className="mt-5 px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 text-white font-bold text-xs shadow-md shadow-pink-500/25 flex items-center gap-2 transition-all active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              Masuk / Daftar Akun
            </button>
          </div>
        ) : cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 px-4">
            <div className="w-20 h-20 rounded-full bg-pink-50 border border-pink-100 flex items-center justify-center mb-4 text-pink-300">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Keranjang Masih Kosong</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
              Kamu belum memasukkan bouquet bunga ke keranjang. Pilih bouquet impianmu sekarang!
            </p>
            <button
              onClick={() => setActiveTab('home')}
              className="mt-5 px-5 py-2.5 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-semibold text-xs shadow-md shadow-pink-500/20 flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              Mulai Belanja Bunga
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-white rounded-2xl border border-pink-100 shadow-sm flex flex-col gap-2.5"
              >
                <div className="flex gap-3 items-start">
                  <div className="w-18 h-18 rounded-xl overflow-hidden bg-pink-50 shrink-0 border border-pink-100 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.color?.image || item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full ring-1 ring-white shadow-xs"
                      style={{ backgroundColor: item.color.hex }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-bold text-slate-800 text-xs sm:text-sm line-clamp-1">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-rose-500 p-1"
                        aria-label="Hapus item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] bg-pink-50 text-pink-700 px-2 py-0.5 rounded-md font-medium">
                        {item.color.name}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs sm:text-sm font-bold text-pink-600">
                        {formatRupiah(item.finalPrice)}
                      </span>

                      {/* Quantity Modifier */}
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2 py-0.5">
                        <button
                          onClick={() => updateCartQuantity(item.id, -1)}
                          className="text-slate-600 hover:text-rose-600 p-0.5"
                          aria-label="Kurangi kuantitas"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-slate-800 w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, 1)}
                          className="text-slate-600 hover:text-pink-600 p-0.5"
                          aria-label="Tambah kuantitas"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Free Greeting Card preview if entered */}
                {item.greetingCardText ? (
                  <div className="text-[11px] text-pink-800 bg-pink-50/70 p-2 rounded-xl border border-pink-100 flex items-start gap-1.5">
                    <MessageSquareHeart className="w-3.5 h-3.5 text-pink-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-pink-600 text-[10px] uppercase block">Kartu Ucapan:</span>
                      <p className="italic text-slate-700">&ldquo;{item.greetingCardText}&rdquo;</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                    Tanpa pesan kartu ucapan
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Bottom Fixed Sticky Summary */}
      {cart.length > 0 && !isGuest && (
        <div className="sticky bottom-[60px] left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-pink-100 shadow-lg flex items-center justify-between gap-3 z-30">
          <div>
            <span className="text-[11px] text-slate-500 block">Total Keranjang</span>
            <span className="text-base font-bold text-pink-600">
              {formatRupiah(cartTotal)}
            </span>
          </div>

          <button
            onClick={openCheckout}
            className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-pink-500/25 transition-all active:scale-95"
          >
            Lanjut ke Checkout
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
