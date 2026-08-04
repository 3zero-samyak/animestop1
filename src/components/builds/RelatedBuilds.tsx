'use client';

import React from 'react';
import type { BuildDetail } from '@/data/builds';
import { getRelatedBuilds } from '@/data/builds';
import ProductCard from '@/components/products/ProductCard';

export default function RelatedBuilds({ currentBuild }: { currentBuild: BuildDetail }) {
  const relatedBuilds = getRelatedBuilds(currentBuild, 4);

  if (relatedBuilds.length === 0) {
    return null;
  }

  const heading = currentBuild.category === 'stories' 
    ? 'MORE STORIES THAT STAY WITH YOU'
    : 'MORE BUILDS THAT MAY STAY WITH YOU';

  return (
    <section className="related-builds-section">
      <h2 className="build-section-heading">{heading}</h2>
      <div className="related-builds-grid">
        {relatedBuilds.map((build) => (
          <ProductCard
            key={build.id}
            product={{
              id: build.id,
              category: build.collectionLabel || build.categoryLabel,
              title: build.title,
              cardTitle: build.title,
              shortDescription: build.shortDescription,
              fullDescription: build.fullDescription,
              inspiration: '',
              image: build.image || '',
              imageAlt: build.imageAlt || build.title,
              size: '',
              materials: '',
              finish: '',
              tags: [],
              disclaimer: '',
              requestHref: build.requestHref || '/contact',
              requestLabel: 'Explore More',
              accent: '#e76534',
            }}
          />
        ))}
      </div>
    </section>
  );
}
