import { Router, type IRouter, type Request, type Response } from "express";
import { db, bookingsTable } from "@workspace/db";
import { eq, and, ne } from "drizzle-orm";

const router: IRouter = Router();

router.get("/slots", async (req: Request, res: Response) => {
  const date = req.query.date as string;
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    res.status(400).json({ error: "Укажите дату в формате YYYY-MM-DD" });
    return;
  }

  try {
    const taken = await db
      .select({ time: bookingsTable.time })
      .from(bookingsTable)
      .where(
        and(
          eq(bookingsTable.date, date),
          ne(bookingsTable.status, "cancelled")
        )
      );

    const takenTimes = taken.map(r => r.time);
    res.json({ date, taken: takenTimes });
  } catch {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

export default router;
