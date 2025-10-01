import React from "react";

const HowItWorks = () => {
  const steps = [
    "CodeRush 2025 will be conducted entirely on the HackerRank platform.",
    "Each team must consist of four registered participants.",
    "All participants are required to have an active HackerRank account before the event.",
    "Contest links and access instructions will be sent via email prior to the start of the competition.",
    "The hackathon will feature a series of programming challenges to be solved within a limited time.",
    "Team members may collaborate on strategy, but each participant must submit their own solutions.",
    "Scores will be calculated based on the correctness and speed of submissions.",
    "Final rankings will be displayed on a live leaderboard throughout the contest.",
    "Top-performing teams will be officially recognized and awarded.",
  ];

  return (
    <section className="relative py-20 px-4 bg-slate-900 overflow-hidden">
      {/* Background pattern/gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>

      <div className="relative max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-wider">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-500 drop-shadow-lg">
              HOW IT WORKS
            </span>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left side - Character illustration placeholder */}
          <div className="lg:w-1/3 flex justify-center">
            <div className="relative">
              {/* Character placeholder - you can replace this with actual illustration */}
              <div className="w-72 h-96 bg-gradient-to-br from-cyan-400/20 to-teal-500/20 rounded-3xl border border-cyan-400/30 flex items-center justify-center backdrop-blur-sm">
                <div className="text-center">
                  <div className="w-24 h-24 bg-cyan-400/30 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-4xl">👨‍💻</span>
                  </div>
                  <div className="w-20 h-16 bg-cyan-500/40 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <span className="text-xs text-cyan-200 font-mono">
                      CODE RUSH
                    </span>
                  </div>
                  <p className="text-cyan-300 text-sm">2025</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Steps */}
          <div className="lg:w-2/3 space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-4 group">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-4 h-4 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50 group-hover:scale-110 transition-transform duration-300"></div>
                </div>
                <p className="text-white text-base leading-relaxed font-medium group-hover:text-cyan-100 transition-colors duration-300">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA section */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-gradient-to-r from-cyan-500/10 to-teal-500/10 backdrop-blur-sm border border-cyan-400/30 rounded-2xl p-8">
            <h3 className="text-lg font-bold text-cyan-400 mb-3">
              Ready to Join the Rush?
            </h3>
            <p className="text-gray-300 mb-6 max-w-lg mx-auto text-sm">
              Gather your team of four and prepare for the ultimate coding
              challenge on HackerRank!
            </p>
            <button className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-900 font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-400/25 text-sm">
              Register Your Team
            </button>
          </div>
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

export default HowItWorks;
