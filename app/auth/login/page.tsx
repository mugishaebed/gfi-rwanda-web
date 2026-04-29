'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/app/lib/auth-context';
import { microsoftLoginUrl, microsoftSignupUrl } from '@/app/lib/auth-api';

function MicrosoftLogo() {
  return (
    <span className="grid h-[18px] w-[18px] grid-cols-2 gap-0.5" aria-hidden>
      <span className="bg-[#f25022]" />
      <span className="bg-[#7fba00]" />
      <span className="bg-[#00a4ef]" />
      <span className="bg-[#ffb900]" />
    </span>
  );
}

const errorMessages: Record<string, string> = {
  missing_tokens: 'Authentication failed. Please try again.',
  missing_profile: 'Authentication failed to return your profile. Please try again.',
  auth_failed:     'Microsoft authentication failed. Please try again.',
  unsupported_provider: 'Please sign in with Microsoft.',
  unauthorized:   'Your account does not have blog editor access.',
  default:        'Something went wrong. Please try again.',
};

export default function LoginPage() {
  const { appAccessToken, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  // Already authenticated → go straight to the dashboard
  useEffect(() => {
    if (!isLoading && appAccessToken) router.replace('/dashboard/blog');
  }, [appAccessToken, isLoading, router]);

  const startMicrosoftLogin = () => {
    window.location.assign(microsoftLoginUrl(window.location.origin));
  };

  const startMicrosoftSignup = () => {
    window.location.assign(microsoftSignupUrl(window.location.origin));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-7 h-7 border-2 border-[#36e17b] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <Image src="/logo.png" alt="GFI Rwanda" width={52} height={52} className="rounded-2xl" />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#36e17b]">
          GFI Rwanda
        </p>
      </div>

      <div className="w-full max-w-sm rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
        <div className="mb-7 text-center">
          <h1 className="text-xl font-bold text-gray-900">Blog Editor Access</h1>
          <p className="text-sm text-gray-500 mt-1.5">
            Sign in with your approved Microsoft account
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {errorMessages[error] ?? errorMessages.default}
          </div>
        )}

        <div className="flex flex-col gap-3">
          {/* Returning user */}
          <button
            type="button"
            onClick={startMicrosoftLogin}
            className="flex items-center justify-center gap-3 w-full rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <MicrosoftLogo />
            Sign in with Microsoft
          </button>

          <div className="flex items-center gap-3">
            <span className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">first time?</span>
            <span className="flex-1 h-px bg-gray-100" />
          </div>

          {/* First-time signup — BLOG_EDITOR role only */}
          <button
            type="button"
            onClick={startMicrosoftSignup}
            className="flex items-center justify-center gap-3 w-full rounded-2xl bg-[#36e17b] px-5 py-3 text-sm font-medium text-white hover:bg-[#00d63b] transition-colors"
          >
            <MicrosoftLogo />
            Create editor account
          </button>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-gray-400 max-w-xs">
        Access is restricted to approved blog editors. Contact your administrator to request access.
      </p>
    </div>
  );
}
