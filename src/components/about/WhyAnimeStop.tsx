'use client';

import React from 'react';
import ScrollReveal from '@/components/animation/ScrollReveal';
import { BookOpen, Hammer, Heart, FileText } from 'lucide-react';

const reasons = [
  {
    id: 'story',
    title: 'Story First',
    description: 'A build begins with a moment, feeling or idea — not with a product catalogue.',
    Icon: BookOpen,
  },
  {
    id: 'maker',
    title: 'Maker Mindset',
    description: 'Sketching, modelling, printing, painting and experimentation are part of the story.',
    Icon: Hammer,
  },
  {
    id: 'fan',
    title: 'Fan Perspective',
    description: 'The archive is built around the details and memories anime fans actually care about.',
    Icon: Heart,
  },
  {
    id: 'process',
    title: 'Process Matters',
    description: 'Finished pieces matter, but the sketches, mistakes and experiments behind them matter too.',
    Icon: FileText,
  },
];

export default function WhyAnimeStop() {
  return (
    <section className="about-section">
      <ScrollReveal>
        <h2 className="about-section-title">Why AnimeStop Exists</h2>
      </ScrollReveal>

      <div className="why-grid">
        {reasons.map((reason, index) => {
          const Icon = reason.Icon;
          return (
            <ScrollReveal key={reason.id} delay={index * 100}>
              <div className="why-card">
                <div className="why-card-icon">
                  <Icon size={24} />
                </div>
                <h3 className="why-card-title">{reason.title}</h3>
                <p className="why-card-description">{reason.description}</p>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
