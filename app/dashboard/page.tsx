'use client';

import { useRole, ROLE_LABELS } from '../lib/useRole';
import { mockLoans, mockUsers, formatRWF } from '../lib/mock-data';

interface StatCard {
  label: string;
  value: string;
  sub: string;
  color: string;
}

function getLoanOfficerStats(): StatCard[] {
  const active = mockLoans.filter((l) => l.status === 'Active').length;
  const pending = mockLoans.filter((l) => l.status === 'Pending').length;
  const totalDisbursed = mockLoans
    .filter((l) => l.status === 'Active')
    .reduce((sum, l) => sum + l.amount, 0);

  return [
    { label: 'Active Loans', value: String(active), sub: 'Currently disbursed', color: 'bg-emerald-50 text-emerald-700' },
    { label: 'Pending Review', value: String(pending), sub: 'Awaiting approval', color: 'bg-amber-50 text-amber-700' },
    { label: 'Total Clients', value: String(mockUsers.length), sub: 'Registered borrowers', color: 'bg-blue-50 text-blue-700' },
    { label: 'Disbursed (Active)', value: formatRWF(totalDisbursed), sub: 'Across active loans', color: 'bg-purple-50 text-purple-700' },
  ];
}

function getGeneralManagerStats(): StatCard[] {
  const total = mockLoans.reduce((sum, l) => sum + l.amount, 0);
  const approved = mockLoans.filter((l) => l.status === 'Approved' || l.status === 'Active').length;
  const approvalRate = Math.round((approved / mockLoans.length) * 100);
  const officers = [...new Set(mockLoans.map((l) => l.officer))].length;

  return [
    { label: 'Total Portfolio', value: formatRWF(total), sub: 'All loan commitments', color: 'bg-emerald-50 text-emerald-700' },
    { label: 'Total Loans', value: String(mockLoans.length), sub: 'All-time applications', color: 'bg-blue-50 text-blue-700' },
    { label: 'Approval Rate', value: `${approvalRate}%`, sub: 'Active + approved', color: 'bg-amber-50 text-amber-700' },
    { label: 'Loan Officers', value: String(officers), sub: 'Active officers', color: 'bg-purple-50 text-purple-700' },
  ];
}

const STATUS_COLORS: Record<string, string> = {
  Active:   'bg-emerald-100 text-emerald-700',
  Approved: 'bg-blue-100 text-blue-700',
  Pending:  'bg-amber-100 text-amber-700',
  Rejected: 'bg-red-100 text-red-700',
  Closed:   'bg-gray-100 text-gray-600',
};

export default function DashboardPage() {
  const { role, loaded } = useRole();

  const stats = role === 'general-manager' ? getGeneralManagerStats() : getLoanOfficerStats();
  const recentLoans = mockLoans.slice(0, 5);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          {loaded && role ? ROLE_LABELS[role] : ''} overview &mdash; GFI Rwanda
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-5">
            <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-3 ${s.color}`}>
              {s.label}
            </span>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent loans */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-800">Recent Loans</h2>
          <a href="/dashboard/loans" className="text-xs text-[#00b835] hover:underline font-medium">
            View all
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Loan ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Borrower</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentLoans.map((loan) => (
                <tr key={loan.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3.5 text-gray-500 font-mono text-xs">{loan.id}</td>
                  <td className="px-6 py-3.5 font-medium text-gray-800">{loan.borrower}</td>
                  <td className="px-6 py-3.5 text-gray-700">{formatRWF(loan.amount)}</td>
                  <td className="px-6 py-3.5 text-gray-600">{loan.type}</td>
                  <td className="px-6 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[loan.status]}`}>
                      {loan.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
