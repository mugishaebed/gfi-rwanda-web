'use client';

import { useState } from 'react';
import { mockLoans, formatRWF, type LoanStatus } from '../../lib/mock-data';

const STATUS_COLORS: Record<LoanStatus, string> = {
  Active:   'bg-emerald-100 text-emerald-700',
  Approved: 'bg-blue-100 text-blue-700',
  Pending:  'bg-amber-100 text-amber-700',
  Rejected: 'bg-red-100 text-red-600',
  Closed:   'bg-gray-100 text-gray-500',
};

const ALL_STATUSES: LoanStatus[] = ['Active', 'Approved', 'Pending', 'Rejected', 'Closed'];

export default function LoansPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<LoanStatus | 'All'>('All');

  const filtered = mockLoans.filter((l) => {
    const matchesSearch =
      l.borrower.toLowerCase().includes(search.toLowerCase()) ||
      l.id.toLowerCase().includes(search.toLowerCase()) ||
      l.type.toLowerCase().includes(search.toLowerCase()) ||
      l.officer.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalAmount = filtered.reduce((sum, l) => sum + l.amount, 0);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Loans</h1>
          <p className="text-sm text-gray-500 mt-1">All loan applications and disbursements</p>
        </div>
        <div className="text-sm text-gray-500 bg-white border border-gray-100 px-4 py-2 rounded-lg">
          Total shown: <span className="font-semibold text-gray-800">{formatRWF(totalAmount)}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search borrower, type, officer…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#36e17b] focus:border-transparent transition placeholder-gray-400 w-72"
          />
        </div>

        {/* Status filter pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStatusFilter('All')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              statusFilter === 'All'
                ? 'bg-gray-900 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            All
          </button>
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Loan ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Borrower</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Officer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-400 text-sm">
                    No loans match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((loan) => (
                  <tr key={loan.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3.5 text-gray-400 font-mono text-xs">{loan.id}</td>
                    <td className="px-6 py-3.5 font-medium text-gray-800">{loan.borrower}</td>
                    <td className="px-6 py-3.5 text-gray-700 font-medium">{formatRWF(loan.amount)}</td>
                    <td className="px-6 py-3.5 text-gray-600">{loan.type}</td>
                    <td className="px-6 py-3.5 text-gray-600">{loan.officer}</td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[loan.status]}`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-gray-500">{loan.createdAt}</td>
                    <td className="px-6 py-3.5 text-gray-500">{loan.dueDate}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
