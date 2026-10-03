'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthProvider';
import { User as UserIcon } from 'lucide-react';
import { buildCurrentRelativeUrl, persistAuthReturnTo } from '@/lib/authNavigation';

export default function ProfileMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!open) return;
      if (panelRef.current && btnRef.current && !panelRef.current.contains(e.target as Node) && !btnRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const openTo = (href: string) => {
    setOpen(false);
    router.push(href);
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
    <div className="profile-menu-root" style={{ position: 'relative' }}>
      <button
        ref={btnRef}
        type="button"
        className="site-header-icon-button profile-icon-button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={open ? 'Close profile menu' : 'Open profile menu'}
        onClick={() => setOpen((s) => !s)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen((s) => !s);
          }
        }}
      >
        {/* Avatar when logged in, otherwise generic user icon */}
        {user ? (
          <div
            aria-hidden
            className="w-8 h-8 rounded-full flex items-center justify-center font-semibold"
            style={{ backgroundColor: 'var(--elevated-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-card)' }}
          >
            {avatarLetter()}
          </div>
        ) : (
          <UserIcon />
        )}
      </button>

      {open && (
        <div
          ref={panelRef}
          role="menu"
          aria-label="Profile menu"
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
                <button type="button" className="profile-menu-item" onClick={() => openTo('/account')} aria-label="Account">
                  Account
                </button>
                <button type="button" className="profile-menu-item" onClick={() => openTo('/account/saved')} aria-label="My saved items">
                  My Saved Items
                </button>
                <button type="button" className="profile-menu-item" onClick={() => openTo('/journal/write')} aria-label="Write Journal">
                  Write Journal
                </button>
                <button type="button" className="profile-menu-item" onClick={() => openTo('/share-story')} aria-label="Share Story">
                  Share Story
                </button>
                <button type="button" className="profile-menu-item" onClick={handleLogout} aria-label="Logout">
                  Logout
                </button>
              </>
            ) : (
              <>
                <button type="button" className="profile-menu-item" onClick={() => openAuthPage()} aria-label="Sign in">
                  Sign In
                </button>
                <button type="button" className="profile-menu-item" onClick={() => openAuthPage('create')} aria-label="Create account">
                  Create Account
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
