'use client';

import { AdminProvider, useAdmin } from '@/context/AdminContext';
import { AdminLoginView } from '@/components/admin/AdminLoginView';
import { AdminDashboardView } from '@/components/admin/AdminDashboardView';
import { Flower2 } from 'lucide-react';

function AdminGate() {
  const { isAdmin, isAdminLoading } = useAdmin();

  if (isAdminLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-500/30 animate-pulse">
            <Flower2 className="w-7 h-7 text-white" />
          </div>
          <p className="text-slate-400 text-sm">Memuat panel admin...</p>
        </div>
      </div>
    );
  }

  return isAdmin ? <AdminDashboardView /> : <AdminLoginView />;
}

export default function AdminPage() {
  return (
    <AdminProvider>
      <AdminGate />
    </AdminProvider>
  );
}
