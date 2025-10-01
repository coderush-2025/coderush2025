import Hero from "../components/Hero";
import Contact from "../components/Contact";
import Memories from "@/components/Memories";
import HowItWorks from "../components/HowItWorks";
import Prizes from '@/components/PrizesInteractive';
import Timeline from "@/components/Timeline";


export default function Home() {
  return (
    <>
      <Hero />
      <Timeline />
      <HowItWorks />
      <Prizes />
      <Memories />
      <Contact />

    </>
  );
}
