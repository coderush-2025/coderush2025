
"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import Image from "next/image";
import ChatBot from "@/components/ChatBox";

export default function RegisterPage() {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  // Generate consistent bubble positions for SSR (responsive percentages)
  const bubblePositions = useRef([
    { x: 15, y: 20, scale: 0.8 },
    { x: 60, y: 15, scale: 1.2 },
    { x: 25, y: 60, scale: 1.0 },
    { x: 80, y: 40, scale: 0.9 },
    { x: 10, y: 70, scale: 1.1 },
    { x: 70, y: 65, scale: 0.7 },
    { x: 40, y: 30, scale: 1.3 },
    { x: 55, y: 80, scale: 0.8 },
  ]);

  useEffect(() => {
    // Scroll to top on page load/refresh
    window.scrollTo(0, 0);

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

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex items-start justify-center overflow-hidden touch-none">
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
        {isClient && bubblePositions.current.map((pos, i) => (
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
              x: isClient ? `${pos.x}vw` : 0,
              y: isClient ? `${pos.y}vh` : 0,
              scale: 0,
              opacity: 0,
            }}
            animate={isClient ? {
              x: [
                `${pos.x}vw`,
                `${pos.x + 10}vw`,
                `${pos.x - 5}vw`,
              ],
              y: [
                `${pos.y}vh`,
                `${pos.y - 8}vh`,
                `${pos.y + 6}vh`,
              ],
              scale: [pos.scale, pos.scale * 1.2, pos.scale],
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
                gsap.to(clickedBubble, {
                  scale: 2.5,
                  opacity: 0,
                  rotation: 720,
                  duration: 0.6,
                  ease: "power2.out",
                  onComplete: () => {
                    const vw = window.innerWidth / 100;
                    const vh = window.innerHeight / 100;
                    gsap.set(clickedBubble, {
                      scale: 1,
                      opacity: 0.6,
                      rotation: 0,
                      x: pos.x * vw,
                      y: pos.y * vh,
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

      {/* Content - Two Column Layout */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 min-h-screen flex flex-col justify-center py-6 sm:py-8 md:py-8 space-y-8">
        <div className="w-full grid grid-cols-1 md:grid-cols-[35%_65%] gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center">

          {/* Left Side - Logo and Title */}
          <motion.div
            className="flex flex-col items-center justify-center space-y-4 sm:space-y-5 md:space-y-6 p-3 sm:p-4 md:p-5 lg:p-6 order-1"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Logo */}
            <motion.div
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
                width={4000}
                height={2000}
                className="w-auto h-auto max-w-full max-h-32 sm:max-h-36 md:max-h-44 lg:max-h-52 xl:max-h-60"
                priority
              />
            </motion.div>

            {/* Event Title */}
            <div className="text-center space-y-2.5 sm:space-y-3 md:space-y-3 text-white">
              <motion.h1
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight"
                style={{
                  background: "linear-gradient(135deg, #37c2cc 0%, #ffffff 50%, #37c2cc 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
                initial={{ opacity: 0, y: 50, skewX: -10 }}
                animate={{ opacity: 1, y: 0, skewX: 0 }}
                transition={{
                  duration: 1,
                  delay: 0.5,
                  ease: "easeOut",
                }}
              >
                CodeRush 2025
              </motion.h1>
              <p className="text-white/80 text-base sm:text-lg md:text-lg">
                Team Registration Portal
              </p>
              <div className="flex items-center justify-center gap-2 sm:gap-2 text-[#37c2cc] flex-wrap">
                <div className="hidden sm:block w-8 md:w-8 h-px bg-gradient-to-r from-transparent to-[#37c2cc]" />
                <span className="text-xs sm:text-sm md:text-sm font-semibold text-center px-1">University of Moratuwa - Faculty of IT</span>
                <div className="hidden sm:block w-8 md:w-8 h-px bg-gradient-to-l from-transparent to-[#37c2cc]" />
              </div>
            </div>
          </motion.div>

          {/* Right Side - ChatBot */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="w-full px-4 sm:px-6 md:px-4 lg:pr-6 lg:pl-0 order-2"
          >
            <ChatBot />
          </motion.div>

        </div>

        {/* Rules and Registration Process Section */}
        <div className="relative z-10 w-full pb-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Registration Process */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-[#37c2cc]/20">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-gradient-to-r from-[#37c2cc] to-[#2ba8b3] rounded-lg flex items-center justify-center text-[#0e243f] font-bold">1</span>
              Registration Process
            </h2>
            <div className="space-y-4 text-white/80">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#37c2cc]/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-[#37c2cc] font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Provide Team Information</h3>
                  <p className="text-sm">Chat with the assistant to provide team name, HackerRank username (TeamName_CR), batch, and member details (names, index numbers, emails).</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#37c2cc]/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-[#37c2cc] font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Review & Edit</h3>
                  <p className="text-sm">The assistant will show all your details. You can edit any information in the modal form before final submission.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#37c2cc]/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-[#37c2cc] font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Submit & Confirm</h3>
                  <p className="text-sm">Once you confirm, your registration is submitted. You'll see instant confirmation and receive further instructions via email.</p>
                </div>
              </div>
              <div className="mt-6 p-4 bg-[#37c2cc]/10 border border-[#37c2cc]/30 rounded-lg">
                <p className="text-xs text-[#37c2cc] font-semibold mb-1">💡 Important:</p>
                <p className="text-xs">HackerRank username must be: YourTeamName_CR (with _CR suffix in uppercase)</p>
              </div>
            </div>
          </div>

          {/* Rules and Guidelines */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-[#37c2cc]/20">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-gradient-to-r from-[#37c2cc] to-[#2ba8b3] rounded-lg flex items-center justify-center text-[#0e243f] font-bold">2</span>
              Rules & Guidelines
            </h2>
            <div className="space-y-3 text-white/80 text-sm">
              <div className="flex gap-3">
                <span className="text-[#37c2cc] mt-1">•</span>
                <p>Each team must have exactly 4 members from the same batch (23 or 24).</p>
              </div>
              <div className="flex gap-3">
                <span className="text-[#37c2cc] mt-1">•</span>
                <p>All team members must be from University of Moratuwa - Faculty of IT.</p>
              </div>
              <div className="flex gap-3">
                <span className="text-[#37c2cc] mt-1">•</span>
                <p>One person per team should complete the registration (team leader).</p>
              </div>
              <div className="flex gap-3">
                <span className="text-[#37c2cc] mt-1">•</span>
                <p>Team names and HackerRank usernames must be unique (maximum 100 teams).</p>
              </div>
              <div className="flex gap-3">
                <span className="text-[#37c2cc] mt-1">•</span>
                <p>Index numbers must match the team batch and cannot be duplicated.</p>
              </div>
              <div className="flex gap-3">
                <span className="text-[#37c2cc] mt-1">•</span>
                <p>Email addresses must be unique across all teams.</p>
              </div>
              <div className="flex gap-3">
                <span className="text-[#37c2cc] mt-1">•</span>
                <p>Registration data is securely stored with email confirmation sent.</p>
              </div>
            </div>
          </div>
        </motion.div>
        </div>
      </div>
    </div>
  );
}