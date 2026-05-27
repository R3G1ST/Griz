import { Router, type IRouter, type Request, type Response } from "express";
import { db, bookingsTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/stats", async (_req: Request, res: Response) => {
  try {
    const totals  = await db.execute(sql`
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
      totals:   (totals   as any).rows[0] ?? { total: 0, pending: 0, confirmed: 0, cancelled: 0, total_guests: 0 },
      byDay:    (byDay    as any).rows ?? [],
      byHour:   (byHour   as any).rows ?? [],
      byGuests: (byGuests as any).rows ?? [],
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// GET /api/stats/heatmap?days=28
// Returns occupancy buckets aggregated over day-of-week × hour for confirmed bookings
// in the trailing `days` window. Hours 0-2 are mapped to 24-26 so the night session
// stays contiguous on the chart (16:00 → 02:00 of the next day).
//   dow: 0=Mon ... 6=Sun (ISO week order)
//   hour: 16..26 (where 24=00:00, 25=01:00, 26=02:00)
router.get("/stats/heatmap", async (req: Request, res: Response) => {
  const daysRaw = Number(req.query.days ?? 28);
  const days = Number.isFinite(daysRaw) && daysRaw > 0 && daysRaw <= 365 ? Math.floor(daysRaw) : 28;
  try {
    // Tyumen tz = Asia/Yekaterinburg (UTC+5, no DST). Window is anchored to local "today"
    // and goes back `days - 1` calendar days so the count is inclusive (e.g. days=7 = a week).
    // For DOW we map ISO Mon=1..Sun=7 to Mon=0..Sun=6 once. Hours 00:00–02:00 belong to the
    // *previous* day's evening session, so we shift them: hour += 24 AND dow = (dow + 6) % 7.
    const rows = await db.execute(sql`
      WITH src AS (
        SELECT
          ((EXTRACT(ISODOW FROM date::date)::int + 6) % 7) AS dow_base,
          LEFT(time, 2)::int AS hour_raw,
          guests
        FROM ${bookingsTable}
        WHERE status = 'confirmed'
          AND date::date >= ((timezone('Asia/Yekaterinburg', NOW()))::date - ((${days} - 1) || ' days')::interval)::date
          AND date::date <= (timezone('Asia/Yekaterinburg', NOW()))::date
      ),
      shifted AS (
        SELECT
          CASE WHEN hour_raw < 3 THEN (dow_base + 6) % 7 ELSE dow_base END AS dow,
          CASE WHEN hour_raw < 3 THEN hour_raw + 24      ELSE hour_raw  END AS hour,
          guests
        FROM src
      )
      SELECT
        dow,
        hour,
        COUNT(*)::int AS bookings,
        SUM(guests)::int AS guests
      FROM shifted
      GROUP BY dow, hour
      ORDER BY dow, hour
    `);
    res.json({
      days,
      cells: ((rows as any).rows ?? []) as { dow: number; hour: number; bookings: number; guests: number }[],
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

export default router;
