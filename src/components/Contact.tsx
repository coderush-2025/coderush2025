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
    email: "Silvahih.22@uom.lk",
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
    <section className="relative py-16 bg-gradient-to-b from-blue-50 via-[#204168] to-[#37c2cc]">
      {/* Decorative background effect */}
      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10 pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-20 relative z-10">
        {/* Heading with fixed descenders */}
        <motion.h2
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-center mb-2 text-gradient bg-gradient-to-r from-[#0e243f] to-cyan-200 bg-clip-text text-transparent drop-shadow-lg leading-snug overflow-visible"
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          CONTACT US
        </motion.h2>
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="text-lg sm:text-xl text-white  font-medium">
            Have Questions? Reach Out to Our Team
          </p>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {organizers.map((org, index) => (
            <motion.div
              key={org.id}
              className="bg-gradient-to-br from-white/80 to-blue-50 backdrop-blur-lg rounded-3xl shadow-2xl p-10 flex flex-col items-center text-center border border-blue-200 hover:shadow-3xl transition-transform duration-300 mb-10"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.6,
                delay: index * 0.2,
                ease: "easeOut",
              }}
            >
              <motion.img
                src={org.photo}
                alt={org.name}
                className="w-60 h-60 rounded-full object-cover mb-5 border-2 border-blue-300 shadow-2xl"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              <h3 className="text-2xl font-semibold text-blue-800 mb-2">
                {org.name}
              </h3>
              <p className="text-gray-700 mb-1">{org.phone}</p>
              <p className="text-gray-600 mb-6">{org.email}</p>

              <motion.a
                href={`mailto:${org.email}`}
                className="px-6 py-2.5 bg-[#37c2cc] text-white rounded-full shadow-blue-600/50 transition-transform duration-300"
                whileHover={{ backgroundColor: "#0e243f" }}
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
