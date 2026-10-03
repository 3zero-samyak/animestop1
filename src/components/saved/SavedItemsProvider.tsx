'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthProvider';
import { buildCurrentRelativeUrl, persistAuthReturnTo } from '@/lib/authNavigation';
import {
  resolveSavedItems,
  subscribeToSavedItems,
  toggleSavedItem,
  type ResolvedSavedItem,
  type SavedItemCollection,
  type SavedItemRecord,
} from '@/lib/savedItems';

interface SavedItemsContextValue {
  items: ResolvedSavedItem[];
  loading: boolean;
  error: string | null;
  isSaved: (collectionKey: SavedItemCollection, productId: string) => boolean;
  toggleItem: (collectionKey: SavedItemCollection, productId: string) => Promise<boolean | null>;
  retry: () => void;
}

const SavedItemsContext = React.createContext<SavedItemsContextValue | undefined>(undefined);

export function SavedItemsProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [records, setRecords] = React.useState<SavedItemRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [refreshToken, setRefreshToken] = React.useState(0);
  const [pendingIds, setPendingIds] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user?.uid) {
      const resetState = window.setTimeout(() => {
        setRecords([]);
        setLoading(false);
        setError(null);
      }, 0);

      return () => window.clearTimeout(resetState);
    }

    let active = true;

    const unsubscribe = subscribeToSavedItems(
      user.uid,
      (items) => {
        if (!active) {
          return;
        }

        setRecords(items);
        setError(null);
        setLoading(false);
      },
      () => {
        if (!active) {
          return;
        }

        setError('We could not load your saved items. Please try again.');
        setLoading(false);
      },
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, [authLoading, refreshToken, user]);

  const items = React.useMemo(() => resolveSavedItems(records), [records]);

  const isSaved = React.useCallback(
    (collectionKey: SavedItemCollection, productId: string) => records.some((record) => record.collection === collectionKey && record.productId === productId),
    [records],
  );

  const toggleItem = React.useCallback(async (collectionKey: SavedItemCollection, productId: string) => {
    if (!user?.uid) {
      const destination = buildCurrentRelativeUrl(window.location.pathname, window.location.search, window.location.hash);
      persistAuthReturnTo(destination);
      const params = new URLSearchParams();
      params.set('returnTo', destination);
      router.push(`/login?${params.toString()}`);
      return null;
    }

    const itemId = `${collectionKey}__${productId}`;
    if (pendingIds.has(itemId)) {
      return null;
    }

    setPendingIds((current) => new Set(current).add(itemId));
    setError(null);

    try {
      const nextSavedState = await toggleSavedItem(user.uid, collectionKey, productId, isSaved(collectionKey, productId));
      return nextSavedState;
    } catch {
      setError('We could not update your saved items. Please try again.');
      return null;
    } finally {
      setPendingIds((current) => {
        const next = new Set(current);
        next.delete(itemId);
        return next;
      });
    }
  }, [isSaved, pendingIds, router, user]);

  const retry = React.useCallback(() => {
    setLoading(true);
    setError(null);
    setRefreshToken((value) => value + 1);
  }, []);

  const value = React.useMemo<SavedItemsContextValue>(() => ({
    items,
    loading,
    error,
    isSaved,
    toggleItem,
    retry,
  }), [error, isSaved, items, loading, retry, toggleItem]);

  return <SavedItemsContext.Provider value={value}>{children}</SavedItemsContext.Provider>;
}

export function useSavedItems() {
  const context = React.useContext(SavedItemsContext);
  if (!context) {
    throw new Error('useSavedItems must be used within a SavedItemsProvider');
  }

  return context;
}
