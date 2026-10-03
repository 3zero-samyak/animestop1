import { formatCollectionDate } from './catalog';

export type AnimeNewsSource = 'Anime News Network' | 'Anime Corner' | 'MyAnimeList';

export type AnimeNewsItem = {
  id: string;
  title: string;
  href: string;
  publisher: AnimeNewsSource;
  publishedAt: string;
  publishedLabel: string;
  category: string;
  thumbnail: string;
};

type FeedConfig = {
  publisher: AnimeNewsSource;
  url: string;
  allowedHosts: string[];
};

const FEEDS: FeedConfig[] = [
  {
    publisher: 'Anime News Network',
    url: 'https://www.animenewsnetwork.com/news/rss.xml?ann-edition=us',
    allowedHosts: ['www.animenewsnetwork.com', 'animenewsnetwork.com'],
  },
  {
    publisher: 'Anime Corner',
    url: 'https://animecorner.me/feed/',
    allowedHosts: ['animecorner.me', 'www.animecorner.me'],
  },
  {
    publisher: 'MyAnimeList',
    url: 'https://myanimelist.net/rss/news.xml',
    allowedHosts: ['myanimelist.net', 'www.myanimelist.net'],
  },
];

const NEWS_THUMBNAILS = {
  'Anime News Network': '/generated/stories-05.svg',
  'Anime Corner': '/generated/possibilities-01.svg',
  'MyAnimeList': '/generated/vault-02.svg',
} satisfies Record<AnimeNewsSource, string>;

function decodeXml(value: string) {
  return value
    .replace(/<!\[CDATA\[|\]\]>/g, '')
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTag(block: string, tagName: string) {
  const match = block.match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\/${tagName}>`, 'i'));
  return match ? decodeXml(match[1]) : '';
}

function extractAllTags(block: string, tagName: string) {
  return Array.from(block.matchAll(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\/${tagName}>`, 'ig')))
    .map((match) => decodeXml(match[1]))
    .filter(Boolean);
}

function parsePubDate(raw: string) {
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isAllowedNewsUrl(raw: string, allowedHosts: string[]) {
  try {
    const url = new URL(raw);
    return url.protocol === 'https:' && allowedHosts.includes(url.hostname);
  } catch {
    return false;
  }
}

async function fetchFeed(feed: FeedConfig) {
  const response = await fetch(feed.url, {
    next: { revalidate: 3600 },
    headers: {
      Accept: 'application/rss+xml, application/xml, text/xml',
      'User-Agent': 'AnimeStop/1.0 (+https://animestop.vercel.app)',
    },
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${feed.publisher} feed`);
  }

  const xml = await response.text();
  const itemBlocks = xml.match(/<item>([\s\S]*?)<\/item>/gi) ?? [];

  return itemBlocks
    .map((itemBlock, index) => {
      const title = extractTag(itemBlock, 'title');
      const href = extractTag(itemBlock, 'link');
      const publishedAt = extractTag(itemBlock, 'pubDate');
      const categories = extractAllTags(itemBlock, 'category');
      const category = categories[0] || 'News';
      const parsedDate = parsePubDate(publishedAt);

      if (!title || !href || !parsedDate || !isAllowedNewsUrl(href, feed.allowedHosts)) {
        return null;
      }

      return {
        id: `${feed.publisher}-${index}-${href}`,
        title,
        href,
        publisher: feed.publisher,
        publishedAt: parsedDate.toISOString(),
        publishedLabel: formatCollectionDate(parsedDate.toISOString()),
        category,
        thumbnail: NEWS_THUMBNAILS[feed.publisher],
      } satisfies AnimeNewsItem;
    })
    .filter((item): item is AnimeNewsItem => Boolean(item));
}

export async function getAnimeNewsItems(limit = 6): Promise<AnimeNewsItem[]> {
  const settled = await Promise.allSettled(FEEDS.map((feed) => fetchFeed(feed)));
  const byLink = new Map<string, AnimeNewsItem>();

  for (const result of settled) {
    if (result.status !== 'fulfilled') {
      continue;
    }

    for (const item of result.value) {
      const existing = byLink.get(item.href);
      if (!existing || new Date(item.publishedAt).getTime() > new Date(existing.publishedAt).getTime()) {
        byLink.set(item.href, item);
      }
    }
  }

  return Array.from(byLink.values())
    .sort((left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime())
    .slice(0, limit);
}
