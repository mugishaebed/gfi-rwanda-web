'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError, useApiClient } from '@/app/lib/api-client';
import {
  formatMoney,
  type LoanOffer,
  type LoanRequestResponse,
  type LoanRequestResult,
} from '../lib/client-loans';

const defaultLoanOffer: LoanOffer = {
  availableLimit: 500_000,
  minimumRequest: 100,
  currency: 'RWF',
  interestRatePercent: 10,
  termMonths: 1,
  termsVersion: 'loan-request-v1',
  disbursementMethod: 'MOBILE_MONEY',
  disbursementPhone: '0788 XXX XXX',
  expectedReviewHours: 24,
};

function formatDate(date: Date) {
  return date.toLocaleDateString('en-RW', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function addMonths(date: Date, months: number) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

function unwrapLoanRequestResponse(
  response: LoanRequestResponse,
): LoanRequestResult {
  if ('data' in response) return response.data ?? {};
  return response;
}

function getResponseRepaymentAmount(response: LoanRequestResult | null) {
  const repaymentTerms = response?.repaymentTerms;
  const repaymentSchedule = Array.isArray(repaymentTerms)
    ? repaymentTerms
    : repaymentTerms?.schedule;

  return (
    response?.repaymentAmount ??
    response?.totalRepayment ??
    response?.repaymentAmountPerMonth ??
    (Array.isArray(repaymentTerms) ? undefined : repaymentTerms?.amountPerInstallment) ??
    repaymentSchedule?.[0]?.amount
  );
}

function disbursementMethodLabel(method: string) {
  return method
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function StepCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm">
      {children}
    </div>
  );
}

export default function ClientLoanRequestForm() {
  const apiFetch = useApiClient();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [loanOffer, setLoanOffer] = useState<LoanOffer | null>(null);
  const [offerLoading, setOfferLoading] = useState(true);
  const [offerError, setOfferError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submittedRequest, setSubmittedRequest] =
    useState<LoanRequestResult | null>(null);
  const termsPanelRef = useRef<HTMLDivElement | null>(null);

  const loadLoanOffer = useCallback(async () => {
    setOfferLoading(true);
    setOfferError('');

    try {
      const response = await apiFetch<LoanOffer>('/v1/clients/me/loan-offer');
      setLoanOffer(response);
    } catch (caught) {
      setOfferError(
        caught instanceof ApiError || caught instanceof Error
          ? caught.message
          : 'Failed to load loan offer.',
      );
    } finally {
      setOfferLoading(false);
    }
  }, [apiFetch]);

  useEffect(() => {
    void loadLoanOffer();
  }, [loadLoanOffer]);

  const offer = loanOffer ?? defaultLoanOffer;
  const offerReady = Boolean(loanOffer);
  const availableLimit = offer.availableLimit;
  const minimumRequest = offer.minimumRequest;
  const currency = offer.currency;
  const interestRatePercent = offer.interestRatePercent;
  const termMonths = offer.termMonths;
  const disbursementLabel = disbursementMethodLabel(offer.disbursementMethod);

  const amountValue = Number(amount.replace(/\D/g, '')) || 0;
  const displayAmount = amountValue;

  const interestAmount = Math.round((displayAmount * interestRatePercent) / 100);
  const totalRepayment = displayAmount > 0 ? displayAmount + interestAmount : 0;
  const startDate = new Date();
  const dueDate = addMonths(startDate, termMonths);
  const dueDateLabel = formatDate(dueDate);
  const submittedAmount = submittedRequest?.amount ?? displayAmount;
  const submittedTotalRepayment =
    getResponseRepaymentAmount(submittedRequest) ?? totalRepayment;

  const canContinue =
    offerReady &&
    amountValue >= minimumRequest &&
    amountValue <= availableLimit;

  const formattedAmount = formatMoney(displayAmount, currency);
  const formattedInterest = formatMoney(interestAmount, currency);
  const formattedTotal = formatMoney(totalRepayment, currency);
  const formattedSubmittedAmount = formatMoney(submittedAmount, currency);
  const formattedSubmittedTotal = formatMoney(submittedTotalRepayment, currency);

  const updateAmount = (value: string) => {
    const cleaned = value.replace(/[^0-9]/g, '');
    const numericValue = Number(cleaned);
    const nextValue = cleaned === '' ? '' : String(Math.min(numericValue, availableLimit));

    setSubmitError('');
    setAmount(nextValue);
    setSubmittedRequest(null);
  };

  const handleContinue = () => {
    if (!offerReady) {
      setSubmitError('Loan offer is still loading. Please try again in a moment.');
      return;
    }

    if (!canContinue) {
      setSubmitError(
        `Enter an amount between ${formatMoney(minimumRequest, currency)} and ${formatMoney(
          availableLimit,
          currency,
        )}.`,
      );
      return;
    }
    setSubmitError('');
    setStep(2);
  };

  const scrollToPageAndTermsBottom = () => {
    const termsPanel = termsPanelRef.current;

    if (termsPanel) {
      termsPanel.scrollTo({
        top: termsPanel.scrollHeight,
        behavior: 'smooth',
      });
    }

    window.scrollTo({
      top: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
      behavior: 'smooth',
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError('');

    if (!termsAccepted) {
      setSubmitError('You must accept the Terms & Conditions to continue.');
      return;
    }

    if (!canContinue) {
      setSubmitError(
        `Enter an amount between ${formatMoney(minimumRequest, currency)} and ${formatMoney(
          availableLimit,
          currency,
        )}.`,
      );
      setStep(1);
      return;
    }

    if (!loanOffer) {
      setSubmitError('Loan offer is unavailable. Please refresh and try again.');
      setStep(1);
      return;
    }

    setSubmitting(true);

    try {
      const response = await apiFetch<LoanRequestResponse>(
        '/v1/loans/request',
        {
          method: 'POST',
          body: JSON.stringify({
            amount: displayAmount,
            currency: loanOffer.currency,
            termInMonths: loanOffer.termMonths,
            termsAccepted: true,
            termsVersion: loanOffer.termsVersion,
            disbursementMethod: loanOffer.disbursementMethod,
          }),
        },
      );

      setSubmittedRequest(unwrapLoanRequestResponse(response));
      setStep(4);
    } catch (caught) {
      setSubmitError(
        caught instanceof Error
          ? caught.message
          : 'Loan request submission failed.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#168a45]">
            Loan request
          </p>
          <h1 className="mt-3 text-3xl font-bold text-gray-950">Quick loan application</h1>
        </div>

        <Link
          href="/loan-portal"
          className="inline-flex items-center justify-center rounded-full bg-[#36e17b] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#25ca68]"
        >
          Back to loans
        </Link>
      </div>

      <StepCard>
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                  step === stepNumber
                    ? 'bg-[#d9fdf0] text-[#0f5132]'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {stepNumber}
              </div>
            ))}
          </div>
          <p className="text-sm font-semibold text-gray-700">Step {step} of 4</p>
        </div>

        {submitError && (
          <div className="mb-6 rounded-3xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700">
            {submitError}
          </div>
        )}

        {offerError && (
          <div className="mb-6 flex flex-col gap-3 rounded-3xl border border-amber-100 bg-amber-50 px-5 py-4 text-sm text-amber-800 sm:flex-row sm:items-center sm:justify-between">
            <span>{offerError}</span>
            <button
              type="button"
              onClick={loadLoanOffer}
              className="rounded-full bg-amber-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-amber-800"
            >
              Retry
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-8">
            <div className="space-y-3 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-400">
                STEP 1 — LOAN AMOUNT
              </p>
              <h2 className="text-3xl font-bold text-gray-950">
                How much would you like to borrow?
              </h2>
            </div>

            <div className="mx-auto max-w-2xl space-y-6">
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-800" htmlFor="loan-amount">
                  Amount
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                    RWF
                  </span>
                  <input
                    id="loan-amount"
                    type="text"
                    inputMode="numeric"
                    value={amount}
                    onChange={(event) => updateAmount(event.target.value)}
                    placeholder="Enter Loan Amount"
                    className="block w-full rounded-3xl border border-gray-200 bg-white px-14 py-5 text-3xl font-bold text-gray-950 outline-none transition focus:border-[#168a45]"
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Your Limit is{' '}
                  {offerLoading && !loanOffer
                    ? 'Loading...'
                    : formatMoney(availableLimit, currency)}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl bg-gray-100 p-5 text-center">
                  <p className="text-sm font-semibold text-black">
                    Interest ({interestRatePercent}%)
                  </p>
                  <p className="mt-3 text-2xl font-bold text-black">{formattedInterest}</p>
                </div>
                <div className="rounded-3xl bg-gray-100 p-5 text-center">
                  <p className="text-sm font-semibold text-black">Total repayment</p>
                  <p className="mt-3 text-2xl font-bold text-black">{formattedTotal}</p>
                </div>
                <div className="rounded-3xl bg-gray-100 p-5 text-center">
                  <p className="text-sm font-semibold text-black">Duration</p>
                  <p className="mt-3 text-2xl font-bold text-black">
                    {termMonths} Month{termMonths === 1 ? '' : 's'}
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleContinue}
                  disabled={offerLoading || !offerReady}
                  className="inline-flex items-center justify-center rounded-full bg-[#36e17b] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#25ca68] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <div className="space-y-3 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-400">
                STEP 2 — LOAN SUMMARY
              </p>
              <h2 className="text-3xl font-bold text-gray-950">Review your loan details</h2>
            </div>

            <div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-gray-100 p-5">
                  <p className="text-sm font-semibold text-black">Requested amount</p>
                  <p className="mt-3 text-2xl text-black">{formattedAmount}</p>
                </div>
                <div className="rounded-3xl bg-gray-100 p-5">
                  <p className="text-sm font-semibold text-black">Interest rate</p>
                  <p className="mt-3 text-2xl text-black">
                    {interestRatePercent}%
                  </p>
                </div>
                <div className="rounded-3xl bg-gray-100 p-5">
                  <p className="text-sm font-semibold text-black">Duration</p>
                  <p className="mt-3 text-2xl text-black">
                    {termMonths} Month{termMonths === 1 ? '' : 's'}
                  </p>
                </div>
                <div className="rounded-3xl bg-gray-100 p-5">
                  <p className="text-sm font-semibold text-black">Total repayment</p>
                  <p className="mt-3 text-2xl text-black">{formattedTotal}</p>
                </div>
              </div>

              <div className="mt-6 space-y-4 rounded-3xl bg-gray-100 p-6">
                <div className="flex items-center justify-between text-sm text-black">
                  <span>Pay Before</span>
                  <span className="font-semibold text-black">{dueDateLabel}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-black">
                  <span>Funds will be sent to</span>
                  <span className="font-semibold text-black">
                    {offer.disbursementPhone} ({disbursementLabel})
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-300"
              >
                Edit amount
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex items-center justify-center rounded-full bg-[#36e17b] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#25ca68]"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-400">
                STEP 3 — TERMS & CONDITIONS
              </p>
              <h2 className="text-3xl font-bold text-gray-950">Accept the loan terms</h2>
            </div>

            <div className="space-y-4 rounded-[1.75rem] border border-gray-200 bg-white p-6 shadow-sm">
              <div>
                <h3 className="text-lg font-semibold text-gray-950">Terms & Conditions</h3>
                <p className="text-sm text-gray-500">Please read and accept our terms and conditions.</p>
              </div>

              <div className="relative">
                <div
                  ref={termsPanelRef}
                  className="max-h-80 overflow-y-auto rounded-3xl border border-gray-100 bg-[#f8faf9] p-5 pb-16 text-sm leading-6 text-gray-700"
                >
                  <p className="mb-4 font-semibold text-gray-900">1. Loan amount and repayment</p>
                  <p className="mb-4">
                    You request a loan of {formattedAmount} at a fixed interest rate of {interestRatePercent}% per month.
                    Total repayment is {formattedTotal} over {termMonths} month{termMonths === 1 ? '' : 's'}.
                  </p>
                  <p className="mb-4 font-semibold text-gray-900">2. Disbursement and review</p>
                  <p className="mb-4">
                    Funds will be sent to the registered mobile money number within 3 business days after approval.
                    The expected review time is within {offer.expectedReviewHours} hours.
                  </p>
                  <p className="mb-4 font-semibold text-gray-900">3. Fees and consequences</p>
                  <p className="mb-4">
                    No additional fees are applied in this request except the fixed interest amount. Late repayment may lead to penalties in line with GFI policy.
                  </p>
                  <p className="mb-4 font-semibold text-gray-900">4. Acceptance</p>
                  <p>
                    By continuing, you confirm that the information provided is accurate and you consent to the loan being reviewed by GFI.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={scrollToPageAndTermsBottom}
                  aria-label="Scroll to the bottom of the terms and page"
                  className="absolute bottom-4 left-1/2 inline-flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full bg-[#36e17b] text-white shadow-sm transition hover:bg-[#25ca68]"
                >
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 5v14" />
                    <path d="m19 12-7 7-7-7" />
                  </svg>
                </button>
              </div>

              <label className="flex items-start gap-3 rounded-3xl bg-[#f8faf9] p-4">
                <span className="relative mt-1 flex h-5 w-5 shrink-0 items-center justify-center">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(event) => setTermsAccepted(event.target.checked)}
                    className="peer h-5 w-5 appearance-none rounded border border-gray-300 bg-white transition checked:border-[#36e17b] checked:bg-[#36e17b] focus:outline-none focus:ring-2 focus:ring-[#168a45] focus:ring-offset-2"
                  />
                  <svg
                    aria-hidden="true"
                    className="pointer-events-none absolute h-3.5 w-3.5 text-white opacity-0 transition peer-checked:opacity-100"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path d="m5 12 4 4L19 6" />
                  </svg>
                </span>
                <span className="text-sm text-gray-950">
                  I have read and accept the Terms & Conditions <span className="text-gray-800">(Required to continue)</span>
                </span>
              </label>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-300"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={submitting || !termsAccepted || !offerReady}
                className="inline-flex items-center justify-center rounded-full bg-[#36e17b] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#25ca68] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Submitting...' : 'Submit Loan Request'}
              </button>
            </div>
          </form>
        )}

        {step === 4 && (
          <div className="space-y-8">
            <div className="space-y-3 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#168a45]">
                CONFIRMATION
              </p>
              <h2 className="text-3xl font-bold text-gray-950">Loan request submitted</h2>
              <p className="text-sm text-gray-500">Your loan request is under review.</p>
            </div>

            <div className="space-y-5">
              <div className="mx-auto max-w-xl rounded-3xl bg-gray-100 p-6">
                <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-4">
                  <p className="text-sm text-gray-600">Loan number</p>
                  <p className="text-xl font-bold text-gray-950">
                    {submittedRequest?.loanNumber ?? submittedRequest?.id ?? 'Pending'}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-gray-200 py-4">
                  <p className="text-sm text-gray-600">Requested amount</p>
                  <p className="text-xl font-bold text-gray-950">{formattedSubmittedAmount}</p>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-gray-200 py-4">
                  <p className="text-sm text-gray-600">Total repayment</p>
                  <p className="text-xl font-bold text-gray-950">{formattedSubmittedTotal}</p>
                </div>
                <div className="flex items-center justify-between gap-4 pt-4">
                  <p className="text-sm text-gray-600">Expected review time</p>
                  <p className="text-xl font-bold text-gray-950">
                    Within {offer.expectedReviewHours} Hours
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Link
                  href="/loan-portal"
                  className="inline-flex items-center justify-center rounded-full bg-[#36e17b] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#25ca68]"
                >
                  Back to dashboard
                </Link>
              </div>
            </div>
          </div>
        )}
      </StepCard>
    </div>
  );
}
