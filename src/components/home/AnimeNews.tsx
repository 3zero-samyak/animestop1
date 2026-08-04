import React from 'react';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import { FileText, Globe, TvMinimal, Calendar, ExternalLink } from 'lucide-react';

type AnimeNewsItem = {
  id: string;
  title: string;
  summary: string;
  category: string;
  region?: string;
  dateLabel?: string;
  sourceLabel?: string;
  href: string;
  icon: 'announcement' | 'event' | 'release' | 'festival';
};

const newsItems: AnimeNewsItem[] = [
  {
    id: '1',
    title: 'NEW ANIME SEASON ANNOUNCEMENTS FOR WINTER 2025',
    summary: 'Major studios announce their upcoming winter lineup with several highly anticipated sequels.',
    category: 'ANNOUNCEMENTS',
    region: 'GLOBAL',
    dateLabel: '25 DECEMBER 2024',
    sourceLabel: 'ANILIST',
    href: '#',
    icon: 'announcement',
  },
  {
    id: '2',
    title: 'COMIC CON INDIA 2025 DATES REVEALED',
    summary: "India's biggest pop culture convention returns with special anime guests.",
    category: 'EVENTS',
    region: 'INDIA',
    dateLabel: '23 DECEMBER 2024',
    sourceLabel: 'ANIMECON INDIA',
    href: '#',
    icon: 'event',
  },
  {
    id: '3',
    title: 'POPULAR SHONEN SERIES GETS NEW SEASON',
    summary: 'Fan-favorite action series confirmed for continuation with new studio.',
    category: 'EPISODES + RELEASES',
    region: 'GLOBAL',
    dateLabel: '26 DECEMBER 2024',
    sourceLabel: 'CRUNCHYROLL',
    href: '#',
    icon: 'release',
  },
  {
    id: '4',
    title: 'ANIME FILM FESTIVAL COMING TO MUMBAI',
    summary: 'Special screenings of classic and new anime films across multiple cities.',
    category: 'EVENTS',
    region: 'INDIA',
    dateLabel: '25 DECEMBER 2024',
    sourceLabel: 'BOOKMYSHOW',
    href: '#',
    icon: 'festival',
  },
];

const iconMap = {
  announcement: FileText,
  event: Calendar,
  release: TvMinimal,
  festival: Globe,
};

export default function AnimeNews() {
  return (
    <section className="anime-news-section">
      <Container size="large" className="anime-news-container">
        <div className="anime-news-header">
          <div>
            <h2 className="anime-news-heading">ANIME NEWS</h2>
            <p className="anime-news-subheading">Latest updates from the anime world</p>
          </div>
          <Link href="/news" className="anime-news-all-link">
            ALL NEWS →
          </Link>
        </div>

        <div className="anime-news-grid">
          {newsItems.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <Link key={item.id} href={item.href} className="anime-news-item">
                <div className="anime-news-item-icon">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>

                <div className="anime-news-item-content">
                  <h3 className="anime-news-item-title">{item.title}</h3>
                  <p className="anime-news-item-summary">{item.summary}</p>
                  
                  <div className="anime-news-item-meta">
                    {item.region && <span className="anime-news-meta-region"><Globe className="w-3 h-3" /> {item.region}</span>}
                    <span className="anime-news-meta-category">{item.category}</span>
                    {item.dateLabel && <span className="anime-news-meta-date">{item.dateLabel}</span>}
                    {item.sourceLabel && <span className="anime-news-meta-source">{item.sourceLabel}</span>}
                  </div>
                </div>

                <ExternalLink className="anime-news-item-external" aria-hidden="true" />
              </Link>
            );
          })}
        </div>

        <div className="anime-news-disclaimer">
          News headlines belong to their respective publishers.
        </div>
      </Container>
    </section>
  );
}
