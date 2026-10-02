'use client';

import React, { useState } from 'react';
import { Product, FlowerColor } from '@/types';
import { useApp } from '@/context/AppContext';
import { Heart, Star, Plus, Flame } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isFeatured?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, isFeatured = false }) => {
  const { isInWishlist, toggleWishlist, openProductModal } = useApp();
  const isFavorite = isInWishlist(product.id);

  const [hoveredColor, setHoveredColor] = useState<FlowerColor | null>(null);

  const displayImage = hoveredColor?.image || product.image;

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(product.price);

  const formattedOriginal = product.originalPrice
    ? new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }).format(product.originalPrice)
    : null;

  return (
    <div
      onClick={() => openProductModal(product)}
      className="group bg-white rounded-2xl border border-pink-100/90 shadow-sm hover:shadow-md hover:border-pink-200 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer relative"
    >
      {/* Product Image Container */}
      <div className="relative aspect-[4/4.2] w-full overflow-hidden bg-pink-50/50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-300 ease-out"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.isPopular || isFeatured ? (
            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              <Flame className="w-3 h-3 text-amber-200 animate-bounce" />
              Populer
            </span>
          ) : null}

          {product.isBestSeller || product.tags.some(tag => tag.toLowerCase() === 'best seller') ? (
            <span className="inline-flex items-center gap-1 bg-amber-400 text-amber-950 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              Best Seller
            </span>
          ) : null}

          {product.originalPrice && (
            <span className="bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md self-start shadow-xs">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all z-10 ${
            isFavorite
              ? 'bg-rose-50 text-rose-500 ring-2 ring-rose-300 shadow-sm'
              : 'bg-white/80 text-slate-400 hover:text-rose-500 hover:bg-white'
          }`}
          aria-label={isFavorite ? 'Hapus dari favorit' : 'Tambah ke favorit'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Active Color Name Pill on Hover/Touch */}
        {hoveredColor && (
          <div className="absolute top-2.5 right-12 bg-black/60 backdrop-blur-xs text-white text-[9px] font-semibold px-2 py-0.5 rounded-full z-10 animate-in fade-in">
            {hoveredColor.name}
          </div>
        )}

        {/* Color Swatch Dots Preview (Hover/Tap to switch image) */}
        <div 
          className="absolute bottom-2 left-2.5 flex items-center -space-x-0.5 bg-white/85 backdrop-blur-xs px-1.5 py-1 rounded-full z-10 border border-white/70 shadow-xs"
          onClick={(e) => e.stopPropagation()}
        >
          {product.colors.map((col, idx) => (
            <button
              key={idx}
              type="button"
              onMouseEnter={() => setHoveredColor(col)}
              onClick={(e) => {
                e.stopPropagation();
                setHoveredColor(col);
              }}
              className={`w-3.5 h-3.5 rounded-full ring-1 ring-white/90 transition-transform ${
                hoveredColor?.name === col.name ? 'scale-125 z-20 ring-2 ring-pink-500' : 'hover:scale-110'
              }`}
              style={{ backgroundColor: col.hex, border: col.border ? `1px solid ${col.border}` : undefined }}
              title={col.name}
            />
          ))}
          <span className="text-[8px] font-bold text-slate-600 pl-1">
            {product.colors.length} Warna
          </span>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-3 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-1 text-[11px] text-slate-500 mb-1">
            <span className="text-pink-600 font-medium">{product.category}</span>
            <div className="flex items-center gap-0.5 text-amber-500 font-semibold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-slate-400 text-[10px]">({product.orderCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h4 className="font-semibold text-slate-800 text-xs sm:text-sm line-clamp-1 group-hover:text-pink-600 transition-colors">
            {product.name}
          </h4>

          {/* Tagline / Subtitle */}
          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
            {product.tagline}
          </p>
        </div>

        {/* Price & Action Button */}
        <div className="mt-2.5 pt-2 border-t border-pink-50 flex items-center justify-between">
          <div className="flex flex-col">
            {formattedOriginal && (
              <span className="text-[10px] text-slate-400 line-through">
                {formattedOriginal}
              </span>
            )}
            <span className="text-xs sm:text-sm font-bold text-pink-600">
              {formattedPrice}
            </span>
          </div>

          {/* Quick Add / Customize Trigger */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              openProductModal(product);
            }}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-pink-50 text-pink-600 hover:bg-pink-500 hover:text-white flex items-center justify-center transition-colors shadow-2xs group-hover:bg-pink-500 group-hover:text-white"
            aria-label="Pilih opsi & masukkan keranjang"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
