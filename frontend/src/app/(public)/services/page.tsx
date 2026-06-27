'use client';

import CTASection from '@/components/landing/CTASection';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { categoryService } from '@/services/category.service';
import { Category } from '@/types';
import { motion } from 'framer-motion';
import {
  Camera,
  Hammer,
  Monitor,
  Paintbrush,
  Users,
  Wind,
  Wrench,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

/* ── static metadata per category name ─────────────────────────── */

const CATEGORY_META: Record<
  string,
  {
    icon: React.ElementType;
    image: string;
    description: string;
    bg: string;
    text: string;
    border: string;
    glow: string;
  }
> = {
  Electrical: {
    icon: Zap,
    image: '/images/service-carpentry.jpg',
    description: 'Wiring, panel upgrades, fault diagnosis, and emergency electrical repairs.',
    bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-400/25', glow: 'hover:shadow-blue-500/20',
  },
  Plumbing: {
    icon: Wind,
    image: '/images/service-electrical.jpg',
    description: 'Pipe repairs, leak fixing, drain clearing, and full plumbing installations.',
    bg: 'bg-cyan-500/15', text: 'text-cyan-400', border: 'border-cyan-400/25', glow: 'hover:shadow-cyan-500/20',
  },
  Carpentry: {
    icon: Hammer,
    image: '/images/service-plumbing.jpg',
    description: 'Custom furniture, door & window fitting, and skilled woodwork craftsmanship.',
    bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-400/25', glow: 'hover:shadow-amber-500/20',
  },
  Painting: {
    icon: Paintbrush,
    image: '/images/service-painting-new.jpg',
    description: 'Interior and exterior painting, surface prep, and decorative finishes.',
    bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-400/25', glow: 'hover:shadow-orange-500/20',
  },
  'AC Repair': {
    icon: Wind,
    image: '/images/service-ac-repair-new.jpg',
    description: 'Air conditioner installation, servicing, gas refill, and fault repairs.',
    bg: 'bg-green-500/15', text: 'text-green-400', border: 'border-green-400/25', glow: 'hover:shadow-green-500/20',
  },
  Mechanics: {
    icon: Wrench,
    image: '/images/service-mechanics.jpg',
    description: 'Vehicle diagnostics, engine repair, oil changes, and routine maintenance.',
    bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-400/25', glow: 'hover:shadow-red-500/20',
  },
  'Computer Repair': {
    icon: Monitor,
    image: '/images/service-computer-repair.jpg',
    description: 'Hardware fixes, software troubleshooting, virus removal, and data recovery.',
    bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-400/25', glow: 'hover:shadow-purple-500/20',
  },
  'CCTV Installation': {
    icon: Camera,
    image: '/images/service-cctv-new.jpg',
    description: 'Security camera supply, installation, wiring, and system configuration.',
    bg: 'bg-pink-500/15', text: 'text-pink-400', border: 'border-pink-400/25', glow: 'hover:shadow-pink-500/20',
  },
};

/* fallback for categories not in the static map */
const DEFAULT_META = {
  icon: Wrench,
  image: '/images/service-mechanics.jpg',
  description: 'Skilled, verified professionals ready to help with your needs.',
  bg: 'bg-indigo-500/15', text: 'text-indigo-400', border: 'border-indigo-400/25', glow: 'hover:shadow-indigo-500/20',
};

/* ── animations ─────────────────────────────────────────────────── */

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

/* ── page ───────────────────────────────────────────────────────── */

export default function ServicesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryService
      .getAll()
      .then(({ data }) => setCategories(data))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section
        className="relative bg-[#0a0f2e] overflow-hidden py-24 px-4"
        aria-labelledby="services-hero-title"
      >
        {/* blobs */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 right-0 w-[480px] h-[480px] bg-[#1C9AD6]/15 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[420px] h-[420px] bg-[#FFD530]/8 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div {...fadeUp(0)}>
            <span className="inline-block bg-[#1C9AD6]/15 text-[#1C9AD6] text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full border border-[#1C9AD6]/25 mb-6">
              All Services
            </span>
            <h1
              id="services-hero-title"
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5"
            >
              What Can We Help{' '}
              <span className="text-[#FFD530]">You With?</span>
            </h1>
            <p className="text-gray-300 text-base leading-relaxed max-w-xl mx-auto mb-10">
              Browse every service category on FundiConnect. Click any service to instantly see
              verified technicians available in your area.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/technicians"
                className="inline-flex items-center justify-center bg-[#FFD530] text-[#1D234F] font-bold px-8 py-3.5 rounded-xl text-sm shadow-xl hover:bg-yellow-400 transition-colors"
              >
                Browse All Technicians
              </Link>
              <Link
                href="/auth/register?role=customer"
                className="inline-flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/25 text-white font-bold px-8 py-3.5 rounded-xl text-sm hover:bg-white/20 transition-colors"
              >
                Book a Service
              </Link>
            </div>
          </motion.div>

          {/* stats */}
          {!loading && (
            <motion.div
              {...fadeUp(0.25)}
              className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-16"
            >
              {[
                { value: `${categories.length}`, label: 'Service Categories' },
                { value: '500+', label: 'Verified Technicians' },
                { value: '4.9★', label: 'Average Rating' },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl py-4 px-3 text-center"
                >
                  <div className="text-2xl font-extrabold text-[#FFD530]">{value}</div>
                  <div className="text-xs text-gray-400 mt-1">{label}</div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Services Grid ─────────────────────────────────────── */}
      <section
        className="relative py-20 bg-[#0d1235] overflow-hidden"
        aria-labelledby="services-grid-title"
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/2 right-0 w-[360px] h-[360px] bg-[#FFD530]/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2
              id="services-grid-title"
              className="text-2xl sm:text-3xl font-extrabold text-white"
            >
              Our Service Categories
            </h2>
            <p className="text-gray-400 text-sm mt-2 max-w-lg mx-auto">
              Every category has verified, background-checked professionals ready to take your booking.
            </p>
          </motion.div>

          {loading ? (
            <LoadingSpinner fullPage />
          ) : categories.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-20">
              No service categories available right now. Check back soon.
            </p>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            >
              {categories.map((cat) => {
                const meta = CATEGORY_META[cat.name] ?? DEFAULT_META;
                const Icon = meta.icon;

                return (
                  <motion.div key={cat.id} variants={item}>
                    <Link
                      href={`/technicians?search=${encodeURIComponent(cat.name)}`}
                      className={`group block bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:bg-white/8 hover:-translate-y-1.5 hover:border-white/25 hover:shadow-xl transition-all duration-300 ${meta.glow}`}
                    >
                      {/* image */}
                      <div className="w-full h-44 overflow-hidden relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={meta.image}
                          alt={cat.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* subtle gradient overlay */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />

                        {/* technician count badge */}
                        {cat.technicians_count !== undefined && (
                          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full border border-white/15">
                            <Users className="w-3 h-3" aria-hidden="true" />
                            {cat.technicians_count} technician{cat.technicians_count !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>

                      {/* body */}
                      <div className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center border ${meta.bg} ${meta.border} group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
                          >
                            <Icon className={`w-5 h-5 ${meta.text}`} aria-hidden="true" />
                          </div>
                          <h3 className="font-bold text-white text-sm leading-tight">{cat.name}</h3>
                        </div>

                        {cat.description ? (
                          <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                            {cat.description}
                          </p>
                        ) : (
                          <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                            {meta.description}
                          </p>
                        )}

                        <div className={`mt-4 text-xs font-semibold ${meta.text} flex items-center gap-1 group-hover:gap-2 transition-all`}>
                          Find technicians →
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Why trust us strip ────────────────────────────────── */}
      <section className="py-14 bg-[#0a0f2e]" aria-label="Trust indicators">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            {[
              {
                emoji: '✅',
                title: 'Verified Before They Book',
                body: 'Every technician is background-checked and skills-tested before joining the platform.',
              },
              {
                emoji: '🔒',
                title: 'Escrow-Protected Payments',
                body: 'Your payment is held securely and released only after you confirm the work is done.',
              },
              {
                emoji: '⭐',
                title: 'Real Customer Reviews',
                body: 'Ratings come from verified customers only — no fake reviews, ever.',
              },
            ].map(({ emoji, title, body }) => (
              <div
                key={title}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center"
              >
                <div className="text-3xl mb-3">{emoji}</div>
                <h3 className="text-white font-bold text-sm mb-2">{title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{body}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <CTASection />
    </>
  );
}
