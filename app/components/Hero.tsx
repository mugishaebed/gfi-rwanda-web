import Image from 'next/image';

interface HeroProps {
  heading: string;
  description: string;
  buttonText?: string;
  buttonHref?: string;
  imageSrc: string;
  imageAlt: string;
}

export default function Hero({
  heading,
  description,
  buttonText = 'Get started',
  buttonHref,
  imageSrc,
  imageAlt,
}: HeroProps) {
  return (
    <section className="w-full py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="flex flex-col gap-10 md:gap-12 md:flex-row items-center">
          {/* Text Content */}
          <div className="flex flex-col gap-6 md:w-5/12 md:pr-10">
            <h1
              className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 leading-tight"
              style={{ animation: 'fade-up 0.7s ease 0ms both' }}
            >
              {heading}
            </h1>
            <p
              className="text-lg md:text-xl text-gray-600 leading-relaxed"
              style={{ animation: 'fade-up 0.7s ease 120ms both' }}
            >
              {description}
            </p>
            <div style={{ animation: 'fade-up 0.7s ease 240ms both' }}>
              {buttonHref ? (
                <a
                  href={buttonHref}
                  className="inline-flex items-center justify-center rounded-full px-8 py-3 font-medium text-[#36e17b] border-2 border-[#36e17b] bg-transparent hover:bg-[#36e17b] hover:text-white transition-colors w-fit"
                >
                  {buttonText}
                </a>
              ) : (
                <button className="inline-flex items-center justify-center rounded-full px-8 py-3 font-medium text-[#36e17b] border-1 border-[#36e17b] bg-transparent hover:bg-[#36e17b] hover:text-white transition-colors cursor-pointer">
                  {buttonText}
                </button>
              )}
            </div>
          </div>

          {/* Image */}
          <div
            className="w-full md:w-7/12 md:pl-10 lg:pl-16"
            style={{ animation: 'fade-right 0.8s ease 200ms both' }}
          >
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={1100}
              height={800}
              priority
              className="w-full h-auto max-w-[720px] md:max-w-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
