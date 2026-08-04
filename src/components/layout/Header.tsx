'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X, Menu } from 'lucide-react';
import MobileNavigation from './MobileNavigation';
import ModeToggle from '@/components/mode/ModeToggle';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompactHeader, setShowCompactHeader] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Scroll detection with hysteresis
  useEffect(() => {
    const SHOW_COMPACT_AT = 110;
    const HIDE_COMPACT_AT = 70;

    const handleScroll = () => {
      const scrollY = window.scrollY;

      if (!showCompactHeader && scrollY >= SHOW_COMPACT_AT) {
        setShowCompactHeader(true);
      } else if (showCompactHeader && scrollY <= HIDE_COMPACT_AT) {
        setShowCompactHeader(false);
      }
    };

    // Check initial scroll position (for restored scroll on page load)
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showCompactHeader]);

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
      console.log('Search query:', searchQuery);
    }
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      {/* Expanded Header */}
      <header className="site-header" data-compact-active={showCompactHeader}>
        <div className="site-header-inner">
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
            <button
              ref={menuButtonRef}
              type="button"
              className="site-header-icon-button"
              onClick={toggleMenu}
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              aria-controls="global-navigation-drawer"
            >
              {menuOpen ? <X /> : <Menu />}
            </button>

            {/* Mode Toggle */}
            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Compact Header */}
      <header className="compact-header" data-visible={showCompactHeader}>
        <div className="compact-header-inner">
          {/* Menu Button */}
          <button
            type="button"
            className="compact-header-menu"
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            aria-controls="global-navigation-drawer"
            onClick={toggleMenu}
          >
            <Menu aria-hidden="true" />
          </button>

          {/* Brand */}
          <Link href="/" className="compact-header-brand" aria-label="AnimeStop home">
            <span>ANIME</span>
            <span>STOP</span>
          </Link>

          {/* Right Actions */}
          <div className="compact-header-actions">
            <Link href="/contact" className="compact-header-enquire">
              Enquire
            </Link>

            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Navigation Drawer */}
      <MobileNavigation isOpen={menuOpen} onClose={closeMenu} />
    </>
  );
}

