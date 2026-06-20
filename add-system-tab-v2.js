const fs = require('fs');
const path = '/var/www/Griz/artifacts/grizli-admin/src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

// Удаляем старый SystemTab
const oldTabRegex = /\/\/ --- Вкладка Система ---[\s\S]*?^}\n/m;
code = code.replace(oldTabRegex, '');

// Добавляем новый улучшенный SystemTab
const newTab = `
// --- Вкладка Система v2 ---
function SystemTab() {
  const [status, setStatus] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [logs, setLogs] = useState("");
  const [showLogs, setShowLogs] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      const [statusRes, statsRes] = await Promise.all([
        adminFetch(\`\${API_BASE}/system/status\`).then(r => r.json()),
        adminFetch(\`\${API_BASE}/system/stats\`).then(r => r.json())
      ]);
      setStatus(statusRes);
      setStats(statsRes);
    } catch (e) {
      console.error('Ошибка загрузки:', e);
    }
  };

  const loadLogs = async () => {
    try {
      const res = await adminFetch(\`\${API_BASE}/system/logs\`);
      const data = await res.json();
      setLogs(data.logs || '');
      setShowLogs(true);
    } catch (e) {
      console.error('Ошибка загрузки логов:', e);
    }
  };

  const restartService = async (service: string) => {
    if (!confirm(\`Перезапустить \${service === 'all' ? 'все сервисы' : service}?\`)) return;
    setLoading(true);
    try {
      const res = await adminFetch(\`\${API_BASE}/system/restart/\${service}\`, { method: "POST" });
      const data = await res.json();
      alert(data.message || 'Перезапуск инициирован');
      setTimeout(loadData, 3000);
    } catch (e) {
      alert('Ошибка при перезапуске');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const StatusIndicator = ({ ok, label }: { ok: boolean; label: string }) => (
    <div className="bg-neutral-900 border border-white/10 p-4 rounded flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={\`w-3 h-3 rounded-full \${ok ? 'bg-green-500' : 'bg-red-500'}\`}></div>
        <span className="text-white text-sm font-medium">{label}</span>
      </div>
      <span className={\`text-xs font-mono \${ok ? 'text-green-500' : 'text-red-500'}\`}>
        {ok ? 'РАБОТАЕТ' : 'ОШИБКА'}
      </span>
    </div>
  );

  const ProgressBar = ({ label, used, total, percent, unit }: any) => (
    <div className="bg-neutral-900 border border-white/10 p-4 rounded">
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-400 text-xs uppercase">{label}</span>
        <span className="text-lime text-sm font-mono">{percent}%</span>
      </div>
      <div className="w-full bg-neutral-800 rounded-full h-2 mb-2">
        <div 
          className={\`h-2 rounded-full \${percent > 80 ? 'bg-red-500' : percent > 60 ? 'bg-yellow-500' : 'bg-lime'}\`}
          style={{ width: \`\${percent}%\` }}
        ></div>
      </div>
      <div className="text-gray-500 text-xs">
        {used} / {total} {unit}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Система — Управление сервером</h2>
      
      {/* Статусы сервисов */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatusIndicator ok={status?.nginx} label="Nginx" />
        <StatusIndicator ok={status?.api} label="API" />
        <StatusIndicator ok={status?.postgres} label="PostgreSQL" />
        <StatusIndicator ok={status?.website?.ok} label="Сайт" />
      </div>

      {/* Ресурсы сервера */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats && (
          <>
            <ProgressBar 
              label="RAM" 
              used={stats.memory.used} 
              total={stats.memory.total} 
              percent={stats.memory.percent} 
              unit="MB" 
            />
            <ProgressBar 
              label="Диск" 
              used={stats.disk.used} 
              total={stats.disk.total} 
              percent={stats.disk.percent} 
              unit="GB" 
            />
            <div className="bg-neutral-900 border border-white/10 p-4 rounded">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400 text-xs uppercase">CPU</span>
                <span className="text-lime text-sm font-mono">{(stats.cpu * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-neutral-800 rounded-full h-2">
                <div 
                  className={\`h-2 rounded-full \${stats.cpu > 2 ? 'bg-red-500' : stats.cpu > 1 ? 'bg-yellow-500' : 'bg-lime'}\`}
                  style={{ width: \`\${Math.min(stats.cpu * 100, 100)}%\` }}
                ></div>
              </div>
              <div className="text-gray-500 text-xs mt-2">
                Нагрузка: {stats.cpu}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Быстрые действия */}
      <div className="bg-neutral-900 border border-white/10 p-6 rounded">
        <div className="text-white font-bold uppercase tracking-widest text-sm mb-4">Быстрые действия</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button 
            onClick={() => restartService('nginx')}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold uppercase tracking-widest py-3 px-4 rounded text-xs transition-colors"
          >
            Nginx
          </button>
          <button 
            onClick={() => restartService('api')}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold uppercase tracking-widest py-3 px-4 rounded text-xs transition-colors"
          >
            API
          </button>
          <button 
            onClick={loadLogs}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold uppercase tracking-widest py-3 px-4 rounded text-xs transition-colors"
          >
            Логи
          </button>
          <button 
            onClick={() => restartService('all')}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold uppercase tracking-widest py-3 px-4 rounded text-xs transition-colors"
          >
            ВСЁ
          </button>
        </div>
      </div>

      {/* Модальное окно логов */}
      {showLogs && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowLogs(false)}>
          <div className="bg-neutral-950 border border-white/10 p-6 max-w-4xl w-full max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-bold uppercase tracking-widest text-sm">Логи API сервера</h3>
              <button onClick={() => setShowLogs(false)} className="text-gray-500 hover:text-white text-2xl">×</button>
            </div>
            <pre className="bg-black border border-white/10 p-4 rounded text-lime text-xs font-mono overflow-auto max-h-[60vh]">
              {logs}
            </pre>
          </div>
        </div>
      )}

      {/* Кнопка обновления */}
      <button 
        onClick={loadData}
        className="text-gray-500 hover:text-lime text-xs uppercase tracking-widest border border-white/10 px-3 py-1 transition-colors"
      >
        Обновить статистику
      </button>
    </div>
  );
}
`;

code = code.trimEnd() + '\n\n' + newTab + '\n';
fs.writeFileSync(path, code);
console.log('✅ SystemTab v2 добавлен');
