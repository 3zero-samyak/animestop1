'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, ArrowRight } from 'lucide-react';

export default function YourJourneyCard() {
  // Progress tracker state (for demo - could be dynamic in production)
  const currentStep = 2;
  const totalSteps = 5;

  return (
    <div 
      className="rounded-2xl p-6 lg:p-8 h-full flex flex-col"
      style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border-card)',
      }}
    >
      {/* Flame Icon */}
      <div className="mb-4">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{
            backgroundColor: 'rgba(220, 101, 52, 0.15)',
            border: '1px solid rgba(220, 101, 52, 0.3)',
          }}
        >
          <Flame 
            className="w-6 h-6" 
            style={{ color: 'var(--accent-orange)' }}
            strokeWidth={2}
          />
        </div>
      </div>

      {/* Title */}
      <h2 
        className="text-xl lg:text-2xl font-bold mb-2"
        style={{ color: 'var(--text-primary)' }}
      >
        Your Journey
      </h2>

      {/* 'Continue exploring' removed per request */}

      {/* Current anime link */}
      <Link
        href="/stories/one-piece"
        className="inline-flex items-center gap-2 text-base font-medium mb-6 group transition-colors hover:text-[var(--accent-orange-light)]"
        style={{ color: 'var(--accent-orange)' }}
      >
        <span>One Piece</span>
        <ArrowRight 
          className="w-4 h-4 transition-transform group-hover:translate-x-1" 
          strokeWidth={2.5}
        />
      </Link>

      {/* Progress Dots */}
      <div className="flex items-center gap-3 mb-8">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{
              backgroundColor: index < currentStep 
                ? 'var(--accent-orange)' 
                : 'rgba(255, 255, 255, 0.15)',
            }}
          />
        ))}
      </div>

      {/* Spacer to push quote to bottom */}
      <div className="flex-grow" />

      {/* Inspirational Quote */}
      <blockquote className="mt-auto">
        <p 
          className="text-sm italic leading-relaxed mb-3"
          style={{ color: 'var(--text-muted)' }}
        >
          &ldquo;It&apos;s not about becoming someone great.
          <br />
          It&apos;s about being someone who never gives up.&rdquo;
        </p>
        <footer>
          <cite 
            className="text-xs not-italic"
            style={{ color: 'var(--text-muted)', opacity: 0.7 }}
          >
            — Naruto Uzumaki
          </cite>
        </footer>
      </blockquote>
    </div>
  );
}
