'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, ArrowRight, X } from 'lucide-react';
import { getSearchHistory } from '@/lib/demoSession';

export default function GlobalJourney() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searches, setSearches] = useState<Array<{query:string; at:string}>>(() => {
    try {
      return getSearchHistory().slice(0, 8);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const onSearch = (e: Event) => {
      try {
        const detail = (e as CustomEvent)?.detail as { query: string; at: string } | undefined;
        if (detail) setSearches((s) => [detail, ...s].slice(0, 8));
      } catch {}
    };

    window.addEventListener('animestop:search', onSearch as EventListener);
    return () => window.removeEventListener('animestop:search', onSearch as EventListener);
  }, []);

  // Journey data (demo - could be from context/store in production)
  const currentAnime = 'One Piece';
  const currentStep = 2;
  const totalSteps = 5;

  return (
    <>
      {/* Collapsed State - Floating Button */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="global-journey-toggle fixed right-6 bottom-6 lg:right-8 lg:bottom-8 flex items-center gap-3 px-4 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_30px_rgb(220,101,52,0.4)] group"
          style={{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-card)',
            zIndex: 900,
          }}
          aria-label="Open Your Journey"
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

      {/* Expanded State - Full Panel */}
      {isExpanded && (
        <>
          {/* Backdrop Overlay (mobile only) */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm lg:hidden"
            style={{ zIndex: 1060 }}
            onClick={() => setIsExpanded(false)}
            aria-hidden="true"
          />

          {/* Journey Panel */}
          <div
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[380px] lg:w-[400px] lg:right-8 lg:top-24 lg:bottom-auto lg:rounded-2xl shadow-2xl lg:max-h-[calc(100vh-120px)] overflow-y-auto"
            style={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-card)',
              zIndex: 1070,
            }}
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
                  >
                    Your Journey
                  </h2>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-2 rounded-lg transition-colors hover:bg-[var(--elevated-bg)]"
                  style={{ color: 'var(--text-muted)' }}
                  aria-label="Close Journey panel"
                >
                  <X className="w-5 h-5" strokeWidth={2} />
                </button>
              </div>

              {/* 'Continue exploring' removed as requested */}

              {/* Current anime link */}
              <Link
                href={`/stories/${currentAnime.toLowerCase().replace(/\s+/g, '-')}`}
                className="inline-flex items-center gap-2 text-base font-medium mb-6 group transition-colors hover:text-[var(--accent-orange-light)] w-fit"
                style={{ color: 'var(--accent-orange)' }}
                onClick={() => setIsExpanded(false)}
              >
                <span>{currentAnime}</span>
                <ArrowRight 
                  className="w-4 h-4 transition-transform group-hover:translate-x-1" 
                  strokeWidth={2.5}
                />
              </Link>

              {/* Progress Dots */}
              <div className="flex items-center gap-3 mb-8">
                {Array.from({ length: totalSteps }).map((_, index) => (
                  <div
                    key={index}
                    className="h-1 flex-1 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: index < currentStep 
                        ? 'var(--accent-orange)' 
                        : 'rgba(255, 255, 255, 0.15)',
                    }}
                  />
                ))}
              </div>

              {/* Search Tracker (shows when user has searches) */}
              <div className="mb-8">
                <h3 
                    className="text-xs font-semibold uppercase tracking-wider mb-4"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Recent Searches
                  </h3>

                  {/* Orange dashed progress line — visible when there are searches */}
                  {searches.length > 0 && (
                    <div className="journey-search-line-wrapper">
                      <div
                        className="journey-search-line"
                        style={{
                          // scale from 0 to 1 depending on number of searches (max 8)
                          ['--search-scale' as unknown as string]: Math.min(1, searches.length / 8).toString(),
                        } as React.CSSProperties}
                        aria-hidden
                      />
                    </div>
                  )}
                <div className="space-y-3">
                  {searches.length === 0 && (
                    <div className="text-xs text-[var(--text-muted)]">No recent searches</div>
                  )}
                  {searches.map((s, idx) => (
                    <div key={idx} className="p-3 rounded-lg transition-colors bg-transparent" onClick={() => setIsExpanded(false)}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>{s.query}</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{new Date(s.at).toLocaleString()}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent-orange)' }} strokeWidth={2} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

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

