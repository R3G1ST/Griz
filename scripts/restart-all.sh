#!/bin/bash
echo "1. Перезапуск Nginx..."
systemctl restart nginx

echo "2. Остановка старого API..."
pkill -f "api-server" || true
sleep 2

echo "3. Запуск API..."
cd /var/www/Griz && DATABASE_URL=postgresql://griz:griz_password_2024@localhost:5432/griz_db PORT=3000 nohup pnpm --filter @workspace/api-server run dev > /tmp/api-server.log 2>&1 &

echo "4. Всё перезапущено!"
