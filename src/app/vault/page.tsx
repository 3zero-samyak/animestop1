'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import { vaultProducts } from '@/data/products/vault';
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
          <Container>
            <div className="product-grid">
              {vaultProducts.map((product, i) => (
                <div
                  key={product.id}
                  className={`product-grid-item ${i === 8 ? 'product-grid-item--span-full' : ''}`}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
