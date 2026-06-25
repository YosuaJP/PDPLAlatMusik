#!/bin/sh
set -e

echo "==> Starting NadaKito..."

# Generate app key if not set
php artisan key:generate --force 2>/dev/null || true

# Cache config & routes for production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run database migrations
echo "==> Running migrations..."
php artisan migrate --force

# Seed initial admin accounts
echo "==> Seeding database..."
php artisan db:seed --class=UserSeeder --force 2>/dev/null || echo "Seeder skipped (already seeded)"

# Create storage symlink
php artisan storage:link 2>/dev/null || true

echo "==> Starting PHP-FPM..."
php-fpm -D

echo "==> Starting Nginx..."
nginx -g "daemon off;"
