import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQ() {
  const faqs = [
    {
      question: "What is a non-fungible token (NFT)?",
      answer:
        "A non‑fungible token (NFT) is a cryptographic token that represents a unique asset. They function as verifiable proofs of authenticity and ownership within a blockchain network.",
    },
    {
      question: "What is Artonhive NFT Marketplace?",
      answer:
        "Artists, creators, and cryptocurrency enthusiasts come together on Artonhive NFT Marketplace to collectively create and trade premium NFTs.",
    },
    {
      question: "How do I create an NFT?",
      answer:
        "In order to upload your file, click Create. Right now, we support JPG and PNG files. Note that you cannot modify your NFT once created.",
    },
    {
      question: "How do I buy an NFT?",
      answer:
        "Select the Buy NFT option, find the artwork, and click the Buy button to complete the transaction. The NFT is transferred to your wallet once successful.",
    },
    {
      question: "How do I sell an NFT?",
      answer:
        "Our staff verify content suitability before approving your NFT for sale. This usually takes 1-3 hours after submission.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="relative overflow-hidden py-20 bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-800 text-white">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 cursor-pointer hover:bg-white/20 shadow-lg transition"
            >
              <div
                onClick={() => toggle(i)}
                className="flex justify-between items-center text-lg md:text-xl font-semibold"
              >
                <span>{faq.question}</span>
                <motion.span
                  animate={{ rotate: openIndex === i ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-pink-400 text-2xl font-bold"
                >
                  +
                </motion.span>
              </div>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mt-4 text-white/80 text-base md:text-lg"
                  >
                    {faq.answer}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating background circles */}
      <div className="absolute -top-32 -left-32 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
    </section>
  );
}
