# Node.js 20 をベースにする
FROM node:20

WORKDIR /app

# ホストの package.json と package-lock.json をコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install --include=dev

# アプリケーションのソースをコピー
COPY . .

# Next.js の開発サーバーを起動
CMD ["npm", "run", "dev"]