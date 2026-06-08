'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/lib/auth-context';
import { googleClientLoginUrl, googleClientSignupUrl } from '@/app/lib/auth-api';

const errorMessages: Record<string, string> = {
  missing_tokens: 'Authentication failed. Please try again.',
  missing_profile: 'Authentication failed to return your profile. Please try again.',
  auth_failed: 'Google authentication failed. Please try again.',
  unsupported_provider: 'Please sign in with Google.',
  unauthorized: 'Your account does not have client portal access.',
  sign_in_required: 'Please sign in to continue to the loan portal.',
  default: 'Something went wrong. Please try again.',
};

function GoogleMark() {
  return (
    <span
      aria-hidden
      className="grid h-5 w-5 place-items-center rounded-full bg-white text-[13px] font-bold text-[#4285f4] shadow-sm ring-1 ring-gray-200"
    >
      G
    </span>
  );
}

export default function ClientAuthPage() {
  const { isLoading, accessToken, roles } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  useEffect(() => {
    if (!isLoading && accessToken && roles.includes('CLIENT')) {
      router.replace('/loan-portal');
    }
  }, [accessToken, isLoading, roles, router]);

  const startLogin = () => {
    window.location.assign(googleClientLoginUrl());
  };

  const startSignup = () => {
    window.location.assign(googleClientSignupUrl());
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#36e17b] border-t-transparent" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white lg:grid lg:grid-cols-[minmax(0,3fr)_minmax(420px,2fr)] xl:grid-cols-[minmax(0,7fr)_minmax(440px,5fr)]">
      <section className="relative h-72 overflow-hidden bg-gray-900 sm:h-96 lg:h-auto lg:min-h-screen">
        <Image
          src="/login.png"
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 58vw"
          className="object-cover object-center"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-black/5" aria-hidden />
      </section>

      <section className="flex min-h-[calc(100vh-18rem)] items-center justify-center bg-[#f7faf8] px-4 py-10 sm:min-h-[calc(100vh-24rem)] sm:px-6 lg:min-h-screen lg:bg-white lg:px-10">
        <div className="w-full max-w-md">
          <div className="w-full rounded-2xl border border-gray-100 bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <div className="mb-8 text-center">
              <Image
                src="/logo.png"
                alt="GFI Rwanda"
                width={56}
                height={56}
                className="mx-auto mb-5 h-14 w-auto"
              />
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#168a45]">
                Client Loan Portal
              </p>
              <h1 className="mt-3 text-3xl font-bold text-gray-950">
                Welcome back
              </h1>
              <p className="mt-2 text-sm font-medium text-gray-500">
                Sign in to continue.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessages[error] ?? errorMessages.default}
              </div>
            )}

            <div className="space-y-3">
              <button
                type="button"
                onClick={startLogin}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-3.5 text-sm font-semibold text-gray-900 shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50"
              >
                <GoogleMark />
                Continue with Google
              </button>

              <div className="flex items-center gap-3 py-1">
                <span className="h-px flex-1 bg-gray-100" />
                <span className="text-xs font-medium text-gray-400">New to GFI loans?</span>
                <span className="h-px flex-1 bg-gray-100" />
              </div>

              <button
                type="button"
                onClick={startSignup}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#36e17b] px-5 py-3.5 text-sm font-bold text-gray-950 shadow-[0_12px_28px_rgba(54,225,123,0.28)] transition-colors hover:bg-[#20c968]"
              >
                <GoogleMark />
                Sign up with Google
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
