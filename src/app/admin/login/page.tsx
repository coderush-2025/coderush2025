'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
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
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store session token
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUsername', data.username);
        router.push('/admin/dashboard');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-x-hidden overflow-y-auto p-4 pt-20">
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20 z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
          <p className="text-gray-300">CodeRush 2025 Administration</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-200 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#37c2cc] focus:border-transparent transition"
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#37c2cc] focus:border-transparent transition"
              placeholder="Enter password"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#37c2cc] to-[#2ba8b3] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Logging in...</span>
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-[#37c2cc] hover:text-[#2ba8b3] text-sm transition">
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
