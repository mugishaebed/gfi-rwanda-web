import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Consultancy Services | GFI Rwanda',
  description:
    'GFI Rwanda\'s advisory division — delivering tax, ICT, project management, and business development solutions.',
};

const practices = [
  {
    number: '01',
    title: 'Tax & Accounts',
    description:
      'Expert tax management covering CIT, VAT, PAYE, and RRA obligations. Full accounts payable and receivable management for optimal financial efficiency.',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-14 h-14">
        <rect x="12" y="8" width="40" height="48" rx="3" />
        <path d="M20 20h24M20 28h24M20 36h16M20 44h10" />
        <circle cx="46" cy="46" r="8" fill="white" />
        <path d="M43 46h6M46 43v6" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'ICT Solutions',
    description:
      'End-to-end IT infrastructure, MIS systems, digital transformation advisory, and technical support for Rwanda-based organisations.',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-14 h-14">
        <rect x="8" y="14" width="48" height="30" rx="3" />
        <path d="M24 44v6M40 44v6M18 50h28" />
        <path d="M20 29h6M38 29h6M29 29h6" />
        <path d="M20 23h24" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Project Management',
    description:
      'Rigorous planning, execution, and delivery of all consultancy engagements. Managing timelines, budgets, and stakeholder communications.',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-14 h-14">
        <circle cx="32" cy="32" r="22" />
        <path d="M32 16v16l10 6" />
        <path d="M14 32h4M46 32h4M32 14v4M32 46v4" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Business Development',
    description:
      'Strategic partnership building, client acquisition, and pipeline management — driving sustainable revenue growth for GFI and its clients.',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-14 h-14">
        <path d="M8 48l14-14 10 10 24-24" />
        <path d="M42 20h14v14" />
        <circle cx="16" cy="50" r="3" />
        <circle cx="36" cy="44" r="3" />
        <circle cx="56" cy="20" r="3" />
      </svg>
    ),
  },
];

export default function ConsultancyServicesPage() {
  return (
    <main className="bg-white min-h-screen">

      {/* Hero */}
      <div className="relative w-full h-72 md:h-96 overflow-hidden">
        <Image src="/hero.png" alt="Consultancy Services" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="mx-auto w-full max-w-7xl px-6 md:px-12 pb-10">
            <nav className="flex items-center gap-2 text-sm mb-4" aria-label="Breadcrumb">
              <Link href="/" className="text-white/60 hover:text-[#00d63b] transition-colors">Home</Link>
              <span className="text-white/40">/</span>
              <Link href="/#services" className="text-white/60 hover:text-[#00d63b] transition-colors">Services</Link>
              <span className="text-white/40">/</span>
              <span className="text-white font-medium">Consultancy Services</span>
            </nav>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#36e17b] mb-3">Division 02</p>
            <h1 className="text-3xl md:text-5xl font-bold text-white">Consultancy Services</h1>
          </div>
        </div>
      </div>

      {/* Intro */}
      <section className="mx-auto max-w-7xl px-6 md:px-12 py-16 md:py-20">
        <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-center">
          <div className="w-full md:w-2/5 shrink-0">
            <Image
              src="/hero.png"
              alt="Consultancy Services"
              width={700}
              height={520}
              className="w-full h-auto object-cover rounded-2xl"
            />
          </div>
          <div className="flex flex-col gap-6 md:w-3/5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#36e17b]">Our Advisory Arm</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Expert Guidance for Sustainable Growth
            </h2>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              GFI's Consultancy division delivers high-impact advisory services across four specialist practice areas — tax and accounts, ICT infrastructure, project management, and business development. We work alongside organisations to strengthen operations, ensure compliance, and unlock sustainable growth.
            </p>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              Whether you are a growing SME navigating Rwanda's tax landscape, a company undergoing digital transformation, or an organisation seeking strategic partnerships — our expert team brings the knowledge and experience to guide you forward.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-full px-8 py-3 font-medium text-[#36e17b] hover:text-white border border-[#36e17b] hover:bg-[#36e17b] transition-colors w-fit mt-2"
            >
              Get in touch
            </a>
          </div>
        </div>
      </section>

      {/* Practice areas */}
      <section className="w-full py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#36e17b] mb-3">Practice Areas</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Four specialist services</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {practices.map((p) => (
              <div key={p.number} className="group flex flex-col gap-6 p-8 md:p-10 bg-white rounded-2xl border border-gray-100 hover:border-[#36e17b] hover:shadow-md transition-all duration-300">
                <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">{p.number}</span>
                <div className="text-[#36e17b]">{p.icon}</div>
                <div className="w-8 h-0.5 bg-[#36e17b] rounded-full" />
                <h3 className="text-xl font-bold text-gray-900">{p.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed flex-1">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-16 md:py-20" style={{ backgroundColor: '#e8faf0' }}>
        <div className="mx-auto max-w-7xl px-6 md:px-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#36e17b] mb-4">Work with us</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5 max-w-xl mx-auto leading-tight">
            Ready to grow your business sustainably?
          </h2>
          <p className="text-gray-500 text-base max-w-md mx-auto mb-8 leading-relaxed">
            Talk to our consultancy team today and discover how GFI can help your organisation thrive.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center rounded-full px-10 py-3.5 font-medium text-[#36e17b] hover:text-white border border-[#36e17b] hover:bg-[#36e17b] transition-colors"
          >
            Contact Us →
          </a>
        </div>
      </section>

    </main>
  );
}
