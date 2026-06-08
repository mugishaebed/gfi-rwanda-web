import type { Metadata } from 'next';
import ClientAuthGuard from './components/ClientAuthGuard';
import ClientPortalShell from './components/ClientPortalShell';

export const metadata: Metadata = {
  title: 'Loan Portal — GFI Rwanda',
};

export default function LoanPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientAuthGuard>
      <ClientPortalShell>{children}</ClientPortalShell>
    </ClientAuthGuard>
  );
}
