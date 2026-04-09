'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRole, type Role } from '../lib/useRole';

const ROLES: { value: Role; label: string; description: string }[] = [
  {
    value: 'loan-officer',
    label: 'Loan Officer',
    description: 'Manage loan applications and client accounts',
  },
  {
    value: 'general-manager',
    label: 'General Manager',
    description: 'Oversee portfolio, approvals, and team performance',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { setRole } = useRole();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [name, setName] = useState('');

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedRole) return;
    setRole(selectedRole);
    router.push('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image src="/logo.png" alt="GFI Logo" width={140} height={50} className="h-12 w-auto" />
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Welcome back</h1>
          <p className="text-sm text-gray-500 mb-8">Sign in to the GFI Rwanda dashboard</p>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                Full name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. David Kamanzi"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#36e17b] focus:border-transparent transition"
              />
            </div>

            {/* Role selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select your role
              </label>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setSelectedRole(r.value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selectedRole === r.value
                        ? 'border-[#36e17b] bg-[#36e17b]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div
                      className={`text-sm font-semibold mb-1 ${
                        selectedRole === r.value ? 'text-gray-900' : 'text-gray-700'
                      }`}
                    >
                      {r.label}
                    </div>
                    <div className="text-xs text-gray-500 leading-snug">{r.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!selectedRole}
              className="w-full bg-[#36e17b] text-white py-2.5 rounded-lg font-medium hover:bg-[#00b835] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Sign in
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Green Financing Incorporate Ltd &mdash; Rwanda
        </p>
      </div>
    </div>
  );
}
