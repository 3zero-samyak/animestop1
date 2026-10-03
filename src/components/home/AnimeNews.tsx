import React from 'react';
import ModeImage from '@/components/media/ModeImage';
import Container from '@/components/ui/Container';
import { ExternalLink } from 'lucide-react';
import { getAnimeNewsItems } from '@/lib/animeNews';

export default async function AnimeNews() {
  const newsItems = await getAnimeNewsItems(4);

  return (
    <section className="anime-news-section">
      <Container size="large" className="anime-news-container">
        <div className="anime-news-header">
          <div>
            <h2 className="anime-news-heading">ANIME NEWS</h2>
            <p className="anime-news-subheading">Latest updates from the anime world</p>
          </div>
        </div>

        {newsItems.length > 0 ? (
          <div className="anime-news-grid">
            {newsItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="anime-news-item"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${item.title} — opens on ${item.publisher}`}
              >
                <div className="anime-news-item-thumb" data-mode-image-container>
                  <ModeImage
                    src={item.thumbnail}
                    alt={`${item.publisher} article thumbnail`}
                    fill
                    sizes="(max-width: 760px) 100vw, 50vw"
                    className="anime-news-item-thumb-image"
                  />
                </div>

                <div className="anime-news-item-content">
                  <h3 className="anime-news-item-title">{item.title}</h3>

                  <div className="anime-news-item-meta">
                    <span className="anime-news-meta-source">{item.publisher}</span>
                    <span className="anime-news-meta-category">{item.category}</span>
                    <span className="anime-news-meta-date">{item.publishedLabel}</span>
                  </div>
                </div>

                <ExternalLink className="anime-news-item-external" aria-hidden="true" />
              </a>
            ))}
          </div>
        ) : (
          <div className="collection-browser-empty" role="status">
            <h3 className="collection-browser-empty-heading">NEWS CURRENTLY UNAVAILABLE</h3>
            <p className="collection-browser-empty-copy">External anime news feeds are temporarily unavailable. Please check back soon.</p>
          </div>
        )}

        <div className="anime-news-disclaimer">
          Headlines, dates and publisher names remain the property of their respective publishers. AnimeStop links directly to the original article.
        </div>
      </Container>
    </section>
  );
}
