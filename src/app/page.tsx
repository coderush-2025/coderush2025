import Hero from "../components/Hero";
import Contact from "../components/Contact";
import HowItWorks from "../components/HowItWorks";
import Prizes from '@/components/PrizesInteractive';

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Prizes />
      <Contact />

    </>
  );
}
