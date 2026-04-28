'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/lib/auth-context';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { token, user, isLoading } = useAuth();
  const router = useRouter();

  const hasBlogEditorRole = token && user?.roles?.includes('BLOG_EDITOR');

  useEffect(() => {
    if (isLoading) return;
    if (!token) {
      router.replace('/auth/login');
    } else if (!hasBlogEditorRole) {
      router.replace('/auth/login?error=unauthorized');
    }
  }, [isLoading, token, hasBlogEditorRole, router]);

  // Show spinner while the session is being restored from localStorage
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="w-7 h-7 border-2 border-[#36e17b] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!hasBlogEditorRole) return null;

  return <>{children}</>;
}
