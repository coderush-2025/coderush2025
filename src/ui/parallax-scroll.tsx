/* eslint-disable @next/next/no-img-element */
"use client";

import { useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";
import { BlurFade } from "../components/BlurFade";
import { WobbleCard } from "./wobble-card";

export const ParallaxScroll = ({
  images,
  className,
}: {
  images: string[];
  className?: string;
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    container: gridRef, // remove this if your container is not fixed height
    offset: ["start start", "end start"], // remove this if your container is not fixed height
  });

  const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const translateSecond = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const translateThird = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const third = Math.ceil(images.length / 3);

  const firstPart = images.slice(0, third);
  const secondPart = images.slice(third, 2 * third);
  const thirdPart = images.slice(2 * third);

  return (
    <div
      className={cn("h-[80vh] items-start overflow-y-auto w-full", className)}
      ref={gridRef}
    >
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start max-w-6xl mx-auto gap-6 py-20 px-6"
        ref={gridRef}
      >
        <div className="grid gap-6">
          {firstPart.map((el, idx) => (
            <motion.div
              style={{ y: translateFirst }} // Apply the translateY motion value here
              key={"grid-1" + idx}
            >
              <BlurFade delay={0.25 + idx * 0.05} inView>
                <WobbleCard containerClassName="w-full h-[35vh] bg-gradient-to-br from-[#204168]/20 to-[#37c2cc]/20 backdrop-blur-sm rounded-2xl overflow-hidden">
                  <img
                    src={el}
                    className="h-full w-full object-cover object-center rounded-2xl !m-0 !p-0"
                    alt="thumbnail"
                  />
                </WobbleCard>
              </BlurFade>
            </motion.div>
          ))}
        </div>
        <div className="grid gap-6">
          {secondPart.map((el, idx) => (
            <motion.div style={{ y: translateSecond }} key={"grid-2" + idx}>
              <BlurFade delay={0.25 + (firstPart.length + idx) * 0.05} inView>
                <WobbleCard containerClassName="w-full h-[35vh] bg-gradient-to-br from-[#0e243f]/20 to-[#204168]/20 backdrop-blur-sm rounded-2xl overflow-hidden">
                  <img
                    src={el}
                    className="h-full w-full object-cover object-center rounded-2xl !m-0 !p-0"
                    alt="thumbnail"
                  />
                </WobbleCard>
              </BlurFade>
            </motion.div>
          ))}
        </div>
        <div className="grid gap-6">
          {thirdPart.map((el, idx) => (
            <motion.div style={{ y: translateThird }} key={"grid-3" + idx}>
              <BlurFade delay={0.25 + (firstPart.length + secondPart.length + idx) * 0.05} inView>
                <WobbleCard containerClassName="w-full h-[35vh] bg-gradient-to-br from-[#37c2cc]/20 to-cyan-400/20 backdrop-blur-sm rounded-2xl overflow-hidden">
                  <img
                    src={el}
                    className="h-full w-full object-cover object-center rounded-2xl !m-0 !p-0"
                    alt="thumbnail"
                  />
                </WobbleCard>
              </BlurFade>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};