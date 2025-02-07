# Use an official PHP image with CLI and FPM
FROM php:8.2-fpm

# Set working directory inside the container
WORKDIR /var/www/html

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    curl \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libmagickwand-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_mysql mbstring xml bcmath \
    && pecl install imagick \
    && docker-php-ext-enable imagick

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Install Node.js and npm (for Laravel Mix / frontend assets)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g npm@latest

# Copy existing Laravel application files
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Install JavaScript libraries
RUN npm install jquery cropperjs bootstrap axios vue

# Build frontend assets
RUN npm run build

# Set permissions for Laravel storage & cache directories
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Expose port 9000 for PHP-FPM
EXPOSE 9000

# Start PHP-FPM server
CMD ["php-fpm"]
