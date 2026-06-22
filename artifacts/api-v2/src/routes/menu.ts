import { Router } from 'express';
import { db } from '../db/index.js';
import { menuItemsTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const menuRoutes = Router();

// GET /api/v1/menu - Получить все позиции
menuRoutes.get('/', async (req, res) => {
  try {
    const items = await db.select().from(menuItemsTable);
    res.json(items);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

// GET /api/v1/menu/:id - Получить позицию по ID
menuRoutes.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [item] = await db.select().from(menuItemsTable).where(eq(menuItemsTable.id, id));
    
    if (!item) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error fetching menu item:', error);
    res.status(500).json({ error: 'Failed to fetch menu item' });
  }
});

// POST /api/v1/menu - Создать новую позицию
menuRoutes.post('/', async (req, res) => {
  try {
    const [item] = await db.insert(menuItemsTable).values(req.body).returning();
    res.status(201).json(item);
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({ error: 'Failed to create menu item' });
  }
});

// PUT /api/v1/menu/:id - Обновить позицию
menuRoutes.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [item] = await db.update(menuItemsTable)
      .set(req.body)
      .where(eq(menuItemsTable.id, id))
      .returning();
    
    if (!item) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ error: 'Failed to update menu item' });
  }
});

// DELETE /api/v1/menu/:id - Удалить позицию
menuRoutes.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(menuItemsTable).where(eq(menuItemsTable.id, id));
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
});
