'use client';

import React, { useEffect, useState } from 'react';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { ChevronDown, Search } from 'lucide-react';

const HERO_IMAGES: string[] = [];

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesReady, setImagesReady] = useState(false);

  useEffect(() => {
    // Preload images
    const preloadImages = async () => {
      const imagePromises = HERO_IMAGES.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = src;
        });
      });
      
      try {
        await Promise.all(imagePromises);
        setImagesReady(true);
      } catch {
        console.log('Hero images loading...');
      }
    };
    
    preloadImages();
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="page-hero relative" style={{ backgroundColor: 'var(--background)' }} data-mode-image-container>
      {/* Full-Width Background Slideshow */}
      <div className="page-hero-media absolute inset-0 z-0" aria-hidden="true">
        {HERO_IMAGES.map((image, index) => (
          <div
            key={image}
            className="absolute inset-0 transition-opacity duration-1000 mode-sensitive-background"
            data-mode-sensitive-background="true"
            style={{
              opacity: imagesReady && currentImageIndex === index ? 1 : 0,
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
        ))}
        {/* Fallback gradient */}
        {!imagesReady && (
          <div 
            className="absolute inset-0 bg-gradient-to-br"
            style={{
              backgroundColor: 'var(--surface-primary)',
            }}
          />
        )}
      </div>

      {/* Dark overlay for text readability */}
      <div className="page-hero-overlay media-overlay-left" />

      {/* Hero Main Content */}
      <div className="page-hero-content relative z-10">
        <Container size="large" className="page-hero-inner">
          <div className="page-hero-copy">
            {/* Quote Mark */}
            <div className="page-hero-quote-mark media-accent" aria-hidden="true">&ldquo;</div>

            {/* Quote - explicit line grouping */}
            <blockquote className="page-hero-quote">
              <span>Some stories never end.</span>
              <span>They just become</span>
              <span>part of us.</span>
            </blockquote>

            {/* Attribution */}
            <div className="page-hero-attribution">— AnimeStop</div>

            {/* Supporting Text */}
            <p className="page-hero-supporting">We build those moments.</p>

            {/* CTA Button */}
            <div className="page-hero-cta">
              <Button variant="outline" size="lg" href="#search">
                Begin Your Journey →
              </Button>
            </div>
          </div>
        </Container>
      </div>

      {/* Hero Bottom Controls */}
      <div className="page-hero-content relative z-10 pb-16 lg:pb-20">
        <Container size="large">
          <div className="grid lg:grid-cols-12 gap-8 items-end max-w-full media-content">
            {/* Scroll Indicator */}
            <div className="lg:col-span-2 flex flex-col items-center lg:items-start gap-2">
              <span 
                className="text-sm tracking-wider uppercase media-muted"
              >
                Scroll
              </span>
              <div className="animate-bounce">
                <ChevronDown 
                  className="w-6 h-6"
                  style={{ color: 'var(--media-text-muted)' }}
                />
              </div>
            </div>

            {/* Large Search Bar - Full Width */}
            <div className="lg:col-span-10">
              <form className="relative w-full">
                <Search 
                  className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none z-10"
                  style={{ color: 'var(--media-text-muted)' }}
                />
                <input
                  id="search"
                  type="text"
                  placeholder="Search for anime, characters, or themes..."
                  className="w-full px-6 py-5 pl-16 text-lg rounded-[var(--radius-xl)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-orange)] transition-all"
                  style={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'var(--media-text-primary)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    maxWidth: '100%',
                  }}
                />
              </form>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
