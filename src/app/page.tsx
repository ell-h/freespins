"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Analytics } from "@vercel/analytics/react";

/* ------------------------------ Types & Data ------------------------------ */

type Casino = {
  id: number;
  name: string;
  offer: string;
  wagering: string;
  link: string;
  logo: string;
  label?: "NEW" | "HOT";
  cryptos: string[];
  topPick?: boolean;
  reviewUrl?: string;
};

const casinos: Casino[] = [
  {
    id: 1,
    name: "BitStarz",
    offer: "100% up to €100 + 180 Free Spins",
    wagering: "40x",
    link: "https://freespins.casino/bitstarz",
    logo: "/logos/bitstarz.png",
    label: "HOT",
    cryptos: ["/logos/bitcoin.png", "/logos/eth.png", "/logos/solana.webp", "/logos/usdt.png"],
    topPick: true,
    reviewUrl: "https://freespins.casino/casino/bitstarz-casino/",
  },
  {
    id: 2,
    name: "Winz.io",
    offer: "300 Free Spins",
    wagering: "No wagering",
    link: "https://freespins.casino/winz-io",
    logo: "/logos/winzio.png",
    label: "NEW",
    cryptos: ["/logos/bitcoin.png", "/logos/eth.png", "/logos/solana.webp", "/logos/usdt.png"],
    reviewUrl: "https://freespins.casino/casino/winz-io/",
  },
  {
    id: 3,
    name: "1xBit.com",
    offer: "Up to 7 BTC + 250 Free Spins",
    wagering: "35x",
    link: "https://freespins.casino/1xbit",
    logo: "/logos/1xbit.jpg",
    cryptos: ["/logos/bitcoin.png", "/logos/eth.png", "/logos/usdt.png"],
    reviewUrl: "https://freespins.casino/casino/1xbit/",
  },
  {
    id: 4,
    name: "Bets.io",
    offer: "225% + 225 Free Spins",
    wagering: "35x",
    link: "https://freespins.casino/bets-io",
    logo: "/logos/betsio.png",
    cryptos: ["/logos/bitcoin.png", "/logos/eth.png", "/logos/solana.webp"],
    reviewUrl: "https://freespins.casino/casino/bets-io-casino/",
  },
  {
    id: 5,
    name: "Wild.io",
    offer: "120% up to $5,000 + 75 Free Spins",
    wagering: "40x",
    link: "https://freespins.casino/wild-io",
    logo: "/logos/wildio.png",
    cryptos: ["/logos/bitcoin.png", "/logos/eth.png", "/logos/solana.webp", "/logos/usdt.png"],
    reviewUrl: "https://freespins.casino/casino/wild-io/",
  },
];

type Guide = { id: number; title: string; url: string; img: string };

const guides: Guide[] = [
  {
    id: 1,
    title: "Using Crypto to Gamble: A Complete Guide for 2025",
    url: "https://freespins.casino/2025/08/25/crypto-gambling-2025/",
    img: "/logos/cryptogambling.webp",
  },
  {
    id: 2,
    title: "Bitcoin Bingo and Crypto Bingo in 2025: What You Need to Know",
    url: "https://freespins.casino/2025/08/26/bitcoin-bingo/",
    img: "/logos/bingo.webp",
  },
  {
    id: 3,
    title: "Is Matched Betting Worth It? A Complete UK Guide for 2025",
    url: "https://freespins.casino/2025/08/27/is-matched-betting-worth-it-uk/",
    img: "/logos/matchedbetting.webp",
  },
];

/* ------------------------------ Daily Spin Setup ------------------------------ */

/** Wheel slices (emoji). */
const SLICES = ["❓", "💰", "🎁", "❓", "💰", "❓", "🎁", "❓"] as const;
type SliceSymbol = (typeof SLICES)[number];

type OutcomeKind = "lose" | "bonus" | "stars";

/** Heavily weighted to losing, occasional bonus/stars. */
const outcomeMap: Record<SliceSymbol, { kind: OutcomeKind; label: string; weight: number }> = {
  "❓": { kind: "lose",  label: "Better luck next time", weight: 85 },
  "💰": { kind: "bonus", label: "🎰 Free Spins Bonus",  weight: 10 },
  "🎁": { kind: "stars", label: "⭐ Telegram Stars Gift", weight: 5  },
};

/** Cooldown key (localStorage). If in Telegram, scope to user id. */
const cooldownKey = () => {
  const tg = (globalThis as any)?.Telegram?.WebApp?.initDataUnsafe?.user?.id;
  return tg ? `dailySpinLast_${tg}` : "dailySpinLast";
};

const COOLDOWN_HOURS = 24;

/** Pick a random affiliate link from current casinos. */
function randomAffiliateLink(): string {
  const links = casinos.map(c => c.link).filter(Boolean);
  return links[Math.floor(Math.random() * links.length)];
}

/* ---------------------------------- UI ---------------------------------- */

type TabKey = "offers" | "reviews" | "guides" | "dailyspin";

export default function Home() {
  const [active, setActive] = useState<TabKey>("offers");

  // Offers: keep BitStarz at the top
  const sortedCasinos = useMemo(() => {
    const arr = [...casinos];
    arr.sort((a, b) => (b.topPick ? 1 : 0) - (a.topPick ? 1 : 0));
    return arr;
  }, []);

  /* ------------------------------ Daily Spin State ------------------------------ */
  const wheelRef = useRef<HTMLDivElement | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [resultLabel, setResultLabel] = useState<string | null>(null);
  const [resultLink, setResultLink] = useState<string | undefined>(undefined);
  const [cooldownLeft, setCooldownLeft] = useState<number>(0); // minutes left

  // Check cooldown on load and periodically
  useEffect(() => {
    const check = () => {
      const key = cooldownKey();
      const last = localStorage.getItem(key);
      if (!last) {
        setCooldownLeft(0);
        return;
      }
      const diffMs = Date.now() - Number(last);
      const leftMs = COOLDOWN_HOURS * 3600_000 - diffMs;
      setCooldownLeft(leftMs > 0 ? Math.ceil(leftMs / 60000) : 0);
    };
    check();
    const t = setInterval(check, 30_000);
    return () => clearInterval(t);
  }, []);

  // Brand-colored wheel background
  const wheelBackground = useMemo(() => {
    const colors = ["#7A1CF6", "#8E6CF8", "#7A1CF6", "#9CC2FF", "#7A1CF6", "#8E6CF8", "#7A1CF6", "#9CC2FF"];
    const n = SLICES.length;
    const step = 360 / n;
    let parts: string[] = [];
    for (let i = 0; i < n; i++) {
      const from = i * step;
      const to = (i + 1) * step;
      parts.push(`${colors[i % colors.length]} ${from}deg ${to}deg`);
    }
    return `conic-gradient(${parts.join(",")})`;
  }, []);

  // Weighted pick of slice index
  const pickSliceIndex = () => {
    const weights = SLICES.map((sym) => outcomeMap[sym].weight);
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < weights.length; i++) {
      if (r < weights[i]) return i;
      r -= weights[i];
    }
    return SLICES.length - 1;
  };

  // Spin
  const onSpin = () => {
    if (spinning) return;
    if (cooldownLeft > 0) return;

    const winIndex = pickSliceIndex();
    const n = SLICES.length;
    const step = 360 / n;
    const sliceCenterFromTop = winIndex * step + step / 2;

    const extra = 360 * (5 + Math.floor(Math.random() * 3)); // 5–7 spins
    const target = -(extra + sliceCenterFromTop); // spin clockwise under pointer

    setResultLabel(null);
    setResultLink(undefined);
    setSpinning(true);
    setRotation((prev) => prev + target);
  };

  // End of spin: compute result, set cooldown, maybe open link
  const onTransitionEnd = () => {
    setSpinning(false);

    // Normalize current angle to [0, 360)
    const angle = ((rotation % 360) + 360) % 360;
    const n = SLICES.length;
    const step = 360 / n;

    // Pointer is at 0deg. Because we spun NEGATIVE, index is:
    const index = Math.floor((360 - angle) / step) % n;

    const sym = SLICES[index] as SliceSymbol;
    const outcome = outcomeMap[sym];

    setResultLabel(outcome.label);

    if (outcome.kind === "bonus") {
      // 👉 random casino affiliate link
      setResultLink(randomAffiliateLink());
    } else if (outcome.kind === "stars") {
      setResultLink(undefined); // integrate Stars claim flow later
    } else {
      setResultLink(undefined);
    }

    localStorage.setItem(cooldownKey(), String(Date.now()));
    setCooldownLeft(COOLDOWN_HOURS * 60); // minutes
  };

  // Cooldown display
  const cooldownText = useMemo(() => {
    if (cooldownLeft <= 0) return "";
    const h = Math.floor(cooldownLeft / 60);
    const m = cooldownLeft % 60;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  }, [cooldownLeft]);

  /* ---------------------------------- Render ---------------------------------- */

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-200 via-purple-100 to-blue-200 p-6 flex flex-col">
      {/* Follow X */}
      <div className="flex justify-center items-center mb-6">
        <a
          href="https://x.com/FreeSpins2025"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 text-gray-800 hover:text-black"
        >
          <Image src="/logos/x.webp" alt="X" width={20} height={20} />
          <span>Follow us on X</span>
        </a>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
        FreeSpins.Casino Offers Index <span className="text-purple-600 text-sm">v1.0</span>
      </h1>
      <p className="text-center text-gray-700 mb-6">
        Live list of the best crypto-casino free spins we track. We verify T&Cs and local rules before listing.
      </p>

      {/* Tabs */}
      <div className="mx-auto w-full max-w-4xl mb-5">
        <div className="grid grid-cols-4 rounded-xl overflow-hidden border border-purple-200 bg-white shadow-sm">
          {[
            { key: "offers", label: "Offers" },
            { key: "reviews", label: "Reviews" },
            { key: "guides", label: "Guides" },
            { key: "dailyspin", label: "🎡 Daily Spin" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key as TabKey)}
              className={`py-3 text-sm font-semibold transition ${
                active === (t.key as TabKey)
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-700 hover:bg-purple-50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Panels */}
      <div className="w-full max-w-4xl mx-auto flex-1">
        {/* OFFERS */}
        {active === "offers" && (
          <div className="space-y-4">
            {sortedCasinos.map((c) => (
              <div
                key={c.id}
                className={`relative grid grid-cols-[72px_1fr] sm:grid-cols-[72px_1fr_auto] items-center gap-4 bg-white rounded-xl shadow-md p-5 ${
                  c.topPick ? "border-2 border-green-400 shadow-green-200" : ""
                }`}
              >
                {c.topPick && (
                  <div className="absolute -top-3 left-4 bg-white px-2 py-0.5 rounded-full text-green-600 text-sm font-semibold shadow">
                    ✨ Top Pick
                  </div>
                )}
                <div className="flex items-start">
                  <Image src={c.logo} alt={c.name} width={56} height={56} className="rounded-md" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold">{c.name}</h2>
                    {c.label && (
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          c.label === "NEW" ? "bg-purple-100 text-purple-600" : "bg-red-100 text-red-600"
                        }`}
                      >
                        {c.label}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mt-0.5">{c.offer}</p>
                  <p className="text-xs text-gray-400">Deposit required</p>
                  <div className="flex items-center gap-2 mt-2">
                    {c.cryptos.map((crypto, i) => (
                      <Image key={i} src={crypto} alt="crypto" width={20} height={20} />
                    ))}
                    <span className="text-xs text-gray-500">+ More</span>
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-1 sm:justify-self-end w-full">
                  <a
                    href={c.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center w-full sm:w-auto sm:min-w-[220px] rounded-xl bg-[#7A1CF6] hover:bg-[#6a15dc] text-white text-[16px] font-extrabold leading-none px-5 py-3 shadow-[0_6px_14px_rgba(122,28,246,0.35)] active:scale-[.98] transition"
                  >
                    Claim Bonus!
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* REVIEWS */}
        {active === "reviews" && (
          <div className="space-y-4">
            {casinos.map((c) => (
              <div key={c.id} className="grid grid-cols-[56px_1fr_auto] items-center gap-4 bg-white rounded-xl shadow-md p-5">
                <Image src={c.logo} alt={c.name} width={56} height={56} className="rounded-md" />
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900">{c.name}</h3>
                  <p className="text-sm text-gray-600 truncate">Read our {c.name} review here</p>
                </div>
                <a
                  href={c.reviewUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-semibold px-4 py-2 transition whitespace-nowrap"
                >
                  Read review
                </a>
              </div>
            ))}
          </div>
        )}

        {/* GUIDES — full-width image card with text underneath */}
        {active === "guides" && (
          <div className="space-y-6">
            {guides.map((g) => (
              <a
                key={g.id}
                href={g.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <div className="relative w-full aspect-[16/9]">
                  <Image src={g.img} alt={g.title} fill className="object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900">{g.title}</h3>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="text-sm text-gray-600">Read the full guide →</p>
                    <span className="inline-flex items-center justify-center rounded-lg bg-purple-600 text-white text-sm font-semibold px-4 py-2 hover:bg-purple-700 transition">
                      Open
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* DAILY SPIN */}
        {active === "dailyspin" && (
          <div className="flex flex-col items-center gap-6">
            {/* Wheel container */}
            <div className="relative">
              {/* Pointer */}
              <div
                className="absolute left-1/2 -translate-x-1/2 -top-3 w-0 h-0"
                aria-hidden
                style={{
                  borderLeft: "12px solid transparent",
                  borderRight: "12px solid transparent",
                  borderBottom: "16px solid #F7C948",
                }}
              />
              {/* Wheel */}
              <div
                ref={wheelRef}
                onTransitionEnd={onTransitionEnd}
                className="w-64 h-64 sm:w-72 sm:h-72 rounded-full shadow-xl border-[10px] border-white flex items-center justify-center select-none"
                style={{
                  background: wheelBackground,
                  transition: spinning ? "transform 3s cubic-bezier(0.15, 0.9, 0.25, 1)" : undefined,
                  transform: `rotate(${rotation}deg)`,
                }}
              >
                {/* Emoji labels in each slice */}
                {SLICES.map((sym, i) => {
                  const step = 360 / SLICES.length;
                  const angle = i * step + step / 2;
                  return (
                    <div
                      key={i}
                      className="absolute text-white text-xl sm:text-2xl font-black drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]"
                      style={{
                        transform: `rotate(${angle}deg) translate(0, -95px) rotate(${-angle}deg)`,
                      }}
                    >
                      {sym}
                    </div>
                  );
                })}
                <div className="absolute w-4 h-4 rounded-full bg-white shadow" />
              </div>
            </div>

            {/* Spin button & cooldown */}
            <div className="flex items-center gap-3">
              <button
                onClick={onSpin}
                disabled={spinning || cooldownLeft > 0}
                className="rounded-lg bg-purple-600 text-white px-6 py-3 font-bold hover:bg-purple-700 disabled:opacity-50"
              >
                {spinning ? "Spinning..." : cooldownLeft > 0 ? `Come back in ${cooldownText}` : "Spin Now"}
              </button>
            </div>

            {/* Result */}
            {resultLabel && (
              <div className="mt-2 text-center">
                <p className="font-semibold text-lg">{resultLabel}</p>
                {resultLink && (
                  <a
                    href={resultLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 rounded-lg bg-purple-600 text-white px-4 py-2 text-sm font-semibold hover:bg-purple-700"
                  >
                    Claim →
                  </a>
                )}
              </div>
            )}

            <p className="text-xs text-gray-500 mt-2">
              Spin now for your chance to win free spins bonuses, or Telegram Stars! One spin per day per device (local). In Telegram, cooldown scopes to the signed-in user.
            </p>
          </div>
        )}
      </div>

      {/* Disclaimer / T&Cs */}
      <footer className="text-center text-xs text-gray-500 mt-8 max-w-4xl mx-auto">
        <p>
          This app promotes online gambling services intended for adults aged 18+ only. Gambling may be restricted in your
          region — please check local laws before participating. Play responsibly and seek help if needed. For free
          support, visit{" "}
          <a href="https://www.begambleaware.org" target="_blank" rel="noopener noreferrer" className="underline">
            BeGambleAware
          </a>{" "}
          or{" "}
          <a href="https://www.gamblingtherapy.org" target="_blank" rel="noopener noreferrer" className="underline">
            Gambling Therapy
          </a>
          . The “Claim Bonus!” buttons are affiliate links — we may earn a commission if you sign up or deposit.
        </p>
      </footer>

      <Analytics />
    </div>
  );
}
