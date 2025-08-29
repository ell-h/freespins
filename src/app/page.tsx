"use client";

import Image from "next/image";
import { useState } from "react";
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
  // Ensure BitStarz (topPick) is always first
  const sortedCasinos = [...casinos].sort((a, b) => (b.topPick ? 1 : 0) - (a.topPick ? 1 : 0));

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-200 via-purple-100 to-blue-200 p-6">
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
      <div className="space-y-4 max-w-3xl mx-auto">
        {sortedCasinos.map((c) => (
          <div
            key={c.id}
            className={`relative flex items-center justify-between bg-white rounded-xl shadow-md p-5 ${
              c.topPick ? "border-2 border-green-400 shadow-green-200" : ""
            }`}
          >
            {/* Logo + Info */}
            <div className="flex items-center space-x-4">
              <Image src={c.logo} alt={c.name} width={50} height={50} className="rounded-md" />
              <div>
                <div className="flex items-center space-x-2">
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

            {/* Claim Bonus Button */}
            <a
              href={c.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md whitespace-nowrap"
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

      <Analytics />
    </div>
  );
}
