import Hero from '@/components/landing/Hero';
import Marquee from '@/components/landing/Marquee';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import Showcase from '@/components/landing/Showcase';
import CTA from '@/components/landing/CTA';

/** Landing page: hero -> marquee -> features -> steps -> preview -> call to action. */
export default function Landing() {
  return (
    <>
      <Hero />
      <Marquee />
      <Features />
      <HowItWorks />
      <Showcase />
      <CTA />
    </>
  );
}
