import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import { allCollectionProducts, getCollectionRoute } from './collectionConfigs';
import type { CollectionKey, CollectionProduct } from './catalog';

export type SavedItemCollection = CollectionKey;

export type SavedItemRecord = {
  id: string;
  collection: SavedItemCollection;
  productId: string;
  createdAt: string | null;
};

export type ResolvedSavedItem = SavedItemRecord & {
  product: CollectionProduct | null;
  href: string | null;
};

const ALLOWED_COLLECTIONS: SavedItemCollection[] = ['stories', 'essentials', 'possibilities', 'vault'];

export function getSavedItemId(collectionKey: SavedItemCollection, productId: string) {
  return `${collectionKey}__${productId}`;
}

export function isSupportedSavedCollection(value: string): value is SavedItemCollection {
  return ALLOWED_COLLECTIONS.includes(value as SavedItemCollection);
}

export function resolveSavedProduct(collectionKey: SavedItemCollection, productId: string) {
  return allCollectionProducts.find((product) => product.collectionKey === collectionKey && product.id === productId) ?? null;
}

export function resolveSavedItems(records: SavedItemRecord[]): ResolvedSavedItem[] {
  return records.map((record) => {
    const product = resolveSavedProduct(record.collection, record.productId);
    return {
      ...record,
      product,
      href: product ? `/builds/${product.buildSlug}` : null,
    };
  });
}

export function subscribeToSavedItems(uid: string, onItems: (items: SavedItemRecord[]) => void, onError: (error: unknown) => void): Unsubscribe {
  const savedItemsQuery = query(
    collection(db, 'users', uid, 'savedItems'),
    orderBy('createdAt', 'desc'),
  );

  return onSnapshot(
    savedItemsQuery,
    (snapshot) => {
      const nextItems = snapshot.docs.map((savedItem) => {
        const data = savedItem.data() as {
          collection: SavedItemCollection;
          productId: string;
          createdAt?: { toDate?: () => Date } | null;
        };

        return {
          id: savedItem.id,
          collection: data.collection,
          productId: data.productId,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : null,
        } satisfies SavedItemRecord;
      });

      onItems(nextItems);
    },
    onError,
  );
}

export async function saveItem(uid: string, collectionKey: SavedItemCollection, productId: string) {
  const itemId = getSavedItemId(collectionKey, productId);
  await setDoc(doc(db, 'users', uid, 'savedItems', itemId), {
    collection: collectionKey,
    productId,
    createdAt: serverTimestamp(),
  });
}

export async function removeSavedItem(uid: string, collectionKey: SavedItemCollection, productId: string) {
  const itemId = getSavedItemId(collectionKey, productId);
  await deleteDoc(doc(db, 'users', uid, 'savedItems', itemId));
}

export async function toggleSavedItem(uid: string, collectionKey: SavedItemCollection, productId: string, isSaved: boolean) {
  if (isSaved) {
    await removeSavedItem(uid, collectionKey, productId);
    return false;
  }

  await saveItem(uid, collectionKey, productId);
  return true;
}

export function getSavedCollectionHref(collectionKey: SavedItemCollection) {
  return getCollectionRoute(collectionKey);
}
