"use client";

import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

interface TeamsResponse {
  success: boolean;
  count: number;
  teams: string[];
}

export default function RegisteredTeamsPage() {
  const [teams, setTeams] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch("/api/teams");
        const data: TeamsResponse = await response.json();

        if (data.success) {
          setTeams(data.teams);
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
  }, []);

  // Filter teams based on search query
  const filteredTeams = teams.filter((teamName) =>
    teamName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0e243f] via-[#204168] to-[#37c2cc] flex items-center justify-center relative overflow-hidden">
        {/* Animated background bubbles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-[#37c2cc] opacity-10"
              style={{
                width: Math.random() * 500 + 150,
                height: Math.random() * 500 + 150,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() *100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, 20, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: Math.random() * 3 + 3,
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
      <div className="min-h-screen bg-gradient-to-br from-[#0e243f] via-[#204168] to-[#37c2cc] flex items-center justify-center relative overflow-hidden">
        {/* Animated background bubbles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-[#37c2cc] opacity-10"
              style={{
                width: Math.random() * 100 + 100,
                height: Math.random() * 100 + 100,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, 20, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: Math.random() * 3 + 3,
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
    <div className="min-h-screen bg-gradient-to-br from-[#0e243f] via-[#204168] to-[#37c2cc] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-2 h-2 bg-[#37c2cc] rounded-full opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
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

        {/* Search Bar */}
        <motion.div
          className="max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative group">
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
              placeholder="Search teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="relative w-full px-6 py-4 pr-16 bg-[#0e243f]/80 backdrop-blur-md border-2 border-[#37c2cc]/30 rounded-full text-white placeholder-[#37c2cc]/50 focus:outline-none focus:border-[#37c2cc] focus:ring-2 focus:ring-[#37c2cc]/30 transition-all duration-300 text-lg"
            />
            <motion.div
              className="absolute right-6 top-4 text-[#37c2cc] flex items-center justify-center"
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
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
          {searchQuery && (
            <motion.p
              className="text-center mt-4 text-[#37c2cc] font-semibold"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Found {filteredTeams.length} team{filteredTeams.length !== 1 ? "s" : ""}
            </motion.p>
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
              No teams registered yet
            </p>
            <p className="text-[#37c2cc] text-xl mt-2">
              Be the first to register!
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredTeams.map((teamName, index) => (
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
                    className="text-center text-white font-semibold text-lg break-words transition-colors duration-300 relative z-10"
                    whileHover={{
                      color: "#37c2cc",
                      scale: 1.05,
                      textShadow: "0 0 20px rgba(55, 194, 204, 0.5)",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {teamName}
                  </motion.h3>

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
