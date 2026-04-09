import FadeIn from './FadeIn';

const stats = [
  {
    value: 'BNR',
    label: 'Regulated Institution',
    description: 'Licensed and overseen by the National Bank of Rwanda',
  },
  {
    value: '2',
    label: 'Core Divisions',
    description: 'Green lending and advisory consultancy under one roof',
  },
  {
    value: '100%',
    label: 'Green Focus',
    description: 'Every capital deployment directed at sustainable projects',
  },
  {
    value: 'SME',
    label: 'Focused on SMEs',
    description: 'Supporting small and medium enterprises as the backbone of Rwanda\'s economy',
  },
];

export default function StatsBar() {
  return (
    <section className="w-full bg-[#36e07b]">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-white/20">
          {stats.map((stat, i) => (
            <FadeIn key={stat.value} delay={i * 100} className="flex flex-col gap-1 px-8 py-10">
              <span className="text-3xl md:text-4xl font-bold text-white">
                {stat.value}
              </span>
              <span className="text-sm font-semibold text-white mt-1">
                {stat.label}
              </span>
              <span className="text-xs text-white/70 leading-relaxed">
                {stat.description}
              </span>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
