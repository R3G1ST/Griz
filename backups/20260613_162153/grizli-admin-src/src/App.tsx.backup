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
  const headers = new Headers(init.headers);
  headers.set("x-admin-password", sessionStorage.getItem("grizli_admin_pw") ?? "");
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
const SITE_DOMAIN = (() => {
  // In admin, API calls go to /api (same origin via proxy), but we need the public site domain for QR
  const host = window.location.host;
  // The admin is at /admin/, grizli is at /
  return `${window.location.protocol}//${host}`;
})();

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

  useEffect(() => {
    fetch(`${API_BASE}/settings`).then(r => r.json()).then(d => { setData(d || {}); setLoading(false); });
  }, []);

  const update = (key: string, value: any) => setData((prev: any) => ({ ...prev, [key]: value }));

  const save = async (key: string) => {
    await adminFetch(`${API_BASE}/settings/${key}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: data[key] }),
    });
    setSaved(key); setTimeout(() => setSaved(null), 1500);
  };

  if (loading) return <div className="text-gray-500 text-center py-20">Загрузка...</div>;

  const contacts = data.contacts || {};
  const hero = data.hero || {};
  const about = data.about || {};
  const schedule = data.schedule || [];
  const rules = data.rules || [];
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
              <input value={brand[key] || ""} onChange={e => update("brand", { ...brand, [key]: e.target.value })} className={fieldClass} />
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
              <input value={contacts[key] || ""} onChange={e => update("contacts", { ...contacts, [key]: e.target.value })}
                className={fieldClass} />
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
            <input value={hero.title1 || ""} onChange={e => update("hero", { ...hero, title1: e.target.value })} className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>Заголовок (курсив)</label>
            <input value={hero.title2 || ""} onChange={e => update("hero", { ...hero, title2: e.target.value })} className={fieldClass} />
          </div>
        </div>
        <label className={labelClass}>Подзаголовок</label>
        <textarea value={hero.subtitle || ""} onChange={e => update("hero", { ...hero, subtitle: e.target.value })} rows={2} className={`${fieldClass} resize-none`} />
      </div>

      {/* About */}
      <div className={sectionClass}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold uppercase tracking-widest text-sm">О нас</h3>
          {saveBtn("about")}
        </div>
        <label className={labelClass}>Заголовок (используйте точки для разбивки)</label>
        <input value={about.title || ""} onChange={e => update("about", { ...about, title: e.target.value })} className={`${fieldClass} mb-3`} />
        <label className={labelClass}>Параграф 1</label>
        <textarea value={about.p1 || ""} onChange={e => update("about", { ...about, p1: e.target.value })} rows={3} className={`${fieldClass} resize-none mb-3`} />
        <label className={labelClass}>Параграф 2</label>
        <textarea value={about.p2 || ""} onChange={e => update("about", { ...about, p2: e.target.value })} rows={3} className={`${fieldClass} resize-none`} />
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
            <input value={loyalty.tagline || ""} onChange={e => update("loyalty", { ...loyalty, tagline: e.target.value })} className={fieldClass} />
          </div>
        </div>
        <label className={labelClass}>Описание программы</label>
        <textarea value={loyalty.description || ""} onChange={e => update("loyalty", { ...loyalty, description: e.target.value })} rows={3} className={`${fieldClass} resize-none`} />
      </div>

      {/* Footer */}
      <div className={sectionClass}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold uppercase tracking-widest text-sm">Подвал сайта</h3>
          {saveBtn("footer")}
        </div>
        <label className={labelClass}>Слоган</label>
        <input value={footer.tagline || ""} onChange={e => update("footer", { ...footer, tagline: e.target.value })} className={`${fieldClass} mb-3`} />
        <label className={labelClass}>Копирайт</label>
        <input value={footer.copyright || ""} onChange={e => update("footer", { ...footer, copyright: e.target.value })} placeholder="© ГРИЗЛИ Hookah Lounge" className={fieldClass} />
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
              <input value={row.title} onChange={e => {
                const next = [...rules]; next[i] = { ...row, title: e.target.value }; update("rules", next);
              }} placeholder="Заголовок" className={fieldClass} />
              <button onClick={() => update("rules", rules.filter((_: any, j: number) => j !== i))}
                className="px-3 text-red-400 border border-red-500/30 hover:bg-red-500/10 text-xs">✕</button>
            </div>
            <textarea value={row.text} onChange={e => {
              const next = [...rules]; next[i] = { ...row, text: e.target.value }; update("rules", next);
            }} rows={2} placeholder="Текст правила" className={`${fieldClass} resize-none`} />
          </div>
        ))}
        <button onClick={() => update("rules", [...rules, { title: "", text: "" }])}
          className="text-xs text-lime border border-lime/30 px-3 py-2 hover:bg-lime/10 uppercase tracking-widest">+ Правило</button>
      </div>
    </div>
  );
}

// ── Menu CMS tab ──────────────────────────────────────────────────────────────
type MenuItem = { id: number; section: string; category: string; name: string; description: string; price: string; sortOrder: number; isActive: number };

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
    if (item.id) {
      await adminFetch(`${API_BASE}/menu/${item.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) });
    } else {
      await adminFetch(`${API_BASE}/menu`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) });
    }
    setEdit(null); setAdding(null); load();
  };

  const del = async (id: number) => {
    if (!confirm("Удалить позицию?")) return;
    await adminFetch(`${API_BASE}/menu/${id}`, { method: "DELETE" });
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
    if (failed) alert(`${label}: ${affected.length - failed} из ${affected.length} обновлены, ${failed} с ошибкой.`);
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
    name: "", description: "", price: "", sortOrder: 0, isActive: 1,
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
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => { setEdit(null); setAdding(null); }}>
          <div className="bg-neutral-950 border border-white/10 p-6 max-w-lg w-full space-y-3" onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-4">{editing.id ? "Редактировать" : "Новая позиция"}</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input list="sections-list" value={editing.section} onChange={e => setEdit({ ...editing, section: e.target.value })}
                  placeholder="Секция (Кальяны/Напитки/Закуски)" className={fieldClass} />
                <datalist id="sections-list">
                  {allSections.map(s => <option key={s} value={s} />)}
                </datalist>
              </div>
              <div>
                <input list="categories-list" value={editing.category} onChange={e => setEdit({ ...editing, category: e.target.value })}
                  placeholder="Категория (Классика / Премиум)" className={fieldClass} />
                <datalist id="categories-list">
                  {(editing.section && categoriesBySection[editing.section]
                    ? Array.from(categoriesBySection[editing.section])
                    : allCategories).map(c => <option key={c} value={c} />)}
                </datalist>
              </div>
            </div>
            <p className="text-gray-600 text-[10px] uppercase tracking-widest">Можно вводить свои значения — категории создаются автоматически</p>
            <input value={editing.name} onChange={e => setEdit({ ...editing, name: e.target.value })}
              placeholder="Название" className={fieldClass} />
            <textarea value={editing.description} onChange={e => setEdit({ ...editing, description: e.target.value })}
              placeholder="Описание" rows={2} className={`${fieldClass} resize-none`} />
            <div className="grid grid-cols-3 gap-3">
              <input value={editing.price} onChange={e => setEdit({ ...editing, price: e.target.value })}
                placeholder="650 ₽" className={fieldClass} />
              <input type="number" value={editing.sortOrder} onChange={e => setEdit({ ...editing, sortOrder: Number(e.target.value) })}
                placeholder="Порядок" className={fieldClass} />
              <label className="flex items-center gap-2 text-white text-sm">
                <input type="checkbox" checked={!!editing.isActive} onChange={e => setEdit({ ...editing, isActive: e.target.checked ? 1 : 0 })} />
                Активна
              </label>
            </div>
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
function AdminPanel() {
  const [tab, setTab] = useState<"bookings" | "stats" | "heatmap" | "tables" | "settings" | "menu" | "gallery" | "reviews">("bookings");
  const TABS = [
    { key: "bookings", label: "Брони" },
    { key: "stats",    label: "Статистика" },
    { key: "heatmap",  label: "Загрузка" },
    { key: "tables",   label: "QR столов" },
    { key: "settings", label: "Контент" },
    { key: "menu",     label: "Меню" },
    { key: "gallery",  label: "Галерея" },
    { key: "reviews",  label: "Отзывы" },
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
        {tab === "bookings" && <BookingsTab />}
        {tab === "stats" && <StatsTab />}
        {tab === "heatmap" && <HeatmapTab />}
        {tab === "tables" && <TablesTab />}
        {tab === "settings" && <SettingsTab />}
        {tab === "menu" && <MenuCmsTab />}
        {tab === "gallery" && <GalleryTab />}
        {tab === "reviews" && <ReviewsTab />}
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
