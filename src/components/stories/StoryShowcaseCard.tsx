'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Bookmark } from 'lucide-react';
import ModeImage from '@/components/media/ModeImage';

export interface StoryShowcaseData {
  id: string;
  anime: string;
  title: string;
  quote: string;
  image: string;
  href: string;
  accent?: string;
}

interface StoryShowcaseCardProps {
  story: StoryShowcaseData;
  featured?: boolean;
  compact?: boolean;
}

export default function StoryShowcaseCard({ 
  story, 
  featured = false, 
  compact = false 
}: StoryShowcaseCardProps) {
  const cardClassName = [
    'stories-showcase-card',
    featured && 'stories-showcase-card--featured',
    compact && 'stories-showcase-card--compact',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <article
      className={cardClassName}
      data-mode-image-container
      style={{
        '--story-accent': story.accent || 'var(--accent-primary)',
      } as React.CSSProperties}
    >
      <Link href={story.href} className="stories-showcase-card-link">
        {/* Background Image */}
        <div className="stories-showcase-media">
          {story.image ? (
            <ModeImage
              src={story.image}
              alt={story.title}
              fill
              sizes={
                featured
                  ? '(max-width: 800px) 100vw, (max-width: 1400px) 45vw, 40vw'
                  : compact
                  ? '(max-width: 800px) 100vw, (max-width: 1400px) 25vw, 20vw'
                  : '(max-width: 800px) 100vw, (max-width: 1400px) 30vw, 25vw'
              }
              className="stories-showcase-image"
            />
          ) : (
            <div
              className="stories-showcase-image"
              style={{ 
                backgroundColor: 'var(--surface-secondary)',
                width: '100%',
                height: '100%'
              }}
            />
          )}
        </div>

        {/* Gradient Overlay */}
        <div className="stories-showcase-overlay" aria-hidden="true" />

        {/* Content */}
        <div className="stories-showcase-content">
          {/* Top Row - Anime Name and Bookmark */}
          <div className="stories-showcase-top">
            <span className="stories-showcase-anime">
              {story.anime}
            </span>
            <Bookmark
              size={20}
              strokeWidth={2}
              className="stories-showcase-bookmark"
              aria-hidden="true"
            />
          </div>

          {/* Copy - Title, Quote, CTA */}
          <div className="stories-showcase-copy">
            <h3 className="stories-showcase-title">{story.title}</h3>
            <p className="stories-showcase-quote">{story.quote}</p>

            <span className="stories-showcase-card-action">
              Explore More
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
