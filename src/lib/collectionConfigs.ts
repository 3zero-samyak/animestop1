import { storiesProducts } from '@/data/products/stories';
import { essentialsProducts } from '@/data/products/essentials';
import { possibilitiesProducts } from '@/data/products/possibilities';
import { vaultProducts } from '@/data/products/vault';
import {
  enrichCollectionProducts,
  type CollectionConfig,
} from './catalog';

const stories = enrichCollectionProducts(storiesProducts, 'stories');
const essentials = enrichCollectionProducts(essentialsProducts, 'essentials');
const possibilities = enrichCollectionProducts(possibilitiesProducts, 'possibilities');
const vault = enrichCollectionProducts(vaultProducts, 'vault');

export const storiesCollectionConfig: CollectionConfig = {
  key: 'stories',
  title: 'Stories',
  emptyHeading: 'NO MATCHING STORIES',
  emptyDescription: 'Try a different series filter or clear the search to see more Story concepts.',
  exploreMoreLabel: 'EXPLORE MORE STORIES',
  products: stories,
  filters: [
    { id: 'all', label: 'All Stories' },
    { id: 'one-piece', label: 'One Piece', tags: ['#onepiece'] },
    { id: 'naruto', label: 'Naruto', tags: ['#naruto'] },
    { id: 'attack-on-titan', label: 'Attack on Titan', tags: ['#aot'] },
    { id: 'demon-slayer', label: 'Demon Slayer', tags: ['#demonslayer'] },
    { id: 'original-worlds', label: 'Original Worlds', tags: ['#onepiece', '#naruto', '#aot', '#demonslayer'], mode: 'none-of' },
  ],
};

export const essentialsCollectionConfig: CollectionConfig = {
  key: 'essentials',
  title: 'Essentials',
  emptyHeading: 'NO MATCHING ESSENTIALS',
  emptyDescription: 'Try a different Essentials filter or clear the search to restore the collection.',
  exploreMoreLabel: 'EXPLORE MORE ESSENTIALS',
  products: essentials,
  filters: [
    { id: 'all', label: 'All Essentials' },
    { id: 'functional', label: 'Functional', tags: ['#functional', '#storage', '#keys'] },
    { id: 'display', label: 'Display', tags: ['#display', '#wall', '#shadowbox'] },
    { id: 'lighting', label: 'Lighting', tags: ['#lighting', '#led', '#glow'] },
    { id: 'miniatures', label: 'Miniatures', tags: ['#miniature', '#bust', '#figure'] },
    { id: 'symbols', label: 'Symbols', tags: ['#symbol', '#emblem', '#guild'] },
  ],
};

export const possibilitiesCollectionConfig: CollectionConfig = {
  key: 'possibilities',
  title: 'Possibilities',
  emptyHeading: 'NO MATCHING POSSIBILITIES',
  emptyDescription: 'Try a different idea category or clear the search to explore more alternate realities.',
  exploreMoreLabel: 'EXPLORE MORE POSSIBILITIES',
  products: possibilities,
  filters: [
    { id: 'all', label: 'All Possibilities' },
    { id: 'alternate-worlds', label: 'Alternate Worlds', tags: ['#alternate', '#multiverse', '#underwater'] },
    { id: 'character-paths', label: 'Character Paths', tags: ['#fate', '#mentor', '#deity'] },
    { id: 'crossovers', label: 'Crossover Ideas', tags: ['#crossover', '#fusion', '#team'] },
    { id: 'dark-turns', label: 'Dark Turns', tags: ['#nightmare', '#shadow', '#shattered'] },
    { id: 'future-worlds', label: 'Future Worlds', tags: ['#biotech', '#cosmic', '#retro'] },
  ],
};

export const vaultCollectionConfig: CollectionConfig = {
  key: 'vault',
  title: 'Vault',
  emptyHeading: 'NO MATCHING VAULT CONCEPTS',
  emptyDescription: 'Try another Vault filter or clear the search to see more premium archive builds.',
  exploreMoreLabel: 'EXPLORE MORE VAULT',
  products: vault,
  filters: [
    { id: 'all', label: 'All Vault' },
    { id: 'architecture', label: 'Architecture', tags: ['#throne', '#citadel', '#arena'] },
    { id: 'artifacts', label: 'Artifacts', tags: ['#relic', '#arsenal', '#crystal'] },
    { id: 'battle-scenes', label: 'Battle Scenes', tags: ['#battlefield', '#clash', '#tournament'] },
    { id: 'transformations', label: 'Transformations', tags: ['#transformation', '#evolution', '#manifestation'] },
    { id: 'otherworldly', label: 'Otherworldly', tags: ['#portal', '#timeline', '#aurora'] },
  ],
};

export const allCollectionProducts = [
  ...stories,
  ...essentials,
  ...possibilities,
  ...vault,
];

export function getCollectionConfig(collectionKey: CollectionConfig['key']) {
  switch (collectionKey) {
    case 'stories':
      return storiesCollectionConfig;
    case 'essentials':
      return essentialsCollectionConfig;
    case 'possibilities':
      return possibilitiesCollectionConfig;
    case 'vault':
      return vaultCollectionConfig;
    default:
      return storiesCollectionConfig;
  }
}

export function getCollectionRoute(collectionKey: CollectionConfig['key']) {
  return `/${collectionKey}`;
}

export function getCollectionLabel(collectionKey: CollectionConfig['key']) {
  return collectionKey.charAt(0).toUpperCase() + collectionKey.slice(1);
}
