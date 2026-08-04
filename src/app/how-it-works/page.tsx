import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <>
      <Header />
      <main>
        <article className="interior-page">
          <h1 className="interior-page-title">How It Works</h1>

          <section className="interior-page-section">
            <h2 className="interior-page-section-title">1. DISCOVER A STORY</h2>
            <p>
              Browse the Stories collection to explore fan memories, lessons, and moments that have been shared with AnimeStop. Each story captures why a particular scene or idea stayed with someone.
            </p>
          </section>

          <section className="interior-page-section">
            <h2 className="interior-page-section-title">2. SHARE A MOMENT</h2>
            <p>
              Submit your own story about a scene, emotion, theory, or lesson that resonated with you. Tell us what made it meaningful and why it continues to matter.
            </p>
          </section>

          <section className="interior-page-section">
            <h2 className="interior-page-section-title">3. WE DISCUSS IT</h2>
            <p>
              The AnimeStop studio reviews submissions with care, looking for themes, symbolism, and emotional depth. We seek to understand not just what happened, but why it matters.
            </p>
          </section>

          <section className="interior-page-section">
            <h2 className="interior-page-section-title">4. A CONCEPT MAY BEGIN</h2>
            <p>
              Selected stories may inspire original visual concepts, editorial features, or future collection builds. Not every submission will be produced, but each one contributes to our understanding of what resonates with the community.
            </p>
          </section>

          <section className="interior-page-section">
            <h2 className="interior-page-section-title">5. FOLLOW THE JOURNEY</h2>
            <p>
              Track developments through the Journal and Stories sections. As concepts evolve, we share the process, the thinking, and the creative decisions that shape each piece.
            </p>
          </section>

          <div className="interior-page-links">
            <Link href="/stories" className="interior-page-link">
              Browse Stories
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
