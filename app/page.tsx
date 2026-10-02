'use client';

import React from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { HomeScreen } from '@/components/screens/HomeScreen';
import { WishlistScreen } from '@/components/screens/WishlistScreen';
import { CartScreen } from '@/components/screens/CartScreen';
import { OrdersScreen } from '@/components/screens/OrdersScreen';
import { ProfileScreen } from '@/components/screens/ProfileScreen';
import { BottomNav } from '@/components/BottomNav';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { CheckoutModal } from '@/components/CheckoutModal';
import { AuthModal } from '@/components/AuthModal';
import { ToastContainer } from '@/components/ToastContainer';

function MainAppContent() {
  const { activeTab } = useApp();

  return (
    <main className="relative flex-1 w-full bg-white flex flex-col">
      {/* Dynamic Tab Switcher */}
      {activeTab === 'home' && <HomeScreen />}
      {activeTab === 'wishlist' && <WishlistScreen />}
      {activeTab === 'cart' && <CartScreen />}
      {activeTab === 'orders' && <OrdersScreen />}
      {activeTab === 'profile' && <ProfileScreen />}

      {/* Floating Modals & Sheets */}
      <ProductDetailModal />
      <CheckoutModal />
      <AuthModal />

      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav />
    </main>
  );
}

export default function Page() {
  return (
    <div className="flex justify-center min-h-screen bg-slate-100">
      <div className="w-full max-w-md min-h-screen bg-white shadow-2xl relative flex flex-col overflow-x-hidden border-x border-pink-100/60">
        <AppProvider>
          <MainAppContent />
        </AppProvider>
      </div>
    </div>
  );
}
