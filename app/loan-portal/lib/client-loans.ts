export type ClientLoanStatus =
  | 'pending'
  | 'active'
  | 'completed'
  | 'overdue'
  | 'rejected';

export type ClientRepaymentStatus = 'Paid' | 'Pending' | 'Overdue';

export type LoanReference = {
  id: string;
  loanNumber: string;
};

export type LoanOffer = {
  availableLimit: number;
  minimumRequest: number;
  currency: 'RWF';
  interestRatePercent: number;
  termMonths: number;
  termsVersion: string;
  disbursementMethod: 'MOBILE_MONEY';
  disbursementPhone: string;
  expectedReviewHours: number;
};

export type LoanNextPayment = {
  dueDate?: string | null;
  amount?: number | null;
  status?: string | null;
};

export type ClientLoanListItem = {
  id: string;
  loanNumber: string;
  amount: number;
  currency: string;
  purpose: string;
  status: ClientLoanStatus;
  workflowStatus?: string;
  remainingBalance?: number | null;
  totalPayable?: number | null;
  interest?: number | null;
  nextPayment?: LoanNextPayment | null;
  createdAt?: string;
};

export type ClientLoansResponse = {
  data: ClientLoanListItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type ClientLoanDashboardResponse = {
  activeLoan?: number | null;
  outstandingBalance?: number | null;
  nextPaymentDate?: string | null;
  daysRemaining?: number | null;
  loansCount?: number | null;
  recentLoans?: ClientLoanListItem[];
};

export type LoanRepayment = {
  installmentNo?: number;
  dueDate: string;
  amount: number;
  status: string;
  loan?: LoanReference | null;
};

export type LoanPayment = {
  amount: number;
  method: string;
  paidAt: string;
  reference: string;
  loan?: LoanReference | null;
};

export type OnlinePaymentProvider = 'MOBILE_MONEY';

export type OnlineLoanPaymentPayload = {
  amountPaid: number;
  paymentProvider: OnlinePaymentProvider;
  paymentPhoneNumber?: string;
  paymentReference?: string;
  notes?: string;
};

export type ClientLoanRepayment = {
  id: string;
  loanId: string;
  amountPaid: number;
  paymentDate: string;
  notes?: string | null;
  source?: 'CLIENT_ONLINE' | string;
  paymentProvider?: OnlinePaymentProvider | string;
  paymentReference?: string | null;
  paymentPhoneNumber?: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | string;
  approvedAt?: string | null;
  loan?: {
    id: string;
    loanNumber: string;
    amount?: number;
    outstandingBalance?: number;
    totalRepaidAmount?: number;
    purpose?: string;
    status?: string;
  } | null;
};

export type ClientRepaymentsResponse = {
  data: ClientLoanRepayment[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
};

export type OfficerNote = string | {
  id?: string;
  message?: string;
  note?: string;
  createdAt?: string;
};

export type ClientLoanDetail = ClientLoanListItem & {
  trackerStep?: string;
  repaymentSchedule?: LoanRepayment[];
  paymentHistory?: LoanPayment[];
  officerNotes?: OfficerNote[];
};

export type LoanRequestResult = {
  id?: string;
  loanNumber?: string;
  amount?: number;
  currency?: string;
  status?: string;
  workflowStatus?: string;
  totalRepayment?: number;
  interest?: number;
  interestRatePercentPerMonth?: number;
  termInMonths?: number;
  termStartDate?: string;
  termEndDate?: string;
  paymentDayOfMonth?: number;
  repaymentAmount?: number;
  repaymentAmountPerMonth?: number;
  repaymentTerms?:
    | Array<{
        amount?: number;
        dueDate?: string;
      }>
    | {
        amountPerInstallment?: number;
        schedule?: Array<{
          amount?: number;
          dueDate?: string;
        }>;
      };
  disbursementMethod?: string;
  disbursementPhone?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type LoanRequestResponse = LoanRequestResult & {
  data?: LoanRequestResult;
};

export const lifecycleSteps = [
  'Submitted',
  'Reviewed',
  'Approved',
  'Disbursed',
  'Repayment',
  'Completed',
] as const;

export function formatMoney(value: number | null | undefined, currency = 'RWF') {
  return `${(value ?? 0).toLocaleString('en-RW')} ${currency}`;
}

export function formatDateLabel(value: string | null | undefined) {
  if (!value) return 'Not scheduled';

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleDateString('en-RW', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTimeLabel(value: string | null | undefined) {
  if (!value) return 'Not recorded';

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleString('en-RW', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function statusLabel(status: string | null | undefined) {
  if (!status) return 'pending';
  return status.replaceAll('_', ' ').toLowerCase();
}

export function isPayableLoanStatus(status: string | null | undefined) {
  const normalized = status?.toLowerCase();
  return normalized === 'active' || normalized === 'overdue';
}

export function normalizeRepaymentStatus(status: string): ClientRepaymentStatus {
  const normalized = status.toLowerCase();
  if (normalized === 'paid' || normalized === 'completed') return 'Paid';
  if (normalized === 'overdue') return 'Overdue';
  return 'Pending';
}

export function getTrackerStep(loan: Pick<ClientLoanDetail, 'trackerStep' | 'status' | 'workflowStatus'>) {
  if (loan.trackerStep && lifecycleSteps.includes(loan.trackerStep as typeof lifecycleSteps[number])) {
    return loan.trackerStep;
  }

  if (loan.status === 'completed') return 'Completed';
  if (loan.status === 'active' || loan.status === 'overdue') return 'Repayment';
  if (loan.workflowStatus === 'APPROVED') return 'Approved';
  if (loan.workflowStatus === 'LOAN_OFFICER_APPROVED') return 'Reviewed';
  return 'Submitted';
}
