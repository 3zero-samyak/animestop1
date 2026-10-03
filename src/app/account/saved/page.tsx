'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import { useSavedItems } from '@/components/saved/SavedItemsProvider';
import type { CollectionKey } from '@/lib/catalog';

type SavedFilter = 'all' | CollectionKey;

const FILTERS: Array<{ id: SavedFilter; label: string }> = [
  { id: 'all', label: 'ALL' },
  { id: 'stories', label: 'STORIES' },
  { id: 'essentials', label: 'ESSENTIALS' },
  { id: 'possibilities', label: 'POSSIBILITIES' },
  { id: 'vault', label: 'VAULT' },
];

export default function SavedItemsPage() {
  const { items, loading, error, retry } = useSavedItems();
  const [filter, setFilter] = React.useState<SavedFilter>('all');

  const filteredItems = React.useMemo(
    () => items.filter((item) => filter === 'all' || item.collection === filter),
    [filter, items],
  );

  const emptyHeading = filter === 'all' ? 'NO SAVED ITEMS YET' : `NO ${filter.toUpperCase()} ITEMS SAVED`;
  const emptyCopy = filter === 'all'
    ? 'Your bookmarked Stories, Essentials, Possibilities and Vault products will appear here.'
    : `You have not saved any ${filter} products yet.`;

  return (
    <>
      <Header />
      <ProtectedRoute
        loadingComponent={
          <main className="share-story-loading">
            <div className="share-story-loading-content">
              <p>Loading your saved items...</p>
            </div>
          </main>
        }
      >
        <main className="auth-page">
          <div className="account-page-container">
            <h1 className="account-page-title">My Saved Items</h1>

            <section className="account-section">
              <p className="account-section-desc">
                Your bookmarked Stories, Essentials, Possibilities and Vault products appear here and stay with your AnimeStop account.
              </p>

              <div className="account-button-group" role="toolbar" aria-label="Saved item filters">
                {FILTERS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={item.id === filter ? 'account-button account-button-primary' : 'account-button account-button-secondary'}
                    aria-pressed={item.id === filter}
                    onClick={() => setFilter(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </section>

            {loading ? (
              <section className="account-section">
                <p className="account-section-desc">Loading your saved products...</p>
              </section>
            ) : error ? (
              <section className="account-section">
                <p className="account-error">{error}</p>
                <button type="button" className="account-button account-button-primary" onClick={retry}>
                  RETRY
                </button>
              </section>
            ) : filteredItems.length === 0 ? (
              <section className="account-section">
                <h2 className="account-section-title">{emptyHeading}</h2>
                <p className="account-section-desc">{emptyCopy}</p>
                <div className="account-button-group">
                  <a href="/stories" className="account-button account-button-primary">STORIES</a>
                  <a href="/essentials" className="account-button account-button-secondary">ESSENTIALS</a>
                  <a href="/possibilities" className="account-button account-button-secondary">POSSIBILITIES</a>
                  <a href="/vault" className="account-button account-button-secondary">VAULT</a>
                </div>
              </section>
            ) : (
              <section className="account-section">
                <div className="collection-product-grid">
                  {filteredItems.map((item) => (
                    <div key={item.id} className="product-grid-item">
                      {item.product ? (
                        <ProductCard product={item.product} />
                      ) : (
                        <article className="submission-card">
                          <h3 className="submission-card-title">Saved product unavailable</h3>
                          <p className="submission-card-body">This catalog item is no longer available, but you can remove it by using the bookmark button after it is restored to the catalog.</p>
                        </article>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </main>
      </ProtectedRoute>
      <Footer />
    </>
  );
}
