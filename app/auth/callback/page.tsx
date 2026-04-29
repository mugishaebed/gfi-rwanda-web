'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/lib/auth-context';
import { parseRoles } from '@/app/lib/auth-api';

type AuthCallbackParams = {
  authStatus: string | null;
  provider: string | null;
  action: string | null;
  appAccessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
  email: string | null;
  name: string | null;
  roles: string[];
  state: string | null;
};

function getCallbackParams(): AuthCallbackParams {
  const searchParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.slice(1));
  const params = searchParams.toString() ? searchParams : hashParams;
  const roleParams = [...params.getAll('roles'), ...params.getAll('roles[]')];

  return {
    authStatus: params.get('authStatus'),
    provider: params.get('provider'),
    action: params.get('action'),
    appAccessToken: params.get('appAccessToken'),
    refreshToken: params.get('refreshToken'),
    userId: params.get('userId'),
    email: params.get('email'),
    name: params.get('name'),
    roles: parseRoles(roleParams.length ? roleParams : params.get('roles')),
    state: params.get('state'),
  };
}

function failedAuthStatus(authStatus: string | null) {
  if (!authStatus) return false;
  return ['error', 'failed', 'failure', 'denied', 'unauthorized'].includes(
    authStatus.toLowerCase(),
  );
}

function safeDashboardRedirect(state: string | null) {
  if (!state || !state.startsWith('/dashboard') || state.startsWith('//')) {
    return '/dashboard/blog';
  }

  return state;
}

export default function CallbackPage() {
  const { setSession } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const callback = getCallbackParams();

    // Strip tokens from browser history immediately
    window.history.replaceState(null, '', window.location.pathname);

    if (failedAuthStatus(callback.authStatus)) {
      router.replace('/auth/login?error=auth_failed');
      return;
    }

    if (callback.provider?.toLowerCase() !== 'microsoft') {
      router.replace('/auth/login?error=unsupported_provider');
      return;
    }

    if (!callback.appAccessToken || !callback.refreshToken) {
      router.replace('/auth/login?error=missing_tokens');
      return;
    }

    if (!callback.userId || !callback.email) {
      router.replace('/auth/login?error=missing_profile');
      return;
    }

    if (!callback.roles.includes('BLOG_EDITOR')) {
      router.replace('/auth/login?error=unauthorized');
      return;
    }

    setSession({
      appAccessToken: callback.appAccessToken,
      refreshToken: callback.refreshToken,
      user: {
        userId: callback.userId,
        email: callback.email,
        name: callback.name || callback.email,
        roles: callback.roles,
        provider: callback.provider,
      },
    });
    router.replace(safeDashboardRedirect(callback.state));
  }, [setSession, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-[#36e17b] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Signing you in…</p>
      </div>
    </div>
  );
}
