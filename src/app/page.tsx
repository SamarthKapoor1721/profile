import Hero from "@/components/Hero";
import TechMarquee from "@/components/TechMarquee";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Certifications from "@/components/Certifications";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import RevealOnScroll from "@/components/ui/reveal-on-scroll";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TechMarquee />
      <RevealOnScroll><About /></RevealOnScroll>
      <RevealOnScroll><Skills /></RevealOnScroll>
      <RevealOnScroll><Projects /></RevealOnScroll>
      <RevealOnScroll><Certifications /></RevealOnScroll>
      <RevealOnScroll><Experience /></RevealOnScroll>
      <RevealOnScroll><Contact /></RevealOnScroll>
    </>
  );
}
