'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, Search, X } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import {
  applyCollectionFilters,
  INITIAL_VISIBLE_COUNT,
  LOAD_MORE_COUNT,
  type CollectionConfig,
} from '@/lib/catalog';

interface CollectionBrowserProps {
  config: CollectionConfig;
  className?: string;
  filterBarClassName: string;
  filterPillClassName: string;
  gridClassName: string;
  actionClassName: string;
  actionLinkClassName?: string;
}

function CollectionBrowserContent({
  config,
  className,
  filterBarClassName,
  filterPillClassName,
  gridClassName,
  actionClassName,
  actionLinkClassName,
}: CollectionBrowserProps) {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get('q') ?? '';

  const [filterId, setFilterId] = React.useState(config.filters[0]?.id ?? 'all');
  const [query, setQuery] = React.useState(urlQuery);
  const [prevUrlQuery, setPrevUrlQuery] = React.useState(urlQuery);
  const [visibleCount, setVisibleCount] = React.useState(INITIAL_VISIBLE_COUNT);

  // Sync state during render when URL search parameter changes
  if (urlQuery !== prevUrlQuery) {
    setPrevUrlQuery(urlQuery);
    setQuery(urlQuery);
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }

  const matchingProducts = React.useMemo(
    () => applyCollectionFilters(config.products, filterId, query, config.filters),
    [config.filters, config.products, filterId, query],
  );

  const visibleProducts = matchingProducts.slice(0, visibleCount);
  const hasMore = matchingProducts.length > visibleCount;
  const searchInputId = `${config.key}-search`;

  const handleFilterChange = (nextFilterId: string) => {
    setFilterId(nextFilterId);
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  };

  const clearSearch = () => {
    setQuery('');
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  };

  return (
    <section className={className}>
      <div className="collection-browser-toolbar">
        <div className={filterBarClassName} role="toolbar" aria-label={`${config.title} filters`}>
          {config.filters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              className={filterPillClassName}
              aria-pressed={filterId === filter.id}
              onClick={() => handleFilterChange(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="collection-browser-search">
          <label htmlFor={searchInputId} className="sr-only">
            Search {config.title}
          </label>
          <Search className="collection-browser-search-icon" size={18} aria-hidden="true" />
          <input
            id={searchInputId}
            type="search"
            value={query}
            onChange={handleQueryChange}
            placeholder={`Search ${config.title}`}
            className="collection-browser-search-input"
          />
          {query && (
            <button
              type="button"
              className="collection-browser-search-clear"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <X size={16} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>

      {visibleProducts.length === 0 ? (
        <div className="collection-browser-empty" role="status" aria-live="polite">
          <h3 className="collection-browser-empty-heading">{config.emptyHeading}</h3>
          <p className="collection-browser-empty-copy">{config.emptyDescription}</p>
          {(query || filterId !== config.filters[0]?.id) && (
            <button
              type="button"
              className="collection-browser-reset"
              onClick={() => {
                setFilterId(config.filters[0]?.id ?? 'all');
                setQuery('');
                setVisibleCount(INITIAL_VISIBLE_COUNT);
              }}
            >
              Clear Search & Filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className={gridClassName}>
            {visibleProducts.map((product) => (
              <div key={product.id} className="product-grid-item">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {hasMore && (
            <div className={actionClassName}>
              <button
                type="button"
                className={actionLinkClassName || 'collection-browser-load-more'}
                onClick={() => setVisibleCount((count) => count + LOAD_MORE_COUNT)}
              >
                {config.exploreMoreLabel}
                <ArrowRight className="w-5 h-5" strokeWidth={2.5} aria-hidden="true" />
              </button>
            </div>
          )}
        </>
      )}

      <p className="collection-browser-count" aria-live="polite">
        Showing {Math.min(visibleProducts.length, matchingProducts.length)} of {matchingProducts.length} matching products.
      </p>

      <div className="sr-only" aria-live="polite">
        {matchingProducts.length === 0
          ? `No matching results in ${config.title}.`
          : `${matchingProducts.length} matching products in ${config.title}.`}
      </div>
    </section>
  );
}

function CollectionBrowserFallback({
  config,
  className,
  filterBarClassName,
  filterPillClassName,
  gridClassName,
}: CollectionBrowserProps) {
  const initialProducts = config.products.slice(0, INITIAL_VISIBLE_COUNT);

  return (
    <section className={className}>
      <div className="collection-browser-toolbar">
        <div className={filterBarClassName} role="toolbar" aria-label={`${config.title} filters`}>
          {config.filters.map((filter) => (
            <span
              key={filter.id}
              className={filterPillClassName}
              aria-hidden="true"
            >
              {filter.label}
            </span>
          ))}
        </div>
        <div className="collection-browser-search">
          <Search className="collection-browser-search-icon" size={18} aria-hidden="true" />
          <input
            type="search"
            disabled
            placeholder={`Search ${config.title}`}
            className="collection-browser-search-input opacity-75"
            aria-label={`Search ${config.title}`}
          />
        </div>
      </div>
      <div className={gridClassName}>
        {initialProducts.map((product) => (
          <div key={product.id} className="product-grid-item">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function CollectionBrowser(props: CollectionBrowserProps) {
  return (
    <React.Suspense fallback={<CollectionBrowserFallback {...props} />}>
      <CollectionBrowserContent {...props} />
    </React.Suspense>
  );
}
