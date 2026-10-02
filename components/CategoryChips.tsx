'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Flower, Gift, Sparkles, HeartHandshake } from 'lucide-react';

export const CategoryChips: React.FC = () => {
  const { selectedCategory, setSelectedCategory, categories } = useApp();

  const categoryItems = [
    { id: 'All', label: 'Semua', icon: Sparkles },
    ...categories.map(category => ({
      id: category.name,
      label: category.name,
      icon: category.iconName === 'Gift' ? Gift : category.iconName === 'HeartHandshake' ? HeartHandshake : category.iconName === 'Sparkles' ? Sparkles : Flower,
    })),
  ];

  return (
    <div className="w-full px-4 py-2">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categoryItems.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const Icon = cat.icon;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                isSelected
                  ? 'bg-pink-500 text-white shadow-sm shadow-pink-500/25 ring-2 ring-pink-300 ring-offset-1'
                  : 'bg-pink-50/70 text-slate-600 hover:bg-pink-100 hover:text-pink-600 border border-pink-100'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-pink-400'}`} />
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
