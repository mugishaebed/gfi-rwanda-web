'use client';

import Link from 'next/link';
import {
  formatDateLabel,
  formatDateTimeLabel,
  formatMoney,
  getTrackerStep,
  isPayableLoanStatus,
  lifecycleSteps,
  normalizeRepaymentStatus,
  statusLabel,
  type ClientLoanDetail,
  type ClientLoanStatus,
  type LoanPayment,
  type LoanRepayment,
  type OfficerNote,
} from '../lib/client-loans';

const loanStatusStyles: Record<ClientLoanStatus, string> = {
  pending: 'border-amber-200 bg-amber-50 text-amber-700',
  active: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  completed: 'border-slate-200 bg-slate-50 text-slate-700',
  overdue: 'border-red-200 bg-red-50 text-red-700',
  rejected: 'border-rose-200 bg-rose-50 text-rose-700',
};

const repaymentStatusStyles: Record<ReturnType<typeof normalizeRepaymentStatus>, string> = {
  Paid: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Pending: 'border-amber-200 bg-amber-50 text-amber-700',
  Overdue: 'border-red-200 bg-red-50 text-red-700',
};

function summaryItems(loan: ClientLoanDetail) {
  return [
    { label: 'Loan amount', value: formatMoney(loan.amount, loan.currency) },
    { label: 'Interest', value: formatMoney(loan.interest, loan.currency) },
    {
      label: 'Total payable',
      value: formatMoney(loan.totalPayable, loan.currency),
    },
    {
      label: 'Remaining balance',
      value: formatMoney(loan.remainingBalance, loan.currency),
    },
    { label: 'Loan purpose', value: loan.purpose },
  ];
}

function noteMessage(note: OfficerNote) {
  if (typeof note === 'string') return note;
  return note.message ?? note.note ?? 'No note details provided.';
}

function noteKey(note: OfficerNote, index: number) {
  if (typeof note === 'string') return `${note}-${index}`;
  return note.id ?? `${note.createdAt ?? 'note'}-${index}`;
}

function StatusTracker({ loan }: { loan: ClientLoanDetail }) {
  const trackerStep = getTrackerStep(loan);
  const currentStepIndex = lifecycleSteps.findIndex(
    (step) => step === trackerStep,
  );

  return (
    <section className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-950">Status Tracker</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-6">
        {lifecycleSteps.map((step, index) => {
          const isComplete = index <= currentStepIndex;

          return (
            <div key={step} className="relative flex items-center gap-3 md:block">
              {index < lifecycleSteps.length - 1 && (
                <div
                  className={`absolute left-5 top-10 hidden h-0.5 w-full md:block ${
                    index < currentStepIndex ? 'bg-emerald-300' : 'bg-gray-200'
                  }`}
                />
              )}
              <div
                className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${
                  isComplete
                    ? 'border-emerald-300 bg-emerald-100 text-emerald-700'
                    : 'border-gray-200 bg-gray-50 text-gray-400'
                }`}
              >
                {index + 1}
              </div>
              <p
                className={`text-sm font-semibold md:mt-3 ${
                  isComplete ? 'text-gray-950' : 'text-gray-400'
                }`}
              >
                {step}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function RepaymentSchedule({ schedule, currency }: {
  schedule: LoanRepayment[];
  currency: string;
}) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-6 py-5">
        <h2 className="text-xl font-bold text-gray-950">Repayment Schedule</h2>
      </div>
      {schedule.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr>
                {['Due Date', 'Amount', 'Status'].map((heading) => (
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
              {schedule.map((item, index) => {
                const repaymentStatus = normalizeRepaymentStatus(item.status);

                return (
                  <tr key={`${item.installmentNo ?? index}-${item.dueDate}`}>
                    <td className="whitespace-nowrap border-t border-gray-100 px-6 py-5 text-sm font-semibold text-gray-800">
                      {formatDateLabel(item.dueDate)}
                    </td>
                    <td className="whitespace-nowrap border-t border-gray-100 px-6 py-5 text-sm font-semibold text-gray-800">
                      {formatMoney(item.amount, currency)}
                    </td>
                    <td className="whitespace-nowrap border-t border-gray-100 px-6 py-5">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${repaymentStatusStyles[repaymentStatus]}`}
                      >
                        {repaymentStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="px-6 py-8 text-sm text-gray-500">
          No repayment schedule has been created yet.
        </p>
      )}
    </section>
  );
}

function PaymentHistory({ payments, currency }: {
  payments: LoanPayment[];
  currency: string;
}) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-6 py-5">
        <h2 className="text-xl font-bold text-gray-950">Payment History</h2>
      </div>
      {payments.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr>
                {['Payment date', 'Amount', 'Payment method', 'Transaction reference'].map(
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
              {payments.map((payment, index) => (
                <tr key={`${payment.reference}-${index}`}>
                  <td className="whitespace-nowrap border-t border-gray-100 px-6 py-5 text-sm font-semibold text-gray-800">
                    {formatDateTimeLabel(payment.paidAt)}
                  </td>
                  <td className="whitespace-nowrap border-t border-gray-100 px-6 py-5 text-sm font-semibold text-gray-800">
                    {formatMoney(payment.amount, currency)}
                  </td>
                  <td className="whitespace-nowrap border-t border-gray-100 px-6 py-5 text-sm text-gray-700">
                    {payment.method}
                  </td>
                  <td className="whitespace-nowrap border-t border-gray-100 px-6 py-5 text-sm font-semibold text-gray-950">
                    {payment.reference}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="px-6 py-8 text-sm text-gray-500">
          No payments have been recorded yet.
        </p>
      )}
    </section>
  );
}

export default function LoanDetails({ loan }: { loan: ClientLoanDetail }) {
  const officerNotes = loan.officerNotes ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/loan-portal/my-loans"
            className="text-sm font-bold text-emerald-700 transition hover:text-emerald-900"
          >
            Back to My Loans
          </Link>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950">
            Loan Details
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            {loan.loanNumber} - {loan.purpose}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {isPayableLoanStatus(loan.status) && (
            <Link
              href={`/loan-portal/payments?loanId=${encodeURIComponent(loan.id)}`}
              className="inline-flex rounded-full bg-[#36e17b] px-5 py-2.5 text-sm font-bold text-gray-950 transition hover:bg-[#25ca68]"
            >
              Pay this loan
            </Link>
          )}
          <span
            className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-bold capitalize ${loanStatusStyles[loan.status]}`}
          >
            {statusLabel(loan.status)}
          </span>
        </div>
      </div>

      <section className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-950">Loan Summary</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {summaryItems(loan).map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">
                {item.label}
              </p>
              <p className="mt-2 text-base font-bold text-gray-950">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <StatusTracker loan={loan} />

      <div className="grid gap-6 xl:grid-cols-2">
        <RepaymentSchedule
          schedule={loan.repaymentSchedule ?? []}
          currency={loan.currency}
        />
        <PaymentHistory
          payments={loan.paymentHistory ?? []}
          currency={loan.currency}
        />
      </div>

      <section className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-950">
          Officer Notes / Requests
        </h2>
        <div className="mt-4 space-y-3">
          {officerNotes.length > 0 ? (
            officerNotes.map((note, index) => (
              <div
                key={noteKey(note, index)}
                className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm font-medium leading-6 text-amber-900"
              >
                {noteMessage(note)}
              </div>
            ))
          ) : (
            <p className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-500">
              No officer notes yet.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
