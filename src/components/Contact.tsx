"use client";

import React from "react";
import { motion } from "framer-motion";

// Organizer type
type Organizer = {
  id: number;
  name: string;
  photo: string;
  phone: string;
  email: string;
};

const organizers: Organizer[] = [
  {
    id: 1,
    name: "Ishan Hansaka",
    photo: "/ishan.jpg",
    phone: "0775437008",
    email: "silvahih.22@uom.lk",
  },
  {
    id: 2,
    name: "Kenuka Karunakaran",
    photo: "/kenuka.png",
    phone: "0767508136",
    email: "karunakarank.22@uom.lk",
  },
  {
    id: 3,
    name: "Nimesh Madhusanka",
    photo: "/nimesh.jpg",
    phone: "0788722847",
    email: "madhusankanan.22@uom.lk",
  },
];

const Contact: React.FC = () => {
  return (
    <section className="relative py-12 sm:py-14 md:py-16" style={{ background: "linear-gradient(180deg, #0e243f 0%, #204168 50%, #0e243f 100%)" }}>
      {/* Decorative background effect */}
      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-20 relative z-10">
        {/* Heading with fixed descenders */}
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center mb-2 text-gradient bg-gradient-to-r from-[#37c2cc] via-white to-[#37c2cc] bg-clip-text text-transparent drop-shadow-lg leading-snug overflow-visible"
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          CONTACT US
        </motion.h2>
        <motion.div
          className="text-center mb-8 sm:mb-10 md:mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="text-base sm:text-lg md:text-xl text-white font-medium px-4">
            Have Questions? Reach Out to Our Team
          </p>
        </motion.div>

        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto items-stretch">
          {organizers.map((org, index) => (
            <motion.div
              key={org.id}
              className="bg-gradient-to-br from-[#204168]/80 to-[#0e243f]/50 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 flex flex-col items-center justify-between text-center border border-[#37c2cc]/30 hover:shadow-3xl hover:border-[#37c2cc]/60 transition-all duration-300 h-full"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.6,
                delay: index * 0.2,
                ease: "easeOut",
              }}
            >
              <div className="flex flex-col items-center flex-1">
                <motion.img
                  src={org.photo}
                  alt={org.name}
                  className="w-40 h-40 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-full object-cover mb-4 sm:mb-5 border-2 border-[#37c2cc] shadow-2xl flex-shrink-0"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
                <h3 className="text-xl sm:text-2xl font-semibold text-[#37c2cc] mb-3 min-h-[2em] flex items-center">
                  {org.name}
                </h3>
                <div className="space-y-2 mb-5 sm:mb-6 flex-1 flex flex-col justify-center">
                  <p className="text-gray-300 text-sm sm:text-base font-medium">{org.phone}</p>
                  <p className="text-gray-400 text-xs sm:text-sm break-words max-w-full px-2">{org.email}</p>
                </div>
              </div>

              <motion.a
                href={`mailto:${org.email}`}
                className="px-5 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-[#37c2cc] to-[#2ba8b3] text-[#0e243f] font-semibold rounded-full shadow-[#37c2cc]/50 transition-transform duration-300 hover:shadow-lg hover:shadow-[#37c2cc]/40 text-sm sm:text-base mt-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Send Mail
              </motion.a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact;
