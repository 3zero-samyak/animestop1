'use client';

import React from 'react';
import Link from 'next/link';
import Container from '@/components/ui/Container';

export default function StoriesHero() {
  return (
    <section className="page-hero relative min-h-[600px] lg:min-h-[700px]" style={{ backgroundColor: 'var(--page-bg)' }} data-mode-image-container>
      {/* Background Image */}
      <div className="page-hero-media absolute inset-0 z-0" style={{ backgroundColor: 'var(--surface-secondary)' }} />
      
      {/* Gradient overlay for text readability */}
      <div className="page-hero-overlay media-overlay-left" aria-hidden="true" />

      <Container size="large" className="page-hero-content relative z-10 py-8 lg:py-12">
        {/* Breadcrumb Navigation */}
        <nav className="mb-8 lg:mb-12" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            <li>
              <Link 
                href="/" 
                className="hover:text-[var(--text-primary)] transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <span className="mx-2" aria-hidden="true">›</span>
            </li>
            <li style={{ color: 'var(--text-primary)' }} aria-current="page">
              Stories
            </li>
          </ol>
        </nav>

        {/* Main Hero Content */}
        <div className="min-h-[450px] lg:min-h-[500px] flex flex-col justify-center max-w-4xl media-content">
          {/* Stories Title */}
          <h1 
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl mb-6 lg:mb-8 font-stylish media-title"
          >
            Stories
          </h1>

          {/* Tagline */}
          <p 
            className="text-lg sm:text-xl lg:text-2xl mb-6 lg:mb-8 italic font-stylish leading-relaxed media-accent"
          >
            Relive the scenes that moved you.
            <br />
            Moments that will stay forever.
          </p>

          {/* Description */}
          <div 
            className="space-y-2 text-base sm:text-lg media-description"
          >
            <p>These are not just collectibles.</p>
            <p>They are pieces of your memories.</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
