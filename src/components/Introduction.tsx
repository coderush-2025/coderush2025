"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Introduction() {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const images = ["/1.jpeg", "/2.jpeg", "/3.jpeg", "/4.jpeg", "/5.jpeg", "/6.jpeg", "/7.jpeg", "/8.jpeg"];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-[#0e243f] via-[#204168] to-[#37c2cc]"
          animate={{
            background: [
              "linear-gradient(135deg, #0e243f 0%, #204168 50%, #37c2cc 100%)",
              "linear-gradient(225deg, #37c2cc 0%, #0e243f 50%, #204168 100%)",
              "linear-gradient(315deg, #204168 0%, #37c2cc 50%, #0e243f 100%)",
              "radial-gradient(circle, #0e243f 0%, #204168 50%, #37c2cc 100%)",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(55, 194, 204, 0.4) 0%, transparent 60%)`,
        }}
      />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center min-h-screen px-6 py-12 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="flex-1 relative max-w-2xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative mb-8 lg:mb-0"
            whileHover={{ scale: 1.03, rotate: 1 }}
          >
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-[#37c2cc]/30 via-transparent to-[#204168]/20 z-10" />
              <Image src="/1.jpeg" alt="CodeRush 2025" width={600} height={400} className="w-full h-auto object-cover border-4 border-white/30 rounded-3xl" priority />
              <div className="absolute bottom-4 left-4 bg-[#0e243f]/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-[#37c2cc]/30">
                <span className="text-[#37c2cc] font-semibold text-sm">CodeRush 2025</span>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-4 gap-3 mt-6 lg:absolute lg:top-0 lg:right-0 lg:w-3/5 lg:mt-0">
            {images.slice(1, 8).map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.1, duration: 0.8 }}
                className="relative group aspect-square overflow-hidden rounded-2xl"
                whileHover={{ scale: 1.05, zIndex: 20 }}
                style={{
                  gridColumn: i === 0 ? "span 2" : "span 1",
                  gridRow: i === 3 ? "span 2" : "span 1",
                }}
              >
                <div className="relative h-full w-full">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#37c2cc] to-[#204168] rounded-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-300 blur-sm" />
                  <div className="relative h-full w-full rounded-2xl overflow-hidden border-2 border-white/20 group-hover:border-[#37c2cc]/50 transition-colors duration-300">
                    <Image src={src} alt={`CodeRush ${i + 2}`} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e243f]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                      <span className="text-white text-xs font-medium">{i % 2 === 0 ? "Day 01" : "Day 02"}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex-1 max-w-2xl"
        >
          <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 p-8 lg:p-12 rounded-3xl shadow-2xl">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#37c2cc]/10 to-[#204168]/10 blur-2xl" />
            
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mb-8"
              >
                <motion.h1
                  className="text-6xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#37c2cc] via-white to-[#37c2cc] mb-2"
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  style={{ backgroundSize: "200% 200%" }}
                >
                  CODERUSH
                </motion.h1>
                
                <motion.div
                  className="flex items-center gap-4 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                >
                  <h2 className="text-4xl lg:text-5xl font-bold text-[#37c2cc]">2K25</h2>
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-[#37c2cc] to-transparent" />
                </motion.div>
                

              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 0.8 }}
                className="text-2xl lg:text-3xl text-white/90 font-light mb-8 leading-relaxed"
              >
                Get ready for the <span className="text-[#37c2cc] font-semibold italic">ultimate coding showdown</span> at the Faculty of Information Technology!
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8, duration: 0.8 }}
                className="space-y-6 text-white/80 text-lg leading-relaxed mb-10"
              >
                <p>CodeRush is back with unprecedented excitement! Experience two thrilling rounds that will test your skills and creativity:</p>
                
                <div className="grid gap-4">
                  <motion.div
                    className="flex items-start gap-4 p-4 bg-[#37c2cc]/10 border border-[#37c2cc]/20 rounded-2xl"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="w-8 h-8 bg-[#37c2cc] rounded-full flex items-center justify-center text-white font-bold text-sm">01</div>
                    <div>
                      <h3 className="text-[#37c2cc] font-semibold mb-1">Day 01</h3>
                      <p className="text-sm">Fast-paced coding challenge powered by HackerRank</p>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    className="flex items-start gap-4 p-4 bg-white/5 border border-white/20 rounded-2xl"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="w-8 h-8 bg-white/80 text-[#0e243f] rounded-full flex items-center justify-center font-bold text-sm">02</div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Day 02</h3>
                      <p className="text-sm">Idea submission round - where creativity meets innovation </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05, borderColor: "#37c2cc", color: "#37c2cc" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-2xl transition-all duration-300 text-lg"
                >
                  Learn More
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-3"
        >
          <span className="text-sm font-light">Discover More</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-[#37c2cc] rounded-full mt-2"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
