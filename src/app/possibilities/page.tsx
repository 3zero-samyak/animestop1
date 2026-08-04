'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Orbit, 
  Sparkles, 
  WandSparkles, 
  Lightbulb, 
  Users, 
  PenLine,
  Feather,
  Filter
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import { possibilitiesProducts } from '@/data/products/possibilities';
import NewsletterSection from '@/components/home/NewsletterSection';

/**
 * Possibilities Page - Alternate realities and "what if" scenarios.
 * No content images anywhere on this page.
 */
export default function PossibilitiesPage() {
  return (
    <>
      <Header />
      <main className="possibilities-page">
        {/* Possibilities Hero with Stats Panel */}
        <section className="possibilities-hero">
          <div className="possibilities-hero-inner">
            {/* Left: Main Copy */}
            <div className="possibilities-hero-copy">
              <h1 className="possibilities-hero-title">Possibilities</h1>
              <p className="possibilities-hero-subtitle">Step into alternate realities.</p>
              <p className="possibilities-hero-description">
                Explore what could have been, what might be, and what fans like you imagine next.
              </p>
              <Link href="#possibilities-grid" className="possibilities-hero-cta">
                Explore Possibilities
                <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
              </Link>
            </div>

            {/* Right: Stats Panel */}
            <div className="possibilities-stats-panel">
              <div className="possibilities-stats-header">
                <h2 className="possibilities-stats-title">Infinite stories. Infinite realities.</h2>
                <p className="possibilities-stats-subtitle">Your imagination is the next adventure.</p>
              </div>

              <div className="possibilities-stats-list">
                <div className="possibility-stat">
                  <Orbit className="possibility-stat-icon possibility-stat-icon--purple" size={28} strokeWidth={2} />
                  <div className="possibility-stat-content">
                    <strong className="possibility-stat-value">12,450+</strong>
                    <span className="possibility-stat-label">Alternate Scenarios</span>
                  </div>
                </div>

                <div className="possibility-stat">
                  <Sparkles className="possibility-stat-icon possibility-stat-icon--gold" size={28} strokeWidth={2} />
                  <div className="possibility-stat-content">
                    <strong className="possibility-stat-value">8,320+</strong>
                    <span className="possibility-stat-label">Community Ideas</span>
                  </div>
                </div>

                <div className="possibility-stat">
                  <WandSparkles className="possibility-stat-icon possibility-stat-icon--teal" size={28} strokeWidth={2} />
                  <div className="possibility-stat-content">
                    <strong className="possibility-stat-value">1,250+</strong>
                    <span className="possibility-stat-label">Stories Reimagined</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Explore Alternate Realities Header */}
        <section className="possibilities-explore-header">
          <div className="possibilities-container">
            <div className="possibilities-explore-header-content">
              <div>
                <h2 className="possibilities-section-title">Explore Alternate Realities</h2>
                <p className="possibilities-section-subtitle">Discover worlds fans have reimagined.</p>
              </div>
              <div className="possibilities-meta">
                <span className="possibilities-count">Showing 16 possibilities</span>
                <span className="possibilities-sort">Sort by: Newest</span>
              </div>
            </div>

            {/* Filters */}
            <div className="possibilities-filter-bar" role="toolbar" aria-label="Possibilities filters">
              {[
                'All Possibilities',
                'Alternate Worlds',
                'Character Paths',
                'Crossover Ideas',
                'Reimagined Battles',
                'Future Worlds',
                'Community Concepts',
                'Filter',
              ].map((label) => (
                <button
                  key={label}
                  type="button"
                  className="possibilities-filter-pill"
                  aria-pressed={label === 'All Possibilities'}
                >
                  {label === 'Filter' ? <Filter className="w-4 h-4" /> : label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Product Grid - Exactly 16 Cards */}
        <section id="possibilities-grid" className="possibilities-products-section">
          <div className="possibilities-container">
            <div className="possibilities-grid">
              {possibilitiesProducts.map((product, i) => (
                <div
                  key={product.id}
                  className={`product-grid-item ${i === 8 ? 'product-grid-item--span-full' : ''}`}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Explore Possibilities CTA */}
            <div className="possibilities-explore-action">
              <Link href="/possibilities" className="possibilities-explore-link">
                Explore Possibilities
                <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </section>

        {/* How Possibilities Come to Life */}
        <section className="possibilities-process-section">
          <div className="possibilities-container">
            <div className="possibilities-process-header">
              <h2 className="possibilities-section-title">How Possibilities Come to Life</h2>
              <p className="possibilities-section-subtitle">From idea to immersive story.</p>
            </div>

            <div className="possibilities-process">
              <div className="possibilities-process-step" tabIndex={0} role="button" aria-label="Step 1: An Idea Is Born">
                <div className="possibilities-process-icon">
                  <Lightbulb size={32} strokeWidth={2} />
                </div>
                <div className="possibilities-process-number">1</div>
                <h3 className="possibilities-process-title">An Idea Is Born</h3>
                <p className="possibilities-process-description">A fan imagines a different path.</p>
              </div>

              <div className="possibilities-process-step" tabIndex={0} role="button" aria-label="Step 2: Community Votes">
                <div className="possibilities-process-icon">
                  <Users size={32} strokeWidth={2} />
                </div>
                <div className="possibilities-process-number">2</div>
                <h3 className="possibilities-process-title">Community Votes</h3>
                <p className="possibilities-process-description">The community supports the best ideas.</p>
              </div>

              <div className="possibilities-process-step" tabIndex={0} role="button" aria-label="Step 3: Story Development">
                <div className="possibilities-process-icon">
                  <PenLine size={32} strokeWidth={2} />
                </div>
                <div className="possibilities-process-number">3</div>
                <h3 className="possibilities-process-title">Story Development</h3>
                <p className="possibilities-process-description">Writers craft the alternate reality.</p>
              </div>

              <div className="possibilities-process-step" tabIndex={0} role="button" aria-label="Step 4: Immersive Experience">
                <div className="possibilities-process-icon">
                  <Orbit size={32} strokeWidth={2} />
                </div>
                <div className="possibilities-process-number">4</div>
                <h3 className="possibilities-process-title">Immersive Experience</h3>
                <p className="possibilities-process-description">Stories, visuals and products are created.</p>
              </div>

              <div className="possibilities-process-step" tabIndex={0} role="button" aria-label="Step 5: You Explore It">
                <div className="possibilities-process-icon">
                  <Sparkles size={32} strokeWidth={2} />
                </div>
                <div className="possibilities-process-number">5</div>
                <h3 className="possibilities-process-title">You Explore It</h3>
                <p className="possibilities-process-description">Step into a reality that could be.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Submission Panel */}
        <section className="possibilities-submit-section">
          <div className="possibilities-container">
            <div className="possibilities-submit-panel">
              <Feather className="possibilities-submit-icon" size={40} strokeWidth={1.5} />
              
              <div className="possibilities-submit-content">
                <h2 className="possibilities-submit-title">Have an alternate reality in mind?</h2>
                <p className="possibilities-submit-description">
                  Share your idea with the community and see it come to life.
                </p>
              </div>

              <Link href="/share-story" className="possibilities-submit-cta">
                Submit Your Possibility
                <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </section>

        {/* Join Our Journey */}
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
