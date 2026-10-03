'use client';

import React from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { useAuth } from '@/lib/AuthProvider';
import { useJourney } from '@/components/journey/JourneyProvider';
import { recordJourneySearch } from '@/lib/journey';
import { allCollectionProducts, getCollectionLabel, getCollectionRoute } from '@/lib/collectionConfigs';
import { matchesSearch } from '@/lib/catalog';

interface CatalogSearchOverlayProps {
  query: string;
  onChange: (value: string) => void;
  onClose: () => void;
}

export default function CatalogSearchOverlay({ query, onChange, onClose }: CatalogSearchOverlayProps) {
  const { user } = useAuth();
  const { preference, preferenceResolved } = useJourney();
  const results = React.useMemo(
    () => allCollectionProducts.filter((product) => matchesSearch(product, query)).slice(0, 10),
    [query],
  );

  const handleResultClick = async () => {
    if (!user?.uid || !query.trim() || !preferenceResolved || preference.recordingPaused) {
      return;
    }

    try {
      await recordJourneySearch(user.uid, query, 'global');
    } catch {}
  };

  return (
    <div className="site-header-search-overlay">
      <div className="site-header-search-content catalog-search-panel">
        <label htmlFor="site-search-input" className="sr-only">
          Search AnimeStop catalog
        </label>
        <div className="site-header-search-input-wrapper">
          <Search className="collection-browser-search-icon" size={18} aria-hidden="true" />
          <input
            id="site-search-input"
            type="search"
            value={query}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Search AnimeStop catalog"
            className="site-header-search-input"
          />
          <button
            type="button"
            className="site-header-search-close"
            onClick={onClose}
            aria-label="Close search"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        <div className="catalog-search-results" aria-live="polite">
          {query.trim() ? (
            results.length > 0 ? (
              results.map((product) => (
                <Link
                  key={product.id}
                  href={`/builds/${product.buildSlug}`}
                  className="catalog-search-result"
                  onClick={async () => {
                    await handleResultClick();
                    onClose();
                  }}
                >
                  <span className="catalog-search-result-collection">{getCollectionLabel(product.collectionKey)}</span>
                  <strong className="catalog-search-result-title">{product.cardTitle || product.title}</strong>
                  <span className="catalog-search-result-meta">{product.category}</span>
                </Link>
              ))
            ) : (
              <div className="catalog-search-empty" role="status">
                <strong>NO MATCHING RESULTS</strong>
                <span>Try a different product title, collection or tag.</span>
              </div>
            )
          ) : (
            <div className="catalog-search-hint" role="status">
              Search Stories, Essentials, Possibilities and Vault.
            </div>
          )}
        </div>

        <div className="catalog-search-links">
          <Link href={getCollectionRoute('stories')} onClick={onClose}>Stories</Link>
          <Link href={getCollectionRoute('essentials')} onClick={onClose}>Essentials</Link>
          <Link href={getCollectionRoute('possibilities')} onClick={onClose}>Possibilities</Link>
          <Link href={getCollectionRoute('vault')} onClick={onClose}>Vault</Link>
        </div>
      </div>
    </div>
  );
}
