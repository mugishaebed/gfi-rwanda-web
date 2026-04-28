import type { Metadata } from 'next';
import Sidebar from './components/Sidebar';
import AuthGuard from './components/AuthGuard';

export const metadata: Metadata = {
  title: 'Dashboard — GFI Rwanda',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">{children}</div>
      </div>
    </AuthGuard>
  );
}
