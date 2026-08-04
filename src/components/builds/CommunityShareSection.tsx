'use client';

import React from 'react';
import Link from 'next/link';
import { Share2, MessageCircle, Copy, Mail, Globe } from 'lucide-react';

export default function CommunityShareSection() {
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      // Fallback or silent fail
    }
  };

  const handleShare = async (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out this build on AnimeStop!');

    const urls: Record<string, string> = {
      social: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      email: `mailto:?subject=Check%20out%20this%20build&body=${text}%20${url}`,
    };

    if (platform === 'native' && navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this build',
          url: window.location.href,
        });
        return;
      } catch {
        // User cancelled or not supported
      }
    }

    if (platform === 'copy') {
      handleCopyLink();
      return;
    }

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section className="build-community-section">
      <div className="build-community-panel build-community-story">
        <h2 className="build-community-heading">HAVE A STORY?</h2>
        <p className="build-community-text">
          The next build could be yours.
          <br />
          Share a scene, emotion or lesson
          <br />
          that deserves to be remembered.
        </p>
        <Link href="/share-story" className="build-community-cta">
          Share Your Story →
        </Link>
      </div>

      <div className="build-community-panel build-community-share">
        <h2 className="build-community-heading">SHARE THIS MOMENT</h2>
        <p className="build-community-text">
          Love this build? Share it with
          <br />
          your fellow anime fans.
        </p>
        <div className="build-share-icons">
          <button
            type="button"
            className="build-share-button"
            onClick={() => handleShare('native')}
            aria-label="Share"
          >
            <Share2 size={20} strokeWidth={2} />
          </button>
          <button
            type="button"
            className="build-share-button"
            onClick={() => handleShare('social')}
            aria-label="Share on social media"
          >
            <Globe size={20} strokeWidth={2} />
          </button>
          <button
            type="button"
            className="build-share-button"
            onClick={() => handleShare('whatsapp')}
            aria-label="Share on WhatsApp"
          >
            <MessageCircle size={20} strokeWidth={2} />
          </button>
          <button
            type="button"
            className="build-share-button"
            onClick={() => handleShare('email')}
            aria-label="Share via email"
          >
            <Mail size={20} strokeWidth={2} />
          </button>
          <button
            type="button"
            className="build-share-button"
            onClick={() => handleShare('copy')}
            aria-label="Copy link"
          >
            <Copy size={20} strokeWidth={2} />
          </button>
        </div>
      </div>
    </section>
  );
}
