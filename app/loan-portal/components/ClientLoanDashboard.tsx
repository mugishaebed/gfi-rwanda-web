'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState, type SVGProps } from 'react';
import { ApiError, useApiClient } from '@/app/lib/api-client';
import { useAuth } from '@/app/lib/auth-context';
import {
  formatDateLabel,
  formatMoney,
  isPayableLoanStatus,
  statusLabel,
  type ClientLoanDashboardResponse,
  type ClientLoanListItem,
  type ClientLoanStatus,
} from '../lib/client-loans';

type IconProps = SVGProps<SVGSVGElement>;

const statusStyles: Record<ClientLoanStatus, string> = {
  pending: 'border-amber-200 bg-amber-50 text-amber-700',
  active: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  overdue: 'border-red-200 bg-red-50 text-red-700',
  rejected: 'border-rose-200 bg-rose-50 text-rose-700',
  completed: 'border-slate-200 bg-slate-50 text-slate-700',
};

function iconBase({ className, ...props }: IconProps) {
  return {
    ...props,
    'aria-hidden': true,
    className: `h-4 w-4 ${className ?? ''}`,
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 1.9,
    viewBox: '0 0 24 24',
  };
}

function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...iconBase(props)}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function CalendarIcon(props: IconProps) {
  return (
    <svg {...iconBase(props)}>
      <rect x="4" y="5" width="16" height="16" rx="3" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <path d="M4 10h16" />
    </svg>
  );
}

function ClockIcon(props: IconProps) {
  return (
    <svg {...iconBase(props)}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
    </svg>
  );
}

function ReceiptIcon(props: IconProps) {
  return (
    <svg {...iconBase(props)}>
      <path d="M7 3h10v18l-2-1.2-2 1.2-2-1.2-2 1.2-2-1.2z" />
      <path d="M9 8h6" />
      <path d="M9 12h6" />
      <path d="M9 16h4" />
    </svg>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  return 'Good afternoon';
}

function firstName(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.split('@')[0] || 'Client';
  return source.split(/\s+/)[0];
}

function loanCountLabel(count: number) {
  return `${count} loan${count === 1 ? '' : 's'}`;
}

function DashboardLoadingRows() {
  return (
    <>
      {[0, 1, 2].map((item) => (
        <tr key={item}>
          <td className="border-t border-gray-100 px-6 py-5">
            <div className="h-5 w-48 animate-pulse rounded bg-gray-100" />
          </td>
          <td className="border-t border-gray-100 px-6 py-5">
            <div className="h-5 w-24 animate-pulse rounded bg-gray-100" />
          </td>
          <td className="border-t border-gray-100 px-6 py-5">
            <div className="h-5 w-24 animate-pulse rounded bg-gray-100" />
          </td>
          <td className="border-t border-gray-100 px-6 py-5">
            <div className="h-6 w-20 animate-pulse rounded-full bg-gray-100" />
          </td>
          <td className="border-t border-gray-100 px-6 py-5">
            <div className="h-5 w-12 animate-pulse rounded bg-gray-100" />
          </td>
        </tr>
      ))}
    </>
  );
}

function DashboardLoanRow({ loan }: { loan: ClientLoanListItem }) {
  return (
    <tr className="border-t border-gray-100">
      <td className="border-t border-gray-100 px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <ReceiptIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-gray-950">{loan.purpose}</p>
            <p className="mt-1 text-sm text-gray-500">{loan.loanNumber}</p>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap border-t border-gray-100 px-6 py-5 text-sm font-semibold text-gray-800">
        {formatMoney(loan.amount, loan.currency)}
      </td>
      <td className="whitespace-nowrap border-t border-gray-100 px-6 py-5 text-sm font-semibold text-gray-800">
        {formatMoney(loan.remainingBalance, loan.currency)}
      </td>
      <td className="whitespace-nowrap border-t border-gray-100 px-6 py-5">
        <span
          className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold capitalize ${
            statusStyles[loan.status]
          }`}
        >
          {statusLabel(loan.status)}
        </span>
      </td>
      <td className="whitespace-nowrap border-t border-gray-100 px-6 py-5">
        <div className="flex items-center gap-3">
          {isPayableLoanStatus(loan.status) && (
            <Link
              href={`/loan-portal/payments?loanId=${encodeURIComponent(loan.id)}`}
              className="text-sm font-bold text-gray-950 transition hover:text-emerald-700"
            >
              Pay
            </Link>
          )}
          <Link
            href={`/loan-portal/my-loans/${loan.id}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 transition hover:text-emerald-900"
          >
            View
            <ArrowRightIcon />
          </Link>
        </div>
      </td>
    </tr>
  );
}

export default function ClientLoanDashboard() {
  const apiFetch = useApiClient();
  const { user } = useAuth();
  const greeting = useMemo(() => getGreeting(), []);
  const displayName = firstName(user?.name, user?.email);
  const [dashboard, setDashboard] = useState<ClientLoanDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isMountedRef = useRef(true);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, []);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await apiFetch<ClientLoanDashboardResponse>(
        '/v1/clients/me/loan-dashboard',
      );
      if (isMountedRef.current) setDashboard(response);
    } catch (caught) {
      if (!isMountedRef.current) return;
      setError(
        caught instanceof ApiError || caught instanceof Error
          ? caught.message
          : 'Failed to load dashboard.',
      );
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [apiFetch]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    const hasPending = dashboard?.recentLoans?.some((l) => l.status === 'pending') ?? false;

    if (hasPending && !pollTimerRef.current) {
      pollTimerRef.current = setInterval(() => {
        void loadDashboard();
      }, 30_000);
    } else if (!hasPending && pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, [dashboard, loadDashboard]);

  const recentLoans = dashboard?.recentLoans ?? [];
  const loansCount = dashboard?.loansCount ?? recentLoans.length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
          {greeting}, {displayName}
        </h1>
      </div>

      {error && (
        <section className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </section>
      )}

      <section className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="relative overflow-hidden rounded-[2rem] border border-emerald-100 bg-gradient-to-r from-white via-[#f8fff9] to-[#e8f7ed] shadow-sm">
          <div className="grid min-h-[208px] md:grid-cols-[minmax(0,1fr)_minmax(240px,40%)]">
            <div className="relative z-10 flex flex-col justify-center p-6">
              <h2 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
                My Dashboard
              </h2>
              <p className="mt-3 max-w-xl text-base leading-7 text-gray-600">
                Apply, track, and repay digitally
              </p>
              <Link
                href="/loan-portal/request"
                className="mt-5 inline-flex w-fit items-center justify-center gap-3 rounded-full bg-[#36e17b] px-5 py-2.5 text-sm font-bold text-gray-950 shadow-sm transition hover:bg-[#25ca68]"
              >
                Apply for Loan
                <ArrowRightIcon />
              </Link>
            </div>

            <div className="relative hidden min-h-[208px] overflow-hidden md:block">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(54,225,123,0.2),transparent_62%)]" />
              <Image
                src="/hero.png"
                alt=""
                fill
                preload
                sizes="(max-width: 1279px) 42vw, 360px"
                className="object-contain object-center p-3"
              />
            </div>
          </div>
        </div>

        <aside className="flex min-h-[208px] flex-col justify-between rounded-[2rem] border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-emerald-100 bg-white shadow-sm">
              <Image
                src="/logo.png"
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
            </div>
            <div className="min-w-0 flex-1 space-y-2.5">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-gray-500">Active Loan</p>
                <p className="whitespace-nowrap text-base font-bold text-gray-950">
                  {loading ? '...' : formatMoney(dashboard?.activeLoan)}
                </p>
              </div>
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-gray-500">
                  Outstanding Balance
                </p>
                <p className="whitespace-nowrap text-base font-bold text-gray-950">
                  {loading ? '...' : formatMoney(dashboard?.outstandingBalance)}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-2.5">
              <div className="flex items-center gap-2 text-emerald-700">
                <CalendarIcon />
                <span className="text-xs font-semibold">Next Payment Date</span>
              </div>
              <p className="mt-1.5 text-sm font-bold text-gray-950">
                {loading ? '...' : formatDateLabel(dashboard?.nextPaymentDate)}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-2.5">
              <div className="flex items-center gap-2 text-emerald-700">
                <ClockIcon />
                <span className="text-xs font-semibold">Days Remaining</span>
              </div>
              <p className="mt-1.5 text-sm font-bold text-gray-950">
                {loading
                  ? '...'
                  : dashboard?.daysRemaining === null ||
                      dashboard?.daysRemaining === undefined
                    ? 'Not scheduled'
                    : `${dashboard.daysRemaining} days`}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/loan-portal/payments"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-950 transition hover:border-emerald-300 hover:bg-emerald-50"
            >
              <ReceiptIcon />
              Repay
            </Link>
            <Link
              href="/loan-portal/my-loans"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-950 transition hover:border-emerald-300 hover:bg-emerald-50"
            >
              View Loan
              <ArrowRightIcon />
            </Link>
          </div>
        </aside>
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-100 px-6 py-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-950">My Loans</h2>
            <p className="mt-2 text-sm text-gray-500">
              Track active applications, balances, and repayment progress.
            </p>
          </div>
          <p className="text-sm font-semibold text-gray-500">
            {loading ? 'Loading loans...' : loanCountLabel(loansCount)}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr>
                {['Loan', 'Amount', 'Balance', 'Status', 'Action'].map((heading) => (
                  <th
                    key={heading}
                    className="bg-gray-50 px-6 py-4 text-left text-sm font-semibold text-gray-500"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <DashboardLoadingRows />
              ) : recentLoans.length > 0 ? (
                recentLoans.map((loan) => (
                  <DashboardLoanRow key={loan.id} loan={loan} />
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
      </section>
    </div>
  );
}
