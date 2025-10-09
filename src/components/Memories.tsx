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
    <section className="py-16 sm:py-20 md:py-24 min-h-screen" style={{ background: "linear-gradient(180deg, #0e243f 0%, #204168 50%, #0e243f 100%)" }}>
      <div className="w-full max-w-full mx-auto px-2 sm:px-4 md:px-6">
        <motion.div
          className="text-center mb-10 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-3 sm:mb-4 tracking-wider px-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#37c2cc] to-white drop-shadow-lg">
              MEMORIES
            </span>
          </h2>
          <p className="text-gray-300 text-sm sm:text-base md:text-lg mt-3 sm:mt-4 px-4 max-w-4xl mx-auto">
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
