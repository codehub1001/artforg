import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="min-h-screen w-full bg-black flex items-center justify-center px-6 py-20 relative overflow-hidden">

      {/* FLOATING PARTICLES */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-2 h-2 bg-purple-500 rounded-full blur-sm opacity-60"
            initial={{ y: "100vh", x: Math.random() * window.innerWidth }}
            animate={{ y: -20 }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.4,
            }}
          />
        ))}
      </div>

      {/* SIGNUP CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="w-full max-w-md bg-black/40 border border-purple-600/40 backdrop-blur-xl
        rounded-2xl p-8 shadow-2xl shadow-purple-900/50"
      >

        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-extrabold text-center text-purple-400 tracking-wide mb-6"
        >
          Create Account
        </motion.h2>

        <p className="text-gray-400 text-center mb-8">
          Join the Web3 NFT revolution and start collecting unique digital art.
        </p>

        {/* FORM */}
        <div className="space-y-6">
          {/* First Name */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="text-gray-300 text-sm">First Name</label>
            <input
              type="text"
              className="w-full mt-1 p-3 rounded-xl bg-black/60 border border-purple-700/40 
              focus:border-purple-500 focus:outline-none text-white"
              placeholder="Enter first name"
            />
          </motion.div>

          {/* Last Name */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="text-gray-300 text-sm">Last Name</label>
            <input
              type="text"
              className="w-full mt-1 p-3 rounded-xl bg-black/60 border border-purple-700/40 
              focus:border-purple-500 focus:outline-none text-white"
              placeholder="Enter last name"
            />
          </motion.div>

          {/* Username */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label className="text-gray-300 text-sm">Username</label>
            <input
              type="text"
              className="w-full mt-1 p-3 rounded-xl bg-black/60 border border-purple-700/40 
              focus:border-purple-500 focus:outline-none text-white"
              placeholder="Choose a username"
            />
          </motion.div>

          {/* Email */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label className="text-gray-300 text-sm">Email</label>
            <input
              type="email"
              className="w-full mt-1 p-3 rounded-xl bg-black/60 border border-purple-700/40 
              focus:border-purple-500 focus:outline-none text-white"
              placeholder="Enter your email"
            />
          </motion.div>

          {/* Password with toggle */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="relative"
          >
            <label className="text-gray-300 text-sm">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full mt-1 p-3 pr-12 rounded-xl bg-black/60 border border-purple-700/40 
              focus:border-purple-500 focus:outline-none text-white"
              placeholder="Enter a password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 text-purple-400 hover:text-purple-300"
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </motion.div>

          {/* Signup button */}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px #a855f7" }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-xl 
            text-white font-semibold tracking-wide shadow-lg shadow-purple-800/50 mt-4"
          >
            Sign Up
          </motion.button>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{" "}
          <span className="text-purple-400 cursor-pointer hover:underline">Sign In</span>
        </p>
      </motion.div>
    </section>
  );
}
