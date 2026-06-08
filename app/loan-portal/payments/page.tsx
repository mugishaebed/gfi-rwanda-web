import Link from 'next/link';
import ActiveClientGate from '../components/ActiveClientGate';
import RepaymentCard from './RepaymentCard';

type PaymentsPageProps = {
  searchParams: Promise<{ loanId?: string | string[] }>;
};

function firstQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function PaymentsPage({ searchParams }: PaymentsPageProps) {
  const selectedLoanId = firstQueryValue((await searchParams).loanId);

  return (
    <ActiveClientGate>
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#168a45]">
              Payments
            </p>
            <h1 className="mt-3 text-3xl font-bold text-gray-950">Make a Payment</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
              View your next payment details and make payments conveniently.
            </p>
          </div>

          <Link
            href="/loan-portal"
            className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:border-gray-300 hover:text-gray-950"
          >
            Back to dashboard
          </Link>
        </div>

        <RepaymentCard initialLoanId={selectedLoanId} />
      </div>
    </ActiveClientGate>
  );
}
