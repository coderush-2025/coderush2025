import Hero from "../components/Hero";
import Contact from "../components/Contact";
import Memories from "@/components/Memories";
import HowItWorks from "../components/HowItWorks";
import Prizes from '@/components/PrizesInteractive';


export default function Home() {
  return (
    <>
      <Hero />
      <Memories />
      <HowItWorks />
      <Prizes />
      <Contact />

    </>
  );
}
