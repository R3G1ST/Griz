import { Router } from 'express';
import { validateApiKey } from '../config/api-keys.js';

const router = Router();

// POST /api/v1/bot/webhook — приём обновлений от Telegram
router.post('/webhook', validateApiKey, async (req, res) => {
  try {
    const update = req.body;

    // Логируем входящее обновление
    console.log('Telegram update:', JSON.stringify(update, null, 2));

    // Обработка текстовых сообщений
    if (update.message?.text) {
      const chatId = update.message.chat.id;
      const text = update.message.text;
      const username = update.message.from?.username || 'unknown';

      console.log(`Message from @${username} (${chatId}): ${text}`);

      // TODO: Здесь будет логика бота
      // Например: команды /menu, /order, /help
    }

    // Обработка callback_query (inline кнопки)
    if (update.callback_query) {
      const chatId = update.callback_query.message.chat.id;
      const data = update.callback_query.data;

      console.log(`Callback from ${chatId}: ${data}`);

      // TODO: Обработка нажатий на кнопки
    }

    // Telegram требует ответ 200 OK
    res.json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(200).json({ ok: true }); // Всегда отвечаем 200 чтобы Telegram не повторял запрос
  }
});

// GET /api/v1/bot/info — информация о боте
router.get('/info', validateApiKey, (req, res) => {
  res.json({
    webhook_url: 'https://api.grizzly-lounge.qmbox.ru/api/v1/bot/webhook',
    status: 'active',
    version: '1.0.0',
  });
});

export const botRoutes = router;
