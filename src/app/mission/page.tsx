import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function MissionPage() {
  return (
    <>
      <Header />
      <main>
        <article className="interior-page">
          <h1 className="interior-page-title">Our Mission</h1>
          
          <p className="interior-page-intro">
            AnimeStop exists to preserve the scenes, emotions and ideas that stay with anime fans long after an episode ends.
          </p>

          <section className="interior-page-section">
            <h2 className="interior-page-section-title">WHY WE BUILD</h2>
            <p>
              AnimeStop begins with meaningful scenes, lessons, emotions and fan memories rather than generic merchandise. Every concept should connect to a moment that resonated, a lesson that stayed, or an emotion that shaped how you see the world.
            </p>
            <p>
              We believe the strongest anime artifacts are those rooted in personal connection and thoughtful reflection.
            </p>
          </section>

          <section className="interior-page-section">
            <h2 className="interior-page-section-title">MEMORIES INTO FORM</h2>
            <p>
              Selected stories may become original visual concepts, display pieces, editorial features, or future fan-led builds. Each concept is developed through research, symbolism, and careful attention to the emotional context that made the moment meaningful.
            </p>
            <p>
              Our goal is to create work that honors the source material while offering fans something distinctly personal.
            </p>
          </section>

          <section className="interior-page-section">
            <h2 className="interior-page-section-title">BUILT WITH FANS</h2>
            <p>
              Fans can share the moments and ideas that matter to them. While we cannot promise that every submission will be produced, each story helps us understand what resonates most deeply with the anime community.
            </p>
            <p>
              Your perspective shapes what AnimeStop becomes.
            </p>
          </section>

          <section className="interior-page-section">
            <h2 className="interior-page-section-title">A COLLECTION WITH MEANING</h2>
            <p>
              Every future build should remain connected to a story, memory, or emotional reason. We do not create products for the sake of filling shelves. Each piece should carry weight, intention, and respect for the moment that inspired it.
            </p>
          </section>

          <div className="interior-page-links">
            <Link href="/stories" className="interior-page-link">
              Explore Stories
              <ArrowRight size={18} />
            </Link>
            <Link href="/share-story" className="interior-page-link">
              Share Your Story
              <ArrowRight size={18} />
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
