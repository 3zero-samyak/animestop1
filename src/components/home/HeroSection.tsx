'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Search, Sparkles } from 'lucide-react';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import ModeImage from '@/components/media/ModeImage';

export default function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (query) router.push(`/stories?q=${encodeURIComponent(query)}`);
  };
  return (
    <section className="discovery-hero" aria-labelledby="home-title">
      <Container size="large" className="discovery-hero-grid">
        <div className="discovery-hero-copy">
          <p className="section-kicker"><Sparkles size={15} aria-hidden="true" /> A little anime. A whole lot of feeling.</p>
          <h1 id="home-title">Some stories become <span>part of your world.</span></h1>
          <p className="discovery-hero-description">We turn the moments you love into miniature worlds, meaningful objects, and stories worth sharing. Made by fans, with feeling.</p>
          <div className="discovery-hero-actions">
            <Button href="#collections" size="lg">Find your next favourite <ArrowRight size={19} aria-hidden="true" /></Button>
            <Link href="/studio" className="discovery-studio-link">Inside the studio <ArrowRight size={17} aria-hidden="true" /></Link>
          </div>
          <form onSubmit={handleSearchSubmit} className="discovery-search" role="search">
            <Search size={20} aria-hidden="true" />
            <label htmlFor="hero-search-input" className="sr-only">Search anime, characters, or moments</label>
            <input id="hero-search-input" type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Find your anime, character, or moment" />
            <button type="submit" aria-label="Search stories" disabled={!searchQuery.trim()}><ArrowRight size={19} aria-hidden="true" /></button>
          </form>
          <div className="discovery-hero-footnote"><span aria-hidden="true" className="colour-dots"><i /><i /><i /><i /></span> Original creations. Endless inspiration.</div>
        </div>
        <div className="discovery-art" data-mode-image-container>
          <div className="discovery-art-image"><ModeImage src="/images/hero/hero-1.png" alt="A cinematic anime-inspired world, full of light and imagination" fill priority sizes="(max-width: 850px) 100vw, 50vw" style={{ objectFit: 'cover' }} /></div>
          <span className="discovery-art-tag"><Sparkles size={15} aria-hidden="true" /> The things that stay with us</span>
          <div className="discovery-art-caption"><span>From a favourite scene</span><strong>to something you can hold.</strong><Link href="/stories" aria-label="Explore scene-inspired stories"><ArrowRight size={22} aria-hidden="true" /></Link></div>
          <span className="discovery-art-sticker" aria-hidden="true">Made of<br />memories ✦</span>
        </div>
      </Container>
    </section>
  );
}
