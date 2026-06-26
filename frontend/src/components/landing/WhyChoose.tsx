import { BadgeCheck, Clock, CreditCard, HeadphonesIcon, ShieldCheck, Star } from 'lucide-react';

// Server component — no state or hooks needed. Background image uses loading="lazy".

const features = [
  {
    icon: BadgeCheck,
    title: 'Verified Technicians',
    description: 'Every technician is background-checked and skill-verified before joining the platform.',
    color: 'text-[#59BD7B]',
    bg: 'bg-green-50',
    border: 'border-green-100',
  },
  {
    icon: Clock,
    title: 'Fast Booking',
    description: 'Book a technician in under 2 minutes. Get confirmation within the hour.',
    color: 'text-[#1C9AD6]',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Platform',
    description: 'Your data and payments are protected with industry-standard encryption.',
    color: 'text-[#1D234F]',
    bg: 'bg-indigo-50',
    border: 'border-indigo-100',
  },
  {
    icon: Star,
    title: 'Real Customer Reviews',
    description: 'Honest ratings from verified customers — no fake reviews, ever.',
    color: 'text-[#FFD530]',
    bg: 'bg-yellow-50',
    border: 'border-yellow-100',
  },
  {
    icon: CreditCard,
    title: 'Transparent Pricing',
    description: 'See hourly rates upfront. No hidden fees, no surprise charges.',
    color: 'text-purple-500',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Support',
    description: 'Our support team is always ready to help with any issue or question.',
    color: 'text-orange-500',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
  },
];

export default function WhyChoose() {
  return (
    <section className="py-14 relative overflow-hidden" aria-labelledby="why-title">
      {/* Background image — lazy loaded, does not block paint */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/why-choose-bg.jpg"
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/65" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[#FFD530] text-sm font-semibold uppercase tracking-widest">Why Us</span>
          <h2 id="why-title" className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            Why Choose FundiConnect?
          </h2>
          <p className="text-gray-400 mt-2 max-w-xl mx-auto text-sm leading-relaxed">
            We built the most reliable way to find and book skilled technicians in Tanzania.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description, color, bg, border }) => (
            <div
              key={title}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-xl ${bg} border ${border} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-6 h-6 ${color}`} aria-hidden="true" />
              </div>
              <h3 className="text-white font-bold text-base mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
