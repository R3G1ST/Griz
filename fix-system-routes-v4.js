const fs = require('fs');
const path = '/var/www/Griz/artifacts/api-server/src/routes/site.ts';
let code = fs.readFileSync(path, 'utf8');

// Удаляем старые маршруты системы
code = code.replace(/\/\/ --- Управление системой v3 ---[\s\S]*?router\.get\("\/system\/logs".*?\}\);\n\}\);/g, '');

const newRoutes = `
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
    const memMatch = memInfo.match(/Mem:\\s+(\\d+)\\s+(\\d+)\\s+/);
    const memTotal = memMatch ? parseInt(memMatch[1]) : 0;
    const memUsed = memMatch ? parseInt(memMatch[2]) : 0;
    const memPercent = memTotal > 0 ? Math.round((memUsed / memTotal) * 100) : 0;
    
    const diskInfo = execSync("df -h / | tail -1").toString().trim().split(/\\s+/);
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
`;

code += newRoutes;
fs.writeFileSync(path, code);
console.log('✅ API v4 — быстрый и стабильный');
