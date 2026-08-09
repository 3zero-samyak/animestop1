'use client';

import React from 'react';
import ScrollReveal from '@/components/animation/ScrollReveal';

export default function HobbyDisclaimer() {
  return (
    <section className="about-section">
      <ScrollReveal>
        <div className="hobby-disclaimer">
          <h2 className="hobby-disclaimer-title">
            Fan-Inspired. Unofficial. Made with Love.
          </h2>

          <div className="hobby-disclaimer-content">
            <p>
              AnimeStop is an independent fan-inspired maker project.
            </p>

            <p>
              References to anime, manga, characters, scenes or titles are
              used to describe inspiration and creative context.
            </p>

            <p>
              AnimeStop is not affiliated with, endorsed by or officially
              connected to the respective copyright or trademark holders.
            </p>

            <p>
              Original interpretations and maker experiments are presented
              as part of a hobby-first creative archive.
            </p>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
