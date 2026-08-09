'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ScrollReveal from '@/components/animation/ScrollReveal';
import { Bookmark, ArrowRight } from 'lucide-react';
import type { JournalArticle } from '@/data/journalArticles';

export default function JournalCard({ article, index }: { article: JournalArticle; index: number }) {
  const [bookmarked, setBookmarked] = useState(false);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarked((s)=>!s);
  };

  return (
    <ScrollReveal delay={index * 80}>
      <article className="journal-card" data-slug={article.slug}>
        <div className="journal-media-placeholder" aria-hidden>
          {/* intentionally blank media area */}
        </div>

        <div className="journal-card-content">
          <div className="journal-card-top">
            <span className={`journal-category journal-cat-${article.category}`}>{article.category.replace(/-/g, ' ').toUpperCase()}</span>
            <div className="journal-actions">
              <button className={`bookmark-btn journal-interactive ${bookmarked ? 'bookmarked' : ''}`} onClick={toggleBookmark} aria-pressed={bookmarked} aria-label="Bookmark article">
                <Bookmark />
              </button>
            </div>
          </div>

          <h3 className="journal-card-title">{article.title}</h3>
          <blockquote className="journal-card-quote">{article.quote}</blockquote>
          <p className="journal-card-body">{article.description}</p>

          <div className="journal-card-meta">
            <span>{article.author}</span>
            <span className="sep">·</span>
            <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <span className="sep">·</span>
            <span>{article.readTime}</span>
            <span className="sep">·</span>
            <span>{article.views}</span>

            <Link href={`/journal/${article.slug}`} className="journal-read-link journal-link">
              <span>Read</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </article>
    </ScrollReveal>
  );
}
