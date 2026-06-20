const fs = require('fs');
const path = '/var/www/Griz/artifacts/api-server/src/routes/site.ts';
let code = fs.readFileSync(path, 'utf8');

// Удаляем старые маршруты системы
const oldRoutes = /\/\/ --- Управление системой ---[\s\S]*?router\.post\("\/system\/restart".*?\}\);\n\}\);/g;
code = code.replace(oldRoutes, '');

// Добавляем новые улучшенные маршруты
const newRoutes = `
// --- Управление системой v2 ---
router.get("/system/status", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const { execSync } = require("child_process");
    
    // Проверяем сервисы
    const checkService = (name: string) => {
      try {
        const result = execSync(\`systemctl is-active \${name}\`).toString().trim();
        return result === "active";
      } catch { return false; }
    };
    
    // Проверяем сайт
    const checkWebsite = () => {
      try {
        const result = execSync('curl -s -o /dev/null -w "%{http_code}" https://grizzly-lounge.qmbox.ru').toString().trim();
        return { status: result, ok: result === "200" };
      } catch { return { status: "error", ok: false }; }
    };
    
    // Проверяем API
    const checkAPI = () => {
      try {
        const result = execSync('curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/menu').toString().trim();
        return { status: result, ok: result === "200" || result === "304" };
      } catch { return { status: "error", ok: false }; }
    };
    
    res.json({
      nginx: checkService("nginx"),
      api: checkAPI().ok,
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
    const memMatch = memInfo.match(/Mem:\\s+(\\d+)\\s+(\\d+)\\s+/);
    const memTotal = memMatch ? parseInt(memMatch[1]) : 0;
    const memUsed = memMatch ? parseInt(memMatch[2]) : 0;
    const memPercent = memTotal > 0 ? Math.round((memUsed / memTotal) * 100) : 0;
    
    // Диск
    const diskInfo = execSync("df -h / | tail -1").toString().trim().split(/\\s+/);
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
`;

code += newRoutes;
fs.writeFileSync(path, code);
console.log('✅ API v2 обновлён');
