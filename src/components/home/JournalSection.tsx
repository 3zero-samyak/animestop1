import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { JOURNAL_ARTICLES } from '@/data/journalArticles';

export default function JournalSection() {
  const featuredArticles = JOURNAL_ARTICLES.slice(0, 3);

  return (
    <article className="community-panel journal-panel">
      <div className="journal-panel-content">
        {/* Header */}
        <header className="journal-header">
          <h2 
            className="text-4xl lg:text-5xl font-bold"
            style={{ 
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-stylish)',
              fontStyle: 'italic',
            }}
          >Journal
          </h2>
          
          <p 
            className="text-sm lg:text-base"
            style={{ color: 'var(--text-muted)', marginTop: '12px' }}
          >
            Thoughts, stories & everything that inspires us.
          </p>
        </header>
        
        {/* Articles List */}
        <div className="journal-article-list">
          {featuredArticles.map((article, idx) => (
            <Link
              key={article.id}
              href={`/journal/${article.slug}`}
              className="journal-article group transition-transform hover:translate-x-1"
            >
              {/* Thumbnail */}
              <div className="journal-thumbnail">
                <div 
                  className="w-full h-full bg-cover bg-center rounded-md mode-sensitive-background"
                  data-mode-sensitive-background="true"
                  style={{
                    backgroundColor: 'var(--surface-secondary)',
                    backgroundImage: `url(/generated/journal-0${(idx % 3) + 1}.svg)`,
                  }}
                />
              </div>
              
              {/* Content */}
              <div className="journal-article-copy">
                <h3 className="journal-article-title group-hover:text-[var(--accent-primary)] transition-colors">
                  {article.title}
                </h3>
                <p className="journal-article-time">
                  {article.readTime} · {article.views} views
                </p>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Read All Button */}
        <Link href="/journal" className="journal-all-link">
          <span className="text-sm font-medium">Read all articles</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
}
