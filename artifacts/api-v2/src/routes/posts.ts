import { Router } from 'express';
import { validateApiKey } from '../config/api-keys';

const router = Router();

// Middleware для проверки админского ключа
const requireAdminKey = (req: any, res: any, next: any) => {
  const apiKey = req.headers['x-api-key'] as string;
  if (!validateApiKey(apiKey, 'admin')) {
    return res.status(401).json({ error: 'Invalid or missing API key' });
  }
  next();
};

// GET /api/v1/posts - публичный доступ
router.get('/', async (req, res) => {
  try {
    // Заглушка — позже подключим БД
    res.json([
      {
        id: 1,
        title: 'Добро пожаловать в Grizzly Lounge',
        slug: 'welcome-to-grizzly-lounge',
        excerpt: 'Мы открылись! Приходите за лучшим кальяном в городе.',
        content: 'Полный текст статьи...',
        image: null,
        publishedAt: '2026-06-22T16:00:00.000Z',
        isActive: true,
      },
    ]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/v1/posts/:slug - публичный доступ
router.get('/:slug', async (req, res) => {
  try {
    res.json({ message: 'Post by slug', slug: req.params.slug });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/v1/posts - требует API ключ
router.post('/', requireAdminKey, async (req, res) => {
  try {
    res.status(201).json({ message: 'Post created' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/v1/posts/:id - требует API ключ
router.put('/:id', requireAdminKey, async (req, res) => {
  try {
    res.json({ message: 'Post updated' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/v1/posts/:id - требует API ключ
router.delete('/:id', requireAdminKey, async (req, res) => {
  try {
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export const postsRoutes = router;
