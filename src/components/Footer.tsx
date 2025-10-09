import React from "react";
import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="relative bg-[#10172b] text-white py-16 px-6 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto">
        {/* Main Content Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          {/* Left Logo */}
          <div className="flex-shrink-0 flex items-center justify-center w-32 md:w-40 h-32 md:h-40 transition-transform duration-300 hover:scale-105">
            <Image
              src="/Coderush.png"
              alt="CodeRush Logo"
              width={160}
              height={160}
              className="object-contain w-full h-full"
            />
          </div>

          {/* Center Content */}
          <div className="flex-1 text-center space-y-4">
            <h2 className="text-base md:text-lg font-semibold tracking-wide">
              CODERUSH 2025 | Organized by INTECS, Faculty of Information Technology
            </h2>

            {/* Social Icons */}
            <div className="flex items-center justify-center gap-3">
              <span className="text-sm md:text-base">Follow us on:</span>
              <a
                href="https://web.facebook.com/FITCodeRush/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-8 h-8 rounded-md border-2 border-white hover:bg-white hover:text-[#0e243f] transition-colors duration-300"
                aria-label="Facebook"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M14 13.5H16.5L17.5 9.5H14V7.5C14 6.47062 14 5.5 16 5.5H17.5V2.1401C17.1743 2.09685 15.943 2 14.6429 2C11.9284 2 10 3.65686 10 6.69971V9.5H7V13.5H10V22H14V13.5Z"></path>
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/intecs-uom/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-8 h-8 rounded-md border-2 border-white hover:bg-white hover:text-[#0e243f] transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" className="w-5 h-5">
                  <path d="M6.94048 4.99993C6.94011 5.81424 6.44608 6.54702 5.69134 6.85273C4.9366 7.15845 4.07187 6.97605 3.5049 6.39155C2.93793 5.80704 2.78195 4.93715 3.1105 4.19207C3.43906 3.44699 4.18654 2.9755 5.00048 2.99993C6.08155 3.03238 6.94097 3.91837 6.94048 4.99993ZM7.00048 8.47993H3.00048V20.9999H7.00048V8.47993ZM13.3205 8.47993H9.34048V20.9999H13.2805V14.4299C13.2805 10.7699 18.0505 10.4299 18.0505 14.4299V20.9999H22.0005V13.0699C22.0005 6.89993 14.9405 7.12993 13.2805 10.1599L13.3205 8.47993Z"></path>
                </svg>
              </a>
            </div>

            {/* Divider Line */}
            <div className="w-full max-w-2xl mx-auto border-t-2 border-white pt-4">
              <p className="text-sm font-semibold">
                © Copyright {year} | Crafted by INTECS
              </p>
            </div>
          </div>

          {/* Right Logos */}
          <div className="flex-shrink-0 flex items-center justify-center gap-4 w-32 md:w-40 h-32 md:h-40">
            <div className="flex items-center justify-center w-16 md:w-20 h-16 md:h-20 transition-transform duration-300 hover:scale-110">
              <Image
                src="/Intecslogo.png"
                alt="INTECS Logo"
                width={80}
                height={80}
                className="object-contain w-full h-full"
              />
            </div>
            <div className="flex items-center justify-center w-20 md:w-24 h-20 md:h-24 transition-transform duration-300 hover:scale-110">
              <Image
                src="/moralogo.png"
                alt="University of Moratuwa Logo"
                width={96}
                height={96}
                className="object-contain w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
