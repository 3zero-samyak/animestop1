import React from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const articles = [
  {
    id: 1,
    title: "Why We Build\n'Set Your Heart Ablaze'",
    timeAgo: '2 days ago',
    image: '',
  },
  {
    id: 2,
    title: 'The Beauty of\nAlternate Realities',
    timeAgo: '5 days ago',
    image: '',
  },
  {
    id: 3,
    title: 'Behind The Build:\nMemory Rewind',
    timeAgo: '1 week ago',
    image: '',
  },
];

export default function JournalSection() {
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
        >
          JOURNAL
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
          {articles.map((article) => (
            <button
              key={article.id}
              className="journal-article"
            >
              {/* Thumbnail */}
              <div className="journal-thumbnail">
                <div 
                  className="w-full h-full bg-cover bg-center rounded-md"
                  style={{
                    backgroundColor: 'var(--surface-secondary)',
                  }}
                />
              </div>
              
              {/* Content */}
              <div className="journal-article-copy">
                <h3 className="journal-article-title">
                  {article.title}
                </h3>
                <p className="journal-article-time">
                  {article.timeAgo}
                </p>
              </div>
            </button>
          ))}
        </div>
        
        {/* Read All Button */}
        <Link href="/journal" className="journal-all-link">
          <span className="text-sm font-medium">Read All Articles</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
}
