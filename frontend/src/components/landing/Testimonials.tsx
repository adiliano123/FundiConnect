'use client';

import StarRating from '@/components/ui/StarRating';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useEffect, useState } from 'react';

const testimonials = [
  {
    name: 'Amina Mbeki',
    role: 'Homeowner, Dar es Salaam',
    rating: 5,
    comment: 'The electrician arrived on time and fixed everything within 2 hours. Highly professional and affordable. Will definitely use FundiConnect again!',
    initials: 'AM',
    color: 'bg-[#1C9AD6]',
  },
  {
    name: 'David Msigwa',
    role: 'Business Owner, Arusha',
    rating: 5,
    comment: 'Found an excellent AC technician within minutes. The booking process was smooth and the technician was absolutely top-notch. Five stars.',
    initials: 'DM',
    color: 'bg-[#59BD7B]',
  },
  {
    name: 'Grace Mwanza',
    role: 'Property Manager, Mwanza',
    rating: 5,
    comment: 'I manage multiple properties and FundiConnect has made maintenance so much easier. Having verified technicians on demand is a game changer.',
    initials: 'GM',
    color: 'bg-[#FFD530]',
  },
  {
    name: 'John Kimaro',
    role: 'Homeowner, Dodoma',
    rating: 5,
    comment: 'Booked a plumber for an emergency at midnight. He arrived within 45 minutes and solved the problem fast. Excellent service!',
    initials: 'JK',
    color: 'bg-purple-500',
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((c) => (c + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const go = (dir: number) => {
    setDirection(dir);
    setCurrent((c) => (c + dir + testimonials.length) % testimonials.length);
  };

  const t = testimonials[current];

  return (
    <section className="py-14 bg-[#1D234F] relative overflow-hidden" aria-labelledby="testimonials-title">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-10 right-10 w-80 h-80 bg-[#1C9AD6]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#FFD530]/8 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#FFD530] text-sm font-semibold uppercase tracking-widest">Testimonials</span>
          <h2 id="testimonials-title" className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            What Our Customers Say
          </h2>
          <p className="text-gray-400 mt-2 text-sm">Real reviews from verified customers across Tanzania.</p>
        </motion.div>

        {/* Featured carousel */}
        <div className="max-w-3xl mx-auto relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              initial={{ opacity: 0, x: direction * 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -80 }}
              transition={{ duration: 0.4 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 text-center"
            >
              <Quote className="w-10 h-10 text-[#FFD530]/40 mx-auto mb-4" aria-hidden="true" />
              <StarRating rating={t.rating} size="md" />
              <p className="text-gray-200 mt-4 text-sm leading-relaxed font-light">
                &ldquo;{t.comment}&rdquo;
              </p>
              <div className="flex items-center justify-center gap-3 mt-8">
                <div className={`w-12 h-12 rounded-full ${t.color} flex items-center justify-center text-white font-bold`}>
                  {t.initials}
                </div>
                <div className="text-left">
                  <div className="text-white font-semibold">{t.name}</div>
                  <div className="text-gray-400 text-sm">{t.role}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => go(-1)}
              className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-[#FFD530]' : 'w-2 bg-white/30'}`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => go(1)}
              className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bottom grid — all testimonials small cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14">
          {testimonials.map(({ name, role, rating, initials, color }, i) => (
            <motion.div
              key={name}
              role="button"
              tabIndex={0}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setDirection(i > current ? 1 : -1); setCurrent(i); } }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`cursor-pointer text-left p-4 rounded-2xl border transition-all duration-200 ${i === current ? 'bg-white/15 border-white/30' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
              aria-label={`View testimonial from ${name}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                  {initials}
                </div>
                <div>
                  <div className="text-white text-xs font-semibold truncate">{name}</div>
                  <div className="text-gray-500 text-xs truncate">{role.split(',')[1]?.trim()}</div>
                </div>
              </div>
              <StarRating rating={rating} size="sm" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
