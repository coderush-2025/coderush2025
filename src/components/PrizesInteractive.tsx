'use client';

import React, { useState, useEffect } from 'react';

const PrizesInteractive = () => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const prizes = [
    {
      place: '1st',
      title: '1st Place',
      subtitle: 'Champion\'s Reward',
      description: "The champion's title and a bundle of exciting rewards await the winning team!",
      borderColor: 'border-[#37c2cc]/90',
      bgGradient: 'from-[#37c2cc]/20 via-[#204168]/30 to-[#0e243f]/35',
      textColor: 'text-[#37c2cc]',
      glowColor: 'shadow-[#37c2cc]/50',
      accentGradient: 'from-[#37c2cc] to-[#204168]',
      icon: '🏆',
      iconBg: 'bg-gradient-to-br from-[#37c2cc]/35 to-[#2ba8b3]/25',
      particles: 'bg-[#37c2cc]/60',
      rewards: ['Championship Trophy', 'Cash Prize', 'Premium Swag Pack', 'Certificate of Excellence'],
    },
    {
      place: '2nd',
      title: '2nd Place',
      subtitle: 'Runner-up Excellence',
      description: "The runner-up team won't leave empty-handed, as they'll be showered with the 2nd prize and more fantastic surprises!",
      borderColor: 'border-[#37c2cc]/80',
      bgGradient: 'from-[#37c2cc]/15 via-[#204168]/25 to-[#0e243f]/30',
      textColor: 'text-[#37c2cc]',
      glowColor: 'shadow-[#37c2cc]/40',
      accentGradient: 'from-[#37c2cc] to-[#204168]',
      icon: '🥈',
      iconBg: 'bg-gradient-to-br from-[#37c2cc]/30 to-[#204168]/20',
      particles: 'bg-[#37c2cc]/50',
      rewards: ['Silver Medal', 'Cash Prize', 'Swag Pack', 'Achievement Certificate'],
    },
    {
      place: '3rd',
      title: '3rd Place',
      subtitle: 'Bronze Achievement',
      description: 'Secure the 3rd position and claim the 3rd prize, along with some special awards waiting just for you!',
      borderColor: 'border-[#37c2cc]/80',
      bgGradient: 'from-[#37c2cc]/15 via-[#204168]/25 to-[#0e243f]/30',
      textColor: 'text-[#37c2cc]',
      glowColor: 'shadow-[#37c2cc]/40',
      accentGradient: 'from-[#37c2cc] to-[#204168]',
      icon: '🥉',
      iconBg: 'bg-gradient-to-br from-[#37c2cc]/30 to-[#204168]/20',
      particles: 'bg-[#37c2cc]/50',
      rewards: ['Bronze Medal', 'Special Recognition', 'Swag Items', 'Participation Certificate'],
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0e243f] via-[#204168] to-[#37c2cc] relative overflow-hidden">
      {/* Hero-themed Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0e243f]/20 via-[#204168]/15 to-[#37c2cc]/20"></div>
        <div className="absolute top-20 right-20 w-48 h-48 bg-[#37c2cc]/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-[#204168]/12 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-4 md:py-6">
        {/* Simplified Header */}
        <div className={`text-center mb-6 md:mb-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <div className="relative inline-block">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#37c2cc] to-white mb-3 tracking-wider
                         animate-pulse hover:scale-105 transition-all duration-300 cursor-default
                         drop-shadow-[0_0_20px_rgba(55,194,204,0.5)] hover:drop-shadow-[0_0_30px_rgba(55,194,204,0.8)]">
              PRIZES
            </h1>
            
            <div className="w-24 md:w-32 h-0.5 bg-gradient-to-r from-[#37c2cc] to-[#2ba8b3] mx-auto rounded-full 
                          animate-pulse"></div>
          </div>
          
          <p className="text-white text-xs md:text-sm lg:text-base mt-3 max-w-xl mx-auto leading-relaxed font-light opacity-90">
            Rewards await the most innovative teams in <span className="text-[#37c2cc] font-medium">CodeRush 2025</span>
          </p>
        </div>

        {/* Interactive Prize Cards Grid */}
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-6 items-start max-w-6xl mx-auto">
          
          {/* Prizes Section */}
          <div className="space-y-3 md:space-y-4">
            {prizes.map((prize, index) => (
              <div
                key={index}
                className={`group relative overflow-hidden p-4 md:p-5 rounded-xl border-2 ${prize.borderColor} 
                          bg-gradient-to-br ${prize.bgGradient} backdrop-blur-lg
                          hover:shadow-lg ${prize.glowColor} transition-all duration-500
                          hover:scale-[1.02] hover:border-opacity-100 transform-gpu cursor-pointer
                          ${selectedCard === index ? 'ring-2 ring-white/20 scale-[1.02]' : ''}
                          ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}
                          ${index === 0 ? 'border-[#37c2cc]/95 hover:shadow-[#37c2cc]/60 hover:shadow-2xl ring-2 ring-[#37c2cc]/30' : ''}
                          ${index === 1 ? 'border-[#37c2cc]/90 hover:shadow-[#37c2cc]/50 hover:shadow-2xl ring-1 ring-[#37c2cc]/20' : ''}
                          ${index === 2 ? 'border-[#37c2cc]/85 hover:shadow-[#37c2cc]/45 hover:shadow-2xl ring-1 ring-[#37c2cc]/15' : ''}`}
                style={{transitionDelay: `${index * 200}ms`}}
                onClick={() => setSelectedCard(selectedCard === index ? null : index)}
                onMouseEnter={() => setSelectedCard(index)}
                onMouseLeave={() => setSelectedCard(null)}
              >
                {/* Enhanced background for all cards */}
                {index === 0 && (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#37c2cc]/8 via-transparent to-[#2ba8b3]/12 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                )}
                {index === 1 && (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#37c2cc]/5 via-transparent to-[#204168]/10 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                )}
                {index === 2 && (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#37c2cc]/5 via-transparent to-[#204168]/10 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                )}
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Header with icon and title on same line */}
                  <div className="flex items-center gap-3 md:gap-4 mb-3">
                    <div className="relative">
                      <div className={`text-3xl md:text-4xl group-hover:animate-bounce 
                                    ${index === 0 ? 'filter drop-shadow-[0_0_12px_rgba(55,194,204,1)]' : ''}
                                    ${index === 1 ? 'filter drop-shadow-[0_0_10px_rgba(55,194,204,0.8)]' : ''}
                                    ${index === 2 ? 'filter drop-shadow-[0_0_8px_rgba(55,194,204,0.7)]' : ''}`}>
                        {prize.icon}
                      </div>
                      <span className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r ${prize.accentGradient} 
                                     group-hover:w-full transition-all duration-500 rounded-full
                                     ${index === 0 ? 'h-1.5 shadow-[0_0_12px_rgba(55,194,204,1)]' : ''}
                                     ${index === 1 ? 'h-1 shadow-[0_0_10px_rgba(55,194,204,0.8)]' : ''}
                                     ${index === 2 ? 'h-1 shadow-[0_0_8px_rgba(55,194,204,0.7)]' : ''}`}></span>
                    </div>
                    <div className="flex flex-col">
                      <h3 className={`text-lg md:text-xl lg:text-2xl font-bold ${prize.textColor} 
                                    group-hover:text-white transition-all duration-300
                                    ${index === 0 ? 'text-[#37c2cc] drop-shadow-[0_0_10px_rgba(55,194,204,0.8)]' : ''}
                                    ${index === 1 ? 'text-[#37c2cc] drop-shadow-[0_0_8px_rgba(55,194,204,0.6)]' : ''}
                                    ${index === 2 ? 'text-[#37c2cc] drop-shadow-[0_0_6px_rgba(55,194,204,0.5)]' : ''}`}>
                        {prize.title}
                      </h3>
                      <div className={`text-xs ${prize.textColor} opacity-75 font-medium
                                     ${index === 0 ? 'text-[#37c2cc]/95' : ''}
                                     ${index === 1 ? 'text-[#37c2cc]/90' : ''}
                                     ${index === 2 ? 'text-[#37c2cc]/85' : ''}`}>
                        {prize.subtitle}
                      </div>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-white text-sm md:text-base leading-relaxed
                               group-hover:text-white transition-colors duration-300">
                    {prize.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Certificate Images Showcase */}
          <div className={`flex justify-center lg:justify-end items-center min-h-[400px] md:min-h-[500px] transition-all duration-1000 ${
            isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`} style={{transitionDelay: '600ms'}}>
            <div className="relative flex items-center justify-center h-full">
              {/* Certificate images stack - matching uploaded layout */}
              <div className="relative w-80 h-64 md:w-96 md:h-80">
                {[
                  { 
                    src: '/Third place.png', 
                    alt: '3rd Place Certificate', 
                    rotation: -15, 
                    translateX: -30,
                    translateY: 20,
                    zIndex: 1 
                  },
                  { 
                    src: '/Second place.png', 
                    alt: '2nd Place Certificate', 
                    rotation: -5, 
                    translateX: 0,
                    translateY: 10,
                    zIndex: 2 
                  },
                  { 
                    src: '/First Place.png', 
                    alt: '1st Place Certificate', 
                    rotation: 8, 
                    translateX: 25,
                    translateY: 0,
                    zIndex: 3 
                  }
                ].map((cert, i) => (
                  <div
                    key={i}
                    className="absolute w-full h-full transition-all duration-500 hover:scale-105 cursor-pointer 
                             hover:z-10 group"
                    style={{
                      transform: `rotate(${cert.rotation}deg) translate(${cert.translateX}px, ${cert.translateY}px)`,
                      zIndex: cert.zIndex,
                    }}
                  >
                    <img
                      src={cert.src}
                      alt={cert.alt}
                      className="w-full h-full object-contain transition-all duration-500
                               filter drop-shadow-2xl group-hover:drop-shadow-[0_25px_50px_rgba(0,0,0,0.4)]
                               group-hover:brightness-110"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Simplified Footer */}
        <div className={`text-center mt-8 md:mt-10 transition-all duration-1000 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`} style={{transitionDelay: '800ms'}}>
          <div className="flex justify-center space-x-2 mb-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#37c2cc] via-[#204168] to-[#37c2cc]"
              ></div>
            ))}
          </div>
          <div className="space-y-1">
            <p className="text-white/80 text-xs md:text-sm font-light">
              Excellence deserves recognition • Innovation deserves rewards
            </p>
            <p className="text-white/60 text-xs">
              🚀 <span className="text-[#37c2cc]">CodeRush 2025</span> - Where champions are made! 🚀
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrizesInteractive;