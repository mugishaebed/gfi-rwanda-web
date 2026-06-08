'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/app/lib/auth-context';

type IconProps = React.SVGProps<SVGSVGElement>;

type NavItem = {
  href: string;
  label: string;
  icon: (props: IconProps) => React.ReactNode;
  exact?: boolean;
};

const primaryNavItems: NavItem[] = [
  { href: '/loan-portal', label: 'Dashboard', icon: DashboardIcon, exact: true },
  { href: '/loan-portal/request', label: 'Apply for a loan', icon: PlusCircleIcon },
  { href: '/loan-portal/my-loans', label: 'My loans', icon: LoansIcon },
  { href: '/loan-portal/payments', label: 'Payments', icon: CreditCardIcon },
];

const accountNavItems: NavItem[] = [
  { href: '/loan-portal/profile', label: 'Profile', icon: ProfileIcon },
  { href: '/loan-portal/settings', label: 'Settings', icon: SettingsIcon },
];

function iconBase({ className, ...props }: IconProps) {
  return {
    ...props,
    'aria-hidden': true,
    className: `h-4 w-4 ${className ?? ''}`,
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 1.8,
    viewBox: '0 0 24 24',
  };
}

function DashboardIcon(props: IconProps) {
  return (
    <svg {...iconBase(props)}>
      <path d="M4 4h6v6H4z" />
      <path d="M14 4h6v6h-6z" />
      <path d="M4 14h6v6H4z" />
      <path d="M14 14h6v6h-6z" />
    </svg>
  );
}

function LoansIcon(props: IconProps) {
  return (
    <svg {...iconBase(props)}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v8" />
      <path d="M15 10.5c-.5-1-1.5-1.5-3-1.5-1.7 0-2.8.8-2.8 2s1 1.7 2.8 2 2.8.8 2.8 2-1.1 2-2.8 2c-1.5 0-2.6-.5-3.1-1.6" />
    </svg>
  );
}

function PlusCircleIcon(props: IconProps) {
  return (
    <svg {...iconBase(props)}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </svg>
  );
}

function CreditCardIcon(props: IconProps) {
  return (
    <svg {...iconBase(props)}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function ProfileIcon(props: IconProps) {
  return (
    <svg {...iconBase(props)}>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </svg>
  );
}

function SettingsIcon(props: IconProps) {
  return (
    <svg {...iconBase(props)}>
      <path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z" />
      <path d="M18 13.5a7.8 7.8 0 0 0 .1-3l2-1.5-2-3.4-2.4 1a8.7 8.7 0 0 0-2.6-1.5L12.8 2h-4l-.4 3.1a8.7 8.7 0 0 0-2.6 1.5l-2.4-1-2 3.4 2 1.5a7.8 7.8 0 0 0 .1 3l-2 1.5 2 3.4 2.4-1a8.7 8.7 0 0 0 2.6 1.5l.4 3.1h4l.4-3.1a8.7 8.7 0 0 0 2.6-1.5l2.4 1 2-3.4z" />
    </svg>
  );
}

function LogoutIcon(props: IconProps) {
  return (
    <svg {...iconBase(props)}>
      <path d="M10 6H5v12h5" />
      <path d="M14 8l4 4-4 4" />
      <path d="M8 12h10" />
    </svg>
  );
}

function getInitials(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.split('@')[0] || 'Client';
  const parts = source.split(/\s+/).filter(Boolean);

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function statusLabel(status: string | null) {
  if (!status) return 'Client account';

  return status.replaceAll('_', ' ').toLowerCase();
}

export default function ClientPortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clientOnboardingStatus, logout } = useAuth();
  const displayName = user?.name || 'Client';
  const initials = getInitials(user?.name, user?.email);

  const handleLogout = async () => {
    await logout();
    router.replace('/auth/client');
  };

  const isActiveLink = (item: NavItem) => {
    if (item.exact) return pathname === item.href;
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

  const renderNavItem = (item: NavItem) => {
    const active = isActiveLink(item);
    const Icon = item.icon;

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`flex min-h-10 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
          active
            ? 'bg-[#eaf6f1] text-[#168a45]'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-950'
        }`}
      >
        <Icon className="shrink-0" />
        <span className="truncate">{item.label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-gray-950">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="border-b border-gray-200 bg-white px-4 py-4 lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-72 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r lg:px-4 lg:py-5">
          <div className="flex items-center justify-between gap-4 lg:block">
            <Link href="/loan-portal" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="GFI Rwanda"
                width={120}
                height={103}
                className="h-12 w-auto"
                priority
              />
            </Link>

            <div className="flex items-center gap-2 lg:hidden">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eaf6f1] text-xs font-bold text-[#168a45]">
                {initials}
              </span>
            </div>
          </div>

          <nav className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {primaryNavItems.map(renderNavItem)}
          </nav>

          <div className="mt-5 border-t border-gray-100 pt-5 lg:mt-8 lg:pt-7">
            <p className="mb-4 hidden px-3 text-xs font-bold uppercase tracking-[0.18em] text-gray-500 lg:block">
              Account
            </p>
            <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
              {accountNavItems.map(renderNavItem)}
            </nav>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-2 flex min-h-10 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-950"
            >
              <LogoutIcon className="shrink-0" />
              Log out
            </button>
          </div>

          <div className="mt-auto hidden items-center gap-3 border-t border-gray-100 pt-5 lg:flex">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eaf6f1] text-sm font-bold text-[#168a45]">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-950">{displayName}</p>
              <p className="truncate text-xs text-gray-500">{user?.email}</p>
              <p className="mt-0.5 text-xs font-medium capitalize text-gray-400">
                {statusLabel(clientOnboardingStatus)}
              </p>
            </div>
          </div>
        </aside>

        <main className="w-full flex-1 px-4 py-6 md:px-8 lg:px-10 lg:py-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
