import Hero from './components/Hero';
import StatsBar from './components/StatsBar';
import About from './components/About';
import Services from './components/Services';
import WhyGFI from './components/WhyGFI';
import Blogs from './components/Blogs';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Hero
        heading="Financing a Green Rwanda"
        description="Green Financing Incorporate Ltd (GFI Ltd) is Rwanda's dedicated green lending and advisory institution — mobilising capital for sustainable projects, empowering businesses, and building a prosperous low-carbon economy."
        buttonText="Get started"
        imageSrc="/hero.png"
        imageAlt="Illustration of green financing and sustainable development"
      />
      <StatsBar />
      <About
        title="About GFI Rwanda"
        description="Green Financing Incorporate Ltd is a non-deposit taking lending institution and consultancy firm based in Kigali, Rwanda. Operating under the oversight of the National Bank of Rwanda (BNR), GFI bridges the gap between green ambitions and capital access."
        description2="Our dual-division model delivers both financial services for green project lending and advisory consultancy for businesses seeking sustainable strategies, ICT transformation, and tax compliance — all under one roof."
        imageSrc="/about.png"
        imageAlt="Green financing and sustainable development in Rwanda"
        readMoreHref="/about"
      />
      <Services />
      <WhyGFI />
      <Blogs />
    </main>
  );
}
