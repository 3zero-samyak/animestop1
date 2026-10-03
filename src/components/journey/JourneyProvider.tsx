'use client';

import React from 'react';
import { useAuth } from '@/lib/AuthProvider';
import {
  calculateJourneyInterests,
  clearJourneySearches,
  clearJourneyViews,
  getContinueExploringProducts,
  subscribeToJourneyPreference,
  subscribeToJourneySearches,
  subscribeToJourneyViews,
  setJourneyRecordingPaused,
  type JourneyInterest,
  type JourneyPreference,
  type JourneySearchRecord,
  type JourneyViewRecord,
} from '@/lib/journey';
import { useSavedItems } from '@/components/saved/SavedItemsProvider';
import type { CollectionProduct } from '@/lib/catalog';

interface JourneyContextValue {
  loading: boolean;
  error: string | null;
  preferenceResolved: boolean;
  searches: JourneySearchRecord[];
  views: JourneyViewRecord[];
  preference: JourneyPreference;
  interests: JourneyInterest[];
  continueExploring: CollectionProduct[];
  clearSearches: () => Promise<void>;
  clearViews: () => Promise<void>;
  setPaused: (paused: boolean) => Promise<void>;
}

const JourneyContext = React.createContext<JourneyContextValue | undefined>(undefined);

export function JourneyProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { items: savedItems } = useSavedItems();
  const [searches, setSearches] = React.useState<JourneySearchRecord[]>([]);
  const [views, setViews] = React.useState<JourneyViewRecord[]>([]);
  const [preference, setPreference] = React.useState<JourneyPreference>({ recordingPaused: false });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [preferenceResolved, setPreferenceResolved] = React.useState(false);

  React.useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user?.uid) {
      const timer = window.setTimeout(() => {
        setSearches([]);
        setViews([]);
        setPreference({ recordingPaused: false });
        setLoading(false);
        setPreferenceResolved(false);
        setError(null);
      }, 0);

      return () => window.clearTimeout(timer);
    }

    let active = true;
    const unsubscribes = [
      subscribeToJourneySearches(user.uid, (next) => {
        if (!active) return;
        setSearches(next);
        setLoading(false);
      }, () => {
        if (!active) return;
        setError('We could not load your journey right now.');
        setLoading(false);
      }),
      subscribeToJourneyViews(user.uid, (next) => {
        if (!active) return;
        setViews(next);
      }, () => {
        if (!active) return;
        setError('We could not load your journey right now.');
      }),
      subscribeToJourneyPreference(user.uid, (next) => {
        if (!active) return;
        setPreference(next);
        setPreferenceResolved(true);
      }, () => {
        if (!active) return;
        setError('We could not load your journey settings.');
        setPreferenceResolved(true);
      }),
    ];

    return () => {
      active = false;
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [authLoading, user]);

  const interests = React.useMemo(
    () => calculateJourneyInterests(searches, views, savedItems),
    [savedItems, searches, views],
  );

  const continueExploring = React.useMemo(
    () => getContinueExploringProducts(views, savedItems, interests),
    [interests, savedItems, views],
  );

  const clearSearches = React.useCallback(async () => {
    if (!user?.uid) return;
    await clearJourneySearches(user.uid);
  }, [user]);

  const clearViews = React.useCallback(async () => {
    if (!user?.uid) return;
    await clearJourneyViews(user.uid);
  }, [user]);

  const setPaused = React.useCallback(async (paused: boolean) => {
    if (!user?.uid) return;
    await setJourneyRecordingPaused(user.uid, paused);
  }, [user]);

  const value = React.useMemo<JourneyContextValue>(() => ({
    loading,
    error,
    preferenceResolved,
    searches,
    views,
    preference,
    interests,
    continueExploring,
    clearSearches,
    clearViews,
    setPaused,
  }), [clearSearches, clearViews, continueExploring, error, interests, loading, preference, preferenceResolved, searches, setPaused, views]);

  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>;
}

export function useJourney() {
  const context = React.useContext(JourneyContext);
  if (!context) {
    throw new Error('useJourney must be used within a JourneyProvider');
  }

  return context;
}
