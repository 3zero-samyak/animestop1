import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StoriesHero from '@/components/stories/StoriesHero';
import StoriesShowcase from '@/components/stories/StoriesShowcase';

export const metadata = {
  title: 'Stories | AnimeStop - Relive Your Favorite Anime Moments',
  description: 'Discover and collect pieces from the anime scenes that moved you. These are not just collectibles—they are pieces of your memories.',
  keywords: ['anime stories', 'anime collectibles', 'anime moments', 'anime memories'],
};

export default function StoriesPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section with breadcrumb, text, and Your Journey card */}
        <StoriesHero />

        {/* Featured Stories Showcase - Editorial Four-Card Layout */}
        <StoriesShowcase />
      </main>
      <Footer />
    </>
  );
}
