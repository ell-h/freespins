"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Analytics } from "@vercel/analytics/react";

/* ---------------------------------- DATA ---------------------------------- */

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
  details?: string[]; // 👈 new field for expanded info
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
    details: [
      "Launched: 2014",
      "License: Curaçao eGaming",
      "Deposit methods: Bitcoin, Ethereum, Litecoin, Dogecoin, credit cards, and more",
      "Withdrawal speed: Often within 10 minutes for crypto transactions",
      "Minimum deposit: €20 (or equivalent in crypto)",
      "Languages supported: Multiple, including English, Russian, and Japanese",
      "Key strength: Seamless support for both fiat and cryptocurrencies",
    ],
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
    details: [
      "Zero wagering requirements on all promotions",
      "Wheel of Winz welcome offer with cash prizes up to $10,000",
      "Thousands of slots from top providers like Pragmatic Play, NetEnt, and Play’n GO",
      "Live casino powered by Evolution Gaming and Pragmatic Play Live",
      "Instant crypto deposits and withdrawals",
      "Supports Bitcoin, Ethereum, Litecoin, Dogecoin, Tether (USDT), and more",
    ],
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
    details: [
      "Established in 2016 with Curaçao eGaming license",
      "Accepts Bitcoin, Ethereum, Tether, Dogecoin, and 20+ other cryptos",
      "Large slots library from top providers like NetEnt, Pragmatic Play, and Play’n GO",
      "Live casino powered by Evolution Gaming and Ezugi",
      "Multi-deposit welcome package with free spins bonuses",
      "Loyalty program with cashback, bonus points, and exclusive rewards",
    ],
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
    details: [
      "Established in 2021 with Curaçao eGaming license",
      "Accepts Bitcoin, Ethereum, Tether, Litecoin, Dogecoin, and more",
      "Casino Welcome Bonus: 225% up to three deposits + 225 free spins",
      "Wide slot variety from providers like NetEnt, Pragmatic Play, and Play’n GO",
      "Live casino powered by Evolution Gaming and Ezugi",
      "Cashback rewards and ongoing bitcoin bonuses for loyal players",
      "Fast withdrawals with blockchain confirmations",
    ],
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
    details: [
      "Welcome Bonus: 120% up to $5,000 + 75 free spins bonus",
      "Launched: 2022",
      "License: Curaçao eGaming",
      "Payments: BTC, ETH, LTC, USDT, BNB, XRP, DOGE, SOL, ADA, TRX, BCH, USDC, TON, more",
      "Minimum Deposit: $20 (or crypto equivalent)",
      "Withdrawal Time: Usually minutes, depending on blockchain confirmations",
      "Languages: English, Spanish, German, Japanese, Portuguese, Russian, more",
    ],
  },
];

type Guide = {
  id: number;
  title: string;
  url: string;
  img: string;
};

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

/* ---------------------------------- UI ---------------------------------- */

type TabKey = "offers" | "reviews" | "guides";

export default function Home() {
  const [active, setActive] = useState<TabKey>("offers");
  const [expanded, setExpanded] = useState<number | null>(null);

  const sortedCasinos = useMemo(() => {
    const arr = [...casinos];
    arr.sort((a, b) => (b.topPick ? 1 : 0) - (a.topPick ? 1 : 0));
    return arr;
  }, []);

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
        <div className="grid grid-cols-3 rounded-xl overflow-hidden border border-purple-200 bg-white shadow-sm">
          {[
            { key: "offers", label: "Offers" },
            { key: "reviews", label: "Reviews" },
            { key: "guides", label: "Guides" },
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
                onClick={() => setExpanded(expanded === c.id ? null : c.id)} // 👈 single click toggles
                className={`relative bg-white rounded-xl shadow-md p-5 cursor-pointer transition-all ${
                  c.topPick ? "border-2 border-green-400 shadow-green-200" : ""
                }`}
              >
                {expanded === c.id ? (
                  <div>
                    <h2 className="text-lg font-semibold mb-3">{c.name} – Details</h2>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                      {c.details?.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="grid grid-cols-[72px_1fr] sm:grid-cols-[72px_1fr_auto] items-center gap-4">
                    <Image src={c.logo} alt={c.name} width={56} height={56} className="rounded-md" />
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
                        onClick={(e) => e.stopPropagation()} // prevent toggle when pressing button
                        className="block text-center w-full sm:w-auto sm:min-w-[220px] rounded-xl bg-[#7A1CF6] hover:bg-[#6a15dc] text-white text-[16px] font-extrabold leading-none px-5 py-3 shadow-[0_6px_14px_rgba(122,28,246,0.35)] active:scale-[.98] transition"
                      >
                        Claim Bonus!
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* REVIEWS */}
        {active === "reviews" && (
          <div className="space-y-4">
            {casinos.map((c) => (
              <div
                key={c.id}
                className="grid grid-cols-[56px_1fr_auto] items-center gap-4 bg-white rounded-xl shadow-md p-5"
              >
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

        {/* GUIDES */}
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
                  <Image src={g.img} alt={g.title} fill className="object-cover" priority={false} />
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
      </div>

      {/* Disclaimer */}
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
