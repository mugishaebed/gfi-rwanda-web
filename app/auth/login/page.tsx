'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/app/lib/auth-context';
import { googleLoginUrl, googleSignupUrl } from '@/app/lib/auth-api';

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908C16.658 14.113 17.64 11.805 17.64 9.2z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
      <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
    </svg>
  );
}

const errorMessages: Record<string, string> = {
  missing_tokens: 'Authentication failed. Please try again.',
  unauthorized:   'Your account does not have blog editor access.',
  default:        'Something went wrong. Please try again.',
};

export default function LoginPage() {
  const { token, isLoading } = useAuth();
  const router               = useRouter();
  const [error, setError]    = useState<string | null>(null);

  // Read error from URL search params without useSearchParams (no Suspense needed)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setError(params.get('error'));
  }, []);

  // Already authenticated → go straight to the dashboard
  useEffect(() => {
    if (!isLoading && token) router.replace('/dashboard/blog');
  }, [token, isLoading, router]);

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
            Sign in with your approved Google account
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {errorMessages[error] ?? errorMessages.default}
          </div>
        )}

        <div className="flex flex-col gap-3">
          {/* Returning user */}
          <a
            href={googleLoginUrl()}
            className="flex items-center justify-center gap-3 w-full rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <GoogleLogo />
            Sign in with Google
          </a>

          <div className="flex items-center gap-3">
            <span className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">first time?</span>
            <span className="flex-1 h-px bg-gray-100" />
          </div>

          {/* First-time signup — BLOG_EDITOR role only */}
          <a
            href={googleSignupUrl()}
            className="flex items-center justify-center gap-3 w-full rounded-2xl bg-[#36e17b] px-5 py-3 text-sm font-medium text-white hover:bg-[#00d63b] transition-colors"
          >
            <GoogleLogo />
            Create editor account
          </a>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-gray-400 max-w-xs">
        Access is restricted to approved blog editors. Contact your administrator to request access.
      </p>
    </div>
  );
}
