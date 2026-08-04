import React from 'react';
import Link from 'next/link';
import { ArrowRight, Bookmark } from 'lucide-react';

export interface StoryCardData {
  id: string;
  anime: string;
  title: string;
  quote: string;
  image: string;
  href: string;
}

interface StoryCardProps {
  story: StoryCardData;
}

export default function StoryCard({ story }: StoryCardProps) {
  const [isBookmarked, setIsBookmarked] = React.useState(false);

  return (
    <article 
      className="story-card group"
      data-mode-image-container
    >
      {/* Background Image */}
      <div 
        className="story-card-media mode-sensitive-background"
        data-mode-sensitive-background="true"
        style={{
          backgroundColor: 'var(--surface-secondary)',
        }}
      />

      {/* Gradient Overlay */}
      <div className="story-card-overlay media-overlay-card" aria-hidden="true" />

      {/* Content */}
      <div className="story-card-content media-content">
        {/* Header with anime name and bookmark */}
        <div className="story-card-header">
          <h3 className="story-card-anime">
            {story.anime}
          </h3>
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsBookmarked(!isBookmarked);
            }}
            className="story-card-bookmark"
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            style={{
              color: isBookmarked ? 'var(--accent-primary)' : 'var(--media-text-secondary)',
            }}
          >
            <Bookmark 
              size={20} 
              strokeWidth={2}
              fill={isBookmarked ? 'currentColor' : 'none'}
            />
          </button>
        </div>

        {/* Title */}
        <h2 className="story-card-title">
          {story.title}
        </h2>

        {/* Quote */}
        <p className="story-card-quote">
          {story.quote}
        </p>

        {/* Action Button */}
        <Link 
          href={story.href}
          className="story-card-action"
        >
          <span>Explore More</span>
          <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
        </Link>
      </div>
    </article>
  );
}
