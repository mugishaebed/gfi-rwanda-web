import Image from 'next/image';

export const metadata = {
  title: "Growing Together: Umuganura Export Company Ltd | GFI Rwanda",
  description:
    "How GFI Rwanda's first loan is cultivating sustainability in Rwanda's coffee sector through a partnership with Umuganura Export Company Ltd.",
};

export default function BlogPost() {
  return (
    <main className="bg-white min-h-screen">

      {/* Hero */}
      <div className="relative w-full h-[420px] md:h-[520px] overflow-hidden">
        <Image
          src="/about.png"
          alt="Rwanda coffee sector"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-4xl px-6 md:px-12 pb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#36e17b] mb-4">
              Impact Story
            </p>
            <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight max-w-3xl">
              Growing Together: How Our First Loan's Impact with Umuganura Export Company Ltd is Cultivating Sustainability in Rwanda's Coffee Sector
            </h1>
            <div className="flex items-center gap-3 mt-6">
              <span className="text-xs text-white/60 border border-white/20 rounded-full px-3 py-1">April 8, 2026</span>
              <span className="text-xs text-white/60 border border-white/20 rounded-full px-3 py-1">09:00 AM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Article */}
      <div className="mx-auto max-w-4xl px-6 md:px-12 py-16 md:py-20">
        <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed space-y-8">

          <p className="text-lg text-gray-700 leading-relaxed">
            At Green Financing Incorporate, we believe that every strong tree begins as a carefully nurtured seed. Today we are planting a seed of possibility — one that will grow far beyond the financial value alone. We are proud to support <strong className="text-gray-900">Umuganura Export Company Ltd</strong>, a Rwandan-owned coffee processing and trading firm, in its mission to empower local farmers and champion sustainability in agriculture.
          </p>

          <hr className="border-gray-100" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Who is Umuganura Export Company Ltd?</h2>
            <p>
              Founded in 2018 by Mr. Aloys Nshimiyimana, now a 33-year-old entrepreneur and Managing Director, Umuganura was born from a passion for coffee, local impact, and quality. Aloys has been growing his business for years, and over time moved from renting washing stations and buying cherries for domestic sales to starting his own company. With Umuganura, he set out to strengthen operations, scale up, and reach international markets.
            </p>
            <p className="mt-4">
              Today, Umuganura operates coffee washing stations in Gisagara District and Rwamagana District, working with thousands of smallholder farmers. The company processes the cherries supplied by these farmers, using washing stations that clean, sort, ferment, and dry to produce high-quality green coffee beans. About 50% of Umuganura's clients are international buyers — indicating both global demand and high quality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why This Loan Matters</h2>
            <p>
              Being our first ever loan, this support from Green Finance Incorporated is more than just finance — it is a signpost of trusted partnership, shared values, and a brighter path ahead. Supporting Umuganura allows us to contribute in key ways:
            </p>

            <div className="mt-6 space-y-6">
              {[
                {
                  n: '01',
                  title: 'Empowering Smallholder Farmers',
                  body: 'Umuganura sources its cherries from local farmers in Gisagara and Rwamagana. With better processing, fairer prices, improved logistics, and access to international markets, these farmers can see more stable income, better livelihoods, and more predictability.',
                },
                {
                  n: '02',
                  title: 'Enhancing Quality and Reaching Global Markets',
                  body: 'By investing in the washing stations, in quality control, in timely processing and shipments, Umuganura can maintain and raise the quality of its green coffee. More international buyers means more opportunities, and having a strong, reputable exporter in Rwanda helps lift the reputation of our whole coffee sector.',
                },
                {
                  n: '03',
                  title: 'Promoting Sustainability in Agriculture',
                  body: 'Umuganura is already doing more than just processing coffee. They are training farmers in sustainable practices such as intercropping (growing coffee alongside shade trees or other crops), converting coffee husks into manure to improve soil fertility, treating waste products at the washing stations, building wells or improving water access, and supporting nutrition and income diversification through vegetable projects. These are not just good for business — they are good for people, land, and future generations.',
                },
                {
                  n: '04',
                  title: 'Creating Ripple Effects of Community Development',
                  body: 'When a farmer earns more; when roads are repaired so cherries can reach stations more reliably; when nutrition improves in farming families; when environmental health improves — these are growth multipliers. This loan helps magnify those positive effects across communities.',
                },
              ].map((item) => (
                <div key={item.n} className="flex gap-5 items-start p-6 bg-gray-50 rounded-2xl">
                  <div className="relative shrink-0 w-14 h-12">
                    <div className="absolute bottom-0 left-0 w-9 h-9 bg-[#36e17b]/20 rounded-lg" />
                    <span className="absolute top-0 right-0 text-2xl font-bold text-gray-900 leading-none">{item.n}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Green Finance Incorporated: Our Mission & Why We Chose Umuganura</h2>
            <p>
              Green Finance Incorporated, established in 2025, is rooted in the conviction that SME businesses are the backbone of our economy, and that sustainable practices in agriculture are not optional — they are essential. We exist to support enterprises that combine profitability with purpose: those that build resilient communities, promote environmental health, and preserve the beauty and richness of Rwanda's lands and people.
            </p>
            <p className="mt-4">We chose Umuganura for this first loan because:</p>
            <ul className="mt-4 space-y-2 list-none pl-0">
              {[
                'They are founded, led by, and deeply connected with the local community.',
                'They are already operational, with proven practices and reach, yet still have room to grow and scale.',
                'Their model aligns with our values: high quality, transparency, environmental stewardship, community-investment.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1 w-2 h-2 rounded-full bg-[#36e17b] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Hope to See</h2>
            <p>
              The loan will be used by Umuganura to scale up their operations: improving processing capacity, maintaining and enhancing coffee washing stations, improving logistics, possibly investing in infrastructure that supports sustainability (waste treatment, soil health, water access), and further training farmers. Over time, we hope to see:
            </p>
            <ul className="mt-4 space-y-2 list-none pl-0">
              {[
                'Increased incomes for farmers supplying cherries',
                'More job opportunities in the washing stations and associated supply chain',
                'Better environmental impact: less waste, responsible water use, healthier soils',
                'Stronger positioning of Rwanda\'s coffee in international markets',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1 w-2 h-2 rounded-full bg-[#36e17b] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">A Shared Vision for Growth</h2>
            <p>
              This partnership is not just about Green Finance Incorporated or Umuganura alone. It is about Rwanda's journey — towards resilient agriculture, vibrant rural livelihoods, and a future where our natural resources are a source of life, not risk. It is about telling the world: when we invest with purpose, when we believe in local entrepreneurs, and when we measure success not only in profit but in people and land, we all rise together.
            </p>
            <p className="mt-4">
              At Green Finance Incorporated, we are inspired by what Umuganura Export Company Ltd has achieved so far — and excited by what is yet to come. We invite you — our partners, clients, readers — to follow along, support local farmers, value sustainability, and believe in what can grow from loaned capital rooted in trust, vision, and community.
            </p>
            <p className="mt-4">
              Africa Harvest Holding (AHH) was supporting Umuganura and did their pre-financing, and it is through this relationship that we were inspired to formalise the partnership under Green Finance Inc — a non-deposit taking lending institution. AHH identified opportunities in agri-business, particularly in the coffee sector, and their experience and existing relationships in the industry gave us confidence. As a green financing institution, we recognised that financing coffee agriculture creates a unique opportunity to contribute to carbon credit initiatives and reduced emissions — by supporting more sustainable practices that protect the environment and provide long-term financial benefits to farmers. Moving forward, we remain committed to ESG standards and specifications.
            </p>
          </section>

          {/* Closing quote */}
          <blockquote className="border-l-4 border-[#36e17b] pl-6 py-2 my-8">
            <p className="text-xl font-semibold text-gray-900 italic leading-relaxed">
              "Together, we grow."
            </p>
            <footer className="mt-2 text-sm text-gray-400">— Green Financing Incorporate</footer>
          </blockquote>

        </div>

        {/* Back link */}
        <div className="mt-16 pt-8 border-t border-gray-100">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#36e17b] hover:gap-3 transition-all"
          >
            ← Back to Home
          </a>
        </div>
      </div>

    </main>
  );
}
