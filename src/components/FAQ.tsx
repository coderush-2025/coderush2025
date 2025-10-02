"use client";

import React, { useState, useEffect, useRef } from "react";

interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    itemRefs.current.forEach((ref, index) => {
      if (ref) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setTimeout(() => {
                  setVisibleItems((prev) => new Set(prev).add(index));
                }, index * 100); // Stagger animation by 100ms per item
              }
            });
          },
          { threshold: 0.1 }
        );

        observer.observe(ref);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  const faqData: FAQItem[] = [
    // Eligibility & Team Formation
    {
      question: "What are the eligibility criteria ?",
      answer: "Only FIT undergraduates (B21, B22, B23, B24) from University of Moratuwa",
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
  const categories = Array.from(new Set(faqData.map((item) => item.category)));

  return (
    <section className="relative py-20 px-4 bg-slate-900 overflow-hidden">
      {/* Background pattern/gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>

      <div className="relative max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-wider">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-500 drop-shadow-lg">
              FREQUENTLY ASKED QUESTIONS
            </span>
          </h2>
          <p className="text-gray-400 text-lg mt-4">
            Everything you need to know about CodeRush 2025
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto space-y-8">
          {categories.map((category, catIndex) => (
            <div key={catIndex} className="space-y-4">
              {/* Category Header */}
              <h3 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center gap-2 py-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                {category}
              </h3>

              {/* Questions in this category */}
              <div className="space-y-3">
                {faqData
                  .filter((item) => item.category === category)
                  .map((faq, index) => {
                    const globalIndex = faqData.indexOf(faq);
                    const isOpen = openIndex === globalIndex;
                    const isVisible = visibleItems.has(globalIndex);

                    return (
                      <div
                        key={globalIndex}
                        ref={(el) => {
                          itemRefs.current[globalIndex] = el;
                        }}
                        className={`bg-gradient-to-r from-slate-800/50 to-slate-800/30 backdrop-blur-sm border-2 border-cyan-400/30 rounded-xl overflow-hidden transition-all duration-500 hover:border-cyan-400/80 hover:shadow-lg hover:shadow-cyan-400/20 hover:scale-[1.02] transform ${
                          isVisible
                            ? "translate-y-0 opacity-100"
                            : "translate-y-8 opacity-0"
                        }`}
                      >
                        {/* Question Button */}
                        <button
                          onClick={() => toggleFAQ(globalIndex)}
                          className="w-full flex items-center justify-between p-5 text-left group"
                          aria-expanded={isOpen}
                        >
                          <span className="text-white font-medium text-base md:text-lg pr-4 group-hover:text-cyan-300 transition-colors duration-300">
                            {faq.question}
                          </span>
                          <div
                            className={`flex-shrink-0 transition-transform duration-300 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          >
                            <svg
                              className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300"
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
                          <div className={`px-5 pb-5 pt-0 transform transition-all duration-500 ${
                            isOpen ? "translate-y-0" : "-translate-y-4"
                          }`}>
                            <div className="border-t border-cyan-400/30 pt-4 mt-2">
                              <div className="bg-slate-700/30 rounded-lg p-4 border-l-4 border-cyan-400">
                                <div className="flex items-start gap-3">
                                  <p className="text-gray-200 text-base leading-relaxed">
                                    {faq.answer}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-20 w-1 h-1 bg-teal-400 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute bottom-32 left-20 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse delay-500"></div>
      <div className="absolute bottom-20 right-32 w-2 h-2 bg-teal-300 rounded-full animate-pulse delay-700"></div>
    </section>
  );
};

export default FAQ;
