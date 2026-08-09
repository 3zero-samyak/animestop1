'use client';

import React from 'react';
import ScrollReveal from '@/components/animation/ScrollReveal';
import { Check } from 'lucide-react';

export default function AnimeMangaModes() {
  return (
    <section className="about-section">
      <ScrollReveal>
        <h2 className="about-section-title">Experience AnimeStop</h2>
      </ScrollReveal>

      <div className="mode-split-grid">
        <ScrollReveal delay={100} direction="left" distance={35}>
          <div className="mode-panel mode-panel-anime">
            <h3 className="mode-panel-title">Anime Mode</h3>
            <p className="mode-panel-subtitle">Colorful & Cinematic</p>

            <p className="mode-panel-description">
              Finished builds, painted reveals, glowing highlights and
              display-ready concepts.
            </p>

            <p className="mode-panel-description">
              Anime Mode shows the polished side — where ideas feel closest
              to a fight-scene impact or a collector-shelf moment.
            </p>

            <ul className="mode-panel-list">
              <li><Check size={18} /> Color gradients + glow effects</li>
              <li><Check size={18} /> Finished painted builds</li>
              <li><Check size={18} /> Cinematic display concepts</li>
            </ul>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100} direction="right" distance={35}>
          <div className="mode-panel mode-panel-manga">
            <h3 className="mode-panel-title">Manga Mode</h3>
            <p className="mode-panel-subtitle">Process & Panels</p>

            <p className="mode-panel-description">
              Black-and-white process panels, sketches, halftone textures and
              behind-the-build notes.
            </p>

            <p className="mode-panel-description">
              Manga Mode shows the rougher, honest side — failures,
              experiments and chapter-style storytelling.
            </p>

            <ul className="mode-panel-list">
              <li><Check size={18} /> Panel borders + halftone dots</li>
              <li><Check size={18} /> Sketch + WIP breakdowns</li>
              <li><Check size={18} /> Chapter-style process notes</li>
            </ul>
          </div>
        </ScrollReveal>
      </div>

      <ScrollReveal delay={200}>
        <div className="mode-disclaimer">
          Fan-inspired maker project · Unofficial ·
          Not affiliated with any anime or manga rights holder
        </div>
      </ScrollReveal>
    </section>
  );
}
