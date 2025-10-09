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
    <section className="py-12 sm:py-14 md:py-16" style={{ background: "linear-gradient(180deg, #0e243f 0%, #204168 50%, #0e243f 100%)" }}>
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-20">
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center mb-10 sm:mb-12 md:mb-16 text-gradient bg-gradient-to-r from-white via-[#37c2cc] to-white bg-clip-text text-transparent drop-shadow-lg leading-snug overflow-visible"
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Memories
        </motion.h2>
        <motion.div
                  className="text-center mb-8 sm:mb-10 md:mb-12"
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <p className="text-base sm:text-lg md:text-xl text-white font-medium px-4 max-w-3xl mx-auto">
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
