import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { usersTable } from '../db/schema.js';
import { generateToken, hashPassword, comparePassword } from '../config/auth.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// POST /api/v1/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, password, telegramId } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'username and password are required' });
    }

    // Проверяем что пользователь не существует
    const existing = await db.select().from(usersTable).where(eq(usersTable.username, username)).limit(1);
    if (existing.length) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    const passwordHash = await hashPassword(password);
    const user = await db.insert(usersTable).values({ username, passwordHash, telegramId }).returning();

    const token = generateToken({ userId: user[0].id, role: user[0].role as 'admin' | 'user' });

    res.status(201).json({
      token,
      user: { id: user[0].id, username: user[0].username, role: user[0].role },
    });
  } catch (error) {
    console.error('POST /auth/register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/v1/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'username and password are required' });
    }

    const users = await db.select().from(usersTable).where(eq(usersTable.username, username)).limit(1);
    if (!users.length) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await comparePassword(password, users[0].passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({ userId: users[0].id, role: users[0].role as 'admin' | 'user' });

    res.json({
      token,
      user: { id: users[0].id, username: users[0].username, role: users[0].role },
    });
  } catch (error) {
    console.error('POST /auth/login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/v1/auth/me — текущий пользователь
router.get('/me', requireAuth, async (req, res) => {
  try {
    const users = await db.select().from(usersTable).where(eq(usersTable.id, req.user!.userId)).limit(1);
    if (!users.length) {
      return res.status(404).json({ error: 'User not found' });
    }
    const u = users[0];
    res.json({ id: u.id, username: u.username, role: u.role, telegramId: u.telegramId });
  } catch (error) {
    console.error('GET /auth/me error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export const authRoutes = router;
