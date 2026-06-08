'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ApiError, useApiClient } from '@/app/lib/api-client';
import {
  formatDateLabel,
  formatMoney,
  isPayableLoanStatus,
  statusLabel,
  type ClientLoansResponse,
  type ClientLoanStatus,
} from '../lib/client-loans';

type LoanFilter = 'all' | ClientLoanStatus;

const filters: { label: string; value: LoanFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
  { label: 'Overdue', value: 'overdue' },
  { label: 'Rejected', value: 'rejected' },
];

const statusStyles: Record<ClientLoanStatus, string> = {
  pending: 'border-amber-200 bg-amber-50 text-amber-700',
  active: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  completed: 'border-slate-200 bg-slate-50 text-slate-700',
  overdue: 'border-red-200 bg-red-50 text-red-700',
  rejected: 'border-rose-200 bg-rose-50 text-rose-700',
};

const pageLimit = 20;

function LoadingRows() {
  return (
    <>
      {[0, 1, 2].map((item) => (
        <tr key={item}>
          <td className="border-t border-gray-100 px-6 py-5">
            <div className="h-5 w-32 animate-pulse rounded bg-gray-100" />
          </td>
          <td className="border-t border-gray-100 px-6 py-5">
            <div className="h-5 w-24 animate-pulse rounded bg-gray-100" />
          </td>
          <td className="border-t border-gray-100 px-6 py-5">
            <div className="h-6 w-20 animate-pulse rounded-full bg-gray-100" />
          </td>
          <td className="border-t border-gray-100 px-6 py-5">
            <div className="h-5 w-28 animate-pulse rounded bg-gray-100" />
          </td>
          <td className="border-t border-gray-100 px-6 py-5">
            <div className="h-9 w-16 animate-pulse rounded-full bg-gray-100" />
          </td>
        </tr>
      ))}
    </>
  );
}

export default function ClientMyLoans() {
  const apiFetch = useApiClient();
  const [filter, setFilter] = useState<LoanFilter>('all');
  const [page, setPage] = useState(1);
  const [response, setResponse] = useState<ClientLoansResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setPage(1);
  }, [filter]);

  useEffect(() => {
    let isMounted = true;

    async function loadLoans() {
      setLoading(true);
      setError('');

      const params = new URLSearchParams({
        page: String(page),
        limit: String(pageLimit),
      });

      if (filter !== 'all') {
        params.set('status', filter);
      }

      try {
        const loansResponse = await apiFetch<ClientLoansResponse>(
          `/v1/clients/me/loans?${params.toString()}`,
        );
        if (isMounted) setResponse(loansResponse);
      } catch (caught) {
        if (!isMounted) return;
        setError(
          caught instanceof ApiError || caught instanceof Error
            ? caught.message
            : 'Failed to load loans.',
        );
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    void loadLoans();

    return () => {
      isMounted = false;
    };
  }, [apiFetch, filter, page]);

  const loans = response?.data ?? [];
  const totalLoans = response?.meta.total ?? loans.length;
  const totalPages = response?.meta.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-950">
          My Loans
        </h1>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          Review every loan request, payment status, and upcoming repayment.
        </p>
      </div>

      {error && (
        <section className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </section>
      )}

      <section className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-100 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item.value}
                type="button"
                aria-pressed={filter === item.value}
                onClick={() => setFilter(item.value)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  filter === item.value
                    ? 'bg-gray-950 text-white shadow-sm'
                    : 'bg-gray-50 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <p className="text-sm font-semibold text-gray-500">
            {loading
              ? 'Loading loans...'
              : `${totalLoans} loan${totalLoans === 1 ? '' : 's'}`}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr>
                {['Loan Number', 'Amount', 'Status', 'Next Payment', 'Action'].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="bg-gray-50 px-6 py-4 text-left text-sm font-semibold text-gray-500"
                    >
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <LoadingRows />
              ) : loans.length > 0 ? (
                loans.map((loan) => (
                  <tr key={loan.id} className="transition hover:bg-gray-50">
                    <td className="whitespace-nowrap border-t border-gray-100 px-6 py-5 text-sm font-bold text-gray-950">
                      {loan.loanNumber}
                      <p className="mt-1 max-w-xs truncate text-xs font-medium text-gray-500">
                        {loan.purpose}
                      </p>
                    </td>
                    <td className="whitespace-nowrap border-t border-gray-100 px-6 py-5 text-sm font-semibold text-gray-800">
                      {formatMoney(loan.amount, loan.currency)}
                    </td>
                    <td className="whitespace-nowrap border-t border-gray-100 px-6 py-5">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold capitalize ${statusStyles[loan.status]}`}
                      >
                        {statusLabel(loan.status)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap border-t border-gray-100 px-6 py-5 text-sm font-semibold text-gray-700">
                      {formatDateLabel(loan.nextPayment?.dueDate)}
                    </td>
                    <td className="whitespace-nowrap border-t border-gray-100 px-6 py-5">
                      <div className="flex items-center gap-2">
                        {isPayableLoanStatus(loan.status) && (
                          <Link
                            href={`/loan-portal/payments?loanId=${encodeURIComponent(loan.id)}`}
                            className="rounded-full bg-[#36e17b] px-4 py-2 text-sm font-bold text-gray-950 transition hover:bg-[#25ca68]"
                          >
                            Pay
                          </Link>
                        )}
                        <Link
                          href={`/loan-portal/my-loans/${loan.id}`}
                          className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-950 transition hover:border-emerald-300 hover:bg-emerald-50"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="border-t border-gray-100 px-6 py-8 text-sm text-gray-500"
                  >
                    No loans found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-4 border-t border-gray-100 px-6 py-4">
            <p className="text-sm font-semibold text-gray-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page <= 1 || loading}
                className="rounded-full border border-gray-200 px-4 py-2 text-sm font-bold text-gray-950 transition hover:border-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
                disabled={page >= totalPages || loading}
                className="rounded-full border border-gray-200 px-4 py-2 text-sm font-bold text-gray-950 transition hover:border-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
