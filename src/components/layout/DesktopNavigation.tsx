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
    <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
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
      
      <style jsx>{`
        .nav-link {
          color: var(--text-muted);
          display: inline-block;
          padding-bottom: 8px; /* reserve space so underline doesn't overlap text */
        }
        
        .nav-link:hover,
        .nav-link[aria-current="page"] {
          color: var(--text-primary);
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: -10px;
          height: 2px;
          border-radius: 9999px;
          transform: scaleX(0);
          transform-origin: left;
          will-change: transform;
          z-index: 0;
          background: linear-gradient(90deg, var(--accent-orange) 0%, var(--accent-red) 100%);
          transition: transform 240ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        /* reveal underline left-to-right on hover or keyboard focus */
        .nav-link:hover::after,
        .nav-link:focus-visible::after {
          transform: scaleX(1);
        }
        
        .nav-link:focus-visible {
          outline: 2px solid var(--accent-orange);
          outline-offset: 4px;
          border-radius: 2px;
        }
      `}</style>
    </nav>
  );
}
