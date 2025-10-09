"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);
  
  // Generate consistent bubble positions for SSR (responsive percentages)
  const bubblePositions = useRef([
    { x: 15, y: 20, scale: 0.8 },   // 15% from left, 20% from top
    { x: 60, y: 15, scale: 1.2 },   // 60% from left, 15% from top
    { x: 25, y: 60, scale: 1.0 },   // 25% from left, 60% from top
    { x: 80, y: 40, scale: 0.9 },   // 80% from left, 40% from top
    { x: 10, y: 70, scale: 1.1 },   // 10% from left, 70% from top
    { x: 70, y: 65, scale: 0.7 },   // 70% from left, 65% from top
    { x: 40, y: 30, scale: 1.3 },   // 40% from left, 30% from top
    { x: 55, y: 80, scale: 0.8 },   // 55% from left, 80% from top
    { x: 20, y: 35, scale: 1.0 },   // 20% from left, 35% from top
    { x: 85, y: 25, scale: 1.1 },   // 85% from left, 25% from top
    { x: 35, y: 50, scale: 0.9 },   // 35% from left, 50% from top
    { x: 65, y: 75, scale: 1.2 }    // 65% from left, 75% from top
  ]);

  useEffect(() => {
    // Set client-side flag to prevent hydration mismatch
    setIsClient(true);

    // Mouse and touch tracking for interactive bubbles
    const handleInteraction = (clientX: number, clientY: number) => {
      setMousePosition({ x: clientX, y: clientY });
      
      // Magnetic effect for bubbles near cursor/touch
      const bubbles = document.querySelectorAll('.liquid-bubble');
      bubbles.forEach((bubble) => {
        const rect = bubble.getBoundingClientRect();
        const bubbleCenterX = rect.left + rect.width / 2;
        const bubbleCenterY = rect.top + rect.height / 2;
        const distance = Math.sqrt(
          Math.pow(clientX - bubbleCenterX, 2) + Math.pow(clientY - bubbleCenterY, 2)
        );
        
        // Adjust interaction radius for mobile
        const interactionRadius = window.innerWidth < 768 ? 100 : 150;
        
        if (distance < interactionRadius) {
          const strength = (interactionRadius - distance) / interactionRadius;
          const moveX = (clientX - bubbleCenterX) * strength * 0.2;
          const moveY = (clientY - bubbleCenterY) * strength * 0.2;
          
          gsap.to(bubble, {
            x: moveX,
            y: moveY,
            scale: 1 + strength * 0.3,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleInteraction(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

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

    // Liquid bubble animations with responsive positioning
    setTimeout(() => {
      const bubbles = document.querySelectorAll(".liquid-bubble");
      bubbles.forEach((bubble, index) => {
        const position = bubblePositions.current[index];
        if (position) {
          const vw = window.innerWidth / 100;
          const vh = window.innerHeight / 100;
          
          // Consistent floating motion based on viewport units
          gsap.to(bubble, {
            x: position.x * vw + (index % 2 === 0 ? 3 * vw : -3 * vw),
            y: position.y * vh + (index % 3 === 0 ? -2 * vh : 2 * vh),
            scale: position.scale,
            duration: 4 + (index * 0.5),
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: index * 0.5,
          });

          // Pulsing effect with consistent timing
          gsap.to(bubble, {
            opacity: 0.3 + (index % 5) * 0.1,
            duration: 2 + (index % 3),
            ease: "power2.inOut",
            repeat: -1,
            yoyo: true,
            delay: index * 0.3,
          });
        }
      });
    }, 100);

    // Keyboard interaction - make bubbles dance on spacebar
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        const bubbles = document.querySelectorAll('.liquid-bubble');
        bubbles.forEach((bubble, index) => {
          gsap.to(bubble, {
            scale: 2,
            rotation: 720,
            y: -100,
            duration: 0.8,
            ease: "back.out(1.7)",
            yoyo: true,
            repeat: 1,
            delay: index * 0.1,
            onComplete: () => {
              gsap.set(bubble, { rotation: 0 });
            }
          });
        });
      }
    };

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <div
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden touch-none"
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

      {/* Mouse Cursor Trail Effect */}
      {isClient && (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <motion.div
            className="absolute w-4 h-4 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(55, 194, 204, 0.6) 0%, transparent 70%)',
              boxShadow: '0 0 20px rgba(55, 194, 204, 0.8)'
            }}
            animate={{
              x: mousePosition.x - 8,
              y: mousePosition.y - 8,
            }}
            transition={{
              duration: 0.1,
              ease: "easeOut"
            }}
          />
        </div>
      )}

      {/* Interactive Liquid Bubble Animation */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {isClient && [...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full liquid-bubble cursor-pointer"
            style={{
              width: `${30 + (i % 4) * 15}px`,
              height: `${30 + (i % 4) * 15}px`,
              background: `radial-gradient(circle at ${30 + (i % 3) * 20}% ${30 + (i % 3) * 20}%, 
                rgba(55, 194, 204, 0.8) 0%, 
                rgba(32, 65, 104, 0.4) 70%, 
                rgba(14, 36, 63, 0.1) 100%)`,
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(55, 194, 204, 0.3)',
              boxShadow: '0 0 20px rgba(55, 194, 204, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.1)'
            }}
            initial={{
              x: isClient ? `${bubblePositions.current[i].x}vw` : 0,
              y: isClient ? `${bubblePositions.current[i].y}vh` : 0,
              scale: 0,
              opacity: 0,
            }}
            animate={isClient ? {
              x: [
                `${bubblePositions.current[i].x}vw`,
                `${bubblePositions.current[i].x + 10}vw`,
                `${bubblePositions.current[i].x - 5}vw`,
              ],
              y: [
                `${bubblePositions.current[i].y}vh`,
                `${bubblePositions.current[i].y - 8}vh`,
                `${bubblePositions.current[i].y + 6}vh`,
              ],
              scale: [bubblePositions.current[i].scale, bubblePositions.current[i].scale * 1.2, bubblePositions.current[i].scale],
              opacity: [0.3, 0.8, 0.6, 0.9, 0.5],
              rotate: [0, 180, 360],
            } : {}}
            transition={{
              duration: 8 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
            whileHover={{
              scale: 1.8,
              opacity: 1,
              rotate: 360,
              transition: {
                duration: 0.3,
                type: "spring",
                stiffness: 300,
              }
            }}
            whileTap={{
              scale: 0.5,
              opacity: 0.2,
              transition: { duration: 0.1 }
            }}
            onHoverStart={() => {
              // Ripple effect on nearby bubbles
              const nearbyBubbles = document.querySelectorAll('.liquid-bubble');
              nearbyBubbles.forEach((bubble, index) => {
                if (Math.abs(index - i) <= 2) {
                  gsap.to(bubble, {
                    scale: 1.3,
                    duration: 0.3,
                    ease: "back.out(1.7)",
                    yoyo: true,
                    repeat: 1
                  });
                }
              });
            }}
            onClick={() => {
              // Burst effect when clicked
              const clickedBubble = document.querySelectorAll('.liquid-bubble')[i];
              if (clickedBubble) {
                // Create burst animation
                gsap.to(clickedBubble, {
                  scale: 2.5,
                  opacity: 0,
                  rotation: 720,
                  duration: 0.6,
                  ease: "power2.out",
                  onComplete: () => {
                    // Reset bubble after burst using predefined position
                    const vw = window.innerWidth / 100;
                    const vh = window.innerHeight / 100;
                    gsap.set(clickedBubble, {
                      scale: 1,
                      opacity: 0.6,
                      rotation: 0,
                      x: bubblePositions.current[i].x * vw,
                      y: bubblePositions.current[i].y * vh,
                    });
                  }
                });

                // Create ripple effect on all other bubbles
                const allBubbles = document.querySelectorAll('.liquid-bubble');
                allBubbles.forEach((bubble, index) => {
                  if (index !== i) {
                    gsap.to(bubble, {
                      scale: 1.4,
                      duration: 0.2,
                      ease: "power2.out",
                      yoyo: true,
                      repeat: 1,
                      delay: index * 0.05
                    });
                  }
                });
              }
            }}
          >
            {/* Dynamic Inner glow effect */}
            <motion.div
              className="absolute inset-2 rounded-full"
              style={{
                background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4) 0%, transparent 70%)'
              }}
              animate={{
                opacity: [0.2, 0.6, 0.3, 0.8],
                scale: [0.8, 1.2, 0.9, 1.1],
              }}
              transition={{
                duration: 3 + i * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.1,
              }}
            />

            {/* Interactive Color Ring */}
            <motion.div
              className="absolute inset-0 rounded-full opacity-0 pointer-events-none"
              style={{
                background: `conic-gradient(from ${i * 30}deg, rgba(55, 194, 204, 0.8), rgba(255, 255, 255, 0.6), rgba(55, 194, 204, 0.8))`,
                filter: 'blur(2px)'
              }}
              whileHover={{
                opacity: 0.7,
                scale: 1.2,
                rotate: 360,
                transition: {
                  duration: 2,
                  ease: "linear"
                }
              }}
            />

            {/* Floating particles inside bubble */}
            {[...Array(3)].map((_, pi) => (
              <motion.div
                key={pi}
                className="absolute w-1 h-1 bg-white rounded-full opacity-60"
                style={{
                  left: `${20 + pi * 25}%`,
                  top: `${30 + pi * 20}%`,
                }}
                animate={{
                  x: [0, 10, -5, 8, 0],
                  y: [0, -8, 5, -10, 0],
                  opacity: [0.3, 0.8, 0.5, 0.9, 0.4],
                }}
                transition={{
                  duration: 4 + pi * 0.5,
                  repeat: Infinity,
                  delay: pi * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        ))}
      </div>

      {/* Enhanced SVG Effects */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1200 800"
      >
        <defs>
          <filter id="liquidGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" result="whiteBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <filter id="ripple" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence baseFrequency="0.02" numOctaves="3" result="noise"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="5"/>
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
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center text-white px-4 sm:px-6 lg:px-8">
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
        <motion.div
          className="mb-8 max-w-4xl relative mt-16"
          initial={{ opacity: 0, y: 100, rotateX: -45 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 1.5,
            delay: 1,
            type: "spring",
            stiffness: 80,
            damping: 15,
          }}
        >
          <motion.h2
            className="text-lg md:text-2xl lg:text-3xl font-bold tracking-wider leading-tight relative z-10"
            style={{
              background:
                "linear-gradient(45deg, #ffffff 0%, #37c2cc 25%, #ffffff 50%, #37c2cc 75%, #ffffff 100%)",
              backgroundSize: "300% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontFamily:
                "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              textShadow: "0 0 30px rgba(55, 194, 204, 0.5)",
            }}
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5,
            }}
          >
            {["Where", "Ideas", "Ignite,", "Code", "Unites!"].map(
              (word, index) => (
                <motion.span
                  key={index}
                  className="inline-block mr-2 md:mr-4"
                  initial={{ opacity: 0, y: 50, rotateY: -90 }}
                  animate={{ opacity: 1, y: 0, rotateY: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 1.2 + index * 0.2,
                    type: "spring",
                    stiffness: 100,
                  }}
                >
                  {word}
                </motion.span>
              )
            )}
          </motion.h2>

          {/* Floating particles around text */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-[#37c2cc] rounded-full opacity-60"
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + (i % 3) * 20}%`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                scale: [0.8, 1.2, 0.8],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
        <motion.div className="relative group">
          {/* Floating orbs around button */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-[#37c2cc] rounded-full opacity-60 blur-sm"
              style={{
                left: `${20 + i * 15}%`,
                top: `${10 + (i % 2) * 80}%`,
              }}
              animate={{
                y: [0, -15, 0],
                x: [0, Math.sin(i) * 10, 0],
                scale: [0.8, 1.4, 0.8],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2.5 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.4 + 2,
                ease: "easeInOut",
              }}
            />
          ))}

          <motion.button
            className="px-8 py-4 md:px-12 md:py-6 bg-gradient-to-r from-[#37c2cc] via-[#2ba8b3] to-[#37c2cc] text-white font-bold text-lg md:text-xl rounded-2xl shadow-2xl relative overflow-hidden group transform-gpu"
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: "1px",
              backgroundSize: "200% 100%",
            }}
            initial={{ 
              opacity: 0, 
              y: 50, 
              scale: 0.8,
              rotateX: -30 
            }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              rotateX: 0,
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
            transition={{ 
              duration: 1.2, 
              delay: 2,
              type: "spring",
              stiffness: 100,
              backgroundPosition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            whileHover={{
              scale: 1.08,
              y: -5,
              rotateY: 5,
              boxShadow: [
                "0 10px 40px rgba(55, 194, 204, 0.4)",
                "0 15px 60px rgba(55, 194, 204, 0.6)",
                "0 10px 40px rgba(55, 194, 204, 0.4)"
              ],
              transition: {
                duration: 0.3,
                boxShadow: {
                  duration: 2,
                  repeat: Infinity,
                }
              }
            }}
            whileTap={{ 
              scale: 0.95,
              y: 0,
              transition: { duration: 0.1 }
            }}
          >
            {/* Animated background layers */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#0e243f] via-[#37c2cc] to-[#0e243f] opacity-0"
              animate={{
                opacity: [0, 0.3, 0],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: 1,
              }}
            />

            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
              style={{ transform: "skew(-12deg)" }}
              animate={{
                x: ["-200%", "200%"],
                opacity: [0, 0.6, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 3,
                ease: "easeInOut"
              }}
            />

            {/* Pulsing border */}
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-[#37c2cc]"
              animate={{
                borderColor: ["#37c2cc", "#ffffff", "#37c2cc"],
                borderWidth: ["2px", "3px", "2px"],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: 0.5,
              }}
            />

            <motion.span 
              className="relative z-10 inline-block"
              animate={{
                textShadow: [
                  "0 0 10px rgba(55, 194, 204, 0.5)",
                  "0 0 20px rgba(55, 194, 204, 0.8)",
                  "0 0 10px rgba(55, 194, 204, 0.5)"
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 1.5
              }}
            >
              {"Join the Rush".split("").map((char, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: 2.2 + i * 0.05,
                  }}
                  whileHover={{
                    y: -2,
                    transition: { duration: 0.1 }
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
