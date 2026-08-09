'use client';

import React from 'react';
import ScrollReveal from '@/components/animation/ScrollReveal';

export default function WhatIsAnimeStop() {
  return (
    <section className="about-section">
      <ScrollReveal>
        <h2 className="about-section-title">What Is AnimeStop?</h2>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div className="about-section-content">
          <p className="about-section-text">
            AnimeStop is not a traditional shop.
          </p>

          <p className="about-section-text">
            It is a fan-inspired maker archive created for anime and manga
            lovers who enjoy physical displays, miniatures, dioramas,
            desk pieces, wall art and behind-the-scenes build stories.
          </p>

          <p className="about-section-text">
            We explore the feeling of anime and manga through original
            forms, scene-inspired compositions, 3D printing, painting and
            maker experiments.
          </p>

          <p className="about-section-text">
            Some ideas may be discussed as custom concepts, but the site is
            designed as a hobby-first creative archive — not an official
            merchandise store.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
