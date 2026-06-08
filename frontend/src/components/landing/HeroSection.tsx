'use client';

import Button from '@/components/ui/Button';
import { AnimatePresence, motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const slides = [
  {
    headline: 'Find Trusted',
    highlight: 'Electricians',
    subtitle: 'Expert wiring, panel upgrades, and emergency electrical repairs.',
    gradient: 'from-blue-900/80 via-[#1D234F]/70 to-[#0f1535]/90',
    accent: '#1C9AD6',
  },
  {
    headline: 'Book Skilled',
    highlight: 'Plumbers',
    subtitle: 'Pipe repairs, leak fixing, and full plumbing installations.',
    gradient: 'from-cyan-900/80 via-[#1D234F]/70 to-[#0f1535]/90',
    accent: '#59BD7B',
  },
  {
    headline: 'Hire Expert',
    highlight: 'Carpenters',
    subtitle: 'Custom furniture, door fitting, and woodwork craftsmanship.',
    gradient: 'from-amber-900/80 via-[#1D234F]/70 to-[#0f1535]/90',
    accent: '#FFD530',
  },
  {
    headline: 'Find Pro',
    highlight: 'Mechanics',
    subtitle: 'Vehicle diagnostics, engine repair, and routine maintenance.',
    gradient: 'from-red-900/80 via-[#1D234F]/70 to-[#0f1535]/90',
    accent: '#f97316',
  },
];

export default function HeroSection() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (city) params.set('city', city);
    router.push(`/technicians?${params.toString()}`);
  };

  const slide = slides[current];

  return (
    <section className="relative bg-[#0f1535] overflow-hidden min-h-screen flex items-center" aria-label="Hero">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`}
          aria-hidden="true"
        />
      </AnimatePresence>

      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 right-10 w-96 h-96 bg-[#1C9AD6]/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-[#FFD530]/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 w-full">
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

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto"
          >
            <div className="flex flex-col sm:flex-row gap-2 bg-white/10 backdrop-blur-xl border border-white/25 rounded-2xl p-2 shadow-2xl shadow-black/50">
              <div className="flex-1 flex items-center gap-3 px-3">
                <Search className="w-5 h-5 text-white/50 flex-shrink-0" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="What service do you need?"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 py-2.5 text-white placeholder-white/40 outline-none text-sm bg-transparent"
                  aria-label="Search for a service"
                />
              </div>
              <div className="hidden sm:block w-px bg-white/20 self-stretch" aria-hidden="true" />
              <input
                type="text"
                placeholder="City or location"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="px-4 py-2.5 text-white placeholder-white/40 outline-none text-sm bg-transparent"
                aria-label="Location"
              />
              <Button type="submit" variant="secondary" className="rounded-xl flex-shrink-0 px-6 font-semibold">
                Search
              </Button>
            </div>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-2 mt-5"
          >
            {['Electrician', 'Plumber', 'Carpenter', 'AC Repair', 'CCTV', 'Mechanic'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => router.push(`/technicians?search=${tag}`)}
                className="px-3 py-1.5 text-xs text-white/70 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors border border-white/15"
              >
                {tag}
              </button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-3 mt-8"
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
          transition={{ delay: 0.8, duration: 0.6 }}
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
