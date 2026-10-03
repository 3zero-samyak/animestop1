'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import CollectionBrowser from '@/components/collections/CollectionBrowser';
import { storiesCollectionConfig } from '@/lib/collectionConfigs';

export default function StoriesShowcase() {
  return (
    <section
      className="stories-showcase"
      aria-labelledby="stories-showcase-title"
    >
      <div className="stories-showcase-container">
        {/* Section Header */}
        <header className="stories-showcase-header">
          <p className="stories-showcase-eyebrow">Stories</p>
          <h2 id="stories-showcase-heading" className="stories-showcase-heading">
            Moments that stay with us.
          </h2>
          <p className="stories-showcase-subcopy">
            Fan-inspired anime and manga display concepts — dioramas, busts, shadow boxes, wall reliefs, and prop collections. Original interpretations, not official merchandise.
          </p>
          <p className="stories-showcase-disclaimer">
            Unofficial fan-inspired maker project · Not affiliated with any anime, manga, studio, publisher, or rights holder.
          </p>
        </header>

        <CollectionBrowser
          config={storiesCollectionConfig}
          filterBarClassName="stories-filter-bar"
          filterPillClassName="stories-filter-pill"
          gridClassName="stories-showcase-grid"
          actionClassName="stories-showcase-action"
          actionLinkClassName="stories-showcase-all-link"
        />

        <div className="stories-showcase-action">
          <Link href="/stories" className="stories-showcase-all-link">
            Explore All Stories
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}
