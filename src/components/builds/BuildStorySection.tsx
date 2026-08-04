'use client';

import React from 'react';
import type { BuildDetail } from '@/data/builds';

export default function BuildStorySection({ build }: { build: BuildDetail }) {
  return (
    <section className="build-story-section">
      <h2>THE STORY BEHIND THIS BUILD</h2>
      <div className="build-story-grid">
        <div className="build-story-copy">
          {(build.storyParagraphs || [build.fullDescription]).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="build-story-visual">
          {/* visual handled in BuildDetailPage */}
        </div>
      </div>
    </section>
  );
}
