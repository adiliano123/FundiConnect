'use client';

import { motion } from 'framer-motion';
import { Shield, Star, ThumbsUp, Zap } from 'lucide-react';

const badges = [
  { icon: Shield, label: 'Verified Professionals', color: 'text-[#59BD7B]' },
  { icon: Star, label: 'Top Rated Platform', color: 'text-[#FFD530]' },
  { icon: Zap, label: 'Fast Booking', color: 'text-[#1C9AD6]' },
  { icon: ThumbsUp, label: '98% Satisfaction', color: 'text-purple-400' },
];

const partners = [
  'TanzaTech', 'BuildTZ', 'HomeFix Pro', 'UrbanFundi', 'ServiceHub', 'FundiPro',
];

export default function TrustedBy() {
  return (
    <section className="py-14 bg-white border-b border-gray-100" aria-label="Trusted by">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {badges.map(({ icon: Icon, label, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100"
            >
              <Icon className={`w-8 h-8 shrink-0 ${color}`} aria-hidden="true" />
              <span className="text-sm font-semibold text-gray-700">{label}</span>
            </motion.div>
          ))}
        </div>

        {/* Partner logos */}
        <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">
          Trusted by leading organizations
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8">
          {partners.map((name, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-400 font-bold text-sm tracking-wide hover:bg-gray-200 transition-colors cursor-default"
            >
              {name}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
