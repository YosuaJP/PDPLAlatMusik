# PDPLAlatMusik — Online POS Alat Musik

## Stack
- **Backend**: Laravel 12 (PHP 8.2+)
- **Frontend**: React 19 + Inertia.js 2 + Tailwind CSS 3
- **Bundler**: Vite 7
- **Database**: SQLite (dev) → MySQL (production)
- **Auth**: Laravel Breeze (session-based)

## Arsitektur
Inertia.js Monolith — bukan REST API terpisah. Laravel routing + controller,
React untuk rendering UI. Tidak menggunakan `react-router-dom`.

## Design Patterns
- **Repository Pattern** — `app/Contracts/` + `app/Repositories/`
- **Service Container Binding** — `app/Providers/AppServiceProvider.php`
- **Soft Deletes** — `users`, `products`
- **Snapshot Pattern** — `order_items.product_name` & `price_each`
- **Audit Trail** — `order_status_histories` setiap perubahan status

## Cara Menjalankan

```bash
# Install dependencies
composer install
npm install

# Setup database
cp .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed

# Jalankan development server
php artisan serve    # http://localhost:8000
npm run dev          # Vite HMR
```

## Login Demo
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@alatmusik.com | password123 |
| Customer | budi@gmail.com | password123 |

## Struktur Penting
```
app/
  Contracts/          ← Repository interfaces
  Repositories/       ← Eloquent implementations
  Models/             ← 15 Eloquent models
  Providers/          ← Service container bindings

database/
  migrations/         ← 17 migrations (15 tabel custom)
  seeders/            ← 7 seeders (data dummy realistis)

resources/js/
  Layouts/POSLayout.jsx      ← Layout utama (Sidebar + Navbar)
  Pages/Auth/Login.jsx       ← Halaman login dark theme
  Pages/Auth/Register.jsx    ← Halaman register dark theme
  Pages/Dashboard.jsx        ← Dashboard dengan stat cards

PDPLAlatMusik.postman_collection.json  ← Postman API collection
```

## Branch Strategy
```
main
  └── week-1   ← branch aktif development
```

## Database (15 Tabel)
`users` · `user_addresses` · `categories` · `products` · `stock_movements`
· `promos` · `carts` · `cart_items` · `orders` · `order_items`
· `order_status_histories` · `payments` · `shipments` · `refunds` · `reviews`
