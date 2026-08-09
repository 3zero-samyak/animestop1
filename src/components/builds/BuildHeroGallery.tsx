'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, ChevronDown } from 'lucide-react';
import ModeImage from '@/components/media/ModeImage';
import type { BuildDetail, BuildMediaItem } from '@/data/builds';

export default function BuildHeroGallery({ build }: { build: BuildDetail }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const selectorRef = useRef<HTMLDivElement | null>(null);
  const [showDown, setShowDown] = useState(false);

  // Build media array from available sources (immutable)
  const rawMedia: BuildMediaItem[] = (build.media || []).slice();

  // If no explicit media, create from gallery/image
  const fallbackMedia: BuildMediaItem[] = [];
  if (rawMedia.length === 0 && build.image) {
    fallbackMedia.push({
      id: 'front',
      type: 'image',
      label: 'Front',
      src: build.image,
      alt: build.imageAlt || build.title,
      view: 'front',
    });
  }

  // Ensure ordering: video, front, back, left, right, top, bottom, then any others
  const order = ['video', 'front', 'back', 'left', 'right', 'top', 'bottom'];
  const ordered: BuildMediaItem[] = [];
  order.forEach((v) => {
    const found = rawMedia.find((m) => (m.view === v || m.id === v || (m.type === 'video' && v === 'video')));
    if (found) ordered.push(found);
  });
  // append any others that weren't matched
  rawMedia.forEach((m) => {
    if (!ordered.includes(m)) ordered.push(m);
  });
  const media: BuildMediaItem[] = ordered.length ? ordered : fallbackMedia;

  const activeMedia = media[activeIndex];
  const hasMultipleViews = media.length > 1;

  // Pause and reset video when switching away from video
  useEffect(() => {
    if (videoRef.current && activeMedia?.type !== 'video') {
      try {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      } catch {
        // ignore
      }
    }
  }, [activeIndex, activeMedia]);

  // Down-arrow indicator visibility for selector
  useEffect(() => {
    const el = selectorRef.current;
    if (!el) return;

    const check = () => {
      setShowDown(el.scrollHeight > el.clientHeight + 4 && el.scrollTop + el.clientHeight < el.scrollHeight - 2);
    };

    check();
    el.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    return () => {
      el.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, [media.length]);

  const handleViewChange = (index: number) => {
    setActiveIndex(index);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleViewChange(index);
    }
  };

  return (
    <section className="build-hero-gallery-section">
      <div className="build-hero-gallery">
        {/* Left: View Selector */}
        {hasMultipleViews && (
          <div className="build-view-selector-wrapper">
            <div
              className="build-view-selector"
              role="toolbar"
              aria-label="View controls"
              ref={selectorRef}
            >
              {media.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  className="build-view-button"
                  onClick={() => handleViewChange(idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  aria-pressed={idx === activeIndex}
                  aria-label={item.label}
                >
                  {item.type === 'video' ? (
                    <div className="build-view-video-preview">
                      {item.poster ? (
                        <ModeImage src={item.poster} alt={item.label} fill sizes="104px" />
                      ) : null}
                      <Play className="build-view-play-icon" size={20} strokeWidth={2} />
                    </div>
                  ) : item.src ? (
                    <ModeImage
                      src={item.src}
                      alt={item.alt || item.label}
                      fill
                      sizes="104px"
                    />
                  ) : (
                    <div
                      className={`build-view-empty build-view-empty--${build.category}`}
                      aria-hidden="true"
                    />
                  )}
                </button>
              ))}
            </div>

            <div className={`build-view-more${showDown ? ' build-view-more--visible' : ''}`} aria-hidden="true">
              <ChevronDown size={16} strokeWidth={2} />
            </div>
          </div>
        )}

        {/* Right: Large Display */}
        <div className="build-hero-display">
          {activeMedia?.src ? (
            activeMedia.type === 'video' ? (
              <video
                ref={videoRef}
                src={activeMedia.src}
                poster={activeMedia.poster}
                controls
                className="build-hero-video"
                aria-label={`${build.title} video`}
              >
                <track kind="captions" />
              </video>
            ) : (
              <ModeImage
                src={activeMedia.src}
                alt={activeMedia.alt || build.title}
                fill
                sizes="(max-width: 700px) 100vw, (max-width: 1200px) 80vw, 1200px"
                priority
                data-mode-exempt="true"
              />
            )
          ) : (
            <div
              className={`build-empty-display build-empty-display--${build.category}`}
              aria-hidden="true"
            />
          )}

          {/* Title Overlay */}
          <div className="build-hero-title-overlay">
            <p className="build-hero-collection">{build.collectionLabel || build.categoryLabel}</p>
            <h1 className="build-hero-title">{build.title}</h1>
            {build.quote && (
              <p className="build-hero-quote">
                &ldquo;{build.quote}&rdquo;
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
