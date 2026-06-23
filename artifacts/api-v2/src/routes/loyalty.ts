import { Router } from 'express';
import { db } from '../db/index.js';
import { loyaltyUsers } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { validateApiKey } from '../config/api-keys.js';

const router = Router();

const STATUS_CONFIG: Record<string, { cashback: number; nextVisits: number | null }> = {
  bronze:   { cashback: 0.05, nextVisits: 10 },
  silver:   { cashback: 0.08, nextVisits: 25 },
  gold:     { cashback: 0.12, nextVisits: 50 },
  platinum: { cashback: 0.15, nextVisits: null },
};

// Регистрация клиента
router.post('/register', async (req, res) => {
  try {
    const { phone, name } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone required' });

    const qrCode = randomUUID().slice(0, 16);
    const result = await db.insert(loyaltyUsers)
      .values({ phone, name: name || null, qrCode })
      .onConflictDoUpdate({ target: loyaltyUsers.phone, set: { name: name || undefined } })
      .returning();
    res.json(result[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Получить карту по QR
router.get('/card/:qr', async (req, res) => {
  const result = await db.select().from(loyaltyUsers).where(eq(loyaltyUsers.qrCode, req.params.qr));
  if (!result.length) return res.status(404).json({ error: 'Card not found' });
  res.json(result[0]);
});

// Расчёт баллов по сумме
router.post('/calculate', (req, res) => {
  const { amount, status } = req.body;
  const cfg = STATUS_CONFIG[status || 'bronze'] || STATUS_CONFIG.bronze;
  const points = Math.floor(amount * cfg.cashback);
  res.json({ amount, status: status || 'bronze', cashback_pct: cfg.cashback * 100, points });
});

// Начисление за визит (staff only)
router.post('/visit', validateApiKey, async (req, res) => {
  try {
    const { qr_code, amount } = req.body;
    if (!qr_code || !amount) return res.status(400).json({ error: 'qr_code and amount required' });

    const users = await db.select().from(loyaltyUsers).where(eq(loyaltyUsers.qrCode, qr_code));
    if (!users.length) return res.status(404).json({ error: 'User not found' });

    const u = users[0];
    const cfg = STATUS_CONFIG[u.status] || STATUS_CONFIG.bronze;
    const earned = Math.floor(amount * cfg.cashback);
    const newVisits = u.visits + 1;
    const newPoints = u.points + earned;

    let newStatus = u.status;
    if (u.status === 'bronze' && newVisits >= 10) newStatus = 'silver';
    else if (u.status === 'silver' && newVisits >= 25) newStatus = 'gold';
    else if (u.status === 'gold' && newVisits >= 50) newStatus = 'platinum';

    await db.update(loyaltyUsers)
      .set({ points: newPoints, visits: newVisits, status: newStatus, updatedAt: new Date() })
      .where(eq(loyaltyUsers.qrCode, qr_code));

    res.json({ earned, newPoints, newVisits, newStatus, upgraded: newStatus !== u.status });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Visit failed' });
  }
});

export const loyaltyRoutes = router;
