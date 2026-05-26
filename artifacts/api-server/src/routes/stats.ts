import { Router, type IRouter, type Request, type Response } from "express";
import { db, bookingsTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/stats", async (_req: Request, res: Response) => {
  try {
    const [totals] = await db.execute(sql`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE status = 'pending')::int AS pending,
        COUNT(*) FILTER (WHERE status = 'confirmed')::int AS confirmed,
        COUNT(*) FILTER (WHERE status = 'cancelled')::int AS cancelled,
        COALESCE(SUM(guests) FILTER (WHERE status = 'confirmed'), 0)::int AS total_guests
      FROM ${bookingsTable}
    `);

    const byDay = await db.execute(sql`
      SELECT
        date AS day,
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE status = 'confirmed')::int AS confirmed
      FROM ${bookingsTable}
      WHERE date >= TO_CHAR(NOW() - INTERVAL '30 days', 'YYYY-MM-DD')
      GROUP BY date
      ORDER BY date
    `);

    const byHour = await db.execute(sql`
      SELECT
        time AS hour,
        COUNT(*)::int AS count
      FROM ${bookingsTable}
      WHERE status = 'confirmed'
      GROUP BY time
      ORDER BY count DESC
    `);

    const byGuests = await db.execute(sql`
      SELECT
        guests,
        COUNT(*)::int AS count
      FROM ${bookingsTable}
      WHERE status = 'confirmed'
      GROUP BY guests
      ORDER BY guests
    `);

    res.json({
      totals: totals.rows[0],
      byDay: byDay.rows,
      byHour: byHour.rows,
      byGuests: byGuests.rows,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

export default router;
