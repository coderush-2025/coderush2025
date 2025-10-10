"use client";

import { useEffect } from "react";
import Hero from "../components/Hero";
import Introduction from "@/components/Introduction";
import Contact from "../components/Contact";
import Memories from "@/components/Memories";
import HowItWorks from "../components/HowItWorks";
import Prizes from '@/components/PrizesInteractive';
import Timeline from "@/components/Timeline";
import FAQ from "@/components/FAQ";

export default function Home() {
  useEffect(() => {
    // Handle hash navigation from other pages
    const hash = window.location.hash;
    
    if (hash) {
      // Remove the # from hash
      const sectionId = hash.substring(1);
      
      // Wait for page to fully load and components to mount
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const yOffset = -80;
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 100);
    } else {
      // Scroll to top on initial load/refresh
      window.history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <>
      <Hero />

      <Introduction />
      <Timeline />
      <HowItWorks />
      <Prizes />
      <Memories />
      <FAQ />
      <Contact />

    </>
  );
}
