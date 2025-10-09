"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Introduction() {
  const images = ["/1.jpeg", "/2.jpeg", "/3.jpeg", "/4.jpeg", "/5.jpeg", "/6.jpeg", "/7.jpeg", "/8.jpeg"];

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0e243f 0%, #204168 50%, #0e243f 100%)"
      }}
    >
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

          <div className="grid grid-cols-6 gap-2 mt-6 lg:absolute lg:top-0 lg:right-0 lg:w-4/5 lg:mt-0 lg:h-full">
            {images.slice(1, 8).map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.6 + i * 0.15, duration: 1, type: "spring", bounce: 0.4 }}
                className="relative group overflow-hidden rounded-3xl shadow-xl"
                whileHover={{ 
                  scale: 1.1, 
                  rotate: i % 2 === 0 ? 3 : -3,
                  zIndex: 30,
                  transition: { duration: 0.3 }
                }}
                style={{
                  gridColumn: i === 0 ? "span 3" : i === 1 ? "span 2" : i === 2 ? "span 1" : i === 3 ? "span 2" : i === 4 ? "span 2" : i === 5 ? "span 2" : "span 2",
                  gridRow: i === 0 ? "span 2" : i === 3 ? "span 2" : "span 1",
                  aspectRatio: i === 0 ? "16/10" : i === 3 ? "4/5" : "1/1",
                }}
              >
                <div className="relative h-full w-full">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#37c2cc] via-[#204168] to-[#37c2cc] rounded-3xl opacity-0 group-hover:opacity-80 transition-all duration-500 blur-md animate-pulse" />
                  <div className="relative h-full w-full rounded-3xl overflow-hidden border-3 border-white/30 group-hover:border-[#37c2cc]/80 transition-all duration-500 backdrop-blur-sm">
                    <Image 
                      src={src} 
                      alt={`CodeRush Memory ${i + 2}`} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e243f]/95 via-[#0e243f]/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-end p-4">
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileHover={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-center"
                      >
                        <span className="text-[#37c2cc] text-sm font-bold block">{["Innovation", "Teamwork", "Challenge", "Excellence", "Creativity", "Success", "Achievement"][i]}</span>
                        <span className="text-white/80 text-xs">CodeRush 2025</span>
                      </motion.div>
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
            
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mb-6"
              >
                <motion.h1
                  className="text-4xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#37c2cc] via-white to-[#37c2cc] mb-2"
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  style={{ backgroundSize: "200% 200%" }}
                >
                  CODERUSH
                </motion.h1>

                <motion.div
                  className="flex items-center gap-4 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                >
                  <h2 className="text-3xl sm:text-4xl font-bold text-[#37c2cc]">2025</h2>
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-[#37c2cc] to-transparent" />
                </motion.div>


              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 0.8 }}
                className="text-lg sm:text-xl lg:text-2xl text-white/90 font-light mb-6 leading-relaxed"
              >
                The ultimate <span className="text-[#37c2cc] font-semibold">24-hour coding challenge</span> by <span className="text-[#37c2cc] font-bold">INTECS</span>, Faculty of Information Technology
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8, duration: 0.8 }}
                className="space-y-5 text-white/80 text-base sm:text-lg leading-relaxed mb-8"
              >
                <p>A celebration of innovation, teamwork, and problem-solving. Join the brightest minds to push the limits of creativity and technology in this exciting coding marathon.</p>

                <div className="grid gap-3">
                  <motion.div
                    className="flex items-start gap-3 p-3 sm:p-4 bg-[#37c2cc]/10 border border-[#37c2cc]/20 rounded-xl"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="w-10 h-10 bg-[#37c2cc] rounded-full flex items-center justify-center text-white font-bold text-xs">24h</div>
                    <div className="flex-1">
                      <h3 className="text-[#37c2cc] font-semibold mb-1 text-sm sm:text-base">HackerRank Platform</h3>
                      <p className="text-xs sm:text-sm">24 hours of intensive coding challenges and innovation</p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-start gap-3 p-3 sm:p-4 bg-white/5 border border-white/20 rounded-xl"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="w-10 h-10 bg-white/80 text-[#0e243f] rounded-full flex items-center justify-center font-bold text-lg">💡</div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold mb-1 text-sm sm:text-base">Open to All Levels</h3>
                      <p className="text-xs sm:text-sm">Showcase your skills and learn from peers, whether you&apos;re a beginner or expert</p>
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
    </section>
  );
}
