import { Router } from "express";
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://griz:griz_password_2024@localhost:5432/griz_db",
});

const router = Router();

router.get("/menu-categories", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM menu_categories ORDER BY display_order');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

router.post("/menu-categories", async (req, res) => {
  const { key, label, emoji, display_order, title_size, title_position } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO menu_categories (key, label, emoji, display_order, title_size, title_position) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [key, label, emoji, display_order || 999, title_size || 40, title_position || 50]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

router.put("/menu-categories/:id", async (req, res) => {
  const { id } = req.params;
  const { label, emoji, image, display_order, is_active, title_size, title_position } = req.body;
  try {
    await pool.query(
      'UPDATE menu_categories SET label=$1, emoji=$2, image=$3, display_order=$4, is_active=$5, title_size=$6, title_position=$7, updated_at=NOW() WHERE id=$8',
      [label, emoji, image, display_order, is_active, title_size || 40, title_position || 50, id]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

router.delete("/menu-categories/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM menu_categories WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;
