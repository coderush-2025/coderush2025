"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  FaCalendarAlt,
  FaRegClock,
  FaTrophy,
  FaFlagCheckered,
} from "react-icons/fa";

type TimelineEvent = {
  id: string;
  title: string;
  date: string;
  time?: string;
  description?: string;
  icon: React.ReactNode;
  accent?: string;
  ctaHref?: string;
};

const events: TimelineEvent[] = [
  {
    id: "reg-open",
    title: "Registration Opens",
    date: "Oct 10, 2025",
    time: "10:00 AM",
    description: "Sign-ups open. Head to the register page to join the rush.",
    icon: <FaRegClock />,
    accent: "#37c2cc",
    ctaHref: "/register",
  },
  {
    id: "reg-close",
    title: "Registration Closes",
    date: "Nov 7, 2025",
    time: "11:59 PM",
    description:
      "Final cut-off for team registrations. \nMake sure your team is listed.",
    icon: <FaFlagCheckered />,
    accent: "#2ba8b3",
  },
  {
    id: "hack-day",
    title: "Hackathon\nDay",
    date: "Nov 15, 2025",
    time: "09:00 AM",
    description:
      "24 hours of hacking with mentors and checkpoints. \nBring your A-game!",
    icon: <FaCalendarAlt />,
    accent: "#2f5f87",
  },
  {
    id: "awards",
    title: "Awards Ceremony",
    date: "Nov 16, 2025",
    time: "18:00 PM",
    description: "Prizes, demos and closing remarks. \nCelebrate the winners.",
    icon: <FaTrophy />,
    accent: "#f5a623",
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const stepVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.99 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.56, ease: [0.22, 1, 0.36, 1] as unknown as any },
  },
  hover: { scale: 1.02 },
};

export default function Timeline() {
  const router = useRouter();

  return (
    <section
      aria-label="Event timeline"
      className="relative py-20 px-6 md:px-12 lg:px-20"
      style={{
        background:
          "linear-gradient(180deg,#071826 0%, rgba(8,20,38,0.88) 50%, #041522 100%)",
      }}
    >
      {/* decorative orbs */}
      <motion.div
        aria-hidden
        initial={{ y: 0, opacity: 0.12 }}
        animate={{ y: [-6, 6, -6], opacity: [0.08, 0.14, 0.08] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          right: "6%",
          top: "10%",
          width: 220,
          height: 220,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 30% 30%, rgba(55,194,204,0.12), transparent 45%)",
          filter: "blur(36px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <motion.div
        aria-hidden
        initial={{ y: 0, opacity: 0.1 }}
        animate={{ y: [6, -6, 6], opacity: [0.06, 0.12, 0.06] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          left: "4%",
          bottom: "8%",
          width: 180,
          height: 180,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 20% 20%, rgba(32,65,104,0.12), transparent 45%)",
          filter: "blur(28px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 lg:mb-24">
          <h2
            className="text-3xl md:text-4xl font-extrabold"
            style={{
              background:
                "linear-gradient(90deg,#ffffff 0%, #37c2cc 45%, #ffffff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Key Dates & Timeline
          </h2>
          <p className="mt-3 text-sm md:text-base text-slate-200 max-w-2xl mx-auto">
            Important deadlines and event days - plan ahead and don't miss out.
          </p>
        </div>

        {/* Desktop horizontal timeline */}
        <motion.div
          className="hidden md:block relative"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* subtle glow behind the line */}
          <div
            className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-3 pointer-events-none"
            style={{
              filter: "blur(14px)",
              opacity: 0.18,
              boxShadow: "0 10px 40px rgba(55,194,204,0.12)",
            }}
            aria-hidden
          />

          {/* connecting line */}
          <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 flex items-center">
            <div
              className="h-1 w-full rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, rgba(55,194,204,0.98) 0%, rgba(37,160,176,0.9) 30%, rgba(20,120,150,0.85) 65%, rgba(10,24,44,1) 100%)",
                boxShadow: "0 8px 30px rgba(37,160,176,0.12)",
              }}
            />
          </div>

          <div className="relative z-10 grid grid-cols-4 gap-6 items-stretch">
            {events.map((ev, idx) => (
              <motion.article
                key={ev.id}
                className="group relative"
                variants={stepVariants}
                whileHover="hover"
                style={{ zIndex: 10, ["--accent" as any]: ev.accent }}
              >
                {/* subtle decorative overlay on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 20% 20%, ${ev.accent} 0%, rgba(10,20,40,0.82) 55%)`,
                    mixBlendMode: "screen",
                  }}
                />

                {/* Icon badge */}
                <div
                  className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center justify-center"
                  aria-hidden
                >
                  <motion.div
                    initial={{ scale: 0.96, opacity: 0.95 }}
                    animate={{ scale: [1, 1.04, 1], rotate: [0, 4, -4, 0] }}
                    transition={{
                      duration: 3.8,
                      repeat: Infinity,
                      ease: [0.42, 0, 0.58, 1] as unknown as any,
                    }}
                    className="flex items-center justify-center rounded-full p-3"
                    style={{
                      background: `radial-gradient(circle at 30% 20%, ${ev.accent} 0%, rgba(10,20,40,0.88) 65%)`,
                      width: 78,
                      height: 78,
                      color: "#fff",
                      boxShadow: `0 10px 30px ${
                        idx === 0
                          ? "rgba(55,194,204,0.18)"
                          : "rgba(3,7,18,0.36)"
                      }`,
                      border: "1px solid rgba(255,255,255,0.02)",
                    }}
                  >
                    <div className="text-2xl md:text-3xl">{ev.icon}</div>
                  </motion.div>
                </div>

                {/* Card */}
                <motion.div
                  className="mt-10 px-5 py-3 rounded-2xl border transition-shadow duration-300 w-full h-full flex flex-col relative"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(5,12,22,0.9), rgba(12,26,46,0.94))",
                    borderColor: "rgba(55,194,204,0.04)",
                    minHeight: 128,
                    backdropFilter: "saturate(120%) blur(6px)",
                  }}
                  whileHover={{ boxShadow: "0 22px 60px rgba(2,8,20,0.55)" }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3
                        className="text-lg md:text-xl font-semibold text-white leading-tight transition-all duration-250 transform group-hover:-translate-y-1 group-hover:tracking-wider"
                        style={{
                          transitionProperty:
                            "transform, color, letter-spacing",
                        }}
                      >
                        <span className="block group-hover:[color:var(--accent)]">
                          {ev.title.split("\n").map((part, i, arr) => (
                            <React.Fragment key={i}>
                              <span>{part}</span>
                              {i < arr.length - 1 && <br />}
                            </React.Fragment>
                          ))}
                        </span>
                      </h3>

                      <div className="text-xs text-slate-300 mt-1">
                        <time dateTime={ev.date}>{ev.date}</time>
                        {ev.time ? <span className="mx-2">•</span> : null}
                        {ev.time ? (
                          <span className="text-slate-400">{ev.time}</span>
                        ) : null}
                      </div>
                    </div>

                    {/* accent pill */}
                    <div
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background: `linear-gradient(90deg, ${ev.accent} 0%, rgba(255,255,255,0.02) 100%)`,
                        color: "#041826",
                        boxShadow: "0 6px 18px rgba(2,6,12,0.45)",
                      }}
                    >
                      {idx === 0
                        ? "Open"
                        : idx === 1
                        ? "Deadline"
                        : idx === 2
                        ? "Event"
                        : "Ceremony"}
                    </div>
                  </div>

                  <p className="mt-2 text-sm text-slate-200/90 flex-1 transition-colors duration-200 group-hover:text-white">
                    {ev.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-xs text-slate-300 font-medium">
                      Save the date
                    </div>

                    {ev.ctaHref ? (
                      <button
                        onClick={() => router.push(ev.ctaHref!)}
                        className="text-xs font-semibold px-3 h-8 flex items-center rounded-md shadow-sm"
                        style={{
                          background:
                            "linear-gradient(90deg,#37c2cc 0%, #2ba8b3 100%)",
                          color: "#0e243f",
                          boxShadow: "0 8px 30px rgba(55,194,204,0.12)",
                        }}
                        aria-label={`Go to ${ev.title}`}
                      >
                        Register
                      </button>
                    ) : (
                      <div className="w-0" />
                    )}
                  </div>
                </motion.div>

                {/* connector dot */}
                <div
                  className="absolute -bottom-6 left-1/2 -translate-x-1/2 rounded-full w-3 h-3"
                  style={{
                    background: ev.accent,
                    opacity: 0.95,
                    boxShadow: "0 6px 14px rgba(0,0,0,0.6)",
                  }}
                  aria-hidden
                />
              </motion.article>
            ))}
          </div>
        </motion.div>

        {/* Mobile vertical timeline */}
        <motion.ol
          className="md:hidden relative space-y-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={container}
        >
          {events.map((ev) => (
            <motion.li
              key={ev.id}
              className="flex items-start gap-4"
              variants={stepVariants}
              whileHover="hover"
            >
              <div className="flex-shrink-0">
                <div
                  className="flex items-center justify-center rounded-full w-14 h-14 text-white shadow"
                  style={{
                    background: `linear-gradient(180deg, ${ev.accent}, #204168)`,
                    boxShadow: "0 6px 20px rgba(3,7,18,0.5)",
                  }}
                >
                  <span className="text-xl">{ev.icon}</span>
                </div>
              </div>

              <div className="flex-1">
                <div
                  className="bg-[rgba(8,20,32,0.9)] p-4 rounded-2xl border"
                  style={{ borderColor: "rgba(55,194,204,0.04)" }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">
                      {ev.title.split("\n").map((p, i, a) => (
                        <React.Fragment key={i}>
                          <span>{p}</span>
                          {i < a.length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </h3>
                    <time className="text-sm text-slate-200">{ev.date}</time>
                  </div>
                  <p className="mt-1 text-sm text-slate-200/90">
                    {ev.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span
                      className="inline-block px-3 py-1 text-xs rounded-md"
                      style={{
                        background: "rgba(55,194,204,0.06)",
                        color: "#37c2cc",
                      }}
                    >
                      {ev.time}
                    </span>
                    {ev.ctaHref && (
                      <button
                        onClick={() => router.push(ev.ctaHref!)}
                        className="text-xs font-semibold px-3 py-1 rounded-md"
                        style={{
                          background:
                            "linear-gradient(90deg,#37c2cc 0%, #2ba8b3 100%)",
                          color: "#0e243f",
                        }}
                      >
                        Register
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.li>
          ))}
        </motion.ol>

        {/* Spacing */}
        <div className="h-12 md:h-16 lg:h-24" />
      </div>
    </section>
  );
}
