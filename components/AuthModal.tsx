'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Mail, KeyRound, Sparkles, X, ArrowRight, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalReason, sendEmailOtp, verifyEmailOtp, isSupabaseOnline } = useApp();

  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (isAuthModalOpen) {
      setStep('email');
      setOtpToken('');
      setIsLoading(false);
    }
  }, [isAuthModalOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  if (!isAuthModalOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;

    setIsLoading(true);
    const res = await sendEmailOtp(email);
    setIsLoading(false);

    if (res.success) {
      setStep('otp');
      setResendCooldown(30);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpToken.trim() || otpToken.length < 6) return;

    setIsLoading(true);
    await verifyEmailOtp(email, otpToken);
    setIsLoading(false);
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isLoading) return;
    setIsLoading(true);
    const res = await sendEmailOtp(email);
    setIsLoading(false);
    if (res.success) {
      setResendCooldown(30);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl border-t sm:border border-pink-100 animate-in slide-in-from-bottom-8 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-pink-500 via-rose-400 to-pink-400 p-5 text-white">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-white/20 rounded-xl backdrop-blur-xs">
              <Sparkles className="w-4 h-4 text-amber-200" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-pink-100">
              KyuFlorist Akun
            </span>
          </div>

          <h2 className="text-lg font-bold">
            {step === 'email' ? 'Masuk / Daftar Akun' : 'Verifikasi Kode OTP'}
          </h2>
          <p className="text-xs text-pink-100 mt-0.5 leading-relaxed">
            {authModalReason || 'Gunakan email Anda untuk menerima kode verifikasi instan.'}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-5">
          {step === 'email' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Alamat Email Anda
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-pink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    autoFocus
                    className="w-full text-xs pl-10 pr-3 py-3 bg-pink-50/40 border border-pink-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white text-slate-800 placeholder:text-slate-400 shadow-2xs"
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-1.5 block">
                  Kami akan mengirimkan 6-digit kode OTP ke email di atas tanpa perlu password.
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading || !email.includes('@')}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-pink-500/25 transition-all active:scale-95 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Mengirim OTP ke Email...</span>
                  </>
                ) : (
                  <>
                    <span>Kirim Kode OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Login cepat & aman via Supabase Email Auth.</span>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center pb-1">
                <span className="text-xs text-slate-500 block">Kode verifikasi telah dikirim ke:</span>
                <span className="text-xs font-bold text-pink-600">{email}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 text-center">
                  Masukkan 6-Digit Kode OTP
                </label>
                <div className="relative max-w-[220px] mx-auto">
                  <KeyRound className="w-4 h-4 text-pink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otpToken}
                    onChange={(e) => setOtpToken(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="123456"
                    autoFocus
                    className="w-full text-center tracking-[0.4em] font-mono text-base font-bold pl-8 pr-3 py-3 bg-pink-50/50 border-2 border-pink-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white text-slate-800 shadow-2xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || otpToken.length < 6}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-pink-500/25 transition-all active:scale-95 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Memverifikasi Kode OTP...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verifikasi & Masuk</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="text-slate-500 hover:text-slate-700 underline text-[11px]"
                >
                  Ganti Email
                </button>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCooldown > 0 || isLoading}
                  className="text-pink-600 font-semibold hover:text-pink-700 disabled:text-slate-400 text-[11px]"
                >
                  {resendCooldown > 0 ? `Kirim ulang (${resendCooldown}s)` : 'Kirim Ulang OTP'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
