import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation(); // For active link detection

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Explore", path: "/explore" },
    { name: "About Us", path: "/about" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-md border-b border-gray-200 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold text-gray-900 tracking-tight">
          Artforg
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-medium transition-all duration-200 ${
                isActive(link.path)
                  ? "text-purple-600 border-b-2 border-purple-600 pb-1"
                  : "text-gray-700 hover:text-gray-900"
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
            className="px-6 py-2 border border-gray-300 rounded-full text-gray-900 hover:bg-gray-100 transition font-medium"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition font-medium"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700 focus:outline-none"
        >
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-200 animate-slideDown">
          <nav className="flex flex-col space-y-3 px-6 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`font-medium text-gray-700 hover:text-gray-900 transition ${
                  isActive(link.path) ? "text-purple-600" : ""
                }`}
              >
                {link.name}
              </Link>
            ))}

            <Link
              to="/signin"
              onClick={() => setMenuOpen(false)}
              className="w-full text-center px-6 py-2 border border-gray-300 rounded-full hover:bg-gray-100 font-medium"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              onClick={() => setMenuOpen(false)}
              className="w-full text-center px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 font-medium"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
