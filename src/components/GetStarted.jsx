import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserAlt, FaWallet, FaUpload } from "react-icons/fa";

export default function GetStarted() {
  const steps = [
    {
      number: 1,
      title: "Setup Your Account",
      description: `Click "Sign Up," then fill out the necessary information and verify your account.`,
      icon: <FaUserAlt size={30} className="text-white" />,
    },
    {
      number: 2,
      title: "Fund Your Wallet",
      description: `To deposit into your Artforg wallet, click "Deposit," then select "Fund Wallet" to get an Ethereum address (copy it or scan the QR code). Send Ethereum to that address using your crypto wallet. After sending, take a screenshot of the transaction receipt and upload it under "Deposit Proof." Enter the amount sent and click "Send Request." Once processed, the funds will be added to your Artforg wallet, and you can start minting.`,
      icon: <FaWallet size={30} className="text-white" />,
    },
    {
      number: 3,
      title: "Add Your NFTs",
      description: `Upload your work, give it a price tag and then add a title.`,
      icon: <FaUpload size={30} className="text-white" />,
    },
  ];

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariant = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section className="relative bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white py-32 overflow-hidden">
      {/* Background shapes */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-extrabold mb-6 drop-shadow-lg"
        >
          Want to get started?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-lg md:text-xl text-white/80 mb-16"
        >
          Get on-the-go with Artforg by doing the following:
        </motion.p>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid md:grid-cols-3 gap-10"
        >
          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={cardVariant}
              whileHover={{ scale: 1.05, rotate: 1 }}
              className="relative bg-gradient-to-tr from-purple-700 via-indigo-800 to-blue-900 backdrop-blur-md rounded-3xl p-10 flex flex-col items-start text-left shadow-2xl cursor-pointer"
            >
              {/* Step number bubble */}
              <div className="absolute -top-5 -left-5 w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg animate-pulse">
                {step.number}
              </div>

              {/* Icon */}
              <div className="mb-4">{step.icon}</div>

              <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
              <p className="text-white/80">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16"
        >
          <Link
            to="/signup"
            className="px-12 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-full shadow-2xl hover:scale-105 transform transition duration-300 hover:shadow-3xl"
          >
            Get Started Now
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
