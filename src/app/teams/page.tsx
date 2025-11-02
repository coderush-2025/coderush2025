"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";

interface TeamDetails {
  teamName: string;
  teamLeader?: string;
  batch?: string;
}

interface TeamsResponse {
  success: boolean;
  count: number;
  teams: string[];
  teamDetails?: TeamDetails[];
}

export default function RegisteredTeamsPage() {
  const [teams, setTeams] = useState<string[]>([]);
  const [teamDetails, setTeamDetails] = useState<TeamDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);
  const backgroundRef = useRef<HTMLDivElement>(null);

  // Generate consistent bubble positions for SSR (same as Hero)
  const bubblePositions = useRef([
    { x: 15, y: 20, scale: 0.8 },
    { x: 60, y: 15, scale: 1.2 },
    { x: 25, y: 60, scale: 1.0 },
    { x: 80, y: 40, scale: 0.9 },
    { x: 10, y: 70, scale: 1.1 },
    { x: 70, y: 65, scale: 0.7 },
    { x: 40, y: 30, scale: 1.3 },
    { x: 55, y: 80, scale: 0.8 },
    { x: 20, y: 35, scale: 1.0 },
    { x: 85, y: 25, scale: 1.1 },
    { x: 35, y: 50, scale: 0.9 },
    { x: 65, y: 75, scale: 1.2 }
  ]);

  // Predefined bubble values for loading/error states to avoid hydration mismatch
  const staticBubbles = [
    { width: 250, height: 300, left: 15, top: 25, duration: 5 },
    { width: 350, height: 280, left: 65, top: 10, duration: 4.5 },
    { width: 200, height: 250, left: 30, top: 60, duration: 5.5 },
    { width: 320, height: 300, left: 80, top: 45, duration: 4.2 },
    { width: 280, height: 220, left: 10, top: 75, duration: 5.3 },
    { width: 400, height: 350, left: 55, top: 30, duration: 4.8 },
    { width: 180, height: 200, left: 40, top: 85, duration: 5.1 },
    { width: 300, height: 280, left: 70, top: 15, duration: 4.6 }
  ];

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);

    setIsClient(true);

    const fetchTeams = async () => {
      try {
        const response = await fetch("/api/teams");
        const data: TeamsResponse = await response.json();

        if (data.success) {
          setTeams(data.teams);
          setTeamDetails(data.teamDetails || []);
        } else {
          setError("Failed to load teams");
        }
      } catch (err) {
        setError("An error occurred while fetching teams");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();

    // Mouse and touch tracking for interactive bubbles (same as Hero)
    const handleInteraction = (clientX: number, clientY: number) => {
      setMousePosition({ x: clientX, y: clientY });

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

    // Morphing background with multiple gradients (same as Register page)
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
    setTimeout(() => {
      const bubbles = document.querySelectorAll(".liquid-bubble");
      bubbles.forEach((bubble, index) => {
        const position = bubblePositions.current[index];
        if (position) {
          const vw = window.innerWidth / 100;
          const vh = window.innerHeight / 100;

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

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Filter team details based on search query (used for both grid and list view)
  const filteredTeamDetails = teamDetails.filter((team) =>
    team.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.teamLeader?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.batch?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // For backward compatibility with teams array
  const filteredTeams = filteredTeamDetails.map(team => team.teamName);

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-x-hidden overflow-y-auto">
          {/* Morphing Background */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              background: "linear-gradient(135deg, #0e243f 0%, #204168 50%, #37c2cc 100%)",
            }}
          />

          {/* Animated background bubbles */}
          <div className="absolute inset-0 overflow-hidden">
          {staticBubbles.map((bubble, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-[#37c2cc] opacity-10"
              style={{
                width: bubble.width,
                height: bubble.height,
                left: `${bubble.left}%`,
                top: `${bubble.top}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, 20, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: bubble.duration,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        
        <div className="text-center relative z-10">
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-[#37c2cc] border-r-transparent"></div>
          <p className="mt-4 text-xl text-white">Loading teams...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-x-hidden overflow-y-auto">
          {/* Morphing Background */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              background: "linear-gradient(135deg, #0e243f 0%, #204168 50%, #37c2cc 100%)",
            }}
          />

          {/* Animated background bubbles */}
          <div className="absolute inset-0 overflow-hidden">
          {staticBubbles.map((bubble, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-[#37c2cc] opacity-10"
              style={{
                width: bubble.width,
                height: bubble.height,
                left: `${bubble.left}%`,
                top: `${bubble.top}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, 20, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: bubble.duration,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="text-center relative z-10">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <p className="text-xl text-white">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-[#37c2cc] to-[#2ba8b3] text-white font-semibold rounded-full hover:scale-105 transition-transform duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-start justify-center overflow-x-hidden overflow-y-auto">
        {/* Morphing Background */}
        <div
          ref={backgroundRef}
          className="absolute inset-0 w-full h-full"
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

      {/* Interactive Liquid Bubble Animation (same as Hero) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        {isClient && [...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full liquid-bubble cursor-pointer pointer-events-auto"
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
              delay: i * 0.2,
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

        {/* Main Content Container */}
        <div className="w-full max-w-7xl mx-auto relative z-10 py-12 px-4 sm:px-6 lg:px-8">
          {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-2xl"
            animate={{
              textShadow: [
                "0 0 20px rgba(55, 194, 204, 0.3)",
                "0 0 40px rgba(55, 194, 204, 0.6)",
                "0 0 20px rgba(55, 194, 204, 0.3)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-[#37c2cc] to-white">
              Registered Teams
            </span>
          </motion.h1>
          <motion.div
            className="inline-block bg-[#204168]/50 backdrop-blur-sm px-8 py-4 rounded-full border border-[#37c2cc]/30 relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[#37c2cc]/20 to-transparent"
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <p className="text-2xl text-white relative z-10">
              Total Teams:{" "}
              <motion.span
                className="font-bold text-[#37c2cc] text-3xl inline-block"
                key={teams.length}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {teams.length}
              </motion.span>
            </p>
          </motion.div>
        </motion.div>

        {/* Search Bar and View Toggle */}
        <motion.div
          className="max-w-6xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Search Bar */}
            <div className="relative group flex-1 w-full">
            {/* Glowing border animation */}
            <motion.div
              className="absolute -inset-0.5 bg-gradient-to-r from-[#37c2cc] to-[#2ba8b3] rounded-full opacity-30 blur group-hover:opacity-60"
              animate={{
                scale: [1, 1.02, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <input
              type="text"
              placeholder="Search by team name, leader, or batch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="relative w-full px-6 py-4 pr-24 bg-[#0e243f]/80 backdrop-blur-md border-2 border-[#37c2cc]/30 rounded-full text-white placeholder-[#37c2cc]/50 focus:outline-none focus:border-[#37c2cc] focus:ring-2 focus:ring-[#37c2cc]/30 transition-all duration-300 text-lg"
            />
            {searchQuery && (
              <motion.button
                onClick={() => setSearchQuery("")}
                className="absolute right-14 top-4 text-white/60 hover:text-[#37c2cc] transition-colors duration-300"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            )}
            <motion.div
              className="absolute right-6 top-4 text-[#37c2cc] flex items-center justify-center pointer-events-none"
              animate={{
                rotate: searchQuery ? [0, 360] : [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: searchQuery ? 0.5 : 2,
                repeat: searchQuery ? 0 : Infinity,
                ease: "easeInOut",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </motion.div>
            </div>

            {/* View Toggle Buttons */}
            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => setViewMode("grid")}
                className={`px-5 py-3 rounded-full font-semibold transition-all duration-300 ${
                  viewMode === "grid"
                    ? "bg-gradient-to-r from-[#37c2cc] to-[#2ba8b3] text-white shadow-lg shadow-[#37c2cc]/50"
                    : "bg-[#0e243f]/60 text-[#37c2cc] border-2 border-[#37c2cc]/30 hover:border-[#37c2cc]"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span className="hidden sm:inline">Grid</span>
                </div>
              </motion.button>
              <motion.button
                onClick={() => setViewMode("list")}
                className={`px-5 py-3 rounded-full font-semibold transition-all duration-300 ${
                  viewMode === "list"
                    ? "bg-gradient-to-r from-[#37c2cc] to-[#2ba8b3] text-white shadow-lg shadow-[#37c2cc]/50"
                    : "bg-[#0e243f]/60 text-[#37c2cc] border-2 border-[#37c2cc]/30 hover:border-[#37c2cc]"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  <span className="hidden sm:inline">List</span>
                </div>
              </motion.button>
            </div>
          </div>

          {searchQuery && (
            <motion.div
              className="mt-4 text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#37c2cc]/20 border border-[#37c2cc]/30">
                <svg className="w-5 h-5 text-[#37c2cc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="font-semibold text-[#37c2cc]">
                  Found {filteredTeams.length} team{filteredTeams.length !== 1 ? "s" : ""}
                </span>
                {filteredTeams.length > 0 && (
                  <span className="text-white/60 text-sm">
                    matching &quot;{searchQuery}&quot;
                  </span>
                )}
              </div>
              {filteredTeams.length === 0 && (
                <motion.button
                  onClick={() => setSearchQuery("")}
                  className="mt-3 px-4 py-2 text-sm bg-[#37c2cc]/10 hover:bg-[#37c2cc]/20 text-[#37c2cc] rounded-full border border-[#37c2cc]/30 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Clear search
                </motion.button>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Teams Grid */}
        {teams.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-8xl mb-6">🏆</div>
            <p className="text-3xl text-white font-semibold">
              No Teams Registered Yet
            </p>
            <p className="text-[#37c2cc] text-xl mt-2">
              Registration is currently open. Be the first team to join!
            </p>
          </motion.div>
        ) : filteredTeams.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-8xl mb-6">🔍</div>
            <p className="text-3xl text-white font-semibold">
              No teams found
            </p>
            <p className="text-[#37c2cc] text-xl mt-2">
              Try a different search term
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-[#37c2cc] to-[#2ba8b3] text-white font-semibold rounded-full hover:scale-105 transition-transform duration-300"
            >
              Clear Search
            </button>
          </motion.div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredTeamDetails.map((team, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 100,
                }}
                className="group relative"
              >
                <div className="relative bg-gradient-to-br from-[#0e243f]/80 to-[#204168]/80 backdrop-blur-md rounded-2xl p-6 border border-[#37c2cc]/30 hover:border-[#37c2cc] transition-all duration-300 overflow-hidden cursor-pointer">
                  {/* Animated gradient overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-[#37c2cc]/0 via-[#37c2cc]/0 to-[#37c2cc]/0"
                    whileHover={{
                      background: [
                        "linear-gradient(135deg, rgba(55, 194, 204, 0) 0%, rgba(55, 194, 204, 0) 50%, rgba(55, 194, 204, 0) 100%)",
                        "linear-gradient(135deg, rgba(55, 194, 204, 0.05) 0%, rgba(55, 194, 204, 0.1) 50%, rgba(55, 194, 204, 0.05) 100%)",
                      ],
                    }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Pulsing glow effect */}
                  <motion.div
                    className="absolute -inset-0.5 bg-gradient-to-r from-[#37c2cc] to-[#2ba8b3] rounded-2xl opacity-0 blur group-hover:opacity-30"
                    animate={{
                      opacity: [0, 0.2, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  {/* Shimmer effect on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
                    initial={{ x: "-100%" }}
                    whileHover={{
                      x: "100%",
                      transition: { duration: 0.6 },
                    }}
                  />

                  {/* Team Name */}
                  <motion.h3
                    className="text-center text-white font-bold text-xl mb-4 break-words transition-colors duration-300 relative z-10"
                    whileHover={{
                      color: "#37c2cc",
                      scale: 1.05,
                      textShadow: "0 0 20px rgba(55, 194, 204, 0.5)",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {team.teamName}
                  </motion.h3>

                  {/* Team Details */}
                  <div className="relative z-10 space-y-2 text-center">
                    {team.teamLeader && (
                      <div className="flex items-center justify-center gap-2 text-[#37c2cc]/80">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-sm font-medium">{team.teamLeader}</span>
                      </div>
                    )}
                    {team.batch && (
                      <div className="flex items-center justify-center">
                        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#37c2cc]/20 border border-[#37c2cc]/30">
                          <svg className="w-3 h-3 text-[#37c2cc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          <span className="text-xs font-semibold text-[#37c2cc]">Batch {team.batch}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Animated particles on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-[#37c2cc] rounded-full"
                        style={{
                          left: `${20 + i * 15}%`,
                          top: `${30 + (i % 3) * 20}%`,
                        }}
                        animate={{
                          y: [0, -30, 0],
                          opacity: [0, 1, 0],
                          scale: [0, 1.5, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.2,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </div>

                  {/* Corner accents */}
                  <motion.div
                    className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#37c2cc]/0 group-hover:border-[#37c2cc] rounded-tr-2xl transition-all duration-300"
                  />
                  <motion.div
                    className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#37c2cc]/0 group-hover:border-[#37c2cc] rounded-bl-2xl transition-all duration-300"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative bg-gradient-to-br from-[#0e243f]/80 to-[#204168]/80 backdrop-blur-md rounded-2xl border border-[#37c2cc]/30 overflow-hidden">
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#37c2cc]/30">
                      <th className="px-6 py-4 text-left text-sm font-bold text-[#37c2cc] uppercase tracking-wider">
                        Team Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-[#37c2cc] uppercase tracking-wider">
                        Team Leader
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-[#37c2cc] uppercase tracking-wider">
                        Batch
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTeamDetails.map((team, index) => (
                      <motion.tr
                        key={index}
                        className="border-b border-[#37c2cc]/10 hover:bg-[#37c2cc]/10 transition-all duration-300 group"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.03,
                        }}
                      >
                        <td className="px-6 py-4">
                          <div className="text-lg font-semibold text-white group-hover:text-[#37c2cc] transition-colors duration-300">
                            {team.teamName}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-base text-white/80">
                            {team.teamLeader || "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#37c2cc]/20 border border-[#37c2cc]/30">
                            <span className="text-sm font-medium text-[#37c2cc]">
                              {team.batch || "-"}
                            </span>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              href="/"
              className="inline-block bg-gradient-to-r from-[#37c2cc] via-[#2ba8b3] to-[#37c2cc] text-white font-bold px-10 py-4 rounded-full shadow-xl shadow-[#37c2cc]/30 relative overflow-hidden group"
              style={{ backgroundSize: "200% 100%" }}
              whileHover={{
                scale: 1.08,
                y: -5,
                boxShadow: "0 15px 50px rgba(55, 194, 204, 0.5)",
                backgroundPosition: ["0% 50%", "100% 50%"],
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {/* Animated gradient layer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#0e243f] via-[#37c2cc] to-[#0e243f] opacity-0"
                animate={{
                  opacity: [0, 0.3, 0],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              {/* Shimmer effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              
              <span className="relative z-10 flex items-center gap-2">
                <motion.span
                  animate={{ x: [0, -5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-2xl"
                >
                  ←
                </motion.span>
                Back to Home
              </span>
            </motion.a>
            
            <motion.a
              href="/register"
              className="inline-block bg-gradient-to-r from-[#204168] via-[#0e243f] to-[#204168] text-white font-bold px-10 py-4 rounded-full shadow-xl shadow-[#204168]/30 relative overflow-hidden group border-2 border-[#37c2cc]"
              style={{ backgroundSize: "200% 100%" }}
              whileHover={{
                scale: 1.08,
                y: -5,
                boxShadow: "0 15px 50px rgba(55, 194, 204, 0.4)",
                borderColor: "#ffffff",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {/* Pulsing border */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-[#37c2cc]"
                animate={{
                  borderColor: ["#37c2cc", "#ffffff", "#37c2cc"],
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Shimmer effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#37c2cc]/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              
              <span className="relative z-10 flex items-center gap-2">
                Register Your Team
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-2xl"
                >
                  →
                </motion.span>
              </span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
