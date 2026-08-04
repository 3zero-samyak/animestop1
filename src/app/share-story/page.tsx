import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ShareStoryForm from '@/components/forms/ShareStoryForm';

export default function ShareStoryPage() {
  return (
    <>
      <Header />
      <main>
        <article className="interior-page">
          <h1 className="interior-page-title">Share Your Story</h1>
          
          <p className="interior-page-intro">
            Tell us about an anime scene, lesson, emotion, or theory that stayed with you.
          </p>

          <section className="interior-page-section">
            <h2 className="interior-page-section-title">WHAT WE ARE LOOKING FOR</h2>
            <p>
              Submissions should focus on a specific moment, idea, or emotion rather than general fandom or character enthusiasm. We want to understand what made this meaningful to you personally.
            </p>
          </section>

          <section className="interior-page-section">
            <h2 className="interior-page-section-title">WHAT HAPPENS NEXT</h2>
            <p>
              Selected stories may become featured editorial content, concept inspiration, or future AnimeStop builds. Not every submission will be produced, but each one contributes to our understanding of the community.
            </p>
          </section>

          <ShareStoryForm />
        </article>
      </main>
      <Footer />
    </>
  );
}
