'use client';

import React from 'react';
import ScrollReveal from '@/components/animation/ScrollReveal';
import Link from 'next/link';

export default function JournalHero() {
  return (
    <section className="journal-hero" role="region" aria-label="Journal hero">
      <div className="journal-hero-inner">
        <ScrollReveal>
          <p className="section-kicker">Notes from our little universe</p>
          <h1 className="journal-hero-title">The journal</h1>
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <h2 className="journal-hero-sub">A few thoughts.<br/>A thousand little inspirations.</h2>
        </ScrollReveal>

        <ScrollReveal delay={160}>
          <p className="journal-hero-lead">Dive into heartfelt journals, behind-the-scenes stories, creator notes, reflections and ideas from the world of AnimeStop.</p>
        </ScrollReveal>

        <ScrollReveal delay={240}>
          <div className="journal-hero-cta">
            <Link href="/journal/write" className="journal-write-button" aria-label="Write your journal">
              Write your journal →
            </Link>
          </div>
        </ScrollReveal>
      </div>

      <div className="journal-hero-visual" aria-hidden="true"><span className="journal-visual-label">Stories from the other side of the screen.</span></div>
    </section>
  );
}
