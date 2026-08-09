'use client';

import React from 'react';
import ScrollReveal from '@/components/animation/ScrollReveal';

export default function AboutHero() {
  return (
    <section className="about-hero">
      <div className="about-hero-inner">
        <ScrollReveal delay={0}>
          <h1 className="about-hero-title">About AnimeStop</h1>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <p className="about-hero-tagline">
            Fan-inspired.<br />
            Maker-driven.<br />
            Built by anime fans, for anime fans.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <p className="about-hero-description">
            AnimeStop is a creative maker archive inspired by the moments,
            stories and worlds that stay with us long after an episode ends.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={300}>
          <p className="about-hero-description">
            We explore those memories through physical concepts,
            miniatures, displays, dioramas, art, experiments and
            behind-the-build stories.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
