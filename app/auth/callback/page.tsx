'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/lib/auth-context';
import {
  parseClientOnboardingStatus,
  parseJwt,
  parseRoles,
} from '@/app/lib/auth-api';

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
  clientOnboardingStatus: ReturnType<typeof parseClientOnboardingStatus>;
  state: string | null;
};

function getCallbackParams(): AuthCallbackParams {
  const searchParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.slice(1));
  const googleFragmentToken = hashParams.get('token');
  const params = searchParams.toString() ? searchParams : hashParams;
  const roleParams = [...params.getAll('roles'), ...params.getAll('roles[]')];
  const appAccessToken =
    hashParams.get('token') ??
    params.get('token') ??
    params.get('appAccessToken') ??
    params.get('accessToken');
  const refreshToken =
    hashParams.get('refresh') ??
    params.get('refresh') ??
    params.get('refreshToken');

  return {
    authStatus: params.get('authStatus'),
    provider: params.get('provider') ?? (googleFragmentToken ? 'google' : null),
    action: params.get('action'),
    appAccessToken,
    refreshToken,
    userId: hashParams.get('userId') ?? params.get('userId'),
    email: params.get('email'),
    name: params.get('name'),
    roles: parseRoles(roleParams.length ? roleParams : params.get('roles')),
    clientOnboardingStatus: parseClientOnboardingStatus(
      hashParams.get('clientOnboardingStatus') ??
        params.get('clientOnboardingStatus'),
    ),
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

function safeClientRedirect(state: string | null) {
  if (!state || !state.startsWith('/loan-portal') || state.startsWith('//')) {
    return '/loan-portal';
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

    const provider = callback.provider?.toLowerCase() ?? null;

    if (provider !== 'microsoft' && provider !== 'google') {
      router.replace('/auth/login?error=unsupported_provider');
      return;
    }

    if (!callback.appAccessToken || !callback.refreshToken) {
      router.replace('/auth/login?error=missing_tokens');
      return;
    }

    const payload = parseJwt(callback.appAccessToken);
    const roles = callback.roles.length ? callback.roles : parseRoles(payload?.roles);
    const userId = callback.userId ?? payload?.sub;
    const email = callback.email ?? payload?.email;
    const name = callback.name ?? payload?.name;

    if (!userId || !email) {
      router.replace('/auth/login?error=missing_profile');
      return;
    }

    const isClient = provider === 'google' && roles.includes('CLIENT');
    const isBlogEditor = provider === 'microsoft' && roles.includes('BLOG_EDITOR');

    if (!isClient && !isBlogEditor) {
      router.replace(
        provider === 'google'
          ? '/auth/client?error=unauthorized'
          : '/auth/login?error=unauthorized',
      );
      return;
    }

    setSession({
      appAccessToken: callback.appAccessToken,
      refreshToken: callback.refreshToken,
      user: {
        userId,
        email,
        name: name ?? email,
        roles,
        clientOnboardingStatus: callback.clientOnboardingStatus,
        provider,
      },
    });

    if (isClient) {
      router.replace(safeClientRedirect(callback.state));
      return;
    }

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
