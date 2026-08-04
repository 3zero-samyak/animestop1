import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';

const steps = [
  'Share a scene, emotion or lesson',
  'We discuss it with you',
  'If we love it, we\'ll build it',
  'You can own it or choose to let it be part of the AnimeStop Collection',
];

export default function StorySubmission() {
  return (
    <article className="community-panel group cursor-pointer" data-mode-image-container>
      {/* Media layer */}
      <div className="community-panel-media" style={{ backgroundColor: 'var(--surface-secondary)' }} />

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
        >
          HAVE A STORY?
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
                className="flex-shrink-0 w-5 h-5 mt-0.5" 
                style={{ 
                  color: 'var(--image-text-secondary)',
                  textShadow: 'var(--image-text-shadow)',
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
        
        {/* Button */}
        <button
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 hover:gap-3 w-fit button"
          style={{
            border: '1px solid var(--accent-orange)',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <span className="text-sm font-medium">Share Your Story</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </article>
  );
}
