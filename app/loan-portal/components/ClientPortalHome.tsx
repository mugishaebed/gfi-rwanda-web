'use client';

import { useState } from 'react';
import { useAuth } from '@/app/lib/auth-context';
import ClientLoanDashboard from './ClientLoanDashboard';
import ClientOnboardingDashboard from './ClientOnboardingDashboard';

export default function ClientPortalHome() {
  const { clientOnboardingStatus, refreshSession } = useAuth();
  const [checking, setChecking] = useState(false);

  if (clientOnboardingStatus === 'PENDING_PROFILE') {
    return <ClientOnboardingDashboard />;
  }

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
          Your profile setup is complete
        </h1>
        <p className="mt-3 text-sm leading-6 text-amber-800">
          Our team is currently reviewing your account. Please sit back and relax — we’ll notify you as soon as your account has been approved and activated.
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

  return <ClientLoanDashboard />;
}
