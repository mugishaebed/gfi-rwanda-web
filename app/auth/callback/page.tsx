'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/lib/auth-context';
import { parseJwt } from '@/app/lib/auth-api';

export default function CallbackPage() {
  const { setTokens } = useAuth();
  const router        = useRouter();

  useEffect(() => {
    // Backend redirects to: {FRONTEND_URL}/auth/callback#token=<jwt>&refresh=<token>&action=login
    const params  = new URLSearchParams(window.location.hash.slice(1));
    const token   = params.get('token');
    const refresh = params.get('refresh');

    // Strip tokens from browser history immediately
    window.history.replaceState(null, '', window.location.pathname);

    if (!token || !refresh) {
      router.replace('/auth/login?error=missing_tokens');
      return;
    }

    // Verify the user carries the BLOG_EDITOR role before granting access
    const payload = parseJwt(token);
    if (!payload?.roles?.includes('BLOG_EDITOR')) {
      router.replace('/auth/login?error=unauthorized');
      return;
    }

    setTokens(token, refresh);
    router.replace('/dashboard/blog');
  }, [setTokens, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-[#36e17b] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Signing you in…</p>
      </div>
    </div>
  );
}
