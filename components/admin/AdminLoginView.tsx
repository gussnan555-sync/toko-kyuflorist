'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { Mail, KeyRound, RefreshCw, ShieldCheck, Eye, EyeOff, Flower2 } from 'lucide-react';

export function AdminLoginView() {
  const { adminSignIn, adminVerifyOtp } = useAdmin();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const startCountdown = () => {
    setCountdown(60);
    const t = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(t); return 0; }
        return c - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.includes('@')) { setError('Masukkan email yang valid'); return; }
    setIsLoading(true);
    const res = await adminSignIn(email);
    setIsLoading(false);
    if (res.success) {
      setStep('otp');
      startCountdown();
    } else {
      setError(res.error ?? 'Gagal mengirim OTP');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (otp.length < 6) { setError('Masukkan 6 digit kode OTP'); return; }
    setIsLoading(true);
    const res = await adminVerifyOtp(email, otp);
    setIsLoading(false);
    if (!res.success) {
      setError(res.error ?? 'Verifikasi gagal');
    }
  };

  const handleResend = async () => {
    setError('');
    const res = await adminSignIn(email);
    if (res.success) startCountdown();
    else setError(res.error ?? 'Gagal mengirim ulang OTP');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Decorative glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo & Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg shadow-pink-500/30 mb-4">
            <Flower2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">KyuFlorist</h1>
          <p className="text-slate-400 text-sm mt-1">Admin Dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck className="w-5 h-5 text-pink-400" />
            <h2 className="text-white font-semibold">
              {step === 'email' ? 'Login Admin' : 'Verifikasi OTP'}
            </h2>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm">
              {error}
            </div>
          )}

          {step === 'email' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                  Email Admin
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@kyuflorist.com"
                    className="w-full bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 text-sm pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 transition-all active:scale-95 disabled:opacity-60"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                {isLoading ? 'Mengirim OTP...' : 'Kirim Kode OTP'}
              </button>

              <p className="text-center text-xs text-slate-500 mt-2">
                Hanya akun yang terdaftar sebagai admin yang dapat masuk.
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3 bg-slate-700/40 rounded-xl text-center mb-2">
                <p className="text-xs text-slate-400">Kode OTP dikirim ke</p>
                <p className="text-sm font-semibold text-pink-400">{email}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                  6-Digit Kode OTP
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showOtp ? 'text' : 'password'}
                    maxLength={6}
                    required
                    autoFocus
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="••••••"
                    className="w-full bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 text-sm pl-10 pr-10 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 tracking-[0.4em] font-mono text-center transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOtp(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showOtp ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.length < 6}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 transition-all active:scale-95 disabled:opacity-60"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                {isLoading ? 'Memverifikasi...' : 'Masuk sebagai Admin'}
              </button>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => { setStep('email'); setOtp(''); setError(''); }}
                  className="text-slate-400 hover:text-slate-200 underline underline-offset-2"
                >
                  Ganti Email
                </button>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={countdown > 0}
                  className="text-pink-400 hover:text-pink-300 disabled:text-slate-500 font-semibold"
                >
                  {countdown > 0 ? `Kirim ulang (${countdown}s)` : 'Kirim Ulang OTP'}
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          KyuFlorist Admin © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
