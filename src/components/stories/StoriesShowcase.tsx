'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Filter } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import { storiesProducts } from '@/data/products/stories';

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

        {/* Filter Pills (All Stories, One Piece, Naruto, etc.) */}
        <div className="stories-filter-bar" role="toolbar" aria-label="Stories filters">
          {[
            'All Stories',
            'One Piece',
            'Naruto',
            'Attack on Titan',
            'Demon Slayer',
            'Jujutsu Kaisen',
            'Bleach',
            'Filter',
          ].map((label) => (
            <button
              key={label}
              type="button"
              className="stories-filter-pill"
              aria-pressed={label === 'All Stories'}
            >
              {label === 'Filter' ? <Filter className="w-4 h-4" /> : label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="stories-showcase-grid">
          {storiesProducts.map((story, i) => (
            <div
              key={story.id}
              className={`product-grid-item ${i === 8 ? 'product-grid-item--span-full' : ''}`}
            >
              <ProductCard product={story} />
            </div>
          ))}
        </div>

        {/* Explore All CTA */}
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
