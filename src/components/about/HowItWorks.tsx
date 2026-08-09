'use client';

import React, { useEffect, useRef, useState } from 'react';
import ScrollReveal from '@/components/animation/ScrollReveal';
import { Lightbulb, PenTool, Box, Layers, Printer, Wrench, Palette, Sparkles } from 'lucide-react';

const steps = [
  { id: 1, title: 'Idea / Brief', description: 'You share your vision with us.', Icon: Lightbulb },
  { id: 2, title: '2D Sketch', description: 'We create concept art.', Icon: PenTool },
  { id: 3, title: '3D Model', description: 'Digital sculpting begins.', Icon: Box },
  { id: 4, title: 'Slicing', description: 'Print planning & preparation.', Icon: Layers },
  { id: 5, title: '3D Print', description: 'Bringing it to life.', Icon: Printer },
  { id: 6, title: 'Post-Process', description: 'Cleaning & assembly.', Icon: Wrench },
  { id: 7, title: 'Painting', description: 'Color & finishing.', Icon: Palette },
  { id: 8, title: 'Final Build', description: 'The finished idea comes together.', Icon: Sparkles },
];

export default function HowItWorks() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -8% 0px',
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="about-section">
      <ScrollReveal>
        <h2 className="about-section-title">How It Works</h2>
        <p className="about-section-subtitle">
          From an idea to a finished build — our creative journey.
        </p>
      </ScrollReveal>

      <div ref={ref} className="timeline-container">
        <div 
          className="timeline-line"
          style={{
            transform: isVisible ? 'scaleX(1)' : 'scaleX(0)',
            transition: 'transform 1000ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />

        <div className="timeline-steps">
          {steps.map((step, index) => {
            const Icon = step.Icon;
            return (
              <div
                key={step.id}
                className="timeline-step"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
                  transition: `opacity 650ms cubic-bezier(0.22, 1, 0.36, 1) ${index * 90}ms, transform 650ms cubic-bezier(0.22, 1, 0.36, 1) ${index * 90}ms`,
                }}
              >
                <div className="timeline-step-icon">
                  <Icon size={20} />
                </div>
                <div className="timeline-step-number">{step.id}</div>
                <h4 className="timeline-step-title">{step.title}</h4>
                <p className="timeline-step-description">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
