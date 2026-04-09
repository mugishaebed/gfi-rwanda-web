import Image from 'next/image';
import Link from 'next/link';
import ContactForm from './ContactForm';
import Map from '../components/Map';
import FadeIn from '../components/FadeIn';

export const metadata = {
  title: 'Contact Us | GFI Rwanda',
  description:
    'Reach GFI Rwanda for green financing, consultancy support, and partnership enquiries.',
};

const contactDetails = [
  {
    label: 'Location',
    value: 'MIC Building, 4th Floor, Kigali - Rwanda',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    label: 'Email',
    value: 'info@gfi-rwanda.com',
    href: 'mailto:info@gfi-rwanda.com',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    label: 'Phone',
    value: '+250 700 000 000',
    href: 'tel:+250700000000',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z" />
      </svg>
    ),
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero banner */}
      <div className="relative w-full h-72 overflow-hidden md:h-96">
        <Image
          src="/hero.png"
          alt="Contact GFI Rwanda"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="mx-auto w-full max-w-7xl px-6 pb-10 md:px-12">
            <nav className="mb-4 flex items-center gap-2 text-sm" aria-label="Breadcrumb">
              <Link href="/" className="text-white/60 transition-colors hover:text-[#36e17b]">
                Home
              </Link>
              <span className="text-white/40">/</span>
              <span className="font-medium text-white">Contact Us</span>
            </nav>
            <h1 className="text-3xl font-bold text-white md:text-5xl">Contact Us</h1>
          </div>
        </div>
      </div>

      {/* Main content */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="flex flex-col gap-16 lg:flex-row lg:gap-20">

            {/* Left column — info */}
            <FadeIn direction="left" className="flex flex-col gap-10 lg:w-5/12">
              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#36e07b]">
                  Get In Touch
                </p>
                <h2 className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
                  We&apos;d love to hear from you!
                </h2>
                <p className="mt-6 text-base leading-relaxed text-gray-600 md:text-lg">
                  Whether you&apos;re looking for green financing, tailored advisory support, or
                  simply want to learn more about what we do, our team is ready to help.
                </p>
              </div>

              {/* Contact details */}
              <ul className="flex flex-col gap-5">
                {contactDetails.map((item) => (
                  <li key={item.label} className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e8faf0] text-[#1f9d53]">
                      {item.icon}
                    </span>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                        {item.label}
                      </span>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-sm font-medium text-gray-900 transition-colors hover:text-[#36e17b]"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <span className="text-sm font-medium text-gray-900">{item.value}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              {/* Office hours */}
              <div className="rounded-2xl bg-[#e8faf0] p-7">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#36e17b]">
                  Office Hours
                </p>
                <div className="grid gap-4 text-sm sm:grid-cols-2">
                  <div>
                    <p className="font-semibold text-gray-900">Monday – Friday</p>
                    <p className="mt-1 text-gray-600">8:00 AM – 5:00 PM</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Saturday – Sunday</p>
                    <p className="mt-1 text-gray-600">Closed</p>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Right column — form */}
            <FadeIn direction="right" delay={100} className="lg:w-7/12">
              <ContactForm />
            </FadeIn>

          </div>
        </div>
      </section>
      <Map />
    </main>
  );
}
