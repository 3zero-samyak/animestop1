'use client';

import React from 'react';
import Link from 'next/link';
import type { BuildDetail } from '@/data/builds';

export default function BuildStoryTextSection({ build }: { build: BuildDetail }) {
  const paragraphs = build.storyParagraphs || [build.fullDescription];
  
  // Generate category link
  const categoryRoute = `/${build.category}`;
  const categoryName = build.franchiseLabel || build.categoryLabel;

  return (
    <section className="build-story-section">
      <div className="build-story-container">
        <h2 className="build-section-heading">THE STORY BEHIND THIS BUILD</h2>
        
        <div className="build-story-content">
          {paragraphs.map((paragraph, i) => (
            <p key={i} className="build-story-paragraph">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="build-story-actions">
          <Link href="/journal" className="build-story-link">
            Read The Full Story →
          </Link>
          <Link href={categoryRoute} className="build-story-link">
            Explore {categoryName} Collection →
          </Link>
        </div>
      </div>
    </section>
  );
}
