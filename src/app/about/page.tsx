import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AboutHero from '@/components/about/AboutHero';
import WhatIsAnimeStop from '@/components/about/WhatIsAnimeStop';
import AnimeMangaModes from '@/components/about/AnimeMangaModes';
import WhatWeCreate from '@/components/about/WhatWeCreate';
import HowItWorks from '@/components/about/HowItWorks';
import WhyAnimeStop from '@/components/about/WhyAnimeStop';
import HobbyDisclaimer from '@/components/about/HobbyDisclaimer';
import NewsletterSection from '@/components/home/NewsletterSection';

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="about-page">
        <AboutHero />
        <WhatIsAnimeStop />
        <AnimeMangaModes />
        <WhatWeCreate />
        <HowItWorks />
        <WhyAnimeStop />
        <HobbyDisclaimer />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
