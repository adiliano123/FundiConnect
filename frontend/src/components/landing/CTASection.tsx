'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CTASection() {
  return (
    <section
      className="relative py-16 overflow-hidden bg-[#0a0f2e]"
      aria-labelledby="cta-title"
    >
      {/* Gradient backdrop — CSS only, no JS animation */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom right, rgba(28,154,214,0.30), #1D234F, #0a0f2e)' }}
        aria-hidden="true"
      />

      {/* Blobs — pure CSS pulse, no framer-motion repeat:Infinity */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-10 right-10 w-80 h-80 bg-[#1C9AD6]/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-10 left-10 w-96 h-96 bg-[#FFD530]/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block bg-[#FFD530]/15 text-[#FFD530] text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full border border-[#FFD530]/25 mb-6">
            Get Started Today
          </span>
          <h2 id="cta-title" className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
            Ready to Find Your<br />
            <span className="text-[#FFD530]">Perfect Fundi?</span>
          </h2>
          <p className="text-gray-300 text-sm mb-8 max-w-xl mx-auto leading-relaxed">
            Join thousands of Tanzanians who trust FundiConnect for fast, reliable, professional home services.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register?role=customer">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto bg-[#FFD530] text-[#1D234F] font-bold px-7 py-3 rounded-xl text-sm shadow-lg hover:bg-yellow-400 transition-colors"
              >
                Book a Technician
              </motion.button>
            </Link>
            <Link href="/auth/register?role=technician">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto bg-white/10 backdrop-blur-md border border-white/25 text-white font-bold px-7 py-3 rounded-xl text-sm hover:bg-white/20 transition-colors"
              >
                Join as a Technician
              </motion.button>
            </Link>
          </div>

          <p className="text-gray-500 text-xs mt-6">Free to join · No hidden fees · Cancel anytime</p>
        </motion.div>
      </div>
    </section>
  );
}
