import React from 'react';
import Container from '@/components/ui/Container';
import { Palette, FileText } from 'lucide-react';

export default function WhatIsAnimeStop() {
  return (
    <section className="what-is-section">
      <Container size="large" className="what-is-container">
        {/* Introduction */}
        <div className="what-is-intro">
          <p className="what-is-intro-text">
            AnimeStop is not a traditional shop. It is a fan-inspired maker archive created for anime and manga lovers who enjoy physical displays, miniatures, dioramas, desk pieces, wall art, and behind-the-scenes build stories.
          </p>
          <p className="what-is-intro-text">
            We explore the feeling of anime and manga through original forms, scene-inspired compositions, 3D printing, painting, and maker experiments. Some ideas may be discussed as custom concepts, but the site is designed as a hobby-first creative archive — not an official merchandise store.
          </p>
        </div>

        {/* Mode Panels Grid */}
        <div className="what-is-mode-grid">
          {/* Anime Mode Panel */}
          <div className="what-is-mode-panel">
            <div className="what-is-mode-icon">
              <Palette className="w-6 h-6" />
            </div>
            <div className="what-is-mode-badge">ANIME MODE</div>
            <h3 className="what-is-mode-title">COLORFUL & CINEMATIC</h3>
            <p className="what-is-mode-desc">
              Finished builds, painted reveals, glowing highlights, and display-ready concepts. Anime Mode shows the polished side — where ideas feel closest to a fight-scene impact or a collector shelf moment.
            </p>
            <ul className="what-is-mode-list">
              <li>COLOR GRADIENTS + GLOW EFFECTS</li>
              <li>FINISHED PAINTED BUILDS</li>
              <li>CINEMATIC DISPLAY CONCEPTS</li>
            </ul>
          </div>

          {/* Manga Mode Panel */}
          <div className="what-is-mode-panel">
            <div className="what-is-mode-icon">
              <FileText className="w-6 h-6" />
            </div>
            <div className="what-is-mode-badge">MANGA MODE</div>
            <h3 className="what-is-mode-title">PROCESS & PANELS</h3>
            <p className="what-is-mode-desc">
              Black-and-white process panels, sketches, halftone textures, and behind-the-build notes. Manga Mode shows the rougher, honest side — failures, experiments, and chapter-style storytelling.
            </p>
            <ul className="what-is-mode-list">
              <li>PANEL BORDERS + HALFTONE DOTS</li>
              <li>SKETCH + WIP BREAKDOWNS</li>
              <li>CHAPTER-STYLE PROCESS NOTES</li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="what-is-disclaimer">
          Fan-inspired maker project · unofficial · not affiliated with any anime or manga rights holder
        </div>
      </Container>
    </section>
  );
}
