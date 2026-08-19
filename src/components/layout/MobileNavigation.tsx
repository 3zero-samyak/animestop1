'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { useAuth } from '@/lib/AuthProvider';
import { siteNavigation } from '@/data/navigation';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNavigation({ isOpen, onClose }: MobileNavigationProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname === href;
  };

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  // Detect mobile vs desktop for drawer content
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 899);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Focus management
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !drawerRef.current) return;

    const drawer = drawerRef.current;
    const focusableElements = drawer.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable?.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  // Handle navigation
  const handleNavigation = (href: string) => {
    onClose();
    router.push(href);
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="navigation-drawer-backdrop"
        data-open={isOpen}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Navigation Drawer */}
      <aside
        ref={drawerRef}
        id="global-navigation-drawer"
        className="navigation-drawer"
        data-open={isOpen}
        role="dialog"
        aria-modal="true"
        aria-labelledby="navigation-drawer-title"
      >
        <header className="navigation-drawer-header">
          <span 
            id="navigation-drawer-title" 
            className="navigation-drawer-title"
          >
            Menu
          </span>

          <button
            ref={closeButtonRef}
            type="button"
            className="navigation-drawer-close"
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            <X size={22} strokeWidth={2} />
          </button>
        </header>

        <nav className="navigation-drawer-nav" aria-label="Main navigation">
          <ul className="navigation-drawer-list">
            {(isMobile ? siteNavigation : siteNavigation.filter(i => ['home','about','login'].includes(i.id))).map((item) => {
              const active = isActive(item.href);
                // If this is the login entry, adapt label/href when user is authenticated
                let href = item.href;
                let label = item.label;
                
                if (item.id === 'login' && user) {
                  href = '/account';
                  label = 'Account';
                }
              
              return (
                <li key={item.id}>
                    <Link
                      href={href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigation(href);
                      }}
                      className="navigation-drawer-link"
                      data-current={active}
                      aria-current={active ? 'page' : undefined}
                    >
                      {label}
                    </Link>
                </li>
              );
            })}
            {user && (
              <li>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await logout();
                      onClose();
                      router.push('/');
                    } catch (err) {
                      console.error('Logout error:', err);
                    }
                  }}
                  className="navigation-drawer-link"
                  style={{ width: '100%', textAlign: 'left' }}
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </nav>
      </aside>
    </>
  );
}

