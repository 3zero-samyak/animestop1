'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteNavigation } from '@/data/navigation';

export default function DesktopNavigation() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname === href;
  };

  // Show only these items in the desktop header (excluding About Us and Login)
  const desktopNavItems = siteNavigation.filter(item => 
    !['about', 'login'].includes(item.id)
  );

  return (
    <nav className="site-primary-nav" aria-label="Main navigation">
      {desktopNavItems.map((item) => {
        const active = isActive(item.href);
        
        return (
          <Link
            key={item.id}
            href={item.href}
            className="nav-link relative group"
            aria-current={active ? 'page' : undefined}
          >
            <span className="relative z-10 inline-block text-[12.5px] font-medium tracking-[0.08em] uppercase transition-colors duration-[var(--transition-nav)]">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
