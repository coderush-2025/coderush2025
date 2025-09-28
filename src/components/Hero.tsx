"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import Image from "next/image";

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Remove typewriter effect - now using image instead of text

    // Morphing background with multiple gradients
    const gradients = [
      "linear-gradient(135deg, #0e243f 0%, #204168 50%, #37c2cc 100%)",
      "linear-gradient(225deg, #37c2cc 0%, #0e243f 50%, #204168 100%)",
      "linear-gradient(315deg, #204168 0%, #37c2cc 50%, #0e243f 100%)",
      "radial-gradient(circle, #0e243f 0%, #204168 50%, #37c2cc 100%)",
    ];

    let gradientIndex = 0;
    const changeGradient = () => {
      if (backgroundRef.current) {
        gsap.to(backgroundRef.current, {
          background: gradients[gradientIndex],
          duration: 3,
          ease: "power2.inOut",
          onComplete: () => {
            gradientIndex = (gradientIndex + 1) % gradients.length;
            changeGradient();
          },
        });
      }
    };
    changeGradient();

    // Liquid bubble animations
    const bubbles = document.querySelectorAll(".liquid-bubble");
    bubbles.forEach((bubble, index) => {
      // Random floating motion
      gsap.to(bubble, {
        x: `random(-100, 100)`,
        y: `random(-80, 80)`,
        scale: `random(0.8, 1.3)`,
        duration: `random(4, 8)`,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: index * 0.5,
      });

      // Pulsing effect
      gsap.to(bubble, {
        opacity: `random(0.3, 0.8)`,
        duration: `random(2, 4)`,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
        delay: index * 0.3,
      });
    });
  }, []);

  return (
    <div
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated Background */}
      <div
        ref={backgroundRef}
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #0e243f 0%, #204168 50%, #37c2cc 100%)",
        }}
      />

      {/* Liquid Bubble Animation */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1200 800"
      >
        <defs>
          <radialGradient id="bubbleGradient1" cx="30%" cy="30%">
            <stop offset="0%" stopColor="#37c2cc" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#204168" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0e243f" stopOpacity="0.1" />
          </radialGradient>
          <radialGradient id="bubbleGradient2" cx="70%" cy="70%">
            <stop offset="0%" stopColor="#37c2cc" stopOpacity="0.6" />
            <stop offset="60%" stopColor="#204168" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0e243f" stopOpacity="0.05" />
          </radialGradient>
          <radialGradient id="bubbleGradient3" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#37c2cc" stopOpacity="0.7" />
            <stop offset="80%" stopColor="#204168" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0e243f" stopOpacity="0.02" />
          </radialGradient>
          <filter id="liquidBlur">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Large Liquid Bubbles */}
        <circle
          className="liquid-bubble"
          cx="200"
          cy="150"
          r="80"
          fill="url(#bubbleGradient1)"
          filter="url(#liquidBlur)"
          opacity="0.6"
        />
        <circle
          className="liquid-bubble"
          cx="1000"
          cy="200"
          r="60"
          fill="url(#bubbleGradient2)"
          filter="url(#liquidBlur)"
          opacity="0.5"
        />
        <circle
          className="liquid-bubble"
          cx="150"
          cy="600"
          r="70"
          fill="url(#bubbleGradient3)"
          filter="url(#liquidBlur)"
          opacity="0.4"
        />
        <circle
          className="liquid-bubble"
          cx="950"
          cy="550"
          r="50"
          fill="url(#bubbleGradient1)"
          filter="url(#liquidBlur)"
          opacity="0.5"
        />

        {/* Medium Liquid Bubbles */}
        <circle
          className="liquid-bubble"
          cx="400"
          cy="100"
          r="40"
          fill="url(#bubbleGradient2)"
          filter="url(#liquidBlur)"
          opacity="0.4"
        />
        <circle
          className="liquid-bubble"
          cx="800"
          cy="400"
          r="35"
          fill="url(#bubbleGradient3)"
          filter="url(#liquidBlur)"
          opacity="0.3"
        />
        <circle
          className="liquid-bubble"
          cx="300"
          cy="500"
          r="45"
          fill="url(#bubbleGradient1)"
          filter="url(#liquidBlur)"
          opacity="0.4"
        />
        <circle
          className="liquid-bubble"
          cx="700"
          cy="650"
          r="38"
          fill="url(#bubbleGradient2)"
          filter="url(#liquidBlur)"
          opacity="0.3"
        />

        {/* Small Liquid Bubbles */}
        <circle
          className="liquid-bubble"
          cx="600"
          cy="250"
          r="25"
          fill="url(#bubbleGradient3)"
          filter="url(#liquidBlur)"
          opacity="0.3"
        />
        <circle
          className="liquid-bubble"
          cx="500"
          cy="700"
          r="20"
          fill="url(#bubbleGradient1)"
          filter="url(#liquidBlur)"
          opacity="0.2"
        />
        <circle
          className="liquid-bubble"
          cx="900"
          cy="100"
          r="30"
          fill="url(#bubbleGradient2)"
          filter="url(#liquidBlur)"
          opacity="0.3"
        />
        <circle
          className="liquid-bubble"
          cx="100"
          cy="350"
          r="28"
          fill="url(#bubbleGradient3)"
          filter="url(#liquidBlur)"
          opacity="0.2"
        />
      </svg>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center text-white px-4">
        <motion.div
          ref={logoRef}
          className="mb-8"
          initial={{ opacity: 0, scale: 0.5, rotateX: -90 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{
            duration: 1.5,
            ease: "easeOut",
            type: "spring",
            stiffness: 100,
          }}
        >
          <Image
            src="/Coderush.png"
            alt="CodeRush 2025"
            width={8000}
            height={4000}
            className="w-auto h-auto max-w-full"
            priority
          />
        </motion.div>
        <motion.p
          className="text-xl md:text-3xl mb-8 max-w-2xl font-light tracking-wide leading-relaxed"
          style={{
            background:
              "linear-gradient(135deg, #ffffff 0%, #37c2cc 50%, #ffffff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "0 0 20px rgba(55, 194, 204, 0.3)",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
          initial={{ opacity: 0, y: 50, skewX: -10 }}
          animate={{ opacity: 1, y: 0, skewX: 0 }}
          transition={{
            duration: 1,
            delay: 1,
            ease: "easeOut",
          }}
        >
          The Ultimate Hackathon Competition
        </motion.p>
        <motion.button
          className="px-10 py-5 bg-gradient-to-r from-[#37c2cc] to-[#2ba8b3] text-[#0e243f] font-bold text-lg rounded-xl border-2 border-[#37c2cc] shadow-lg hover:shadow-2xl transition-all duration-500 relative overflow-hidden group"
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: "0.5px",
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          whileHover={{
            scale: 1.05,
            boxShadow:
              "0 0 40px rgba(55, 194, 204, 0.6), 0 0 80px rgba(55, 194, 204, 0.3)",
          }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="relative z-10 group-hover:text-white transition-colors duration-300">
            Join the Rush
          </span>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-[#0e243f] via-[#204168] to-[#0e243f] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            initial={{ x: "-100%" }}
            whileHover={{ x: "0%" }}
            transition={{ duration: 0.6 }}
          />
          <motion.div
            className="absolute inset-0 border-2 border-transparent group-hover:border-[#37c2cc] rounded-xl"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      </div>
    </div>
  );
};

export default Hero;
