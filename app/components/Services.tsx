import FadeIn from './FadeIn';

const divisions = [
  {
    tag: 'Division 01',
    title: 'Green Financial Services',
    description:
      'Our non-deposit taking lending arm finances green and sustainable projects across Rwanda. From loan origination and appraisal to portfolio management and recovery — we put capital to work where it matters most.',
    href: '/services/green-financial-services',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-14 h-14">
        <circle cx="32" cy="20" r="10" />
        <path d="M32 10v20M28 14h6M28 22h6" />
        <path d="M16 54c0-8.837 7.163-16 16-16s16 7.163 16 16" />
        <path d="M44 40l4 4M20 40l-4 4" />
      </svg>
    ),
  },
  {
    tag: 'Division 02',
    title: 'Consultancy Services',
    description:
      'Our advisory arm delivers high-impact business consultancy, ICT infrastructure, and tax compliance solutions — helping organisations grow sustainably under one roof.',
    href: '/services/consultancy-services',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-14 h-14">
        <rect x="10" y="10" width="44" height="32" rx="4" />
        <path d="M22 42v8M42 42v8M16 50h32" />
        <path d="M20 26l8 6 16-12" />
      </svg>
    ),
  },
];

export default function Services() {
  return (
    <section id="services" className="w-full py-20 md:py-28" style={{ backgroundColor: '#e8faf0' }}>
      <div className="mx-auto max-w-7xl px-6 md:px-12">

        {/* Header */}
        <FadeIn className="max-w-2xl mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#36e17b] mb-4">
            What we do
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-5">
            Two divisions, one purpose
          </h2>
          <p className="text-gray-500 text-base md:text-lg leading-relaxed">
            End-to-end green finance and advisory services for Rwanda&apos;s sustainable future.
          </p>
        </FadeIn>

        {/* Division cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {divisions.map((div, i) => (
            <FadeIn key={div.tag} delay={i * 120}>
              <a
                href={div.href}
                className="group flex flex-col gap-6 p-8 md:p-10 border border-gray-200 rounded-2xl hover:border-[#36e17b]/40 transition-all duration-300 h-full"
              >
                <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  {div.tag}
                </span>
                <div className="text-[#36e17b]">{div.icon}</div>
                <div className="w-8 h-0.5 bg-[#36e17b] rounded-full" />
                <h3 className="text-xl font-bold text-gray-900">{div.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed flex-1">{div.description}</p>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-[#36e17b] group-hover:gap-3 transition-all w-fit mt-2">
                  Learn more →
                </span>
              </a>
            </FadeIn>
          ))}
        </div>

      </div>
    </section>
  );
}
