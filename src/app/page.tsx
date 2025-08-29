"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

/* ---------------------------------- TYPES ---------------------------------- */
type SortKey = "spins" | "wager" | "az";

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  setHeaderColor: (colorKey: string) => void;
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
  }
}

type CasinoOffer = {
  id: string;
  brand: string;
  offer: string;
  spins: number;
  wagering: string;
  link: string;
  logo: string;
  pill?: "NEW" | "HOT";
  note?: string;
  tags: string[];       // e.g., ["Crypto casinos","Verified"]
  cryptos: string[];    // image paths in /public/logos
};

/* ---------------------------------- DATA ---------------------------------- */
const OFFERS: CasinoOffer[] = [
  {
    id: "bitstarz",
    brand: "BitStarz",
    offer: "100% up to €100 + 180 Free Spins",
    wagering: "40x",
    link: "https://bzstarz.com/b857ede1d",
    logo: "/logos/bitstarz.png",
    pill: "HOT",
    spins: 180,
    note: "Deposit required",
    tags: ["Crypto casinos", "Verified"],
    cryptos: ["/logos/bitcoin.png", "/logos/eth.png", "/logos/solana.webp", "/logos/usdt.png"],
  },
  {
    id: "winz",
    brand: "Winz.io",
    offer: "300 Free Spins",
    wagering: "No wagering",
    link: "https://winzmedia.top/a8a3d95da",
    logo: "/logos/winzio.png",
    pill: "NEW",
    spins: 300,
    note: "Deposit required",
    tags: ["Crypto casinos", "Verified"],
    cryptos: ["/logos/bitcoin.png", "/logos/eth.png", "/logos/solana.webp", "/logos/usdt.png"],
  },
  {
    id: "1xbit",
    brand: "1xBit.com",
    offer: "Up to 7 BTC + 250 Free Spins",
    wagering: "35x",
    link: "https://refpa04636.pro/L?tag=b_4668433m_61569c_&site=4668433&ad=61569",
    logo: "/logos/1xbit.jpg",
    spins: 250,
    note: "Deposit required",
    tags: ["Crypto casinos"],
    cryptos: ["/logos/bitcoin.png", "/logos/eth.png", "/logos/usdt.png"],
  },
  {
    id: "betsio",
    brand: "Bets.io",
    offer: "225% + 225 Free Spins",
    wagering: "35x",
    link: "https://bts-link.com/?serial=23576&creative_id=326&anid=",
    logo: "/logos/betsio.png",
    spins: 225,
    note: "Deposit required",
    tags: ["Crypto casinos", "Verified"],
    cryptos: ["/logos/bitcoin.png", "/logos/eth.png", "/logos/solana.webp"],
  },
  {
    id: "wildio",
    brand: "Wild.io",
    offer: "120% up to $5,000 + 75 Free Spins",
    wagering: "40x",
    link: "https://wildpartners.app/a1516a206",
    logo: "/logos/wildio.png",
    spins: 75,
    note: "Deposit required",
    tags: ["Crypto casinos", "Verified"],
    cryptos: ["/logos/bitcoin.png", "/logos/eth.png", "/logos/solana.webp", "/logos/usdt.png"],
  },
];

/* -------------------------------- HELPERS -------------------------------- */
function pillClasses(pill?: CasinoOffer["pill"]) {
  if (pill === "NEW")
    return "text-[11px] px-2 py-[3px] rounded-full bg-purple-100 text-purple-700 border border-purple-200";
  if (pill === "HOT")
    return "text-[11px] px-2 py-[3px] rounded-full bg-rose-100 text-rose-700 border border-rose-200";
  return "";
}
function wageringToNumber(w: string) {
  if (!w) return Number.POSITIVE_INFINITY;
  if (w.toLowerCase().includes("no")) return 0;
  const m = w.match(/(\d+)/);
  return m ? Number(m[1]) : Number.POSITIVE_INFINITY;
}
const COIN_TITLES: Record<string, string> = {
  "/logos/bitcoin.png": "Bitcoin",
  "/logos/eth.png": "Ethereum",
  "/logos/solana.webp": "Solana",
  "/logos/usdt.png": "Tether (USDT)",
};

/* ------------------------------ MAIN COMPONENT ---------------------------- */
export default function Home() {
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    tg?.ready();
    tg?.expand();
    tg?.setHeaderColor("secondary_bg_color");
  }, []);

  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("spins");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Filter and sort (without worrying about Top Pick yet)
  const filteredSorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = OFFERS.filter((o) => {
      const matchesQuery = q ? o.brand.toLowerCase().includes(q) : true;
      const matchesTag = activeTag ? o.tags.includes(activeTag) : true;
      return matchesQuery && matchesTag;
    });
    if (sortBy === "spins") rows = rows.sort((a, b) => b.spins - a.spins);
    else if (sortBy === "wager") rows = rows.sort((a, b) => wageringToNumber(a.wagering) - wageringToNumber(b.wagering));
    else rows = rows.sort((a, b) => a.brand.localeCompare(b.brand));
    return rows;
  }, [query, sortBy, activeTag]);

  // Ensure Top Pick (bitstarz) is first when it passes filters
  const topPick = OFFERS.find((o) => o.id === "bitstarz")!;
  const topPickIncluded = filteredSorted.some((o) => o.id === "bitstarz");
  const listWithoutTopPick = filteredSorted.filter((o) => o.id !== "bitstarz");

  return (
    <div className="min-h-screen text-neutral-900 relative">
      {/* gradient animation style */}
      <style jsx global>{`
        .animate-gradient { background-size: 400% 400%; animation: gradientShift 26s ease-in-out infinite; }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* 🔹 Moving, light gradient background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-r from-purple-200 via-indigo-200 to-blue-200 animate-gradient" />

      {/* 🔹 Follow Us Banner */}
      <div className="w-full bg-white/70 backdrop-blur-sm border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2 flex items-center gap-2 justify-center">
          <Image src="/logos/x.webp" alt="X (Twitter)" width={18} height={18} className="opacity-80" />
          <a
            href="https://x.com/FreeSpins2025"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-neutral-800 hover:text-purple-600 transition"
          >
            Follow us on X
          </a>
        </div>
      </div>

      {/* Header */}
      <header className="mx-auto w-full max-w-6xl px-4 sm:px-6 pt-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          FreeSpins.Casino Offers Index
          <sup className="align-super text-xs font-semibold text-purple-600 ml-1">v1.0</sup>
        </h1>
        <p className="mt-2 text-sm text-neutral-700">
          Live list of the best crypto-casino free spins we track. We verify T&Cs and local rules before listing.
        </p>

        {/* Tags */}
        <div className="mt-4 flex gap-2">
          {["Crypto casinos", "Verified"].map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`px-4 py-1 rounded-full border text-sm transition ${
                activeTag === tag
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-white/80 text-neutral-800 border border-neutral-300 hover:bg-purple-50"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Search + Sort */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search brand (e.g. Winz)"
              className="flex-grow sm:w-72 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-300"
            />
            <button
              onClick={() => setQuery((q) => q.trim())}
              className="shrink-0 rounded-xl bg-neutral-900 text-white px-4 py-2.5 text-sm font-medium shadow-sm hover:bg-neutral-800 active:scale-[.99] transition"
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
      </header>

      {/* Main list */}
      <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 pt-6 pb-16 space-y-4">
        {/* Top Pick first if it passed filters */}
        {topPickIncluded && (
          <div className="rounded-2xl border-2 border-emerald-400 bg-white p-5 shadow-[0_0_15px_rgba(34,197,94,.35)]">
            <div className="text-green-600 font-semibold mb-2 text-sm">🌟 Top Pick</div>
            <CardRow offer={topPick} highlight />
          </div>
        )}

        {/* Rest of the offers (excluding Top Pick) */}
        {listWithoutTopPick.map((o) => (
          <div key={o.id} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <CardRow offer={o} />
          </div>
        ))}

        {filteredSorted.length === 0 && (
          <div className="px-5 py-10 text-center text-neutral-500">No results for “{query}”</div>
        )}

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

/* ------------------------------ CARD ROW ---------------------------------- */
function CardRow({ offer, highlight }: { offer: CasinoOffer; highlight?: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Brand + logo */}
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-neutral-200 bg-white shrink-0">
          <Image src={offer.logo} alt={`${offer.brand} logo`} fill sizes="40px" className="object-cover" />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-neutral-900">{offer.brand}</span>
          {offer.pill && <span className={pillClasses(offer.pill)}>{offer.pill}</span>}
        </div>
      </div>

      {/* Offer */}
      <div className="flex-grow">
        <div className="font-medium">{offer.offer}</div>
        {offer.note && <div className="text-xs text-neutral-500 mt-0.5">{offer.note}</div>}

        {/* Accepted cryptos */}
        <div className="flex items-center gap-2 mt-2">
          {offer.cryptos.map((src) => (
            <Image
              key={src}
              src={src}
              alt={COIN_TITLES[src] ?? "Accepted crypto"}
              title={COIN_TITLES[src] ?? "Accepted crypto"}
              width={18}
              height={18}
              className="rounded-full border border-neutral-200"
            />
          ))}
          <span className="text-xs text-neutral-500">+ More</span>
        </div>
      </div>

      {/* CTA */}
      <div className="text-right shrink-0">
        <a
          href={offer.link}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className={`inline-flex items-center justify-center w-full rounded-xl text-white text-sm font-bold h-[44px] px-5 active:scale-[.98] transition
            ${highlight ? "bg-[#7A1CF6] hover:bg-[#6a15dc] shadow-[0_6px_14px_rgba(122,28,246,0.35)]" : "bg-[#7A1CF6] hover:bg-[#6a15dc] shadow-[0_6px_14px_rgba(122,28,246,0.25)]"}`}
        >
          Claim Bonus!
        </a>
      </div>
    </div>
  );
}
