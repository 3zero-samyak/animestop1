'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Search, X, Menu } from 'lucide-react';
import MobileNavigation from './MobileNavigation';
import ModeToggle from '@/components/mode/ModeToggle';
import ProfileMenu from './ProfileMenu';
import DesktopNavigation from './DesktopNavigation';
import CatalogSearchOverlay from '@/components/search/CatalogSearchOverlay';
import { useAuth } from '@/lib/AuthProvider';
import { useJourney } from '@/components/journey/JourneyProvider';
import { addSearchQuery } from '@/lib/searchHistory';
import { recordJourneySearch } from '@/lib/journey';

export default function Header() {
  const { user } = useAuth();
  const { preference, preferenceResolved } = useJourney();
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

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (searchOpen && searchQuery.trim()) {
      try {
        if (user) addSearchQuery(searchQuery.trim());
      } catch {}
    }
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = searchQuery.trim();
    if (!normalized) {
      return;
    }

    try {
      if (user) {
        addSearchQuery(normalized);
        if (preferenceResolved && !preference.recordingPaused) {
          await recordJourneySearch(user.uid, normalized, 'global');
        }
      }
    } catch {}
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
                <div onSubmitCapture={(event) => void handleSearchSubmit(event)}>
                  <CatalogSearchOverlay
                    query={searchQuery}
                    onChange={(value) => setSearchQuery(value)}
                    onClose={() => setSearchOpen(false)}
                  />
                </div>
              )}
            </div>

            {/* Profile (desktop only) */}
            <div className="hidden lg:flex items-center" style={{ marginLeft: 8 }}>
              <ProfileMenu />
            </div>

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

