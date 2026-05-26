import { useState, useEffect, useCallback } from "react";
import { Router as WouterRouter, Switch, Route } from "wouter";

const API_BASE = "/api";

type Booking = {
  id: number;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  comment: string | null;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:   { label: "Ожидает",   color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30" },
  confirmed: { label: "Подтверждено", color: "text-green-400 bg-green-400/10 border-green-400/30" },
  cancelled: { label: "Отменено",  color: "text-red-400 bg-red-400/10 border-red-400/30" },
};

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? "grizli2024";

function Login({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) { onLogin(); }
    else { setError(true); setPw(""); }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black tracking-widest text-lime uppercase">ГРИЗЛИ</h1>
          <p className="text-gray-500 text-sm mt-2 tracking-widest uppercase">Панель администратора</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <input
            type="password"
            value={pw}
            onChange={e => { setPw(e.target.value); setError(false); }}
            placeholder="Пароль"
            autoFocus
            className="w-full bg-neutral-900 border border-white/10 px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-lime transition-colors"
          />
          {error && <p className="text-red-400 text-sm">Неверный пароль</p>}
          <button
            type="submit"
            className="w-full bg-lime text-black font-bold uppercase tracking-widest py-3 hover:bg-lime/80 transition-colors"
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}

function AdminPanel() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  const load = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/bookings`);
      const data = await res.json();
      setBookings(data.reverse());
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: number, status: string) => {
    try {
      await fetch(`${API_BASE}/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setBookings(prev =>
        prev.map(b => b.id === id ? { ...b, status: status as Booking["status"] } : b)
      );
    } catch {}
  };

  const counts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === "pending").length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    cancelled: bookings.filter(b => b.status === "cancelled").length,
  };

  const visible = filter === "all" ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/5 px-6 py-4 flex justify-between items-center sticky top-0 bg-black/95 backdrop-blur z-10">
        <div>
          <h1 className="text-xl font-black tracking-widest text-lime uppercase">ГРИЗЛИ</h1>
          <p className="text-gray-500 text-xs tracking-widest">Бронирования</p>
        </div>
        <button
          onClick={load}
          className="text-xs text-gray-500 hover:text-lime transition-colors uppercase tracking-widest border border-white/10 px-3 py-1.5"
        >
          Обновить
        </button>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {(["all", "pending", "confirmed", "cancelled"] as const).map(key => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`p-4 border text-left transition-colors ${
                filter === key ? "border-lime/50 bg-lime/5" : "border-white/5 hover:border-white/15"
              }`}
            >
              <div className="text-2xl font-black text-white">{counts[key]}</div>
              <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                {key === "all" ? "Всего" : STATUS_LABELS[key].label}
              </div>
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-gray-500 text-center py-20">Загрузка...</div>
        ) : visible.length === 0 ? (
          <div className="text-gray-600 text-center py-20 border border-white/5">
            Нет заявок
          </div>
        ) : (
          <div className="space-y-3">
            {visible.map(b => (
              <div key={b.id} className="border border-white/5 p-5 hover:border-white/10 transition-colors">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="text-white font-semibold">{b.name}</span>
                      <span className={`text-xs px-2 py-0.5 border ${STATUS_LABELS[b.status].color}`}>
                        {STATUS_LABELS[b.status].label}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 space-y-1">
                      <div className="flex flex-wrap gap-x-6 gap-y-1">
                        <span>📞 {b.phone}</span>
                        <span>📅 {b.date} в {b.time}</span>
                        <span>👥 {b.guests} {b.guests === 1 ? "гость" : b.guests < 5 ? "гостя" : "гостей"}</span>
                      </div>
                      {b.comment && (
                        <div className="text-gray-500 mt-1">💬 {b.comment}</div>
                      )}
                    </div>
                    <div className="text-xs text-gray-600 mt-2">
                      {new Date(b.createdAt).toLocaleString("ru-RU")}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0 flex-wrap">
                    {b.status !== "confirmed" && (
                      <button
                        onClick={() => updateStatus(b.id, "confirmed")}
                        className="text-xs px-3 py-1.5 border border-green-500/40 text-green-400 hover:bg-green-500/10 transition-colors uppercase tracking-wide"
                      >
                        Подтвердить
                      </button>
                    )}
                    {b.status !== "pending" && (
                      <button
                        onClick={() => updateStatus(b.id, "pending")}
                        className="text-xs px-3 py-1.5 border border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10 transition-colors uppercase tracking-wide"
                      >
                        В ожидание
                      </button>
                    )}
                    {b.status !== "cancelled" && (
                      <button
                        onClick={() => updateStatus(b.id, "cancelled")}
                        className="text-xs px-3 py-1.5 border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-colors uppercase tracking-wide"
                      >
                        Отменить
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [authed, setAuthed] = useState(() => {
    return sessionStorage.getItem("grizli_admin") === "1";
  });

  const login = () => {
    sessionStorage.setItem("grizli_admin", "1");
    setAuthed(true);
  };

  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Switch>
        <Route path="/">
          {authed ? <AdminPanel /> : <Login onLogin={login} />}
        </Route>
      </Switch>
    </WouterRouter>
  );
}
