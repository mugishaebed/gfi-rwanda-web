import Image from 'next/image';
import FadeIn from './FadeIn';

const reasons = [
  {
    number: '01',
    title: 'BNR-Regulated Lending',
    description:
      'Fully compliant with National Bank of Rwanda guidelines for non-deposit taking institutions, giving you confidence in every transaction.',
  },
  {
    number: '02',
    title: 'Dual-Division Capability',
    description:
      'Unique combination of green lending and expert consultancy under one roof — your one-stop partner for finance and growth strategy.',
  },
  {
    number: '03',
    title: 'Mission-Aligned Capital',
    description:
      'Every loan deployed is directed toward green, sustainable, and climate-positive projects contributing to Rwanda\'s Vision 2050.',
  },
  {
    number: '04',
    title: 'Expert Local Team',
    description:
      'Deep knowledge of Rwanda\'s regulatory environment, tax landscape, and business ecosystem — specialists in finance, ICT, and project management.',
  },
];

export default function WhyGFI() {
  return (
    <section id="why-gfi" className="w-full py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-center">

          {/* Image */}
          <FadeIn direction="left" className="w-full md:w-2/5 shrink-0">
            <Image
              src="/about.png"
              alt="Why choose GFI Rwanda"
              width={700}
              height={820}
              className="w-full h-auto object-cover rounded-2xl"
            />
          </FadeIn>

          {/* Content */}
          <div className="flex flex-col gap-10 md:w-3/5">
            {/* Header */}
            <FadeIn direction="right">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#36e17b] mb-3">
                Why Choose GFI
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Rwanda&apos;s green<br />finance partner
              </h2>
            </FadeIn>

            {/* Reasons */}
            <div className="flex flex-col gap-8">
              {reasons.map((reason, i) => (
                <FadeIn key={reason.number} direction="right" delay={i * 100}>
                  <div className="flex items-start gap-5">
                    {/* Number badge */}
                    <div className="relative shrink-0 w-14 h-14">
                      <div className="absolute bottom-0 left-0 w-10 h-10 bg-[#36e17b]/20 rounded-lg" />
                      <span className="absolute top-0 right-0 text-3xl font-bold text-gray-900 leading-none">
                        {reason.number}
                      </span>
                    </div>

                    {/* Text */}
                    <div className="flex flex-col gap-1 pt-1">
                      <h3 className="text-base font-semibold text-gray-900">
                        {reason.title}
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {reason.description}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
