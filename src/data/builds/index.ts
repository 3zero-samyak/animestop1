import { storiesProducts } from '@/data/products/stories';
import { possibilitiesProducts } from '@/data/products/possibilities';
import { essentialsProducts } from '@/data/products/essentials';
import { vaultProducts } from '@/data/products/vault';
import type { ProductDetail } from '@/types/product';

/**
 * Media item for build detail gallery
 */
export type BuildMediaItem = {
  id: string;
  type: 'image' | 'video';
  label: string;
  src?: string;
  poster?: string;
  alt?: string;
  view?: 'video' | 'front' | 'left' | 'right' | 'top' | 'bottom' | 'back' | 'detail';
};

/**
 * Universal build detail type for all product/build cards.
 * All future product/build cards must use BuildDetail data and navigate to /builds/[slug].
 */
export type BuildDetail = {
  id: string;
  slug: string;
  category: 'stories' | 'essentials' | 'possibilities' | 'vault';
  categoryLabel: string;
  collectionLabel?: string;
  franchiseLabel?: string;
  title: string;
  quote?: string;
  quoteAuthor?: string;
  shortDescription: string;
  fullDescription: string;
  image?: string;
  imageAlt?: string;
  media?: BuildMediaItem[];
  gallery?: Array<{ src?: string; alt?: string }>;
  storyHeading?: string;
  storyParagraphs?: string[];
  storyImage?: string;
  storyImageAlt?: string;
  specifications?: Array<{
    label: string;
    value: string;
    icon: 'ruler' | 'box' | 'palette' | 'badge' | 'package' | 'sparkles' | 'layers';
  }>;
  featureBadges?: Array<{
    label: string;
    icon: 'gem' | 'flame' | 'badge' | 'heart' | 'sparkles' | 'shield';
  }>;
  relatedBuildSlugs?: string[];
  requestHref?: string;
};

function makeSlug(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const mapProduct = (p: ProductDetail, category: BuildDetail['category']): BuildDetail => {
  // Do not inject sample images — prefer leaving images undefined when not provided
  return {
    id: p.id,
    slug: p.id ? makeSlug(p.id) : makeSlug(p.title || ''),
    category,
    categoryLabel: category.toUpperCase(),
    collectionLabel: p.category,
    title: p.title,
    shortDescription: p.shortDescription,
    fullDescription: p.fullDescription,
    image: p.image || undefined,
    imageAlt: p.imageAlt || p.title,
    gallery: p.image ? [{ src: p.image, alt: p.imageAlt || p.title }] : undefined,
    // Ensure a normalized media array for the universal product viewer.
    media: ((): BuildMediaItem[] | undefined => {
      // If the original product explicitly includes a gallery, map it.
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const maybeGallery = (p as any).gallery;
      if (Array.isArray(maybeGallery) && maybeGallery.length) {
        return maybeGallery.map((g: any, idx: number) => ({
          id: g.id || `img-${idx}`,
          type: 'image' as const,
          label: g.alt || `Image ${idx + 1}`,
          src: g.src,
          alt: g.alt,
          view: idx === 0 ? 'front' : 'detail',
        }));
      }
      /* eslint-enable @typescript-eslint/no-explicit-any */

      // Fallback to single front image when available
      if (p.image) {
        return [
          {
            id: 'front',
            type: 'image',
            label: 'Front',
            src: p.image,
            alt: p.imageAlt || p.title,
            view: 'front',
          },
        ];
      }

      return undefined;
    })(),
    storyParagraphs: [p.fullDescription, p.inspiration || ''].filter(Boolean),
    storyImage: undefined,
    storyImageAlt: p.title,
    specifications: [
      { label: 'Size', value: p.size || 'Custom', icon: 'ruler' as const },
      { label: 'Materials', value: p.materials || 'Premium Resin', icon: 'palette' as const },
      { label: 'Finish', value: p.finish || 'Hand-Painted', icon: 'layers' as const },
    ].filter((s) => s.value),
    featureBadges: [
      { label: 'Handcrafted', icon: 'heart' },
      { label: 'Limited', icon: 'gem' },
    ],
    relatedBuildSlugs: [],
    requestHref: p.requestHref || '/contact',
  };
};

export const allBuilds: BuildDetail[] = [
  ...storiesProducts.map((p) => mapProduct(p, 'stories')),
  ...possibilitiesProducts.map((p) => mapProduct(p, 'possibilities')),
  ...essentialsProducts.map((p) => mapProduct(p, 'essentials')),
  ...vaultProducts.map((p) => mapProduct(p, 'vault')),
];

// Normalize slug for consistent lookup
function normalizeSlug(slug: string): string {
  return decodeURIComponent(slug).trim().toLowerCase();
}

// Prebuilt map for O(1) lookups
const buildBySlugMap = new Map(
  allBuilds.map((build) => [normalizeSlug(build.slug), build])
);

export function getBuildBySlug(slug: string) {
  return buildBySlugMap.get(normalizeSlug(slug)) || null;
}

export function getAllBuildSlugs() {
  return allBuilds.map((b) => b.slug);
}

export function getRelatedBuilds(build: BuildDetail, limit = 4) {
  return allBuilds
    .filter((b) => b.category === build.category && b.id !== build.id)
    .slice(0, limit);
}

export function getBuildCategoryRoute(build: BuildDetail) {
  return `/${build.category}`;
}

// Development-time validation
if (process.env.NODE_ENV === 'development') {
  const seen = new Set<string>();
  const duplicates: string[] = [];
  const missingSlug: string[] = [];

  for (const build of allBuilds) {
    if (!build.slug?.trim()) {
      missingSlug.push(build.title || build.id);
      continue;
    }

    const normalized = normalizeSlug(build.slug);
    if (seen.has(normalized)) {
      duplicates.push(normalized);
    }
    seen.add(normalized);
  }

  if (missingSlug.length > 0) {
    console.error('⚠️ Builds with missing slugs:', missingSlug);
  }

  if (duplicates.length > 0) {
    console.error('⚠️ Duplicate slugs detected:', duplicates);
  }

  console.log(`✅ Build registry initialized: ${allBuilds.length} products`);
  console.log(`   - Stories: ${storiesProducts.length}`);
  console.log(`   - Possibilities: ${possibilitiesProducts.length}`);
  console.log(`   - Essentials: ${essentialsProducts.length}`);
  console.log(`   - Vault: ${vaultProducts.length}`);
}
