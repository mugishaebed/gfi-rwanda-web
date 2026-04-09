import Image from 'next/image';
import FadeIn from './FadeIn';

const posts = [
  {
    slug: 'umuganura-export-company-loan',
    title:
      'Growing Together: How Our First Loan\'s Impact with Umuganura Export Company Ltd is Cultivating Sustainability in Rwanda\'s Coffee Sector',
    excerpt:
      'At Green Financing Incorporate, we believe that every strong tree begins as a carefully nurtured seed. Today we are planting a seed of possibility — one that will grow far beyond the financial value alone. We are proud to support Umuganura Export Company Ltd, a Rwandan-owned coffee processing and trading firm, in its mission to empower local farmers and champion sustainability in agriculture.',
    date: 'April 8, 2026',
    time: '09:00 AM',
    image: '/about.png',
  },
  {
    slug: 'green-finance-vision-2050',
    title:
      'Mobilising Climate Capital: GFI\'s Role in Advancing Rwanda\'s Vision 2050 Green Economy Goals',
    excerpt:
      'Rwanda\'s Vision 2050 sets an ambitious target for a prosperous, knowledge-based economy built on sustainable foundations. Green Financing Incorporate stands at the intersection of capital access and climate action — bridging the gap between green ambitions and the funding needed to realise them.',
    date: 'March 21, 2026',
    time: '10:30 AM',
    image: '/hero.png',
  },
];

export default function Blogs() {
  return (
    <section id="blogs" className="w-full py-20 md:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-6 md:px-12">

        {/* Header */}
        <FadeIn className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#36e17b] mb-3">
            Latest News
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Insights & Updates
          </h2>
          <p className="text-base text-gray-500 max-w-lg leading-relaxed">
            Stay updated with the latest news, stories, and developments from GFI Rwanda.
          </p>
        </FadeIn>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post, i) => (
            <FadeIn key={post.slug} delay={i * 120}>
              <a
                href={`/blog/${post.slug}`}
                className="group flex flex-col border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full"
              >
                {/* Image */}
                <div className="overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={800}
                    height={420}
                    className="w-full h-60 object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-4 p-7 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 leading-snug group-hover:text-[#36e17b] transition-colors">
                    {post.title}
                  </h3>

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="border border-gray-200 rounded-full px-3 py-1">
                      {post.date}
                    </span>
                    <span className="border border-gray-200 rounded-full px-3 py-1">
                      {post.time}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 leading-relaxed flex-1">
                    {post.excerpt}
                  </p>

                  <span className="inline-flex items-center gap-2 text-sm font-medium text-[#36e17b] mt-2 group-hover:gap-3 transition-all">
                    Read more →
                  </span>
                </div>
              </a>
            </FadeIn>
          ))}
        </div>

      </div>
    </section>
  );
}
