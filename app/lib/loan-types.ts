export type LoanStatus =
  | 'PENDING'
  | 'LOAN_OFFICER_APPROVED'
  | 'LOAN_OFFICER_REJECTED'
  | 'APPROVED'
  | 'REJECTED';

export type LoanDocument = {
  id: string;
  filename: string;
  originalFileName?: string;
  mimeType?: string;
  label?: string;
  downloadUrl?: string;
};

export type LoanClient = {
  id: string;
  type: 'INDIVIDUAL' | 'BUSINESS';
  email: string;
  accountNumber: string;
  individual?: { fullName: string } | null;
  business?: { businessName: string } | null;
};

export type LoanStatusLog = {
  id: string;
  status: LoanStatus | string;
  note?: string;
  createdAt: string;
  user?: { id: string; name: string; email: string } | null;
};

export type RepaymentScheduleItem = {
  installmentNo?: number;
  dueDate: string;
  amount: number;
};

export type RepaymentTermsDetail = {
  currency?: string;
  installmentsCount?: number;
  amountPerInstallment?: number;
  periodMonths?: number;
  paymentDayOfMonth?: number;
  schedule?: RepaymentScheduleItem[];
};

export type Loan = {
  id: string;
  loanNumber: string;
  amount: number;
  outstandingBalance?: number;
  totalRepaidAmount?: number;
  purpose: string;
  status: LoanStatus;
  interestRatePercentPerMonth?: number;
  termInMonths?: number;
  termStartDate?: string;
  termEndDate?: string;
  disbursementWithinDays?: number;
  collateralType?: string;
  collateralEstimatedValue?: number;
  collateralLocation?: string;
  repaymentInstallmentsCount?: number;
  repaymentAmountPerMonth?: number;
  repaymentPeriodMonths?: number;
  paymentDayOfMonth?: number;
  loanProcessingFeePercent?: number;
  administrativeFeePercent?: number;
  loanApplicationFeePercent?: number;
  earlyRepaymentFeePercent?: number;
  defaultPenaltyFeePercentPerDay?: number;
  spouseName?: string;
  comments?: string;
  guarantorInfo?: Record<string, string | number>;
  repaymentTerms?: RepaymentScheduleItem[] | RepaymentTermsDetail;
  activatedAt?: string;
  createdAt: string;
  updatedAt: string;
  client: LoanClient;
  user?: { id: string; name: string; email: string } | null;
  statusLogs?: LoanStatusLog[];
  documents?: LoanDocument[];
};

export type LoansResponse = {
  data: Loan[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
