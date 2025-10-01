"use client";

import React from "react";
import { motion } from "framer-motion";
import { ParallaxScroll } from "../ui/parallax-scroll";

const galleryImages = [
  "/1.jpeg",
  "/10.jpeg", 
  "/3.jpeg",
  "/28.jpeg",
  "/5.jpeg",
  "/6.jpeg",
  "/7.jpeg", 
  "/8.jpeg",
  "/11.jpeg",
  "/14.jpeg", 
  "/20.jpeg",
  "/19.jpeg",
  "/12.jpeg",
  "/2.jpeg",
  "/9.jpeg", 
  "/16.jpeg",
  "/17.jpeg",
  "/18.jpeg", 
  "/15.jpeg",
  "/28.jpeg",
  "/21.jpeg",
  "/23.jpeg",
  "/24.jpeg", 
  "/25.jpeg",
  "/26.jpeg",
  "/27.jpeg",
  "/13.jpeg",
  "/4.jpeg",
  "/30.jpeg",
  "/31.jpeg",
  "/32.jpeg",
  "/33.jpeg",
  "/34.jpeg",
  "/35.jpeg",
  "/36.jpeg",
  "/37.jpeg",
  "/39.jpeg",
  "/40.jpeg",
];

const Memories = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 via-[#204168] to-[#37c2cc]">
      <div className="container mx-auto px-6 lg:px-20">
        <motion.h2
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-center mb-16 text-gradient bg-gradient-to-r from-[#0e243f] to-cyan-200 bg-clip-text text-transparent drop-shadow-lg leading-snug overflow-visible"
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Memories
        </motion.h2>
        <motion.div
                  className="text-center mb-12"
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <p className="text-lg sm:text-xl text-white  font-medium">
                    A collection of moments from our past events, showcasing the
                    energy, creativity, and community spirit that define CodeRush.
                  </p>
                </motion.div>

        {/* Parallax Scroll Gallery */}
        <ParallaxScroll images={galleryImages} />
        
        {/* Wobble Card Gallery */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
          {/* Large Featured Card */}
          

          

          {/* Wide Bottom Card */}
          
        </div>
      </div>
    </section>
  );
};

export default Memories;
