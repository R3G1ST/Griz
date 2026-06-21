
// --- Красивые toast-уведомления ---
function showNiceAlert(msg: string, isError = false) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed top-20 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 w-[calc(100%-32px)] max-w-sm';
    document.body.appendChild(container);
  }
  
  // Удаляем предыдущие уведомления того же типа
  const existing = container.querySelectorAll('[data-type="' + (isError ? 'error' : 'success') + '"]');
  existing.forEach(e => e.remove());
  
  const toast = document.createElement('div');
  toast.setAttribute('data-type', isError ? 'error' : 'success');
  toast.className = `bg-neutral-900 border ${isError ? 'border-red-500' : 'border-lime'} rounded-lg px-3 py-2 shadow-xl transition-all duration-300 opacity-0 -translate-y-2`;
  toast.innerHTML = `
    <div class="flex items-start gap-3">
      <div class="${isError ? 'text-red-500' : 'text-lime'} text-base flex-shrink-0">${isError ? '✕' : '✓'}</div>
      <div class="flex-1 min-w-0">
        <div class="${isError ? 'text-red-400' : 'text-lime'} text-[10px] font-bold uppercase tracking-wider mb-0.5">${isError ? 'Ошибка' : 'Успешно'}</div>
        <div class="text-white text-xs break-words">${msg}</div>
      </div>
    </div>
  `;
  
  container.appendChild(toast);
  requestAnimationFrame(() => { toast.style.opacity = '1'; toast.style.transform = 'translateY(0)'; });
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateY(-10px)'; }, 3000);
  setTimeout(() => toast.remove(), 3500);
}



import { useState, useEffect, useCallback } from "react";
import { Router as WouterRouter, Switch, Route } from "wouter";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { QRCodeSVG } from "qrcode.react";

const API_BASE = "/api";
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? "grizli2024";

// Authenticated fetch wrapper — adds admin password header to every request
const adminFetch = (url: string, init: RequestInit = {}) => {
  const headers = new Headers(init.headers || {});
  headers.set("x-admin-password", ADMIN_PASSWORD);
  return fetch(url, { ...init, headers });
};

type Booking = {
  id: number; name: string; phone: string; date: string; time: string;
  guests: number; comment: string | null; status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
};

type Stats = {
  totals: { total: number; pending: number; confirmed: number; cancelled: number; total_guests: number };
  byDay: { day: string; total: number; confirmed: number }[];
  byHour: { hour: string; count: number }[];
  byGuests: { guests: number; count: number }[];
};

const STATUS = {
  pending:   { label: "Ожидает",       color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30" },
  confirmed: { label: "Подтверждено",  color: "text-green-400 bg-green-400/10 border-green-400/30" },
  cancelled: { label: "Отменено",      color: "text-red-400 bg-red-400/10 border-red-400/30" },
};

const LIME = "#c8ff00";
const PIE_COLORS = [LIME, "#22c55e", "#ef4444", "#f59e0b"];

// ── Login ─────────────────────────────────────────────────────────────────────
function Login({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState(""); const [err, setErr] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem("grizli_admin_pw", pw);
      onLogin();
    } else { setErr(true); setPw(""); }
  };
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black tracking-widest text-lime uppercase">ГРИЗЛИ</h1>
          <p className="text-gray-500 text-sm mt-2 tracking-widest uppercase">Панель администратора</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <input type="password" value={pw} onChange={e => { setPw(e.target.value); setErr(false); }}
            placeholder="Пароль" autoFocus
            className="w-full bg-neutral-900 border border-white/10 px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-lime transition-colors" />
          {err && <p className="text-red-400 text-sm">Неверный пароль</p>}
          <button type="submit"
            className="w-full bg-lime text-black font-bold uppercase tracking-widest py-3 hover:bg-lime/80 transition-colors">
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Bookings tab ──────────────────────────────────────────────────────────────
function BookingsTab() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const load = useCallback(async () => {
    try { const r = await fetch(`${API_BASE}/bookings`); setBookings((await r.json()).reverse()); } catch {}
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const update = async (id: number, status: string) => {
    await adminFetch(`${API_BASE}/bookings/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: status as Booking["status"] } : b));
  };

  const counts = { all: bookings.length, pending: bookings.filter(b => b.status === "pending").length, confirmed: bookings.filter(b => b.status === "confirmed").length, cancelled: bookings.filter(b => b.status === "cancelled").length };
  const visible = filter === "all" ? bookings : bookings.filter(b => b.status === filter);

  return (
    <>
      <div className="flex justify-end mb-6">
        <button onClick={load} className="text-xs text-gray-500 hover:text-lime transition-colors uppercase tracking-widest border border-white/10 px-3 py-1.5">Обновить</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {(["all", "pending", "confirmed", "cancelled"] as const).map(k => (
          <button key={k} onClick={() => setFilter(k)}
            className={`p-4 border text-left transition-colors ${filter === k ? "border-lime/50 bg-lime/5" : "border-white/5 hover:border-white/15"}`}>
            <div className="text-2xl font-black text-white">{counts[k]}</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">{k === "all" ? "Всего" : STATUS[k].label}</div>
          </button>
        ))}
      </div>
      {loading ? <div className="text-gray-500 text-center py-20">Загрузка...</div>
        : visible.length === 0 ? <div className="text-gray-600 text-center py-20 border border-white/5">Нет заявок</div>
        : <div className="space-y-3">
          {visible.map(b => (
            <div key={b.id} className="border border-white/5 p-5 hover:border-white/10 transition-colors">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="text-white font-semibold">{b.name}</span>
                    <span className={`text-xs px-2 py-0.5 border ${STATUS[b.status].color}`}>{STATUS[b.status].label}</span>
                  </div>
                  <div className="text-sm text-gray-400 space-y-1">
                    <div className="flex flex-wrap gap-x-6 gap-y-1">
                      <span>📞 {b.phone}</span><span>📅 {b.date} в {b.time}</span>
                      <span>👥 {b.guests} {b.guests === 1 ? "гость" : b.guests < 5 ? "гостя" : "гостей"}</span>
                    </div>
                    {b.comment && <div className="text-gray-500 mt-1">💬 {b.comment}</div>}
                  </div>
                  <div className="text-xs text-gray-600 mt-2">{new Date(b.createdAt).toLocaleString("ru-RU")}</div>
                </div>
                <div className="flex gap-2 flex-shrink-0 flex-wrap">
                  {b.status !== "confirmed" && <button onClick={() => update(b.id, "confirmed")} className="text-xs px-3 py-1.5 border border-green-500/40 text-green-400 hover:bg-green-500/10 transition-colors uppercase tracking-wide">Подтвердить</button>}
                  {b.status !== "pending" && <button onClick={() => update(b.id, "pending")} className="text-xs px-3 py-1.5 border border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10 transition-colors uppercase tracking-wide">В ожидание</button>}
                  {b.status !== "cancelled" && <button onClick={() => update(b.id, "cancelled")} className="text-xs px-3 py-1.5 border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-colors uppercase tracking-wide">Отменить</button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      }
    </>
  );
}

// ── Stats tab ─────────────────────────────────────────────────────────────────
function StatsTab() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/stats`).then(r => r.json()).then(setStats).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-500 text-center py-20">Загрузка...</div>;
  if (!stats) return <div className="text-gray-600 text-center py-20">Нет данных</div>;

  const { totals } = stats;
  const pieData = [
    { name: "Ожидает", value: totals.pending },
    { name: "Подтверждено", value: totals.confirmed },
    { name: "Отменено", value: totals.cancelled },
  ].filter(d => d.value > 0);

  const tooltipStyle = { backgroundColor: "#111", border: "1px solid #222", color: "#fff", fontSize: 12 };

  return (
    <div className="space-y-8">
      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Всего заявок",       value: totals.total },
          { label: "Ожидает",            value: totals.pending },
          { label: "Подтверждено",       value: totals.confirmed },
          { label: "Отменено",           value: totals.cancelled },
          { label: "Гостей (подтв.)",    value: totals.total_guests },
        ].map(kpi => (
          <div key={kpi.label} className="border border-white/5 p-4">
            <div className="text-2xl font-black text-lime">{kpi.value}</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* By Day chart */}
      {stats.byDay.length > 0 && (
        <div className="border border-white/5 p-6">
          <h3 className="text-sm text-gray-400 uppercase tracking-widest mb-6">Брони по дням (30 дней)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.byDay} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="day" tick={{ fill: "#555", fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "#555", fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="total" name="Всего" fill="#333" radius={[2,2,0,0]} />
              <Bar dataKey="confirmed" name="Подтверждено" fill={LIME} radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* By Hour */}
        {stats.byHour.length > 0 && (
          <div className="border border-white/5 p-6">
            <h3 className="text-sm text-gray-400 uppercase tracking-widest mb-6">Популярное время</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.byHour.slice(0, 10)} layout="vertical" margin={{ left: 10, right: 10 }}>
                <XAxis type="number" tick={{ fill: "#555", fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="hour" tick={{ fill: "#999", fontSize: 11 }} tickLine={false} axisLine={false} width={40} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="count" name="Броней" fill={LIME} radius={[0,2,2,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Status pie */}
        {pieData.length > 0 && (
          <div className="border border-white/5 p-6">
            <h3 className="text-sm text-gray-400 uppercase tracking-widest mb-6">Статусы заявок</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: "#999" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Heatmap tab — occupancy by day-of-week × hour ─────────────────────────────
type HeatmapCell = { dow: number; hour: number; bookings: number; guests: number };
type HeatmapResp = { days: number; cells: HeatmapCell[] };

const DOW_LABELS = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];
const HEATMAP_HOURS = [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]; // 16:00 — 02:00
const formatHour = (h: number) => `${String(h % 24).padStart(2, "0")}:00`;

function HeatmapTab() {
  const [days, setDays] = useState(28);
  const [data, setData] = useState<HeatmapResp | null>(null);
  const [loading, setLoading] = useState(true);
  const [metric, setMetric] = useState<"bookings" | "guests">("bookings");

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    fetch(`${API_BASE}/stats/heatmap?days=${days}`)
      .then(r => r.json())
      .then(d => { if (!ignore) setData(d); })
      .catch(() => {})
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [days]);

  if (loading) return <div className="text-gray-500 text-center py-20">Загрузка...</div>;
  if (!data) return <div className="text-gray-600 text-center py-20">Нет данных</div>;

  // Build lookup: dow × hour → cell
  const map = new Map<string, HeatmapCell>();
  for (const c of data.cells) map.set(`${c.dow}_${c.hour}`, c);

  const maxVal = data.cells.reduce((m, c) => Math.max(m, c[metric]), 0);

  // Peak summary
  const peakCell = data.cells.reduce<HeatmapCell | null>((best, c) =>
    !best || c[metric] > best[metric] ? c : best, null);
  const totalBookings = data.cells.reduce((s, c) => s + c.bookings, 0);
  const totalGuests   = data.cells.reduce((s, c) => s + c.guests, 0);

  const cellBg = (value: number) => {
    if (maxVal === 0 || value === 0) return "rgba(255,255,255,0.02)";
    const ratio = value / maxVal;
    // Lime gradient: low → faint, high → solid #c8ff00
    const alpha = Math.max(0.08, ratio);
    return `rgba(200, 255, 0, ${alpha.toFixed(2)})`;
  };
  const cellTextColor = (value: number) => {
    if (maxVal === 0 || value === 0) return "text-gray-700";
    return value / maxVal > 0.5 ? "text-black font-bold" : "text-white";
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1">
          {[7, 14, 28, 90].map(d => (
            <button key={d} onClick={() => setDays(d)}
              className={`px-3 py-2 text-xs uppercase tracking-widest transition-colors ${days === d ? "bg-lime text-black font-bold" : "border border-white/10 text-gray-400 hover:text-white"}`}>
              {d} дней
            </button>
          ))}
        </div>
        <div className="flex gap-1 ml-auto">
          {(["bookings", "guests"] as const).map(m => (
            <button key={m} onClick={() => setMetric(m)}
              className={`px-3 py-2 text-xs uppercase tracking-widest transition-colors ${metric === m ? "bg-lime text-black font-bold" : "border border-white/10 text-gray-400 hover:text-white"}`}>
              {m === "bookings" ? "Брони" : "Гости"}
            </button>
          ))}
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="border border-white/5 p-4">
          <div className="text-2xl font-black text-lime">{totalBookings}</div>
          <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Всего броней</div>
        </div>
        <div className="border border-white/5 p-4">
          <div className="text-2xl font-black text-lime">{totalGuests}</div>
          <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Всего гостей</div>
        </div>
        <div className="border border-white/5 p-4">
          <div className="text-2xl font-black text-lime">
            {peakCell ? `${DOW_LABELS[peakCell.dow]} ${formatHour(peakCell.hour)}` : "—"}
          </div>
          <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Пиковое окно</div>
        </div>
        <div className="border border-white/5 p-4">
          <div className="text-2xl font-black text-lime">
            {peakCell ? peakCell[metric] : 0}
          </div>
          <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">
            {metric === "bookings" ? "Броней в пике" : "Гостей в пике"}
          </div>
        </div>
      </div>

      {/* Heatmap grid */}
      <div className="border border-white/5 p-4 md:p-6 overflow-x-auto">
        <h3 className="text-sm text-gray-400 uppercase tracking-widest mb-4">
          Загрузка по дням и часам — последние {data.days} дней
        </h3>
        <div className="inline-block min-w-full">
          {/* Header row: hours */}
          <div className="flex gap-1 mb-1">
            <div className="w-12 shrink-0" />
            {HEATMAP_HOURS.map(h => (
              <div key={h} className="flex-1 min-w-[42px] text-center text-[10px] text-gray-500 uppercase tracking-widest">
                {formatHour(h)}
              </div>
            ))}
          </div>
          {/* Body rows: weekdays */}
          {DOW_LABELS.map((label, dow) => (
            <div key={dow} className="flex gap-1 mb-1">
              <div className="w-12 shrink-0 flex items-center text-[11px] text-gray-400 uppercase tracking-widest font-bold">
                {label}
              </div>
              {HEATMAP_HOURS.map(hour => {
                const cell = map.get(`${dow}_${hour}`);
                const value = cell ? cell[metric] : 0;
                const title = cell
                  ? `${label} ${formatHour(hour)} — ${cell.bookings} броней, ${cell.guests} гостей`
                  : `${label} ${formatHour(hour)} — пусто`;
                return (
                  <div
                    key={hour}
                    title={title}
                    className={`flex-1 min-w-[42px] h-12 flex items-center justify-center text-xs transition-colors ${cellTextColor(value)}`}
                    style={{ background: cellBg(value) }}
                  >
                    {value > 0 ? value : ""}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        {/* Legend */}
        <div className="flex items-center gap-2 mt-6 text-[10px] text-gray-500 uppercase tracking-widest">
          <span>Меньше</span>
          <div className="flex gap-0.5">
            {[0.08, 0.25, 0.45, 0.65, 0.85, 1].map(a => (
              <div key={a} className="w-6 h-3" style={{ background: `rgba(200, 255, 0, ${a})` }} />
            ))}
          </div>
          <span>Больше</span>
          {maxVal > 0 && (
            <span className="ml-3 text-gray-600">Максимум в ячейке: {maxVal}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Tables QR tab ─────────────────────────────────────────────────────────────
const SITE_DOMAIN = "https://menu-grizzly-lounge.qmbox.ru";

function TablesTab() {
  const [tableCount, setTableCount] = useState(10);
  const [selected, setSelected] = useState<number | null>(null);

  const menuUrl = (n: number) => `${SITE_DOMAIN}/menu?table=${n}`;

  const downloadQR = (tableNum: number) => {
    const svg = document.getElementById(`qr-table-${tableNum}`)?.querySelector("svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    canvas.width = 300; canvas.height = 340;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 300, 340);

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 25, 20, 250, 250);
      ctx.fillStyle = "#000000";
      ctx.font = "bold 18px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`ГРИЗЛИ — Стол №${tableNum}`, 150, 300);
      ctx.font = "12px sans-serif";
      ctx.fillStyle = "#666666";
      ctx.fillText("Сканируйте для просмотра меню", 150, 325);
      const link = document.createElement("a");
      link.download = `qr-table-${tableNum}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h2 className="text-white text-lg font-bold uppercase tracking-widest">QR-коды для столов</h2>
          <p className="text-gray-500 text-sm mt-1">Гость сканирует — открывается меню с номером стола</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-500 text-sm">Столов:</span>
          <select value={tableCount} onChange={e => setTableCount(Number(e.target.value))}
            className="bg-neutral-900 border border-white/10 text-white px-3 py-1.5 text-sm focus:outline-none focus:border-lime">
            {[5,10,15,20,25,30].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: tableCount }, (_, i) => i + 1).map(n => (
          <div key={n}
            onClick={() => setSelected(selected === n ? null : n)}
            className={`border p-4 flex flex-col items-center gap-3 cursor-pointer transition-colors ${selected === n ? "border-lime/60 bg-lime/5" : "border-white/5 hover:border-white/15"}`}
          >
            <div id={`qr-table-${n}`} className="bg-white p-2 rounded">
              <QRCodeSVG value={menuUrl(n)} size={100} />
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-sm">Стол №{n}</p>
              <p className="text-gray-600 text-xs mt-0.5 break-all">/menu?table={n}</p>
            </div>
            <button
              onClick={e => { e.stopPropagation(); downloadQR(n); }}
              className="w-full text-xs py-1.5 border border-lime/30 text-lime hover:bg-lime/10 transition-colors uppercase tracking-wide"
            >
              Скачать PNG
            </button>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-neutral-950 border border-white/10 p-8 flex flex-col items-center gap-4 max-w-xs w-full" onClick={e => e.stopPropagation()}>
            <p className="text-white font-serif text-2xl">Стол №{selected}</p>
            <div className="bg-white p-4 rounded">
              <QRCodeSVG value={menuUrl(selected)} size={200} />
            </div>
            <p className="text-gray-500 text-xs text-center break-all">{menuUrl(selected)}</p>
            <button onClick={() => downloadQR(selected)}
              className="w-full bg-lime text-black font-bold uppercase tracking-widest py-3 text-sm hover:bg-lime/80 transition-colors">
              Скачать PNG
            </button>
            <button onClick={() => setSelected(null)} className="text-gray-600 text-xs hover:text-white transition-colors">Закрыть</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Settings tab ──────────────────────────────────────────────────────────────
function SettingsTab() {
  const [data, setData] = useState<any>({});
  const [saved, setSaved] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [fontModal, setFontModal] = useState<{section: string; field: string; value: string} | null>(null);
  const [fontSettings, setFontSettings] = useState({desktopSize: 200, mobileSize: 24, font: 'sans-serif'});
  const [showDesktopPreview, setShowDesktopPreview] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/settings`).then(r => r.json()).then(d => { setData(d || {}); setLoading(false); });
  }, []);

  const update = (key: string, value: any) => setData((prev: any) => ({ ...prev, [key]: value }));

  const openFontModal = (section: string, field: string, value: string) => {
    const settings = data.typography?.[`${section}.${field}`] || {};
    setFontSettings({
      desktopSize: settings.desktopSize || 200,
      mobileSize: settings.mobileSize || 24,
      font: settings.font || 'sans-serif'
    });
    setFontModal({section, field, value});
  };

  const applyFontSettings = async () => {
    if (!fontModal) return;
    const key = `${fontModal.section}.${fontModal.field}`;
    const typography = data.typography || {};
    typography[key] = fontSettings;
    update('typography', typography);
    
    // Сохраняем в базу данных
    try {
      const response = await adminFetch(`${API_BASE}/settings/typography`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: typography }),
      });
      if (response.ok) {
        showNiceAlert('Настройки шрифта сохранены');
      } else {
        showNiceAlert('Не удалось сохранить', true);
      }
    } catch (err) {
      showNiceAlert('Ошибка при сохранении', true);
    }
    
    setFontModal(null);
  };

  const fontSettingsBtn = (section: string, field: string, value: string) => (
    <button 
      onClick={() => openFontModal(section, field, value)}
      className="ml-2 text-gray-500 hover:text-lime transition-colors"
      title="Настройки шрифта"
    >
      ⚙️
    </button>
  );


  const save = async (key: string) => {
    try {
      const response = await adminFetch(`${API_BASE}/settings/${key}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: data[key] }),
      });
      if (!response.ok) {
        const error = await response.json();
        showNiceAlert('Не удалось сохранить данные', true);
        return;
      }
      const updated = await fetch(`${API_BASE}/settings`).then(r => r.json());
      setData(updated || {});
      setSaved(key);
      setTimeout(() => setSaved(null), 1500);
    } catch (err) {
      showNiceAlert('Произошла ошибка при сохранении', true);
    }
  };

  if (loading) return <div className="text-gray-500 text-center py-20">Загрузка...</div>;

  const contacts = data.contacts || {};
  const hero = data.hero || {};
  const about = data.about || {};
  const schedule = data.schedule || [];
  const rules = data.rules || [];
  const ticker = data.ticker || [];
  const brand = data.brand || {};
  const loyalty = data.loyalty || {};
  const footer = data.footer || {};
  const images = data.images || {};
  const IMAGE_SLOTS: Array<[string, string, string]> = [
    ["logo",      "Логотип",                            "Шапка сайта, страница /card, цифровая карта /loyalty-card"],
    ["heroBg",    "Фон главного экрана",                "Большое фото за заголовком на главной + первая плитка в галерее"],
    ["bearSkull", "Иллюстрация «О нас»",                "Изображение в блоке «Глубже, чем кальянная» и в галерее"],
    ["cocktail",  "Фото «Тёмные материи» (бар)",         "Вертикальное фото в блоке про коктейли и в галерее"],
    ["interior",  "Большой баннер «Твоя территория»",   "Широкий баннер интерьера на главной и в галерее"],
  ];

  const fieldClass = "w-full bg-neutral-900 border border-white/10 px-3 py-2 text-white text-sm focus:outline-none focus:border-lime";
  const labelClass = "block text-xs text-gray-500 uppercase tracking-widest mb-1";
  const sectionClass = "border border-white/5 p-5 mb-6";
  const saveBtn = (key: string) => (
    <button onClick={() => save(key)} className="px-4 py-2 bg-lime text-black text-xs uppercase tracking-widest font-bold hover:bg-lime/80 transition-colors">
      {saved === key ? "✓ Сохранено" : "Сохранить"}
    </button>
  );

  return (
    <div className="max-w-3xl">
      {/* Brand */}
      <div className={sectionClass}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold uppercase tracking-widest text-sm">Бренд</h3>
          {saveBtn("brand")}
        </div>
        <p className="text-gray-500 text-xs mb-3">Название, город, год основания. Используется в шапке, бейдже на главной и подвале.</p>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            ["name","Название"],["city","Город"],
            ["estYear","Год основания"],["badgeText","Текст бейджа на главной"],
          ].map(([key, label]) => (
            <div key={key}>
              <label className={labelClass}>{label}</label>
              <div className="flex gap-2"><input value={brand[key] || ""} onChange={e => update("brand", { ...brand, [key]: e.target.value })} className={`${fieldClass} flex-1`} />{fontSettingsBtn("brand", key, brand[key] || "")}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Contacts */}
      <div className={sectionClass}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold uppercase tracking-widest text-sm">Контакты</h3>
          {saveBtn("contacts")}
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            ["phone","Телефон"],["address","Адрес"],
            ["telegram","Telegram URL"],["instagram","Instagram URL"],
            ["vk","VK URL"],["mapUrl","2GIS / Карта URL"],
          ].map(([key, label]) => (
            <div key={key}>
              <label className={labelClass}>{label}</label>
              <div className="flex gap-2"><input value={contacts[key] || ""} onChange={e => update("contacts", { ...contacts, [key]: e.target.value })} className={`${fieldClass} flex-1`} />{fontSettingsBtn("contacts", key, contacts[key] || "")}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Hero */}
      <div className={sectionClass}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold uppercase tracking-widest text-sm">Главный экран</h3>
          {saveBtn("hero")}
        </div>
        <div className="grid md:grid-cols-2 gap-3 mb-3">
          <div>
            <label className={labelClass}>Заголовок (большой)</label>
            <div className="flex gap-2">
              <input value={hero.title1 || ""} onChange={e => update("hero", { ...hero, title1: e.target.value })} className={`${fieldClass} flex-1`} />
              {fontSettingsBtn("hero", "title1", hero.title1 || "")}
            </div>
            
          </div>
          <div>
            <label className={labelClass}>Заголовок (курсив)</label>
            <div className="flex gap-2"><input value={hero.title2 || ""} onChange={e => update("hero", { ...hero, title2: e.target.value })} className={`${fieldClass} flex-1`} />{fontSettingsBtn("hero", "title2", hero.title2 || "")}</div>
            
          </div>
        </div>
        <label className={labelClass}>Подзаголовок</label>
        <div className="flex gap-2"><textarea value={hero.subtitle || ""} onChange={e => update("hero", { ...hero, subtitle: e.target.value })} rows={2} className={`${fieldClass} resize-none flex-1`} />{fontSettingsBtn("hero", "subtitle", hero.subtitle || "")}</div>
        
      </div>

      {/* About */}
      <div className={sectionClass}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold uppercase tracking-widest text-sm">О нас</h3>
          {saveBtn("about")}
        </div>
        <label className={labelClass}>Заголовок (используйте точки для разбивки)</label>
        <div className="flex gap-2"><input value={about.title || ""} onChange={e => update("about", { ...about, title: e.target.value })} className={`${fieldClass} mb-3 flex-1`} />{fontSettingsBtn("about", "title", about.title || "")}</div>
        <label className={labelClass}>Параграф 1</label>
        <div className="flex gap-2"><textarea value={about.p1 || ""} onChange={e => update("about", { ...about, p1: e.target.value })} rows={3} className={`${fieldClass} resize-none mb-3 flex-1`} />{fontSettingsBtn("about", "p1", about.p1 || "")}</div>
        <label className={labelClass}>Параграф 2</label>
        <div className="flex gap-2"><textarea value={about.p2 || ""} onChange={e => update("about", { ...about, p2: e.target.value })} rows={3} className={`${fieldClass} resize-none flex-1`} />{fontSettingsBtn("about", "p2", about.p2 || "")}</div>
      </div>

      {/* Schedule */}
      <div className={sectionClass}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold uppercase tracking-widest text-sm">График работы</h3>
          {saveBtn("schedule")}
        </div>
        {(schedule as Array<{ days: string; hours: string }>).map((row, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 mb-2">
            <input value={row.days} onChange={e => {
              const next = [...schedule]; next[i] = { ...row, days: e.target.value }; update("schedule", next);
            }} placeholder="Пн — Чт" className={fieldClass} />
            <input value={row.hours} onChange={e => {
              const next = [...schedule]; next[i] = { ...row, hours: e.target.value }; update("schedule", next);
            }} placeholder="15:00 — 02:00" className={fieldClass} />
            <button onClick={() => update("schedule", schedule.filter((_: any, j: number) => j !== i))}
              className="px-3 text-red-400 border border-red-500/30 hover:bg-red-500/10 text-xs">✕</button>
          </div>
        ))}
        <button onClick={() => update("schedule", [...schedule, { days: "", hours: "" }])}
          className="text-xs text-lime border border-lime/30 px-3 py-2 hover:bg-lime/10 uppercase tracking-widest">+ Строка</button>
      </div>

      {/* Loyalty */}
      <div className={sectionClass}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold uppercase tracking-widest text-sm">Лояльность</h3>
          {saveBtn("loyalty")}
        </div>
        <p className="text-gray-500 text-xs mb-3">Юзернейм Telegram-бота (без @) — используется в QR-коде и кнопках на странице /loyalty.</p>
        <div className="grid md:grid-cols-2 gap-3 mb-3">
          <div>
            <label className={labelClass}>Юзернейм бота</label>
            <input value={loyalty.botUsername || ""} onChange={e => update("loyalty", { ...loyalty, botUsername: e.target.value })} placeholder="GrizzlyLoyalty_bot" className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>Надзаголовок (программа)</label>
            <div className="flex gap-2"><input value={loyalty.tagline || ""} onChange={e => update("loyalty", { ...loyalty, tagline: e.target.value })} className={`${fieldClass} flex-1`} />{fontSettingsBtn("loyalty", "tagline", loyalty.tagline || "")}</div>
          </div>
        </div>
        <label className={labelClass}>Описание программы</label>
        <div className="flex gap-2"><textarea value={loyalty.description || ""} onChange={e => update("loyalty", { ...loyalty, description: e.target.value })} rows={3} className={`${fieldClass} resize-none flex-1`} />{fontSettingsBtn("loyalty", "description", loyalty.description || "")}</div>
      </div>

      {/* Ticker */}
      <div className={sectionClass}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold uppercase tracking-widest text-sm">Бегущая строка</h3>
          {saveBtn("ticker")}
        </div>
        <p className="text-gray-500 text-xs mb-4">Тексты, которые бегут сверху сайта. Можно добавлять, удалять и редактировать.</p>
        {(ticker as string[]).map((text, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input value={text} onChange={e => {
              const next = [...ticker]; next[i] = e.target.value; update("ticker", next);
            }} placeholder="Текст строки" className={`${fieldClass} flex-1`} />
            <button onClick={() => update("ticker", ticker.filter((_: any, j: number) => j !== i))}
              className="px-3 text-red-400 border border-red-500/30 hover:bg-red-500/10 text-xs">✕</button>
          </div>
        ))}
        <button onClick={() => update("ticker", [...ticker, "Новый текст"])}
          className="text-xs text-lime border border-lime/30 px-3 py-2 hover:bg-lime/10 uppercase tracking-widest">+ Добавить строку</button>
      </div>

      {/* Footer */}
      <div className={sectionClass}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold uppercase tracking-widest text-sm">Подвал сайта</h3>
          {saveBtn("footer")}
        </div>
        <label className={labelClass}>Слоган</label>
        <div className="flex gap-2"><input value={footer.tagline || ""} onChange={e => update("footer", { ...footer, tagline: e.target.value })} className={`${fieldClass} mb-3 flex-1`} />{fontSettingsBtn("footer", "tagline", footer.tagline || "")}</div>
        <label className={labelClass}>Копирайт</label>
        <div className="flex gap-2"><input value={footer.copyright || ""} onChange={e => update("footer", { ...footer, copyright: e.target.value })} placeholder="© ГРИЗЛИ Hookah Lounge" className={`${fieldClass} flex-1`} />{fontSettingsBtn("footer", "copyright", footer.copyright || "")}</div>
      </div>

      {/* Images — per-slot photo overrides */}
      <div className={sectionClass}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold uppercase tracking-widest text-sm">Фото на сайте</h3>
          {saveBtn("images")}
        </div>
        <p className="text-gray-500 text-xs mb-4">
          Каждое из пяти ключевых изображений сайта можно заменить, вставив URL картинки.
          Оставьте поле пустым — будет использовано встроенное фото по умолчанию.
          Загрузить файл можно через вкладку «Галерея» (получите URL и вставьте сюда).
        </p>
        <div className="space-y-4">
          {IMAGE_SLOTS.map(([key, label, hint]) => {
            const url = images[key] || "";
            return (
              <div key={key} className="border border-white/5 p-3">
                <div className="flex items-start gap-3">
                  <div className="w-20 h-20 flex-shrink-0 bg-neutral-900 border border-white/10 overflow-hidden flex items-center justify-center">
                    {url ? (
                      <img src={url} alt={label} className="w-full h-full object-cover" onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = "0.2"; }} />
                    ) : (
                      <span className="text-gray-700 text-[10px] uppercase tracking-widest text-center px-1">по&nbsp;умолчанию</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-white text-sm font-medium mb-0.5">{label}</label>
                    <p className="text-gray-600 text-[11px] mb-2 leading-snug">{hint}</p>
                    <div className="flex gap-2">
                      <input value={url}
                        onChange={e => update("images", { ...images, [key]: e.target.value })}
                        placeholder="https://… или /uploads/…"
                        className={`${fieldClass} text-xs`} />
                      {url && (
                        <button onClick={() => update("images", { ...images, [key]: "" })}
                          className="px-3 text-gray-500 hover:text-red-400 border border-white/10 text-[10px] uppercase tracking-widest">Сброс</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rules */}
      <div className={sectionClass}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold uppercase tracking-widest text-sm">Правила</h3>
          {saveBtn("rules")}
        </div>
        {(rules as Array<{ title: string; text: string }>).map((row, i) => (
          <div key={i} className="border border-white/5 p-3 mb-2">
            <div className="flex gap-2 mb-2">
              <div className="flex gap-2 flex-1"><input value={row.title} onChange={e => { const next = [...rules]; next[i] = { ...row, title: e.target.value }; update("rules", next); }} placeholder="Заголовок" className={`${fieldClass} flex-1`} />{fontSettingsBtn("rules", `${i}.title`, row.title)}</div>
              <button onClick={() => update("rules", rules.filter((_: any, j: number) => j !== i))}
                className="px-3 text-red-400 border border-red-500/30 hover:bg-red-500/10 text-xs">✕</button>
            </div>
            <div className="flex gap-2"><textarea value={row.text} onChange={e => { const next = [...rules]; next[i] = { ...row, text: e.target.value }; update("rules", next); }} rows={2} placeholder="Текст правила" className={`${fieldClass} resize-none flex-1`} />{fontSettingsBtn("rules", `${i}.text`, row.text)}</div>
          </div>
        ))}
        <button onClick={() => update("rules", [...rules, { title: "", text: "" }])}
          className="text-xs text-lime border border-lime/30 px-3 py-2 hover:bg-lime/10 uppercase tracking-widest">+ Правило</button>
      </div>

      {/* Модальное окно настроек шрифта */}
      {fontModal && (
        <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4" onClick={() => setFontModal(null)}>
          <div className="bg-neutral-950 border border-white/10 p-6 max-w-md w-full max-h-[85vh] overflow-y-auto rounded-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold uppercase tracking-widest text-sm">Настройки шрифта</h3>
              <button onClick={() => setFontModal(null)} className="text-gray-500 hover:text-white text-xl">✕</button>
            </div>
            
            <div className="mb-4">
              <label className="text-xs text-gray-500 uppercase tracking-widest mb-2 block">Текущий текст</label>
              <div className="bg-neutral-900 border border-white/10 p-3 rounded text-white text-sm break-words">
                {fontModal.value || '(пусто)'}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-gray-500 uppercase tracking-widest">Размер на ПК</label>
                  <span className="text-xs text-lime font-mono">{fontSettings.desktopSize}px</span>
                </div>
                <input 
                  type="range" 
                  min="12" 
                  max="300" 
                  value={fontSettings.desktopSize}
                  onChange={e => setFontSettings({...fontSettings, desktopSize: Number(e.target.value)})}
                  className="w-full h-2 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-lime"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-gray-500 uppercase tracking-widest">Размер на телефоне</label>
                  <span className="text-xs text-lime font-mono">{fontSettings.mobileSize}px</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="80" 
                  value={fontSettings.mobileSize}
                  onChange={e => setFontSettings({...fontSettings, mobileSize: Number(e.target.value)})}
                  className="w-full h-2 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-lime"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase tracking-widest mb-2 block">Шрифт</label>
                <select 
                  value={fontSettings.font}
                  onChange={e => setFontSettings({...fontSettings, font: e.target.value})}
                  className="w-full bg-neutral-900 border border-white/10 px-3 py-2 text-white text-sm focus:outline-none focus:border-lime rounded"
                >
                  <option value="sans-serif">Без засечек (по умолчанию)</option>
                  <option value="serif">С засечками</option>
                  <option value="monospace">Моноширинный</option>
                  <option value="cursive">Курсивный</option>
                  <option value="fantasy">Декоративный</option>
                  <option value="Arial">Arial</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Verdana">Verdana</option>
                  <option value="Impact">Impact</option>
                </select>
              </div>

              <div>
                <button 
                  onClick={() => setShowDesktopPreview(!showDesktopPreview)}
                  className="w-full text-xs text-gray-400 hover:text-lime uppercase tracking-widest py-2 border border-white/10 rounded mb-2 flex items-center justify-center gap-2"
                >
                  💻 {showDesktopPreview ? 'Скрыть превью для ПК' : 'Показать превью для ПК'}
                  <span>{showDesktopPreview ? '▲' : '▼'}</span>
                </button>
                {showDesktopPreview && (
                  <div className="p-3 bg-neutral-900 border border-white/10 rounded">
                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Превью (ПК)</div>
                    <div 
                      style={{ 
                        fontSize: `${fontSettings.desktopSize}px`,
                        fontFamily: fontSettings.font
                      }}
                      className="text-white break-words leading-tight max-h-32 overflow-y-auto"
                    >
                      {fontModal.value || 'Пример текста'}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-neutral-900 border border-white/10 rounded">
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Превью (телефон)</div>
                <div 
                  style={{ 
                    fontSize: `${fontSettings.mobileSize}px`,
                    fontFamily: fontSettings.font
                  }}
                  className="text-white break-words leading-tight"
                >
                  {fontModal.value || 'Пример текста'}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={applyFontSettings}
                className="flex-1 bg-lime text-black font-bold uppercase tracking-widest py-3 text-xs hover:bg-lime/80 rounded"
              >
                Применить
              </button>
              <button 
                onClick={() => setFontModal(null)}
                className="px-6 py-3 border border-white/10 text-gray-400 text-xs uppercase tracking-widest hover:bg-white/5 rounded"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// ── Menu CMS tab ──────────────────────────────────────────────────────────────
type MenuItem = { id: number; section: string; category: string; name: string; description: string; price: string; sortOrder: number; isActive: number; isFeatured: number; strength?: number; sessionDuration?: number; bowl?: string; coal?: string; tobaccoBrand?: string; tobaccoFlavor?: string; hookahModel?: string; priceFeatured?: string; descriptionFeatured?: string };

function MenuCmsTab() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [edit, setEdit] = useState<MenuItem | null>(null);
  const [adding, setAdding] = useState<null | { section?: string; category?: string }>(null);

  // Clone before editing so we never mutate the list-state object in place
  const startEdit = (it: MenuItem) => { setAdding(null); setEdit({ ...it }); };
  // Quick-add a new item with section/category prefilled from the row clicked
  const startAdding = (preset?: { section?: string; category?: string }) => { setEdit(null); setAdding(preset ?? {}); };

  const load = () => fetch(`${API_BASE}/menu`).then(r => r.json()).then(setItems);
  useEffect(() => { load(); }, []);

  const save = async (item: Partial<MenuItem>) => {
    console.log('Saving item:', item);
    
    // Простая валидация обязательных полей
    if (!item.section?.trim() || !item.category?.trim() || !item.name?.trim() || !item.price?.trim() || !item.menuCategory) {
      En('⚠️ Заполните обязательные поля: Секция, Категория, Название, Цена, Главная категория', true);
      return;
    }
    
    try {
      let response;
      if (item.id) {
        response = await adminFetch(`${API_BASE}/menu/${item.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) });
      } else {
        response = await adminFetch(`${API_BASE}/menu`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) });
      }
      if (!response.ok) {
        const error = await response.json();
        showNiceAlert('Не удалось сохранить данные', true);
        return;
      }
      setEdit(null); setAdding(null); load();
      showNiceAlert(item.id ? 'Позиция обновлена' : 'Позиция добавлена');
    } catch (err) {
      showNiceAlert('Произошла ошибка при сохранении', true);
    }
  };

  const del = async (id: number) => {
    if (!confirm("Удалить позицию?")) return;
    await adminFetch(`${API_BASE}/menu/${id}`, { method: "DELETE" });
    showNiceAlert('Позиция удалена');
    load();
  };

  const grouped = items.reduce<Record<string, MenuItem[]>>((acc, it) => {
    const k = `${it.section} / ${it.category}`;
    (acc[k] ||= []).push(it); return acc;
  }, {});

  // Existing sections & categories — for autocomplete and category management
  const allSections = Array.from(new Set(items.map(i => i.section).filter(Boolean))).sort();
  const allCategories = Array.from(new Set(items.map(i => i.category).filter(Boolean))).sort();
  const categoriesBySection = items.reduce<Record<string, Set<string>>>((acc, it) => {
    if (!it.section) return acc;
    (acc[it.section] ||= new Set()).add(it.category);
    return acc;
  }, {});

  // Bulk rename helpers — minimal PATCH-style payload so we never overwrite
  // other fields that may have changed since the list was loaded.
  const bulkPatch = async (affected: MenuItem[], patch: Partial<MenuItem>, label: string) => {
    const results = await Promise.allSettled(
      affected.map(i => adminFetch(`${API_BASE}/menu/${i.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      }).then(r => { if (!r.ok) throw new Error(String(r.status)); return r; }))
    );
    const failed = results.filter(r => r.status === "rejected").length;
    if (failed) showNiceAlert('Часть позиций не обновилась', true);
    load();
  };
  const renameSection = async (oldName: string) => {
    const next = prompt(`Переименовать секцию «${oldName}» во всех позициях:`, oldName)?.trim();
    if (!next || next === oldName) return;
    await bulkPatch(items.filter(i => i.section === oldName), { section: next }, "Переименование секции");
  };
  const renameCategory = async (section: string, oldCat: string) => {
    const next = prompt(`Переименовать категорию «${oldCat}» в секции «${section}»:`, oldCat)?.trim();
    if (!next || next === oldCat) return;
    await bulkPatch(items.filter(i => i.section === section && i.category === oldCat), { category: next }, "Переименование категории");
  };

  const editing = edit || (adding ? {
    id: 0,
    section: adding.section ?? allSections[0] ?? "Кальяны",
    category: adding.category ?? "",
    name: "", description: "", price: "", sortOrder: 0, isActive: 1, isFeatured: 0,
  } as MenuItem : null);
  const fieldClass = "w-full bg-neutral-900 border border-white/10 px-3 py-2 text-white text-sm focus:outline-none focus:border-lime";

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h2 className="text-white font-bold uppercase tracking-widest text-sm">Меню — {items.length} позиц.</h2>
        <button onClick={() => startAdding()} className="px-4 py-2 bg-lime text-black text-xs uppercase tracking-widest font-bold hover:bg-lime/80">+ Новая позиция</button>
      </div>

      {/* Hierarchical view: section → category → items, with bulk rename */}
      {Object.entries(categoriesBySection).sort(([a],[b]) => a.localeCompare(b)).map(([section, cats]) => (
        <div key={section} className="mb-8 border border-white/5 p-4">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="text-lime text-sm uppercase tracking-widest">{section}</h3>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => startAdding({ section })} className="text-[10px] bg-lime/10 text-lime border border-lime/40 hover:bg-lime/20 px-3 py-1 uppercase tracking-widest font-bold">+ В эту секцию</button>
              <button onClick={() => renameSection(section)} className="text-[10px] text-gray-500 hover:text-lime border border-white/10 px-2 py-1 uppercase tracking-widest">Переименовать секцию</button>
            </div>
          </div>
          {Array.from(cats).sort().map(cat => (
            <div key={cat} className="mb-4">
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <h4 className="text-white/70 text-xs uppercase tracking-widest">{cat || "(без категории)"}</h4>
                <div className="flex gap-2">
                  <button onClick={() => startAdding({ section, category: cat })} className="text-[10px] bg-lime/10 text-lime border border-lime/30 hover:bg-lime/20 px-2 py-1 uppercase tracking-widest font-bold">+ Позиция</button>
                  {cat && (
                    <button onClick={() => renameCategory(section, cat)} className="text-[10px] text-gray-600 hover:text-lime px-2">Переименовать</button>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                {items.filter(i => i.section === section && i.category === cat).map(it => (
                  <div key={it.id} className={`border border-white/5 p-3 flex items-center justify-between gap-3 hover:border-white/15 ${!it.isActive ? "opacity-40" : ""}`}>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium">{it.name}</div>
                      <div className="text-gray-500 text-xs truncate">{it.description}</div>
                    </div>
                    <span className="text-lime text-sm whitespace-nowrap">{it.price}</span>
                    <button onClick={() => startEdit(it)} className="text-xs text-gray-400 hover:text-lime border border-white/10 px-2 py-1">Ред.</button>
                    <button onClick={() => del(it.id)} className="text-xs text-red-400 hover:bg-red-500/10 border border-red-500/30 px-2 py-1">✕</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}

      {items.length === 0 && (
        <div className="border border-white/5 p-12 text-center text-gray-600 text-sm">
          Меню пусто. Нажмите «+ Добавить», чтобы создать первую позицию.
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-white/10 p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-4">
            <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-4">{editing.id ? "Редактировать" : "Новая позиция"}</h3>
            
            {/* Секция */}
            <div>
              <label className="text-gray-400 text-xs">Секция <span className="text-red-500">*</span></label>
              <input list="sections-list" value={editing.section} onChange={e => setEdit({ ...editing, section: e.target.value })}
                placeholder="Секция (Кальяны/Напитки/Закуски)" className={fieldClass} />
              <datalist id="sections-list">
                {allSections.map(s => <option key={s} value={s} />)}
              </datalist>
            </div>
            
            {/* Главная категория */}
            <div>
              <label className="text-gray-400 text-xs">📂 Главная категория <span className="text-red-500">*</span></label>
              <select 
                value={editing.menuCategory || ""} 
                onChange={e => setEdit({ ...editing, menuCategory: e.target.value })}
                className={fieldClass}
              >
                <option value="">Выберите категорию</option>
                <option value="hookah"> Кальяны (hookah)</option>
                <option value="bar">🍺 Бар (bar)</option>
                <option value="food">🍔 Еда (food)</option>
                <option value="tea">🍵 Чай (tea)</option>
              </select>
            </div>
            
            {/* Подкатегория */}
            <div>
              <label className="text-gray-400 text-xs">Подкатегория <span className="text-red-500">*</span></label>
              <select 
                value={editing.category} 
                onChange={e => setEdit({ ...editing, category: e.target.value })}
                className={fieldClass}
              >
                <option value="">Выберите подкатегорию</option>
                {editing.menuCategory === 'bar' && (
                  <>
                    <option value="Пиво"> Пиво</option>
                    <option value="Лимонады">🍋 Лимонады</option>
                    <option value="Напитки">🥤 Напитки</option>
                  </>
                )}
                {editing.menuCategory === 'food' && (
                  <>
                    <option value="Десерты">🍰 Десерты</option>
                    <option value="Допы">➕ Допы</option>
                  </>
                )}
                {editing.menuCategory === 'tea' && (
                  <>
                    <option value="Китайский чай">🍃 Китайский чай</option>
                    <option value="Обычный">☕ Обычный чай</option>
                    <option value="Авторский">✨ Авторский чай</option>
                    <option value="Допы к чаю">🍵 Допы к чаю</option>
                  </>
                )}
                {editing.menuCategory === 'hookah' && (
                  <>
                    <option value="Standart">⭐ Standart</option>
                    <option value="Premium">💎 Premium</option>
                    <option value="Авторские">🎨 Авторские</option>
                  </>
                )}
                {!editing.menuCategory && (
                  <>
                    {(editing.section && categoriesBySection[editing.section]
                      ? Array.from(categoriesBySection[editing.section])
                      : allCategories).map(c => <option key={c} value={c}>{c}</option>)}
                  </>
                )}
              </select>
              <input 
                type="text"
                value={editing.category} 
                onChange={e => setEdit({ ...editing, category: e.target.value })}
                placeholder="Или введите свою подкатегорию" 
                className={fieldClass} 
              />
            </div>
            
            <p className="text-gray-600 text-[10px] uppercase tracking-widest">Можно вводить свои значения — категории создаются автоматически</p>
            
            {/* Название */}
            <div>
              <label className="text-gray-400 text-xs">Название <span className="text-red-500">*</span></label>
              <input value={editing.name} onChange={e => setEdit({ ...editing, name: e.target.value })}
                placeholder="Название" className={fieldClass} />
            </div>
            
            {/* Описание */}
            <div>
              <label className="text-gray-400 text-xs">Описание</label>
              <textarea value={editing.description} onChange={e => setEdit({ ...editing, description: e.target.value })}
                placeholder="Описание" rows={2} className={`${fieldClass} resize-none`} />
            </div>
            
            {/* БЖУ и калории */}
            {(editing.menuCategory === 'bar' || editing.menuCategory === 'food') && (
              <div className="p-4 border border-lime/30 rounded bg-lime/5 space-y-3">
                <p className="text-lime text-xs uppercase tracking-widest font-bold">🥗 Пищевая ценность (на 100г)</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-gray-400 text-xs">Калории</label>
                    <input type="number" value={editing.calories || ""} onChange={e => setEdit({ ...editing, calories: Number(e.target.value) })} className={fieldClass} placeholder="ккал" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs">Белки</label>
                    <input type="number" value={editing.protein || ""} onChange={e => setEdit({ ...editing, protein: Number(e.target.value) })} className={fieldClass} placeholder="г" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs">Жиры</label>
                    <input type="number" value={editing.fat || ""} onChange={e => setEdit({ ...editing, fat: Number(e.target.value) })} className={fieldClass} placeholder="г" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs">Углеводы</label>
                    <input type="number" value={editing.carbs || ""} onChange={e => setEdit({ ...editing, carbs: Number(e.target.value) })} className={fieldClass} placeholder="г" />
                  </div>
                </div>
              </div>
            )}
            
            {/* Состав */}
            <div>
              <label className="text-gray-400 text-xs">🧂 Состав (ингредиенты)</label>
              <textarea value={editing.ingredients || ""} onChange={e => setEdit({ ...editing, ingredients: e.target.value })} className={`${fieldClass} resize-none`} rows={2} placeholder="Вода, сахар, лимонный сок..." />
            </div>
            
            {/* Аллергены */}
            <div>
              <label className="text-gray-400 text-xs">⚠️ Аллергены</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {['Орехи', 'Глютен', 'Лактоза', 'Соя', 'Яйца'].map(allergen => (
                  <label key={allergen} className="flex items-center gap-1 text-xs">
                    <input type="checkbox" checked={(editing.allergens || '').includes(allergen)} onChange={e => {
                      const current = editing.allergens ? editing.allergens.split(', ') : [];
                      const next = e.target.checked ? [...current, allergen] : current.filter(a => a !== allergen);
                      setEdit({ ...editing, allergens: next.join(', ') });
                    }} className="w-4 h-4 accent-lime" />
                    <span className="text-white">{allergen}</span>
                  </label>
                ))}
              </div>
              <input type="text" value={editing.allergens || ""} onChange={e => setEdit({ ...editing, allergens: e.target.value })} className={fieldClass} placeholder="Или введите вручную: Орехи, Глютен" />
            </div>
            
            {/* Цена, порядок, активна */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-gray-400 text-xs">Цена <span className="text-red-500">*</span></label>
                <input value={editing.price} onChange={e => setEdit({ ...editing, price: e.target.value })}
                  placeholder="650 ₽" className={fieldClass} />
              </div>
              <div>
                <label className="text-gray-400 text-xs">Порядок</label>
                <input type="number" value={editing.sortOrder} onChange={e => setEdit({ ...editing, sortOrder: Number(e.target.value) })}
                  placeholder="Порядок" className={fieldClass} />
              </div>
              <div>
                <label className="text-gray-400 text-xs">Активна</label>
                <label className="flex items-center gap-2 text-white text-sm mt-2">
                  <input type="checkbox" checked={!!editing.isActive} onChange={e => setEdit({ ...editing, isActive: e.target.checked ? 1 : 0 })} />
                </label>
              </div>
            </div>
            
            {/* Кальян недели */}
            {(/кальян/i.test(editing.section) || /кальян/i.test(editing.category) || /hookah/i.test(editing.section) || /hookah/i.test(editing.category)) && (
              <div onClick={e => e.stopPropagation()} className="p-4 border border-lime/30 rounded bg-lime/5 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={!!editing.isFeatured} 
                    onChange={e => { setEdit({ ...editing, isFeatured: e.target.checked ? 1 : 0 }); }}
                    onClick={e => e.stopPropagation()}
                    className="w-5 h-5 accent-lime"
                  />
                  <span className="text-lime text-sm font-bold uppercase tracking-wider">
                    Сделать "Кальяном недели" (показать на главной)
                  </span>
                </label>
                {editing.isFeatured === 1 && (
                  <div className="space-y-2 pt-2 border-t border-lime/20">
                    <p className="text-lime text-xs uppercase tracking-widest">Дополнительные поля для кальяна недели:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-gray-400 text-xs">Крепость (1-10)</label>
                        <input 
                          type="number" 
                          min="1" 
                          max="10"
                          value={editing.strength || 4} 
                          onChange={e => setEdit({ ...editing, strength: Number(e.target.value) })}
                          className={fieldClass}
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-xs">Время сессии (мин)</label>
                        <input 
                          type="number" 
                          value={editing.sessionDuration || 120} 
                          onChange={e => setEdit({ ...editing, sessionDuration: Number(e.target.value) })}
                          className={fieldClass}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs">Чаша</label>
                      <input 
                        value={editing.bowl || "Phunnel · Glaze"} 
                        onChange={e => setEdit({ ...editing, bowl: e.target.value })}
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs">Уголь</label>
                      <input 
                        value={editing.coal || ""} 
                        onChange={e => setEdit({ ...editing, coal: e.target.value })}
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs">Бренд табака</label>
                      <input 
                        value={editing.tobaccoBrand || ""} 
                        onChange={e => setEdit({ ...editing, tobaccoBrand: e.target.value })}
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs">Вкус табака</label>
                      <input 
                        value={editing.tobaccoFlavor || ""} 
                        onChange={e => setEdit({ ...editing, tobaccoFlavor: e.target.value })}
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs">Модель кальяна</label>
                      <input 
                        value={editing.hookahModel || ""} 
                        onChange={e => setEdit({ ...editing, hookahModel: e.target.value })}
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs">Цена (для кальяна недели)</label>
                      <input 
                        value={editing.priceFeatured || ""} 
                        onChange={e => setEdit({ ...editing, priceFeatured: e.target.value })}
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs">Описание (для кальяна недели)</label>
                      <textarea 
                        value={editing.descriptionFeatured || ""} 
                        onChange={e => setEdit({ ...editing, descriptionFeatured: e.target.value })}
                        className={`${fieldClass} resize-none`}
                        rows={3}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Кнопки */}
            <div className="flex gap-2 pt-4">
              <button onClick={() => save(editing)} className="flex-1 bg-lime text-black font-bold uppercase tracking-widest py-2 text-xs hover:bg-lime/80">
                Сохранить
              </button>
              <button onClick={() => { setEdit(null); setAdding(null); }} className="px-4 py-2 border border-white/10 text-gray-400 text-xs uppercase tracking-widest hover:bg-white/5">
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Gallery tab ───────────────────────────────────────────────────────────────
function GalleryTab() {
  const [items, setItems] = useState<Array<{ id: number; url: string; caption: string; sortOrder: number }>>([]);
  const [form, setForm] = useState({ url: "", caption: "", sortOrder: 0 });

  const load = () => fetch(`${API_BASE}/gallery`).then(r => r.json()).then(setItems);
  useEffect(() => { load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.url) return;
    await adminFetch(`${API_BASE}/gallery`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setForm({ url: "", caption: "", sortOrder: 0 }); load();
  };

  const del = async (id: number) => {
    if (!confirm("Удалить фото?")) return;
    await adminFetch(`${API_BASE}/gallery/${id}`, { method: "DELETE" });
    load();
  };

  const fieldClass = "w-full bg-neutral-900 border border-white/10 px-3 py-2 text-white text-sm focus:outline-none focus:border-lime";

  return (
    <div>
      <h2 className="text-white font-bold uppercase tracking-widest text-sm mb-2">Галерея</h2>
      <p className="text-gray-500 text-xs mb-6">Добавляйте URL фотографий (Instagram, облако, любая публичная ссылка). Если галерея пуста, на сайте показываются дефолтные фото.</p>

      <form onSubmit={add} className="border border-white/5 p-4 mb-8 grid md:grid-cols-[2fr_1fr_80px_auto] gap-2">
        <input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })}
          placeholder="https://..." required className={fieldClass} />
        <input value={form.caption} onChange={e => setForm({ ...form, caption: e.target.value })}
          placeholder="Подпись" className={fieldClass} />
        <input type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: Number(e.target.value) })}
          placeholder="№" className={fieldClass} />
        <button type="submit" className="bg-lime text-black px-4 font-bold uppercase tracking-widest text-xs hover:bg-lime/80">+ Добавить</button>
      </form>

      {items.length === 0 ? (
        <p className="text-gray-600 text-center py-12 border border-white/5">Галерея пуста. Покажутся дефолтные фото сайта.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map(it => (
            <div key={it.id} className="border border-white/5 p-2 group relative">
              <div className="aspect-[4/3] bg-neutral-900 overflow-hidden mb-2">
                <img src={it.url} alt={it.caption} className="w-full h-full object-cover" onError={e => (e.currentTarget.style.opacity = "0.2")} />
              </div>
              <p className="text-white text-xs truncate">{it.caption || "Без подписи"}</p>
              <p className="text-gray-600 text-xs">№ {it.sortOrder}</p>
              <button onClick={() => del(it.id)}
                className="absolute top-3 right-3 bg-red-500/80 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Reviews moderation tab ────────────────────────────────────────────────────
function ReviewsTab() {
  const [reviews, setReviews] = useState<Array<{ id: number; name: string; text: string; rating: number; source: string; isPublished: number; createdAt: string }>>([]);
  const load = () => adminFetch(`${API_BASE}/reviews/all`).then(r => r.json()).then(setReviews);

  const togglePublish = async (id: number, isPublished: number) => {
    await adminFetch(`${API_BASE}/reviews/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: isPublished ? 0 : 1 }),
    });
    load();
  };
  useEffect(() => { load(); }, []);

  const del = async (id: number) => {
    if (!confirm("Удалить отзыв?")) return;
    await adminFetch(`${API_BASE}/reviews/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-white font-bold uppercase tracking-widest text-sm">Отзывы — {reviews.length}</h2>
        <button onClick={load} className="text-xs text-gray-500 hover:text-lime border border-white/10 px-3 py-1.5 uppercase tracking-widest">Обновить</button>
      </div>
      {reviews.length === 0 ? (
        <p className="text-gray-600 text-center py-12 border border-white/5">Пока нет отзывов</p>
      ) : (
        <div className="space-y-3">
          {reviews.map(r => (
            <div key={r.id} className="border border-white/5 p-4">
              <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-white font-medium">{r.name}</span>
                  <span className="text-lime text-sm">{"★".repeat(r.rating)}<span className="text-gray-700">{"★".repeat(5 - r.rating)}</span></span>
                  {r.source === "telegram" && (
                    <span className="text-[10px] uppercase tracking-widest border border-lime/30 text-lime px-2 py-0.5">Telegram</span>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-gray-600 text-xs">{new Date(r.createdAt).toLocaleString("ru-RU")}</span>
                  <button onClick={() => togglePublish(r.id, r.isPublished)}
                    className={`text-xs border px-2 py-1 ${r.isPublished
                      ? "border-green-500/40 text-green-400 hover:bg-green-500/10"
                      : "border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10"}`}>
                    {r.isPublished ? "✓ Опубликован" : "Скрыт"}
                  </button>
                  <button onClick={() => del(r.id)} className="text-xs text-red-400 border border-red-500/30 px-2 py-1 hover:bg-red-500/10">Удалить</button>
                </div>
              </div>
              <p className="text-gray-300 text-sm font-light">«{r.text}»</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Admin panel shell ─────────────────────────────────────────────────────────
function CategoriesTab() {
  return (
    <div>
      <h2 className="text-2xl font-black mb-6">Категории меню</h2>
      <iframe 
        src="https://grizzly-lounge.qmbox.ru/admin/menu-categories" 
        className="w-full h-[800px] border border-white/10 rounded-lg"
        title="Управление категориями"
      />
    </div>
  );
}

function AdminPanel() {
  const [tab, setTab] = useState<"bookings" | "stats" | "heatmap" | "tables" | "settings" | "menu" | "gallery" | "reviews" | "system" | "categories">("bookings");
  const TABS = [
    { key: "bookings", label: "Брони" },
    { key: "stats",    label: "Статистика" },
    { key: "heatmap",  label: "Загрузка" },
    { key: "tables",   label: "QR столов" },
    { key: "settings", label: "Контент" },
    { key: "menu",     label: "Меню" },
    { key: "categories", label: "Категории" },
    { key: "gallery",  label: "Галерея" },
    { key: "reviews",  label: "Отзывы" },
    { key: "system",   label: "Система" },
  ] as const;
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/5 px-6 py-4 flex gap-6 items-center sticky top-0 bg-black/95 backdrop-blur z-10">
        <div>
          <h1 className="text-xl font-black tracking-widest text-lime uppercase">ГРИЗЛИ</h1>
          <p className="text-gray-500 text-xs tracking-widest">Администратор</p>
        </div>
        <div className="flex gap-1 ml-auto flex-wrap">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2 text-xs uppercase tracking-widest transition-colors ${tab === t.key ? "bg-lime text-black font-bold" : "text-gray-500 hover:text-white"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-4 py-8">
      <div style={{ display: tab === "bookings" ? "block" : "none" }}><BookingsTab /></div>
      <div style={{ display: tab === "stats" ? "block" : "none" }}><StatsTab /></div>
      <div style={{ display: tab === "heatmap" ? "block" : "none" }}><HeatmapTab /></div>
      <div style={{ display: tab === "tables" ? "block" : "none" }}><TablesTab /></div>
      <div style={{ display: tab === "settings" ? "block" : "none" }}><SettingsTab /></div>
      <div style={{ display: tab === "menu" ? "block" : "none" }}><MenuCmsTab /></div>
      <div style={{ display: tab === "categories" ? "block" : "none" }}><CategoriesTab /></div>
      <div style={{ display: tab === "gallery" ? "block" : "none" }}><GalleryTab /></div>
      <div style={{ display: tab === "reviews" ? "block" : "none" }}><ReviewsTab /></div>
      <div style={{ display: tab === "system" ? "block" : "none" }}><SystemTab /></div>
    </div>
    </div>
  );
}

export default function App() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("grizli_admin") === "1");
  const login = () => { sessionStorage.setItem("grizli_admin", "1"); setAuthed(true); };
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Switch>
        <Route path="/">{authed ? <AdminPanel /> : <Login onLogin={login} />}</Route>
      </Switch>
    </WouterRouter>
  );
}


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
      ]);
      setStatus(statusRes);
      setStats(statsRes);
    } catch (e) { console.error('Ошибка загрузки:', e); }
  };

  const loadWebsite = async () => {
    try {
      const res = await adminFetch(`${API_BASE}/system/website`);
      const data = await res.json();
      setStatus(prev => ({ ...prev, website: data }));
    } catch (e) { console.error('Ошибка проверки сайта:', e); }
  };

  const loadLogs = async () => {
    try {
      const res = await adminFetch(`${API_BASE}/system/logs`);
      const data = await res.json();
      setLogs(data.logs || '');
      setShowLogs(true);
    } catch (e) {
      console.error('Ошибка загрузки логов:', e);
    }
  };

  const restartService = async (service: string) => {
    if (!confirm(`Перезапустить ${service === 'all' ? 'все сервисы' : service}?`)) return;
    setLoading(true);
    try {
      const res = await adminFetch(`${API_BASE}/system/restart/${service}`, { method: "POST" });
      const data = await res.json();
      showNiceAlert(data.message || 'Перезапуск запущен');
      setTimeout(loadData, 3000);
    } catch (e) {
      showNiceAlert('Не удалось перезапустить сервис', true);;
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const StatusIndicator = ({ ok, label }: { ok: boolean; label: string }) => (
    <div className="bg-neutral-900 border border-white/10 p-4 rounded flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${ok ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className="text-white text-sm font-medium">{label}</span>
      </div>
      <span className={`text-xs font-mono ${ok ? 'text-green-500' : 'text-red-500'}`}>
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
          className={`h-2 rounded-full ${percent > 80 ? 'bg-red-500' : percent > 60 ? 'bg-yellow-500' : 'bg-lime'}`}
          style={{ width: `${percent}%` }}
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
                  className={`h-2 rounded-full ${stats.cpu > 2 ? 'bg-red-500' : stats.cpu > 1 ? 'bg-yellow-500' : 'bg-lime'}`}
                  style={{ width: `${Math.min(stats.cpu * 100, 100)}%` }}
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
        disabled={loading}
        className="bg-lime/10 hover:bg-lime/20 disabled:opacity-50 text-lime border border-lime/30 px-4 py-2 rounded text-xs uppercase tracking-widest transition-all font-bold"
      >
        {loading ? 'Загрузка...' : 'Обновить статистику'}
      </button>
    </div>
  );
}

