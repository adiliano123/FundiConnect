import CTASection from '@/components/landing/CTASection';
import FeaturedTechnicians from '@/components/landing/FeaturedTechnicians';
import HeroSection from '@/components/landing/HeroSection';
import HowItWorks from '@/components/landing/HowItWorks';
import ServicesSection from '@/components/landing/ServicesSection';
import Testimonials from '@/components/landing/Testimonials';
import WhyChoose from '@/components/landing/WhyChoose';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <HowItWorks />
      <FeaturedTechnicians />
      <WhyChoose />
      <Testimonials />
      <CTASection />
    </>
  );
}
