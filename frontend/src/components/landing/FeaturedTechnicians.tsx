'use client';

import StarRating from '@/components/ui/StarRating';
import { technicianService } from '@/services/technician.service';
import { Technician } from '@/types';
import { motion } from 'framer-motion';
import { MapPin, Shield } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function FeaturedTechnicians() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);

  useEffect(() => {
    technicianService.getAll({ per_page: 4 }).then((res) => setTechnicians(res.data)).catch(() => {});
  }, []);

  if (technicians.length === 0) return null;

  return (
    <section className="py-14 bg-white" aria-labelledby="featured-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#1C9AD6] text-sm font-semibold uppercase tracking-widest">Top Rated</span>
          <h2 id="featured-title" className="text-2xl sm:text-3xl font-extrabold text-[#1D234F] mt-2">
            Featured Technicians
          </h2>
          <p className="text-gray-500 mt-2 text-sm">Handpicked professionals with outstanding track records.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 overflow-hidden">
          {technicians.map((tech, i) => (
            <motion.div
              key={tech.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link
                href={`/technicians/${tech.id}`}
                className="block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1C9AD6] to-[#1D234F] flex items-center justify-center text-white text-xl font-bold shadow-md">
                      {tech.user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#59BD7B] font-semibold bg-green-50 px-2 py-1 rounded-full border border-green-100">
                      <Shield className="w-3 h-3" aria-hidden="true" />
                      Verified
                    </div>
                  </div>

                  <h3 className="font-bold text-gray-900 group-hover:text-[#1C9AD6] transition-colors text-base">
                    {tech.user?.name}
                  </h3>
                  <p className="text-sm text-[#1C9AD6] font-medium mt-0.5">{tech.category?.name}</p>

                  <div className="flex items-center gap-2 mt-3">
                    <StarRating rating={Math.round(tech.rating ?? 0)} size="sm" />
                    <span className="text-xs text-gray-500">({tech.total_reviews ?? 0})</span>
                  </div>

                  {tech.user?.city && (
                    <div className="flex items-center gap-1 mt-3 text-xs text-gray-500">
                      <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                      {tech.user.city}
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-bold text-[#1D234F]">
                      TZS {tech.hourly_rate?.toLocaleString() ?? '—'}
                      <span className="text-xs text-gray-400 font-normal">/hr</span>
                    </span>
                    <span className="text-xs text-gray-500">{tech.experience_years} yrs exp</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            href="/technicians"
            className="inline-flex items-center gap-2 bg-[#1D234F] text-white px-7 py-3 rounded-xl font-semibold hover:bg-[#161b3d] transition-colors text-sm shadow-lg"
          >
            View All Technicians →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
