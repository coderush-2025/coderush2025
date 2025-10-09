import Hero from "../components/Hero";
import Introduction from "@/components/Introduction";
import Contact from "../components/Contact";
import Memories from "@/components/Memories";
import HowItWorks from "../components/HowItWorks";
import Prizes from '@/components/PrizesInteractive';
import Timeline from "@/components/Timeline";
import FAQ from "@/components/FAQ";

export default function Home() {
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
