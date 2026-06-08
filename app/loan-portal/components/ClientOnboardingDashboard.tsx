'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useAuth } from '@/app/lib/auth-context';
import {
  calculateProfileProgress,
  initialProfileFormData,
  readProfileDraft,
  type ProfileDraft,
} from '../lib/profile-draft';

function formatSavedAt(value: string) {
  return new Date(value).toLocaleDateString('en-RW', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ClientOnboardingDashboard() {
  const { user } = useAuth();
  const [draft] = useState<ProfileDraft | null>(() =>
    user?.userId ? readProfileDraft(user.userId) : null,
  );

  const formData = draft?.formData ?? initialProfileFormData;

  const progress = useMemo(
    () => calculateProfileProgress(formData, user?.email),
    [formData, user?.email],
  );

  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#168a45]">
              Client Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-950">
              Complete your profile
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Your account is ready. Finish your client profile so a loan officer
              can review it and activate loan access.
            </p>
          </div>

          <Link
            href="/loan-portal/profile"
            className="inline-flex items-center justify-center rounded-lg bg-[#36e17b] px-5 py-3 text-sm font-bold text-gray-950 transition-colors hover:bg-[#20c968]"
          >
            {progress > 0 ? 'Continue profile' : 'Start profile'}
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-gray-950">
                Profile completion
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Saved automatically on this device.
              </p>
            </div>
            <p className="text-3xl font-bold text-gray-950">{progress}%</p>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-[#36e17b] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-5 grid gap-3 text-sm md:grid-cols-2">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="font-semibold text-gray-950">Profile type</p>
              <p className="mt-1 text-gray-500">Individual</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="font-semibold text-gray-950">Draft status</p>
              <p className="mt-1 text-gray-500">
                {draft ? `Saved ${formatSavedAt(draft.updatedAt)}` : 'No draft yet'}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-base font-bold text-gray-950">Next steps</h2>
          <div className="mt-5 space-y-4">
            <div className="flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#36e17b] text-xs font-bold text-gray-950">
                1
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-950">
                  Complete profile
                </p>
                <p className="mt-1 text-sm leading-5 text-gray-500">
                  Fill the required fields and submit for review.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-500">
                2
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-950">
                  Officer approval
                </p>
                <p className="mt-1 text-sm leading-5 text-gray-500">
                  A loan officer reviews and activates the profile.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-500">
                3
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-950">
                  Request loans
                </p>
                <p className="mt-1 text-sm leading-5 text-gray-500">
                  Active clients can list loans and submit requests.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
