import React from 'react';
import Container from '@/components/ui/Container';
import { Search } from 'lucide-react';

export default function SearchSection() {
  return (
    <section id="search" className="py-16 lg:py-20 relative" style={{ backgroundColor: 'var(--page-bg)' }}>
      <Container size="large">
        <div className="max-w-4xl mx-auto">
          {/* Section Heading */}
          <div className="text-center mb-8">
            <h2 
              className="text-3xl md:text-4xl font-stylish mb-3"
              style={{ color: 'var(--text-primary)' }}
            >
              Find Your Next Story
            </h2>
            <p 
              className="text-lg"
              style={{ color: 'var(--text-muted)' }}
            >
              Search through thousands of anime titles, characters, and themes
            </p>
          </div>

          {/* Large Search Bar */}
          <form className="relative">
            <div className="relative">
              <Search 
                className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none"
                style={{ color: 'var(--text-muted)' }}
              />
              <input
                type="text"
                placeholder="Search for anime, characters, genres, or themes..."
                className="w-full px-6 py-6 pl-16 bg-[var(--card-bg)] border-2 border-[var(--border-card)] rounded-[var(--radius-xl)] text-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-orange)] transition-all duration-300 shadow-lg hover:shadow-xl"
                style={{ 
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border-card)',
                }}
              />
            </div>
            
            {/* Quick search tags */}
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {['Action', 'Romance', 'Sci-Fi', 'Fantasy', 'Slice of Life'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="px-4 py-2 text-sm rounded-full border transition-all hover:scale-105"
                  style={{
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--border-soft)',
                    color: 'var(--text-muted)',
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </form>
        </div>
      </Container>
    </section>
  );
}
