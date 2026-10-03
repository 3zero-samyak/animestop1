import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StoriesHero from '@/components/stories/StoriesHero';
import CollectionBrowser from '@/components/collections/CollectionBrowser';
import { storiesCollectionConfig } from '@/lib/collectionConfigs';

export const metadata = {
  title: 'Stories | AnimeStop - Relive Your Favorite Anime Moments',
  description: 'Discover and collect pieces from the anime scenes that moved you. These are not just collectibles—they are pieces of your memories.',
  keywords: ['anime stories', 'anime collectibles', 'anime moments', 'anime memories'],
};

export default function StoriesPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section with breadcrumb, text, and Your Journey card */}
        <StoriesHero />

        <section className="stories-showcase" aria-labelledby="stories-showcase-title">
          <div className="stories-showcase-container">
            <header className="stories-showcase-header">
              <p className="stories-showcase-eyebrow">Stories</p>
              <h2 id="stories-showcase-heading" className="stories-showcase-heading">
                Moments that stay with us.
              </h2>
              <p className="stories-showcase-subcopy">
                Fan-inspired anime and manga display concepts — dioramas, busts, shadow boxes, wall reliefs, and prop collections. Original interpretations, not official merchandise.
              </p>
              <p className="stories-showcase-disclaimer">
                Unofficial fan-inspired maker project · Not affiliated with any anime, manga, studio, publisher, or rights holder.
              </p>
            </header>

            <CollectionBrowser
              config={storiesCollectionConfig}
              className="collection-browser-section"
              filterBarClassName="stories-filter-bar"
              filterPillClassName="stories-filter-pill"
              gridClassName="stories-showcase-grid"
              actionClassName="stories-showcase-action"
              actionLinkClassName="stories-showcase-all-link"
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
