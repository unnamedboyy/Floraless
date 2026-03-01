import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import About from "@/components/landing/About";
import Gallery from "@/components/landing/Gallery";
import ProcessAndConsultation from "@/components/landing/ProcessAndConsultation";
import Packages from "@/components/landing/Packages";
import Testimonials from "@/components/landing/Testimonials";
import BeforeAfter from "@/components/landing/BeforeAfter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <About />
      <Gallery />
      <ProcessAndConsultation />
      <BeforeAfter />
      <Packages />
      <Testimonials />
    </>
  );
}
