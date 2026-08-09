export type JournalCategory =
  | 'creator-note'
  | 'behind-the-scenes'
  | 'reflection'
  | 'story-deep-dive'
  | 'community';

export type JournalArticle = {
  id: string;
  slug: string;
  category: JournalCategory;
  title: string;
  quote: string;
  description: string;
  author: string;
  date: string; // ISO
  readTime: string;
  views: string;
};

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    id: '1',
    slug: 'the-night-it-all-began',
    category: 'creator-note',
    title: 'The Night It All Began',
    quote: '"Every great story starts with a single spark."',
    description: 'The first idea. The first sketch. The first character that refused to leave our mind.',
    author: 'AnimeStop Creator',
    date: '2026-05-18',
    readTime: '5 min read',
    views: '1.2K',
  },
  {
    id: '2',
    slug: 'what-makes-a-story-unforgettable',
    category: 'story-deep-dive',
    title: 'What Makes a Story Unforgettable?',
    quote: '"It\'s not the power. It\'s the emotion."',
    description: 'Exploring the elements that turn a simple plot into a memory that stays forever.',
    author: 'AnimeStop',
    date: '2026-05-16',
    readTime: '7 min read',
    views: '982',
  },
  {
    id: '3',
    slug: 'lessons-anime-taught-me-about-life',
    category: 'reflection',
    title: 'Lessons Anime Taught Me About Life',
    quote: '"Pain shapes you. People change you."',
    description: 'Some of the real-life lessons we carry long after the episode ends.',
    author: 'AnimeStop',
    date: '2026-05-14',
    readTime: '6 min read',
    views: '1.6K',
  },
  {
    id: '4',
    slug: 'designing-a-character',
    category: 'behind-the-scenes',
    title: 'Designing a Character: More Than Just Looks',
    quote: '"Every scar has a story."',
    description: 'A behind-the-scenes look at how characters become meaningful through detail and intention.',
    author: 'AnimeStop Studio',
    date: '2026-05-12',
    readTime: '4 min read',
    views: '771',
  },
  {
    id: '5',
    slug: 'letters-to-animestop',
    category: 'community',
    title: 'Letters to AnimeStop',
    quote: '"You\'re not just fans. You\'re part of the story."',
    description: 'Thoughts, memories and messages shared by the AnimeStop community.',
    author: 'Community',
    date: '2026-05-10',
    readTime: '3 min read',
    views: '2.3K',
  },
  // Additional placeholders for Load More
  {
    id: '6',
    slug: 'making-scenes-meaningful',
    category: 'creator-note',
    title: 'Making Scenes Meaningful',
    quote: '"Details speak louder than drama."',
    description: 'How tiny details can change a whole scene.',
    author: 'AnimeStop',
    date: '2026-05-08',
    readTime: '5 min read',
    views: '640',
  },
  {
    id: '7',
    slug: 'the-color-of-memory',
    category: 'reflection',
    title: 'The Color of Memory',
    quote: '"Hue is mood, mood is memory."',
    description: 'Exploring color psychology in visual storytelling.',
    author: 'AnimeStop',
    date: '2026-05-06',
    readTime: '6 min read',
    views: '880',
  },
];
