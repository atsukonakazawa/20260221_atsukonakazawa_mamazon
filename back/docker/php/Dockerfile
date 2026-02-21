# 使用するベースイメージとして PHP 8.1（FPM版）を指定
# FPM版は Nginx と合わせて動かす構成でよく使われる
FROM php:8.1-fpm

# ローカルの php.ini をコンテナ内（/usr/local/etc/php/）にコピー
# → PHP の設定（タイムアウト・メモリなど）をカスタマイズ可能にするため
COPY php.ini /usr/local/etc/php/

# 必要パッケージ・PHP拡張のインストール
# MySQL クライアント…DB接続確認や artisan migrate 用に便利
# zlib / libzip … zip拡張をビルドするために必須
# PHP の公式スクリプトで pdo_mysql（MySQL用PDO）と zip を有効化
RUN apt update \
    && apt install -y default-mysql-client zlib1g-dev libzip-dev unzip \
    && docker-php-ext-install pdo_mysql zip

# Composer（PHPのパッケージ管理ツール）インストール
# 実行ファイルとして使えるように /usr/local/bin に移動
# Composer 自体のアップデート（念のため最新にしておく）
RUN curl -sS https://getcomposer.org/installer | php \
    && mv composer.phar /usr/local/bin/composer \
    && composer self-update

# コンテナ内で作業するディレクトリを指定
# 以降の COPY や RUN は /var/www を基準に実行される
WORKDIR /var/www