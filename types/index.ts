export type FlowerSize = 'Small' | 'Medium' | 'Large' | string;

export interface FlowerColor {
  name: string;
  hex: string;
  border?: string;
  image: string; // Gambar khusus untuk varian warna ini
  price?: number;
  stock?: number;
  isActive?: boolean;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  images: string[]; // Galeri beberapa foto produk
  rating: number;
  reviewsCount: number;
  orderCount: number;
  viewsCount: number;
  isPopular?: boolean;
  colors: FlowerColor[];
  showColors?: boolean;
  showSizes?: boolean;
  tags: string[];
  stock: number;
  isBestSeller?: boolean;
}

export interface ProductCategory {
  id: string;
  name: string;
  iconName: string;
  sortOrder: number;
  isActive: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  color: FlowerColor;
  size?: string;
  sizeMultiplier?: number;
  finalPrice: number;
  greetingCardText: string;
  quantity: number;
  addedAt: string;
}

export type ShippingMethodType = 'Ambil di Toko' | 'GoSend' | string;

export interface ShippingMethod {
  id: ShippingMethodType;
  name: string;
  estimate: string;
  price: number;
  minSpend?: number;
  description: string;
  iconName: string;
}

export type BranchOption =
  | 'Cabang Buluh Indah (Denpasar)'
  | 'Cabang Luk Luk / Sempidi (Badung)'
  | string;

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  logo: string;
  color: string;
}

export interface PaymentMethod extends BankAccount {
  id: string;
  isActive: boolean;
  sortOrder: number;
}

export type OrderStatus = 'Menunggu Pembayaran' | 'Diproses' | 'Sedang Dirangkai' | 'Dalam Pengiriman' | 'Selesai' | 'Dibatalkan';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  colorName: string;
  colorHex: string;
  size?: string;
  price: number;
  quantity: number;
  greetingCardText?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: OrderItem[];
  shippingAddress: {
    recipientName: string;
    phoneNumber: string;
    fullAddress: string;
    districtCity: string;
    postalCode: string;
    notes?: string;
  };
  shippingMethod: ShippingMethodType;
  shippingCost: number;
  branch: BranchOption;
  paymentBank: BankAccount;
  paymentStatus: 'Belum Bayar' | 'Sudah Transfer' | 'Terverifikasi';
  subtotal: number;
  totalAmount: number;
  status: OrderStatus;
  estimatedDelivery: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  address: string;
  districtCity: string;
  postalCode: string;
  savedAddresses?: {
    id: string;
    title: string;
    recipientName: string;
    phone: string;
    fullAddress: string;
    isDefault?: boolean;
  }[];
}

export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  highlightText: string;
  badge: string;
  bgGradient: string;
  accentColor: string;
  image: string;
  categoryFilter?: string;
  isActive?: boolean;
  sortOrder?: number;
}
