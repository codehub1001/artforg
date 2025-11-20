import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation(); // For active link detection

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Explore", path: "/explore" },
    { name: "Drops", path: "/drops" },
    { name: "Marketplace", path: "/marketplace" },
    { name: "About Us", path: "/about" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md shadow-md border-b border-gray-700 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo with gradient / neon effect */}
        <Link
          to="/"
          className="text-2xl md:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 hover:scale-105 transform transition"
        >
          Artforg
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-medium transition-all duration-200 relative ${
                isActive(link.path)
                  ? "text-pink-500 after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-pink-500"
                  : "text-white hover:text-pink-400"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/signin"
            className="px-6 py-2 border border-gray-600 rounded-full text-white hover:bg-gray-800 transition font-medium"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full hover:from-purple-500 hover:to-pink-500 transition font-medium"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white focus:outline-none"
        >
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black/90 shadow-lg border-t border-gray-700 animate-slideDown">
          <nav className="flex flex-col space-y-3 px-6 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`font-medium text-white hover:text-pink-400 transition ${
                  isActive(link.path) ? "text-pink-500" : ""
                }`}
              >
                {link.name}
              </Link>
            ))}

            <Link
              to="/signin"
              onClick={() => setMenuOpen(false)}
              className="w-full text-center px-6 py-2 border border-gray-600 rounded-full hover:bg-gray-800 font-medium"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              onClick={() => setMenuOpen(false)}
              className="w-full text-center px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full hover:from-purple-500 hover:to-pink-500 font-medium"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      )}

      {/* Animations */}
      <style>
        {`
          @keyframes slideDown {
            0% { opacity: 0; transform: translateY(-20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-slideDown {
            animation: slideDown 0.3s ease forwards;
          }
        `}
      </style>
    </header>
  );
}
