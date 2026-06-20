const fs = require('fs');
const path = '/var/www/Griz/artifacts/api-server/src/routes/site.ts';
let code = fs.readFileSync(path, 'utf8');

// Удаляем все старые маршруты системы (v1 и v2)
const patterns = [
  /\/\/ --- Управление системой ---[\s\S]*?router\.post\("\/system\/restart".*?\}\);\n\}\);\n/g,
  /\/\/ --- Управление системой v2 ---[\s\S]*?router\.get\("\/system\/logs".*?\}\);\n\}\);\n/g
];

patterns.forEach(pattern => {
  code = code.replace(pattern, '');
});

// Проверяем, что остался только v3
if (!code.includes('Управление системой v3')) {
  console.log('❌ v3 не найден, добавляем заново');
  
  const v3Routes = `
// --- Управление системой v3 ---
router.get("/system/status", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const { execSync } = require("child_process");
    
    const checkService = (name: string) => {
      try {
        const result = execSync(\`systemctl is-active \${name} 2>/dev/null\`).toString().trim();
        return result === "active";
      } catch { return false; }
    };
    
    const checkWebsite = () => {
      try {
        const result = execSync('curl -s -o /dev/null -w "%{http_code}" --max-time 3 https://grizzly-lounge.qmbox.ru').toString().trim();
        return { status: result, ok: result === "200" };
      } catch { return { status: "error", ok: false }; }
    };
    
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
  
  code += v3Routes;
}

fs.writeFileSync(path, code);
console.log('✅ Все старые маршруты удалены, остался только v3');
