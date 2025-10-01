/* eslint-disable @next/next/no-img-element */
"use client";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";
import { ReactNode } from "react";

export const WobbleCard = ({
  children,
  containerClassName,
  className,
}: {
  children?: ReactNode;
  containerClassName?: string;
  className?: string;
}) => {
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-purple-700 to-violet-900 shadow-xl",
        containerClassName
      )}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{
        scale: 1.02,
        rotateX: 2,
        rotateY: 2,
      }}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        className={cn("relative h-full", className)}
        animate={{
          rotateX: [0, 1, 0, -1, 0],
          rotateY: [0, -1, 0, 1, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};