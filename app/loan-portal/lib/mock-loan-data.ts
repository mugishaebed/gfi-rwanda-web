export type LoanStatus = 'pending' | 'active' | 'completed' | 'overdue' | 'rejected';

export type LoanRepayment = {
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
};

export type LoanPayment = {
  amount: number;
  method: string;
  paidAt: string;
  reference: string;
};

export type MockLoan = {
  id: string;
  amount: number;
  interest: number;
  totalPayable: number;
  remainingBalance: number;
  purpose: string;
  status: LoanStatus;
  nextPayment: string;
  trackerStep: 'Submitted' | 'Reviewed' | 'Approved' | 'Disbursed' | 'Repayment' | 'Completed';
  repaymentSchedule: LoanRepayment[];
  paymentHistory: LoanPayment[];
  officerNotes: string[];
};

export const lifecycleSteps = [
  'Submitted',
  'Reviewed',
  'Approved',
  'Disbursed',
  'Repayment',
  'Completed',
] as const;

export const mockLoans: MockLoan[] = [
  {
    id: 'GFI-2026-001',
    amount: 450_000,
    interest: 45_000,
    totalPayable: 495_000,
    remainingBalance: 120_000,
    purpose: 'Solar equipment financing',
    status: 'active',
    nextPayment: '24 Jun 2026',
    trackerStep: 'Repayment',
    repaymentSchedule: [
      { dueDate: '12 Jun', amount: 20_000, status: 'Paid' },
      { dueDate: '12 Jul', amount: 20_000, status: 'Pending' },
      { dueDate: '12 Aug', amount: 20_000, status: 'Pending' },
    ],
    paymentHistory: [
      {
        paidAt: '12 Jun 2026',
        amount: 20_000,
        method: 'Mobile Money',
        reference: 'MOMO-GFI-00182',
      },
      {
        paidAt: '12 May 2026',
        amount: 20_000,
        method: 'Bank transfer',
        reference: 'BK-GFI-00931',
      },
    ],
    officerNotes: ['Please upload updated bank statement.'],
  },
  {
    id: 'GFI-2026-002',
    amount: 180_000,
    interest: 18_000,
    totalPayable: 198_000,
    remainingBalance: 180_000,
    purpose: 'Clean cookstove financing',
    status: 'pending',
    nextPayment: 'Awaiting approval',
    trackerStep: 'Submitted',
    repaymentSchedule: [
      { dueDate: 'Pending', amount: 20_000, status: 'Pending' },
    ],
    paymentHistory: [],
    officerNotes: ['Your application is waiting for officer review.'],
  },
  {
    id: 'GFI-2026-003',
    amount: 95_000,
    interest: 9_500,
    totalPayable: 104_500,
    remainingBalance: 0,
    purpose: 'Efficient lighting project',
    status: 'completed',
    nextPayment: 'Paid in full',
    trackerStep: 'Completed',
    repaymentSchedule: [
      { dueDate: '12 Apr', amount: 20_000, status: 'Paid' },
      { dueDate: '12 May', amount: 20_000, status: 'Paid' },
    ],
    paymentHistory: [
      {
        paidAt: '12 May 2026',
        amount: 20_000,
        method: 'Mobile Money',
        reference: 'MOMO-GFI-00144',
      },
    ],
    officerNotes: ['Loan fully repaid. Thank you for staying on schedule.'],
  },
  {
    id: 'GFI-2026-004',
    amount: 350_000,
    interest: 35_000,
    totalPayable: 385_000,
    remainingBalance: 75_000,
    purpose: 'Biogas system loan',
    status: 'overdue',
    nextPayment: '09 May 2026',
    trackerStep: 'Repayment',
    repaymentSchedule: [
      { dueDate: '09 May', amount: 25_000, status: 'Overdue' },
      { dueDate: '09 Jun', amount: 25_000, status: 'Pending' },
    ],
    paymentHistory: [
      {
        paidAt: '09 Apr 2026',
        amount: 25_000,
        method: 'Bank transfer',
        reference: 'BK-GFI-00872',
      },
    ],
    officerNotes: ['Please contact your loan officer to regularize the overdue payment.'],
  },
  {
    id: 'GFI-2026-005',
    amount: 720_000,
    interest: 72_000,
    totalPayable: 792_000,
    remainingBalance: 720_000,
    purpose: 'Irrigation pump upgrade',
    status: 'rejected',
    nextPayment: 'Not scheduled',
    trackerStep: 'Reviewed',
    repaymentSchedule: [],
    paymentHistory: [],
    officerNotes: ['Application rejected. Please submit updated collateral details before reapplying.'],
  },
];

export function getMockLoan(loanId: string) {
  return mockLoans.find((loan) => loan.id === loanId);
}

export function formatMoney(value: number) {
  return `${value.toLocaleString('en-RW')} RWF`;
}
