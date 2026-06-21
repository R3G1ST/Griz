import { exec } from "child_process";
import { Router, type IRouter, type Request, type Response } from "express";
import { db, siteSettingsTable, menuItemsTable, galleryImagesTable, reviewsTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { requireAdmin } from "../middleware/admin-auth";

const router: IRouter = Router();

const SAFE_URL = /^https?:\/\/[^\s<>"']+$/i;
function isSafeUrl(u: unknown): u is string {
  return typeof u === "string" && u.length < 2048 && SAFE_URL.test(u);
}

// ── Site settings (key/value JSON) ────────────────────────────────────────────
router.get("/settings", async (_req: Request, res: Response) => {
  try {
    const rows = await db.select().from(siteSettingsTable);
    const obj: Record<string, unknown> = {};
    for (const r of rows) obj[r.key] = r.value;
    res.json(obj);
  } catch {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.put("/settings/:key", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    if (!/^[a-z0-9_-]{1,64}$/i.test(key)) {
      res.status(400).json({ error: "Invalid key" });
      return;
    }
    const value = req.body?.value ?? req.body;
    await db.insert(siteSettingsTable).values({ key, value })
      .onConflictDoUpdate({ target: siteSettingsTable.key, set: { value, updatedAt: new Date() } });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// ── Menu items ────────────────────────────────────────────────────────────────
router.get("/menu", async (_req: Request, res: Response) => {
  try {
    const items = await db.select().from(menuItemsTable)
      .orderBy(asc(menuItemsTable.section), asc(menuItemsTable.category), asc(menuItemsTable.sortOrder), asc(menuItemsTable.id));
    res.json(items);
  } catch {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.post("/menu", requireAdmin, async (req: Request, res: Response) => {
  console.log('POST /menu received body:', JSON.stringify(req.body));
  try {
    const b = req.body ?? {};
    const { section, category, name, description = "", price, sortOrder = 0, isActive = 1, isFeatured = 0, strength = 4, sessionDuration = 120, bowl = "Phunnel · Glaze", coal = "Coco · 25mm" } = b;
    const missingFields = [];
    if (!section) missingFields.push('Секция');
    if (!category) missingFields.push('Категория');
    if (!name) missingFields.push('Название');
    if (!price) missingFields.push('Цена');
    if (!b.menuCategory) missingFields.push('Главная категория');
    
    if (missingFields.length > 0) {
      res.status(400).json({ 
        error: "Заполните обязательные поля",
        missingFields: missingFields
      });
      return;
    }
    
    // Формируем объект для вставки
    const insertData: any = { 
      section, category, name, description, price, sortOrder, 
      isActive: isActive ? 1 : 0, 
      isFeatured: isFeatured ? 1 : 0, 
      strength, sessionDuration, bowl, coal 
    };
    
    // Добавляем новые поля если они есть
    if (b.menuCategory !== undefined) insertData.menuCategory = String(b.menuCategory);
    if (b.image !== undefined) insertData.image = String(b.image);
    if (b.categoryImage !== undefined) insertData.categoryImage = String(b.categoryImage);
    if (b.ingredients !== undefined) insertData.ingredients = String(b.ingredients);
    if (b.allergens !== undefined) insertData.allergens = String(b.allergens);
    if (b.calories !== undefined) insertData.calories = Number(b.calories);
    if (b.protein !== undefined) insertData.protein = Number(b.protein);
    if (b.fat !== undefined) insertData.fat = Number(b.fat);
    if (b.carbs !== undefined) insertData.carbs = Number(b.carbs);
    if (b.tobaccoBrand !== undefined) insertData.tobaccoBrand = String(b.tobaccoBrand);
    if (b.tobaccoFlavor !== undefined) insertData.tobaccoFlavor = String(b.tobaccoFlavor);
    if (b.hookahModel !== undefined) insertData.hookahModel = String(b.hookahModel);
    if (b.priceFeatured !== undefined) insertData.priceFeatured = String(b.priceFeatured);
    if (b.descriptionFeatured !== undefined) insertData.descriptionFeatured = String(b.descriptionFeatured);
    if (b.status !== undefined) insertData.status = String(b.status);
    if (b.isVisible !== undefined) insertData.isVisible = Number(b.isVisible);
    
    const [item] = await db.insert(menuItemsTable).values(insertData).returning();
    res.status(201).json(item);
  } catch (e) { 
    console.error('POST /menu error:', e);
    res.status(500).json({ error: "Ошибка сервера" }); 
  }
});

router.put("/menu/:id", requireAdmin, async (req: Request, res: Response) => {
  console.log('PUT /menu/:id received body:', JSON.stringify(req.body));
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) { res.status(400).json({ error: "bad id" }); return; }
    const b = req.body ?? {};
    const updates: Record<string, unknown> = {};
    
    // Сохраняем isFeatured - может прийти как boolean или число
    if (b.isFeatured !== undefined) {
      updates.isFeatured = (b.isFeatured === true || b.isFeatured === 1) ? 1 : 0;
      console.log('isFeatured received:', b.isFeatured, '-> setting to:', updates.isFeatured);
    }
    if (b.strength !== undefined) updates.strength = Number(b.strength);
    if (b.sessionDuration !== undefined) updates.sessionDuration = Number(b.sessionDuration);
    if (b.bowl !== undefined) updates.bowl = String(b.bowl);
    if (b.coal !== undefined) updates.coal = String(b.coal);
    if (b.tobaccoBrand !== undefined) updates.tobaccoBrand = String(b.tobaccoBrand);
    if (b.tobaccoFlavor !== undefined) updates.tobaccoFlavor = String(b.tobaccoFlavor);
    if (b.hookahModel !== undefined) updates.hookahModel = String(b.hookahModel);
    if (b.priceFeatured !== undefined) updates.priceFeatured = String(b.priceFeatured);
    if (b.descriptionFeatured !== undefined) updates.descriptionFeatured = String(b.descriptionFeatured);
    if (b.image !== undefined) updates.image = String(b.image);
    if (b.categoryImage !== undefined) updates.categoryImage = String(b.categoryImage);
    if (b.ingredients !== undefined) updates.ingredients = String(b.ingredients);
    if (b.allergens !== undefined) updates.allergens = String(b.allergens);
    if (b.calories !== undefined) updates.calories = Number(b.calories);
    if (b.protein !== undefined) updates.protein = Number(b.protein);
    if (b.fat !== undefined) updates.fat = Number(b.fat);
    if (b.carbs !== undefined) updates.carbs = Number(b.carbs);
    if (b.menuCategory !== undefined) updates.menuCategory = String(b.menuCategory);
    if (b.status !== undefined) updates.status = String(b.status);
    if (b.isVisible !== undefined) updates.isVisible = Number(b.isVisible);

    // String fields: trim, enforce non-empty + length limits to prevent invalid persisted state
    for (const k of ["section", "category", "name", "price"] as const) {
      if (k in b) {
        if (typeof b[k] !== "string") { res.status(400).json({ error: `${k} must be string` }); return; }
        const v = b[k].trim();
        if (!v) { res.status(400).json({ error: `${k} is empty` }); return; }
        if (v.length > 200) { res.status(400).json({ error: `${k} too long` }); return; }
        updates[k] = v;
      }
    }
    if ("description" in b) {
      const v = typeof b.description === "string" ? b.description.slice(0, 1000) : "";
      updates.description = v;
    }
    if ("sortOrder" in b) {
      const n = Number(b.sortOrder);
      if (!Number.isFinite(n)) { res.status(400).json({ error: "sortOrder NaN" }); return; }
      updates.sortOrder = n;
    }
    if ("isActive" in b) updates.isActive = b.isActive ? 1 : 0;

    if (Object.keys(updates).length === 0) { res.status(400).json({ error: "no fields" }); return; }
    console.log('Saving updates for id', id, ':', JSON.stringify(updates));
    const [item] = await db.update(menuItemsTable).set(updates).where(eq(menuItemsTable.id, id)).returning();
    console.log('Saved item:', JSON.stringify(item));
    res.json(item);
  } catch { res.status(500).json({ error: "Ошибка сервера" }); }
});

router.delete("/menu/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) { res.status(400).json({ error: "bad id" }); return; }
    await db.delete(menuItemsTable).where(eq(menuItemsTable.id, id));
    res.json({ ok: true });
  } catch { res.status(500).json({ error: "Ошибка сервера" }); }
});

// ── Gallery ──────────────────────────────────────────────────────────────────
router.get("/gallery", async (_req: Request, res: Response) => {
  try {
    const items = await db.select().from(galleryImagesTable)
      .orderBy(asc(galleryImagesTable.sortOrder), asc(galleryImagesTable.id));
    res.json(items);
  } catch {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.post("/gallery", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { url, caption = "", sortOrder = 0 } = req.body ?? {};
    if (!isSafeUrl(url)) { res.status(400).json({ error: "URL должен быть http(s)://..." }); return; }
    const safeCaption = typeof caption === "string" ? caption.slice(0, 200) : "";
    const [item] = await db.insert(galleryImagesTable).values({ url, caption: safeCaption, sortOrder: Number(sortOrder) || 0 }).returning();
    res.status(201).json(item);
  } catch { res.status(500).json({ error: "Ошибка сервера" }); }
});

router.delete("/gallery/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) { res.status(400).json({ error: "bad id" }); return; }
    await db.delete(galleryImagesTable).where(eq(galleryImagesTable.id, id));
    res.json({ ok: true });
  } catch { res.status(500).json({ error: "Ошибка сервера" }); }
});

// ── Reviews moderation (admin) ────────────────────────────────────────────────
router.delete("/reviews/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) { res.status(400).json({ error: "bad id" }); return; }
    await db.delete(reviewsTable).where(eq(reviewsTable.id, id));
    res.json({ ok: true });
  } catch { res.status(500).json({ error: "Ошибка сервера" }); }
});

router.patch("/reviews/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) { res.status(400).json({ error: "bad id" }); return; }
    const isPublished = req.body?.isPublished;
    if (typeof isPublished !== "number" && typeof isPublished !== "boolean") {
      res.status(400).json({ error: "isPublished required" }); return;
    }
    const [r] = await db.update(reviewsTable)
      .set({ isPublished: isPublished ? 1 : 0 })
      .where(eq(reviewsTable.id, id)).returning();
    res.json(r);
  } catch { res.status(500).json({ error: "Ошибка сервера" }); }
});

export default router;

// --- Управление системой ---
router.get("/system/status", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const { execSync } = require("child_process");
    
    // Проверяем сервисы
    const checkService = (name: string) => {
      try {
        const result = execSync(`systemctl is-active ${name} 2>/dev/null`).toString().trim();
        return result === "active";
      } catch { return false; }
    };
    
    // Проверяем сайт (внешний запрос)
    const checkWebsite = () => {
      try {
        const result = execSync('curl -s -o /dev/null -w "%{http_code}" --max-time 3 https://grizzly-lounge.qmbox.ru').toString().trim();
        return { status: result, ok: result === "200" };
      } catch { return { status: "error", ok: false }; }
    };
    
    // Проверяем API (просто по процессу, без curl)
    const checkAPI = () => {
      try {
        const result = execSync('pgrep -f "api-server"').toString().trim();
        return result.length > 0;
      } catch { return false; }
    };
    
    res.json({
      nginx: checkService("nginx"),
      api: checkAPI(),
      postgres: checkService("postgresql"),
      website: checkWebsite(),
      timestamp: Date.now()
    });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

router.get("/system/stats", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const { execSync } = require("child_process");
    
    // RAM
    const memInfo = execSync("free -m").toString();
    const memMatch = memInfo.match(/Mem:\s+(\d+)\s+(\d+)\s+/);
    const memTotal = memMatch ? parseInt(memMatch[1]) : 0;
    const memUsed = memMatch ? parseInt(memMatch[2]) : 0;
    const memPercent = memTotal > 0 ? Math.round((memUsed / memTotal) * 100) : 0;
    
    // Диск
    const diskInfo = execSync("df -h / | tail -1").toString().trim().split(/\s+/);
    const diskTotal = diskInfo[1] || "0";
    const diskUsed = diskInfo[2] || "0";
    const diskPercent = parseInt(diskInfo[4]) || 0;
    
    // CPU
    const cpuLoad = execSync("cat /proc/loadavg").toString().trim().split(" ")[0];
    
    res.json({
      memory: { total: memTotal, used: memUsed, percent: memPercent },
      disk: { total: diskTotal, used: diskUsed, percent: diskPercent },
      cpu: parseFloat(cpuLoad),
      timestamp: Date.now()
    });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

router.post("/system/restart/:service", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { service } = req.params;
    const allowed = ["nginx", "api", "all"];
    
    if (!allowed.includes(service)) {
      res.status(400).json({ error: "Недопустимый сервис" });
      return;
    }
    
    const { exec } = require("child_process");
    
    if (service === "nginx") {
      exec("systemctl restart nginx");
      res.json({ message: "Nginx перезапущен" });
    } else if (service === "api") {
      exec("pkill -f api-server && sleep 2 && cd /var/www/Griz && DATABASE_URL=postgresql://griz:griz_password_2024@localhost:5432/griz_db PORT=3000 nohup pnpm --filter @workspace/api-server run dev > /tmp/api-server.log 2>&1 &");
      res.json({ message: "API перезапущен" });
    } else if (service === "all") {
      exec("nohup /var/www/Griz/scripts/restart-all.sh > /tmp/restart.log 2>&1 &");
      res.json({ message: "Полный перезапуск инициирован" });
    }
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

router.get("/system/logs", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const { execSync } = require("child_process");
    const logs = execSync("tail -100 /tmp/api-server.log").toString();
    res.json({ logs });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// --- Управление системой v4 (быстрое) ---
const { exec } = require("child_process");
const { promisify } = require("util");
const execAsync = promisify(exec);

router.get("/system/status", requireAdmin, async (_req: Request, res: Response) => {
  try {
    // Все проверки параллельно и асинхронно
    const [nginxResult, apiResult, postgresResult] = await Promise.allSettled([
      execAsync('systemctl is-active nginx 2>/dev/null'),
      execAsync('pgrep -f "api-server"'),
      execAsync('systemctl is-active postgresql 2>/dev/null')
    ]);
    
    const nginx = nginxResult.status === 'fulfilled' && nginxResult.value.stdout.trim() === 'active';
    const api = apiResult.status === 'fulfilled' && apiResult.value.stdout.trim().length > 0;
    const postgres = postgresResult.status === 'fulfilled' && postgresResult.value.stdout.trim() === 'active';
    
    res.json({ nginx, api, postgres, timestamp: Date.now() });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

router.get("/system/website", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const result = await execAsync('curl -s -o /dev/null -w "%{http_code}" --max-time 3 https://grizzly-lounge.qmbox.ru');
    const status = result.stdout.trim();
    res.json({ status, ok: status === "200" });
  } catch { res.json({ status: "error", ok: false }); }
});

router.get("/system/stats", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const { execSync } = require("child_process");
    
    const memInfo = execSync("free -m").toString();
    const memMatch = memInfo.match(/Mem:\s+(\d+)\s+(\d+)\s+/);
    const memTotal = memMatch ? parseInt(memMatch[1]) : 0;
    const memUsed = memMatch ? parseInt(memMatch[2]) : 0;
    const memPercent = memTotal > 0 ? Math.round((memUsed / memTotal) * 100) : 0;
    
    const diskInfo = execSync("df -h / | tail -1").toString().trim().split(/\s+/);
    const diskTotal = diskInfo[1] || "0";
    const diskUsed = diskInfo[2] || "0";
    const diskPercent = parseInt(diskInfo[4]) || 0;
    
    const cpuLoad = execSync("cat /proc/loadavg").toString().trim().split(" ")[0];
    
    res.json({
      memory: { total: memTotal, used: memUsed, percent: memPercent },
      disk: { total: diskTotal, used: diskUsed, percent: diskPercent },
      cpu: parseFloat(cpuLoad),
      timestamp: Date.now()
    });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

router.post("/system/restart/:service", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { service } = req.params;
    const allowed = ["nginx", "api", "all"];
    if (!allowed.includes(service)) { res.status(400).json({ error: "Недопустимый сервис" }); return; }
    
    if (service === "nginx") {
      exec("systemctl restart nginx");
      res.json({ message: "Nginx перезапущен" });
    } else if (service === "api") {
      exec("systemctl restart grizli-api");
      res.json({ message: "API перезапущен" });
    } else if (service === "all") {
      exec("nohup /var/www/Griz/scripts/restart-all.sh > /tmp/restart.log 2>&1 &");
      res.json({ message: "Полный перезапуск инициирован" });
    }
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

router.get("/system/logs", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const { execSync } = require("child_process");
    const logs = execSync("tail -100 /tmp/api-server.log").toString();
    res.json({ logs });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});
