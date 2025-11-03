'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ReportIssuePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    teamName: '',
    contactNumber: '',
    email: '',
    problemType: 'registration',
    reason: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const backgroundRef = useRef<HTMLDivElement>(null);

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
    window.scrollTo(0, 0);
    setIsClient(true);

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      const bubbles = document.querySelectorAll('.liquid-bubble');
      bubbles.forEach((bubble) => {
        const rect = bubble.getBoundingClientRect();
        const bubbleCenterX = rect.left + rect.width / 2;
        const bubbleCenterY = rect.top + rect.height / 2;
        const distance = Math.sqrt(
          Math.pow(e.clientX - bubbleCenterX, 2) + Math.pow(e.clientY - bubbleCenterY, 2)
        );

        const interactionRadius = 150;

        if (distance < interactionRadius) {
          const strength = (interactionRadius - distance) / interactionRadius;
          const moveX = (e.clientX - bubbleCenterX) * strength * 0.2;
          const moveY = (e.clientY - bubbleCenterY) * strength * 0.2;

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

    // Morphing background
    const gradients = [
      "linear-gradient(135deg, #0e243f 0%, #204168 50%, #37c2cc 100%)",
      "linear-gradient(225deg, #37c2cc 0%, #0e243f 50%, #204168 100%)",
      "linear-gradient(315deg, #204168 0%, #37c2cc 50%, #0e243f 100%)",
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

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({
          teamName: '',
          contactNumber: '',
          email: '',
          problemType: 'registration',
          reason: '',
        });
      } else {
        setError(data.message || 'Failed to submit issue report');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Issue submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="relative min-h-screen flex items-start justify-center overflow-x-hidden overflow-y-auto">
      {/* Animated Background */}
      <div
        ref={backgroundRef}
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #0e243f 0%, #204168 50%, #37c2cc 100%)",
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

      {/* Interactive Liquid Bubbles */}
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

      {/* Back Button - Fixed at top left */}
      <motion.div
        className="fixed top-20 left-4 sm:left-8 z-20"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white rounded-full font-semibold hover:bg-white/20 hover:border-[#37c2cc] transition-all duration-300 group shadow-lg cursor-pointer"
        >
          <svg
            className="w-4 h-4 transition-transform group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm">Back</span>
        </button>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-[#37c2cc]/20 border border-[#37c2cc]/30 rounded-full mb-4"
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <FiAlertCircle className="text-[#37c2cc] text-3xl" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-[#37c2cc] to-white">
              Report an Issue
            </span>
          </h1>
          <p className="text-white/80">
            Having trouble with registration or submission? Let us know and we&apos;ll help you out!
          </p>
        </motion.div>

        {success ? (
          <motion.div
            className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-[#37c2cc]/30 text-center shadow-xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-full mb-4">
              <FiCheckCircle className="text-green-400 text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Issue Reported Successfully!</h2>
            <p className="text-white/80 mb-6">
              Thank you for reporting the issue. Our team will review it and contact you soon at the email you provided.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button
                onClick={() => setSuccess(false)}
                className="px-6 py-3 bg-gradient-to-r from-[#37c2cc] to-[#2ba8b3] text-white rounded-full font-semibold shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Report Another Issue
              </motion.button>
              <Link
                href="/"
                className="px-6 py-3 bg-white/10 border-2 border-white/30 text-white rounded-full font-semibold hover:bg-white/20 transition text-center"
              >
                Back to Home
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            className="bg-white/10 backdrop-blur-lg p-6 sm:p-8 rounded-2xl border border-[#37c2cc]/30 space-y-5 shadow-xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Team Name */}
            <div>
              <label htmlFor="teamName" className="block text-sm font-medium text-[#37c2cc] mb-2">
                Team Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="teamName"
                name="teamName"
                value={formData.teamName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#0e243f]/60 border-2 border-[#37c2cc]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#37c2cc] focus:border-[#37c2cc] transition"
                placeholder="Enter your team name"
                required
              />
            </div>

            {/* Contact Number */}
            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-[#37c2cc] mb-2">
                Contact Number <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#0e243f]/60 border-2 border-[#37c2cc]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#37c2cc] focus:border-[#37c2cc] transition"
                placeholder="e.g., +94 77 123 4567"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#37c2cc] mb-2">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#0e243f]/60 border-2 border-[#37c2cc]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#37c2cc] focus:border-[#37c2cc] transition"
                placeholder="your.email@example.com"
                required
              />
            </div>

            {/* Problem Type */}
            <div>
              <label htmlFor="problemType" className="block text-sm font-medium text-[#37c2cc] mb-2">
                Problem Type <span className="text-red-400">*</span>
              </label>
              <select
                id="problemType"
                name="problemType"
                value={formData.problemType}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#0e243f]/60 border-2 border-[#37c2cc]/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#37c2cc] focus:border-[#37c2cc] transition"
                style={{ colorScheme: 'dark' }}
                required
              >
                <option value="registration" className="bg-[#0e243f] text-white">Registration Process</option>
                <option value="submission" className="bg-[#0e243f] text-white">Submission Process</option>
                <option value="other" className="bg-[#0e243f] text-white">Other</option>
              </select>
            </div>

            {/* Reason */}
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-[#37c2cc] mb-2">
                Describe the Issue <span className="text-red-400">*</span>
              </label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-3 bg-[#0e243f]/60 border-2 border-[#37c2cc]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#37c2cc] focus:border-[#37c2cc] transition resize-none"
                placeholder="Please describe the issue you're facing in detail..."
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                className="bg-red-500/20 border-2 border-red-500/50 text-red-300 px-4 py-3 rounded-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <motion.button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-[#37c2cc] to-[#2ba8b3] text-white py-3 rounded-full font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? 'Submitting...' : 'Submit Issue Report'}
              </motion.button>
              <Link
                href="/"
                className="px-6 py-3 bg-white/10 border-2 border-white/30 text-white rounded-full font-semibold hover:bg-white/20 transition text-center"
              >
                Cancel
              </Link>
            </div>
          </motion.form>
        )}

        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <p className="text-white/60 text-sm">
            For urgent matters, contact us directly at{' '}
            <a href="mailto:coderush2025@gmail.com" className="text-[#37c2cc] hover:underline font-semibold">
              coderush2025@gmail.com
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
