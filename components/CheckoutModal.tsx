'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { SHIPPING_METHODS, BRANCH_LOCATIONS, GREETING_SUGGESTIONS } from '@/lib/data';
import { ShippingMethodType, BranchOption, BankAccount } from '@/types';
import confetti from 'canvas-confetti';
import {
  X,
  FileText,
  Truck,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Copy,
  Check,
  Building2,
  AlertCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  Store,
  Lock,
  AtSign,
  Calendar,
  Package,
  MessageSquareHeart,
  MessageCircle,
  ExternalLink,
  Phone
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const { isCheckoutOpen, closeCheckout, cart, cartTotal, user, createOrder, setActiveTab, showToast, paymentMethods } = useApp();

  // Active sub-step: 1 (Format Order Penerima), 2 (Pengiriman), 3 (Pembayaran), 4 (Preview)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Format Order Penerima State
  const todayStr = new Date().toISOString().split('T')[0];
  const [orderDate, setOrderDate] = useState<string>(todayStr);
  const [pickupDate, setPickupDate] = useState<string>(todayStr);
  const [pickupTime, setPickupTime] = useState<string>('14:00');
  const [recipientName, setRecipientName] = useState(user?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '');
  const [instagramUsername, setInstagramUsername] = useState('');
  const [cardMessage, setCardMessage] = useState<string>('');
  const [packagingOption, setPackagingOption] = useState<'Tanpa Kresek' | 'Kresek Kecil' | 'Kresek Besar'>('Tanpa Kresek');
  const [customOrderNotes, setCustomOrderNotes] = useState('');
  const [addressError, setAddressError] = useState('');

  // Step 2: Shipping & Branch State
  const [selectedShipping, setSelectedShipping] = useState<ShippingMethodType>('Ambil di Toko');
  const [selectedBranch, setSelectedBranch] = useState<BranchOption>('Cabang Buluh Indah (Denpasar)');

  // Step 3: Payment Bank State
  const defaultBank: BankAccount = {
    bankName: 'SEABANK',
    accountNumber: '901527030920',
    accountHolder: 'Ni Wayan Sutiari',
    logo: 'SEABANK',
    color: '#FF5722'
  };
  const [selectedBank, setSelectedBank] = useState<BankAccount>(defaultBank);
  const [paymentChannel, setPaymentChannel] = useState<'Bank' | 'QRIS'>('Bank');
  const [paymentTerm, setPaymentTerm] = useState<'DP' | 'Full Payment'>('DP');
  const [isCopied, setIsCopied] = useState(false);
  const [isMessageCopied, setIsMessageCopied] = useState(false);

  // Step 4: 5-second countdown timer for final "Pesan Sekarang" button
  const [countdown, setCountdown] = useState<number>(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Selected Branch Object & WhatsApp Destination
  const selectedBranchObj =
    BRANCH_LOCATIONS.find((b) => b.name === selectedBranch) || BRANCH_LOCATIONS[0];
  const rawBranchPhone = selectedBranchObj.phone.replace(/\D/g, '');
  const cleanBranchWa = rawBranchPhone.startsWith('62')
    ? rawBranchPhone
    : rawBranchPhone.startsWith('0')
    ? `62${rawBranchPhone.slice(1)}`
    : `62${rawBranchPhone}`;

  // Operating Hours Calculator for chosen date
  const getOperatingHours = (dateStr: string) => {
    if (!dateStr) {
      return {
        isOpen: true,
        dayType: 'weekday' as const,
        dayLabel: 'Senin - Jumat',
        openTime: '09:00',
        closeTime: '19:00',
        maxPickup: '18:30',
        timeSlots: [
          '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
          '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
          '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
          '18:00', '18:30'
        ],
        scheduleText: 'Buka 09.00 - 19.00 WITA (Maks. Pickup 18.30)',
      };
    }

    const [y, m, d] = dateStr.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    const day = dateObj.getDay(); // 0: Sunday, 1: Monday, ..., 6: Saturday

    if (day === 0) {
      return {
        isOpen: false,
        dayType: 'sunday' as const,
        dayLabel: 'Minggu',
        openTime: '',
        closeTime: '',
        maxPickup: '',
        timeSlots: [],
        scheduleText: 'Toko Libur di Hari Minggu',
      };
    }

    if (day === 6) {
      return {
        isOpen: true,
        dayType: 'saturday' as const,
        dayLabel: 'Sabtu',
        openTime: '09:00',
        closeTime: '18:30',
        maxPickup: '18:00',
        timeSlots: [
          '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
          '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
          '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
          '18:00'
        ],
        scheduleText: 'Buka 09.00 - 18.30 WITA (Maks. Pickup 18.00)',
      };
    }

    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return {
      isOpen: true,
      dayType: 'weekday' as const,
      dayLabel: `${dayNames[day]} (Senin - Jumat)`,
      openTime: '09:00',
      closeTime: '19:00',
      maxPickup: '18:30',
      timeSlots: [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
        '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
        '18:00', '18:30'
      ],
      scheduleText: 'Buka 09.00 - 19.00 WITA (Maks. Pickup 18.30)',
    };
  };

  const currentSchedule = getOperatingHours(pickupDate);

  const handlePickupDateChange = (newDate: string) => {
    setPickupDate(newDate);
    const op = getOperatingHours(newDate);
    if (!op.isOpen) {
      setAddressError('Toko libur di hari Minggu. Silakan pilih hari Senin s/d Sabtu.');
    } else {
      setAddressError('');
      if (pickupTime > op.maxPickup) {
        setPickupTime(op.maxPickup);
      } else if (pickupTime < op.openTime) {
        setPickupTime(op.openTime);
      }
    }
  };

  // Reset or initialize state when opening
  useEffect(() => {
    if (paymentMethods.length > 0) {
      const seaBankFound = paymentMethods.find((m) => m.bankName.toUpperCase().includes('SEABANK'));
      if (seaBankFound) {
        setSelectedBank(seaBankFound);
      } else if (!paymentMethods.some((method) => method.bankName === selectedBank.bankName)) {
        setSelectedBank(paymentMethods[0]);
      }
    }
  }, [paymentMethods, selectedBank.bankName]);

  useEffect(() => {
    if (isCheckoutOpen) {
      setCurrentStep(1);
      const currDate = new Date().toISOString().split('T')[0];
      setOrderDate(currDate);
      setPickupDate(currDate);
      setPickupTime('14:00');
      setRecipientName(user?.name || '');
      setPhoneNumber(user?.phone || '');
      setInstagramUsername('');
      const initialGreeting = cart.find((c) => c.greetingCardText)?.greetingCardText || '';
      setCardMessage(initialGreeting);
      setPackagingOption('Tanpa Kresek');
      setCustomOrderNotes('');
      setAddressError('');
    }
  }, [isCheckoutOpen, user, cart]);

  // Start 5-second countdown timer when reaching Preview (Step 4)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCheckoutOpen && currentStep === 4) {
      setCountdown(5);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isCheckoutOpen, currentStep]);

  if (!isCheckoutOpen) return null;

  // Selected shipping object, packaging fee & add card fee (Rp 3.000 if text is filled)
  const shippingMethodObj = SHIPPING_METHODS.find((s) => s.id === selectedShipping) || SHIPPING_METHODS[0];
  const shippingCost = shippingMethodObj.price;
  const packagingCost = packagingOption === 'Kresek Kecil' ? 3000 : packagingOption === 'Kresek Besar' ? 5000 : 0;
  const isCardAdded = cardMessage.trim().length > 0;
  const cardFee = isCardAdded ? 3000 : 0;
  const isUnder100k = cartTotal < 100000;
  const grandTotal = cartTotal + shippingCost + packagingCost + cardFee;
  const dpAmount = Math.ceil(grandTotal * 0.5);

  const formatRupiah = (val: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);

  // Copy Account Number helper
  const handleCopyAccount = (accountNum: string) => {
    navigator.clipboard.writeText(accountNum.replace(/[^0-9]/g, ''));
    setIsCopied(true);
    showToast('Nomor rekening disalin! 📋', 'success');
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Order summary string
  const orderSummaryText = cart
    .map((it) => `${it.quantity}x ${it.product.name} (${it.color.name})`)
    .join(', ');

  // Product Images preview list for WhatsApp
  const productImagesText = cart
    .map((it) => `- ${it.product.name} (${it.color.name}): ${it.color.image || it.product.image}`)
    .join('\n');

  // Generate complete WhatsApp format message
  const generateWhatsAppMessage = () => {
    const cleanIg = instagramUsername.trim().replace(/^@/, '');
    const finalAmountLabel =
      paymentTerm === 'DP'
        ? `DP 50% (${formatRupiah(dpAmount)}) dari Total ${formatRupiah(grandTotal)}`
        : `Full Payment (${formatRupiah(grandTotal)})`;

    return `FORMAT ORDER PENERIMA 📝

WAJIB LENGKAP, TIDAK LENGKAP TIDAK DI KEEP!!
Tgl Pemesanan : ${orderDate}
Tanggal & Jam Pengambilan : ${pickupDate} - ${pickupTime} WITA
Nama : ${recipientName}
No Wa : ${phoneNumber}
Orderan : ${orderSummaryText}${customOrderNotes ? ` (Catatan: ${customOrderNotes})` : ''}
Nama ig(wajib isi): @${cleanIg}
Add Card : ${isCardAdded ? `"${cardMessage.trim()}" (+Rp 3.000)` : 'Tanpa Kartu Ucapan'}
Pilihan Kresek : ${packagingOption} (${packagingCost === 0 ? 'Gratis' : formatRupiah(packagingCost)})
Cabang Pengambilan : ${selectedBranch} (${selectedBranchObj.phone})

Foto Preview Produk :
${productImagesText}

Pengambilan pesanan hanya dapat dilakukan pada jam operasional dan sesuai jadwal pada format order. 

BUCKET TIDAK DAPAT DIBUAT SAMA PERSIS DENGAN FOTO KARENA BUATAN TANGAN DAN KETERSEDIAAN BUNGA BERBEDA SETIAP HARINYA. UNTUK UKURAN TETAP SAMA

Pembayaran wajib Dp 50%
 ( CANCEL = DP HANGUS )

${isUnder100k ? 'Dibawah 100rb, WAJIB Full pembayaran dan add card 3rb\n\n' : ''}Metode pembayaran :
-${selectedBank.bankName || 'SEABANK'} ${selectedBank.accountNumber || '901527030920'} a/n ${selectedBank.accountHolder || 'Ni Wayan Sutiari'}
Status Pembayaran : ${paymentTerm} (${finalAmountLabel})

Noted: Setelah transfer wajib memberi foto bukti transfer dan nama rekening!!
Jam tutup dan buka toko
Senin - Jumat : 09.00 - 19.00
Max pickup pukul 18.30

Sabtu 09.00 - 18.30
Max pickup pukul 18.00

⚠️ pengambilan bucket lebih dari 10 menit dari jam tutup toko di kenakan charge 50.000`;
  };

  const handleCopyWhatsAppMessage = () => {
    navigator.clipboard.writeText(generateWhatsAppMessage());
    setIsMessageCopied(true);
    showToast('Format order WhatsApp berhasil disalin! 📋✨', 'success');
    setTimeout(() => setIsMessageCopied(false), 2500);
  };

  // Validate Step 1 (Format Order Penerima)
  const handleNextFromAddress = () => {
    if (!orderDate) {
      setAddressError('Tanggal pemesanan wajib diisi');
      return;
    }
    if (!pickupDate || !pickupTime) {
      setAddressError('Tanggal dan jam pengambilan wajib ditentukan');
      return;
    }

    const op = getOperatingHours(pickupDate);
    if (!op.isOpen) {
      setAddressError('Toko libur di hari Minggu. Silakan pilih hari Senin s/d Sabtu.');
      return;
    }

    if (pickupTime < op.openTime || pickupTime > op.maxPickup) {
      setAddressError(
        `Jam pengambilan untuk ${op.dayLabel} harus antara pukul ${op.openTime} s/d ${op.maxPickup} WITA (sesuai jam operasional toko).`
      );
      return;
    }

    if (!recipientName.trim()) {
      setAddressError('Nama pemesan / penerima wajib diisi');
      return;
    }
    if (!phoneNumber.trim() || phoneNumber.length < 9) {
      setAddressError('Nomor WhatsApp tidak valid (minimal 9 digit)');
      return;
    }
    if (!instagramUsername.trim()) {
      setAddressError('Nama akun Instagram (IG) wajib diisi');
      return;
    }
    setAddressError('');
    setCurrentStep(2);
  };

  // Submit Final Order & Automatically open WhatsApp to the selected branch
  const handleFinalOrder = async () => {
    if (countdown > 0 || isSubmitting) return;

    try {
      setIsSubmitting(true);

      const orderItems = cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.image,
        colorName: item.color.name,
        colorHex: item.color.hex,
        price: item.finalPrice,
        quantity: item.quantity,
        greetingCardText: cardMessage.trim() || undefined,
      }));

      const cleanIg = instagramUsername.trim().replace(/^@/, '');
      const fullFormatText = `[Format Order] Tgl Order: ${orderDate} | Pengambilan: ${pickupDate} ${pickupTime} | IG: @${cleanIg}${
        isCardAdded ? ` | Add Card: "${cardMessage.trim()}" (+Rp 3.000)` : ''
      } | Kresek: ${packagingOption}${customOrderNotes ? ` | Catatan: ${customOrderNotes}` : ''}`;

      await createOrder({
        items: orderItems,
        shippingAddress: {
          recipientName,
          phoneNumber,
          fullAddress: fullFormatText,
          districtCity: selectedBranch,
          postalCode: '-',
          notes: `IG: @${cleanIg} | Pengambilan: ${pickupDate} ${pickupTime} | ${
            isCardAdded ? `Card: "${cardMessage.trim()}" | ` : ''
          }${packagingOption}${customOrderNotes ? ` | ${customOrderNotes}` : ''}`,
        },
        shippingMethod: selectedShipping,
        shippingCost: shippingCost + packagingCost + cardFee,
        branch: selectedBranch,
        paymentBank: {
          ...selectedBank,
          bankName: `${selectedBank.bankName || 'SEABANK'} - ${paymentChannel} - ${paymentTerm}`,
        },
        paymentStatus: 'Belum Bayar',
        subtotal: cartTotal,
        totalAmount: grandTotal,
        estimatedDelivery: `Pengambilan: ${pickupDate} ${pickupTime} WITA`,
      });

      // Fire confetti animation!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF6B8B', '#FFB3C6', '#FB7185', '#F43F5E', '#FFE4E6'],
        });
      } catch (e) {
        console.error(e);
      }

      // Automatically redirect to WhatsApp of the chosen branch!
      const waMessage = generateWhatsAppMessage();
      const waUrl = `https://api.whatsapp.com/send?phone=${cleanBranchWa}&text=${encodeURIComponent(waMessage)}`;

      if (typeof window !== 'undefined') {
        window.open(waUrl, '_blank');
      }

      showToast(`Pesanan dibuat & dialihkan ke WhatsApp ${selectedBranch}! 🎉`, 'success');
      closeCheckout();
      setActiveTab('orders');
    } catch (err) {
      console.error(err);
      showToast('Gagal memproses pesanan, coba lagi', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepsList = [
    { num: 1, label: 'Format Order', icon: FileText },
    { num: 2, label: 'Pengiriman', icon: Truck },
    { num: 3, label: 'Pembayaran', icon: CreditCard },
    { num: 4, label: 'Preview', icon: CheckCircle2 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border-t sm:border border-pink-100 animate-in slide-in-from-bottom-8 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Checkout Header with Close */}
        <div className="bg-white px-4 pt-4 pb-2 border-b border-pink-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse" />
              <h2 className="text-base font-bold text-slate-800">Checkout KyuFlorist</h2>
            </div>
            <button
              onClick={closeCheckout}
              className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Stepper Indicator */}
          <div className="flex items-center justify-between relative px-2 py-1">
            <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-0.5 bg-slate-100 -z-0" />
            <div
              className="absolute top-1/2 left-6 -translate-y-1/2 h-0.5 bg-pink-500 transition-all duration-300 -z-0"
              style={{ width: `${((currentStep - 1) / 3) * 85}%` }}
            />

            {stepsList.map((st) => {
              const isPassed = currentStep > st.num;
              const isCurrent = currentStep === st.num;
              const Icon = st.icon;

              return (
                <div key={st.num} className="flex flex-col items-center z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      isCurrent
                        ? 'bg-pink-500 text-white shadow-md shadow-pink-500/40 ring-4 ring-pink-100 scale-110'
                        : isPassed
                        ? 'bg-pink-100 text-pink-600'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isPassed ? <Check className="w-4 h-4 stroke-[3]" /> : <Icon className="w-3.5 h-3.5" />}
                  </div>
                  <span
                    className={`text-[10px] mt-1 font-semibold tracking-tight ${
                      isCurrent ? 'text-pink-600 font-bold' : isPassed ? 'text-slate-700' : 'text-slate-400'
                    }`}
                  >
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Checkout Dynamic Content by Step */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {/* STEP 1: FORMAT ORDER PENERIMA 📝 */}
          {currentStep === 1 && (
            <div className="space-y-3.5 animate-in fade-in duration-200">
              {/* Header Format Notice Card */}
              <div className="p-3.5 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 rounded-2xl text-white shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-pink-100" />
                    <h3 className="text-sm font-bold tracking-tight">FORMAT ORDER PENERIMA 📝</h3>
                  </div>
                  <span className="text-[9px] font-bold uppercase bg-white/20 px-2 py-0.5 rounded-full border border-white/30">
                    Wajib Lengkap
                  </span>
                </div>
                <p className="text-xs font-bold text-amber-200 mt-2 flex items-center gap-1.5">
                  ⚠️ WAJIB LENGKAP, TIDAK LENGKAP TIDAK DI KEEP!!
                </p>
                <p className="text-[11px] text-pink-100 mt-1 leading-relaxed opacity-95">
                  Pengambilan pesanan hanya dapat dilakukan pada jam operasional dan sesuai jadwal pada format order.
                </p>
              </div>

              {addressError && (
                <div className="flex items-center gap-2 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{addressError}</span>
                </div>
              )}

              {/* Form Input Fields */}
              <div className="space-y-3 bg-white p-3.5 rounded-2xl border border-pink-100 shadow-2xs">
                {/* 1. Tgl Pemesanan */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-pink-500" />
                    Tgl Pemesanan *
                  </label>
                  <input
                    type="date"
                    value={orderDate}
                    onChange={(e) => setOrderDate(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white text-slate-800 font-semibold"
                  />
                </div>

                {/* 2. Tanggal & Jam Pengambilan (Terkunci Sesuai Jam Operasional) */}
                <div className="space-y-2.5 p-3 bg-slate-50/70 border border-pink-100 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold text-slate-800 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-pink-500" />
                      Tanggal & Jam Pengambilan *
                    </label>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        !currentSchedule.isOpen
                          ? 'bg-rose-100 text-rose-700'
                          : currentSchedule.dayType === 'saturday'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {currentSchedule.dayLabel}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <span className="text-[10px] text-slate-500 block mb-0.5 font-semibold">Pilih Tanggal Pengambilan:</span>
                      <input
                        type="date"
                        min={todayStr}
                        value={pickupDate}
                        onChange={(e) => handlePickupDateChange(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 text-slate-800 font-semibold"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block mb-0.5 font-semibold">Pilih Jam Pengambilan (WITA):</span>
                      <select
                        disabled={!currentSchedule.isOpen}
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 text-slate-800 font-bold disabled:opacity-50 disabled:bg-slate-100 cursor-pointer"
                      >
                        {currentSchedule.isOpen ? (
                          currentSchedule.timeSlots.map((slot) => (
                            <option key={slot} value={slot}>
                              Pukul {slot} WITA
                            </option>
                          ))
                        ) : (
                          <option value="">Toko Libur</option>
                        )}
                      </select>
                    </div>
                  </div>

                  {/* Grid of Strict Preset 30-Minute Time Options */}
                  {currentSchedule.isOpen ? (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] text-slate-500 font-semibold">
                          Opsi Jam Tersedia ({currentSchedule.scheduleText}):
                        </span>
                        <span className="text-[10px] text-pink-600 font-bold font-mono">
                          Dipilih: {pickupTime} WITA
                        </span>
                      </div>
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 max-h-36 overflow-y-auto pr-0.5">
                        {currentSchedule.timeSlots.map((slot) => {
                          const isSelected = pickupTime === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setPickupTime(slot)}
                              className={`text-[11px] py-1.5 px-1 rounded-xl border font-mono transition-all ${
                                isSelected
                                  ? 'bg-pink-500 text-white font-bold border-pink-500 shadow-sm shadow-pink-500/25 ring-2 ring-pink-200 scale-[1.02]'
                                  : 'bg-white text-slate-700 border-slate-200 hover:border-pink-300 hover:bg-pink-50/40'
                              }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-[11px] font-medium flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>Toko libur pada hari Minggu. Mohon ganti tanggal ke hari Senin s/d Sabtu.</span>
                    </div>
                  )}

                  {/* Operational Hours Notice */}
                  <div className="mt-1 p-2 bg-amber-50/90 border border-amber-200/80 rounded-xl text-[10px] text-amber-900 space-y-0.5">
                    <div className="font-bold flex items-center gap-1 text-amber-800">
                      <Clock className="w-3 h-3 text-amber-600" />
                      Aturan Jam Buka & Tutup KyuFlorist:
                    </div>
                    <p>• <strong>Senin - Jumat :</strong> 09.00 - 19.00 (Max pickup pukul 18.30)</p>
                    <p>• <strong>Sabtu :</strong> 09.00 - 18.30 (Max pickup pukul 18.00)</p>
                    <p className="text-rose-700 font-bold pt-0.5 border-t border-amber-200">
                      ⚠️ Pengambilan bucket lebih dari 10 menit dari jam tutup toko dikenakan charge Rp 50.000
                    </p>
                  </div>
                </div>

                {/* 3. Nama */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Nama Pemesan / Penerima *
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Contoh: Ni Wayan / Maya Putri"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white text-slate-800"
                  />
                </div>

                {/* 4. No Wa */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    No Wa (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="081234567890"
                    maxLength={15}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white text-slate-800 font-mono tracking-wide"
                  />
                </div>

                {/* 5. Orderan Summary */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Package className="w-3.5 h-3.5 text-pink-500" />
                      Orderan ({cart.length} item) *
                    </span>
                    <span className="text-[10px] text-pink-600 font-normal">Otomatis dari keranjang</span>
                  </label>
                  <div className="bg-pink-50/40 p-2.5 rounded-xl border border-pink-100 space-y-1.5">
                    {cart.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start text-[11px]">
                        <div>
                          <span className="font-semibold text-slate-800">
                            {item.quantity}x {item.product.name}
                          </span>
                          <span className="text-slate-500 block text-[10px]">
                            {item.color.name}
                          </span>
                        </div>
                        <span className="font-bold text-pink-600 text-xs shrink-0">
                          {formatRupiah(item.finalPrice * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 6. Nama IG (Wajib Isi) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <AtSign className="w-3.5 h-3.5 text-pink-500" />
                    Nama ig (wajib isi) *
                  </label>
                  <div className="flex items-center rounded-xl overflow-hidden border border-slate-200 bg-slate-50 focus-within:ring-2 focus-within:ring-pink-300 focus-within:border-pink-400 focus-within:bg-white">
                    <span className="px-3 py-2.5 bg-slate-100 text-slate-500 font-bold text-xs border-r border-slate-200 select-none">
                      @
                    </span>
                    <input
                      type="text"
                      value={instagramUsername}
                      onChange={(e) => setInstagramUsername(e.target.value.replace(/^@/, ''))}
                      placeholder="username_instagram_anda"
                      className="w-full text-xs p-2.5 bg-transparent focus:outline-none text-slate-800"
                    />
                  </div>
                </div>

                {/* 7. Add Card / Kartu Ucapan (+Rp 3.000 Opsional) */}
                <div className="space-y-1.5 bg-pink-50/40 p-3 rounded-2xl border border-pink-100">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                      <MessageSquareHeart className="w-3.5 h-3.5 text-pink-500" />
                      Add Card / Kartu Ucapan (Opsional)
                    </label>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all ${
                        isCardAdded
                          ? 'bg-pink-500 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {isCardAdded ? '+Rp 3.000 Terpasang' : 'Opsional (+Rp 3rb jika diisi)'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Tulis pesan untuk kartu ucapan. Jika diisi teks, otomatis ditambahkan biaya kartu <strong>Rp 3.000</strong>.
                  </p>
                  <textarea
                    value={cardMessage}
                    onChange={(e) => setCardMessage(e.target.value)}
                    placeholder="Contoh: Happy Birthday! Wishing you joy and happiness 🎂🌸 (Kosongkan jika tanpa kartu)"
                    rows={2}
                    maxLength={120}
                    className="w-full text-xs p-2.5 bg-white border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 text-slate-800 resize-none"
                  />
                  {/* Quick template suggestions */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {GREETING_SUGGESTIONS.slice(0, 4).map((template, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCardMessage(template)}
                        className="text-[10px] bg-white hover:bg-pink-100 hover:text-pink-700 text-slate-600 px-2 py-1 rounded-lg border border-pink-100 transition-colors truncate max-w-[180px]"
                      >
                        {template.split('!')[0]}!
                      </button>
                    ))}
                  </div>
                </div>

                {/* 8. Pilihan Kresek */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                    Pilihan Kresek / Kantong :
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'Tanpa Kresek', label: 'Tanpa Kresek', price: 0 },
                      { id: 'Kresek Kecil', label: 'Kresek Kecil', price: 3000 },
                      { id: 'Kresek Besar', label: 'Kresek Besar', price: 5000 },
                    ].map((opt) => {
                      const isSelected = packagingOption === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setPackagingOption(opt.id as any)}
                          className={`p-2.5 rounded-xl border text-center transition-all ${
                            isSelected
                              ? 'border-pink-500 bg-pink-50 ring-2 ring-pink-300 font-bold text-pink-700'
                              : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:border-pink-200'
                          }`}
                        >
                          <span className="text-[11px] block">{opt.label}</span>
                          <span className="text-[10px] text-slate-500 font-normal">
                            {opt.price === 0 ? 'Gratis' : `+${formatRupiah(opt.price)}`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 9. Catatan Tambahan (Opsional) */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Catatan Orderan (Opsional)
                  </label>
                  <input
                    type="text"
                    value={customOrderNotes}
                    onChange={(e) => setCustomOrderNotes(e.target.value)}
                    placeholder="Contoh: Request pita warna soft pink / ambil tepat jam 2 siang"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white text-slate-800"
                  />
                </div>
              </div>

              {/* Syarat & Ketentuan Tambahan */}
              <div className="space-y-2">
                {/* Under 100k rule */}
                {isUnder100k && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Ketentuan Belanja di Bawah Rp 100.000:</span>
                      <p className="text-[11px] text-rose-700 mt-0.5">
                        Dibawah 100rb, WAJIB Full pembayaran dan add card 3rb.
                      </p>
                    </div>
                  </div>
                )}

                {/* Bucket Handcraft Notice & DP Rules */}
                <div className="p-3.5 bg-pink-50/70 border border-pink-200 rounded-2xl text-[11px] text-slate-700 space-y-2">
                  <p className="leading-relaxed">
                    💐 <strong>BUCKET TIDAK DAPAT DIBUAT SAMA PERSIS DENGAN FOTO</strong> KARENA BUATAN TANGAN DAN KETERSEDIAAN BUNGA BERBEDA SETIAP HARINYA. UNTUK UKURAN TETAP SAMA.
                  </p>
                  <p className="leading-relaxed text-pink-900 font-medium">
                    💳 <strong>Pembayaran wajib DP 50%</strong> ( CANCEL = DP HANGUS ).
                  </p>
                  <p className="leading-relaxed text-slate-600 border-t border-pink-100 pt-1.5">
                    📸 <strong>Noted:</strong> Setelah transfer wajib memberi foto bukti transfer dan nama rekening!!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PENGIRIMAN & CABANG */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* 1. Pilih Cabang Toko */}
              <div>
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-2">
                  <Building2 className="w-3.5 h-3.5 text-pink-500" />
                  Pilih Lokasi Cabang Toko (WhatsApp Tujuan):
                </label>
                <div className="space-y-2">
                  {BRANCH_LOCATIONS.map((br) => {
                    const isSelected = selectedBranch === br.name;
                    return (
                      <div
                        key={br.name}
                        onClick={() => setSelectedBranch(br.name as BranchOption)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-pink-500 bg-pink-50/80 ring-2 ring-pink-300 shadow-sm'
                            : 'border-slate-200 bg-white hover:border-pink-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800">{br.name}</span>
                          {br.isPusat && (
                            <span className="text-[10px] bg-pink-500 text-white font-bold px-2 py-0.5 rounded-full shadow-2xs">
                              Pusat
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1">{br.address}</p>
                        <div className="flex items-center justify-between text-[11px] text-slate-600 mt-2 pt-2 border-t border-pink-100/70">
                          <span className="flex items-center gap-1">⏰ {br.hours}</span>
                          <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 flex items-center gap-1">
                            <MessageCircle className="w-3 h-3 text-emerald-600" />
                            {br.phone}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Pilih Layanan Pengiriman (Ambil di Toko / GoSend) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-pink-500" />
                    Metode Pengambilan / Pengiriman:
                  </label>
                  {cartTotal >= 500000 ? (
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                      ✓ GoSend Aktif (&gt;= Rp 500k)
                    </span>
                  ) : (
                    <span className="text-[10px] bg-amber-50 text-amber-700 font-semibold px-2 py-0.5 rounded-full border border-amber-200">
                      GoSend Min. Rp 500.000
                    </span>
                  )}
                </div>

                <div className="space-y-2.5">
                  {SHIPPING_METHODS.map((sm) => {
                    const isSelected = selectedShipping === sm.id;
                    const isGoSend = sm.id === 'GoSend';
                    const isLocked = isGoSend && cartTotal < 500000;

                    return (
                      <div
                        key={sm.id}
                        onClick={() => {
                          if (isLocked) {
                            showToast(
                              `Layanan GoSend memerlukan minimal belanja Rp 500.000. Belanja Anda saat ini ${formatRupiah(cartTotal)}.`,
                              'error'
                            );
                            return;
                          }
                          setSelectedShipping(sm.id);
                        }}
                        className={`p-3 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                          isLocked
                            ? 'border-slate-200 bg-slate-50/70 opacity-75 cursor-not-allowed'
                            : isSelected
                            ? 'border-pink-500 bg-pink-50/80 ring-2 ring-pink-300/60 shadow-xs cursor-pointer'
                            : 'border-slate-200 bg-white hover:border-pink-200 cursor-pointer'
                        }`}
                      >
                        <div className="flex gap-2.5 items-start">
                          <div
                            className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                              isLocked
                                ? 'bg-slate-200 text-slate-400'
                                : isSelected
                                ? 'bg-pink-500 text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {isLocked ? (
                              <Lock className="w-4 h-4" />
                            ) : sm.id === 'Ambil di Toko' ? (
                              <Store className="w-4 h-4" />
                            ) : (
                              <Truck className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-bold text-slate-800">{sm.name}</span>
                              {sm.id === 'Ambil di Toko' && (
                                <span className="text-[9px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.2 rounded">
                                  Gratis Ongkir
                                </span>
                              )}
                              {isGoSend && (
                                <span
                                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                    isLocked
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-pink-100 text-pink-700'
                                  }`}
                                >
                                  {isLocked ? '🔒 Min. Rp 500.000' : '✨ Siap Kirim'}
                                </span>
                              )}
                            </div>

                            <span className="text-[11px] text-pink-600 font-semibold block mt-0.5">
                              {sm.id === 'Ambil di Toko'
                                ? `Lokasi: ${selectedBranch}`
                                : `Estimasi: ${sm.estimate}`}
                            </span>

                            <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                              {sm.description}
                            </p>

                            {isLocked && (
                              <div className="mt-1.5 text-[10px] text-amber-700 bg-amber-50/80 p-1.5 rounded-lg border border-amber-200/80">
                                ⚠️ Tambah belanja <strong>{formatRupiah(500000 - cartTotal)}</strong> lagi untuk membuka opsi GoSend.
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span
                            className={`text-xs font-bold block ${
                              sm.price === 0 ? 'text-emerald-600' : 'text-slate-800'
                            }`}
                          >
                            {sm.price === 0 ? 'FREE (Rp 0)' : formatRupiah(sm.price)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PEMBAYARAN */}
          {currentStep === 3 && (
            <div className="space-y-3.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-pink-500" />
                  Metode & Rekening Pembayaran
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                  Tersedia DP 50%
                </span>
              </div>

              {/* Ketentuan DP vs Full Payment */}
              <div>
                <p className="text-[11px] font-bold text-slate-700 mb-1.5">Pilih Ketentuan Pembayaran :</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentTerm('DP')}
                    disabled={isUnder100k}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isUnder100k
                        ? 'opacity-40 bg-slate-50 cursor-not-allowed border-slate-200'
                        : paymentTerm === 'DP'
                        ? 'border-pink-500 bg-pink-50 ring-2 ring-pink-200'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">DP 50%</span>
                      {paymentTerm === 'DP' && !isUnder100k && <Check className="w-3.5 h-3.5 text-pink-600" />}
                    </div>
                    <span className="block text-[11px] text-pink-600 font-bold mt-0.5">
                      {formatRupiah(dpAmount)}
                    </span>
                    <span className="block text-[9px] text-slate-500 mt-0.5">
                      {isUnder100k ? 'Tidak berlaku < 100rb' : 'Wajib DP 50% (Cancel = DP Hangus)'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentTerm('Full Payment')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      paymentTerm === 'Full Payment'
                        ? 'border-pink-500 bg-pink-50 ring-2 ring-pink-200'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">Full Payment (100%)</span>
                      {paymentTerm === 'Full Payment' && <Check className="w-3.5 h-3.5 text-pink-600" />}
                    </div>
                    <span className="block text-[11px] text-pink-600 font-bold mt-0.5">
                      {formatRupiah(grandTotal)}
                    </span>
                    <span className="block text-[9px] text-slate-500 mt-0.5">
                      Bayar lunas seluruh total pesanan
                    </span>
                  </button>
                </div>
              </div>

              {/* Channel */}
              <div>
                <p className="text-[11px] font-bold text-slate-700 mb-1.5">Saluran Transfer :</p>
                <div className="grid grid-cols-2 gap-2">
                  {(['Bank', 'QRIS'] as const).map((channel) => (
                    <button
                      key={channel}
                      type="button"
                      onClick={() => setPaymentChannel(channel)}
                      className={`p-2.5 rounded-xl border text-left ${
                        paymentChannel === channel
                          ? 'border-pink-500 bg-pink-50 ring-2 ring-pink-200 font-semibold'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-800">
                        {channel === 'Bank' ? 'Transfer Bank' : 'QRIS'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bank Selection List */}
              <div>
                <p className="text-[11px] font-bold text-slate-700 mb-1.5">Pilih Rekening Tujuan :</p>
                <div className="grid grid-cols-2 gap-2">
                  {(paymentMethods.length > 0 ? paymentMethods : [defaultBank]).map((bank) => {
                    const isSelected = selectedBank.bankName === bank.bankName;
                    return (
                      <button
                        key={bank.bankName}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-pink-500 bg-pink-50 ring-2 ring-pink-300 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-pink-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-800">{bank.logo || bank.bankName}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-pink-600" />}
                        </div>
                        <span className="text-[10px] text-slate-500 line-clamp-1 block">
                          {bank.bankName}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Bank Account Card with Copy */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 rounded-2xl shadow-md relative overflow-hidden">
                <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 w-28 h-28 bg-white/5 rounded-full blur-xl pointer-events-none" />

                <div className="flex items-center justify-between text-xs text-slate-300 pb-2 border-b border-white/10">
                  <span className="font-semibold text-pink-300">{selectedBank.bankName}</span>
                  <span className="text-[10px] uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded font-mono">
                    Rekening Resmi
                  </span>
                </div>

                <div className="mt-3">
                  <span className="text-[11px] text-slate-400 block">Nomor Rekening:</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-lg font-mono font-bold tracking-wider text-amber-300">
                      {selectedBank.accountNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyAccount(selectedBank.accountNumber)}
                      className="px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors active:scale-95"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {isCopied ? 'Tersalin' : 'Salin'}
                    </button>
                  </div>
                </div>

                <div className="mt-2 text-xs text-slate-300">
                  <span className="text-[11px] text-slate-400 block">Atas Nama:</span>
                  <span className="font-semibold">{selectedBank.accountHolder}</span>
                </div>
              </div>

              {/* Proof note reminder */}
              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Noted:</strong> Setelah transfer wajib memberi foto bukti transfer dan nama rekening kepada admin!
                </span>
              </div>
            </div>
          )}

          {/* STEP 4: PREVIEW & WA REDIRECTION */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-3 bg-pink-50 border border-pink-200 rounded-2xl flex items-center gap-2.5 text-xs text-slate-700">
                <Sparkles className="w-4 h-4 text-pink-600 shrink-0" />
                <span>
                  Periksa ringkasan pesanan & foto produk sebelum konfirmasi pesanan via WhatsApp.
                </span>
              </div>

              {/* WhatsApp Destination Branch Card */}
              <div className="p-3.5 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border border-emerald-200 rounded-2xl">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        Tujuan Pesanan: {selectedBranch}
                      </span>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        {selectedBranchObj.address}
                      </p>
                      <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-1 font-semibold">
                        <span>⏰ {selectedBranchObj.hours}</span>
                        <span className="text-emerald-700">📞 {selectedBranchObj.phone}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[9px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full shrink-0 shadow-2xs">
                    Auto-Redirect WA
                  </span>
                </div>
              </div>

              {/* Preview Gambar Produk Yang Dipesan */}
              <div className="bg-white p-3.5 rounded-2xl border border-pink-100 shadow-2xs space-y-3">
                <span className="text-xs font-bold text-slate-800 flex items-center justify-between border-b border-pink-50 pb-2">
                  <span className="flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-pink-500" />
                    Preview Gambar Rangkaian ({cart.length} Produk)
                  </span>
                  <span className="text-[10px] text-pink-600 font-semibold">Siap Dibuat Florist</span>
                </span>

                <div className="space-y-2.5">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 flex gap-3 items-center"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-pink-100 shrink-0 shadow-2xs">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.color.image || item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-800 text-xs truncate">{item.product.name}</h4>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                          <span
                            className="w-2 h-2 rounded-full inline-block shrink-0"
                            style={{ backgroundColor: item.color.hex }}
                          />
                          <span className="truncate">{item.color.name}</span>
                          <span>•</span>
                          <span className="font-semibold text-slate-700">{item.quantity} pcs</span>
                        </div>
                        <span className="font-bold text-pink-600 text-xs block mt-1">
                          {formatRupiah(item.finalPrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Formatted Order Text Card (WhatsApp Format Preview) */}
              <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl shadow-inner font-mono text-[11px] space-y-2 border border-slate-700 relative">
                <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-2 font-sans font-bold text-xs text-pink-300">
                  <span>FORMAT ORDER PENERIMA 📝</span>
                  <button
                    type="button"
                    onClick={handleCopyWhatsAppMessage}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-pink-500 hover:bg-pink-600 text-white font-semibold text-[10px] transition-colors"
                  >
                    {isMessageCopied ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
                    {isMessageCopied ? 'Tersalin' : 'Salin Teks'}
                  </button>
                </div>
                <p><span className="text-slate-400">Tgl Pemesanan :</span> {orderDate}</p>
                <p><span className="text-slate-400">Tanggal & Jam Pengambilan :</span> {pickupDate} - {pickupTime} WITA</p>
                <p><span className="text-slate-400">Nama :</span> {recipientName}</p>
                <p><span className="text-slate-400">No Wa :</span> {phoneNumber}</p>
                <p><span className="text-slate-400">Orderan :</span> {orderSummaryText}</p>
                <p><span className="text-slate-400">Nama ig(wajib isi):</span> @{instagramUsername.trim().replace(/^@/, '')}</p>
                <p><span className="text-slate-400">Add Card :</span> {isCardAdded ? `"${cardMessage.trim()}" (+Rp 3.000)` : 'Tanpa Kartu Ucapan'}</p>
                <p><span className="text-slate-400">Pilihan Kresek :</span> {packagingOption}</p>
                <p><span className="text-slate-400">Lokasi Toko :</span> {selectedBranch}</p>
                <p><span className="text-slate-400">Metode Pembayaran :</span> {selectedBank.bankName} ({selectedBank.accountNumber}) a/n {selectedBank.accountHolder}</p>
                <p className="text-amber-300 font-bold">
                  <span className="text-slate-400">Total / Pembayaran :</span> {paymentTerm} ({paymentTerm === 'DP' ? formatRupiah(dpAmount) : formatRupiah(grandTotal)})
                </p>
              </div>

              {/* Financial Calculation Breakdown */}
              <div className="bg-white p-3.5 rounded-2xl border border-pink-100 shadow-2xs text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal Bunga</span>
                  <span>{formatRupiah(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Pengiriman ({selectedShipping})</span>
                  <span>{formatRupiah(shippingCost)}</span>
                </div>
                {cardFee > 0 && (
                  <div className="flex justify-between text-pink-600 font-semibold">
                    <span>Add Card (Kartu Ucapan)</span>
                    <span>+{formatRupiah(cardFee)}</span>
                  </div>
                )}
                {packagingCost > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>{packagingOption}</span>
                    <span>{formatRupiah(packagingCost)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Gratis Pita & Konsultasi</span>
                  <span className="text-pink-600 font-semibold">Rp 0 (FREE)</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-800 pt-2 border-t border-pink-100">
                  <span>Total Pesanan</span>
                  <span className="text-pink-600 text-base">{formatRupiah(grandTotal)}</span>
                </div>
                {paymentTerm === 'DP' && (
                  <div className="flex justify-between text-xs font-bold text-amber-700 bg-amber-50 p-2 rounded-xl border border-amber-200 mt-1">
                    <span>Wajib DP 50% Sekarang</span>
                    <span>{formatRupiah(dpAmount)}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Checkout Bottom Action Bar with Step Nav & 5-Second Delay on Preview */}
        <div className="p-4 bg-white border-t border-pink-100 flex items-center justify-between gap-3 shadow-lg">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4)}
              className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Kembali
            </button>
          ) : (
            <div className="text-xs text-slate-500">
              Total: <span className="font-bold text-pink-600">{formatRupiah(grandTotal)}</span>
            </div>
          )}

          {currentStep === 1 && (
            <button
              type="button"
              onClick={handleNextFromAddress}
              className="flex-1 py-3 px-4 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-pink-500/25 transition-all active:scale-95"
            >
              Lanjut Pengiriman
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {currentStep === 2 && (
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="flex-1 py-3 px-4 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-pink-500/25 transition-all active:scale-95"
            >
              Lanjut Pembayaran
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {currentStep === 3 && (
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="flex-1 py-3 px-4 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-pink-500/25 transition-all active:scale-95"
            >
              Lihat Preview Format Order
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {/* STEP 4: TOMBOL PESAN DENGAN JEDA 5 DETIK & AUTO BUKA WA */}
          {currentStep === 4 && (
            <button
              type="button"
              onClick={handleFinalOrder}
              disabled={countdown > 0 || isSubmitting}
              className={`flex-1 py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                countdown > 0
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300'
                  : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 hover:scale-[1.02] active:scale-95'
              }`}
            >
              {countdown > 0 ? (
                <>
                  <Clock className="w-4 h-4 animate-spin text-emerald-500" />
                  <span>Kirim ke WA ({countdown}s)</span>
                </>
              ) : isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Membuka WhatsApp...</span>
                </>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4 text-white fill-white" />
                  <span>Konfirmasi & Buat Pesanan ke WA</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
