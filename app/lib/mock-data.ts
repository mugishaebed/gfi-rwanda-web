export type UserStatus = 'Active' | 'Inactive' | 'Pending';
export type LoanStatus = 'Active' | 'Pending' | 'Approved' | 'Rejected' | 'Closed';
export type LoanType = 'Solar Energy' | 'Agriculture' | 'Clean Cookstoves' | 'Water & Sanitation' | 'Reforestation';

export interface MockUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: UserStatus;
  joinedAt: string;
}

export interface MockLoan {
  id: string;
  borrower: string;
  amount: number;
  type: LoanType;
  status: LoanStatus;
  officer: string;
  createdAt: string;
  dueDate: string;
}

export const mockUsers: MockUser[] = [
  { id: 'GFI-001', name: 'Amina Uwase',      email: 'amina.uwase@gmail.com',    phone: '+250 788 123 456', location: 'Kigali',     status: 'Active',   joinedAt: '2024-03-12' },
  { id: 'GFI-002', name: 'Jean-Pierre Nkusi', email: 'jp.nkusi@yahoo.com',       phone: '+250 722 987 654', location: 'Musanze',    status: 'Active',   joinedAt: '2024-04-05' },
  { id: 'GFI-003', name: 'Chantal Mutesi',   email: 'c.mutesi@outlook.com',     phone: '+250 733 456 789', location: 'Huye',       status: 'Pending',  joinedAt: '2024-06-18' },
  { id: 'GFI-004', name: 'Eric Habimana',    email: 'eric.habimana@gmail.com',  phone: '+250 788 234 567', location: 'Rubavu',     status: 'Active',   joinedAt: '2024-07-22' },
  { id: 'GFI-005', name: 'Solange Iradukunda', email: 'solange.i@gmail.com',    phone: '+250 720 345 678', location: 'Nyagatare',  status: 'Inactive', joinedAt: '2024-08-01' },
  { id: 'GFI-006', name: 'Patrick Nzeyimana', email: 'p.nzeyimana@gmail.com',   phone: '+250 789 456 789', location: 'Kigali',     status: 'Active',   joinedAt: '2024-09-10' },
  { id: 'GFI-007', name: 'Marie-Claire Uwimana', email: 'mc.uwimana@yahoo.com', phone: '+250 722 567 890', location: 'Gicumbi',    status: 'Active',   joinedAt: '2024-10-03' },
  { id: 'GFI-008', name: 'Desire Mugisha',   email: 'desire.mugisha@gmail.com', phone: '+250 733 678 901', location: 'Karongi',    status: 'Pending',  joinedAt: '2024-11-15' },
  { id: 'GFI-009', name: 'Judith Nyiraneza', email: 'j.nyiraneza@outlook.com',  phone: '+250 788 789 012', location: 'Rwamagana',  status: 'Active',   joinedAt: '2025-01-08' },
  { id: 'GFI-010', name: 'Claude Ndayisaba', email: 'claude.n@gmail.com',       phone: '+250 720 890 123', location: 'Muhanga',    status: 'Active',   joinedAt: '2025-02-20' },
];

export const mockLoans: MockLoan[] = [
  { id: 'LN-2024-001', borrower: 'Amina Uwase',         amount: 5000000,  type: 'Solar Energy',       status: 'Active',   officer: 'David Kamanzi',  createdAt: '2024-03-15', dueDate: '2025-03-15' },
  { id: 'LN-2024-002', borrower: 'Jean-Pierre Nkusi',   amount: 12000000, type: 'Agriculture',         status: 'Active',   officer: 'Grace Ingabire', createdAt: '2024-04-10', dueDate: '2026-04-10' },
  { id: 'LN-2024-003', borrower: 'Chantal Mutesi',      amount: 2500000,  type: 'Clean Cookstoves',   status: 'Pending',  officer: 'David Kamanzi',  createdAt: '2024-06-20', dueDate: '2025-06-20' },
  { id: 'LN-2024-004', borrower: 'Eric Habimana',       amount: 8000000,  type: 'Water & Sanitation', status: 'Approved', officer: 'Grace Ingabire', createdAt: '2024-07-25', dueDate: '2026-07-25' },
  { id: 'LN-2024-005', borrower: 'Solange Iradukunda',  amount: 3500000,  type: 'Reforestation',      status: 'Rejected', officer: 'David Kamanzi',  createdAt: '2024-08-05', dueDate: '2025-08-05' },
  { id: 'LN-2024-006', borrower: 'Patrick Nzeyimana',   amount: 15000000, type: 'Solar Energy',       status: 'Active',   officer: 'Alice Mutoni',   createdAt: '2024-09-12', dueDate: '2027-09-12' },
  { id: 'LN-2024-007', borrower: 'Marie-Claire Uwimana', amount: 6500000, type: 'Agriculture',         status: 'Active',   officer: 'Grace Ingabire', createdAt: '2024-10-05', dueDate: '2026-10-05' },
  { id: 'LN-2024-008', borrower: 'Desire Mugisha',      amount: 4000000,  type: 'Clean Cookstoves',   status: 'Pending',  officer: 'Alice Mutoni',   createdAt: '2024-11-18', dueDate: '2025-11-18' },
  { id: 'LN-2025-001', borrower: 'Judith Nyiraneza',    amount: 9500000,  type: 'Water & Sanitation', status: 'Approved', officer: 'David Kamanzi',  createdAt: '2025-01-10', dueDate: '2027-01-10' },
  { id: 'LN-2025-002', borrower: 'Claude Ndayisaba',    amount: 7000000,  type: 'Solar Energy',       status: 'Active',   officer: 'Alice Mutoni',   createdAt: '2025-02-22', dueDate: '2027-02-22' },
];

export function formatRWF(amount: number): string {
  return `RWF ${(amount / 1_000_000).toFixed(1)}M`;
}
