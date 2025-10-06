"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Introduction() {
  const images = ["/1.jpeg", "/2.jpeg", "/3.jpeg", "/4.jpeg", "/5.jpeg", "/6.jpeg", "/7.jpeg", "/8.jpeg", "/9.jpeg", "/10.jpeg", "/11.jpeg", "/12.jpeg", "/13.jpeg", "/14.jpeg", "/15.jpeg"];

  return (
    <section className="min-h-screen w-full bg-gradient-to-br from-[#0e243f] via-[#204168] to-[#37c2cc] relative overflow-hidden">
      {/* Hero-themed Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0e243f]/20 via-[#204168]/15 to-[#37c2cc]/20"></div>
        <div className="absolute top-20 right-20 w-48 h-48 bg-[#37c2cc]/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-[#204168]/12 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-[#37c2cc]/6 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-[#204168]/8 rounded-full blur-xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top Title Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center py-16"
        >
          <motion.h1
            className="text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#37c2cc] via-white to-[#37c2cc]"
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ backgroundSize: "200% 200%" }}
          >
            CODERUSH
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-4xl lg:text-5xl font-bold text-[#37c2cc] mt-2"
          >
            2K25
          </motion.h2>
        </motion.div>

        {/* Main Content Area */}
        <div className="flex-1 flex items-center justify-between px-8 lg:px-16 pb-16 gap-12">
          {/* Left Side - Photo Grid/Mosaic */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex-1 max-w-2xl"
          >
            <div className="relative w-full h-[600px]">
              {/* Grid Container */}
              <div className="grid grid-cols-6 grid-rows-6 gap-4 w-full h-full">
                {/* Row 1 */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ delay: 1.2, duration: 0.8, type: "spring" }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: 5,
                    boxShadow: "0 20px 40px rgba(55, 194, 204, 0.3)",
                    borderColor: "rgba(55, 194, 204, 0.8)"
                  }}
                  className="col-span-1 row-span-1 rounded-xl border-2 border-gray-600/50 hover:border-[#37c2cc]/80 transition-all duration-500 cursor-pointer relative overflow-hidden group"
                >
                  <Image 
                    src={images[3]} 
                    alt="CodeRush moment" 
                    fill 
                    className="object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#37c2cc]/10 via-transparent to-[#204168]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 bg-[#37c2cc]/5 blur-xl scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ delay: 1.3, duration: 0.8, type: "spring" }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: -5,
                    boxShadow: "0 20px 40px rgba(55, 194, 204, 0.3)",
                    borderColor: "rgba(55, 194, 204, 0.8)"
                  }}
                  className="col-span-1 row-span-1 rounded-xl border-2 border-gray-600/50 hover:border-[#37c2cc]/80 transition-all duration-500 cursor-pointer relative overflow-hidden group"
                >
                  <Image 
                    src={images[4]} 
                    alt="CodeRush moment" 
                    fill 
                    className="object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#37c2cc]/10 via-transparent to-[#204168]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 bg-[#37c2cc]/5 blur-xl scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ delay: 1.4, duration: 0.8, type: "spring" }}
                  whileHover={{ 
                    scale: 1.03, 
                    rotateY: 3,
                    boxShadow: "0 25px 50px rgba(55, 194, 204, 0.4)",
                    borderColor: "rgba(55, 194, 204, 1)"
                  }}
                  className="col-span-2 row-span-2 rounded-xl border-2 border-gray-600/50 hover:border-[#37c2cc]/80 transition-all duration-500 cursor-pointer relative overflow-hidden group"
                >
                  <Image 
                    src={images[0]} 
                    alt="CodeRush moment" 
                    fill 
                    className="object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#37c2cc]/15 via-transparent to-[#204168]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 bg-[#37c2cc]/8 blur-2xl scale-0 group-hover:scale-100 transition-transform duration-700"></div>
                  <div className="absolute top-2 right-2 w-3 h-3 bg-[#37c2cc] rounded-full opacity-0 group-hover:opacity-100 animate-pulse"></div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ delay: 1.5, duration: 0.8, type: "spring" }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: -5,
                    boxShadow: "0 20px 40px rgba(55, 194, 204, 0.3)"
                  }}
                  className="col-span-1 row-span-1 rounded-xl border-2 border-gray-600/50 hover:border-[#37c2cc]/80 transition-all duration-500 cursor-pointer relative overflow-hidden group"
                >
                  <Image 
                    src={images[5]} 
                    alt="CodeRush moment" 
                    fill 
                    className="object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#37c2cc]/10 via-transparent to-[#204168]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ delay: 1.6, duration: 0.8, type: "spring" }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: 5,
                    boxShadow: "0 20px 40px rgba(55, 194, 204, 0.3)"
                  }}
                  className="col-span-1 row-span-1 rounded-xl border-2 border-gray-600/50 hover:border-[#37c2cc]/80 transition-all duration-500 cursor-pointer relative overflow-hidden group"
                >
                  <Image 
                    src={images[6]} 
                    alt="CodeRush moment" 
                    fill 
                    className="object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#37c2cc]/10 via-transparent to-[#204168]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </motion.div>

                {/* Row 2 */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ delay: 1.7, duration: 0.8, type: "spring" }}
                  whileHover={{ 
                    scale: 1.03, 
                    rotateY: -3,
                    boxShadow: "0 25px 50px rgba(55, 194, 204, 0.4)"
                  }}
                  className="col-span-2 row-span-2 rounded-xl border-2 border-gray-600/50 hover:border-[#37c2cc]/80 transition-all duration-500 cursor-pointer relative overflow-hidden group"
                >
                  <Image 
                    src={images[1]} 
                    alt="CodeRush moment" 
                    fill 
                    className="object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#37c2cc]/15 via-transparent to-[#204168]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-2 left-2 w-3 h-3 bg-[#37c2cc] rounded-full opacity-0 group-hover:opacity-100 animate-pulse"></div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ delay: 1.8, duration: 0.8, type: "spring" }}
                  whileHover={{ 
                    scale: 1.04, 
                    rotateY: 4,
                    boxShadow: "0 25px 50px rgba(55, 194, 204, 0.4)"
                  }}
                  className="col-span-1 row-span-2 rounded-xl border-2 border-gray-600/50 hover:border-[#37c2cc]/80 transition-all duration-500 cursor-pointer relative overflow-hidden group"
                >
                  <Image 
                    src={images[7]} 
                    alt="CodeRush moment" 
                    fill 
                    className="object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#37c2cc]/12 via-transparent to-[#204168]/12 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </motion.div>

                {/* Continue with enhanced styling for remaining grid items... */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ delay: 1.9, duration: 0.8, type: "spring" }}
                  whileHover={{ 
                    scale: 1.02, 
                    rotateY: -2,
                    boxShadow: "0 30px 60px rgba(55, 194, 204, 0.5)"
                  }}
                  className="col-span-3 row-span-2 rounded-xl border-2 border-gray-600/50 hover:border-[#37c2cc]/80 transition-all duration-500 cursor-pointer relative overflow-hidden group"
                >
                  <Image 
                    src={images[2]} 
                    alt="CodeRush moment" 
                    fill 
                    className="object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#37c2cc]/20 via-transparent to-[#204168]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#37c2cc] rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ delay: 2.0, duration: 0.8, type: "spring" }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: 5,
                    boxShadow: "0 20px 40px rgba(55, 194, 204, 0.3)"
                  }}
                  className="col-span-2 row-span-1 rounded-xl border-2 border-gray-600/50 hover:border-[#37c2cc]/80 transition-all duration-500 cursor-pointer relative overflow-hidden group"
                >
                  <Image 
                    src={images[8]} 
                    alt="CodeRush moment" 
                    fill 
                    className="object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#37c2cc]/10 via-transparent to-[#204168]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ delay: 2.1, duration: 0.8, type: "spring" }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: -5,
                    boxShadow: "0 20px 40px rgba(55, 194, 204, 0.3)"
                  }}
                  className="col-span-1 row-span-1 rounded-xl border-2 border-gray-600/50 hover:border-[#37c2cc]/80 transition-all duration-500 cursor-pointer relative overflow-hidden group"
                >
                  <Image 
                    src={images[9]} 
                    alt="CodeRush moment" 
                    fill 
                    className="object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#37c2cc]/10 via-transparent to-[#204168]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </motion.div>

                {/* Continue with remaining grid items with similar enhanced styling */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ delay: 2.2, duration: 0.8, type: "spring" }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: 3,
                    boxShadow: "0 20px 40px rgba(55, 194, 204, 0.3)"
                  }}
                  className="col-span-1 row-span-1 rounded-xl border-2 border-gray-600/50 hover:border-[#37c2cc]/80 transition-all duration-500 cursor-pointer relative overflow-hidden group"
                >
                  <Image 
                    src={images[10]} 
                    alt="CodeRush moment" 
                    fill 
                    className="object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#37c2cc]/10 via-transparent to-[#204168]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ delay: 2.3, duration: 0.8, type: "spring" }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: -3,
                    boxShadow: "0 20px 40px rgba(55, 194, 204, 0.3)"
                  }}
                  className="col-span-1 row-span-1 rounded-xl border-2 border-gray-600/50 hover:border-[#37c2cc]/80 transition-all duration-500 cursor-pointer relative overflow-hidden group"
                >
                  <Image 
                    src={images[11]} 
                    alt="CodeRush moment" 
                    fill 
                    className="object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#37c2cc]/10 via-transparent to-[#204168]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ delay: 2.4, duration: 0.8, type: "spring" }}
                  whileHover={{ 
                    scale: 1.03, 
                    rotateY: 2,
                    boxShadow: "0 25px 50px rgba(55, 194, 204, 0.4)"
                  }}
                  className="col-span-3 row-span-2 rounded-xl border-2 border-gray-600/50 hover:border-[#37c2cc]/80 transition-all duration-500 cursor-pointer relative overflow-hidden group"
                >
                  <Image 
                    src={images[12]} 
                    alt="CodeRush moment" 
                    fill 
                    className="object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#37c2cc]/20 via-transparent to-[#204168]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-2 right-2 w-3 h-3 bg-[#37c2cc] rounded-full opacity-0 group-hover:opacity-100 animate-pulse"></div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ delay: 2.5, duration: 0.8, type: "spring" }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: 5,
                    boxShadow: "0 20px 40px rgba(55, 194, 204, 0.3)"
                  }}
                  className="col-span-1 row-span-1 rounded-xl border-2 border-gray-600/50 hover:border-[#37c2cc]/80 transition-all duration-500 cursor-pointer relative overflow-hidden group"
                >
                  <Image 
                    src={images[13]} 
                    alt="CodeRush moment" 
                    fill 
                    className="object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#37c2cc]/10 via-transparent to-[#204168]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ delay: 2.6, duration: 0.8, type: "spring" }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: -5,
                    boxShadow: "0 20px 40px rgba(55, 194, 204, 0.3)"
                  }}
                  className="col-span-2 row-span-1 rounded-xl border-2 border-gray-600/50 hover:border-[#37c2cc]/80 transition-all duration-500 cursor-pointer relative overflow-hidden group"
                >
                  <Image 
                    src={images[14]} 
                    alt="CodeRush moment" 
                    fill 
                    className="object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#37c2cc]/10 via-transparent to-[#204168]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ delay: 2.7, duration: 0.8, type: "spring" }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: 3,
                    boxShadow: "0 20px 40px rgba(55, 194, 204, 0.3)"
                  }}
                  className="col-span-1 row-span-1 rounded-xl border-2 border-gray-600/50 hover:border-[#37c2cc]/80 transition-all duration-500 cursor-pointer relative overflow-hidden group"
                >
                  <Image 
                    src={images[0]} 
                    alt="CodeRush moment" 
                    fill 
                    className="object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#37c2cc]/10 via-transparent to-[#204168]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ delay: 2.8, duration: 0.8, type: "spring" }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: -3,
                    boxShadow: "0 20px 40px rgba(55, 194, 204, 0.3)"
                  }}
                  className="col-span-2 row-span-1 rounded-xl border-2 border-gray-600/50 hover:border-[#37c2cc]/80 transition-all duration-500 cursor-pointer relative overflow-hidden group"
                >
                  <Image 
                    src={images[1]} 
                    alt="CodeRush moment" 
                    fill 
                    className="object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#37c2cc]/10 via-transparent to-[#204168]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ delay: 2.9, duration: 0.8, type: "spring" }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: 5,
                    boxShadow: "0 20px 40px rgba(55, 194, 204, 0.3)"
                  }}
                  className="col-span-1 row-span-1 rounded-xl border-2 border-gray-600/50 hover:border-[#37c2cc]/80 transition-all duration-500 cursor-pointer relative overflow-hidden group"
                >
                  <Image 
                    src={images[2]} 
                    alt="CodeRush moment" 
                    fill 
                    className="object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#37c2cc]/10 via-transparent to-[#204168]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ delay: 3.0, duration: 0.8, type: "spring" }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: -5,
                    boxShadow: "0 20px 40px rgba(55, 194, 204, 0.3)"
                  }}
                  className="col-span-1 row-span-1 rounded-xl border-2 border-gray-600/50 hover:border-[#37c2cc]/80 transition-all duration-500 cursor-pointer relative overflow-hidden group"
                >
                  <Image 
                    src={images[3]} 
                    alt="CodeRush moment" 
                    fill 
                    className="object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#37c2cc]/10 via-transparent to-[#204168]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Code Editor Style Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex-1 max-w-2xl"
          >
            {/* Code Editor Window */}
            <div className="bg-[#1e1e1e] border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
              {/* Editor Header */}
              <div className="bg-[#2d2d30] border-b border-gray-700 px-4 py-3 flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-gray-400 text-sm font-mono">coderush_2025.js</span>
                <div className="ml-auto flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#37c2cc] rounded-full animate-pulse"></div>
                  <span className="text-[#37c2cc] text-xs font-mono">Running...</span>
                </div>
              </div>

              {/* Code Content */}
              <div className="p-6 font-mono text-sm">
                {/* Line Numbers */}
                <div className="flex">
                  <div className="text-gray-500 select-none pr-4 text-right min-w-[3rem]">
                    <div>1</div>
                    <div>2</div>
                    <div>3</div>
                    <div>4</div>
                    <div>5</div>
                    <div>6</div>
                    <div>7</div>
                    <div>8</div>
                    <div>9</div>
                    <div>10</div>
                    <div>11</div>
                    <div>12</div>
                    <div>13</div>
                    <div>14</div>
                    <div>15</div>
                  </div>
                  
                  {/* Code Content */}
                  <div className="flex-1">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5 }}
                    >
                      <span className="text-purple-400">const</span> <span className="text-blue-400">codeRush2025</span> <span className="text-white">=</span> <span className="text-yellow-400">{"{"}</span>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.7 }}
                      className="pl-4"
                    >
                      <span className="text-green-400">event</span><span className="text-white">:</span> <span className="text-orange-400">&quot;Ultimate 24-hour Coding Challenge&quot;</span><span className="text-white">,</span>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.9 }}
                      className="pl-4"
                    >
                      <span className="text-green-400">organizer</span><span className="text-white">:</span> <span className="text-orange-400">&quot;Faculty of IT INTECS&quot;</span><span className="text-white">,</span>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.1 }}
                      className="pl-4"
                    >
                      <span className="text-green-400">platform</span><span className="text-white">:</span> <span className="text-orange-400">&quot;HackerRank&quot;</span><span className="text-white">,</span>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.3 }}
                      className="pl-4"
                    >
                      <span className="text-green-400">duration</span><span className="text-white">:</span> <span className="text-cyan-400">24</span> <span className="text-gray-400">{`// hours`}</span>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.5 }}
                      className="pl-4"
                    >
                      <span className="text-green-400">features</span><span className="text-white">:</span> <span className="text-yellow-400">[</span>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.7 }}
                      className="pl-8"
                    >
                      <span className="text-orange-400">&quot;Innovation &amp; Creativity&quot;</span><span className="text-white">,</span>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.9 }}
                      className="pl-8"
                    >
                      <span className="text-orange-400">&quot;Team Collaboration&quot;</span><span className="text-white">,</span>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 3.1 }}
                      className="pl-8"
                    >
                      <span className="text-orange-400">&quot;Problem Solving&quot;</span><span className="text-white">,</span>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 3.3 }}
                      className="pl-8"
                    >
                      <span className="text-orange-400">&quot;Technology Excellence&quot;</span>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 3.5 }}
                      className="pl-4"
                    >
                      <span className="text-yellow-400">]</span><span className="text-white">,</span>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 3.7 }}
                      className="pl-4"
                    >
                      <span className="text-green-400">participants</span><span className="text-white">:</span> <span className="text-orange-400">&quot;Brightest minds across the country&quot;</span><span className="text-white">,</span>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 3.9 }}
                      className="pl-4"
                    >
                      <span className="text-green-400">openFor</span><span className="text-white">:</span> <span className="text-orange-400">&quot;All skill levels - Beginners to Experts&quot;</span>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 4.1 }}
                    >
                      <span className="text-yellow-400">{"}"}</span><span className="text-white">;</span>
                    </motion.div>

                    {/* Typing Cursor */}
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ 
                        delay: 4.3,
                        duration: 1,
                        repeat: Infinity,
                        repeatType: "loop"
                      }}
                      className="text-[#37c2cc] text-lg"
                    >
                      |
                    </motion.span>
                  </div>
                </div>

                {/* Terminal Output Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 4.5 }}
                  className="mt-6 pt-4 border-t border-gray-700"
                >
                  <div className="text-gray-400 text-xs mb-2">OUTPUT:</div>
                  <motion.div
                    className="bg-black/50 rounded p-3 border-l-4 border-[#37c2cc]"
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 4.7 }}
                      className="text-[#37c2cc] text-sm"
                    >
                      ✓ Event initialized successfully
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 4.9 }}
                      className="text-green-400 text-sm"
                    >
                      ✓ Ready for registration
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 5.1 }}
                      className="text-yellow-400 text-sm"
                    >
                      ⚡ Join the ultimate coding experience!
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* Action Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 5.3 }}
                  className="mt-6"
                >
                  <motion.button
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: "0 0 20px rgba(55, 194, 204, 0.5)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-[#37c2cc] to-[#204168] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 font-mono"
                  >
                    {'>> Execute Registration'}
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
