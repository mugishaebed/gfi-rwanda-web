import Image from 'next/image';
import Link from 'next/link';
import FadeIn from '../components/FadeIn';

export const metadata = {
  title: 'About Us | GFI Rwanda',
  description:
    'Learn about Green Financing Incorporate Ltd — Rwanda\'s dedicated green lending and advisory institution.',
};

export default function AboutPage() {
  return (
    <main className="bg-white min-h-screen">

      {/* Hero banner */}
      <div className="relative w-full h-72 md:h-96 overflow-hidden">
        <Image
          src="/about.png"
          alt="About GFI Rwanda"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="mx-auto w-full max-w-7xl px-6 md:px-12 pb-10">
            <nav
              className="flex items-center gap-2 text-sm mb-4"
              aria-label="Breadcrumb"
              style={{ animation: 'fade-up 0.6s ease 100ms both' }}
            >
              <Link href="/" className="text-white/60 hover:text-[#00d63b] transition-colors">
                Home
              </Link>
              <span className="text-white/40">/</span>
              <span className="text-white font-medium">About Us</span>
            </nav>
            <h1
              className="text-3xl md:text-5xl font-bold text-white"
              style={{ animation: 'fade-up 0.7s ease 200ms both' }}
            >
              About GFI Rwanda
            </h1>
          </div>
        </div>
      </div>

      {/* About content */}
      <section className="mx-auto max-w-7xl px-6 md:px-12 py-16 md:py-24">
        <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-center">
          <FadeIn direction="left" className="w-full md:w-2/5 shrink-0">
            <Image
              src="/about.png"
              alt="GFI Rwanda"
              width={700}
              height={520}
              className="w-full h-auto object-cover rounded-2xl"
            />
          </FadeIn>
          <FadeIn direction="right" delay={100} className="flex flex-col gap-6 md:w-3/5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#36e17b]">
              Who We Are
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Rwanda's Green Finance Partner
            </h2>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              Green Financing Incorporate Ltd is a non-deposit taking lending institution and consultancy firm based in Kigali, Rwanda. Operating under the oversight of the National Bank of Rwanda (BNR), GFI bridges the gap between green ambitions and capital access.
            </p>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              Our dual-division model delivers both financial services for green project lending and advisory consultancy for businesses seeking sustainable strategies, ICT transformation, and tax compliance — all under one roof.
            </p>
            {/* Key facts */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              {[
                { label: 'Founded', value: '2025' },
                { label: 'Regulated by', value: 'BNR' },
                { label: 'Based in', value: 'Kigali, Rwanda' },
                { label: 'Divisions', value: '2 Core' },
              ].map((fact) => (
                <div key={fact.label} className="flex flex-col gap-1 p-4 bg-gray-50 rounded-xl">
                  <span className="text-xs text-gray-400 uppercase tracking-widest">{fact.label}</span>
                  <span className="text-lg font-bold text-gray-900">{fact.value}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="w-full py-16 md:py-24" style={{ backgroundColor: '#e8faf0' }}>
        <div className="mx-auto max-w-7xl px-6 md:px-12">

          {/* Header */}
          <FadeIn className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#36e17b] mb-3">
              Our Purpose
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mission & Vision
            </h2>
            <p className="text-gray-600 text-base max-w-xl leading-relaxed">
              Rooted in purpose, driven by sustainability — everything we do is guided by a clear mission and a bold vision for Rwanda's future.
            </p>
          </FadeIn>

          {/* Mission */}
          <FadeIn className="relative flex flex-col lg:flex-row gap-0 mb-6">
            <div className="w-full lg:w-5/12">
              <Image
                src="/about.png"
                alt="Our Mission"
                width={700}
                height={520}
                className="w-full h-72 md:h-96 object-cover rounded-2xl grayscale"
              />
            </div>
            <div className="relative lg:-ml-8 lg:mt-12 self-start w-full lg:w-7/12 bg-white rounded-2xl p-8 md:p-10 flex flex-col gap-4 z-10 shadow-sm">
              <div className="w-8 h-0.5 bg-[#36e17b] rounded-full" />
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Mission</h3>
              <p className="text-gray-600 leading-relaxed text-base">
                To mobilise purpose-driven capital for green and sustainable projects across Rwanda — providing SMEs and entrepreneurs with accessible financing, expert advisory, and the tools to grow responsibly. We are committed to building a lending institution that measures success not only in financial returns, but in environmental stewardship and community impact.
              </p>
            </div>
          </FadeIn>

          {/* Vision */}
          <FadeIn delay={100} className="relative flex flex-col lg:flex-row-reverse gap-0 mt-10">
            <div className="w-full lg:w-5/12">
              <Image
                src="/hero.png"
                alt="Our Vision"
                width={700}
                height={520}
                className="w-full h-72 md:h-96 object-cover rounded-2xl grayscale"
              />
            </div>
            <div className="relative lg:-mr-8 lg:mt-12 self-start w-full lg:w-7/12 bg-white rounded-2xl p-8 md:p-10 flex flex-col gap-4 z-10 shadow-sm">
              <div className="w-8 h-0.5 bg-[#36e17b] rounded-full" />
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Vision</h3>
              <p className="text-gray-600 leading-relaxed text-base">
                To be Rwanda's most trusted green finance institution — a recognised leader in climate-aligned lending and sustainable advisory by 2030. We envision a Rwanda where every entrepreneur has access to the capital and knowledge needed to build businesses that are profitable, planet-positive, and people-centred, contributing boldly to Vision 2050.
              </p>
            </div>
          </FadeIn>

        </div>
      </section>

    </main>
  );
}
