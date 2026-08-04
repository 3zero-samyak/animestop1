'use client';

import React from 'react';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import ModeImage from '@/components/media/ModeImage';
import { ArrowRight } from 'lucide-react';

const collections = [
  {
    id: 'essentials',
    title: 'ESSENTIALS',
    description: 'Designed for everyday life. Carry the anime you love, wherever you go.',
    image: '/images/essentials.jpg',
    href: '/essentials',
    cta: 'Explore Essentials',
  },
  {
    id: 'stories',
    title: 'STORIES',
    description: 'Relive the scenes that moved you. Moments that stay forever.',
    image: '/images/stories.jpg',
    href: '/stories',
    cta: 'Explore Stories',
  },
  {
    id: 'possibilities',
    title: 'POSSIBILITIES',
    description: 'What if things were different? Explore alternate realities.',
    image: '/images/possibilities.jpg',
    href: '/possibilities',
    cta: 'Explore Possibilities',
  },
  {
    id: 'vault',
    title: 'VAULT',
    description: 'Rare. Exclusive. Legendary. Artifacts for the truest collectors.',
    image: '/images/vault.jpg',
    href: '/vault',
    cta: 'Enter the Vault',
  },
];

export default function ExploreCollections() {
  return (
    <section className="explore-collections-section">
      <Container size="large" className="explore-collections-container">
        <h2 className="explore-collections-heading">EXPLORE COLLECTIONS</h2>
        
        <div className="collection-grid">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={collection.href}
              className="collection-card"
              data-mode-image-container
            >
              {/* Media Layer */}
              <div className="collection-card-media">
                <ModeImage
                  src={collection.image}
                  alt={collection.title}
                  fill
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
