import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function JournalArticlePlaceholder({ params }: { params: { slug: string } }) {
  const { slug } = params;
  return (
    <>
      <Header />
      <main className="journal-page-container">
        <section className="journal-article-placeholder">
          <h1>Article placeholder</h1>
          <p>This is a placeholder for: {slug}</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
