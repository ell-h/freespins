"use client";

import Image from "next/image";
import { Analytics } from "@vercel/analytics/react";

const casinos = [
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
  },
  {
    id: 3,
    name: "1xBit.com",
    offer: "Up to 7 BTC + 250 Free Spins",
    wagering: "35x",
    link: "https://freespins.casino/1xbit",
    logo: "/logos/1xbit.jpg",
    cryptos: ["/logos/bitcoin.png", "/logos/eth.png", "/logos/usdt.png"],
  },
  {
    id: 4,
    name: "Bets.io",
    offer: "225% + 225 Free Spins",
    wagering: "35x",
    link: "https://freespins.casino/bets-io",
    logo: "/logos/betsio.png",
    cryptos: ["/logos/bitcoin.png", "/logos/eth.png", "/logos/solana.webp"],
  },
  {
    id: 5,
    name: "Wild.io",
    offer: "120% up to $5,000 + 75 Free Spins",
    wagering: "40x",
    link: "https://freespins.casino/wild-io",
    logo: "/logos/wildio.png",
    cryptos: ["/logos/bitcoin.png", "/logos/eth.png", "/logos/solana.webp", "/logos/usdt.png"],
  },
];

export default function Home() {
  // Ensure BitStarz is always at the top
  const sortedCasinos = [...casinos].sort((a, b) => (b.topPick ? 1 : 0) - (a.topPick ? 1 : 0));

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-200 via-purple-100 to-blue-200 p-6 flex flex-col">
      {/* Follow us on X */}
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

      {/* Casino Cards */}
      <div className="space-y-4 max-w-3xl mx-auto flex-1">
        {sortedCasinos.map((c) => (
          <div
            key={c.id}
            /* CHANGE: use 2-col grid so CTA is always aligned on the right */
            className={`relative grid grid-cols-[1fr_auto] items-center gap-4 bg-white rounded-xl shadow-md p-5 ${
              c.topPick ? "border-2 border-green-400 shadow-green-200" : "border border-neutral-200"
            }`}
          >
            {/* LEFT: Logo + Info */}
            <div className="flex items-center space-x-4 min-w-0">
              <Image src={c.logo} alt={c.name} width={50} height={50} className="rounded-md shrink-0" />
              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-semibold truncate">{c.name}</h2>
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
                <p className="text-sm text-gray-600">{c.offer}</p>
                <p className="text-xs text-gray-400">Deposit required</p>

                {/* Crypto Logos */}
                <div className="flex items-center space-x-2 mt-2">
                  {c.cryptos.map((crypto, i) => (
                    <Image key={i} src={crypto} alt="crypto" width={20} height={20} />
                  ))}
                  <span className="text-xs text-gray-500">+ More</span>
                </div>
              </div>
            </div>

            {/* RIGHT: Claim Bonus Button (fixed size, pinned right) */}
            <a
              href={c.link}
              target="_blank"
              rel="noopener noreferrer"
              className="justify-self-end inline-flex items-center justify-center h-12 w-44 rounded-xl
                         bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md whitespace-nowrap
                         active:scale-[.98] transition"
            >
              Claim Bonus!
            </a>

            {/* Top Pick Label */}
            {c.topPick && (
              <div className="absolute -top-3 left-4 bg-white px-2 py-0.5 rounded-full text-green-600 text-sm font-semibold shadow">
                ✨ Top Pick
              </div>
            )}
          </div>
        ))}
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
