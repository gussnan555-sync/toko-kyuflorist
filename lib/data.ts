import { Product, PromoBanner, ShippingMethod, BankAccount } from '@/types';

export const PROMO_BANNERS: PromoBanner[] = [
  {
    id: 'banner_1',
    title: 'Valentine & Romantic Season',
    subtitle: 'Diskon 25% untuk Semua Rangkaian Mawar Soft Pink & Red Velvet',
    highlightText: 'Gunakan Kode: KYULOVE',
    badge: 'Spesial Promo',
    bgGradient: 'from-pink-500 via-rose-400 to-pink-300',
    accentColor: '#FF6B8B',
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&auto=format&fit=crop&q=80',
    categoryFilter: 'Bouquet',
    isActive: false,
    sortOrder: 1,
  },
  {
    id: 'banner_2',
    title: 'Free Greeting Card & Ribbon',
    subtitle: 'Gratis Kartu Ucapan Custom (100 Karakter) + Pita Satin Premium',
    highlightText: 'Otomatis di Setiap Pesanan',
    badge: 'Gratis Hadiah',
    bgGradient: 'from-pink-400 via-purple-300 to-pink-200',
    accentColor: '#D946EF',
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600&auto=format&fit=crop&q=80',
    isActive: false,
    sortOrder: 2,
  },
  {
    id: 'banner_3',
    title: 'Same Day Delivery Jabodetabek',
    subtitle: 'Pesan sebelum jam 15:00 WIB, bunga segar tiba di hari yang sama!',
    highlightText: 'Fresh & Wangi Dijamin',
    badge: 'Same Day',
    bgGradient: 'from-rose-400 via-pink-400 to-amber-200',
    accentColor: '#FB7185',
    image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=600&auto=format&fit=crop&q=80',
    isActive: false,
    sortOrder: 3,
  },
  {
    id: 'banner_4',
    title: 'Graduation & Celebration Event',
    subtitle: 'Bouquet Bunga Matahari & Hydrangea Pastel untuk Momen Bahagia',
    highlightText: 'Hemat Hingga 20%',
    badge: 'Graduation',
    bgGradient: 'from-pink-400 via-amber-300 to-rose-300',
    accentColor: '#F59E0B',
    image: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=600&auto=format&fit=crop&q=80',
    categoryFilter: 'Special Event',
    isActive: false,
    sortOrder: 4,
  }
];

export const PRODUCTS_DATA: Product[] = [
  {
    id: 'bq_01',
    name: 'Blushing Peony Dream',
    tagline: 'Perpaduan bunga Peony import warna soft pink dan baby breath segar',
    description: 'Rangkaian bouquet mewah yang memancarkan keanggunan. Dibuat tangan oleh florist ahli KyuFlorist dengan mawar beludru pink lembut, peony mekar sempurna, serta sentuhan dedaunan eucalyptus aromatik.',
    price: 385000,
    originalPrice: 450000,
    category: 'Bouquet',
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=800&auto=format&fit=crop&q=80',
    ],
    rating: 4.9,
    reviewsCount: 128,
    orderCount: 340,
    viewsCount: 1240,
    stock: 25,
    tags: ['Best Seller', 'Romantic', 'Valentine'],
    colors: [
      {
        name: 'Soft Pink Pastel',
        hex: '#FFB3C6',
        image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80',
      },
      {
        name: 'Pure Snow White',
        hex: '#FFFFFF',
        border: '#CBD5E1',
        image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&auto=format&fit=crop&q=80',
      },
      {
        name: 'Lilac Lavender',
        hex: '#D8B4E2',
        image: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=800&auto=format&fit=crop&q=80',
      },
      {
        name: 'Velvet Red',
        hex: '#E11D48',
        image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&auto=format&fit=crop&q=80',
      },
    ]
  },
  {
    id: 'bq_02',
    name: 'Pastel Cloud Hydrangea',
    tagline: 'Hydrangea biru dan pink pastel berpadu dalam balutan kertas korea premium',
    description: 'Bukit awan bunga hydrangea segar impor Belanda. Memiliki tekstur rimbun dengan kombinasi warna pastel yang menyejukkan hati. Sangat cocok untuk kado wisuda, ulang tahun, dan anniversary.',
    price: 320000,
    originalPrice: 380000,
    category: 'Bouquet',
    image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80',
    ],
    rating: 4.8,
    reviewsCount: 94,
    orderCount: 290,
    viewsCount: 980,
    stock: 18,
    tags: ['Popular', 'Graduation', 'Pastel'],
    colors: [
      {
        name: 'Soft Pink Pastel',
        hex: '#FFB3C6',
        image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=800&auto=format&fit=crop&q=80',
      },
      {
        name: 'Baby Sky Blue',
        hex: '#93C5FD',
        image: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=800&auto=format&fit=crop&q=80',
      },
      {
        name: 'Lavender Mist',
        hex: '#DDD6FE',
        image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&auto=format&fit=crop&q=80',
      },
      {
        name: 'Cream Vanilla',
        hex: '#FEF3C7',
        border: '#E2E8F0',
        image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80',
      },
    ]
  },
  {
    id: 'bq_03',
    name: 'Eternal Rose Velvet',
    tagline: 'Mawar merah klasik premium dengan finishing kertas matte Korean wrap',
    description: 'Simbol cinta sejati yang abadi. Menggunakan mawar Holland merah berkualitas grade A yang tahan lama, dipadukan dengan ruscus segar dan pita satin berkilau.',
    price: 450000,
    originalPrice: 520000,
    category: 'Bouquet',
    image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&auto=format&fit=crop&q=80',
    ],
    rating: 5.0,
    reviewsCount: 215,
    orderCount: 480,
    viewsCount: 2100,
    stock: 30,
    tags: ['Top Rated', 'Romantic', 'Anniversary'],
    colors: [
      {
        name: 'Velvet Deep Red',
        hex: '#BE123C',
        image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&auto=format&fit=crop&q=80',
      },
      {
        name: 'Soft Blush Pink',
        hex: '#F472B6',
        image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80',
      },
      {
        name: 'Pure Snow White',
        hex: '#FFFFFF',
        border: '#CBD5E1',
        image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&auto=format&fit=crop&q=80',
      },
      {
        name: 'Midnight Black Wrap',
        hex: '#1F2937',
        image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&auto=format&fit=crop&q=80',
      },
    ]
  },
  {
    id: 'bq_04',
    name: 'Golden Sunflower Sunshine',
    tagline: 'Bunga Matahari ceria dengan paduan camomile dan eucalyptus',
    description: 'Bawa senyuman hangat dan semangat dengan bouquet bunga matahari mekar sempurna. Dirangkai khusus untuk memberikan energi positif pada momen wisuda atau kesembuhan teman tercinta.',
    price: 275000,
    originalPrice: 310000,
    category: 'Bouquet',
    image: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=800&auto=format&fit=crop&q=80',
    ],
    rating: 4.9,
    reviewsCount: 88,
    orderCount: 210,
    viewsCount: 840,
    stock: 15,
    tags: ['Graduation', 'Cheerful', 'Fresh'],
    colors: [
      {
        name: 'Sunshine Yellow',
        hex: '#FBBF24',
        image: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=800&auto=format&fit=crop&q=80',
      },
      {
        name: 'Soft Cream Wrap',
        hex: '#FFFBEB',
        border: '#CBD5E1',
        image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&auto=format&fit=crop&q=80',
      },
      {
        name: 'Pastel Mint Green',
        hex: '#A7F3D0',
        image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=800&auto=format&fit=crop&q=80',
      },
      {
        name: 'Blush Pink',
        hex: '#FBCFE8',
        image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80',
      },
    ]
  },
  {
    id: 'bq_05',
    name: 'Royal Tulip Meadow',
    tagline: 'Tulip import Belanda dengan lekukan anggun dan warna memikat',
    description: 'Keindahan minimalis dan mewah bunga Tulip Belanda. Dikemas dalam gaya kontemporer estetik dengan pita organza ganda yang elegan.',
    price: 520000,
    originalPrice: 600000,
    category: 'Bouquet',
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&auto=format&fit=crop&q=80',
    ],
    rating: 4.8,
    reviewsCount: 67,
    orderCount: 165,
    viewsCount: 750,
    stock: 12,
    tags: ['Luxury', 'Imported', 'Minimalist'],
    colors: [
      {
        name: 'Sweet Peach Tulip',
        hex: '#FDA4AF',
        image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&auto=format&fit=crop&q=80',
      },
      {
        name: 'Bright White Tulip',
        hex: '#FFFFFF',
        border: '#CBD5E1',
        image: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=800&auto=format&fit=crop&q=80',
      },
      {
        name: 'Purple Lavender',
        hex: '#C084FC',
        image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=800&auto=format&fit=crop&q=80',
      },
      {
        name: 'Sunset Orange',
        hex: '#FB923C',
        image: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=800&auto=format&fit=crop&q=80',
      },
    ]
  },
  {
    id: 'bq_06',
    name: 'Whispering Lilac Baby Breath',
    tagline: 'Lautan jutaan bunga Baby Breath lembut tahan hingga berminggu-minggu',
    description: 'Bouquet fluffy baby breath yang tahan lama dan bisa dikeringkan (dried flower). Sentuhan warna pastel lembut menciptakan nuansa hangat bak negeri dongeng.',
    price: 240000,
    originalPrice: 280000,
    category: 'Bouquet',
    image: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=800&auto=format&fit=crop&q=80',
    ],
    rating: 4.7,
    reviewsCount: 76,
    orderCount: 195,
    viewsCount: 670,
    stock: 40,
    tags: ['Long Lasting', 'Pastel', 'Sweet'],
    colors: [
      {
        name: 'Candy Pink',
        hex: '#F472B6',
        image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80',
      },
      {
        name: 'Pure White Cloud',
        hex: '#FFFFFF',
        border: '#CBD5E1',
        image: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=800&auto=format&fit=crop&q=80',
      },
      {
        name: 'Pastel Blue',
        hex: '#7DD3FC',
        image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=800&auto=format&fit=crop&q=80',
      },
      {
        name: 'Rainbow Pastel Mix',
        hex: '#E879F9',
        image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&auto=format&fit=crop&q=80',
      },
    ]
  },
  {
    id: 'bx_01',
    name: 'Secret Garden Bloom Box',
    tagline: 'Kotak bunga eksklusif silinder dengan laci rahasia untuk kado',
    description: 'Bloom Box bundar premium dilapisi beludru lembut berisi rangkaian mawar, lisianthus, dan anyelir segar. Dilengkapi laci bawah yang bisa diisi perhiasan atau cokelat.',
    price: 590000,
    originalPrice: 680000,
    category: 'Box Flower',
    image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&auto=format&fit=crop&q=80',
    ],
    rating: 4.9,
    reviewsCount: 112,
    orderCount: 230,
    viewsCount: 1100,
    stock: 10,
    tags: ['Exclusive', 'Gift Box', 'Luxury'],
    colors: [
      {
        name: 'Blush Velvet Box',
        hex: '#F472B6',
        image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&auto=format&fit=crop&q=80',
      },
      {
        name: 'Classy White Box',
        hex: '#FFFFFF',
        border: '#CBD5E1',
        image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&auto=format&fit=crop&q=80',
      },
      {
        name: 'Midnight Black Box',
        hex: '#374151',
        image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&auto=format&fit=crop&q=80',
      },
    ]
  },
  {
    id: 'vs_01',
    name: 'Nordic Ceramic Vase Arrangement',
    tagline: 'Rangkaian bunga meja estetik dalam vas keramik minimalis Nordik',
    description: 'Hias meja kerja atau ruang tamu Anda dengan bunga potong segar dalam vas keramik aesthetic bertekstur matte. Siap langsung dipajang tanpa perlu repot.',
    price: 420000,
    originalPrice: 490000,
    category: 'Vase Flower',
    image: 'https://images.unsplash.com/photo-1589244159943-460088ed5c92?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1589244159943-460088ed5c92?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80',
    ],
    rating: 4.8,
    reviewsCount: 52,
    orderCount: 140,
    viewsCount: 580,
    stock: 8,
    tags: ['Home Decor', 'Modern', 'Table Vase'],
    colors: [
      {
        name: 'Terracotta Vase',
        hex: '#FB923C',
        image: 'https://images.unsplash.com/photo-1589244159943-460088ed5c92?w=800&auto=format&fit=crop&q=80',
      },
      {
        name: 'Off White Ceramic',
        hex: '#F5F5F4',
        border: '#D6D3D1',
        image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&auto=format&fit=crop&q=80',
      },
      {
        name: 'Soft Sage Green',
        hex: '#86EFAC',
        image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=800&auto=format&fit=crop&q=80',
      },
    ]
  }
];

// Algorithm for Calculating Popularity Score:
// Popularity = (orderCount * 3.5) + (rating * 30) + (reviewsCount * 2) + (viewsCount * 0.1)
export function getPopularBouquets(products: Product[]): Product[] {
  return [...products]
    .map(p => ({
      ...p,
      popularityScore: (p.orderCount * 3.5) + (p.rating * 30) + (p.reviewsCount * 2) + (p.viewsCount * 0.1)
    }))
    .sort((a, b) => b.popularityScore - a.popularityScore);
}

export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'Ambil di Toko',
    name: 'Ambil di Toko (Self Pick-up)',
    estimate: 'Bisa diambil langsung di cabang',
    price: 0,
    minSpend: 0,
    description: 'Ambil pesanan bunga langsung di cabang yang Anda pilih tanpa biaya pengiriman (Gratis).',
    iconName: 'Store'
  },
  {
    id: 'GoSend',
    name: 'GoSend Instant / Sameday',
    estimate: '1 - 3 Jam (Tiba Hari Ini)',
    price: 25000,
    minSpend: 500000,
    description: 'Driver GoSend langsung mengantar pesanan ke alamat Anda. Wajib minimal belanja Rp 500.000.',
    iconName: 'Truck'
  }
];

export const BRANCH_LOCATIONS: { name: string; address: string; hours: string; phone: string; isPusat: boolean }[] = [
  {
    name: 'Cabang Buluh Indah (Denpasar)',
    address: 'Jl. Buluh Indah No.6, Pemecutan Kaja, Kec. Denpasar Utara, Kota Denpasar',
    hours: '08:00 - 21:00 WITA',
    phone: '0812-3456-7801',
    isPusat: true
  },
  {
    name: 'Cabang Luk Luk / Sempidi (Badung)',
    address: 'Jl. Raya Lukluk - Sempidi No.15, Lukluk, Kec. Mengwi, Kabupaten Badung',
    hours: '08:00 - 21:00 WITA',
    phone: '0812-3456-7802',
    isPusat: false
  }
];

export const BANK_ACCOUNTS: BankAccount[] = [
  {
    bankName: 'SEABANK',
    accountNumber: '901527030920',
    accountHolder: 'Ni Wayan Sutiari',
    logo: 'SEABANK',
    color: '#FF5722'
  },
  {
    bankName: 'BCA (Bank Central Asia)',
    accountNumber: '8720-1928-31',
    accountHolder: 'KYU FLORIST INDONESIA',
    logo: 'BCA',
    color: '#005CAB'
  },
  {
    bankName: 'Bank Mandiri',
    accountNumber: '137-00-1928312-4',
    accountHolder: 'KYU FLORIST INDONESIA',
    logo: 'MANDIRI',
    color: '#003366'
  },
  {
    bankName: 'BRI (Bank Rakyat Indonesia)',
    accountNumber: '0206-01-002819-50-8',
    accountHolder: 'KYU FLORIST INDONESIA',
    logo: 'BRI',
    color: '#00529C'
  },
  {
    bankName: 'BNI (Bank Negara Indonesia)',
    accountNumber: '0829-1827-39',
    accountHolder: 'KYU FLORIST INDONESIA',
    logo: 'BNI',
    color: '#F15A24'
  }
];

export const GREETING_SUGGESTIONS = [
  'Happy Birthday! Wishing you endless joy and happiness 🎂🌸',
  'Selamat Ulang Tahun! Semoga sehat dan sukses selalu ya ✨',
  'Happy Graduation! Proud of your hard work & achievement 🎓',
  'Happy Anniversary my love! Thank you for being in my life ❤️',
  'Get Well Soon! Sending warm hugs and quick recovery 💐',
  'Congratulations on your new milestone! Best wishes 🥂'
];
