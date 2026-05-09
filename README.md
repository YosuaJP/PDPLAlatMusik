# 🎸 Melodi POS — Online Point of Sales Alat Musik

Proyek ini adalah sistem **Online Point of Sales (P.O.S) untuk Toko Alat Musik**. Dibangun menggunakan arsitektur modern (Inertia Monolith) yang menggabungkan kekuatan backend Laravel dengan interaktivitas frontend React.js, menghasilkan aplikasi yang cepat, aman, dan tanpa perlu mengelola API terpisah.

---

## 🛠️ Stack Teknologi

| Layer | Teknologi | Versi | Keterangan |
|---|---|---|---|
| **Backend** | Laravel | 12.x | Framework PHP utama |
| **Frontend** | React | 19.x | Library antarmuka pengguna (UI) |
| **SSR Bridge** | Inertia.js | 2.x | Penghubung Laravel & React (tanpa API REST manual) |
| **Styling** | Tailwind CSS | 3.x | Framework CSS utility-first |
| **Bundler** | Vite | 7.x | Build tool & Hot Module Replacement (HMR) |
| **Database** | MySQL | 8.x | Sistem manajemen basis data (via XAMPP) |
| **Auth** | Laravel Breeze | 2.x | Starter kit autentikasi bawaan |

---

## 🚀 Progress & Pencapaian (Minggu 1)

Berikut adalah rangkuman dari penyelesaian **Step 1 hingga Step 4** pada tahap awal pengembangan proyek ini:

### 1. Fondasi Database (Database Layer)
- Berhasil membuat **14 file migrasi baru** untuk menyusun struktur basis data, ditambah modifikasi pada tabel `users`. Total ada 15 tabel berelasi.
- Mengimplementasikan **15 Eloquent Models** dengan pemetaan relasi lengkap (`hasMany`, `belongsTo`, `hasOne`) serta pengaturan *SoftDeletes* pada tabel utama (`users`, `products`).
- Membuat **7 Seeder** yang menampung data dummy realistis:
  - 6 Pengguna (1 Admin, 5 Customer)
  - 7 Kategori Alat Musik
  - 18 Produk nyata beserta stoknya
  - 4 Skenario Pesanan (Orders) lengkap dengan pembayaran, pengiriman, dan ulasan.
- Seluruh konstrain *Foreign Key* tervalidasi dan migrasi sukses berjalan di MySQL XAMPP.

### 2. Arsitektur & Design Pattern
- **Inertia.js Monolith:** Menggunakan pola *single-repo* di mana Laravel mengatur perutean (routing), dan React yang merendernya. Ini mematikan kebutuhan `react-router-dom` dan mencegah isu *CORS*.
- **Repository Pattern:** Mengabstraksi logika database dari Controller. Telah dibuat `ProductRepositoryInterface` dan `OrderRepositoryInterface` beserta implementasi kelasnya, yang kemudian diikat (*bound*) ke dalam `AppServiceProvider`.
- **Snapshot Pattern:** Pada tabel detail pesanan (`order_items`), nama dan harga produk disimpan secara langsung (bukan berelasi dengan ID saja) agar riwayat struk belanja tidak berubah walau harga produk berubah di masa depan.
- **Observer Pattern:** Pembuatan otomatis riwayat status pesanan ke tabel `order_status_histories`.

### 3. Frontend & UI/UX (Redesign)
- **Tema Desain:** Menggunakan *Clean Light Theme* bersudut membulat (*rounded-3xl*) dengan warna aksen **Emerald (Hijau Zamrud)**, mengadaptasi referensi desain toko modern.
- **Halaman Storefront (Welcome.jsx):** Terdapat Navbar pencarian, Banner Promo Diskon, kartu Kategori Populer, dan Grid Produk.
- **Halaman Autentikasi:** Merombak bawaan Laravel Breeze untuk `Login`, `Register`, dan `Forgot Password` menjadi desain kartu terpusat yang modern. Menambahkan field `Nomor Telepon` pada logika pendaftaran.
- **Dashboard POS Admin:** Tersedia Layout POS khusus dengan Sidebar lipat (*collapsible*) serta halaman *Dashboard* yang menampilkan metrik toko (Total Pendapatan, Pesanan) dan tabel peringatan stok.

### 4. DevOps & Dokumentasi
- **Git Version Control:** Repositori berhasil diinisialisasi dan diatur dalam *branch* `week-1`.
- **API Testing:** Menyertakan file koleksi Postman lengkap (`PDPLAlatMusik.postman_collection.json`) untuk pengujian Endpoint API.
- **Dokumentasi Laporan:** Penyusunan dokumentasi teknis, struktur, dan pola desain ini.

---

## ⚙️ Cara Menjalankan Aplikasi Secara Lokal

Ikuti langkah berikut untuk menjalankan aplikasi Melodi POS di komputer Anda:

1. **Instalasi Dependensi**
   ```bash
   composer install
   npm install
   ```

2. **Konfigurasi Database (XAMPP)**
   - Buka XAMPP Control Panel dan nyalakan (Start) modul **Apache** dan **MySQL**.
   - Buka browser dan pergi ke `http://localhost/phpmyadmin`.
   - Buat database baru dengan nama: **`db_melodi_pos`**.

3. **Pengaturan `.env`**
   Duplikat file `.env.example` menjadi `.env`, buka file tersebut, dan sesuaikan bagian database:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=db_melodi_pos
   DB_USERNAME=root
   DB_PASSWORD=
   ```
   *(Catatan: Jika user root MySQL Anda memiliki password, silakan isikan di bagian DB_PASSWORD)*.

4. **Jalankan Migrasi dan Seeding**
   Lakukan perintah ini untuk membangun tabel dan memasukkan data dummy:
   ```bash
   php artisan migrate:fresh --seed
   ```

5. **Jalankan Server Lokal**
   Buka dua jendela terminal (Command Prompt/Git Bash) dan jalankan masing-masing perintah ini:
   
   Terminal 1 (Backend PHP):
   ```bash
   php artisan serve
   ```
   Terminal 2 (Frontend Vite):
   ```bash
   npm run dev
   ```
   Aplikasi siap diakses di: **`http://localhost:8000`**

---

## 🔐 Akun Demo untuk Login

| Tipe Akun | Email | Password |
|---|---|---|
| **Admin** | `admin@alatmusik.com` | `password123` |
| **Customer** | `budi@gmail.com` | `password123` |

---
*Dibuat untuk Laporan Target Progress Week-1.*
