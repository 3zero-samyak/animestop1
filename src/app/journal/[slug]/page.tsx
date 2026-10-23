import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Eye, Calendar, User, Sparkles } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/ui/Container';
import { JOURNAL_ARTICLES } from '@/data/journalArticles';

interface JournalArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: JournalArticlePageProps) {
  const { slug } = await params;
  const article = JOURNAL_ARTICLES.find((a) => a.slug === slug);
  if (!article) {
    return {
      title: 'Article Not Found | AnimeStop Journal',
    };
  }
  return {
    title: `${article.title} | AnimeStop Journal`,
    description: article.description,
  };
}

export default async function JournalArticlePage({ params }: JournalArticlePageProps) {
  const { slug } = await params;
  const article = JOURNAL_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return (
      <>
        <Header />
        <main className="min-h-screen py-20" style={{ backgroundColor: 'var(--background)' }}>
          <Container size="default">
            <div className="text-center py-16 space-y-4 max-w-xl mx-auto">
              <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Article not found
              </h1>
              <p style={{ color: 'var(--text-muted)' }}>
                The journal article you are looking for does not exist or may have been moved.
              </p>
              <div className="pt-4">
                <Link
                  href="/journal"
                  className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-lg text-white"
                  style={{ backgroundColor: 'var(--accent-primary)' }}
                >
                  <ArrowLeft size={16} /> Return to Journal
                </Link>
              </div>
            </div>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen py-12 lg:py-20" style={{ backgroundColor: 'var(--background)' }}>
        <Container size="default">
          <div className="max-w-3xl mx-auto">
            {/* Breadcrumb / Back Link */}
            <div className="mb-8">
              <Link
                href="/journal"
                className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:text-[var(--accent-primary)]"
                style={{ color: 'var(--text-muted)' }}
              >
                <ArrowLeft size={16} /> Back to All Articles
              </Link>
            </div>

            <article className="space-y-10">
              {/* Header */}
              <header className="space-y-6">
                <div className="flex items-center gap-2">
                  <span
                    className="px-3 py-1 text-xs font-bold tracking-wider uppercase rounded-full"
                    style={{
                      backgroundColor: 'var(--accent-soft)',
                      color: 'var(--accent-primary)',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    {article.category.replace(/-/g, ' ')}
                  </span>
                </div>

                <h1
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {article.title}
                </h1>

                {/* Metadata Bar */}
                <div
                  className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm py-4 border-y"
                  style={{
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-muted)',
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <User size={16} className="text-[var(--accent-primary)]" />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={16} />
                    <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={16} />
                    <span>{article.readTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Eye size={16} />
                    <span>{article.views} views</span>
                  </div>
                </div>
              </header>

              {/* Pull Quote */}
              {article.quote && (
                <blockquote
                  className="p-6 sm:p-8 rounded-xl border-l-4 my-8"
                  style={{
                    backgroundColor: 'var(--surface-primary)',
                    borderColor: 'var(--accent-primary)',
                    borderTop: '1px solid var(--border-color)',
                    borderRight: '1px solid var(--border-color)',
                    borderBottom: '1px solid var(--border-color)',
                  }}
                >
                  <p
                    className="text-xl sm:text-2xl italic font-stylish leading-relaxed"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {article.quote}
                  </p>
                </blockquote>
              )}

              {/* Article Content */}
              <div
                className="text-base sm:text-lg leading-relaxed space-y-6"
                style={{ color: 'var(--text-secondary)' }}
              >
                <p className="text-xl sm:text-2xl font-light leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  {article.description}
                </p>

                {article.content && article.content.length > 0 ? (
                  article.content.map((paragraph, idx) => (
                    <p key={idx} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <div
                    className="p-6 rounded-lg border my-6 space-y-3"
                    style={{
                      backgroundColor: 'var(--surface-primary)',
                      borderColor: 'var(--border-color)',
                    }}
                  >
                    <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      Editorial Preview
                    </span>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      This entry is undergoing final curatorial review by the AnimeStop studio team. The full reflection will be released shortly.
                    </p>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <footer
                className="pt-8 border-t flex flex-wrap items-center justify-between gap-4"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <Link
                  href="/share-story"
                  className="inline-flex items-center gap-2 text-sm font-semibold hover:underline"
                  style={{ color: 'var(--accent-primary)' }}
                >
                  <Sparkles size={16} /> Have a reflection to share? Submit your memory →
                </Link>
                <Link
                  href="/journal"
                  className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                  style={{
                    backgroundColor: 'var(--surface-primary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                >
                  Explore More Articles
                </Link>
              </footer>
            </article>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
