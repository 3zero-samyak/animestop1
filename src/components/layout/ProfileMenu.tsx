'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthProvider';
import { User as UserIcon } from 'lucide-react';
import { buildCurrentRelativeUrl, persistAuthReturnTo } from '@/lib/authNavigation';

export default function ProfileMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  // Close dropdown on outside click or Escape key when open
  useEffect(() => {
    if (!open) return;

    const onDocClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        setOpen(false);
        btnRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  // Close dropdown when focus leaves the profile container
  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setOpen(false);
    }
  };

  const openAuthPage = (view?: 'create') => {
    const destination = buildCurrentRelativeUrl(
      window.location.pathname,
      window.location.search,
      window.location.hash,
    );
    persistAuthReturnTo(destination);
    setOpen(false);

    const params = new URLSearchParams();
    if (view) {
      params.set('view', view);
    }
    params.set('returnTo', destination);
    router.push(`/login?${params.toString()}`);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setOpen(false);
      router.push('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const avatarLetter = () => {
    if (!user) return null;
    const name = user.displayName || user.email || '';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div
      ref={containerRef}
      className="profile-menu-root"
      onBlur={handleBlur}
      style={{ position: 'relative' }}
    >
      <button
        ref={btnRef}
        type="button"
        id="profile-menu-trigger"
        className="site-header-icon-button profile-icon-button"
        aria-expanded={open}
        aria-controls="profile-menu-panel"
        aria-label={open ? 'Close profile menu' : 'Open profile menu'}
        onClick={() => setOpen((s) => !s)}
      >
        {/* Avatar when logged in, otherwise generic user icon */}
        {user ? (
          <div
            aria-hidden
            className="w-8 h-8 rounded-full flex items-center justify-center font-semibold"
            style={{
              backgroundColor: 'var(--elevated-bg)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-card)',
            }}
          >
            {avatarLetter()}
          </div>
        ) : (
          <UserIcon />
        )}
      </button>

      {open && (
        <nav
          id="profile-menu-panel"
          aria-label="Profile navigation"
          className="profile-menu-panel"
          style={{
            position: 'absolute',
            right: 0,
            marginTop: 8,
            width: 220,
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-card)',
            borderRadius: 10,
            boxShadow: '0 6px 24px rgba(0,0,0,0.25)',
            zIndex: 1200,
            padding: '8px',
          }}
        >
          <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-soft)' }}>
            {user ? (
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user.displayName || 'Anonymous'}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user.email}</div>
              </div>
            ) : (
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Welcome</div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 8 }}>
            {user ? (
              <>
                <Link
                  href="/account"
                  className="profile-menu-item"
                  onClick={() => setOpen(false)}
                >
                  Account
                </Link>
                <Link
                  href="/account/saved"
                  className="profile-menu-item"
                  onClick={() => setOpen(false)}
                >
                  My Saved Items
                </Link>
                <Link
                  href="/journal/write"
                  className="profile-menu-item"
                  onClick={() => setOpen(false)}
                >
                  Write Journal
                </Link>
                <Link
                  href="/share-story"
                  className="profile-menu-item"
                  onClick={() => setOpen(false)}
                >
                  Share Story
                </Link>
                <button
                  type="button"
                  className="profile-menu-item text-left"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="profile-menu-item text-left"
                  onClick={() => openAuthPage()}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className="profile-menu-item text-left"
                  onClick={() => openAuthPage('create')}
                >
                  Create Account
                </button>
              </>
            )}
          </div>
        </nav>
      )}
    </div>
  );
}
