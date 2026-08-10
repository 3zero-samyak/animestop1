'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Search, X, Menu } from 'lucide-react';
import MobileNavigation from './MobileNavigation';
import ModeToggle from '@/components/mode/ModeToggle';
import DesktopNavigation from './DesktopNavigation';
import { getDemoUser, addSearchQuery } from '@/lib/demoSession';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // single persistent header - no scroll-based swapping

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (searchOpen) {
          setSearchOpen(false);
          // Return focus to search button
          const searchButton = searchRef.current?.querySelector('button');
          searchButton?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [searchOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Return focus to menu button when menu closes
  useEffect(() => {
    if (!menuOpen && menuButtonRef.current) {
      // Small delay to ensure drawer animation completes
      setTimeout(() => {
        menuButtonRef.current?.focus();
      }, 50);
    }
  }, [menuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality placeholder
    if (searchQuery.trim()) {
      // Record search for demo user tracking
      try {
        const user = getDemoUser();
        if (user) addSearchQuery(searchQuery.trim());
      } catch {}
      console.log('Search query:', searchQuery);
    }
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  const toggleMenu = () => {
    setMenuOpen((s) => !s);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <header className="site-header">
        <div className="site-header-inner">
          {/* Menu Button (left on mobile) */}
          <button
            ref={menuButtonRef}
            type="button"
            className="site-header-icon-button site-header-menu-button"
            onClick={toggleMenu}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="global-navigation-drawer"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>

          {/* Brand Logo */}
          <Link href="/" className="site-brand">
            <span className="site-brand-name">
              <span className="site-brand-anime">ANIME</span>
              <span className="site-brand-stop">STOP</span>
            </span>

            <span className="site-brand-caption">
              Built by anime fans. For anime fans.
            </span>
          </Link>

          {/* Primary Navigation (center) */}
          <DesktopNavigation />

          {/* Right Actions */}
          <div className="site-header-actions">
            {/* Search Button */}
            <div className="site-header-search-container" ref={searchRef}>
              <button
                type="button"
                className="site-header-icon-button"
                onClick={toggleSearch}
                aria-label="Search AnimeStop"
                aria-expanded={searchOpen}
              >
                <Search />
              </button>

              {/* Search Overlay */}
              {searchOpen && (
                <div className="site-header-search-overlay">
                  <div className="site-header-search-content">
                    <form onSubmit={handleSearchSubmit}>
                      <label htmlFor="site-search-input" className="sr-only">
                        Search AnimeStop
                      </label>
                      <div className="site-header-search-input-wrapper">
                        <input
                          ref={searchInputRef}
                          id="site-search-input"
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search anime stories..."
                          className="site-header-search-input"
                        />
                        <button
                          type="button"
                          className="site-header-search-close"
                          onClick={() => setSearchOpen(false)}
                          aria-label="Close search"
                        >
                          <X size={20} strokeWidth={2} />
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>

            {/* Menu Button */}
            {/* Mode Toggle */}
            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Navigation Drawer */}
      <MobileNavigation isOpen={menuOpen} onClose={closeMenu} />
    </>
  );
}

