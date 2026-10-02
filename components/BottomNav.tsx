'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Home, Heart, ShoppingBag, Package, User, LucideIcon } from 'lucide-react';

interface NavItem {
  id: 'home' | 'wishlist' | 'cart' | 'orders' | 'profile';
  label: string;
  icon: LucideIcon;
  badge?: number;
}

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, wishlist, cartItemsCount } = useApp();

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, badge: wishlist.length },
    { id: 'cart', label: 'Keranjang', icon: ShoppingBag, badge: cartItemsCount },
    { id: 'orders', label: 'Pesanan', icon: Package },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40 bg-white/95 backdrop-blur-lg border-t border-pink-100/80 px-2 py-2 shadow-lg shadow-pink-950/5">
      <div className="grid grid-cols-5 gap-1 items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const badgeCount = item.badge ?? 0;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all duration-300 ${
                isActive
                  ? 'text-pink-600 font-semibold'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className="relative">
                <div
                  className={`p-1.5 rounded-xl transition-all duration-300 ${
                    isActive ? 'bg-pink-100/80 scale-110' : 'bg-transparent'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-transform ${
                      isActive ? 'stroke-[2.5px] text-pink-600' : 'stroke-[1.8px]'
                    }`}
                  />
                </div>

                {/* Badges */}
                {badgeCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-500 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white animate-scale">
                    {badgeCount > 9 ? '9+' : badgeCount}
                  </span>
                )}
              </div>

              <span className={`text-[11px] mt-0.5 tracking-tight ${isActive ? 'text-pink-600 font-medium' : 'text-slate-500'}`}>
                {item.label}
              </span>

              {isActive && (
                <span className="w-1 h-1 bg-pink-500 rounded-full mt-0.5 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
