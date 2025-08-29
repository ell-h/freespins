"use client";

import Image from "next/image";
import { useMemo, useState, useEffect } from "react";

/* ---------------------------------- TYPES ---------------------------------- */

type SortKey = "spins" | "wager" | "az";

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  setHeaderColor: (colorKey: string) => void;
  openLink?: (url: string) => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

/* ---------------------------------- DATA ---------------------------------- */

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
};

const OFFERS: CasinoOffer[] = [
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
  },
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
  },
];

/* --------------------------------- HELPERS -------------------------------- */

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

/* -------------------------------- COMPONENT -------------------------------- */

export default function Home() {
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return; // safe if opened in a normal browser
    tg.ready();
    tg.expand();
    tg.setHeaderColor("secondary_bg_color");

    // Match Telegram theme background to avoid “framed” look
    document.body.style.backgroundColor = "var(--tg-theme-bg-color)";
  }, []);

  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("spins");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = OFFERS.filter((o) =>
      q ? o.brand.toLowerCase().includes(q) : true
    );
    if (sortBy === "spins") {
      rows = [...rows].sort((a, b) => b.spins - a.spins);
    } else if (sortBy === "wager") {
      rows = [...rows].sort(
        (a, b) => wageringToNumber(a.wagering) - wageringToNumber(b.wagering)
      );
    } else {
      rows = [...rows].sort((a, b) => a.brand.localeCompare(b.brand));
    }
    return rows;
  }, [query, sortBy]);

  const openBonus = (url: string) => {
    const tg = window.Telegram?.WebApp;
    if (tg?.openLink) tg.openLink(url);
    else window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Header */}
      <header className="mx-auto w-full max-w-6xl px-4 sm:px-6 pt-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
              FreeSpins.Casino Offers Index
              <sup className="align-super text-xs font-semibold text-purple-600 ml-1">
                v1.0
              </sup>
            </h1>
            <p className="mt-2 text-sm text-neutral-600">
              Live list of the best crypto-casino free spins we track. We verify
              T&Cs and local rules before listing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1 border border-emerald-100">
              Crypto casinos
            </span>
            <span className="inline-flex items-center rounded-full bg-sky-50 text-sky-700 text-xs font-medium px-3 py-1 border border-sky-100">
              Verified by the FreeSpins.Casino Team
            </span>
          </div>
        </div>

        {/* Search + Sort */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
            <label className="text-sm text-neutral-600">Sort by</label>
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

      {/* Table */}
      <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 pt-6 pb-16">
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          {/* Header row hidden on mobile */}
          <div className="hidden sm:grid sm:grid-cols-[2fr_2fr_1fr_140px] items-center px-5 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 bg-neutral-50">
            <div>Casino</div>
            <div>Offer</div>
            <div>Wagering</div>
            <div className="text-right">Bonus</div>
          </div>

          <ul className="divide-y divide-neutral-200">
            {filtered.map((o) => (
              <li
                key={o.id}
                className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_2fr_1fr_140px] items-center px-5 py-4"
              >
                {/* Brand + logo */}
                <div className="flex items-center gap-3">
                  <div className="relative h-9 w-9 overflow-hidden rounded-lg border border-neutral-200 bg-white">
                    <Image
                      src={o.logo}
                      alt={`${o.brand} logo`}
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-neutral-900">
                      {o.brand}
                    </span>
                    {o.pill && (
                      <span className={pillClasses(o.pill)}>{o.pill}</span>
                    )}
                  </div>
                </div>

                {/* Offer */}
                <div>
                  <div className="font-medium">{o.offer}</div>
                  {o.note && (
                    <div className="text-xs text-neutral-500 mt-0.5">
                      {o.note}
                    </div>
                  )}
                </div>

                {/* Wagering */}
                <div className="sm:justify-self-start">
                  {o.wagering.toLowerCase().includes("no") ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold px-2 py-[3px] border border-emerald-100">
                      No wagering
                    </span>
                  ) : (
                    <span className="text-neutral-700 font-medium">
                      {o.wagering}
                    </span>
                  )}
                </div>

                {/* Visit */}
                <div className="sm:text-right">
                  <button
                    onClick={() => openBonus(o.link)}
                    className="inline-flex items-center justify-center w-full rounded-xl bg-[#7A1CF6] hover:bg-[#6a15dc] text-white text-[15px] font-extrabold leading-none h-[48px] px-5 shadow-[0_6px_14px_rgba(122,28,246,0.35)] active:scale-[.98] transition text-center"
                  >
                    Claim Bonus!
                  </button>
                </div>
              </li>
            ))}

            {filtered.length === 0 && (
              <li className="px-5 py-10 text-center text-neutral-500">
                No results for “{query}”
              </li>
            )}
          </ul>
        </div>

        {/* Legal / T&Cs */}
        <p className="mt-6 text-[12px] leading-relaxed text-neutral-500">
          This app promotes online gambling services intended for adults aged 18+ only.
          Gambling may be restricted in your region — please check local laws before
          participating. Play responsibly and seek help if needed. For free support, visit
          <span className="mx-1 underline decoration-neutral-300">BeGambleAware.org</span>
          or
          <span className="mx-1 underline decoration-neutral-300">Gambling Therapy</span>.
          The “Claim Bonus!” buttons are affiliate links — we may earn a commission if you sign up or deposit.
        </p>
      </main>
    </div>
  );
}
