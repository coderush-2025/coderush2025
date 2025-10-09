"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";
  const isRegisterPage = pathname.startsWith("/register");

  // Navigation items
  const navItems = [
    { name: "Home", href: "/", sectionId: null },
    { name: "About", href: "/#introduction", sectionId: "introduction" },
    { name: "Timeline", href: "/#timeline", sectionId: "timeline" },
    { name: "How It Works", href: "/#how-it-works", sectionId: "how-it-works" },
    { name: "Prizes", href: "/#prizes", sectionId: "prizes" },
    { name: "Memories", href: "/#memories", sectionId: "memories" },
    { name: "FAQ", href: "/#faq", sectionId: "faq" },
    { name: "Contact", href: "/#contact", sectionId: "contact" },
  ];

  // Track scroll position
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  // Track active section on homepage
  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => {
      const sections = navItems
        .filter(item => item.sectionId)
        .map(item => ({
          id: item.sectionId,
          element: document.getElementById(item.sectionId!)
        }))
        .filter(section => section.element);

      const scrollPosition = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element && section.element.offsetTop <= scrollPosition) {
          setActiveSection(section.id || "");
          break;
        }
      }

      if (window.scrollY < 100) {
        setActiveSection("");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  // Handle navigation
  const handleNavClick = (href: string, sectionId: string | null) => {
    setIsMobileMenuOpen(false);

    if (sectionId && isHomePage) {
      // Smooth scroll to section on same page
      const element = document.getElementById(sectionId);
      if (element) {
        const yOffset = -80;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    } else {
      // Navigate to different page or home page with section
      router.push(href);

      // If navigating to a section from another page, scroll after navigation
      if (sectionId && !isHomePage) {
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            const yOffset = -80;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
          }
        }, 100);
      }
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isRegisterPage || isScrolled
            ? "bg-[#0e243f]/95 backdrop-blur-lg shadow-lg shadow-[#37c2cc]/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <motion.div
              className="flex-shrink-0 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/")}
            >
              <h1 className="text-xl sm:text-2xl font-bold">
                <span className="text-white">C</span>
                <span className="bg-gradient-to-r from-[#37c2cc] to-[#2ba8b3] bg-clip-text text-transparent">ode</span>
                <span className="text-white">R</span>
                <span className="bg-gradient-to-r from-[#37c2cc] to-[#2ba8b3] bg-clip-text text-transparent">ush 2</span>
                <span className="text-white">K</span>
                <span className="bg-gradient-to-r from-[#37c2cc] to-[#2ba8b3] bg-clip-text text-transparent">25</span>
              </h1>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = item.sectionId
                  ? activeSection === item.sectionId
                  : pathname === item.href;

                return (
                  <motion.button
                    key={item.name}
                    onClick={() => handleNavClick(item.href, item.sectionId)}
                    className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                      isActive
                        ? "text-[#37c2cc]"
                        : "text-white hover:text-[#37c2cc]"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.name}
                    {isActive && (
                      <motion.div
                        layoutId="activeSection"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#37c2cc] to-[#2ba8b3]"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Register Button - Desktop */}
            <motion.button
              onClick={() => router.push("/register")}
              className="hidden lg:block px-6 py-2.5 bg-gradient-to-r from-[#37c2cc] to-[#2ba8b3] hover:from-[#2ba8b3] hover:to-[#37c2cc] text-[#0e243f] font-bold rounded-lg transition-all duration-300 text-sm shadow-lg shadow-[#37c2cc]/20"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Register Now
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-white relative z-50"
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="w-6 h-6" />
              ) : (
                <FaBars className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{
            height: isMobileMenuOpen ? "auto" : 0,
            opacity: isMobileMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="lg:hidden overflow-hidden bg-[#0e243f]/98 backdrop-blur-lg border-t border-[#37c2cc]/20"
        >
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navItems.map((item) => {
              const isActive = item.sectionId
                ? activeSection === item.sectionId
                : pathname === item.href;

              return (
                <motion.button
                  key={item.name}
                  onClick={() => handleNavClick(item.href, item.sectionId)}
                  className={`block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-[#37c2cc]/20 text-[#37c2cc] border-l-4 border-[#37c2cc]"
                      : "text-white hover:bg-[#204168]/50 hover:text-[#37c2cc]"
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.name}
                </motion.button>
              );
            })}
            <motion.button
              onClick={() => {
                setIsMobileMenuOpen(false);
                router.push("/register");
              }}
              className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-[#37c2cc] to-[#2ba8b3] text-[#0e243f] font-bold rounded-lg text-base shadow-lg"
              whileTap={{ scale: 0.98 }}
            >
              Register Now
            </motion.button>
          </div>
        </motion.div>
      </motion.nav>

      {/* Spacer to prevent content from going under navbar */}
      <div className="h-14 sm:h-16" />
    </>
  );
};

export default Navbar;
