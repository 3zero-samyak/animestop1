import React from 'react';
import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';

const steps = [
  'Share a scene, emotion or lesson',
  'We discuss it with you',
  'If we love it, we\'ll build it',
  'You can own it or choose to let it be part of the AnimeStop Collection',
];

export default function StorySubmission() {
  return (
    <Link href="/share-story" className="community-panel group cursor-pointer" data-mode-image-container>
      {/* Media layer using existing artwork */}
      <div 
        className="community-panel-media mode-sensitive-background" 
        data-mode-sensitive-background="true"
        style={{ 
          backgroundColor: 'var(--surface-secondary)',
          backgroundImage: 'url(/images/hero/have%20a%20story-image.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} 
      />

      {/* Gradient Overlay */}
      <div className="community-panel-overlay media-overlay-card" aria-hidden="true" />

      {/* Content */}
      <div className="community-panel-content media-content">
        <h2 
          className="text-4xl lg:text-5xl font-bold media-title"
          style={{ 
            fontFamily: 'var(--font-stylish)',
            fontStyle: 'italic',
          }}
        >Have a story?
        </h2>
        
        <p 
          className="text-sm lg:text-base media-description"
        >
          The next build could be yours.
        </p>
        
        {/* Steps List */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle 
                className="w-5 h-5 flex-shrink-0 mt-0.5" 
                style={{ 
                  color: 'var(--accent-orange)',
                }} 
              />
              <span 
                className="text-sm lg:text-base media-description"
              >
                {step}
              </span>
            </div>
          ))}
        </div>
        
        {/* CTA Button */}
        <div className="pt-2">
          <span 
            className="inline-flex items-center gap-2 text-sm lg:text-base font-semibold group-hover:gap-3 transition-all media-cta"
            style={{ 
              color: 'var(--accent-orange)',
            }}
          >
            Tell us your story
            <ArrowRight className="w-5 h-5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
