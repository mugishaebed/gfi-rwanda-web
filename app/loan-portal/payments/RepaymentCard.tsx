'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from 'react';
import { ApiError, useApiClient } from '@/app/lib/api-client';
import {
  formatDateLabel,
  formatDateTimeLabel,
  formatMoney,
  isPayableLoanStatus,
  statusLabel,
  type ClientLoanListItem,
  type ClientLoanRepayment,
  type ClientLoansResponse,
  type ClientRepaymentsResponse,
  type OnlineLoanPaymentPayload,
} from '../lib/client-loans';

type RepaymentCardProps = {
  initialLoanId?: string;
};

type PaymentFormState = {
  amountPaid: string;
  paymentPhoneNumber: string;
  notes: string;
};

const emptyForm: PaymentFormState = {
  amountPaid: '',
  paymentPhoneNumber: '',
  notes: '',
};

const payableStatusStyles = {
  active: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  overdue: 'border-red-200 bg-red-50 text-red-700',
};

function paymentProviderLabel(provider: string | null | undefined) {
  if (!provider) return 'Mobile money';
  return statusLabel(provider);
}

function getLoanBalance(loan: ClientLoanListItem | null | undefined) {
  return loan?.remainingBalance ?? loan?.totalPayable ?? loan?.amount ?? 0;
}

function getSuggestedAmount(loan: ClientLoanListItem | null | undefined) {
  const amount = loan?.nextPayment?.amount ?? loan?.remainingBalance;
  return amount && amount > 0 ? String(amount) : '';
}

function trimOptional(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function repaymentsFromResponse(
  response: ClientRepaymentsResponse | ClientLoanRepayment[],
) {
  return Array.isArray(response) ? response : response.data ?? [];
}

function uniquePayableLoans(loans: ClientLoanListItem[]) {
  const seen = new Set<string>();

  return loans.filter((loan) => {
    if (seen.has(loan.id) || !isPayableLoanStatus(loan.status)) return false;
    seen.add(loan.id);
    return true;
  });
}

function payableLoansPath(status: 'active' | 'overdue') {
  const params = new URLSearchParams({
    status,
    page: '1',
    limit: '50',
  });

  return `/v1/clients/me/loans?${params.toString()}`;
}

export default function RepaymentCard({ initialLoanId }: RepaymentCardProps) {
  const apiFetch = useApiClient();
  const [loans, setLoans] = useState<ClientLoanListItem[]>([]);
  const [selectedLoanId, setSelectedLoanId] = useState(initialLoanId ?? '');
  const [repayments, setRepayments] = useState<ClientLoanRepayment[]>([]);
  const [form, setForm] = useState<PaymentFormState>(emptyForm);
  const [loadingLoans, setLoadingLoans] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [polling, setPolling] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [historyError, setHistoryError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [successRepayment, setSuccessRepayment] =
    useState<ClientLoanRepayment | null>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollAttemptsRef = useRef(0);

  const loadPayableLoans = useCallback(async () => {
    setLoadingLoans(true);
    setLoadError('');

    try {
      const [activeResponse, overdueResponse] = await Promise.all([
        apiFetch<ClientLoansResponse>(payableLoansPath('active')),
        apiFetch<ClientLoansResponse>(payableLoansPath('overdue')),
      ]);
      const nextLoans = uniquePayableLoans([
        ...(overdueResponse.data ?? []),
        ...(activeResponse.data ?? []),
      ]);

      setLoans(nextLoans);
      setSelectedLoanId((current) => {
        if (current && nextLoans.some((loan) => loan.id === current)) {
          return current;
        }

        if (
          initialLoanId &&
          nextLoans.some((loan) => loan.id === initialLoanId)
        ) {
          return initialLoanId;
        }

        return nextLoans[0]?.id ?? '';
      });
    } catch (caught) {
      setLoadError(
        caught instanceof ApiError || caught instanceof Error
          ? caught.message
          : 'Failed to load payable loans.',
      );
    } finally {
      setLoadingLoans(false);
    }
  }, [apiFetch, initialLoanId]);

  const loadPaymentHistory = useCallback(async () => {
    setLoadingHistory(true);
    setHistoryError('');

    const params = new URLSearchParams({
      status: 'APPROVED',
      page: '1',
      limit: '8',
    });

    try {
      const response = await apiFetch<
        ClientRepaymentsResponse | ClientLoanRepayment[]
      >(`/v1/clients/me/repayments?${params.toString()}`);
      setRepayments(repaymentsFromResponse(response));
    } catch (caught) {
      setHistoryError(
        caught instanceof ApiError || caught instanceof Error
          ? caught.message
          : 'Failed to load payment history.',
      );
    } finally {
      setLoadingHistory(false);
    }
  }, [apiFetch]);

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    pollAttemptsRef.current = 0;
    setPolling(false);
  }, []);

  const startPolling = useCallback(
    (repaymentId: string) => {
      stopPolling();
      pollAttemptsRef.current = 0;
      setPolling(true);

      pollIntervalRef.current = setInterval(async () => {
        pollAttemptsRef.current += 1;

        try {
          const updated = await apiFetch<ClientLoanRepayment>(
            `/v1/clients/me/repayments/${encodeURIComponent(repaymentId)}`,
          );

          if (updated.status === 'APPROVED') {
            stopPolling();
            setSuccessRepayment(updated);
            await Promise.all([loadPayableLoans(), loadPaymentHistory()]);
          } else if (updated.status === 'REJECTED' || pollAttemptsRef.current >= 24) {
            stopPolling();
            setSuccessRepayment(null);
            setSubmitError(
              updated.status === 'REJECTED'
                ? 'Payment was declined. Please try again.'
                : 'Payment confirmation timed out. Please try again.',
            );
          }
        } catch {
          // ignore transient poll errors
        }
      }, 5_000);
    },
    [apiFetch, stopPolling, loadPayableLoans, loadPaymentHistory],
  );

  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  useEffect(() => {
    void loadPayableLoans();
    void loadPaymentHistory();
  }, [loadPayableLoans, loadPaymentHistory]);

  const selectedLoan = useMemo(
    () => loans.find((loan) => loan.id === selectedLoanId) ?? null,
    [loans, selectedLoanId],
  );

  useEffect(() => {
    if (!selectedLoan) return;

    setForm((current) => ({
      ...current,
      amountPaid: getSuggestedAmount(selectedLoan),
    }));
    setSubmitError('');
  }, [selectedLoan]);

  const handleInputChange = (
    field: keyof PaymentFormState,
    value: string,
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    setSubmitError('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError('');
    setSuccessRepayment(null);

    if (!selectedLoan) {
      setSubmitError('Select an active or overdue loan before paying.');
      return;
    }

    const amountPaid = Number(form.amountPaid);
    const outstandingBalance = getLoanBalance(selectedLoan);

    if (!Number.isFinite(amountPaid) || amountPaid <= 0) {
      setSubmitError('Enter a payment amount greater than zero.');
      return;
    }

    if (!Number.isInteger(amountPaid)) {
      setSubmitError('Enter a whole amount in RWF.');
      return;
    }

    if (outstandingBalance > 0 && amountPaid > outstandingBalance) {
      setSubmitError(
        `Payment amount cannot exceed ${formatMoney(
          outstandingBalance,
          selectedLoan.currency,
        )}.`,
      );
      return;
    }

    const paymentPhoneNumber = trimOptional(form.paymentPhoneNumber);
    const notes = trimOptional(form.notes);

    const payload: OnlineLoanPaymentPayload = {
      amountPaid,
      paymentProvider: 'MOBILE_MONEY',
    };

    if (paymentPhoneNumber) payload.paymentPhoneNumber = paymentPhoneNumber;
    if (notes) payload.notes = notes;

    setSubmitting(true);

    try {
      const repayment = await apiFetch<ClientLoanRepayment>(
        `/v1/clients/me/loans/${encodeURIComponent(selectedLoan.id)}/payments`,
        {
          method: 'POST',
          body: JSON.stringify(payload),
        },
      );

      setSuccessRepayment(repayment);
      setForm((current) => ({ ...current, notes: '' }));

      if (repayment.status === 'PENDING') {
        startPolling(repayment.id);
      } else {
        await Promise.all([loadPayableLoans(), loadPaymentHistory()]);
      }
    } catch (caught) {
      setSubmitError(
        caught instanceof ApiError || caught instanceof Error
          ? caught.message
          : 'Payment failed. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = Boolean(selectedLoan) && !submitting && !loadingLoans && !polling;
  const selectedBalance = getLoanBalance(selectedLoan);

  return (
    <div className="space-y-6">
      {loadError && (
        <section className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}
        </section>
      )}

      <section className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-sm">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col gap-4 border-b border-gray-100 pb-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#168a45]">
                  Mobile money
                </p>
                <h2 className="mt-2 text-2xl font-bold text-gray-950">
                  Pay an active loan
                </h2>
              </div>

              {selectedLoan && (
                <span
                  className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-bold capitalize ${
                    selectedLoan.status === 'overdue'
                      ? payableStatusStyles.overdue
                      : payableStatusStyles.active
                  }`}
                >
                  {statusLabel(selectedLoan.status)}
                </span>
              )}
            </div>

            {loadingLoans ? (
              <div className="mt-6 space-y-4">
                <div className="h-11 animate-pulse rounded-lg bg-gray-100" />
                <div className="grid gap-4 sm:grid-cols-3">
                  {[0, 1, 2].map((item) => (
                    <div
                      key={item}
                      className="h-24 animate-pulse rounded-lg bg-gray-100"
                    />
                  ))}
                </div>
              </div>
            ) : loans.length > 0 ? (
              <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                <div>
                  <label
                    htmlFor="payment-loan"
                    className="block text-sm font-semibold text-gray-800"
                  >
                    Loan
                  </label>
                  <select
                    id="payment-loan"
                    value={selectedLoanId}
                    onChange={(event) => {
                      setSelectedLoanId(event.target.value);
                      setSuccessRepayment(null);
                      setSubmitError('');
                      stopPolling();
                    }}
                    className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-950 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                  >
                    {loans.map((loan) => (
                      <option key={loan.id} value={loan.id}>
                        {loan.loanNumber} - {loan.purpose}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedLoan && (
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">
                        Outstanding
                      </p>
                      <p className="mt-2 text-base font-bold text-gray-950">
                        {formatMoney(selectedBalance, selectedLoan.currency)}
                      </p>
                    </div>
                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">
                        Next due
                      </p>
                      <p className="mt-2 text-base font-bold text-gray-950">
                        {formatDateLabel(selectedLoan.nextPayment?.dueDate)}
                      </p>
                    </div>
                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">
                        Suggested
                      </p>
                      <p className="mt-2 text-base font-bold text-gray-950">
                        {formatMoney(
                          selectedLoan.nextPayment?.amount,
                          selectedLoan.currency,
                        )}
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="payment-amount"
                      className="block text-sm font-semibold text-gray-800"
                    >
                      Amount paid
                    </label>
                    <input
                      id="payment-amount"
                      type="number"
                      min="1"
                      step="1"
                      inputMode="numeric"
                      value={form.amountPaid}
                      onChange={(event) =>
                        handleInputChange('amountPaid', event.target.value)
                      }
                      placeholder="50000"
                      className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="payment-phone"
                      className="block text-sm font-semibold text-gray-800"
                    >
                      Mobile money phone
                    </label>
                    <input
                      id="payment-phone"
                      type="tel"
                      value={form.paymentPhoneNumber}
                      onChange={(event) =>
                        handleInputChange(
                          'paymentPhoneNumber',
                          event.target.value,
                        )
                      }
                      placeholder="0788123456"
                      className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="payment-provider"
                      className="block text-sm font-semibold text-gray-800"
                    >
                      Provider
                    </label>
                    <input
                      id="payment-provider"
                      value="MOBILE_MONEY"
                      readOnly
                      className="mt-2 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="payment-notes"
                    className="block text-sm font-semibold text-gray-800"
                  >
                    Notes
                  </label>
                  <textarea
                    id="payment-notes"
                    rows={3}
                    value={form.notes}
                    onChange={(event) =>
                      handleInputChange('notes', event.target.value)
                    }
                    placeholder="Paid from my mobile money account"
                    className="mt-2 w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                {submitError && (
                  <div
                    className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
                    role="alert"
                  >
                    {submitError}
                  </div>
                )}

                {successRepayment && successRepayment.status === 'PENDING' && (
                  <div
                    className="flex items-start gap-3 rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800"
                    role="status"
                  >
                    <svg
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    <span>
                      <span className="font-bold">Check your phone</span> — approve the MoMo prompt to complete payment.
                    </span>
                  </div>
                )}

                {successRepayment && successRepayment.status !== 'PENDING' && (
                  <div
                    className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
                    role="status"
                  >
                    <span className="font-bold">Payment confirmed!</span>{' '}
                    Reference:{' '}
                    <span className="font-bold">
                      {successRepayment.paymentReference ?? 'Generated'}
                    </span>
                  </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="inline-flex items-center justify-center rounded-full bg-[#36e17b] px-8 py-3.5 text-sm font-bold text-gray-950 transition hover:bg-[#25ca68] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? 'Processing...' : polling ? 'Waiting for MoMo...' : 'Pay now'}
                  </button>

                  {selectedLoan && (
                    <Link
                      href={`/loan-portal/my-loans/${selectedLoan.id}`}
                      className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-gray-950"
                    >
                      View loan
                    </Link>
                  )}
                </div>
              </form>
            ) : (
              <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 px-4 py-6">
                <p className="text-sm font-semibold text-gray-950">
                  No active or overdue loans are available for online payment.
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Payments only apply to active or overdue loans.
                </p>
                <Link
                  href="/loan-portal/request"
                  className="mt-4 inline-flex rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-950 transition hover:border-emerald-300 hover:bg-emerald-50"
                >
                  Apply for a loan
                </Link>
              </div>
            )}
          </div>

          <aside className="border-t border-gray-100 bg-gradient-to-b from-[#f8fff9] to-white p-6 lg:border-l lg:border-t-0">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-white">
                <Image
                  src="/logo.png"
                  alt=""
                  width={34}
                  height={34}
                  className="h-8 w-8 object-contain"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-950">GFI Rwanda</p>
                <p className="mt-1 text-xs text-gray-500">
                  Client online repayment
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-4 text-sm">
              <div className="rounded-lg border border-gray-100 bg-white p-4">
                <p className="font-semibold text-gray-950">Balance</p>
                <p className="mt-2 leading-6 text-gray-500">
                  Your outstanding balance and repayment history refresh after
                  payment.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-gray-100 px-6 py-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-950">
              Recent payment history
            </h2>
          </div>
          <Link
            href="/loan-portal/my-loans"
            className="text-sm font-bold text-emerald-700 transition hover:text-emerald-900"
          >
            View loans
          </Link>
        </div>

        {historyError && (
          <div className="border-b border-red-100 bg-red-50 px-6 py-3 text-sm text-red-700">
            {historyError}
          </div>
        )}

        {loadingHistory ? (
          <div className="space-y-3 px-6 py-6">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="h-12 animate-pulse rounded-lg bg-gray-100"
              />
            ))}
          </div>
        ) : repayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr>
                  {['Date', 'Loan', 'Amount', 'Provider', 'Reference'].map(
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
                {repayments.map((repayment) => (
                  <tr key={repayment.id}>
                    <td className="whitespace-nowrap border-t border-gray-100 px-6 py-5 text-sm font-semibold text-gray-800">
                      {formatDateTimeLabel(repayment.paymentDate)}
                    </td>
                    <td className="whitespace-nowrap border-t border-gray-100 px-6 py-5 text-sm text-gray-700">
                      {repayment.loan?.loanNumber ?? repayment.loanId}
                    </td>
                    <td className="whitespace-nowrap border-t border-gray-100 px-6 py-5 text-sm font-semibold text-gray-950">
                      {formatMoney(repayment.amountPaid)}
                    </td>
                    <td className="whitespace-nowrap border-t border-gray-100 px-6 py-5 text-sm capitalize text-gray-700">
                      {paymentProviderLabel(repayment.paymentProvider)}
                    </td>
                    <td className="whitespace-nowrap border-t border-gray-100 px-6 py-5 text-sm font-semibold text-gray-950">
                      {repayment.paymentReference ?? 'Generated'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="px-6 py-8 text-sm text-gray-500">
            No approved payments have been recorded yet.
          </p>
        )}
      </section>
    </div>
  );
}
