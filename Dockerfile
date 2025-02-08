# Use official PHP 8.2 FPM image
FROM php:8.2-fpm

# Set working directory
WORKDIR /var/www/html

# Install required dependencies
RUN apt-get update && apt-get install -y \
    nginx \
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
    supervisor \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_mysql bcmath mbstring xml \
    && pecl install imagick \
    && docker-php-ext-enable imagick

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Install Node.js (for Laravel Mix)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g npm@latest

# Copy Laravel project files
COPY . .

# Install Laravel dependencies
RUN composer install --no-dev --optimize-autoloader

# Install JavaScript dependencies
RUN npm install && npm run build

# Set correct permissions for storage & bootstrap/cache
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Copy NGINX config
COPY nginx.conf /etc/nginx/nginx.conf

# Expose ports for NGINX
EXPOSE 80

# Start services
CMD ["sh", "-c", "php-fpm -D && nginx -g 'daemon off;'"]
