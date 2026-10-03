import type { ProductDetail } from '@/types/product';

export type CollectionKey = 'stories' | 'essentials' | 'possibilities' | 'vault';

export type CollectionProduct = ProductDetail & {
  collectionKey: CollectionKey;
  buildSlug: string;
};

export type CollectionFilterOption = {
  id: string;
  label: string;
  tags?: string[];
  mode?: 'all' | 'none-of';
};

export type CollectionConfig = {
  key: CollectionKey;
  title: string;
  emptyHeading: string;
  emptyDescription: string;
  exploreMoreLabel: string;
  filters: CollectionFilterOption[];
  products: CollectionProduct[];
};

export const INITIAL_VISIBLE_COUNT = 8;
export const LOAD_MORE_COUNT = 8;

export function makeBuildSlug(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function enrichCollectionProducts(products: ProductDetail[], collectionKey: CollectionKey): CollectionProduct[] {
  return products.map((product) => ({
    ...product,
    collectionKey,
    buildSlug: makeBuildSlug(product.id || product.title || 'build'),
  }));
}

export function normalizeSearchValue(value: string) {
  return value.trim().toLowerCase();
}

export function matchesSearch(product: CollectionProduct, query: string) {
  const normalizedQuery = normalizeSearchValue(query);
  if (!normalizedQuery) {
    return true;
  }

  const haystacks = [
    product.title,
    product.cardTitle,
    product.category,
    product.shortDescription,
    product.fullDescription,
    product.inspiration,
    ...(product.tags ?? []),
  ]
    .filter(Boolean)
    .map((value) => String(value).toLowerCase());

  return haystacks.some((value) => value.includes(normalizedQuery));
}

function matchesFilter(product: CollectionProduct, filter: CollectionFilterOption) {
  if (filter.id === 'all' || !filter.tags?.length) {
    return true;
  }

  const tagSet = new Set((product.tags ?? []).map((entry) => entry.toLowerCase()));
  const filterTags = filter.tags.map((entry) => entry.toLowerCase());

  if (filter.mode === 'none-of') {
    return filterTags.every((tag) => !tagSet.has(tag));
  }

  return filterTags.some((tag) => tagSet.has(tag));
}

export function applyCollectionFilters(
  products: CollectionProduct[],
  filterId: string,
  query: string,
  filterOptions: CollectionFilterOption[],
) {
  const activeFilter = filterOptions.find((filter) => filter.id === filterId) ?? filterOptions[0];
  return products.filter((product) => matchesFilter(product, activeFilter) && matchesSearch(product, query));
}

export function formatCollectionDate(input: string) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(input));
  } catch {
    return input;
  }
}
