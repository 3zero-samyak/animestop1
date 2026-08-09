"use client";

import React, { useMemo, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import JournalHero from '@/components/journal/JournalHero';
import JournalFilters from '@/components/journal/JournalFilters';
import JournalCard from '@/components/journal/JournalCard';
import JournalValuesStrip from '@/components/journal/JournalValuesStrip';
import GlobalJourney from '@/components/layout/GlobalJourney';
import { JOURNAL_ARTICLES, JournalArticle } from '@/data/journalArticles';

export default function JournalPage() {
  const [sort, setSort] = useState('latest');
  const [visibleCount, setVisibleCount] = useState(5);

  const articles = useMemo(() => {
    const list = [...JOURNAL_ARTICLES];
    list.sort((a,b)=> {
      if (sort === 'latest') return new Date(b.date).getTime() - new Date(a.date).getTime();
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    return list;
  }, [sort]);

  const visible = articles.slice(0, visibleCount);

  const loadMore = () => setVisibleCount((s)=>Math.min(articles.length, s+5));

  return (
    <>
      <Header />
      <main className="journal-page-container">
        <JournalHero />

        <section className="journal-controls">
          <JournalFilters sort={sort} onSort={setSort} />
        </section>

        <section className="journal-list">
          {visible.map((article: JournalArticle, idx) => (
            <JournalCard key={article.id} article={article} index={idx} />
          ))}
        </section>

        {visibleCount < articles.length && (
          <div className="journal-load-more">
            <button className="btn outline" onClick={loadMore}>LOAD MORE JOURNALS ↓</button>
          </div>
        )}

        <JournalValuesStrip />

        <GlobalJourney />
      </main>
      <Footer />
    </>
  );
}
