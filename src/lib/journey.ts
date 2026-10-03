import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  writeBatch,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import { allCollectionProducts } from './collectionConfigs';
import type { CollectionKey, CollectionProduct } from './catalog';
import type { ResolvedSavedItem } from './savedItems';

export type JourneySearchRecord = {
  id: string;
  query: string;
  scope: string;
  updatedAt: string | null;
};

export type JourneyViewRecord = {
  id: string;
  collection: CollectionKey;
  productId: string;
  updatedAt: string | null;
};

export type JourneyPreference = {
  recordingPaused: boolean;
};

export type JourneyInterest = {
  label: string;
  score: number;
};

export const JOURNEY_PREFERENCES_ID = 'journey';
const MAX_SEARCHES = 20;
const MAX_VIEWS = 24;

async function isJourneyRecordingPaused(uid: string) {
  const snapshot = await getDocs(query(collection(db, 'users', uid, 'journeyPreferences')));
  const preferenceDoc = snapshot.docs.find((entry) => entry.id === JOURNEY_PREFERENCES_ID);
  const data = preferenceDoc?.data() as Partial<JourneyPreference> | undefined;
  return data?.recordingPaused === true;
}

function normalizeTimestamp(value: unknown) {
  if (value && typeof value === 'object' && 'toDate' in value && typeof (value as { toDate?: () => Date }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  return null;
}

export function normalizeJourneyQuery(query: string) {
  return query.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function getJourneySearchId(query: string, scope: string) {
  const normalized = normalizeJourneyQuery(query).replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return `${scope}__${normalized || 'search'}`;
}

export function getJourneyViewId(collectionKey: CollectionKey, productId: string) {
  return `${collectionKey}__${productId}`;
}

export function resolveJourneyProduct(collectionKey: CollectionKey, productId: string) {
  return allCollectionProducts.find((product) => product.collectionKey === collectionKey && product.id === productId) ?? null;
}

export function subscribeToJourneySearches(uid: string, onItems: (items: JourneySearchRecord[]) => void, onError: (error: unknown) => void): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'users', uid, 'journeySearches'), orderBy('updatedAt', 'desc')),
    (snapshot) => {
      onItems(snapshot.docs.map((entry) => {
        const data = entry.data() as { query: string; scope: string; updatedAt?: unknown };
        return {
          id: entry.id,
          query: data.query,
          scope: data.scope,
          updatedAt: normalizeTimestamp(data.updatedAt),
        } satisfies JourneySearchRecord;
      }));
    },
    onError,
  );
}

export function subscribeToJourneyViews(uid: string, onItems: (items: JourneyViewRecord[]) => void, onError: (error: unknown) => void): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'users', uid, 'journeyViews'), orderBy('updatedAt', 'desc')),
    (snapshot) => {
      onItems(snapshot.docs.map((entry) => {
        const data = entry.data() as { collection: CollectionKey; productId: string; updatedAt?: unknown };
        return {
          id: entry.id,
          collection: data.collection,
          productId: data.productId,
          updatedAt: normalizeTimestamp(data.updatedAt),
        } satisfies JourneyViewRecord;
      }));
    },
    onError,
  );
}

export function subscribeToJourneyPreference(uid: string, onValue: (preference: JourneyPreference) => void, onError: (error: unknown) => void): Unsubscribe {
  return onSnapshot(
    doc(db, 'users', uid, 'journeyPreferences', JOURNEY_PREFERENCES_ID),
    (snapshot) => {
      const data = snapshot.exists()
        ? (snapshot.data() as Partial<JourneyPreference>)
        : null;

      onValue({ recordingPaused: data?.recordingPaused === true });
    },
    onError,
  );
}

export async function setJourneyRecordingPaused(uid: string, paused: boolean) {
  await setDoc(doc(db, 'users', uid, 'journeyPreferences', JOURNEY_PREFERENCES_ID), {
    recordingPaused: paused,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function recordJourneySearch(uid: string, queryValue: string, scope: string) {
  const normalizedQuery = normalizeJourneyQuery(queryValue);
  if (!normalizedQuery) {
    return;
  }

  if (await isJourneyRecordingPaused(uid)) {
    return;
  }

  const searchId = getJourneySearchId(normalizedQuery, scope);
  await setDoc(doc(db, 'users', uid, 'journeySearches', searchId), {
    query: normalizedQuery,
    scope,
    updatedAt: serverTimestamp(),
  });

  await trimJourneyCollection(uid, 'journeySearches', MAX_SEARCHES);
}

export async function recordJourneyView(uid: string, collectionKey: CollectionKey, productId: string) {
  if (await isJourneyRecordingPaused(uid)) {
    return;
  }

  const viewId = getJourneyViewId(collectionKey, productId);
  await setDoc(doc(db, 'users', uid, 'journeyViews', viewId), {
    collection: collectionKey,
    productId,
    updatedAt: serverTimestamp(),
  });

  await trimJourneyCollection(uid, 'journeyViews', MAX_VIEWS);
}

async function trimJourneyCollection(uid: string, collectionName: 'journeySearches' | 'journeyViews', keep: number) {
  const snapshot = await getDocs(query(collection(db, 'users', uid, collectionName), orderBy('updatedAt', 'desc')));
  if (snapshot.size <= keep) {
    return;
  }

  const batch = writeBatch(db);
  snapshot.docs.slice(keep).forEach((entry) => batch.delete(entry.ref));
  await batch.commit();
}

export async function clearJourneySearches(uid: string) {
  const snapshot = await getDocs(collection(db, 'users', uid, 'journeySearches'));
  const batch = writeBatch(db);
  snapshot.docs.forEach((entry) => batch.delete(entry.ref));
  await batch.commit();
}

export async function clearJourneyViews(uid: string) {
  const snapshot = await getDocs(collection(db, 'users', uid, 'journeyViews'));
  const batch = writeBatch(db);
  snapshot.docs.forEach((entry) => batch.delete(entry.ref));
  await batch.commit();
}

export function calculateJourneyInterests(searches: JourneySearchRecord[], views: JourneyViewRecord[], savedItems: ResolvedSavedItem[]) {
  const scores = new Map<string, number>();

  const bump = (label: string, weight: number) => {
    scores.set(label, (scores.get(label) ?? 0) + weight);
  };

  searches.forEach((search) => {
    bump(search.scope.toUpperCase(), 1.5);
    allCollectionProducts.forEach((product) => {
      if (product.title.toLowerCase().includes(search.query) || product.category.toLowerCase().includes(search.query) || (product.tags ?? []).some((tag) => tag.toLowerCase().includes(search.query))) {
        bump(product.category, 1);
      }
    });
  });

  views.forEach((view) => {
    bump(view.collection.toUpperCase(), 2);
    const product = resolveJourneyProduct(view.collection, view.productId);
    if (product) {
      bump(product.category, 2);
    }
  });

  savedItems.forEach((item) => {
    bump(item.collection.toUpperCase(), 3);
    if (item.product) {
      bump(item.product.category, 4);
    }
  });

  return Array.from(scores.entries())
    .map(([label, score]) => ({ label, score }))
    .sort((left, right) => right.score - left.score)
    .slice(0, 4);
}

export function getContinueExploringProducts(views: JourneyViewRecord[], savedItems: ResolvedSavedItem[], interests: JourneyInterest[]) {
  const seen = new Set<string>();
  const products: CollectionProduct[] = [];

  const pushProduct = (product: CollectionProduct | null) => {
    if (!product || seen.has(product.id)) {
      return;
    }

    seen.add(product.id);
    products.push(product);
  };

  views.forEach((view) => pushProduct(resolveJourneyProduct(view.collection, view.productId)));
  savedItems.forEach((item) => pushProduct(item.product));

  interests.forEach((interest) => {
    const related = allCollectionProducts.filter((product) => product.category === interest.label || product.collectionKey.toUpperCase() === interest.label);
    related.forEach((product) => pushProduct(product));
  });

  return products.slice(0, 6);
}
