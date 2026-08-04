import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function BeforeYouBeginPage() {
  return (
    <>
      <Header />
      <main>
        <article className="interior-page">
          <h1 className="interior-page-title">Before You Begin</h1>
          
          <p className="interior-page-intro">
            AnimeStop is a fan-led creative project built around the memories, ideas, and emotions inspired by anime.
          </p>

          <section className="interior-page-section">
            <h2 className="interior-page-section-title">FAN-LED, NOT OFFICIAL</h2>
            <p>
              AnimeStop is not affiliated with, endorsed by, or sponsored by anime studios, publishers, streaming services, or rights holders unless explicitly stated. All content and concepts are created independently by fans, for fans.
            </p>
          </section>

          <section className="interior-page-section">
            <h2 className="interior-page-section-title">ORIGINAL PRESENTATION</h2>
            <p>
              AnimeStop&apos;s interface, writing, concepts, and visual compositions are developed to be original. We respect the source material while creating interpretations that are distinctly our own.
            </p>
          </section>

          <section className="interior-page-section">
            <h2 className="interior-page-section-title">IMAGES AND CONCEPTS</h2>
            <p>
              Temporary or illustrative imagery may later be replaced by approved original artwork. All visual content is used with care and intention, and any placeholder assets will be updated as the project matures.
            </p>
          </section>

          <section className="interior-page-section">
            <h2 className="interior-page-section-title">SUBMISSIONS</h2>
            <p>
              Sharing a story does not guarantee publication or production. Every submission is valued, but not every idea will become a featured build or editorial piece. Your contribution helps shape what AnimeStop becomes.
            </p>
          </section>

          <section className="interior-page-section">
            <h2 className="interior-page-section-title">FUTURE AVAILABILITY</h2>
            <p>
              Collection availability, pricing, delivery, and purchasing terms will be confirmed before commerce is enabled. Until that time, no orders or commitments are being accepted.
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
