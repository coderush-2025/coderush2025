"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";

export default function SubmissionPage() {
  const [formData, setFormData] = useState({
    teamName: "",
    githubLink: "",
    googleDriveLink: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const backgroundRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  // Generate consistent bubble positions
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
    // Set client-side flag
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
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch("/api/submission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessageType("success");
        setMessage(data.message || "Submission successful! ✅");
        setFormData({
          teamName: "",
          githubLink: "",
          googleDriveLink: "",
        });
      } else {
        setMessageType("error");
        setMessage(data.error || "Submission failed. Please try again.");
      }
    } catch (error) {
      setMessageType("error");
      setMessage("Network error. Please check your connection and try again.");
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden overflow-y-auto">
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

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #37c2cc 0%, #ffffff 50%, #37c2cc 100%)",
              }}
            >
              Project Submission
            </span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-6">
            Submit your CodeRush 2025 project here. Make sure you&apos;re a registered team!
          </p>

          {/* Report Issue Button */}
          <motion.a
            href="/report-issue"
            className="inline-block px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold text-sm rounded-full hover:bg-white/20 transition-all duration-300"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1
            }}
            transition={{
              duration: 0.6,
              delay: 0.3,
              ease: "easeOut"
            }}
            whileHover={{
              scale: 1.05,
              y: -2
            }}
            whileTap={{
              scale: 0.95
            }}
          >
            Report an Issue
          </motion.a>
        </motion.div>

        {/* Submission Form */}
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white/10 backdrop-blur-xl border-2 border-[#37c2cc]/30 rounded-3xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Team Name */}
              <div>
                <label className="block text-[#37c2cc] font-semibold mb-2 text-lg">
                  Team Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your registered team name"
                  className="w-full px-4 py-3 bg-[#0e243f]/80 border-2 border-[#37c2cc]/30 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#37c2cc] focus:ring-2 focus:ring-[#37c2cc]/30 transition-all"
                />
                <p className="text-white/60 text-sm mt-1">
                  Must match your registered team name exactly
                </p>
              </div>

              {/* GitHub Repository Link */}
              <div>
                <label className="block text-[#37c2cc] font-semibold mb-2 text-lg">
                  GitHub Repository Link <span className="text-red-400">*</span>
                </label>
                <input
                  type="url"
                  name="githubLink"
                  value={formData.githubLink}
                  onChange={handleInputChange}
                  required
                  placeholder="https://github.com/username/repository"
                  className="w-full px-4 py-3 bg-[#0e243f]/80 border-2 border-[#37c2cc]/30 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#37c2cc] focus:ring-2 focus:ring-[#37c2cc]/30 transition-all"
                />
                <p className="text-white/60 text-sm mt-1">
                  Repository must be public
                </p>
              </div>

              {/* Google Drive Folder Link */}
              <div>
                <label className="block text-[#37c2cc] font-semibold mb-2 text-lg">
                  Google Drive Folder Link <span className="text-red-400">*</span>
                </label>
                <input
                  type="url"
                  name="googleDriveLink"
                  value={formData.googleDriveLink}
                  onChange={handleInputChange}
                  required
                  placeholder="https://drive.google.com/drive/folders/..."
                  className="w-full px-4 py-3 bg-[#0e243f]/80 border-2 border-[#37c2cc]/30 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#37c2cc] focus:ring-2 focus:ring-[#37c2cc]/30 transition-all"
                />
                <div className="text-white/60 text-sm mt-2 space-y-1">
                  <p>📁 Folder name: <span className="text-[#37c2cc] font-semibold">[Your Team Name]</span></p>
                  <p>📹 Video file: <span className="text-[#37c2cc] font-semibold">[Your Team Name]_demo.mp4</span></p>
                  <p>📄 Report file: <span className="text-[#37c2cc] font-semibold">[Your Team Name]_report.pdf</span></p>
                  <p className="text-yellow-400">⚠️ Set sharing to &quot;Anyone with the link can view&quot;</p>
                </div>
              </div>

              {/* Message Display */}
              {message && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-4 rounded-xl ${
                    messageType === "success"
                      ? "bg-green-500/20 border-2 border-green-500/50 text-green-200"
                      : "bg-red-500/20 border-2 border-red-500/50 text-red-200"
                  }`}
                >
                  <p className="font-semibold">{message}</p>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  isSubmitting
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#37c2cc] to-[#2ba8b3] hover:from-[#2ba8b3] hover:to-[#37c2cc] hover:scale-105 shadow-lg shadow-[#37c2cc]/50"
                } text-white`}
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Submit Project"
                )}
              </motion.button>
            </form>

            {/* Additional Information */}
            <div className="mt-8 p-4 bg-[#37c2cc]/10 rounded-xl border border-[#37c2cc]/30">
              <h3 className="text-[#37c2cc] font-bold mb-2">📋 Submission Guidelines:</h3>
              <ul className="text-white/70 text-sm space-y-1 list-disc list-inside">
                <li>Only registered teams can submit</li>
                <li>GitHub repository must be public</li>
                <li>Google Drive folder must be accessible to anyone with the link</li>
                <li>Ensure file names match your team name exactly</li>
                <li>Video format: MP4 (max 10 minutes)</li>
                <li>Report format: PDF (max 10 MB)</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
