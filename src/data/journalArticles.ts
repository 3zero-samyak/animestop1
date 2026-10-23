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
  content: string[];
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
    content: [
      'It was roughly 2:30 in the morning. An episode had just finished, the monitor cast a quiet glow across a cluttered desk, and the credits were scrolling by to a track that made the whole room feel suddenly still. Looking over at the standard commercial action figures sitting on the shelf, an uncomfortable realization hit: none of them captured what made that episode matter.',
      'Most mass-market figures were static, plastic stand-ins designed for retail pegs—devoid of environment, devoid of atmosphere, and stripped of the actual narrative weight that made millions of people tear up on a Tuesday night. Where was the rain on the pavement? Where was the crack of broken armor? Where was the silence before the final strike?',
      'That night, the first thumbnail sketch was drawn on the back of a receipt. It was not a blueprint for merchandise; it was an attempt to crystallize a pivotal scene into a three-dimensional shadow box that could live on a wall like a window into another world. That single drawing set the standard for what AnimeStop would become.',
      'From day one, the vision was clear: build for the fans who remember the feelings, not just the franchise names. We design original display concepts—dioramas, busts, wall reliefs, and curated memorabilia—crafted with reverence for the storytellers who gave us those memories in the first place.',
    ],
  },
  {
    id: '2',
    slug: 'what-makes-a-story-unforgettable',
    category: 'story-deep-dive',
    title: 'What Makes a Story Unforgettable?',
    quote: '"It\'s not the power. It\'s the emotion."',
    description: 'Exploring the elements that turn a simple plot into a memory that stays forever.',
    author: 'AnimeStop Editorial',
    date: '2026-05-16',
    readTime: '7 min read',
    views: '982',
    content: [
      'Every anime season brings dozens of high-budget releases packed with dazzling sakuga animation, apocalyptic stakes, and god-tier power rankings. Yet twelve months later, most fade from cultural memory. What separates ephemeral entertainment from the series that fans carry with them for decades?',
      'The answer is almost never spectacle alone. Unforgettable stories are anchored in profound personal stakes and emotional friction. When an author forces a protagonist to confront irreparable loss or make an agonizing moral compromise, the narrative shifts from an external spectacle to an internal reflection.',
      'Consider the moments we remember most vividly: the quiet handover of a straw hat on a weathered pier, the solemn parting of brothers under an overcast sky, or the exhausted smile of a mentor who knows their pupil has surpassed them. In each case, it is the emotional resolution—often accompanied by music and deliberate visual pacing—that embeds itself in our memory.',
      'When designing physical concepts, this is the guiding compass. We do not ask "What looks flashy?" We ask "What was the emotional crux of this moment?" If a display piece can trigger the exact goosebumps you felt when the dialogue stopped and the theme kicked in, the piece has done its job.',
    ],
  },
  {
    id: '3',
    slug: 'lessons-anime-taught-me-about-life',
    category: 'reflection',
    title: 'Lessons Anime Taught Me About Life',
    quote: '"Pain shapes you. People change you."',
    description: 'Some of the real-life lessons we carry long after the episode ends.',
    author: 'AnimeStop Community',
    date: '2026-05-14',
    readTime: '6 min read',
    views: '1.6K',
    content: [
      'For many of us who grew up with anime and manga, the stories were far more than casual weekend pastimes. They were supplementary compasses during turbulent teenage years, quiet companions through lonely transitions, and unexpected teachers of adult ethics.',
      'Series like Fullmetal Alchemist taught us the unbending law of equivalent exchange—that nothing meaningful is gained without genuine sacrifice, discipline, and accountability. Gurren Lagann taught us that self-doubt is natural, but believing in someone who believes in you can be enough to start taking steps forward.',
      'Perhaps most importantly, anime taught us how to grieve honestly. Rather than glossing over loss with quick fixes, stories like Violet Evergarden and Demon Slayer show characters carrying their grief like heavy cloaks while still choosing to extend kindness to strangers.',
      'Having a tangible reminder of these lessons in our living spaces is not about holding onto fantasy—it is about keeping our moral compass in plain view when everyday reality demands courage, patience, and empathy.',
    ],
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
    content: [
      'In masterclass character design, every millimeter of silhouette communicates backstory before a single line of dialogue is spoken. The way a cloak frays at the hem hints at terrain traveled; the tension in a stance reveals years of defensive combat; a chipped sword guard hints at an encounter that nearly proved fatal.',
      'When we translate 2D animated concepts into three-dimensional display designs, the hardest challenge is preserving this narrative fidelity. A flat illustration can imply weight with simple shading, but in physical space, shadows, gravity, and texture must be physically engineered.',
      'Our studio iterates through dozens of physical test mockups to evaluate how natural room light interacts with the materials. A matte finish on leather armor grounds the piece in reality, while subtle metallic accents on weapon edges catch incidental sunlight.',
      'The goal is simple: when someone walks into your room and notices the display, their gaze should not just register a shape—it should instinctively begin reading the character\'s journey.',
    ],
  },
  {
    id: '5',
    slug: 'letters-to-animestop',
    category: 'community',
    title: 'Letters to AnimeStop',
    quote: '"You\'re not just fans. You\'re part of the story."',
    description: 'Thoughts, memories and messages shared by the AnimeStop community.',
    author: 'The Circle Contributors',
    date: '2026-05-10',
    readTime: '3 min read',
    views: '2.3K',
    content: [
      'Every week, the AnimeStop inbox receives messages from creators, hobbyists, and lifelong fans around the world. These are not customer support tickets—they are personal stories of connection, craft, and shared memories.',
      'One fan wrote about rediscovering hand-drawn animation during a six-month recovery in a hospital ward, finding in the quiet episodes of mushi and nature a renewed appreciation for daily life. Another shared sketches of an elaborate wooden display cabinet built by hand with their grandfather to hold their favorite manga volumes.',
      'These messages remind us why AnimeStop was created. It was never intended to be an algorithmic storefront or a corporate hype machine. It exists as a creative sanctuary—a home where fan passion and maker craftsmanship meet.',
      'We read every letter and submission. They guide our future diorama sketches, influence which moments we spotlight, and reaffirm that the stories we love are always bigger than any one of us.',
    ],
  },
  {
    id: '6',
    slug: 'making-scenes-meaningful',
    category: 'creator-note',
    title: 'Making Scenes Meaningful',
    quote: '"Details speak louder than drama."',
    description: 'How tiny details can change a whole scene.',
    author: 'AnimeStop Studio',
    date: '2026-05-08',
    readTime: '5 min read',
    views: '640',
    content: [
      'There is a common pitfall in display design: assuming that more visual chaos equals more impact. Exploding rocks, neon fireballs, and screaming poses certainly grab attention, but they rarely create lasting emotional connection.',
      'True narrative depth frequently lives in the micro-details and negative space. The discarded umbrella on a train platform. The single blooming sunflower in an abandoned battlefield. The steam rising off a bowl of ramen while two friends talk in hushed tones after a grueling mission.',
      'In our physical builds, we give deliberate space to stillness. By balancing high-detail focal points with calm, textural surfaces, the eye naturally drifts to the storytelling elements that matter most.',
      'When an art piece respects your room by choosing atmospheric presence over garish volume, it becomes a lasting companion to your daily living space rather than visual clutter.',
    ],
  },
  {
    id: '7',
    slug: 'the-color-of-memory',
    category: 'reflection',
    title: 'The Color of Memory',
    quote: '"Hue is mood, mood is memory."',
    description: 'Exploring color psychology in visual storytelling.',
    author: 'AnimeStop Editorial',
    date: '2026-05-06',
    readTime: '6 min read',
    views: '880',
    content: [
      'Why does the palette of 1990s hand-painted cel animation feel so profoundly warm, while modern digital saturation can sometimes feel cold despite its technical perfection? The difference lies in color psychology and physical medium limitations.',
      'Cel paints were blended by hand on acetate sheets, resulting in subtle organic variations and warm earthy midtones. When projected onto film, the colors acquired a softness that mirrored human memory itself—slightly blurred at the edges, grounded in natural light, and steeped in nostalgia.',
      'In both our Anime and Manga modes, color temperature is treated with the utmost intentionality. Anime mode pairs deep charcoal backgrounds with incandescent ember tones to evoke the feeling of watching an epic climax in a darkened theater. Manga mode uses warm unbleached paper tones and rich ink blacks to honor the tactile sensation of turning physical pages.',
      'Color is not just styling; it is the emotional key that unlocks the door to your favorite moments.',
    ],
  },
];
