import { useState, useEffect, useCallback } from "react";
import { Router as WouterRouter, Switch, Route } from "wouter";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const API_BASE = "/api";
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? "grizli2024";

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
    if (pw === ADMIN_PASSWORD) { onLogin(); } else { setErr(true); setPw(""); }
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
    await fetch(`${API_BASE}/bookings/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
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

// ── Admin panel shell ─────────────────────────────────────────────────────────
function AdminPanel() {
  const [tab, setTab] = useState<"bookings" | "stats">("bookings");
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/5 px-6 py-4 flex gap-6 items-center sticky top-0 bg-black/95 backdrop-blur z-10">
        <div>
          <h1 className="text-xl font-black tracking-widest text-lime uppercase">ГРИЗЛИ</h1>
          <p className="text-gray-500 text-xs tracking-widest">Администратор</p>
        </div>
        <div className="flex gap-1 ml-auto">
          {(["bookings", "stats"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 text-xs uppercase tracking-widest transition-colors ${tab === t ? "bg-lime text-black font-bold" : "text-gray-500 hover:text-white"}`}>
              {t === "bookings" ? "Брони" : "Статистика"}
            </button>
          ))}
        </div>
      </header>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {tab === "bookings" ? <BookingsTab /> : <StatsTab />}
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
