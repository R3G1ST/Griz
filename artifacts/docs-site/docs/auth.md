---
sidebar_position: 2
---

# Авторизация

API использует **JWT токены** для защиты персональных данных и операций записи.

## Как это работает

1. Зарегистрируйтесь или войдите, получите токен
2. Передавайте токен в заголовке **Authorization: Bearer ВАШ_ТОКЕН**
3. Токен действует 7 дней

## Регистрация

POST /api/v1/auth/register

Тело запроса: username, password, telegramId (опционально)

Ответ: token + user object

## Вход

POST /api/v1/auth/login

Тело запроса: username, password

Ответ: token + user object

## Использование токена

Добавляйте заголовок: **Authorization: Bearer ВАШ_ТОКЕН**

Пример: GET /api/v1/auth/me

## Для Telegram-ботов

1. При первом сообщении вызовите /auth/register с telegramId
2. Сохраните полученный токен
3. Используйте токен для всех запросов

Публичные эндпоинты (GET /menu, GET /posts) не требуют токен.
