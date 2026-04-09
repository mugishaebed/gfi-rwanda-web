import Image from 'next/image';
import FadeIn from './FadeIn';

interface AboutProps {
  title: string;
  description: string;
  description2?: string;
  readMoreHref?: string;
  imageSrc: string;
  imageAlt: string;
}

export default function About({
  title,
  description,
  description2,
  readMoreHref = '/about',
  imageSrc,
  imageAlt,
}: AboutProps) {
  return (
    <section className="w-full py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="flex flex-col gap-10 md:gap-0 md:flex-row items-center">
          {/* Image */}
          <FadeIn direction="left" className="w-full md:w-2/5">
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={700}
              height={520}
              loading="eager"
              className="w-full h-auto object-cover rounded-2xl"
            />
          </FadeIn>

          {/* Text Content */}
          <FadeIn direction="right" delay={100} className="flex flex-col gap-6 md:w-3/5 md:pl-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 uppercase tracking-wide">
              {title}
            </h2>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              {description}
            </p>
            {description2 && (
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                {description2}
              </p>
            )}
            <a
              href={readMoreHref}
              className="inline-flex items-center gap-2 font-medium text-[#36e17b] hover:gap-3 transition-all w-fit mt-6"
            >
              Read More <span aria-hidden="true">→</span>
            </a>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
