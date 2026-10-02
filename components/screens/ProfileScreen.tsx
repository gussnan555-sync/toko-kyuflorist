'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  User,
  Camera,
  Mail,
  Phone,
  MapPin,
  Save,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  LogOut,
  KeyRound,
  ArrowRight,
  UserPlus,
  CheckCircle2,
  HeartHandshake,
  Clock,
  LocateFixed,
  Loader2
} from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const {
    user,
    isGuest,
    sendEmailOtp,
    verifyEmailOtp,
    signOut,
    updateUserProfile,
    uploadAvatar,
    showToast,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Guest Auth State
  const [authStep, setAuthStep] = useState<'email' | 'otp'>('email');
  const [authEmail, setAuthEmail] = useState('');
  const [authOtp, setAuthOtp] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  // Authenticated User Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [districtCity, setDistrictCity] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Auto-Detect GPS Location & Reverse Geocode
  const handleDetectLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      showToast('Browser Anda tidak mendukung deteksi lokasi (GPS).', 'error');
      return;
    }

    setIsDetectingLocation(true);
    showToast('Sedang mendeteksi titik GPS & alamat...', 'info');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1`,
            {
              headers: {
                'Accept-Language': 'id-ID, id;q=0.9, en;q=0.8',
              },
            }
          );

          if (!response.ok) {
            throw new Error('Gagal mengambil detail alamat dari server peta.');
          }

          const data = await response.json();
          if (data && data.address) {
            const addr = data.address;

            // Jalan / Patokan
            const road = addr.road || addr.pedestrian || addr.street || addr.residential || '';
            const houseNum = addr.house_number ? `No. ${addr.house_number}` : '';
            const sub = addr.suburb || addr.neighbourhood || addr.village || addr.quarter || '';
            
            let constructedStreet = [road, houseNum, sub].filter(Boolean).join(', ');
            if (!constructedStreet) {
              constructedStreet = data.display_name.split(',').slice(0, 3).join(', ');
            }

            // Kota / Kecamatan
            const district = addr.city_district || addr.suburb || addr.county || '';
            const city = addr.city || addr.town || addr.municipality || addr.state_district || '';
            const province = addr.state || '';
            const constructedCity = [district, city, province].filter(Boolean).slice(0, 2).join(', ');

            // Kode Pos
            const postCode = addr.postcode ? addr.postcode.replace(/[^0-9]/g, '') : '';

            if (constructedStreet) setAddress(constructedStreet);
            if (constructedCity) setDistrictCity(constructedCity);
            if (postCode) setPostalCode(postCode);

            showToast('Lokasi & alamat profil berhasil dideteksi! 📍✨', 'success');
          } else {
            showToast('Alamat tidak dapat diidentifikasi dari koordinat GPS.', 'error');
          }
        } catch (err: unknown) {
          console.error('Error reverse geocoding:', err);
          showToast('Gagal memproses titik GPS. Silakan lengkapi manual.', 'error');
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (error) => {
        setIsDetectingLocation(false);
        if (error.code === error.PERMISSION_DENIED) {
          showToast('Izin akses lokasi ditolak. Aktifkan GPS / Izin lokasi di browser.', 'error');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          showToast('Sinyal GPS lokasi tidak ditemukan.', 'error');
        } else if (error.code === error.TIMEOUT) {
          showToast('Waktu deteksi lokasi habis. Silakan coba lagi.', 'error');
        } else {
          showToast('Gagal mengakses GPS perangkat.', 'error');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      }
    );
  };

  // Sync form state when user changes
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setDistrictCity(user.districtCity || 'Jakarta Selatan, DKI Jakarta');
      setPostalCode(user.postalCode || '12190');
    }
  }, [user]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setInterval(() => setResendCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendCountdown]);

  // Handle Guest Request OTP
  const handleGuestSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim() || !authEmail.includes('@')) {
      showToast('Masukkan alamat email yang valid', 'error');
      return;
    }

    setIsAuthLoading(true);
    const res = await sendEmailOtp(authEmail);
    setIsAuthLoading(false);

    if (res.success) {
      setAuthStep('otp');
      setResendCountdown(30);
    }
  };

  // Handle Guest Verify OTP
  const handleGuestVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authOtp.trim() || authOtp.length < 6) {
      showToast('Masukkan 6 digit kode OTP', 'error');
      return;
    }

    setIsAuthLoading(true);
    await verifyEmailOtp(authEmail, authOtp);
    setIsAuthLoading(false);
  };

  // Handle Photo Upload (Max 1MB client-side check)
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoError('');

    // Check size limit: 1MB = 1048576 bytes
    if (file.size > 1024 * 1024) {
      const errMsg = `Ukuran foto melebihi 1MB (${(file.size / (1024 * 1024)).toFixed(2)} MB). Mohon pilih foto dengan ukuran maksimal 1MB.`;
      setPhotoError(errMsg);
      showToast('Ukuran foto maksimal 1MB!', 'error');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setPhotoError('Format file harus berupa gambar (JPG/PNG/WEBP).');
      showToast('Format file tidak valid!', 'error');
      return;
    }

    try {
      setIsUploadingPhoto(true);
      await uploadAvatar(file);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mengunggah foto';
      setPhotoError(msg);
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle Save Profile Form
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('Nama tidak boleh kosong', 'error');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      showToast('Format email tidak valid', 'error');
      return;
    }

    if (!phone.trim() || phone.length < 8) {
      showToast('Nomor telepon minimal 8 digit', 'error');
      return;
    }

    setIsSaving(true);
    const res = await updateUserProfile({
      name,
      email,
      phone,
      address,
      districtCity,
      postalCode,
    });
    setIsSaving(false);

    if (res.success) {
      showToast('Profil pengguna berhasil disimpan! ✨', 'success');
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-safe-nav">
      {/* Header */}
      <div className="p-4 bg-gradient-to-b from-pink-50/70 to-white border-b border-pink-100 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-pink-500" />
            <h1 className="text-lg font-bold text-slate-800">Profil Saya</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {isGuest || !user ? 'Masuk atau buat akun baru dengan OTP' : 'Kelola data akun, foto profil (max 1MB), & alamat'}
          </p>
        </div>

        {!isGuest && user && (
          <button
            onClick={signOut}
            className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 border border-rose-100 text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Keluar
          </button>
        )}
      </div>

      {/* Profile Body */}
      <div className="p-4 space-y-4 flex-1">
        {/* IF GUEST OR NO USER: Show OTP Login / Register Screen */}
        {isGuest || !user ? (
          <div className="bg-white rounded-3xl p-5 border border-pink-100 shadow-sm space-y-4">
            <div className="text-center pb-2">
              <div className="w-16 h-16 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
                <UserPlus className="w-8 h-8" />
              </div>
              <h2 className="text-base font-bold text-slate-800">Masuk / Daftar Akun</h2>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Gunakan <strong>OTP Email</strong> (tanpa ribet password). Akun otomatis terbuat jika belum terdaftar.
              </p>
            </div>

            {authStep === 'email' ? (
              <form onSubmit={handleGuestSendOtp} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Alamat Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-pink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="w-full text-xs pl-10 pr-3 py-3 bg-pink-50/40 border border-pink-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white text-slate-800"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isAuthLoading || !authEmail.includes('@')}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-pink-500/25 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isAuthLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Mengirim Kode OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Kirim 6-Digit Kode OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleGuestVerifyOtp} className="space-y-3.5">
                <div className="text-center pb-1">
                  <span className="text-xs text-slate-500 block">Kode verifikasi dikirim ke:</span>
                  <span className="text-xs font-bold text-pink-600">{authEmail}</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 text-center">
                    Masukkan 6-Digit Kode OTP
                  </label>
                  <div className="relative max-w-[200px] mx-auto">
                    <KeyRound className="w-4 h-4 text-pink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={authOtp}
                      onChange={(e) => setAuthOtp(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="123456"
                      autoFocus
                      className="w-full text-center tracking-[0.35em] font-mono text-base font-bold pl-8 pr-3 py-3 bg-pink-50/50 border-2 border-pink-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white text-slate-800"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isAuthLoading || authOtp.length < 6}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-pink-500/25 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isAuthLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Memverifikasi...</span>
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
                    onClick={() => setAuthStep('email')}
                    className="text-slate-500 hover:text-slate-700 underline text-[11px]"
                  >
                    Ganti Email
                  </button>

                  <button
                    type="button"
                    onClick={() => sendEmailOtp(authEmail)}
                    disabled={resendCountdown > 0 || isAuthLoading}
                    className="text-pink-600 font-semibold hover:text-pink-700 disabled:text-slate-400 text-[11px]"
                  >
                    {resendCountdown > 0 ? `Kirim ulang (${resendCountdown}s)` : 'Kirim Ulang OTP'}
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <>
            {/* Authenticated User Profile Card & Avatar Upload */}
            <div className="bg-white rounded-3xl p-4 border border-pink-100 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-r from-pink-400 via-rose-300 to-pink-200 opacity-30" />

              <div className="relative mt-4">
                <div className="w-24 h-24 rounded-full ring-4 ring-white shadow-md overflow-hidden bg-pink-100 flex items-center justify-center relative group">
                  {user.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-pink-600">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  )}

                  {isUploadingPhoto && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                {/* Camera Button to Trigger Hidden File Input */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 rounded-full bg-pink-500 hover:bg-pink-600 text-white shadow-md ring-2 ring-white transition-all transform hover:scale-110 active:scale-95"
                  aria-label="Ganti foto profil"
                >
                  <Camera className="w-4 h-4" />
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoSelect}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                />
              </div>

              <span className="text-[10px] text-pink-600 font-semibold bg-pink-50 border border-pink-200 px-2.5 py-0.5 rounded-full mt-2">
                Maksimal Foto: 1 MB
              </span>

              {photoError && (
                <div className="mt-2 p-2 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-600 flex items-center gap-1.5 max-w-xs text-left">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{photoError}</span>
                </div>
              )}

              <h2 className="text-base font-bold text-slate-800 mt-2">{user.name}</h2>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>

            {/* Edit Profile Form (CRUD) */}
            <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-4 border border-pink-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-pink-50">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                  Informasi Akun User
                </span>
                <span className="text-[10px] text-slate-400">Data akun Anda</span>
              </div>

              {/* Edit Nama */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama user"
                    className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white text-slate-800"
                  />
                </div>
              </div>

              {/* Edit Email (Read Only or Sync) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Email (Akun OTP)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Edit Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor WhatsApp / HP
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="081234567890"
                    maxLength={15}
                    className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white text-slate-800 font-mono tracking-wide"
                  />
                </div>
              </div>

              {/* Edit Alamat Utama with GPS Auto-Detect Button */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Alamat Lengkap Utama
                  </label>
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={isDetectingLocation}
                    className="text-[11px] text-pink-600 hover:text-pink-700 font-semibold flex items-center gap-1 bg-pink-50 hover:bg-pink-100 border border-pink-200 px-2 py-0.5 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isDetectingLocation ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Mendeteksi...</span>
                      </>
                    ) : (
                      <>
                        <LocateFixed className="w-3 h-3" />
                        <span>Deteksi GPS</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={2}
                    placeholder="Alamat rumah / kantor untuk pengiriman bunga"
                    className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white text-slate-800 resize-none"
                  />
                </div>
              </div>

              {/* District / City & Postal Code */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Kota / Wilayah
                  </label>
                  <input
                    type="text"
                    value={districtCity}
                    onChange={(e) => setDistrictCity(e.target.value)}
                    placeholder="Jakarta Selatan"
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Kode Pos
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="12190"
                    maxLength={5}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 text-slate-800 font-mono"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSaving}
                className="w-full mt-2 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-pink-500/20 transition-all active:scale-95"
              >
                {isSaving ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Menyimpan Perubahan...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan Profil</span>
                  </>
                )}
              </button>
            </form>
          </>
        )}

        {/* Customer Support & Florist Quality Guarantee Card */}
        <div className="bg-gradient-to-br from-pink-50 via-white to-pink-50/50 rounded-3xl p-4 border border-pink-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-pink-100">
            <HeartHandshake className="w-4 h-4 text-pink-500" />
            <span className="text-xs font-bold text-slate-800">Layanan Pelanggan KyuFlorist</span>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-pink-500 shrink-0" />
              <span>Jam Operasional: <strong>07:00 - 21:00 WIB</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Jaminan Bunga <strong>100% Segar & Wangi</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Gratis Kartu Ucapan Custom (100 Karakter)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
