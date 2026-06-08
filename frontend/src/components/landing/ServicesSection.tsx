'use client';

import { categoryService } from '@/services/category.service';
import { Category } from '@/types';
import { motion } from 'framer-motion';
import { Camera, Hammer, Monitor, Paintbrush, Wind, Wrench, Zap } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const iconMap: Record<string, React.ElementType> = {
  zap: Zap,
  droplets: Wind,
  hammer: Hammer,
  paintbrush: Paintbrush,
  wind: Wind,
  wrench: Wrench,
  monitor: Monitor,
  camera: Camera,
};

const colorClasses = [
  { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-400/20', glow: 'group-hover:shadow-blue-500/20' },
  { bg: 'bg-cyan-500/15', text: 'text-cyan-400', border: 'border-cyan-400/20', glow: 'group-hover:shadow-cyan-500/20' },
  { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-400/20', glow: 'group-hover:shadow-amber-500/20' },
  { bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-400/20', glow: 'group-hover:shadow-orange-500/20' },
  { bg: 'bg-green-500/15', text: 'text-green-400', border: 'border-green-400/20', glow: 'group-hover:shadow-green-500/20' },
  { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-400/20', glow: 'group-hover:shadow-red-500/20' },
  { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-400/20', glow: 'group-hover:shadow-purple-500/20' },
  { bg: 'bg-pink-500/15', text: 'text-pink-400', border: 'border-pink-400/20', glow: 'group-hover:shadow-pink-500/20' },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ServicesSection() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    categoryService.getAll().then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  return (
    <section className="relative py-14 bg-[#0a0f2e] overflow-hidden" aria-labelledby="services-title">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-10 right-20 w-80 h-80 bg-[#1C9AD6]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#FFD530]/8 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-[#1C9AD6] text-sm font-semibold uppercase tracking-widest">Our Services</span>
          <h2 id="services-title" className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            What Can We Help You With?
          </h2>
          <p className="text-gray-400 mt-2 max-w-xl mx-auto text-sm leading-relaxed">
            From electrical to CCTV installation, we have verified professionals for every home and business need.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
        >
          {categories.map((cat, i) => {
            const Icon = iconMap[cat.icon || ''] || Wrench;
            const colors = colorClasses[i % colorClasses.length];
            return (
              <motion.div key={cat.id} variants={item}>
                <Link
                  href={`/technicians?category_id=${cat.id}`}
                  className={`group block bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:-translate-y-1 hover:border-white/25 transition-all duration-300 text-center shadow-lg hover:shadow-xl ${colors.glow}`}
                >
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 border ${colors.bg} ${colors.border} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-7 h-7 ${colors.text}`} aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-1">{cat.name}</h3>
                  {cat.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{cat.description}</p>
                  )}
                  {cat.technicians_count !== undefined && (
                    <span className="mt-2 inline-block text-xs text-[#1C9AD6] font-medium">
                      {cat.technicians_count} technicians
                    </span>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            href="/technicians"
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-7 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all text-sm"
          >
            Browse All Technicians →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
