import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import Marquee from "@/components/Marquee";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import VoiceDemo from "@/components/VoiceDemo";
import Assistants from "@/components/Assistants";
import Personas from "@/components/Personas";
import HowItWorks from "@/components/HowItWorks";
import Estimator from "@/components/Estimator";
import Trust from "@/components/Trust";
import Helpers from "@/components/Helpers";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Marquee />
        <Services />
        <VoiceDemo />
        <Assistants />
        <Personas />
        <HowItWorks />
        <Estimator />
        <Trust />
        <Helpers />
        <Testimonials />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
