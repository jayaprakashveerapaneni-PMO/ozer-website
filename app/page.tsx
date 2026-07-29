import Navbar from "@/components/layout/Navbar";
import ScrollProgress from "@/components/layout/ScrollProgress";
import Marquee from "@/features/home/Marquee";
import Hero from "@/features/home/Hero";
import Services from "@/features/home/Services";
import Highlights from "@/features/home/Highlights";
import Personas from "@/features/home/Personas";
import HowItWorks from "@/features/home/HowItWorks";
import Estimator from "@/features/home/Estimator";
import Assistants from "@/features/home/Assistants";
import Trust from "@/features/home/Trust";
import Helpers from "@/features/home/Helpers";
import Testimonials from "@/features/home/Testimonials";
import Faq from "@/features/home/Faq";
import Footer from "@/components/layout/Footer";
import StructuredData from "@/components/layout/StructuredData";
import SilkDivider from "@/components/layout/SilkDivider";
import HomeCinema from "@/features/home/HomeCinema";

/** Ambient depth orb — parallax-driven by HomeCinema, invisible to layout. */
function Orb({ className, tint }: { className: string; tint: string }) {
  return (
    <div
      data-orb
      className={`pointer-events-none absolute z-0 h-96 w-96 rounded-full ${className}`}
      style={{ background: `radial-gradient(circle, ${tint}, transparent 70%)`, filter: "blur(48px)" }}
      aria-hidden
    />
  );
}

export default function Home() {
  return (
    <>
      <StructuredData />
      <ScrollProgress />
      <HomeCinema />
      <Navbar />
      <main id="main-content" className="relative flex-1 overflow-x-clip">
        <Orb className="left-[-8rem] top-[16%]" tint="rgba(251,146,60,0.18)" />
        <Orb className="right-[-10rem] top-[38%]" tint="rgba(8,145,178,0.14)" />
        <Orb className="left-[-6rem] top-[64%]" tint="rgba(124,58,237,0.12)" />
        <Orb className="right-[-8rem] top-[86%]" tint="rgba(249,115,22,0.16)" />
        <Hero />
        <Marquee />
        <Services />
        <SilkDivider />
        <Highlights />
        <Personas />
        <HowItWorks />
        <SilkDivider flip />
        <Estimator />
        <Assistants />
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
