import React from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-tr from-gray-900 via-indigo-900 to-purple-900 text-white overflow-hidden">
      {/* Neon glowing shapes */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 flex flex-col-reverse md:flex-row items-center justify-between gap-y-12">
        {/* Hero Text */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 drop-shadow-lg text-gradient animate-fade-in-up">
            Explore, Collect & Showcase <br /> Rare Digital Art
          </h1>

          <p className="text-lg md:text-xl text-white/80 mb-8 animate-fade-in-up delay-200">
            Dive into the world of NFTs — find unique pieces, bid in auctions, and connect with artists in a vibrant digital marketplace.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-fade-in-up delay-400">
            <Link
              to="/signup"
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-full shadow-lg transform hover:scale-105 transition duration-300"
            >
              Get Started
            </Link>
            <Link
              to="/explore"
              className="px-8 py-3 border border-white text-white font-semibold rounded-full hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:text-white transition duration-300"
            >
              Explore NFTs
            </Link>
          </div>

          <div className="mt-12 text-white/70 animate-fade-in-up delay-600">
            <h2 className="font-semibold text-lg mb-2">How It Works</h2>
            <ul className="space-y-2 text-base">
              <li>1️⃣ Sign up for free</li>
              <li>2️⃣ Connect your wallet</li>
              <li>3️⃣ Discover, buy or sell NFTs</li>
            </ul>
          </div>
        </div>

        {/* NFT Image */}
        <div className="md:w-1/2 flex justify-center md:justify-end">
          <div className="relative w-80 h-80 md:w-96 md:h-96 rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition duration-500 animate-float border-2 border-purple-500/50">
            <img
              src="https://picsum.photos/500/500?random=20"
              alt="Featured NFT"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 mix-blend-multiply" />
            <div className="absolute bottom-4 left-4 px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg">
              <span className="text-sm font-semibold text-white">Featured NFT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fadeInUp 1s ease forwards;
          }

          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
          }
          .animate-float {
            animation: float 4s ease-in-out infinite;
          }

          .text-gradient {
            background: linear-gradient(90deg, #ff4dff, #7f00ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        `}
      </style>
    </section>
  );
}
