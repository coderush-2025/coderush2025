"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Introduction() {
  const [typedText, setTypedText] = useState("");
  const codeText = `function codeRush2025() {
  const event = {
    name: "CodeRush 2025",
    duration: "24 hours",
    platform: "HackerRank",
    participants: "Teams of 4"
  };

  return unleashYourPotential();
}`;

  useEffect(() => {
    let index = 0;
    let isDeleting = false;

    const interval = setInterval(() => {
      if (!isDeleting && index <= codeText.length) {
        setTypedText(codeText.slice(0, index));
        index++;
      } else if (!isDeleting && index > codeText.length) {
        setTimeout(() => {
          isDeleting = true;
        }, 2000);
      } else if (isDeleting && index > 0) {
        index--;
        setTypedText(codeText.slice(0, index));
      } else if (isDeleting && index === 0) {
        isDeleting = false;
        index = 0;
      }
    }, isDeleting ? 15 : 30);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const images = [
    "/4.jpeg",
    "/7.jpeg",
    "/18.jpeg",
    "/20.jpeg",
    "/34.jpeg",
    "/37.jpeg",
    "/31.jpeg",
    "/27.jpeg",
  ];

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden -mt-1"
      style={{
        background: "linear-gradient(180deg, #0e243f 0%, #204168 50%, #0e243f 100%)"
      }}
    >
      {/* Main Content */}
      <div className="relative z-10 w-full min-h-screen px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-stretch justify-center gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12 lg:mb-16">

            {/* Left Side - Code Editor (BLACK THEME) */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="w-full lg:w-1/2 flex flex-col"
            >
              <div className="bg-[#1e1e1e] border-2 border-[#37c2cc]/40 rounded-lg shadow-2xl overflow-hidden h-full flex flex-col">
                {/* Editor Header */}
                <div className="bg-[#2d2d30] border-b border-[#37c2cc]/30 px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <div className="flex gap-1.5 sm:gap-2">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-[#37c2cc] text-xs sm:text-sm font-mono">coderush2025.js</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-3">
                    <span className="text-white/40 text-xs font-mono">UTF-8</span>
                    <span className="text-white/40 text-xs font-mono">JavaScript</span>
                  </div>
                </div>

                {/* Code Content - BLACK BACKGROUND */}
                <div className="relative p-4 sm:p-6 lg:p-8 font-mono text-xs sm:text-sm lg:text-base bg-[#0a0a0a] flex-grow min-h-[280px] sm:min-h-[320px]">
                  <pre className="text-white/90 invisible">
                    <code>
                      {codeText.split('\n').map((line, i) => (
                        <div key={i} className="flex px-1 sm:px-2 -mx-1 sm:-mx-2 rounded">
                          <span className="text-[#37c2cc]/50 mr-3 sm:mr-4 lg:mr-6 select-none w-6 sm:w-8 text-right">{i + 1}</span>
                          <span className="text-white/90">{line}</span>
                        </div>
                      ))}
                    </code>
                  </pre>

                  <div className="absolute top-4 sm:top-6 lg:top-8 left-4 sm:left-6 lg:left-8 right-4 sm:right-6 lg:right-8">
                    <pre className="text-white/90 font-mono text-xs sm:text-sm lg:text-base">
                      <code>
                        {typedText.split('\n').map((line, i) => (
                          <div key={i} className="flex px-1 sm:px-2 -mx-1 sm:-mx-2 rounded">
                            <span className="text-[#37c2cc]/50 mr-3 sm:mr-4 lg:mr-6 select-none w-6 sm:w-8 text-right">{i + 1}</span>
                            <span className="text-white/90 break-all">{line}</span>
                          </div>
                        ))}
                        <motion.span
                          className="inline-block w-1.5 sm:w-2 h-4 sm:h-5 bg-[#37c2cc] ml-1"
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                        />
                      </code>
                    </pre>
                  </div>
                </div>

                {/* Terminal Section - BLACK */}
                <div className="bg-[#0a0a0a] border-t-2 border-[#37c2cc]/30 p-4 sm:p-5 lg:p-6 font-mono text-xs sm:text-sm flex-shrink-0">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <span className="text-[#37c2cc]">$</span>
                    <span className="text-white/80 break-all">node coderush2025.js</span>
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    className="text-green-400 flex items-center gap-2"
                  >
                    <span>✓</span>
                    <span>Ready to code!</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.5 }}
                    className="text-white/70 mt-1 sm:mt-2"
                  >
                    Event: CodeRush 2025 - 24h Hackathon
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Introduction Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="w-full lg:w-1/2 flex flex-col justify-center"
            >
              <div className="relative">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="mb-4 sm:mb-6"
                >
                  <motion.h1
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#37c2cc] via-white to-[#37c2cc] mb-2 leading-tight"
                    animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    style={{ backgroundSize: "200% 200%" }}
                  >
                    CODERUSH
                  </motion.h1>

                  <motion.div
                    className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                  >
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#37c2cc]">2025</h2>
                    <div className="flex-1 h-0.5 bg-gradient-to-r from-[#37c2cc] to-transparent" />
                  </motion.div>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6, duration: 0.8 }}
                  className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 font-light mb-4 sm:mb-6 leading-relaxed"
                >
                  The ultimate <span className="text-[#37c2cc] font-semibold">24-hour coding challenge</span> by <span className="text-[#37c2cc] font-bold">INTECS</span>, Faculty of Information Technology
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8, duration: 0.8 }}
                  className="space-y-3 sm:space-y-4 text-white/80 text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8"
                >
                  <p className="text-justify sm:text-left">A celebration of innovation, teamwork, and problem-solving. Join the brightest minds to push the limits of creativity and technology in this exciting coding marathon.</p>

                  <div className="space-y-2 sm:space-y-3">
                    <motion.div
                      className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-r from-[#204168]/60 to-transparent border-l-4 border-[#37c2cc] rounded-r-lg backdrop-blur-sm"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex-1">
                        <h3 className="text-[#37c2cc] font-semibold mb-1 text-sm sm:text-base font-mono">&gt; HackerRank Platform</h3>
                        <p className="text-xs sm:text-sm text-white/70">24 hours of intensive coding challenges and innovation</p>
                      </div>
                    </motion.div>

                    <motion.div
                      className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-r from-[#204168]/60 to-transparent border-l-4 border-[#37c2cc] rounded-r-lg backdrop-blur-sm"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex-1">
                        <h3 className="text-[#37c2cc] font-semibold mb-1 text-sm sm:text-base font-mono">&gt; Open to All Levels</h3>
                        <p className="text-xs sm:text-sm text-white/70">Showcase your skills and learn from peers, whether you&apos;re a beginner or expert</p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2, duration: 0.8 }}
                  className="flex justify-start"
                >
                  <motion.a
                    href="/register"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#37c2cc] to-[#2ba8b3] hover:from-[#2ba8b3] hover:to-[#37c2cc] text-[#0e243f] font-bold transition-all duration-300 text-base sm:text-lg rounded-xl shadow-lg w-full sm:w-auto text-center"
                  >
                    Register Your Team
                  </motion.a>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Horizontal Auto-Scrolling Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="relative w-full overflow-hidden"
          >
            {/* Gradient Overlays for fade effect */}
            <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-[#0e243f] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-[#0e243f] to-transparent z-10 pointer-events-none"></div>

            {/* Scrolling Container */}
            <motion.div
              className="flex gap-4 sm:gap-6"
              animate={{
                x: [0, -1920],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 30,
                  ease: "linear",
                },
              }}
            >
              {/* Double the images for seamless loop */}
              {[...images, ...images].map((src, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-64 sm:w-80 lg:w-96 h-48 sm:h-56 lg:h-64 rounded-lg overflow-hidden border-2 border-[#37c2cc]/30 shadow-lg"
                >
                  <Image
                    src={src}
                    alt={`CodeRush Event ${(index % images.length) + 1}`}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
