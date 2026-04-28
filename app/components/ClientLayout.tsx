'use client';

import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/app/lib/auth-context';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noChrome = pathname?.startsWith('/dashboard') || pathname?.startsWith('/auth');

  return (
    <AuthProvider>
      {noChrome ? children : (
        <>
          <Navbar />
          {children}
          <Footer />
        </>
      )}
    </AuthProvider>
  );
}
