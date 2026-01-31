import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import About from "../components/landing/About";
import Gallery from "../components/landing/Gallery";
import ProcessAndConsultation from "../components/landing/ProcessAndConsultation";
import Packages from "../components/landing/Packages";
import Testimonials from "../components/landing/Testimonials";
import BeforeAfter from "../components/landing/BeforeAfter";


export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Navbar />

      <main>
        <Hero />
        <Features />
        <About />
        <Gallery />
        <ProcessAndConsultation />
        <BeforeAfter />
        <Testimonials />
      </main>

      <Footer />
    </div>
  );
}
