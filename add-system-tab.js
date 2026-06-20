const fs = require('fs');
const path = '/var/www/Griz/artifacts/grizli-admin/src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

const systemTabCode = `
// --- Вкладка Система ---
function SystemTab() {
  const [stats, setStats] = useState<any>(null);
  const [status, setStatus] = useState("");

  const loadStats = () => {
    adminFetch(\`\${API_BASE}/system/stats\`)
      .then(r => r.json())
      .then(data => setStats(data))
      .catch(() => setStatus("Ошибка загрузки"));
  };

  const handleRestart = () => {
    if (!confirm("Вы уверены, что хотите полностью перезапустить систему?")) return;
    setStatus("Отправка команды... Подождите 10 секунд и обновите страницу.");
    adminFetch(\`\${API_BASE}/system/restart\`, { method: "POST" })
      .then(r => r.json())
      .then(data => setStatus(data.message || "Перезапуск инициирован."))
      .catch(() => setStatus("Ошибка при перезапуске"));
  };

  useEffect(() => { loadStats(); }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Система — Управление сервером</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-neutral-900 border border-white/10 p-4 rounded">
          <div className="text-gray-500 text-xs uppercase mb-2">Память (RAM)</div>
          <div className="text-lime font-mono text-sm">{stats?.memory || "..."}</div>
        </div>
        <div className="bg-neutral-900 border border-white/10 p-4 rounded">
          <div className="text-gray-500 text-xs uppercase mb-2">Диск</div>
          <div className="text-lime font-mono text-sm">{stats?.disk || "..."}</div>
        </div>
        <div className="bg-neutral-900 border border-white/10 p-4 rounded">
          <div className="text-gray-500 text-xs uppercase mb-2">Аптайм</div>
          <div className="text-lime font-mono text-sm">{stats?.uptime || "..."}</div>
        </div>
      </div>
      <div className="bg-neutral-900 border border-red-500/30 p-6 rounded flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-white font-bold uppercase tracking-widest text-sm">Полный перезапуск системы</div>
          <div className="text-gray-500 text-xs mt-1">Перезапускает Nginx, API и бота.</div>
        </div>
        <button onClick={handleRestart} className="bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest py-2 px-6 rounded text-xs">
          Перезапустить всё
        </button>
      </div>
      {status && <div className="bg-neutral-900 border border-lime/30 p-4 rounded text-lime text-sm font-mono">{status}</div>}
      <button onClick={loadStats} className="text-gray-500 hover:text-lime text-xs uppercase tracking-widest border border-white/10 px-3 py-1">Обновить статистику</button>
    </div>
  );
}
`;

code = code.trimEnd() + '\n\n' + systemTabCode + '\n';
fs.writeFileSync(path, code);
console.log('✅ Компонент SystemTab добавлен');
