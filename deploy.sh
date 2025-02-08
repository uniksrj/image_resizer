#!/usr/bin/env bash

echo "Running Composer..."
composer install --no-dev --optimize-autoloader

echo "Caching Config..."
php artisan config:cache

echo "Caching Routes..."
php artisan route:cache

echo "Running Migrations..."
php artisan migrate --force

echo "Deployment Finished!"
