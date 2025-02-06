# Use the official PHP image from Docker Hub as a base image
FROM php:8.2-fpm

# Install system dependencies and PHP extensions needed for Laravel
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    zip \
    git \
    curl \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_mysql bcmath opcache

# Install Composer (Dependency Manager for PHP)
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Set the working directory inside the container
WORKDIR /var/www

# Copy the application files into the container
COPY . .

# Install the Laravel dependencies using Composer
RUN composer install --no-dev --optimize-autoloader

# Set the correct permissions for Laravel storage and cache directories
RUN chmod -R 775 storage bootstrap/cache

# Generate Laravel application key (optional, but recommended)
RUN php artisan key:generate

# Run Laravel database migrations (optional)
RUN php artisan migrate --force

# Expose the port the app will run on
EXPOSE 9000

# Start the PHP-FPM server (PHP FastCGI Process Manager)
CMD ["php-fpm"]
