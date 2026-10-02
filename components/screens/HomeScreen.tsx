'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { HomeHeader } from '@/components/HomeHeader';
import { BannerSlider } from '@/components/BannerSlider';
import { CategoryChips } from '@/components/CategoryChips';
import { ProductCard } from '@/components/ProductCard';
import { Flame, Sparkles, SearchX } from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const { products, popularProducts, searchQuery, selectedCategory, setSearchQuery, setSelectedCategory } = useApp();

  // Filter products by category & search query
  const filteredProducts = products.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    const matchesQuery =
      searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesQuery;
  });

  // Highlight top 4 popular products with highest algorithm score
  const topPopular = popularProducts.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen pb-safe-nav bg-white">
      {/* 1. Header (User greeting, cursive text, logo, search bar) */}
      <HomeHeader />

      {/* 2. Banner Slider (Event / Promo rectangular auto-scroll carousel) */}
      {!searchQuery && <BannerSlider />}

      {/* 3. Category Filter Chips */}
      <CategoryChips />

      {/* 4. Bouquet Populer (Algoritma Section) - Show when no active search */}
      {!searchQuery && selectedCategory === 'All' && (
        <section className="px-4 mt-3 mb-4">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <div className="p-1 rounded-lg bg-pink-100 text-pink-600">
                <Flame className="w-4 h-4 fill-pink-500 text-pink-500" />
              </div>
              <h2 className="text-sm font-bold text-slate-800 tracking-tight">
                Bouquet Populer
              </h2>
            </div>
            <span className="text-[11px] text-pink-600 font-medium">
              Rekomendasi Algoritma ✨
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {topPopular.map((product) => (
              <ProductCard key={`pop_${product.id}`} product={product} isFeatured />
            ))}
          </div>
        </section>
      )}

      {/* 5. Main Catalog Products List */}
      <section className="px-4 mt-2 mb-6 flex-1">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-pink-500" />
            <h2 className="text-sm font-bold text-slate-800 tracking-tight">
              {searchQuery
                ? `Hasil Pencarian: "${searchQuery}"`
                : selectedCategory === 'All'
                ? 'Semua Koleksi Bunga'
                : `Koleksi ${selectedCategory}`}
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {filteredProducts.length} bouquet
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-12 px-4 bg-pink-50/40 rounded-3xl border border-pink-100">
            <SearchX className="w-10 h-10 text-pink-300 mb-2" />
            <h3 className="text-sm font-bold text-slate-800">Bouquet Tidak Ditemukan</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Tidak ada buket bunga yang cocok dengan kata kunci &ldquo;{searchQuery}&rdquo;.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-pink-500 text-white font-semibold text-xs shadow-sm hover:bg-pink-600 transition-colors"
            >
              Reset Pencarian
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
