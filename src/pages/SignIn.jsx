import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Form state
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleLogin = async () => {
  const { email, password } = form;

  if (!email || !password) {
    toast.error("All fields are required");
    return;
  }

  try {
    setLoading(true);

    const res = await fetch("http://localhost:8000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.error(data.error || "Something went wrong");
      return;
    }

    toast.success("Login successful!");

    // Save token + userId + role
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.user.id);
    localStorage.setItem("role", data.user.role); // <--- added

    // Redirect depending on role
    setTimeout(() => {
      if (data.user.role === "ADMIN") {
        navigate("/admindashboard");   // <--- admin redirect
      } else {
        navigate("/userdashboard");    // <--- normal user redirect
      }
    }, 1000);

  } catch (err) {
    setLoading(false);
    toast.error("Network error");
  }
};


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

      {/* CARD */}
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
          className="text-4xl font-extrabold text-center text-purple-400 tracking-wide"
        >
          Welcome Back
        </motion.h2>

        <p className="text-gray-400 text-center mt-2 mb-8">
          Sign in to continue your NFT journey
        </p>

        {/* FORM */}
        <div className="space-y-6">

          {/* Email */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="text-gray-300 text-sm">Email</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded-xl bg-black/60 border border-purple-700/40 
              focus:border-purple-500 focus:outline-none text-white"
              placeholder="Enter your email"
            />
          </motion.div>

          {/* Password */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <label className="text-gray-300 text-sm">Password</label>

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={handleChange}
              className="w-full mt-1 p-3 pr-12 rounded-xl bg-black/60 border border-purple-700/40 
              focus:border-purple-500 focus:outline-none text-white"
              placeholder="Enter your password"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 text-purple-400 hover:text-purple-300"
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </motion.div>

          {/* Button */}
          <motion.button
            onClick={handleLogin}
            disabled={loading}
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px #a855f7" }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-xl 
            text-white font-semibold tracking-wide shadow-lg shadow-purple-800/50 mt-4 flex justify-center"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Sign In"
            )}
          </motion.button>

        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Don't have an account?{" "}
          <span className="text-purple-400 cursor-pointer hover:underline" onClick={() => navigate("/signup")}>Register</span>
        </p>

      </motion.div>
    </section>
  );
}
