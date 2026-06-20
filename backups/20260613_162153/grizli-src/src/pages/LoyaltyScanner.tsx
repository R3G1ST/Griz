import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";
import { motion, AnimatePresence } from "framer-motion";

const BASE_URL = import.meta.env.BASE_URL ?? "/";
const API = (p: string) => `${BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL}${p}`;
const SCAN_PIN = import.meta.env.VITE_SCAN_PIN ?? "1234";

type CardData = {
  name: string; phone: string | null; visits: number;
  bonus_points: number; tier: string;
  tier_info: { emoji: string; name: string; discount: number; bonus_rate: number };
};

type Mode = "qr" | "phone";
type ScanState = "idle" | "found" | "success" | "error";

// ── PIN screen ────────────────────────────────────────────────────────────────
function PinScreen({ onAuth }: { onAuth: () => void }) {
  const [pin, setPin] = useState("");
  const [err, setErr] = useState(false);

  const handleDigit = (d: string) => {
    const next = pin + d;
    if (next.length > 4) return;
    setPin(next);
    setErr(false);
    if (next.length === 4) {
      setTimeout(() => {
        if (next === SCAN_PIN) { onAuth(); }
        else { setErr(true); setPin(""); }
      }, 200);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-8 px-6">
      <div className="text-center">
        <div className="text-4xl mb-3">🐻</div>
        <h1 className="text-white font-serif text-2xl font-bold tracking-widest uppercase">ГРИЗЛИ</h1>
        <p className="text-white/40 text-sm mt-1 tracking-widest uppercase">Касса — ввод PIN</p>
      </div>

      {/* Dots */}
      <div className="flex gap-4">
        {[0,1,2,3].map(i => (
          <motion.div key={i}
            animate={{ scale: pin.length > i ? 1.2 : 1 }}
            className={`w-4 h-4 rounded-full border-2 transition-colors ${
              err ? "border-red-500 bg-red-500" :
              pin.length > i ? "border-[#C5FF00] bg-[#C5FF00]" : "border-white/30"
            }`} />
        ))}
      </div>

      {/* Numpad */}
      <div className="grid grid-cols-3 gap-3 w-64">
        {["1","2","3","4","5","6","7","8","9","",  "0","⌫"].map((d, i) => (
          <button key={i}
            onClick={() => d === "⌫" ? setPin(p => p.slice(0,-1)) : d ? handleDigit(d) : undefined}
            disabled={!d}
            className={`h-16 rounded-xl text-xl font-medium transition-all active:scale-95 ${
              d === "⌫" ? "bg-white/5 text-white/40 hover:bg-white/10" :
              d ? "bg-white/10 text-white hover:bg-white/20 hover:text-[#C5FF00]" :
              "opacity-0 pointer-events-none"
            }`}
          >{d}</button>
        ))}
      </div>

      {err && <p className="text-red-400 text-sm animate-shake">Неверный PIN</p>}
    </div>
  );
}

// ── Customer card panel ───────────────────────────────────────────────────────
function CustomerPanel({
  card, onClose, onSuccess
}: {
  card: CardData; phone: string;
  onClose: () => void; onSuccess: (bonus: number) => void;
}) {
  const [amount, setAmount] = useState("");
  const [useBonus, setUseBonus] = useState(0);
  const [loading, setLoading] = useState(false);
  const tier = card.tier_info;
  const bonusEarned = amount ? Math.floor((parseInt(amount) * tier.bonus_rate) / 100) : 0;

  const submit = async () => {
    setLoading(true);
    try {
      const phone = card.phone ?? "";
      const r = await fetch(API("/api/loyalty/visit"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, amount_spent: parseInt(amount || "0"), note: "Касса — сканирование" }),
      });
      if (!r.ok) throw new Error();
      if (useBonus > 0) {
        await fetch(API("/api/loyalty/redeem"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, points: useBonus }),
        });
      }
      onSuccess(bonusEarned);
    } catch { setLoading(false); }
  };

  return (
    <motion.div
      initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="fixed inset-x-0 bottom-0 bg-[#0a0a0a] border-t border-white/10 rounded-t-3xl p-6 z-50 max-h-[90vh] overflow-y-auto"
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="text-white font-serif text-xl font-bold">{card.name}</div>
          <div className="text-white/40 text-sm">{card.phone}</div>
        </div>
        <button onClick={onClose} className="text-white/40 hover:text-white text-2xl">×</button>
      </div>

      {/* Tier + stats */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {[
          { label: "Уровень",  value: `${tier.emoji} ${tier.name}` },
          { label: "Визитов",  value: card.visits + 1 },
          { label: "Баллов",   value: card.bonus_points },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white/5 rounded-xl p-3 text-center">
            <div className="text-white font-bold text-lg">{value}</div>
            <div className="text-white/40 text-xs uppercase tracking-widest mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Amount */}
      <div className="mb-4">
        <label className="text-white/60 text-xs uppercase tracking-widest mb-2 block">Сумма чека (₽)</label>
        <input
          type="number" value={amount} onChange={e => setAmount(e.target.value)}
          placeholder="0" inputMode="numeric"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xl font-bold focus:outline-none focus:border-[#C5FF00]/50 transition-colors"
        />
        {bonusEarned > 0 && (
          <p className="text-[#C5FF00] text-sm mt-2">
            + {bonusEarned} баллов будет начислено ({tier.bonus_rate}%)
          </p>
        )}
      </div>

      {/* Use bonus */}
      {card.bonus_points > 0 && (
        <div className="mb-5 flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
          <div>
            <div className="text-white text-sm font-medium">Списать баллы</div>
            <div className="text-white/40 text-xs">Доступно: {card.bonus_points} руб.</div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number" value={useBonus} onChange={e => setUseBonus(Math.min(card.bonus_points, parseInt(e.target.value)||0))}
              inputMode="numeric" max={card.bonus_points}
              className="w-20 bg-black/50 border border-white/10 rounded-lg px-2 py-1 text-white text-sm text-right focus:outline-none focus:border-[#C5FF00]/50"
            />
          </div>
        </div>
      )}

      <button
        onClick={submit} disabled={loading}
        className="w-full h-14 rounded-xl font-bold uppercase tracking-widest text-sm transition-all active:scale-95 disabled:opacity-50"
        style={{ background: loading ? "#333" : "#C5FF00", color: "#000" }}
      >
        {loading ? "Начисляем..." : "✓ Начислить баллы"}
      </button>
    </motion.div>
  );
}

// ── Main scanner ──────────────────────────────────────────────────────────────
function Scanner() {
  const [mode, setMode] = useState<Mode>("qr");
  const [phone, setPhone] = useState("");
  const [card, setCard] = useState<CardData | null>(null);
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [successBonus, setSuccessBonus] = useState(0);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const scannerDivId = "qr-reader";

  const lookup = async (phoneOrToken: string) => {
    // Try as phone first; if it's a URL extract token
    let url = API(`/api/loyalty/lookup?phone=${encodeURIComponent(phoneOrToken)}`);
    if (phoneOrToken.startsWith("http")) {
      const match = phoneOrToken.match(/\/loyalty\/([a-f0-9-]{36})/);
      if (match) url = API(`/api/loyalty/card/${match[1]}`);
    }
    try {
      const r = await fetch(url);
      const data = await r.json();
      if (!r.ok || data.found === false) { setScanState("error"); return; }
      setCard(data as CardData);
      setScanState("found");
    } catch { setScanState("error"); }
  };

  // QR scanner lifecycle
  useEffect(() => {
    if (mode !== "qr") return;
    const scanner = new Html5QrcodeScanner(scannerDivId, {
      fps: 10, qrbox: 250, rememberLastUsedCamera: true,
      supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
    }, false);
    scanner.render(
      (text) => {
        if (scanState !== "idle") return;
        scanner.pause();
        lookup(text);
      },
      () => {}
    );
    scannerRef.current = scanner;
    return () => { scanner.clear().catch(() => {}); };
  }, [mode]);

  const handlePhoneLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim().length < 7) return;
    lookup(phone.trim());
  };

  const handleSuccess = (bonus: number) => {
    setSuccessBonus(bonus);
    setCard(null);
    setScanState("success");
    setTimeout(() => {
      setScanState("idle");
      if (scannerRef.current) scannerRef.current.resume?.();
    }, 3000);
  };

  const reset = () => {
    setCard(null);
    setScanState("idle");
    setPhone("");
    if (scannerRef.current) {
      try { (scannerRef.current as any).resume?.(); } catch {}
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/95 backdrop-blur border-b border-white/5 px-4 py-4 flex items-center gap-3">
        <div className="text-[#C5FF00] text-xl">🐻</div>
        <div>
          <div className="font-serif font-bold tracking-widest uppercase text-sm">ГРИЗЛИ — Касса</div>
          <div className="text-white/40 text-xs">Система лояльности</div>
        </div>
      </div>

      {/* Mode tabs */}
      <div className="flex mx-4 mt-4 mb-4 border border-white/10 rounded-xl overflow-hidden">
        {(["qr", "phone"] as const).map(m => (
          <button key={m} onClick={() => { setMode(m); reset(); }}
            className={`flex-1 py-3 text-sm font-medium uppercase tracking-widest transition-colors ${
              mode === m ? "bg-[#C5FF00] text-black" : "text-white/40 hover:text-white"
            }`}>
            {m === "qr" ? "📷 Сканировать" : "📞 По номеру"}
          </button>
        ))}
      </div>

      {/* Success overlay */}
      <AnimatePresence>
        {scanState === "success" && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center gap-4">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: 2, duration: 0.4 }}
              className="text-6xl">✅</motion.div>
            <p className="text-white text-2xl font-serif font-bold">Готово!</p>
            {successBonus > 0 && <p className="text-[#C5FF00] text-lg">+{successBonus} баллов начислено</p>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error message */}
      {scanState === "error" && (
        <div className="mx-4 mb-4 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center justify-between">
          <p className="text-red-400 text-sm">Гость не найден в базе</p>
          <button onClick={reset} className="text-red-400 text-lg">×</button>
        </div>
      )}

      {/* QR mode */}
      {mode === "qr" && (
        <div className="px-4">
          <div id={scannerDivId} className="overflow-hidden rounded-2xl [&>*]:!border-0 [&_video]:rounded-2xl" />
          <p className="text-center text-white/30 text-xs mt-3">Наведите камеру на QR-код гостя</p>
        </div>
      )}

      {/* Phone mode */}
      {mode === "phone" && (
        <form onSubmit={handlePhoneLookup} className="px-4 space-y-3">
          <div className="relative">
            <input
              type="tel" value={phone} onChange={e => setPhone(e.target.value)}
              placeholder="+7 (___) ___-__-__"
              inputMode="tel" autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-5 text-white text-xl font-medium placeholder:text-white/20 focus:outline-none focus:border-[#C5FF00]/50 transition-colors"
            />
          </div>
          <button type="submit"
            className="w-full h-14 rounded-2xl font-bold uppercase tracking-widest text-sm"
            style={{ background: "#C5FF00", color: "#000" }}>
            Найти гостя
          </button>
        </form>
      )}

      {/* Customer panel */}
      <AnimatePresence>
        {card && scanState === "found" && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40" onClick={reset} />
            <CustomerPanel card={card} phone={card.phone ?? phone} onClose={reset} onSuccess={handleSuccess} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Page entry ────────────────────────────────────────────────────────────────
export default function LoyaltyScanner() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("scan_auth") === "1");
  const auth = () => { sessionStorage.setItem("scan_auth", "1"); setAuthed(true); };
  return authed ? <Scanner /> : <PinScreen onAuth={auth} />;
}
