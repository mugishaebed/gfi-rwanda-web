'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/#services', label: 'Services' },
    { href: '/#why-gfi', label: 'Why GFI' },
    { href: '/#blogs', label: 'Blogs' },
  ];

  return (
    <nav className="w-full bg-white" style={{ animation: 'slide-down 0.5s ease both' }}>
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo.png"
              alt="GFI Logo"
              width={140}
              height={50}
              loading='eager'
              className="h-12 w-auto"
            />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link text-gray-700 font-medium transition-colors hover:text-gray-900 ${
                    isActive ? 'active text-gray-900' : ''
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign in
            </Link>
            <a
              href="/contact"
              className="bg-[#36e17b] text-white px-6 py-2.5 rounded-full font-medium hover:bg-[#00b835] transition-colors"
            >
              Contact us
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
