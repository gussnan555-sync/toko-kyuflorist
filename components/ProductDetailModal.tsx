'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { FlowerColor } from '@/types';
import { GREETING_SUGGESTIONS } from '@/lib/data';
import { X, Heart, Star, ShoppingBag, Check, MessageSquareHeart, Sparkles, Plus, Minus, Flame, Eye } from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    closeProductModal,
    addToCart,
    isInWishlist,
    toggleWishlist,
    openCheckout,
  } = useApp();

  const [selectedColor, setSelectedColor] = useState<FlowerColor | null>(null);
  const [greetingText, setGreetingText] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string>('');

  // Initialize defaults whenever modal opens with a new product
  useEffect(() => {
    if (selectedProduct) {
      const defaultColor = selectedProduct.colors[0] || null;
      setSelectedColor(defaultColor);
      setGreetingText('');
      setQuantity(1);
      setActiveImage(defaultColor?.image || selectedProduct.image);
    }
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const isFavorite = isInWishlist(selectedProduct.id);

  // All available unique images for this product (gallery + color specific images)
  const allImages = Array.from(
    new Set([
      selectedProduct.image,
      ...(selectedProduct.images || []),
      ...selectedProduct.colors.map((c) => c.image),
    ])
  ).filter(Boolean);

  const calculatedUnitPrice = selectedColor?.price || selectedProduct.price;
  const totalPrice = calculatedUnitPrice * quantity;

  const formattedTotalPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(totalPrice);

  // Handle color selection -> switch active photo instantly!
  const handleSelectColor = (color: FlowerColor) => {
    setSelectedColor(color);
    if (color.image) {
      setActiveImage(color.image);
    }
  };

  const handleAddToCart = () => {
    const color = selectedColor || { name: 'Standar', hex: '#E5E7EB', image: '' };
    addToCart({
      product: {
        ...selectedProduct,
        image: activeImage || color.image || selectedProduct.image,
      },
      color,
      greetingCardText: greetingText,
      quantity,
    });
    closeProductModal();
  };

  const handleBuyNow = () => {
    const color = selectedColor || { name: 'Standar', hex: '#E5E7EB', image: '' };
    const added = addToCart({
      product: {
        ...selectedProduct,
        image: activeImage || color.image || selectedProduct.image,
      },
      color,
      greetingCardText: greetingText,
      quantity,
    });
    if (added) {
      closeProductModal();
      openCheckout();
    }
  };

  const remainingChars = 100 - greetingText.length;
  const activeImageIndex = allImages.indexOf(activeImage);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border-t sm:border border-pink-100 animate-in slide-in-from-bottom-8 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header with Close & Wishlist */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-pink-100">
          <div className="flex items-center gap-1.5 text-xs text-pink-600 font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Detail & Pilihan Warna
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleWishlist(selectedProduct.id)}
              className={`p-2 rounded-full border transition-colors ${
                isFavorite
                  ? 'bg-rose-50 border-rose-200 text-rose-500'
                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-rose-500'
              }`}
              aria-label="Favorite"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
            </button>
            <button
              onClick={closeProductModal}
              className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 space-y-4 no-scrollbar flex-1 pb-6">
          {/* 1. Main E-Commerce Product Image Viewer */}
          <div className="space-y-2">
            <div className="relative aspect-[4/3.3] w-full rounded-2xl overflow-hidden bg-pink-50 border border-pink-100 shadow-sm group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeImage || selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover object-center transition-all duration-300 group-hover:scale-105"
              />

              {/* Floating Color Badge Overlay */}
              {selectedColor && (
                <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1.5 shadow-sm">
                  <span
                    className="w-2.5 h-2.5 rounded-full ring-1 ring-white"
                    style={{ backgroundColor: selectedColor.hex }}
                  />
                  <span>Warna: {selectedColor.name}</span>
                </div>
              )}

              {/* Photo Counter Badge */}
              <div className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded-lg text-[10px] font-mono">
                {activeImageIndex >= 0 ? activeImageIndex + 1 : 1} / {allImages.length} Foto
              </div>

              {selectedProduct.isPopular && (
                <div className="absolute top-2.5 right-2.5 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <Flame className="w-3 h-3 text-amber-200" />
                  Populer
                </div>
              )}
            </div>

            {/* 2. Horizontal Image Thumbnails Gallery (Click to Switch Photo) */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {allImages.map((imgUrl, idx) => {
                  const isActive = activeImage === imgUrl;
                  // Check if this thumbnail corresponds to a specific color
                  const matchedColor = selectedProduct.colors.find((c) => c.image === imgUrl);

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setActiveImage(imgUrl);
                        if (matchedColor) {
                          setSelectedColor(matchedColor);
                        }
                      }}
                      className={`relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                        isActive
                          ? 'border-pink-500 ring-2 ring-pink-300 scale-105 shadow-sm'
                          : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-pink-300'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imgUrl}
                        alt={`Varian ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {matchedColor && (
                        <span
                          className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full ring-1 ring-white"
                          style={{ backgroundColor: matchedColor.hex }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Product Title & Basic Info */}
          <div>
            <div className="flex items-center justify-between gap-1 text-[11px] text-slate-500 mb-1">
              <span className="text-[11px] font-semibold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md">
                {selectedProduct.category}
              </span>
              <div className="flex items-center gap-1 text-amber-500 font-semibold text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{selectedProduct.rating.toFixed(1)}</span>
                <span className="text-slate-400 text-[10px]">({selectedProduct.orderCount} pesanan)</span>
              </div>
            </div>

            <h3 className="font-bold text-slate-800 text-base leading-snug">
              {selectedProduct.name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {selectedProduct.tagline}
            </p>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed bg-pink-50/40 p-2.5 rounded-xl border border-pink-100/60">
            {selectedProduct.description}
          </p>

          {/* 3. Pilih Warna Rangkaian (With dedicated thumbnail for each color!) */}
          {selectedProduct.showColors !== false && selectedProduct.colors.length > 0 && <div className="pt-1">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-pink-500" />
                Pilih Warna & Lihat Foto Bunga:
              </label>
              <span className="text-xs font-bold text-pink-600">
                {selectedColor?.name || 'Pilih warna'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {selectedProduct.colors.filter(color => color.isActive !== false).map((color) => {
                const isSelected = selectedColor?.name === color.name;
                return (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => handleSelectColor(color)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-pink-500 bg-pink-50/90 ring-2 ring-pink-300 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-pink-200'
                    }`}
                  >
                    {/* Small Color Thumbnail Preview */}
                    <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-pink-50 border border-slate-200 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={color.image}
                        alt={color.name}
                        className="w-full h-full object-cover"
                      />
                      <span
                        className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-tl ring-1 ring-white"
                        style={{ backgroundColor: color.hex }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-semibold text-slate-800 truncate block">
                        {color.name}
                      </span>
                      <span className="text-[10px] text-pink-600 flex items-center gap-0.5">
                        <Eye className="w-2.5 h-2.5" />
                        Lihat foto
                      </span>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-pink-600 shrink-0 stroke-[2.5]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>}

          {/* 4. Add Card (Kartu Ucapan) */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <MessageSquareHeart className="w-3.5 h-3.5 text-pink-500" />
                Add Card / Kartu Ucapan <span className="text-[11px] font-normal text-pink-600">(Opsional / +Rp 3.000 jika diisi)</span>
              </label>
              <span
                className={`text-[10px] font-medium ${
                  remainingChars < 15 ? 'text-rose-500 font-bold' : 'text-slate-400'
                }`}
              >
                {remainingChars} / 100 char
              </span>
            </div>

            <div className="relative">
              <textarea
                value={greetingText}
                onChange={(e) => {
                  if (e.target.value.length <= 100) {
                    setGreetingText(e.target.value);
                  }
                }}
                maxLength={100}
                rows={2}
                placeholder="Tulis pesan ucapan di sini (Contoh: Happy Birthday Sarah! Semoga bahagia & sukses selalu ya 🌸)"
                className="w-full text-xs p-3 bg-pink-50/40 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white text-slate-800 placeholder:text-slate-400 transition-all resize-none"
              />
            </div>

            {/* Quick Greeting Template Chips */}
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              <span className="text-[10px] text-slate-400 self-center">Pilihan cepat:</span>
              {GREETING_SUGGESTIONS.slice(0, 3).map((template, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setGreetingText(template.slice(0, 100))}
                  className="text-[10px] bg-slate-100 hover:bg-pink-100 hover:text-pink-700 text-slate-600 px-2 py-1 rounded-lg border border-slate-200 transition-colors truncate max-w-[200px]"
                >
                  {template.split('!')[0]}!
                </button>
              ))}
            </div>
          </div>

          {/* 6. Quantity Adjuster */}
          <div className="pt-2 flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Jumlah Buket</span>
              <span className="text-[11px] text-slate-500">Stok siap rangkai tersedia</span>
            </div>

            <div className="flex items-center gap-3 bg-white px-2 py-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-pink-100 text-slate-700 hover:text-pink-600 flex items-center justify-center transition-colors disabled:opacity-40"
                disabled={quantity <= 1}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-sm font-bold text-slate-800 w-4 text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-7 h-7 rounded-lg bg-pink-100 text-pink-600 hover:bg-pink-200 flex items-center justify-center transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Bottom Fixed Actions */}
        <div className="p-4 bg-white border-t border-pink-100 flex items-center justify-between gap-3 shadow-lg">
          <div>
            <span className="text-[11px] text-slate-500 block">Total Pembelian</span>
            <span className="text-base font-bold text-pink-600">
              {formattedTotalPrice}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-1 justify-end">
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 py-3 px-3 rounded-xl bg-pink-100 text-pink-700 hover:bg-pink-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              + Keranjang
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              className="flex-1 py-3 px-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold text-xs flex items-center justify-center gap-1 shadow-md shadow-pink-500/25 transition-all active:scale-95"
            >
              Beli Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
