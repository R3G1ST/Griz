import { Router } from 'express';
import { eq, asc } from 'drizzle-orm';
import { db } from '../db/index.js';
import { menuItemsTable } from '../db/schema.js';
import { validateApiKey } from '../config/api-keys.js';

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
    const items = await db
      .select()
      .from(menuItemsTable)
      .where(eq(menuItemsTable.isVisible, 1))
      .orderBy(asc(menuItemsTable.sortOrder));
    res.json(items);
  } catch (error) {
    console.error('GET /menu error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/v1/menu/:id - публичный доступ
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const items = await db
      .select()
      .from(menuItemsTable)
      .where(eq(menuItemsTable.id, id))
      .limit(1);

    if (!items.length) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json(items[0]);
  } catch (error) {
    console.error('GET /menu/:id error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/v1/menu - требует API ключ
router.post('/', requireAdminKey, async (req, res) => {
  try {
    const newItem = await db
      .insert(menuItemsTable)
      .values(req.body)
      .returning();
    res.status(201).json(newItem[0]);
  } catch (error) {
    console.error('POST /menu error:', error);
    res.status(500).json({ error: 'Failed to create menu item' });
  }
});

// PUT /api/v1/menu/:id - требует API ключ
router.put('/:id', requireAdminKey, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updated = await db
      .update(menuItemsTable)
      .set(req.body)
      .where(eq(menuItemsTable.id, id))
      .returning();

    if (!updated.length) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json(updated[0]);
  } catch (error) {
    console.error('PUT /menu/:id error:', error);
    res.status(500).json({ error: 'Failed to update menu item' });
  }
});

// DELETE /api/v1/menu/:id - требует API ключ
router.delete('/:id', requireAdminKey, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await db
      .delete(menuItemsTable)
      .where(eq(menuItemsTable.id, id))
      .returning();

    if (!deleted.length) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json({ message: 'Menu item deleted', id });
  } catch (error) {
    console.error('DELETE /menu/:id error:', error);
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
});

export const menuRoutes = router;
