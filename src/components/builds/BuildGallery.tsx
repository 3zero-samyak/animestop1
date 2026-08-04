'use client';

import React, { useState } from 'react';
import ModeImage from '@/components/media/ModeImage';
import type { BuildDetail } from '@/data/builds';

export default function BuildGallery({ build }: { build: BuildDetail }) {
  const images = build.gallery || (build.image ? [{ src: build.image, alt: build.imageAlt }] : []);
  const [activeIndex, setActiveIndex] = useState(0);

  const active = images[activeIndex];

  return (
    <div className="build-gallery">
      {images.length > 0 && (
        <div className="build-gallery-thumbnails" role="tablist" aria-label="Gallery thumbnails">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              className={`build-gallery-thumbnail ${idx === activeIndex ? 'is-active' : ''}`}
              onClick={() => setActiveIndex(idx)}
              aria-pressed={idx === activeIndex}
              aria-label={`View image ${idx + 1}`}
            >
              {img.src ? <ModeImage src={img.src!} alt={img.alt ?? ''} fill /> : <div className="build-gallery-empty-thumb" aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}

      <div className="build-gallery-display">
        {active && active.src ? (
          <ModeImage src={active.src} alt={active.alt || build.title} fill data-mode-exempt="true" />
        ) : (
          <div className="build-gallery-empty-display" aria-hidden="true" />
        )}
      </div>
    </div>
  );
}
