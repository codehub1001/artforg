import React from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white overflow-hidden">
      {/* Decorative circles / shapes */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center justify-between">
        {/* Hero Text */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight drop-shadow-lg">
            Discover, Collect & Auction <br /> Amazing NFTs
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            Join ArtonHive today to explore unique digital collectibles, bid on the latest drops, and showcase your NFTs to the world.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link
              to="/signup"
              className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-full shadow-lg hover:scale-105 transform transition"
            >
              Create Account
            </Link>
            <Link
              to="/explore"
              className="px-8 py-3 border border-white text-white font-semibold rounded-full hover:bg-white hover:text-purple-600 transition"
            >
              Explore Marketplace
            </Link>
          </div>

          {/* How it works */}
          <div className="mt-12 text-white/80">
            <h2 className="font-semibold mb-2 text-lg">How it works</h2>
            <ul className="space-y-1 text-sm md:text-base">
              <li>1️⃣ Sign up for free</li>
              <li>2️⃣ Fund your wallet</li>
              <li>3️⃣ Buy, sell, or auction NFTs</li>
            </ul>
          </div>
        </div>

        {/* Hero Image / Placeholder */}
        <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center md:justify-end">
          <div className="w-80 h-80 bg-white/20 rounded-3xl shadow-2xl flex items-center justify-center">
            <span className="text-white/50">NFT Image/Video</span>
          </div>
        </div>
      </div>
    </section>
  );
}
