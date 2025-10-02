"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Introduction() {
  const images = ["/1.jpeg", "/2.jpeg", "/3.jpeg", "/4.jpeg", "/5.jpeg", "/6.jpeg", "/7.jpeg", "/8.jpeg"];

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #37c2cc 100%)",
              "linear-gradient(225deg, #37c2cc 0%, #16213e 25%, #1a1a2e 50%, #0f3460 100%)",
              "linear-gradient(315deg, #0f3460 0%, #37c2cc 25%, #16213e 50%, #1a1a2e 100%)",
              "linear-gradient(45deg, #16213e 0%, #1a1a2e 25%, #37c2cc 50%, #0f3460 100%)",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Floating geometric shapes */}
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 bg-[#37c2cc]/10 rounded-full blur-xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div
          className="absolute top-1/3 right-32 w-24 h-24 bg-[#204168]/20 rounded-lg rotate-45 blur-lg"
          animate={{
            rotate: [45, 225, 45],
            scale: [1, 0.8, 1.2, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div
          className="absolute bottom-32 left-1/4 w-20 h-20 bg-[#37c2cc]/15 rounded-full blur-md"
          animate={{
            x: [0, -80, 0],
            y: [0, 40, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        
        <motion.div
          className="absolute top-1/2 left-1/2 w-40 h-40 bg-gradient-to-r from-[#37c2cc]/5 to-[#204168]/5 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.3, 0.9, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
      </div>

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
            
            {/* Additional decorative elements */}
            <motion.div
              className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-[#37c2cc]/20 to-[#204168]/20 rounded-full blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-r from-[#204168]/20 to-[#37c2cc]/20 rounded-full blur-lg"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
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
                Get ready for the <span className="text-[#37c2cc] font-semibold italic">ultimate 24-hour coding challenge</span> by Faculty of Information Technology <span className="text-[#37c2cc] font-bold">INTECS</span>!
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8, duration: 0.8 }}
                className="space-y-6 text-white/80 text-lg leading-relaxed mb-10"
              >
                <p>CodeRush 2025 is more than just a coding competition — it&apos;s a celebration of innovation, teamwork, and problem-solving. Bringing together the brightest minds from across the country, this event challenges participants to push the limits of creativity and technology.</p>
                
                <div className="grid gap-4">
                  <motion.div
                    className="flex items-start gap-4 p-4 bg-[#37c2cc]/10 border border-[#37c2cc]/20 rounded-2xl"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="w-10 h-10 bg-[#37c2cc] rounded-full flex items-center justify-center text-white font-bold">24h</div>
                    <div>
                      <h3 className="text-[#37c2cc] font-semibold mb-1">HackerRank Platform</h3>
                      <p className="text-sm">Intensive coding challenges over 24 hours of non-stop innovation</p>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    className="flex items-start gap-4 p-4 bg-white/5 border border-white/20 rounded-2xl"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="w-10 h-10 bg-white/80 text-[#0e243f] rounded-full flex items-center justify-center font-bold text-sm">💡</div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">For Everyone</h3>
                      <p className="text-sm">Whether you&apos;re a beginner or experienced coder, showcase your skills and learn from peers</p>
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
