import Navbar from "@/components/layout/Navbar";
import ScrollProgress from "@/components/layout/ScrollProgress";
import Marquee from "@/features/home/Marquee";
import Hero from "@/features/home/Hero";
import Services from "@/features/home/Services";
import Highlights from "@/features/home/Highlights";
import Personas from "@/features/home/Personas";
import HowItWorks from "@/features/home/HowItWorks";
import Estimator from "@/features/home/Estimator";
import Trust from "@/features/home/Trust";
import Helpers from "@/features/home/Helpers";
import Testimonials from "@/features/home/Testimonials";
import Faq from "@/features/home/Faq";
import Footer from "@/components/layout/Footer";
import StructuredData from "@/components/layout/StructuredData";
import SilkDivider from "@/components/layout/SilkDivider";

export default function Home() {
  return (
    <>
      <StructuredData />
      <ScrollProgress />
      <Navbar />
      <main id="main-content" className="flex-1">
        <Hero />
        <Marquee />
        <Services />
        <SilkDivider />
        <Highlights />
        <Personas />
        <HowItWorks />
        <SilkDivider flip />
        <Estimator />
        <Trust />
        <Helpers />
        <SilkDivider />
        <Testimonials />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
