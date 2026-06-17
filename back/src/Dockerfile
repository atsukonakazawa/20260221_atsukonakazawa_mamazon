FROM php:8.1-apache

# 必要パッケージ
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    zip \
    libzip-dev \
    default-mysql-client \
    && docker-php-ext-install pdo_mysql zip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Apache Rewrite
RUN a2enmod rewrite

WORKDIR /var/www/html

# ソースコピー
COPY . .

# Composer
RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-interaction

# Laravel用ディレクトリ作成＆権限設定
RUN mkdir -p \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# DocumentRoot を public に変更
RUN sed -ri \
    -e 's!/var/www/html!/var/www/html/public!g' \
    /etc/apache2/sites-available/*.conf

EXPOSE 80

COPY docker-entrypoint.sh /usr/local/bin/

RUN chmod +x /usr/local/bin/docker-entrypoint.sh

CMD ["/usr/local/bin/docker-entrypoint.sh"]