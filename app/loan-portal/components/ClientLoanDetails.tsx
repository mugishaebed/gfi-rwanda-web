'use client';

import { useEffect, useState } from 'react';
import { ApiError, useApiClient } from '@/app/lib/api-client';
import type { ClientLoanDetail } from '../lib/client-loans';
import LoanDetails from './LoanDetails';

function LoanDetailsLoading() {
  return (
    <div className="space-y-6">
      <div className="h-20 animate-pulse rounded-[2rem] bg-white" />
      <div className="h-36 animate-pulse rounded-[2rem] bg-white" />
      <div className="h-40 animate-pulse rounded-[2rem] bg-white" />
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="h-64 animate-pulse rounded-[2rem] bg-white" />
        <div className="h-64 animate-pulse rounded-[2rem] bg-white" />
      </div>
    </div>
  );
}

export default function ClientLoanDetails({ loanId }: { loanId: string }) {
  const apiFetch = useApiClient();
  const [loan, setLoan] = useState<ClientLoanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadLoan() {
      setLoading(true);
      setError('');

      try {
        const response = await apiFetch<ClientLoanDetail>(
          `/v1/clients/me/loans/${encodeURIComponent(loanId)}`,
        );
        if (isMounted) setLoan(response);
      } catch (caught) {
        if (!isMounted) return;
        setError(
          caught instanceof ApiError || caught instanceof Error
            ? caught.message
            : 'Failed to load loan details.',
        );
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    void loadLoan();

    return () => {
      isMounted = false;
    };
  }, [apiFetch, loanId]);

  if (loading) return <LoanDetailsLoading />;

  if (error) {
    return (
      <section className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </section>
    );
  }

  if (!loan) {
    return (
      <section className="rounded-lg border border-gray-200 bg-white px-4 py-6 text-sm text-gray-500">
        Loan not found.
      </section>
    );
  }

  return <LoanDetails loan={loan} />;
}
