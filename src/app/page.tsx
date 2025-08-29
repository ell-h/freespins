"use client";

import Image from "next/image";
import { useMemo, useState, useEffect } from "react";

/* ---------------------------------- TYPES ---------------------------------- */
type SortKey = "spins" | "wager" | "az";
type Tag = "crypto" | "verified";

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  setHeaderColor: (colorKey: string) => void;
}
declare global {
  interface Window { Telegram?: { WebApp?: TelegramWebApp }; }
}

/* ---------------------------------- TAGS UI ---------------------------------- */
const TAG_LABEL: Record<Tag, string> = {
  crypto: "Crypto casinos",
  verified: "Verified by the FreeSpins.Casino Team",
};

function TagChip({
  tag, active, onClick,
}: { tag: Tag; active: boolean; onClick: (t: Tag) => void }) {
  const base = "inline-flex items-center rounded-full border text-xs font-medium px-3 py-1 transition";
  const activeCls =
    tag === "crypto"
      ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
      : "bg-sky-500 text-white border-sky-500 shadow-sm";
  const idleCls =
    tag === "crypto"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100"
      : "bg-sky-50 text-sky-700 border-sky-100 hover:bg-sky-100";
  return (
    <button type="button" aria-pressed={active}
      onClick={() => onClick(tag)} className={`${base} ${active ? activeCls : idleCls}`}>
      {TAG_LABEL[tag]}
    </button>
  );
}

/* ---------------------------------- DATA ---------------------------------- */
type CasinoOffer = {
  id: string; brand: string; offer: string; spins: number; wagering: string;
  link: string; logo: string; pill?: "NEW" | "HOT"; note?: string; tags: Tag[];
};

const OFFERS: CasinoOffer[] = [
  { id: "winz", brand: "Winz.io", offer: "300 Free Spins", wagering: "No wagering", link: "https://winzmedia.top/a8a3d95da", logo: "/logos/winzio.png", pill: "NEW", spins: 300, note: "Deposit required", tags: ["crypto", "verified"] },
  { id: "1xbit", brand: "1xBit.com", offer: "Up to 7 BTC + 250 Free Spins", wagering: "35x", link: "https://refpa04636.pro/L?tag=b_4668433m_61569c_&site=4668433&ad=61569", logo: "/logos/1xbit.jpg", spins: 250, note: "Deposit required", tags: ["crypto"] },
  { id: "betsio", brand: "Bets.io", offer: "225% + 225 Free Spins", wagering: "35x", link: "https://bts-link.com/?serial=23576&creative_id=326&anid=", logo: "/logos/betsio.png", spins: 225, note: "Deposit required", tags: ["crypto", "verified"] },
  { id: "bitstarz", brand: "BitStarz", offer: "100% up to €100 + 180 Free Spins", wagering: "40x", link: "https://bzstarz.com/b857ede1d", logo: "/logos/bitstarz.png", pill: "HOT", spins: 180, note: "Deposit required", tags: ["crypto", "verified"] },
  { id: "wildio", brand: "Wild.io", offer: "120% up to $5,000 + 75 Free Spins", wagering: "40x", link: "https://wildpartners.app/a1516a206", logo: "/logos/wildio.png", spins: 75, note: "Deposit required", tags: ["crypto", "verified"] },
];

/* --------------------------------- HELPERS -------------------------------- */
function pillClasses(pill?: CasinoOffer["pill"]) {
  if (pill === "NEW") return "text-[11px] px-2 py-[3px] rounded-full bg-purple-100 text-purple-700 border border-purple-200";
  if (pill === "HOT") return "text-[11px] px-2 py-[3px] rounded-full bg-rose-100 text-rose-700 border border-rose-200";
  return "";
}
function wageringToNumber(w: string) {
  if (!w) return Number.POSITIVE_INFINITY;
  if (w.toLowerCase().includes("no")) return 0;
  const m = w.match(/(\d+)/);
  return m ? Number(m[1]) : Number.POSITIVE_INFINITY;
}

/* -------------------------------- COMPONENT -------------------------------- */
export default function Home() {
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    tg?.ready(); tg?.expand(); tg?.setHeaderColor("secondary_bg_color");
  }, []);

  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("spins");
  const [activeTags, setActiveTags] = useState<Set<Tag>>(new Set());

  const toggleTag = (t: Tag) =>
    setActiveTags(prev => {
      const n = new Set(prev);
      n.has(t) ? n.delete(t) : n.add(t);
      return n;
    });

  // ✅ THIS is the piece that must exist before you render: 'filtered'
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = OFFERS.filter(o => (q ? o.brand.toLowerCase().includes(q) : true));

    if (activeTags.size > 0) {
      rows = rows.filter(o => [...activeTags].every(t => o.tags.includes(t)));
    }

    if (sortBy === "spins") rows = [...rows].sort((a, b) => b.spins - a.spins);
    else if (sortBy === "wager") rows = [...rows].sort((a, b) => wageringToNumber(a.wagering) - wageringToNumber(b.wagering));
    else rows = [...rows].sort((a, b) => a.brand.localeCompare(b.brand));

    return rows;
  }, [query, sortBy, activeTags]);

  return (
    <div className="min-h-screen text-neutral-900 relative">
      {/* animated light purple/blue background + top fade */}
      <style jsx global>{`
        html, body { height: 100%; }
        body { background: none; }
        body::before {
          content: ""; position: fixed; inset: 0; z-index: -2;
          background:
            radial-gradient(900px 500px at 15% 10%, rgba(138,58,255,.20), transparent 60%),
            radial-gradient(800px 420px at 85% 15%, rgba(99,102,241,.18), transparent 60%),
            radial-gradient(1000px 520px at 40% 90%, rgba(59,130,246,.14), transparent 60%),
            linear-gradient(-45deg, #f1eaff, #e7f0ff, #eadfff, #e6f2ff, #f1eaff);
          background-size: 200% 200%, 200% 200%, 200% 200%, 300% 300%;
          animation: float1 22s ease-in-out infinite, float2 28s ease-in-out infinite, float3 26s ease-in-out infinite, sweep 32s linear infinite;
        }
        body::after {
          content: ""; position: fixed; inset: 0 0 60% 0; z-index: -1;
          background: linear-gradient(to bottom, rgba(255,255,255,.70), rgba(255,255,255,0));
          pointer-events: none;
        }
        @keyframes float1 { 0%{background-position:0% 0%,0% 0%,0% 0%,0% 50%} 50%{background-position:70% 50%,10% 40%,30% 60%,100% 50%} 100%{background-position:0% 0%,0% 0%,0% 0%,0% 50%} }
        @keyframes float2 { 0%{background-position:0% 0%,0% 0%,0% 0%,0% 50%} 50%{background-position:20% 30%,80% 20%,60% 70%,100% 50%} 100%{background-position:0% 0%,0% 0%,0% 0%,0% 50%} }
        @keyframes float3 { 0%{background-position:0% 0%,0% 0%,0% 0%,0% 50%} 50%{background-position:40% 80%,10% 60%,80% 40%,100% 50%} 100%{background-position:0% 0%,0% 0%,0% 0%,0% 50%} }
        @keyframes sweep  { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
      `}</style>

      {/* Header (glass) */}
      <header className="mx-auto w-full max-w-6xl px-4 sm:px-6 pt-8">
        <div className="rounded-2xl bg-white/55 backdrop-blur-sm shadow-sm px-4 sm:px-6 py-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
                FreeSpins.Casino Offers Index
                <sup className="align-super text-xs font-semibold text-purple-600 ml-1">v1.0</sup>
              </h1>
              <p className="mt-2 text-sm text-neutral-700">
                Live list of the best crypto-casino free spins we track. We verify T&Cs and local rules before listing.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <TagChip tag="crypto" active={activeTags.has("crypto")} onClick={toggleTag} />
              <TagChip tag="verified" active={activeTags.has("verified")} onClick={toggleTag} />
            </div>
          </div>

          {/* Search + Sort */}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search brand (e.g. Winz)"
                  className="w-72 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-300"
                />
              </div>
              <button
                onClick={() => setQuery((q) => q.trim())}
                className="rounded-xl bg-neutral-900 text-white px-4 py-2.5 text-sm font-medium shadow-sm hover:bg-neutral-800 active:scale-[.99] transition"
              >
                Search
              </button>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-neutral-700">Sort by</label>
              <select
                className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-300"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
              >
                <option value="spins">Most spins</option>
                <option value="wager">Lowest wagering</option>
                <option value="az">A → Z</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Table (responsive for Telegram WebView) */}
      <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 pt-6 pb-16">
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white/85 backdrop-blur-sm shadow-sm">
          <div className="hidden sm:grid sm:grid-cols-[2fr_2fr_1fr_140px] items-center px-5 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 bg-neutral-50/60">
            <div>Casino</div><div>Offer</div><div>Wagering</div><div className="text-right">Bonus</div>
          </div>

          <ul className="divide-y divide-neutral-200">
            {filtered.map((o) => (
              <li key={o.id}
                className="grid grid-cols-1 sm:grid-cols-[2fr_2fr_1fr_140px] gap-y-3 sm:gap-y-0 items-center px-5 py-4">
                {/* Brand */}
                <div className="flex items-center gap-3">
                  <div className="relative h-9 w-9 overflow-hidden rounded-lg border border-neutral-200 bg-white">
                    <Image src={o.logo} alt={`${o.brand} logo`} fill sizes="36px" className="object-cover" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-neutral-900">{o.brand}</span>
                    {o.pill && <span className={pillClasses(o.pill)}>{o.pill}</span>}
                  </div>
                </div>

                {/* Offer */}
                <div>
                  <div className="font-medium">{o.offer}</div>
                  {o.note && <div className="text-xs text-neutral-500 mt-0.5">{o.note}</div>}
                </div>

                {/* Wagering */}
                <div>
                  {o.wagering.toLowerCase().includes("no") ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold px-2 py-[3px] border border-emerald-100">
                      No wagering
                    </span>
                  ) : (
                    <span className="text-neutral-700 font-medium">{o.wagering}</span>
                  )}
                </div>

                {/* Button */}
                <div className="sm:justify-self-end">
                  <a
                    href={o.link}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center justify-center w-full sm:w-[140px] whitespace-nowrap rounded-xl bg-[#7A1CF6] hover:bg-[#6a15dc] text-white text-[15px] font-extrabold leading-none h-[48px] px-5 shadow-[0_6px_14px_rgba(122,28,246,0.35)] active:scale-[.98] transition text-center"
                  >
                    Claim Bonus!
                  </a>
                </div>
              </li>
            ))}

            {filtered.length === 0 && (
              <li className="px-5 py-10 text-center text-neutral-500">No results for “{query}”</li>
            )}
          </ul>
        </div>

        {/* Legal */}
        <p className="mt-6 text-[12px] leading-relaxed text-neutral-600">
          This app promotes online gambling services intended for adults aged 18+ only. Gambling may be restricted in your region — please
          check local laws before participating. Play responsibly and seek help if needed. For free support, visit{" "}
          <span className="mx-1 underline decoration-neutral-300">BeGambleAware.org</span> or{" "}
          <span className="mx-1 underline decoration-neutral-300">Gambling Therapy</span>. The “Claim Bonus!” buttons are affiliate links —
          we may earn a commission if you sign up or deposit.
        </p>
      </main>
    </div>
  );
}
