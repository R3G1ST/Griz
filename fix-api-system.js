const fs = require('fs');
const path = '/var/www/Griz/artifacts/api-server/src/routes/site.ts';
let code = fs.readFileSync(path, 'utf8');

// 1. Добавляем импорт child_process в начало файла
if (!code.includes('from "child_process"')) {
  code = `import { exec } from "child_process";\n` + code;
}

// 2. Добавляем новые маршруты в конец файла
const routes = `
// --- Управление системой ---
router.get("/system/stats", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const { execSync } = require("child_process");
    const mem = execSync("free -m | grep Mem").toString().trim();
    const disk = execSync("df -h / | tail -1").toString().trim();
    const up = execSync("uptime").toString().trim();
    res.json({ memory: mem, disk: disk, uptime: up });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

router.post("/system/restart", requireAdmin, async (_req: Request, res: Response) => {
  try {
    exec("nohup /var/www/Griz/scripts/restart-all.sh > /tmp/restart.log 2>&1 &");
    res.json({ message: "Команда на полный перезапуск отправлена!" });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});
`;

code += routes;
fs.writeFileSync(path, code);
console.log('✅ API маршруты для системы добавлены');
