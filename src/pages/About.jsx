import React from "react";
import { motion } from "framer-motion";
import { FaHive } from "react-icons/fa";

export default function About() {
  return (
    <section className="w-full bg-black text-white py-20 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT TEXT SECTION */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="space-y-6"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold flex items-center gap-3">
            <FaHive className="text-purple-400" size={40} />
            About Artonhive
          </h2>

          <p className="text-gray-300 leading-relaxed">
            At <span className="text-purple-400 font-semibold">Artonhive</span>,
            we are passionate about bringing the world of digital art to life using blockchain technology. 
            Our platform is a gateway for artists, collectors, and enthusiasts to explore, create, and trade unique digital 
            assets known as <span className="text-purple-400 font-semibold">NFTs</span>.
          </p>

          <p className="text-gray-300 leading-relaxed">
            Whether you're an artist showcasing your talent, a collector seeking rare artwork, or an NFT enthusiast, 
            Artonhive welcomes you to join our vibrant and growing community.
          </p>

          <h3 className="text-3xl font-bold text-purple-400 mt-6">Our Mission</h3>

          <p className="text-gray-300 leading-relaxed">
            Our mission is to empower artists and creators by fostering a decentralized and inclusive digital art ecosystem. 
            Through NFT technology, we enable artists to express themselves freely and provide audiences with verified, 
            limited-edition artworks.
          </p>
        </motion.div>

        {/* RIGHT IMAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex justify-center md:justify-end"
        >
<img
  src="https://images.pexels.com/photos/5980865/pexels-photo-5980865.jpeg?auto=compress&cs=tinysrgb&w=800"
  alt="NFT Art"
  className="w-64 md:w-80 rounded-3xl shadow-lg shadow-purple-500/30 border border-purple-700/30"
/>




        </motion.div>

      </div>
    </section>
  );
}
