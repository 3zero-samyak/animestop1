'use client';

import React from 'react';
import { 
  Shirt, 
  Lock, 
  Truck, 
  RefreshCw, 
  Heart,
  BadgeCheck,
  Sparkles,
  Gift,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CollectionBrowser from '@/components/collections/CollectionBrowser';
import { essentialsCollectionConfig } from '@/lib/collectionConfigs';
import Container from '@/components/ui/Container';
import NewsletterSection from '@/components/home/NewsletterSection';

/**
 * All product-based category pages must use ProductCard with ProductDetail data.
 */
export default function EssentialsPage() {
  return (
    <>
      <Header />
      <main>
        {/* Essentials Hero */}
        <section className="essentials-hero">
          <Container>
            <div className="essentials-hero-content">
              <p className="essentials-eyebrow">ESSENTIALS</p>
              <h1 className="essentials-hero-title">
                Designed for everyday life.
              </h1>
              <p className="essentials-hero-subtitle">
                Carry the anime you love, wherever you go.
              </p>
            </div>
          </Container>
        </section>

        {/* Feature Highlights */}
        <section className="essentials-features-section">
          <Container>
            <div className="essentials-features">
              <div className="essentials-feature">
                <Shirt className="essentials-feature-icon" strokeWidth={1.5} />
                <div className="essentials-feature-content">
                  <h3 className="essentials-feature-title">Comfort</h3>
                  <p className="essentials-feature-description">Made for everyday use</p>
                </div>
              </div>
              <div className="essentials-feature">
                <BadgeCheck className="essentials-feature-icon" strokeWidth={1.5} />
                <div className="essentials-feature-content">
                  <h3 className="essentials-feature-title">Quality</h3>
                  <p className="essentials-feature-description">Premium materials, built to last</p>
                </div>
              </div>
              <div className="essentials-feature">
                <Sparkles className="essentials-feature-icon" strokeWidth={1.5} />
                <div className="essentials-feature-content">
                  <h3 className="essentials-feature-title">Meaning</h3>
                  <p className="essentials-feature-description">Every design has a story</p>
                </div>
              </div>
              <div className="essentials-feature">
                <Gift className="essentials-feature-icon" strokeWidth={1.5} />
                <div className="essentials-feature-content">
                  <h3 className="essentials-feature-title">For You</h3>
                  <p className="essentials-feature-description">For fans, by fans</p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Filters and Sorting */}
        <section className="essentials-controls-section">
          <Container size="large">
            <CollectionBrowser
              config={essentialsCollectionConfig}
              className="collection-browser-section"
              filterBarClassName="essentials-filter-bar"
              filterPillClassName="essentials-filter-pill"
              gridClassName="essentials-product-grid"
              actionClassName="essentials-explore-action"
              actionLinkClassName="category-explore-all-link"
            />
          </Container>
        </section>

        {/* Benefits Panel */}
        <section className="essentials-benefits-section">
          <Container size="large">
            <div className="essentials-benefits-panel">
              <div className="essentials-benefits-list">
                <div className="essentials-benefit">
                  <BadgeCheck className="essentials-benefit-icon" size={24} strokeWidth={2} />
                  <span className="essentials-benefit-label">Handcrafted with Care</span>
                </div>
                <div className="essentials-benefit">
                  <Lock className="essentials-benefit-icon" size={24} strokeWidth={2} />
                  <span className="essentials-benefit-label">Secure & Trusted</span>
                </div>
                <div className="essentials-benefit">
                  <Truck className="essentials-benefit-icon" size={24} strokeWidth={2} />
                  <span className="essentials-benefit-label">Worldwide Shipping</span>
                </div>
                <div className="essentials-benefit">
                  <RefreshCw className="essentials-benefit-icon" size={24} strokeWidth={2} />
                  <span className="essentials-benefit-label">Easy Returns</span>
                </div>
                <div className="essentials-benefit">
                  <Heart className="essentials-benefit-icon" size={24} strokeWidth={2} />
                  <span className="essentials-benefit-label">Made with Heart</span>
                </div>
              </div>

              <div className="essentials-benefits-statement">
                <p className="essentials-statement-text">
                  More than just merchandise.
                  <br />
                  It&apos;s a piece of your journey.
                  <br />
                  It&apos;s your story, in the real world.
                </p>
                <p className="essentials-statement-accent">
                  We build what stays with you.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Join Our Journey */}
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
