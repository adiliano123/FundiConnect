'use client';

import Button from '@/components/ui/Button';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const slides = [
  {
    headline: 'Find Trusted',
    highlight: 'Electricians',
    subtitle: 'Expert wiring, panel upgrades, and emergency electrical repairs.',
    accent: '#1C9AD6',
  },
  {
    headline: 'Book Skilled',
    highlight: 'Plumbers',
    subtitle: 'Pipe repairs, leak fixing, and full plumbing installations.',
    accent: '#59BD7B',
  },
  {
    headline: 'Hire Expert',
    highlight: 'Carpenters',
    subtitle: 'Custom furniture, door fitting, and woodwork craftsmanship.',
    accent: '#FFD530',
  },
  {
    headline: 'Find Pro',
    highlight: 'Mechanics',
    subtitle: 'Vehicle diagnostics, engine repair, and routine maintenance.',
    accent: '#f97316',
  },
];

export default function HeroSection() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 4000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className="relative bg-[#0f1535] min-h-screen flex items-center" aria-label="Hero">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/hero-bg.jpg"
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Overlay to keep text readable */}
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 w-full">
        <div className="text-center max-w-4xl mx-auto">

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4 tracking-tight">
                {slide.headline}{' '}
                <span style={{ color: slide.accent }}>{slide.highlight}</span>
                <br className="hidden sm:block" />
                <span className="text-white"> Near You</span>
              </h1>
              <p className="text-sm sm:text-base text-gray-300 mb-8 max-w-xl mx-auto leading-relaxed">
                {slide.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-3"
          >
            <Button
              onClick={() => router.push('/technicians')}
              variant="secondary"
              size="lg"
              className="rounded-xl px-8 font-semibold shadow-lg"
            >
              Find a Technician
            </Button>
            <Button
              onClick={() => router.push('/auth/register?role=technician')}
              variant="outline"
              size="lg"
              className="rounded-xl px-8 border-white/40 text-white hover:bg-white/10 font-semibold"
            >
              Become a Technician
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-14 max-w-2xl mx-auto"
        >
          {[
            { value: '10K+', label: 'Jobs Completed' },
            { value: '500+', label: 'Verified Technicians' },
            { value: '20+', label: 'Cities Covered' },
            { value: '4.9★', label: 'Average Rating' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center bg-white/10 backdrop-blur-md border border-white/15 rounded-xl py-3 px-2">
              <div className="text-xl sm:text-2xl font-extrabold text-[#FFD530]">{value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{label}</div>
            </div>
          ))}
        </motion.div>

        <div className="flex justify-center gap-2 mt-10" aria-label="Slide indicators">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-[#FFD530]' : 'w-2 bg-white/30'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
