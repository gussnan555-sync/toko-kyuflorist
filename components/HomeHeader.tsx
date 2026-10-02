'use client';

import React from 'react';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { Search, Sparkles, X, Heart, ShoppingBag, User } from 'lucide-react';

export const HomeHeader: React.FC = () => {
  const { user, isGuest, setActiveTab, searchQuery, setSearchQuery, wishlist, cartItemsCount, openAuthModal } = useApp();

  return (
    <header className="pt-4 pb-3 px-4 bg-gradient-to-b from-pink-50/70 via-pink-50/20 to-white">
      {/* Top Bar: Profile, Logo & Action Shortcuts */}
      <div className="flex items-center justify-between gap-2 mb-3">
        {/* Top Left: User Profile Avatar & Greeting */}
        <div 
          onClick={() => {
            if (isGuest) {
              setActiveTab('profile');
            } else {
              setActiveTab('profile');
            }
          }}
          className="flex items-center gap-2.5 cursor-pointer group p-1 -ml-1 rounded-full hover:bg-pink-100/50 transition-colors"
        >
          <div className="relative">
            <div className="w-11 h-11 rounded-full ring-2 ring-pink-300 ring-offset-2 overflow-hidden shadow-sm bg-pink-100 flex items-center justify-center transition-transform group-hover:scale-105">
              {user?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : user ? (
                <span className="text-pink-600 font-bold text-base">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <User className="w-5 h-5 text-pink-400" />
              )}
            </div>
            {user && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
            )}
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-normal">Hai,</span>
            <span className="text-sm font-semibold text-slate-800 flex items-center gap-1 group-hover:text-pink-600 transition-colors">
              {user ? user.name : 'Tamu'}
              {user ? (
                <Sparkles className="w-3.5 h-3.5 text-pink-400 inline" />
              ) : (
                <span className="text-[10px] text-pink-600 bg-pink-50 px-1.5 py-0.2 rounded font-normal">
                  (Masuk)
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Top Right: Brand Logo & Floating Badges */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (isGuest) {
                openAuthModal('Masuk untuk membuka Wishlist favorit Anda');
              } else {
                setActiveTab('wishlist');
              }
            }}
            className="p-2 rounded-full bg-white border border-pink-100 text-slate-600 hover:text-pink-600 hover:border-pink-300 shadow-sm relative transition-all"
            aria-label="Wishlist"
          >
            <Heart className="w-4 h-4" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              if (isGuest) {
                openAuthModal('Masuk untuk melihat Keranjang belanja Anda');
              } else {
                setActiveTab('cart');
              }
            }}
            className="p-2 rounded-full bg-white border border-pink-100 text-slate-600 hover:text-pink-600 hover:border-pink-300 shadow-sm relative transition-all"
            aria-label="Keranjang"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </button>

          {/* Logo */}
          <div className="w-10 h-10 relative flex items-center justify-center">
            <Image
              src="/kyuflorist-logo.png"
              alt="KyuFlorist"
              width={40}
              height={40}
              className="object-contain drop-shadow-sm rounded-lg"
              priority
            />
          </div>
        </div>
      </div>

      {/* Aesthetic Main Titles */}
      <div className="mt-3">
        {/* Tegak bersambung / Cursive: Fresh and Beautiful */}
        <div className="font-cursive text-3xl sm:text-4xl text-pink-500 tracking-wide leading-tight drop-shadow-[0_2px_4px_rgba(255,107,139,0.15)]">
          Fresh and Beautiful
        </div>

        {/* Poppins: Pilih Bunga, Untuk Bouquet yang kamu suka */}
        <h1 className="mt-1 text-base sm:text-lg font-bold text-slate-800 leading-snug tracking-tight">
          Pilih Bunga, Untuk Bouquet <br />
          <span className="text-pink-600 font-semibold">yang kamu suka</span>
        </h1>
      </div>

      {/* Search Input Bar */}
      <div className="mt-3.5 relative">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-pink-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari bouquet mawar, tulip, peony, dll..."
            className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-white border border-pink-200/90 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 text-slate-800 placeholder:text-slate-400 shadow-sm transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
