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
    // Scroll to top on initial load/refresh
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
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
