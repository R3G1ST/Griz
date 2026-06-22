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

// GET /api/v1/menu - публичный доступ
router.get('/', async (req, res) => {
  try {
    // Логика получения меню из БД
    res.json([]); 
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/v1/menu - требует API ключ
router.post('/', requireAdminKey, async (req, res) => {
  try {
    // Логика создания позиции
    res.status(201).json({ message: 'Menu item created' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/v1/menu/:id - требует API ключ
router.put('/:id', requireAdminKey, async (req, res) => {
  try {
    // Логика обновления
    res.json({ message: 'Menu item updated' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/v1/menu/:id - требует API ключ
router.delete('/:id', requireAdminKey, async (req, res) => {
  try {
    // Логика удаления
    res.json({ message: 'Menu item deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export const menuRoutes = router;
