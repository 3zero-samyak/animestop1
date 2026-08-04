'use client';

import React from 'react';
import type { BuildDetail } from '@/data/builds';
import ModeImage from '@/components/media/ModeImage';

export default function BuildSpecificationSection({ build }: { build: BuildDetail }) {
  const specs = build.specifications || [];
  const mediaItems = build.media || [];

  return (
    <section className="build-specification-section">
      <div className="build-specification-container">
        <h2 className="build-section-heading">THE BUILD</h2>

        {specs.length > 0 && (
          <div className="build-specification-grid">
            {specs.map((spec) => (
              <div key={spec.label} className="build-spec-item">
                <strong className="build-spec-label">{spec.label}</strong>
                <span className="build-spec-value">{spec.value}</span>
              </div>
            ))}
          </div>
        )}

        {mediaItems.length > 0 && (
          <div className="build-media-strip">
            {mediaItems.slice(0, 5).map((item) => (
              <div key={item.id} className="build-media-tile">
                {item.src ? (
                  item.type === 'video' ? (
                    <video
                      src={item.src}
                      poster={item.poster}
                      className="build-media-video"
                      aria-label={item.label}
                    >
                      <track kind="captions" />
                    </video>
                  ) : (
                    <ModeImage
                      src={item.src}
                      alt={item.alt || item.label}
                      fill
                      sizes="(max-width: 700px) 100vw, (max-width: 1200px) 20vw, 240px"
                    />
                  )
                ) : (
                  <div
                    className={`build-media-empty build-media-empty--${build.category}`}
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <p className="build-spec-caption">
          Every build is handcrafted with precision, patience and purpose.
        </p>
      </div>
    </section>
  );
}
