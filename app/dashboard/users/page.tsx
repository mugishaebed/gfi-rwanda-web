'use client';

import { useState } from 'react';
import { mockUsers, type MockUser, type UserStatus } from '../../lib/mock-data';
import { useRole } from '../../lib/useRole';

const STATUS_COLORS: Record<UserStatus, string> = {
  Active:   'bg-emerald-100 text-emerald-700',
  Inactive: 'bg-gray-100 text-gray-500',
  Pending:  'bg-amber-100 text-amber-700',
};

const EMPTY_FORM = { name: '', email: '', phone: '', location: '', status: 'Pending' as UserStatus };

function AddUserModal({ onClose, onAdd }: { onClose: () => void; onAdd: (u: MockUser) => void }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<typeof EMPTY_FORM>>({});

  function validate() {
    const e: Partial<typeof EMPTY_FORM> = {};
    if (!form.name.trim())     e.name     = 'Name is required';
    if (!form.email.trim())    e.email    = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.phone.trim())    e.phone    = 'Phone is required';
    if (!form.location.trim()) e.location = 'Location is required';
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const today = new Date().toISOString().split('T')[0];
    const newUser: MockUser = {
      id: `GFI-${String(Date.now()).slice(-3)}`,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      location: form.location.trim(),
      status: form.status,
      joinedAt: today,
    };
    onAdd(newUser);
    onClose();
  }

  function field(id: keyof typeof EMPTY_FORM, label: string, type = 'text', options?: UserStatus[]) {
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
        {options ? (
          <select
            id={id}
            value={form[id]}
            onChange={(e) => { setForm({ ...form, [id]: e.target.value as UserStatus }); setErrors({ ...errors, [id]: undefined }); }}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#36e17b] focus:border-transparent transition"
          >
            {options.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        ) : (
          <input
            id={id}
            type={type}
            value={form[id]}
            onChange={(e) => { setForm({ ...form, [id]: e.target.value }); setErrors({ ...errors, [id]: undefined }); }}
            className={`w-full px-4 py-2.5 rounded-lg border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#36e17b] focus:border-transparent transition ${errors[id] ? 'border-red-300' : 'border-gray-200'}`}
          />
        )}
        {errors[id] && <p className="mt-1 text-xs text-red-500">{errors[id]}</p>}
      </div>
    );
  }

  return (
    /* Backdrop */
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Add new user</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {field('name',     'Full name')}
          {field('email',    'Email address', 'email')}
          {field('phone',    'Phone number',  'tel')}
          {field('location', 'Location')}
          {field('status',   'Status', 'text', ['Active', 'Pending', 'Inactive'])}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg bg-[#36e17b] text-white text-sm font-medium hover:bg-[#00b835] transition"
            >
              Add user
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const { role } = useRole();
  const [users, setUsers] = useState<MockUser[]>(mockUsers);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.location.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-1">All registered clients and borrowers</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-400 bg-white border border-gray-100 px-4 py-2 rounded-lg">
            {filtered.length} of {users.length} users
          </div>
          {role === 'loan-officer' && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-[#36e17b] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#00b835] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add user
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative w-72">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, email, location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#36e17b] focus:border-transparent transition placeholder-gray-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400 text-sm">
                    No users match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3.5 text-gray-400 font-mono text-xs">{user.id}</td>
                    <td className="px-6 py-3.5 font-medium text-gray-800">{user.name}</td>
                    <td className="px-6 py-3.5 text-gray-600">{user.email}</td>
                    <td className="px-6 py-3.5 text-gray-600">{user.phone}</td>
                    <td className="px-6 py-3.5 text-gray-600">{user.location}</td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[user.status]}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-gray-500">{user.joinedAt}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <AddUserModal
          onClose={() => setShowModal(false)}
          onAdd={(u) => setUsers((prev) => [u, ...prev])}
        />
      )}
    </div>
  );
}
