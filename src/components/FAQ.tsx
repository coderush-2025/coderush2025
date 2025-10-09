"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>("Eligibility & Team Formation");

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqData: FAQItem[] = [
    // Eligibility & Team Formation
    {
      question: "What are the eligibility criteria ?",
      answer: "Only FIT undergraduates (B23, B24) from University of Moratuwa",
      category: "Eligibility & Team Formation",
    },
    {
      question: "Can graduating students participate ?",
      answer: "No",
      category: "Eligibility & Team Formation",
    },
    {
      question: "How many members can a team have ?",
      answer: "Exactly 4 members per team (mandatory)",
      category: "Eligibility & Team Formation",
    },
    {
      question: "Can I participate individually (without a team) ?",
      answer: "No, you must form a team of 4 members",
      category: "Eligibility & Team Formation",
    },
    {
      question: "Can we change team members after registration / during the competition ?",
      answer: "No team changes allowed after registration",
      category: "Eligibility & Team Formation",
    },
    {
      question: "What if a team member can't join ?",
      answer: "Other team members can still participate",
      category: "Eligibility & Team Formation",
    },

    // Registration
    {
      question: "What information is needed during registration ?",
      answer: "Team name, member names, batch, index numbers, HackerRank usernames (format: teamname_CR)",
      category: "Registration",
    },
    {
      question: "How does the registration process work ?",
      answer: "Registration is done through an interactive chatbot. You'll provide: team name, HackerRank username, select your batch, then enter details for all 4 members (full name, index number, email). After reviewing, you confirm and receive an email confirmation",
      category: "Registration",
    },
    {
      question: "Can I edit my registration after submission ?",
      answer: "Yes! After successful registration, you can click 'Edit Details' to update any information. A new confirmation email will be sent automatically after editing",
      category: "Registration",
    },
    {
      question: "What happens if my team name or HackerRank username is already taken ?",
      answer: "Team names and HackerRank usernames must be unique. If your choice is already registered, you'll be asked to choose a different name immediately during registration",
      category: "Registration",
    },
    {
      question: "Can the same index number or email be used for multiple teams ?",
      answer: "No, each index number and email can only be registered once across all teams. All members must have unique index numbers and email addresses",
      category: "Registration",
    },
    {
      question: "Is there a maximum number of teams that can register ?",
      answer: "Yes, registration is limited to 100 teams maximum. Register early to secure your spot!",
      category: "Registration",
    },

    // Event Format & Logistics
    {
      question: "What is the format / structure of the event ?",
      answer: "Physical on-site competition at Faculty of IT, UoM",
      category: "Event Format & Logistics",
    },
    {
      question: "Which platforms will be used ?",
      answer: "HackerRank",
      category: "Event Format & Logistics",
    },
    {
      question: "How to create a HackerRank account ?",
      answer: "Visit hackerrank.com, sign up, use username format: teamname_CR",
      category: "Event Format & Logistics",
    },
    {
      question: "Do we need to bring our own devices ?",
      answer: "Yes, bring your own laptops and power cords",
      category: "Event Format & Logistics",
    },
    {
      question: "Is Internet access allowed ?",
      answer: "Yes, internet access is allowed. You can also bring your own routers",
      category: "Event Format & Logistics",
    },
    {
      question: "Are there any constraints on time / memory / languages ?",
      answer: "Standard HackerRank constraints apply",
      category: "Event Format & Logistics",
    },
    {
      question: "Can we use AI / generative tools (ChatGPT, Copilot) ?",
      answer: "Yes, AI tools are allowed",
      category: "Event Format & Logistics",
    },
    {
      question: "What are the security / plagiarism / cheating policies ?",
      answer: "Cannot join from different HackerRank accounts; must use registered account only",
      category: "Event Format & Logistics",
    },
    {
      question: "Will partial submissions / incremental submissions be allowed ?",
      answer: "Yes, multiple submissions allowed on HackerRank",
      category: "Event Format & Logistics",
    },
    {
      question: "Will participants get certificates / swag ?",
      answer: "Top 10 teams get printed certificates, others receive e-certificates",
      category: "Event Format & Logistics",
    },
  ];

  // Group FAQs by category
  const categories = Array.from(
    new Set(faqData.map((item) => item.category).filter((cat): cat is string => cat !== undefined))
  );

  return (
    <section className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 overflow-hidden" style={{ background: "linear-gradient(180deg, #0e243f 0%, #204168 50%, #0e243f 100%)" }}>

      <div className="relative max-w-7xl mx-auto">
        {/* Title */}
        <motion.div
          className="text-center mb-10 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-3 sm:mb-4 tracking-wider px-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#37c2cc] via-white to-[#37c2cc] drop-shadow-lg">
              FREQUENTLY ASKED QUESTIONS
            </span>
          </h2>
          <p className="text-gray-300 text-sm sm:text-base md:text-lg mt-3 sm:mt-4 px-2">
            Everything you need to know about CodeRush 2025
          </p>
        </motion.div>

        {/* Horizontal Tabs */}
        <div className="max-w-6xl mx-auto mb-8 sm:mb-10 md:mb-12">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4">
            {categories.map((category, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setActiveTab(category);
                  setOpenIndex(null); // Close any open FAQ when switching tabs
                }}
                className={`px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg md:rounded-xl font-semibold text-xs sm:text-sm md:text-base transition-all duration-300 border-2 ${
                  activeTab === category
                    ? "bg-gradient-to-r from-[#37c2cc] to-[#2ba8b3] text-[#0e243f] border-[#37c2cc] shadow-lg shadow-[#37c2cc]/40"
                    : "bg-[#204168]/30 text-white border-[#37c2cc]/30 hover:border-[#37c2cc]/60 hover:bg-[#204168]/50"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="hidden sm:inline">{category}</span>
                <span className="sm:hidden">
                  {category === "Eligibility & Team Formation" ? "Eligibility" :
                   category === "Event Format & Logistics" ? "Event Info" :
                   category}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion - Show only active tab content */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            {faqData
              .filter((item) => item.category === activeTab)
              .map((faq, index) => {
                const globalIndex = faqData.indexOf(faq);
                const isOpen = openIndex === globalIndex;

                return (
                  <motion.div
                    key={globalIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                      ease: "easeOut"
                    }}
                    className="bg-gradient-to-r from-[#204168]/50 to-[#0e243f]/30 backdrop-blur-sm border-2 border-[#37c2cc]/30 rounded-lg md:rounded-xl overflow-hidden transition-all duration-500 hover:border-[#37c2cc]/80 hover:shadow-lg hover:shadow-[#37c2cc]/20 hover:scale-[1.02] transform"
                  >
                    {/* Question Button */}
                    <button
                      onClick={() => toggleFAQ(globalIndex)}
                      className="w-full flex items-center justify-between p-4 sm:p-5 text-left group"
                      aria-expanded={isOpen}
                    >
                      <span className="text-white font-medium text-sm sm:text-base md:text-lg pr-3 sm:pr-4 group-hover:text-[#37c2cc] transition-colors duration-300">
                        {faq.question}
                      </span>
                      <div
                        className={`flex-shrink-0 transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      >
                        <svg
                          className="w-5 h-5 sm:w-6 sm:h-6 text-[#37c2cc] group-hover:text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </button>

                    {/* Answer - Animated Dropdown */}
                    <div
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className={`px-4 sm:px-5 pb-4 sm:pb-5 pt-0 transform transition-all duration-500 ${
                        isOpen ? "translate-y-0" : "-translate-y-4"
                      }`}>
                        <div className="border-t border-[#37c2cc]/30 pt-3 sm:pt-4 mt-2">
                          <div className="bg-[#204168]/30 rounded-lg p-3 sm:p-4 border-l-2 sm:border-l-4 border-[#37c2cc]">
                            <div className="flex items-start gap-2 sm:gap-3">
                              <p className="text-gray-200 text-sm sm:text-base leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </motion.div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-[#37c2cc] rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-20 w-1 h-1 bg-[#2ba8b3] rounded-full animate-pulse delay-1000"></div>
      <div className="absolute bottom-32 left-20 w-1.5 h-1.5 bg-[#37c2cc] rounded-full animate-pulse delay-500"></div>
      <div className="absolute bottom-20 right-32 w-2 h-2 bg-[#2ba8b3] rounded-full animate-pulse delay-700"></div>
    </section>
  );
};

export default FAQ;
