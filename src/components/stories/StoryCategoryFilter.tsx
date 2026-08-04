'use client';

import React, { useState } from 'react';
import Container from '@/components/ui/Container';

const filterCategories = [
  { id: 'all', label: 'All Stories' },
  { id: 'new', label: 'New Arrivals' },
  { id: 'popular', label: 'Most Popular' },
  { id: 'action', label: 'Action' },
  { id: 'adventure', label: 'Adventure' },
  { id: 'drama', label: 'Drama' },
  { id: 'fantasy', label: 'Fantasy' },
];

export default function StoryCategoryFilter() {
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <section 
      className="py-6 lg:py-8 border-b"
      style={{ 
        backgroundColor: 'var(--page-bg)',
        borderColor: 'var(--border-soft)',
      }}
    >
      <Container size="large">
        {/* Scrollable filter bar */}
        <div className="relative">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2">
            {filterCategories.map((category) => {
              const isActive = activeFilter === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveFilter(category.id)}
                  className="flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: isActive 
                      ? 'var(--accent-orange)' 
                      : 'var(--elevated-bg)',
                    color: isActive 
                      ? 'var(--page-bg)' 
                      : 'var(--text-muted)',
                    border: `1px solid ${isActive 
                      ? 'var(--accent-orange)' 
                      : 'var(--border-card)'}`,
                  }}
                >
                  {category.label}
                </button>
              );
            })}
          </div>

          {/* Fade gradient on right edge (mobile) */}
          <div 
            className="absolute right-0 top-0 bottom-0 w-12 pointer-events-none lg:hidden"
            style={{
              background: 'linear-gradient(to left, var(--page-bg), transparent)',
            }}
          />
        </div>

        {/* Results count (placeholder) */}
        <div className="mt-4 flex items-center justify-between">
          <p 
            className="text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            <span style={{ color: 'var(--text-primary)' }}>127</span> stories found
          </p>

          {/* Sort dropdown placeholder */}
          <div className="hidden sm:flex items-center gap-2">
            <label 
              htmlFor="sort-select"
              className="text-sm"
              style={{ color: 'var(--text-muted)' }}
            >
              Sort by:
            </label>
            <select
              id="sort-select"
              className="px-3 py-1.5 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-[var(--accent-orange)]"
              style={{
                backgroundColor: 'var(--elevated-bg)',
                color: 'var(--text-primary)',
                borderColor: 'var(--border-card)',
              }}
            >
              <option value="latest">Latest</option>
              <option value="popular">Most Popular</option>
              <option value="name">Name A-Z</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </Container>
    </section>
  );
}
