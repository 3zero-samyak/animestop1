import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import WhatIsAnimeStop from '@/components/home/WhatIsAnimeStop';
import ExploreCollections from '@/components/home/ExploreCollections';
import HowItWorks from '@/components/home/HowItWorks';
import MemoryWall from '@/components/home/MemoryWall';
import CommunitySection from '@/components/home/CommunitySection';
import AnimeNews from '@/components/home/AnimeNews';
import NewsletterSection from '@/components/home/NewsletterSection';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <WhatIsAnimeStop />
        <ExploreCollections />
        <HowItWorks />
        <MemoryWall />
        <CommunitySection />
        <AnimeNews />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}

