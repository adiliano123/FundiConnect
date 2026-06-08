'use client';

import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface CounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

function AnimatedCounter({ target, suffix = '', prefix = '', duration = 2 }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, (duration * 1000) / steps);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

const stats = [
  { target: 500, suffix: '+', label: 'Verified Technicians', color: 'text-[#1C9AD6]' },
  { target: 2000, suffix: '+', label: 'Happy Customers', color: 'text-[#FFD530]' },
  { target: 10000, suffix: '+', label: 'Jobs Completed', color: 'text-[#59BD7B]' },
  { target: 98, suffix: '%', label: 'Satisfaction Rate', color: 'text-purple-400' },
];

export default function StatsSection() {
  return (
    <section className="py-14 bg-[#1D234F] relative overflow-hidden" aria-label="Statistics">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#1C9AD6]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#FFD530]/8 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-[#1C9AD6] text-sm font-semibold uppercase tracking-widest">Our Impact</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            Numbers That Speak
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(({ target, suffix, label, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="text-center bg-white/5 backdrop-blur-md border border-white/10 rounded-xl py-5 px-4 hover:bg-white/10 transition-colors"
            >
              <div className={`text-3xl sm:text-4xl font-extrabold ${color} mb-1`}>
                <AnimatedCounter target={target} suffix={suffix} duration={2} />
              </div>
              <div className="text-gray-400 text-sm font-medium">{label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
