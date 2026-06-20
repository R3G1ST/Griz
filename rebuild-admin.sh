#!/bin/bash
echo "🔨 Собираем админку..."
cd /var/www/Griz && PORT=3000 BASE_PATH="/" pnpm --filter @workspace/grizli-admin run build

echo "🔄 Перезагружаем Nginx..."
systemctl reload nginx

echo "✅ Готово! Обновите страницу в браузере через Ctrl+F5"
