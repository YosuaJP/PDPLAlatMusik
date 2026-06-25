# 🎸 NadaKito - Online Store Alat Musik

Proyek ini adalah platform **e-commerce toko alat musik online (NadaKito)** yang dibangun menggunakan arsitektur modern **Inertia.js Monolith** — menggabungkan kekuatan backend Laravel dengan interaktivitas frontend React.js, menghasilkan aplikasi yang cepat, aman, dan tanpa perlu mengelola API terpisah.

---

## 🛠️ Stack Teknologi

| Layer | Teknologi | Versi | Keterangan |
|---|---|---|---|
| **Backend** | Laravel | 12.x | Framework PHP utama |
| **Frontend** | React | 19.x | Library antarmuka pengguna (UI) |
| **SSR Bridge** | Inertia.js | 2.x | Penghubung Laravel & React (tanpa API REST manual) |
| **Styling** | Vanilla CSS | — | Custom CSS dengan glassmorphism & animasi |
| **Bundler** | Vite | 7.x | Build tool & Hot Module Replacement (HMR) |
| **Database** | MySQL | 8.x | Sistem manajemen basis data (via XAMPP) |
| **Auth** | Laravel Breeze | 2.x | Starter kit autentikasi bawaan |
| **Payment** | Midtrans | Sandbox | Payment gateway integrasi |
| **Tunnel** | Cloudflare Tunnel | — | Expose local server ke publik (demo) |

---

## ✅ Progress & Fitur yang Telah Diimplementasikan

### 🗓️ Week 1 — Fondasi
- **14 file migrasi** untuk 15 tabel basis data berelasi penuh
- **15 Eloquent Models** dengan relasi lengkap (`hasMany`, `belongsTo`, `hasOne`)
- **7 Seeder** dengan data dummy realistis (admin, customer, produk, orders)
- **Repository Pattern**, **Observer Pattern**, **Snapshot Pattern**
- Redesign UI Storefront, Auth, dan Admin Dashboard

### 🗓️ Week 2 — Fitur Inti
- Manajemen produk, kategori, stok oleh Admin
- Keranjang belanja (Cart) dengan AJAX real-time
- Checkout dengan pemilihan alamat & kurir
- Integrasi **Midtrans Payment Gateway** (Sandbox)
- Halaman riwayat pesanan pengguna

### 🗓️ Week 3 — Manajemen & Laporan
- Admin: manajemen user, kelola pesanan, update status pengiriman
- Laporan performa toko (grafik penjualan, produk terlaris)
- Sistem ulasan/review produk oleh pembeli
- Halaman refund: pengajuan oleh user, approve/reject oleh admin

### 🗓️ Week 4 — Voucher & Diskon (Strategy Pattern)
- **Strategy Pattern** untuk kalkulasi diskon:
  - `DiscountStrategyInterface`
  - `PercentageDiscount` (dengan dukungan `max_cap`)
  - `FixedAmountDiscount`
- `PromoService`: validasi, penerapan, dan preview voucher via AJAX
- UI Voucher di halaman **Cart** (real-time preview diskon)
- UI Voucher di halaman **Checkout** (dropdown + status aktif)
- Fix bug tipe promo `percent` vs `percentage`
- Admin panel promo/voucher (buat, edit, nonaktifkan)

---

## ⚙️ Cara Menjalankan Aplikasi Secara Lokal

### Prasyarat
- PHP 8.2+
- Composer
- Node.js 18+
- XAMPP (MySQL)

### Langkah Instalasi

**1. Clone repositori:**
```bash
git clone https://github.com/YosuaJP/PDPLAlatMusik.git
cd PDPLAlatMusik
```

**2. Instalasi dependensi:**
```bash
composer install
npm install
```

**3. Konfigurasi `.env`:**
```bash
cp .env.example .env
php artisan key:generate
```
Sesuaikan bagian database di `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=db_alatmusik
DB_USERNAME=root
DB_PASSWORD=
```

**4. Jalankan migrasi dan seeder:**
```bash
php artisan migrate:fresh --seed
```

**5. Jalankan server lokal:**

Terminal 1 (Backend):
```bash
php artisan serve
```
Terminal 2 (Frontend — mode development):
```bash
npm run dev
```
Akses di: **`http://localhost:8000`**

---

## 🌐 Cara Menjalankan untuk Demo / Presentasi (Cloudflare Tunnel)

Agar website bisa diakses dari luar laptop (teman, dosen, HP lain) **tanpa hosting berbayar**:

**1. Build aset frontend (wajib, sekali sebelum presentasi):**
```bash
npm run build
```
> ⚠️ Jangan jalankan `npm run dev` setelah ini. Cukup `php artisan serve` saja.

**2. Jalankan tunnel (Windows):**
```powershell
& "C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel --url http://localhost:8000
```

**3. Salin URL publik** yang muncul di terminal (contoh: `https://hip-ear-lol-analyze.trycloudflare.com`) dan bagikan ke teman-teman.

> ⚠️ **URL berubah setiap kali tunnel dinyalakan ulang.** Selalu bagikan URL terbaru saat presentasi dimulai.
> ⚠️ Laptop harus tetap menyala selama sesi presentasi berlangsung.

---

## 🔐 Akun Demo untuk Login

### Admin
| Nama | Email | Password |
|---|---|---|
| Admin Toko | `admin@alatmusik.com` | `password` |
| Christian Jeffri Raphaell | `2372017@alatmusik.com` | `2372017` |
| Charles Sung | `2372019@alatmusik.com` | `2372019` |
| Jason Christian Jonathan | `2372022@alatmusik.com` | `2372022` |
| Yosua Juswandiputra | `2472027@alatmusik.com` | `2472027` |

### Customer (Akun Kelas B — NRP@student.maranatha.ac.id)
- **Email:** `[NRP]@student.maranatha.ac.id`
- **Password:** `[NRP]` masing-masing
- Contoh: email `2472027@student.maranatha.ac.id`, password `2472027`

### Customer Demo Tambahan
| Email | Password |
|---|---|
| `budi@gmail.com` | `password` |
| `sari@gmail.com` | `password` |

---

## 📁 Struktur Proyek Penting

```
app/
├── Contracts/
│   └── DiscountStrategyInterface.php   # Strategy Pattern interface
├── Services/
│   ├── Discounts/
│   │   ├── FixedAmountDiscount.php     # Strategy: potongan tetap
│   │   └── PercentageDiscount.php      # Strategy: persentase + max_cap
│   ├── PromoService.php                # Validasi & kalkulasi voucher
│   ├── OrderService.php                # Logika pembuatan pesanan
│   └── StockService.php               # Pencatatan pergerakan stok
├── Factories/
│   └── OrderFactory.php               # Factory pembuatan order
└── Http/Controllers/
    ├── CartController.php             # AJAX promo preview & apply
    ├── CheckoutController.php         # Proses checkout
    └── AdminRefundController.php      # Admin kelola refund

resources/js/Pages/
├── Cart.jsx            # Halaman keranjang + voucher real-time
├── Checkout.jsx        # Halaman checkout + ringkasan produk
├── AdminPromo.jsx      # Admin: kelola promo/voucher
└── AdminRefund.jsx     # Admin: approve/reject refund
```

---

## 👥 Tim Pengembang — Kelas B

| NRP | Nama |
|---|---|
| 2372017 | Christian Jeffri Raphaell |
| 2372019 | Charles Sung |
| 2372022 | Jason Christian Jonathan |
| 2472027 | Yosua Juswandiputra |

---

*Dibuat sebagai tugas Proyek PDPL — Semester Genap 2025/2026.*
