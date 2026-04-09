import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Green Financial Services | GFI Rwanda',
  description:
    'GFI Rwanda\'s non-deposit taking lending arm — financing green and sustainable projects across Rwanda.',
};

const steps = [
  {
    number: '01',
    title: 'Application',
    description:
      'The borrower submits a loan application to GFI, either in person or through our team. The application captures key details about the project, business background, financing needs, and the expected environmental or community impact.',
    image: '/step-1.png',
  },
  {
    number: '02',
    title: 'Documentation & Verification',
    description:
      'GFI requests supporting documents from the borrower — including identification, income statements, business records, and collateral details where applicable. Our team verifies the information to assess eligibility and creditworthiness.',
    image: '/step-2.png',
  },
  {
    number: '03',
    title: 'Credit Assessment',
    description:
      'A thorough credit assessment is conducted to evaluate the borrower\'s ability to repay. This involves analysing financial history, income stability, debt-to-income ratio, and the viability of the proposed green project.',
    image: '/step-3.png',
  },
  {
    number: '04',
    title: 'Loan Approval',
    description:
      'If the borrower meets GFI\'s lending criteria and passes the credit assessment, the loan is approved. We determine the loan amount, interest rate, repayment schedule, and any conditions attached to the disbursement.',
    image: '/step-4.png',
  },
  {
    number: '05',
    title: 'Disbursement',
    description:
      'Funds are released to the borrower in line with the agreed terms. GFI ensures that disbursement is timely and structured to support the project\'s implementation plan and cash flow requirements.',
    image: '/step-5.png',
  },
  {
    number: '06',
    title: 'Monitoring & Recovery',
    description:
      'Throughout the loan period, GFI actively monitors project progress and loan performance. Our team maintains open communication with borrowers and manages repayment professionally — protecting capital while sustaining the relationship.',
    image: '/step-6.png',
  },
];

export default function GreenFinancialServicesPage() {
  return (
    <main className="bg-white min-h-screen">

      {/* Hero */}
      <div className="relative w-full h-72 md:h-96 overflow-hidden">
        <Image src="/about.png" alt="Green Financial Services" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="mx-auto w-full max-w-7xl px-6 md:px-12 pb-10">
            <nav className="flex items-center gap-2 text-sm mb-4" aria-label="Breadcrumb">
              <Link href="/" className="text-white/60 hover:text-[#00d63b] transition-colors">Home</Link>
              <span className="text-white/40">/</span>
              <Link href="/#services" className="text-white/60 hover:text-[#00d63b] transition-colors">Services</Link>
              <span className="text-white/40">/</span>
              <span className="text-white font-medium">Green Financial Services</span>
            </nav>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#36e17b] mb-3">Division 01</p>
            <h1 className="text-3xl md:text-5xl font-bold text-white">Green Financial Services</h1>
          </div>
        </div>
      </div>

      {/* Intro */}
      <section className="mx-auto max-w-7xl px-6 md:px-12 py-16 md:py-20">
        <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-center">
          <div className="w-full md:w-2/5 shrink-0">
            <Image
              src="/about.png"
              alt="Green Financial Services"
              width={700}
              height={520}
              className="w-full h-auto object-cover rounded-2xl"
            />
          </div>
          <div className="flex flex-col gap-6 md:w-3/5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#36e17b]">Our Lending Arm</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Capital for a Greener Rwanda
            </h2>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              GFI's Green Financial Services division is a BNR-regulated, non-deposit taking lending institution dedicated to financing sustainable projects across Rwanda. We bridge the gap between green ambitions and the capital required to realise them.
            </p>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              Whether you are a smallholder farmer looking to scale, an SME investing in clean energy, or an agri-business building sustainable supply chains — we are the partner that combines financial rigour with mission-driven purpose.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-full px-8 py-3 font-medium text-[#36e17b] hover:text-white border border-[#36e17b] hover:bg-[#36e17b] transition-colors w-fit mt-2"
            >
              Apply for financing
            </a>
          </div>
        </div>
      </section>

      {/* Loan Process */}
      <section className="w-full py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#36e17b] mb-3">The Process</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">How to get a loan</h2>
            <p className="text-gray-500 text-base mt-3 max-w-md mx-auto leading-relaxed">
              A clear, transparent process from application to disbursement — designed to get capital to the right projects, fast.
            </p>
          </div>

          <div className="flex flex-col gap-20 md:gap-28">
            {steps.map((step, i) => {
              const isEven = i % 2 !== 0;
              return (
                <div
                  key={step.number}
                  className={`flex flex-col ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-10 md:gap-16`}
                >
                  {/* Image */}
                  <div className="w-full md:w-5/12 shrink-0">
                    <Image
                      src={step.image}
                      alt={step.title}
                      width={600}
                      height={440}
                      className="w-full h-64 md:h-80 object-cover rounded-2xl"
                    />
                  </div>

                  {/* Text */}
                  <div className="w-full md:w-7/12 flex flex-col gap-4">
                    <span className="text-7xl md:text-8xl font-bold text-gray-100 leading-none select-none -mb-4">
                      {step.number}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {step.title}
                    </h3>
                    <p className="text-base text-gray-500 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-16 md:py-20" style={{ backgroundColor: '#e8faf0' }}>
      <div className="mx-auto max-w-7xl px-6 md:px-12 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#36e17b] mb-4">Ready to grow?</p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5 max-w-xl mx-auto leading-tight">
          Let's put capital to work for your green project
        </h2>
        <p className="text-gray-500 text-base max-w-md mx-auto mb-8 leading-relaxed">
          Reach out to our team to discuss your financing needs and find out how GFI can support your sustainable journey.
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
