'use client';

import { motion } from 'framer-motion';
import { Camera, Hammer, Monitor, Paintbrush, Wind, Wrench, Zap } from 'lucide-react';
import Link from 'next/link';

// Static service data — images always show, no API needed
const services = [
  { name: 'Electrical',       icon: Zap,       image: '/images/service-carpentry.jpg',       color: { bg: 'bg-blue-500/15',   text: 'text-blue-400',   border: 'border-blue-400/20',   glow: 'group-hover:shadow-blue-500/20'   }, search: 'Electrical'       },
  { name: 'Plumbing',         icon: Wind,       image: '/images/service-electrical.jpg',      color: { bg: 'bg-cyan-500/15',   text: 'text-cyan-400',   border: 'border-cyan-400/20',   glow: 'group-hover:shadow-cyan-500/20'   }, search: 'Plumbing'         },
  { name: 'Carpentry',        icon: Hammer,     image: '/images/service-plumbing.jpg',        color: { bg: 'bg-amber-500/15',  text: 'text-amber-400',  border: 'border-amber-400/20',  glow: 'group-hover:shadow-amber-500/20'  }, search: 'Carpentry'        },
  { name: 'Painting',         icon: Paintbrush, image: '/images/service-painting-new.jpg',    color: { bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-400/20', glow: 'group-hover:shadow-orange-500/20' }, search: 'Painting'         },
  { name: 'AC Repair',        icon: Wind,       image: '/images/service-ac-repair-new.jpg',   color: { bg: 'bg-green-500/15',  text: 'text-green-400',  border: 'border-green-400/20',  glow: 'group-hover:shadow-green-500/20'  }, search: 'AC Repair'        },
  { name: 'Mechanics',        icon: Wrench,     image: '/images/service-mechanics.jpg',       color: { bg: 'bg-red-500/15',    text: 'text-red-400',    border: 'border-red-400/20',    glow: 'group-hover:shadow-red-500/20'    }, search: 'Mechanics'        },
  { name: 'Computer Repair',  icon: Monitor,    image: '/images/service-computer-repair.jpg', color: { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-400/20', glow: 'group-hover:shadow-purple-500/20' }, search: 'Computer Repair'  },
  { name: 'CCTV Installation',icon: Camera,     image: '/images/service-cctv-new.jpg',        color: { bg: 'bg-pink-500/15',   text: 'text-pink-400',   border: 'border-pink-400/20',   glow: 'group-hover:shadow-pink-500/20'   }, search: 'CCTV'             },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ServicesSection() {
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
          {services.map((svc) => {
            const Icon = svc.icon;
            const c = svc.color;
            return (
              <motion.div key={svc.name} variants={item}>
                <Link
                  href={`/technicians?search=${encodeURIComponent(svc.search)}`}
                  className={`group block bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:-translate-y-1 hover:border-white/25 transition-all duration-300 text-center shadow-lg hover:shadow-xl ${c.glow}`}
                >
                  {/* Service image — always visible, no API dependency */}
                  <div className="w-full h-40 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={svc.image}
                      alt={svc.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>

                  <div className="p-5">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 border ${c.bg} ${c.border} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-6 h-6 ${c.text}`} aria-hidden="true" />
                    </div>
                    <h3 className="font-semibold text-white text-sm">{svc.name}</h3>
                  </div>
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
