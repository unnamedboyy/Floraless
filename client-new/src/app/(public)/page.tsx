import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import About from "@/components/landing/About";
import Gallery from "@/components/landing/Gallery";
import ProcessAndConsultation from "@/components/landing/ProcessAndConsultation";
import Packages from "@/components/landing/Packages";
import Testimonials from "@/components/landing/Testimonials";
import BeforeAfter from "@/components/landing/BeforeAfter";
import FaqSection from "@/components/landing/FaqSection";
import Reveal from "@/components/ui/Reveal";

export default function HomePage() {
  return (
    <main className="bg-[#ffffff] overflow-x-hidden">

      <Hero />

      <Reveal>
        <Features />
      </Reveal>

      <Reveal>
        <About />
      </Reveal>

      <Reveal>
        <Gallery />
      </Reveal>

      <Reveal>
        <ProcessAndConsultation />
      </Reveal>

      <Reveal>
        <BeforeAfter />
      </Reveal>

      <Reveal>
        <Packages />
      </Reveal>

      <Reveal>
        <Testimonials />
      </Reveal>

      <Reveal>
        <FaqSection />
      </Reveal>

    </main>
  );
}