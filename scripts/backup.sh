#!/bin/bash
# Бэкап проекта GRIZLI с автоудалением старых (оставляем 2 последних)

BACKUP_DIR="/var/www/backups"
PROJECT_DIR="/var/www/Griz"
DB_NAME="griz_db"
DB_USER="griz"
DB_PASS="griz_password_2024"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_NAME="griz-backup-${TIMESTAMP}"

mkdir -p "$BACKUP_DIR"

echo "📦 Создание бэкапа: $BACKUP_NAME"

# 1. Бэкап БД
echo "  → База данных..."
PGPASSWORD=$DB_PASS pg_dump -h localhost -U $DB_USER $DB_NAME > "$BACKUP_DIR/${BACKUP_NAME}-db.sql" 2>/dev/null

# 2. Бэкап файлов (кроме node_modules и dist)
echo "  → Файлы проекта..."
cd "$PROJECT_DIR"
tar czf "$BACKUP_DIR/${BACKUP_NAME}-files.tar.gz" \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='.git' \
  --exclude='backups' \
  artifacts/ scripts/ 2>/dev/null

# 3. Удаляем старые бэкапы, оставляем только 2 последних
echo "  → Очистка старых бэкапов..."
cd "$BACKUP_DIR"
ls -t griz-backup-*-files.tar.gz 2>/dev/null | tail -n +3 | xargs -r rm -f
ls -t griz-backup-*-db.sql 2>/dev/null | tail -n +3 | xargs -r rm -f

# 4. Итог
echo ""
echo "✅ Бэкап создан: $BACKUP_NAME"
ls -lh "$BACKUP_DIR/${BACKUP_NAME}"* 2>/dev/null
echo ""
echo "📋 Текущие бэкапы:"
ls -lh "$BACKUP_DIR"/*.tar.gz 2>/dev/null | tail -5
