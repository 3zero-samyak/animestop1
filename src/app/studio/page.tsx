import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function StudioPage() {
  return (
    <>
      <Header />
      <main>
        <article className="interior-page">
          <h1 className="interior-page-title">The Studio</h1>
          
          <p className="interior-page-intro">
            The AnimeStop studio is where fan memories move from conversation to concept.
          </p>

          <section className="interior-page-section">
            <h2 className="interior-page-section-title">LISTEN</h2>
            <p>
              Fans share a scene, emotion, lesson, or theory. Each submission is treated as a window into what makes anime personally meaningful.
            </p>
          </section>

          <section className="interior-page-section">
            <h2 className="interior-page-section-title">RESEARCH</h2>
            <p>
              The studio studies the theme, symbolism, visual language, and emotional context. We explore the cultural and narrative layers that give a moment its weight.
            </p>
          </section>

          <section className="interior-page-section">
            <h2 className="interior-page-section-title">CONCEPT</h2>
            <p>
              Original concepts are developed without copying existing official artwork or products. Our goal is to create something that honors the source while offering a fresh, personal interpretation.
            </p>
          </section>

          <section className="interior-page-section">
            <h2 className="interior-page-section-title">REFINE</h2>
            <p>
              Composition, material direction, and presentation are refined through multiple iterations. Each decision is guided by respect for the original moment and the fan who shared it.
            </p>
          </section>

          <section className="interior-page-section">
            <h2 className="interior-page-section-title">BUILD</h2>
            <p>
              Selected ideas may become a future AnimeStop feature or collection concept. Not every story will be produced, but every story contributes to our understanding of what resonates.
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
