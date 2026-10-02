'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { ProductCard } from '@/components/ProductCard';
import { Heart, Sparkles, LogIn, Lock } from 'lucide-react';

export const WishlistScreen: React.FC = () => {
  const { wishlist, products, setActiveTab, isGuest, openAuthModal } = useApp();

  const favoriteProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="flex flex-col min-h-screen pb-safe-nav">
      {/* Header */}
      <div className="p-4 bg-gradient-to-b from-pink-50/70 to-white border-b border-pink-100 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
            <h1 className="text-lg font-bold text-slate-800">Wishlist Favorit</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar bouquet pilihan yang kamu simpan ({wishlist.length} item)
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
            <h3 className="text-base font-bold text-slate-800">Masuk untuk Menyimpan Wishlist</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
              Sebagai tamu, Anda belum dapat menyimpan daftar buket bunga favorit. Masuk atau daftar dengan OTP Email untuk menikmati fitur ini.
            </p>
            <button
              onClick={() => openAuthModal('Masuk untuk membuka dan menyimpan Wishlist')}
              className="mt-5 px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 text-white font-bold text-xs shadow-md shadow-pink-500/25 flex items-center gap-2 transition-all active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              Masuk / Daftar Akun
            </button>
          </div>
        ) : favoriteProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 px-4">
            <div className="w-20 h-20 rounded-full bg-pink-50 border border-pink-100 flex items-center justify-center mb-4 text-pink-300">
              <Heart className="w-10 h-10" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Wishlist Kamu Masih Kosong</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
              Jelajahi koleksi bunga segar KyuFlorist dan tekan ikon hati pada bouquet yang kamu sukai.
            </p>
            <button
              onClick={() => setActiveTab('home')}
              className="mt-5 px-5 py-2.5 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-semibold text-xs shadow-md shadow-pink-500/20 flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              Cari Bunga Sekarang
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {favoriteProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
