import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ContactForm from '@/components/forms/ContactForm';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        <article className="interior-page">
          <h1 className="interior-page-title">DM AnimeStop</h1>
          
          <p className="interior-page-intro">
            Have a question, concern, or idea? Reach out to the AnimeStop team.
          </p>

          <ContactForm />

          <div className="interior-page-links">
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
