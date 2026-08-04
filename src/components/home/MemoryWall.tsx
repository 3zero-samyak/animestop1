'use client';

import React, { useRef } from 'react';
import Container from '@/components/ui/Container';
import { Heart, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const memories = [
  {
    id: 1,
    quote: "I still remember watching this scene with my brother. We didn't say a word. We just cried.",
  },
  {
    id: 2,
    quote: "This anime taught me that giving up is easy, but standing up again is true strength.",
  },
  {
    id: 3,
    quote: "A single episode changed the way I looked at my dreams.",
  },
  {
    id: 4,
    quote: "It wasn't just an anime. It was the reason I'm still here today.",
  },
  {
    id: 5,
    quote: "Some lessons aren't taught in school. They're shown in stories.",
  },
];

export default function MemoryWall() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newPosition = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 lg:py-20" style={{ backgroundColor: 'var(--page-bg)' }}>
      <Container size="large">
        {/* Section Header */}
        <div className="flex items-start justify-between mb-8 lg:mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h2 
                className="text-3xl lg:text-4xl font-bold"
                style={{ 
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-stylish)',
                  fontStyle: 'italic',
                }}
              >
                MEMORY WALL
              </h2>
              <Heart className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
            </div>
            <p 
              className="text-sm lg:text-base"
              style={{ color: 'var(--text-muted)' }}
            >
              Because every memory deserves a place.
            </p>
          </div>
          <button 
            className="hidden lg:flex items-center gap-2 text-sm transition-colors hover:opacity-80"
            style={{ color: 'var(--text-muted)' }}
          >
            Share your memory
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Memory Cards */}
        <div className="relative group/carousel">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all opacity-0 group-hover/carousel:opacity-100 hover:scale-110"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'var(--text-primary)',
            }}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Cards Container */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {memories.map((memory) => (
              <div
                key={memory.id}
                className="flex-shrink-0 w-[320px] lg:w-[380px] rounded-xl p-8 transition-all duration-300 hover:scale-[1.02]"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                {/* Quote Badge */}
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center mb-6"
                  style={{
                    backgroundColor: 'rgba(220, 101, 52, 0.15)',
                  }}
                >
                  <Heart className="w-5 h-5" style={{ color: 'var(--accent-orange)' }} />
                </div>
                
                {/* Quote Text */}
                <blockquote className="mb-6">
                  <p 
                    className="text-lg lg:text-xl leading-relaxed"
                    style={{ 
                      color: 'var(--text-primary)',
                      fontStyle: 'italic',
                    }}
                  >
                    &ldquo;{memory.quote}&rdquo;
                  </p>
                </blockquote>
                
                {/* Author */}
                <p 
                  className="text-sm"
                  style={{ 
                    color: 'var(--accent-orange)',
                    fontStyle: 'italic',
                  }}
                >
                  — From a fan
                </p>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all opacity-0 group-hover/carousel:opacity-100 hover:scale-110"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'var(--text-primary)',
            }}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </Container>
    </section>
  );
}
