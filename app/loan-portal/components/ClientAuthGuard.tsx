'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/lib/auth-context';

export default function ClientAuthGuard({ children }: { children: React.ReactNode }) {
  const { accessToken, roles, isLoading } = useAuth();
  const router = useRouter();
  const hasClientRole = Boolean(accessToken && roles.includes('CLIENT'));

  useEffect(() => {
    if (isLoading) return;

    if (!accessToken) {
      router.replace('/auth/client?error=sign_in_required');
      return;
    }

    if (!hasClientRole) {
      router.replace('/auth/client?error=unauthorized');
    }
  }, [accessToken, hasClientRole, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#36e17b] border-t-transparent" />
      </div>
    );
  }

  if (!hasClientRole) return null;

  return <>{children}</>;
}
