'use client';

import React from 'react';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import ModeImage from '@/components/media/ModeImage';
import { ArrowRight } from 'lucide-react';

const collections = [
  {
    id: 'essentials',
    title: 'Essentials',
    description: 'Designed for everyday life. Carry the anime you love, wherever you go.',
    image: '/images/hero/essential-image.png',
    href: '/essentials',
    cta: 'Explore Essentials',
  },
  {
    id: 'stories',
    title: 'Stories',
    description: 'Relive the scenes that moved you. Moments that stay forever.',
    image: '/images/hero/stories-homepage.png',
    href: '/stories',
    cta: 'Explore Stories',
  },
  {
    id: 'possibilities',
    title: 'Possibilities',
    description: 'What if things were different? Explore alternate realities.',
    image: '/images/hero/possibilities-image.png',
    href: '/possibilities',
    cta: 'Explore Possibilities',
  },
  {
    id: 'vault',
    title: 'Vault',
    description: 'Rare. Exclusive. Legendary. Artifacts for the truest collectors.',
    image: '/images/hero/vault-image.png',
    href: '/vault',
    cta: 'Enter the Vault',
  },
];

export default function ExploreCollections() {
  return (
    <section id="collections" className="explore-collections-section" aria-labelledby="collections-title">
      <Container size="large" className="explore-collections-container">
        <header className="section-heading-row"><div><p className="section-kicker">Find your corner of the universe</p><h2 id="collections-title" className="explore-collections-heading">A world for <span className="script-accent">every kind of fan.</span></h2></div><p className="section-heading-note">Everyday favourites, unforgettable scenes,<br />and ideas a little out of this world.</p></header>
        
        <div className="collection-grid">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={collection.href}
              className="collection-card"
              data-collection={collection.id}
              data-mode-image-container
            >
              {/* Media Layer */}
              <div className="collection-card-media">
                <ModeImage
                  src={collection.image}
                  alt={collection.title}
                  fill
                  sizes="(max-width: 600px) 100vw, (max-width: 1100px) 50vw, 25vw"
                  style={{ objectFit: 'cover' }}
                  data-mode-sensitive="true"
                />
              </div>

              {/* Overlay */}
              <div className="media-overlay-card" aria-hidden="true" />

              {/* Content */}
              <div className="collection-card-content media-content">
                <h3 className="collection-card-title media-title">{collection.title}</h3>
                <p className="collection-card-description media-description">{collection.description}</p>
                <span className="collection-card-cta">
                  {collection.cta} <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
