import React from 'react';
import { MessageCircle, Lightbulb, Users, Sparkles } from 'lucide-react';

const features = [
  { icon: MessageCircle, text: 'Talk about your favorite moments' },
  { icon: Lightbulb, text: 'Share your theories & what ifs' },
  { icon: Users, text: 'Connect with true anime fans' },
  { icon: Sparkles, text: 'Be part of something bigger' },
];

export default function CircleSection() {
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
          THE CIRCLE
        </h2>
        
        <p 
          className="text-sm lg:text-base media-description"
        >
          A community that feels like home.
        </p>
        
        {/* Features List */}
        <div className="space-y-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex items-center gap-3">
                <div 
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                  }}
                >
                  <Icon 
                    className="w-4 h-4" 
                    style={{ 
                      color: 'var(--image-text-secondary)',
                    }} 
                  />
                </div>
                <span 
                  className="text-sm lg:text-base media-description"
                >
                  {feature.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </article>
  );
}
