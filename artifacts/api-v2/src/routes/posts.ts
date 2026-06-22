import { Router } from 'express';
import { eq, desc } from 'drizzle-orm';
import { db } from '../db/index.js';
import { postsTable } from '../db/schema.js';
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

// GET /api/v1/posts - публичный доступ (только опубликованные)
router.get('/', async (req, res) => {
  try {
    const posts = await db
      .select()
      .from(postsTable)
      .where(eq(postsTable.published, true))
      .orderBy(desc(postsTable.createdAt));
    res.json(posts);
  } catch (error) {
    console.error('GET /posts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/v1/posts/all - все посты (требует API ключ)
router.get('/all', requireAdminKey, async (req, res) => {
  try {
    const posts = await db
      .select()
      .from(postsTable)
      .orderBy(desc(postsTable.createdAt));
    res.json(posts);
  } catch (error) {
    console.error('GET /posts/all error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/v1/posts/:slug - публичный доступ
router.get('/:slug', async (req, res) => {
  try {
    const post = await db
      .select()
      .from(postsTable)
      .where(eq(postsTable.slug, req.params.slug))
      .limit(1);

    if (!post.length || !post[0].published) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post[0]);
  } catch (error) {
    console.error('GET /posts/:slug error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/v1/posts - требует API ключ
router.post('/', requireAdminKey, async (req, res) => {
  try {
    const { title, slug, content, excerpt, image, published } = req.body;

    if (!title || !slug || !content) {
      return res.status(400).json({ error: 'title, slug and content are required' });
    }

    const newPost = await db
      .insert(postsTable)
      .values({ title, slug, content, excerpt, image, published })
      .returning();

    res.status(201).json(newPost[0]);
  } catch (error: any) {
    console.error('POST /posts error:', error);
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Post with this slug already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/v1/posts/:id - требует API ключ
router.put('/:id', requireAdminKey, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, slug, content, excerpt, image, published } = req.body;

    const updated = await db
      .update(postsTable)
      .set({ title, slug, content, excerpt, image, published, updatedAt: new Date() })
      .where(eq(postsTable.id, id))
      .returning();

    if (!updated.length) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(updated[0]);
  } catch (error: any) {
    console.error('PUT /posts/:id error:', error);
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Post with this slug already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/v1/posts/:id - требует API ключ
router.delete('/:id', requireAdminKey, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const deleted = await db
      .delete(postsTable)
      .where(eq(postsTable.id, id))
      .returning();

    if (!deleted.length) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json({ message: 'Post deleted', id });
  } catch (error) {
    console.error('DELETE /posts/:id error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export const postsRoutes = router;
