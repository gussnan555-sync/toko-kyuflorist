# 🌸 KyuFlorist - Mobile Flower Shop Web Application

Aplikasi web toko bunga modern berbasis **Next.js 16 + React 19 + Tailwind CSS**, didesain khusus dengan estetika **Soft Pink & White**, mobile-first feel, serta siap diintegrasikan dengan **Supabase** dan dideploy ke **Netlify**.

---

## ✨ Fitur Utama

1. **Mobile-First Experience**:
   - Tampilan frame mobile responsif dengan navigasi bottom bar (*Home, Wishlist, Keranjang, Pesanan, Profil*).
   - Tipografi elegan: Google Font **Poppins** untuk seluruh teks & **Great Vibes (Tegak Bersambung)** untuk tagline *"Fresh and Beautiful"*.

2. **Home Screen**:
   - Header atas kiri: Avatar profil pengguna + ucapan *"Hai, {Nama User}"*.
   - Tagline estetik: *"Fresh and Beautiful"* & *"Pilih Bunga, Untuk Bouquet yang kamu suka"*.
   - **Banner Persegi Panjang**: Auto-scroll carousel bergulir dari kiri ke kanan 1 per 1 secara otomatis dan dapat digulir manual / touch-swipe.
   - **Pencarian Produk**: Filter instan berdasarkan nama atau tag bunga.
   - **Kategori Bunga**: *Semua, Bouquet, Box Flower, Vas Bunga, Event / Wisuda*.
   - **Bouquet Populer**: Algoritma skor popularitas cerdas berdasarkan total pesanan, rating bintang, dan jumlah ulasan.

3. **Kustomisasi Sebelum Masuk Keranjang**:
   - **Pilih Warna Bunga**: Pilihan palet warna visual (*Soft Pink Pastel, Pure Snow White, Velvet Red, Lilac Lavender, dll.*).
   - **Pilih Ukuran**: *Small (-15%)*, *Medium (Standar)*, *Large (+35%)* dengan kalkulasi harga otomatis.
   - **Free Kartu Ucapan**: Input teks langsung (opsional, maks 100 karakter dengan live counter & template ucapan cepat).
   - Penyesuaian kuantitas pesanan.

4. **Wishlist (Favorit)**:
   - Tambah & hapus bunga favorit dengan 1 klik icon hati.

5. **Multi-Step Checkout**:
   - Indikator 4 langkah elegan tanpa teks label "step" (menggunakan nomor `1`, `2`, `3`, `4` dan icon):
     - **1. Alamat**: Validasi input, ganti / tambah alamat baru, nama penerima & no. HP.
     - **2. Pengiriman**: Pilihan layanan *Same Day*, *Express*, *Regular* + Pemilihan lokasi *Cabang 1 (Pusat - Jaksel)* atau *Cabang 2 (Cabang Barat - Jakbar)*.
     - **3. Pembayaran**: Transfer Bank (*BCA, Mandiri, BRI, BNI*) dengan nomor rekening & tombol salin rekening 1 klik.
     - **4. Preview & Konfirmasi**: Ringkasan lengkap dan tombol *"Pesan Sekarang"* dengan **jeda keamanan 5 detik (countdown)** untuk memastikan pesanan user telah sesuai sebelum diproses.

6. **Orders (Daftar Pesanan)**:
   - Melacak status pesanan (*Menunggu Pembayaran, Sedang Dirangkai, Dalam Pengiriman, Selesai*).
   - Rincian biaya, catatan kartu ucapan, dan info transfer.

7. **Profil User (CRUD)**:
   - Edit foto profil dengan **validasi client-side maksimal 1MB**.
   - Edit nama lengkap, alamat email, no. WhatsApp / HP, dan alamat pengiriman utama.

---

## 🚀 Panduan Menjalankan Project

### 1. Jalankan di Lingkungan Lokal
```bash
npm install
npm run dev
```
Buka browser di `http://localhost:3000`.

---

## 🗄️ Integrasi Supabase & Netlify

### Konfigurasi Supabase
1. Buat project di [Supabase](https://supabase.com/).
2. Buka **SQL Editor** di dashboard Supabase dan jalankan script dari file [supabase-schema.sql](supabase-schema.sql).
3. Setelah itu jalankan [supabase-admin-schema.sql](supabase-admin-schema.sql) untuk policy admin katalog. Tambahkan user admin sesuai instruksi di bagian akhir file tersebut.
4. Buat file `.env.local` di root project:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### Katalog Produk dan Pembayaran
- Produk dan metode pembayaran tidak lagi memakai data dummy di runtime; aplikasi pelanggan membaca tabel `products` dan `payment_methods`.
- Admin mengelola produk, galeri multi-gambar, varian warna, stok, serta rekening pembayaran dari `/admin`.
- Hanya metode pembayaran dengan `is_active = true` yang tampil di checkout pelanggan.

### Deploy ke Netlify
Project ini sudah dilengkapi file konfigurasi [`netlify.toml`](file:///c:/Development/coding/kyuflorist/netlify.toml).
1. Hubungkan repository GitHub Anda ke [Netlify](https://netlify.com/).
2. Masukkan Environment Variables (`NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
3. Deploy!
