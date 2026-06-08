'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/lib/auth-context';

function formatStatus(value: string | null) {
  if (!value) return 'Client account';

  return value.replaceAll('_', ' ').toLowerCase();
}

export default function ClientSettingsPage() {
  const router = useRouter();
  const { user, clientOnboardingStatus, refreshSession, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/auth/client');
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#168a45]">
          Account
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-950">Settings</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
          Review your signed-in account and refresh your client approval status.
        </p>
      </div>

      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-base font-bold text-gray-950">Account details</h2>
        <dl className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-gray-50 p-4">
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
              Name
            </dt>
            <dd className="mt-1 text-sm font-semibold text-gray-950">
              {user?.name ?? 'Client'}
            </dd>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
              Email
            </dt>
            <dd className="mt-1 break-words text-sm font-semibold text-gray-950">
              {user?.email}
            </dd>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
              Status
            </dt>
            <dd className="mt-1 text-sm font-semibold capitalize text-gray-950">
              {formatStatus(clientOnboardingStatus)}
            </dd>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
              Role
            </dt>
            <dd className="mt-1 text-sm font-semibold text-gray-950">Client</dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void refreshSession()}
            className="rounded-lg bg-[#36e17b] px-4 py-2.5 text-sm font-bold text-gray-950 transition-colors hover:bg-[#20c968]"
          >
            Refresh status
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-950"
          >
            Log out
          </button>
        </div>
      </section>
    </div>
  );
}
