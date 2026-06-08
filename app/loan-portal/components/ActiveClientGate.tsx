'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/lib/auth-context';

export default function ActiveClientGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { clientOnboardingStatus, refreshSession } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (clientOnboardingStatus === 'PENDING_PROFILE') {
      router.replace('/loan-portal');
    }
  }, [clientOnboardingStatus, router]);

  if (clientOnboardingStatus === 'PENDING_PROFILE') return null;

  if (clientOnboardingStatus === 'PENDING_APPROVAL') {
    const checkStatus = async () => {
      setChecking(true);
      await refreshSession();
      setChecking(false);
    };

    return (
      <section className="mx-auto max-w-2xl rounded-lg border border-amber-200 bg-amber-50 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
          Pending approval
        </p>
        <h1 className="mt-2 text-2xl font-bold text-amber-950">
          Your profile is under review
        </h1>
        <p className="mt-3 text-sm leading-6 text-amber-800">
          A loan officer needs to approve your client profile before you can view
          loans or submit a new loan request. You can sign out and come back after
          approval.
        </p>
        <button
          type="button"
          onClick={checkStatus}
          disabled={checking}
          className="mt-5 rounded-lg bg-amber-900 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-amber-800 disabled:opacity-60"
        >
          {checking ? 'Checking...' : 'Check status'}
        </button>
      </section>
    );
  }

  return <>{children}</>;
}
