import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CareersPage() {
  return (
    <>
      <Header />
      <main>
        <article className="interior-page">
          <h1 className="interior-page-title">Careers</h1>
          
          <p className="interior-page-intro">
            AnimeStop is being built as a fan-led creative space for stories, design, and thoughtful anime culture.
          </p>

          <section className="interior-page-section">
            <h2 className="interior-page-section-title">WHO MAY FIT HERE</h2>
            <p>
              We are looking for people who approach anime as a cultural and emotional art form, not just entertainment. Ideal contributors bring curiosity, care, and respect for the community and the stories that shape it.
            </p>
          </section>

          <section className="interior-page-section">
            <h2 className="interior-page-section-title">FUTURE DISCIPLINES</h2>
            <p>
              As AnimeStop grows, we may seek collaborators in:
            </p>
            <ul>
              <li>Editorial writing</li>
              <li>Visual design</li>
              <li>Frontend development</li>
              <li>Concept art</li>
              <li>Community moderation</li>
              <li>Research</li>
            </ul>
          </section>

          <section className="interior-page-section">
            <h2 className="interior-page-section-title">HOW OPPORTUNITIES WILL APPEAR</h2>
            <p>
              <strong>No active roles are currently listed.</strong>
            </p>
            <p>
              Follow future updates through the Journal.
            </p>
          </section>

          <div className="interior-page-links">
            <Link href="/journal" className="interior-page-link">
              Journal
              <ArrowRight size={18} />
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
