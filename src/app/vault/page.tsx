'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CollectionBrowser from '@/components/collections/CollectionBrowser';
import { vaultCollectionConfig } from '@/lib/collectionConfigs';
import Container from '@/components/ui/Container';

/**
 * All product-based category pages must use ProductCard with ProductDetail data.
 */
export default function VaultPage() {
  return (
    <>
      <Header />
      <main>
        {/* Category Hero */}
        <section className="category-hero">
          <Container>
            <div className="category-hero-content">
              <p className="category-eyebrow">Vault</p>
              <h1 className="category-hero-title">
                Premium archive concepts.
              </h1>
              <p className="category-description">
                Rare experimental builds and collector-scale centerpieces. Large dioramas, intricate sculptures, and ambitious display concepts representing the pinnacle of fan-inspired craftsmanship.
              </p>
            </div>
          </Container>
        </section>

        {/* Product Grid */}
        <section className="category-products">
          <Container size="large">
            <CollectionBrowser
              config={vaultCollectionConfig}
              className="collection-browser-section"
              filterBarClassName="stories-filter-bar"
              filterPillClassName="stories-filter-pill"
              gridClassName="product-grid"
              actionClassName="stories-showcase-action"
              actionLinkClassName="stories-showcase-all-link"
            />
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
