import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaHome, FaSearch, FaGift, FaStore, FaInfoCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/", icon: <FaHome className="inline mr-2" /> },
    { name: "Explore", path: "/explore", icon: <FaSearch className="inline mr-2" /> },
    { name: "Drops", path: "/drops", icon: <FaGift className="inline mr-2" /> },
    { name: "Marketplace", path: "/marketplace", icon: <FaStore className="inline mr-2" /> },
    { name: "About Us", path: "/about", icon: <FaInfoCircle className="inline mr-2" /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/90 backdrop-blur-md shadow-md border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Link
            to="/"
            className="text-2xl md:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500"
          >
            Artforg
          </Link>
        </motion.div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link, i) => (
            <motion.div
              key={link.path}
              whileHover={{ y: -2, color: "#ec4899" }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
            >
              <Link
                to={link.path}
                className={`flex items-center font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? "text-pink-500 after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-pink-500"
                    : "text-white hover:text-pink-400"
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
            <Link
              to="/signin"
              className="px-6 py-2 border border-gray-600 rounded-full text-white font-medium"
            >
              Sign In
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
            <Link
              to="/signup"
              className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-medium"
            >
              Sign Up
            </Link>
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white focus:outline-none"
          whileTap={{ scale: 0.9, rotate: 90 }}
        >
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden w-full bg-black/95 border-t border-gray-700"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex flex-col space-y-3 px-6 py-4">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  whileHover={{ x: 5, color: "#ec4899" }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center font-medium text-white hover:text-pink-400 ${
                      isActive(link.path) ? "text-pink-500" : ""
                    }`}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link
                  to="/signin"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-center px-6 py-2 border border-gray-600 rounded-full text-white font-medium"
                >
                  Sign In
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-center px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-medium"
                >
                  Sign Up
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
