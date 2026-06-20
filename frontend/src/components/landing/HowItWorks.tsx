'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Search, Star, UserCheck } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Search & Filter',
    description: 'Browse verified technicians by service, location, or availability.',
    bg: 'bg-blue-500/10',
    iconColor: 'text-[#1C9AD6]',
    border: 'border-blue-400/20',
    step: '01',
    stepColor: 'bg-[#1C9AD6]',
  },
  {
    icon: UserCheck,
    title: 'Book a Technician',
    description: 'Select your preferred pro and submit your booking with job details.',
    bg: 'bg-yellow-500/10',
    iconColor: 'text-[#FFD530]',
    border: 'border-yellow-400/20',
    step: '02',
    stepColor: 'bg-[#FFD530]',
  },
  {
    icon: CheckCircle,
    title: 'Get the Job Done',
    description: 'The technician arrives, completes the work, and you confirm.',
    bg: 'bg-green-500/10',
    iconColor: 'text-[#59BD7B]',
    border: 'border-green-400/20',
    step: '03',
    stepColor: 'bg-[#59BD7B]',
  },
  {
    icon: Star,
    title: 'Rate & Review',
    description: 'Share your experience to help others find the best technicians.',
    bg: 'bg-purple-500/10',
    iconColor: 'text-purple-400',
    border: 'border-purple-400/20',
    step: '04',
    stepColor: 'bg-purple-500',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-14 bg-gray-50" aria-labelledby="how-it-works-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#59BD7B] text-sm font-semibold uppercase tracking-widest">Simple Process</span>
          <h2 id="how-it-works-title" className="text-2xl sm:text-3xl font-extrabold text-[#1D234F] mt-2">
            How FundiConnect Works
          </h2>
          <p className="text-gray-500 mt-2 max-w-xl mx-auto text-sm leading-relaxed">
            Book a skilled technician in 4 easy steps — no hassle, no surprises.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector line */}
          <div
            className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-linear-to-r from-[#1C9AD6] via-[#FFD530] to-[#59BD7B] opacity-30"
            aria-hidden="true"
          />

          {steps.map(({ icon: Icon, title, description, bg, iconColor, border, step, stepColor }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="flex flex-col items-center text-center relative"
            >
              <div className="relative mb-5">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center border ${bg} ${border} shadow-sm`}>
                  <Icon className={`w-7 h-7 ${iconColor}`} aria-hidden="true" />
                </div>
                <div className={`absolute -top-2 -right-2 w-5 h-5 rounded-full ${stepColor} text-white text-xs font-bold flex items-center justify-center shadow-md`}>
                  {parseInt(step)}
                </div>
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed max-w-45 mx-auto">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
