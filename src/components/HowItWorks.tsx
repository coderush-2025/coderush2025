"use client";

import { useRouter } from "next/navigation";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const HowItWorks = () => {
  const router = useRouter();
  const steps = [
    "CodeRush 2025 will be conducted entirely on the HackerRank platform.",
    "Each team must consist of four registered participants.",
    "Contest links and access instructions will be sent via email prior to the start of the competition.",
    "The hackathon will feature a series of programming challenges to be solved within a limited time.",
    "Scores will be calculated based on the correctness and speed of submissions.",
    "Top-performing teams will be officially recognized and awarded.",
  ];

  return (
    <section className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 overflow-hidden" style={{ background: "linear-gradient(180deg, #0e243f 0%, #204168 50%, #0e243f 100%)" }}>
      <div className="relative max-w-7xl mx-auto">
        {/* Title */}
        <motion.div
          className="text-center mb-10 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-3 sm:mb-4 tracking-wider px-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#37c2cc] via-white to-[#37c2cc] drop-shadow-lg">
              HOW IT WORKS
            </span>
          </h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-10 lg:gap-12">
          {/* Left side - How It Works illustration */}
          <motion.div
            className="w-full lg:w-2/5 flex justify-center"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative w-full max-w-lg">
              <Image
                src="/how it works.png"
                alt="How It Works"
                width={600}
                height={700}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </motion.div>

          {/* Right side - Steps */}
          <div className="w-full lg:w-3/5 space-y-4 sm:space-y-5 md:space-y-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-3 sm:gap-4 group"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  ease: "easeOut",
                }}
                whileHover={{ scale: 1.02, x: 10 }}
              >
                <div className="flex-shrink-0 mt-1.5">
                  <motion.div
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 bg-[#37c2cc] rounded-full shadow-lg shadow-[#37c2cc]/50"
                    whileHover={{ scale: 1.3, rotate: 360 }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                <p className="text-white text-sm sm:text-base md:text-base leading-relaxed font-medium group-hover:text-[#37c2cc] transition-colors duration-300">
                  {step}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA section */}
        <motion.div
          className="mt-12 sm:mt-14 md:mt-16 text-center px-4"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        >
          <motion.div
            className="inline-block bg-gradient-to-r from-[#37c2cc]/10 to-[#2ba8b3]/10 backdrop-blur-sm border border-[#37c2cc]/30 rounded-xl md:rounded-2xl p-6 sm:p-7 md:p-8 max-w-2xl w-full"
            whileHover={{ scale: 1.02, borderColor: "rgba(55, 194, 204, 0.6)" }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#37c2cc] mb-2 sm:mb-3">
              Ready to Join the Rush?
            </h3>
            <p className="text-gray-300 mb-5 sm:mb-6 max-w-lg mx-auto text-sm sm:text-base px-2">
              Gather your team of four and prepare for the ultimate coding
              challenge on HackerRank!
            </p>
            <motion.button
              onClick={() => router.push("/register")}
              className="bg-gradient-to-r from-[#37c2cc] to-[#2ba8b3] hover:from-[#2ba8b3] hover:to-[#37c2cc] text-[#0e243f] font-bold py-2.5 px-5 sm:py-3 sm:px-6 md:px-8 rounded-lg md:rounded-xl transition-all duration-300 text-sm sm:text-base"
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              Register Your Team
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-[#37c2cc] rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-20 w-1 h-1 bg-[#2ba8b3] rounded-full animate-pulse delay-1000"></div>
      <div className="absolute bottom-32 left-20 w-1.5 h-1.5 bg-[#37c2cc] rounded-full animate-pulse delay-500"></div>
      <div className="absolute bottom-20 right-32 w-2 h-2 bg-[#2ba8b3] rounded-full animate-pulse delay-700"></div>
    </section>
  );
};

export default HowItWorks;
