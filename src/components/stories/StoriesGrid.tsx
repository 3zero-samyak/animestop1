'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import StoryCard, { StoryCardData } from './StoryCard';

const stories: StoryCardData[] = [
  {
    id: 'one-piece-no-enemies',
    anime: 'ONE PIECE',
    title: 'I HAVE NO ENEMIES',
    quote: '"A man\'s dream will never end!"',
    image: '',
    href: '/stories/one-piece/no-enemies',
  },
  {
    id: 'naruto-itachi',
    anime: 'NARUTO',
    title: 'WHAT IF ITACHI WAS ACCEPTED?',
    quote: '"In this world. Wherever there is light - there will always be shadows."',
    image: '',
    href: '/stories/naruto/itachi',
  },
  {
    id: 'attack-on-titan-freedom',
    anime: 'ATTACK ON TITAN',
    title: 'FREEDOM IS NOT FREE',
    quote: '"If we don\'t fight, we can\'t win."',
    image: '',
    href: '/stories/attack-on-titan/freedom',
  },
  {
    id: 'demon-slayer-heart-ablaze',
    anime: 'DEMON SLAYER',
    title: 'SET YOUR HEART ABLAZE',
    quote: '"Keep moving forward."',
    image: '',
    href: '/stories/demon-slayer/heart-ablaze',
  },
  {
    id: 'jujutsu-kaisen-strong',
    anime: 'JUJUTSU KAISEN',
    title: 'THE BEAUTY OF BEING STRONG',
    quote: '"The strongest are not always right, but they carry the heaviest burdens."',
    image: '',
    href: '/stories/jujutsu-kaisen/being-strong',
  },
  {
    id: 'bleach-dream',
    anime: 'BLEACH',
    title: 'THE DAY WHO CHASED HIS DREAM',
    quote: '"My heart will always be with you."',
    image: '',
    href: '/stories/bleach/dream',
  },
];

export default function StoriesGrid() {
  return (
    <section 
      className="stories-section"
      style={{ backgroundColor: 'var(--page-bg)' }}
    >
      <div className="stories-container">
        {/* Stories Grid */}
        <div className="stories-grid">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>

        {/* Explore All Stories Button */}
        <div className="stories-all-action">
          <Link 
            href="/stories/all"
            className="stories-all-button"
          >
            <span>Explore All Stories</span>
            <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}
