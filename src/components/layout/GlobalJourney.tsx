'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Flame, ArrowRight, X } from 'lucide-react';
import { useAuth } from '@/lib/AuthProvider';
import { useJourney } from '@/components/journey/JourneyProvider';

export default function GlobalJourney() {
  const { user } = useAuth();
  const {
    loading,
    error,
    searches,
    views,
    preference,
    interests,
    continueExploring,
    clearSearches,
    clearViews,
    setPaused,
  } = useJourney();

  const [isExpanded, setIsExpanded] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const wasExpandedRef = useRef(false);

  // Restore focus to trigger when dialog closes
  useEffect(() => {
    if (wasExpandedRef.current && !isExpanded) {
      triggerRef.current?.focus();
    }
    wasExpandedRef.current = isExpanded;
  }, [isExpanded]);

  // Focus close button on dialog open
  useEffect(() => {
    if (isExpanded) {
      closeButtonRef.current?.focus();
    }
  }, [isExpanded]);

  // Lock body scroll while dialog is open
  useEffect(() => {
    if (!isExpanded) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isExpanded]);

  // Global escape key handler
  useEffect(() => {
    if (!isExpanded) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsExpanded(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded]);

  // Focus trap inside modal dialog
  const handleDialogKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsExpanded(false);
      return;
    }

    if (e.key === 'Tab') {
      if (!dialogRef.current) return;
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;

      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl || document.activeElement === dialogRef.current) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Anime fan';

  return (
    <>
      {/* Collapsed State - Floating Trigger Button */}
      {!isExpanded && (
        <button
          ref={triggerRef}
          onClick={() => setIsExpanded(true)}
          className="global-journey-toggle fixed right-6 bottom-6 lg:right-8 lg:bottom-8 flex items-center gap-3 px-4 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_30px_rgb(220,101,52,0.4)] group"
          style={{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-card)',
            zIndex: 900,
          }}
          aria-label="Open Your Journey"
          aria-haspopup="dialog"
          aria-expanded={false}
          aria-controls="global-journey-dialog"
        >
          {/* Flame Icon */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{
              backgroundColor: 'rgba(220, 101, 52, 0.15)',
              border: '1px solid rgba(220, 101, 52, 0.3)',
            }}
          >
            <Flame
              className="w-4 h-4 transition-transform group-hover:scale-110"
              style={{ color: 'var(--accent-orange)' }}
              strokeWidth={2.5}
            />
          </div>

          {/* Text - Hidden on small mobile */}
          <span
            className="your-journey-label hidden sm:inline-block text-sm font-medium whitespace-nowrap"
            style={{ color: 'var(--text-primary)' }}
          >
            Your Journey
          </span>
        </button>
      )}

      {/* Expanded State - Full Modal Dialog */}
      {isExpanded && (
        <>
          {/* Backdrop Overlay covering all viewports */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            style={{ zIndex: 1060 }}
            onClick={() => setIsExpanded(false)}
            aria-hidden="true"
          />

          {/* Journey Dialog Panel */}
          <div
            id="global-journey-dialog"
            ref={dialogRef}
            onKeyDown={handleDialogKeyDown}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[380px] lg:w-[400px] lg:right-8 lg:top-24 lg:bottom-auto lg:rounded-2xl shadow-2xl lg:max-h-[calc(100vh-120px)] overflow-y-auto"
            style={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-card)',
              zIndex: 1070,
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Your Journey"
            tabIndex={-1}
          >
            <div className="p-6 lg:p-8 flex flex-col h-full lg:h-auto">
              {/* Header with Close Button */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  {/* Flame Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: 'rgba(220, 101, 52, 0.15)',
                      border: '1px solid rgba(220, 101, 52, 0.3)',
                    }}
                  >
                    <Flame
                      className="w-6 h-6"
                      style={{ color: 'var(--accent-orange)' }}
                      strokeWidth={2}
                    />
                  </div>

                  {/* Title */}
                  <h2
                    className="text-xl lg:text-2xl font-bold"
                    style={{ color: 'var(--text-primary)' }}
                  >Your journey
                  </h2>
                </div>

                {/* Close Button */}
                <button
                  ref={closeButtonRef}
                  onClick={() => setIsExpanded(false)}
                  className="p-2 rounded-lg transition-colors hover:bg-[var(--elevated-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-orange)]"
                  style={{ color: 'var(--text-muted)' }}
                  aria-label="Close Journey dialog"
                >
                  <X className="w-5 h-5" strokeWidth={2} />
                </button>
              </div>

              {!user ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Your journey starts here
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      Sign in to discover your interests, revisit your searches, save your favorite creations and continue exploring AnimeStop.
                    </p>
                  </div>

                  <div className="account-button-group">
                    <Link href="/login?view=signin" className="account-button account-button-primary" onClick={() => setIsExpanded(false)}>
                      SIGN IN
                    </Link>
                    <Link href="/login?view=create" className="account-button account-button-secondary" onClick={() => setIsExpanded(false)}>
                      CREATE ACCOUNT
                    </Link>
                  </div>
                </div>
              ) : loading ? (
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading your journey...</p>
              ) : error ? (
                <p className="text-sm" style={{ color: 'var(--accent-red)' }}>{error}</p>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Welcome back
                    </h3>
                    <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{displayName}</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Your interests
                      </h3>
                      <button type="button" className="auth-link" onClick={() => void setPaused(!preference.recordingPaused)}>
                        {preference.recordingPaused ? 'Resume Recording' : 'Pause Recording'}
                      </button>
                    </div>
                    {preference.recordingPaused ? (
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Journey activity recording is paused.</p>
                    ) : interests.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {interests.map((interest) => (
                          <span key={interest.label} className="stories-filter-pill" aria-label={`${interest.label} score ${interest.score}`}>
                            {interest.label}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Start searching, exploring and saving products to build your interests.</p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Recent searches
                      </h3>
                      {searches.length > 0 && <button type="button" className="auth-link" onClick={() => void clearSearches()}>Clear</button>}
                    </div>
                    <div className="space-y-2">
                      {searches.length === 0 ? (
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No searches recorded yet.</p>
                      ) : (
                        searches.slice(0, 6).map((search) => (
                          <div
                            key={search.id}
                            className="p-3 rounded-lg border transition-colors"
                            style={{
                              backgroundColor: 'var(--surface-secondary)',
                              borderColor: 'var(--border-color)',
                            }}
                          >
                            <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>{search.query}</p>
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{search.scope} · {search.updatedAt ? new Date(search.updatedAt).toLocaleString() : 'Recently'}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Recently explored
                      </h3>
                      {views.length > 0 && <button type="button" className="auth-link" onClick={() => void clearViews()}>Clear</button>}
                    </div>
                    <div className="space-y-2">
                      {views.length === 0 ? (
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Open a product page to build your journey.</p>
                      ) : (
                        continueExploring.slice(0, 4).map((product) => (
                          <Link
                            key={product.id}
                            href={`/builds/${product.buildSlug}`}
                            onClick={() => setIsExpanded(false)}
                            className="flex items-start justify-between gap-3 p-3 rounded-lg border transition-colors hover:border-[var(--accent-primary)]"
                            style={{
                              backgroundColor: 'var(--surface-secondary)',
                              borderColor: 'var(--border-color)',
                            }}
                          >
                            <div>
                              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{product.cardTitle || product.title}</p>
                              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{product.collectionKey.toUpperCase()} · {product.category}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent-orange)' }} strokeWidth={2} />
                          </Link>
                        ))
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Saved items
                    </h3>
                    <Link href="/account/saved" onClick={() => setIsExpanded(false)} className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--accent-orange)' }}>
                      View saved items
                      <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                    </Link>
                  </div>
                </div>
              )}

              {/* Spacer to push quote to bottom on desktop */}
              <div className="flex-grow lg:hidden" />

              {/* Inspirational Quote */}
              <blockquote className="mt-auto pt-6 border-t" style={{ borderColor: 'var(--border-card)' }}>
                <p
                  className="text-sm italic leading-relaxed mb-3"
                  style={{ color: 'var(--text-muted)' }}
                >
                  &ldquo;It&apos;s not about becoming someone great.
                  <br />
                  It&apos;s about being someone who never gives up.&rdquo;
                </p>
                <footer>
                  <cite
                    className="text-xs not-italic"
                    style={{ color: 'var(--text-muted)', opacity: 0.7 }}
                  >
                    — Naruto Uzumaki
                  </cite>
                </footer>
              </blockquote>
            </div>
          </div>
        </>
      )}
    </>
  );
}
