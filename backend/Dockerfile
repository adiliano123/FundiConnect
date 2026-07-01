FROM php:8.2-cli

# Install system dependencies + PHP extensions
RUN apt-get update && apt-get install -y \
    git curl zip unzip libzip-dev libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring zip exif pcntl bcmath \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy composer files first (better layer caching)
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts

# Copy the full application
COPY . .

# Set storage permissions
RUN chmod -R 775 storage bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true

EXPOSE 8000

# Runtime: generate key → run migrations → cache config → start server
CMD php artisan key:generate --force \
    && php artisan migrate --force \
    && php artisan config:cache \
    && php artisan route:cache \
    && php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
