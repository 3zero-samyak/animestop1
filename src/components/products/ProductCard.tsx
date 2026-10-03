'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Bookmark } from 'lucide-react';
import ModeImage from '@/components/media/ModeImage';
import { useSavedItems } from '@/components/saved/SavedItemsProvider';
import type { ProductDetail } from '@/types/product';

interface ProductCardProps {
  product: ProductDetail;
}

function makeSlug(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isSaved, toggleItem } = useSavedItems();
  const slug = product.id ? makeSlug(product.id) : makeSlug(product.title || 'build');
  const collectionKey = product.collectionKey ?? 'stories';
  const saved = isSaved(collectionKey, product.id);

  return (
    <article
      className="product-card"
      data-mode-image-container
      style={{
        '--story-accent': product.accent || 'var(--accent-primary)',
      } as React.CSSProperties}
    >
      <Link
        href={`/builds/${slug}`}
        className="product-card-trigger build-card-main-link"
        data-route-transition-title={product.title}
        aria-label={`View details for ${product.title}`}
      >
        {/* Background Image */}
        <div className="product-card-media">
          {product.image ? (
            <ModeImage
              src={product.image}
              alt={product.imageAlt}
              fill
              sizes="(max-width: 599px) 100vw, (max-width: 899px) 50vw, (max-width: 1199px) 33vw, 25vw"
              className="product-card-image"
            />
          ) : (
            <div
              className="product-card-image"
              style={{ 
                backgroundColor: 'var(--surface-secondary)',
                width: '100%',
                height: '100%'
              }}
            />
          )}
        </div>

        {/* Gradient Overlay */}
        <div className="product-card-overlay" aria-hidden="true" />

        {/* Content */}
        <div className="product-card-content">
          {/* Top Row - Category */}
          <div className="product-card-top">
            <span className="product-card-category">
              {product.category}
            </span>
          </div>

          {/* Main Copy */}
          <div className="product-card-main-copy">
            <h3 className="product-card-title">
              {product.cardTitle || product.title}
            </h3>
            <p className="product-card-description">
              {product.shortDescription}
            </p>

            <span className="product-card-action">
              Explore More
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} aria-hidden="true" />
            </span>
          </div>
        </div>
      </Link>

      {/* Bookmark - separate button to avoid nesting */}
      <button
        type="button"
        className="product-card-bookmark"
        aria-label={saved ? `Remove saved product ${product.title}` : `Save product ${product.title}`}
        aria-pressed={saved}
        onClick={async (e) => {
          e.stopPropagation();
          e.preventDefault();
          await toggleItem(collectionKey, product.id);
        }}
        style={{ color: saved ? 'var(--accent-primary)' : undefined }}
      >
        <Bookmark size={20} strokeWidth={2} aria-hidden="true" fill={saved ? 'currentColor' : 'none'} />
      </button>
    </article>
  );
}
