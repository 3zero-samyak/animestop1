'use client';

import { createContext, useSyncExternalStore, useCallback, useEffect, ReactNode, useRef } from 'react';
import {
  DisplayMode,
  DISPLAY_MODE_STORAGE_KEY,
  DISPLAY_MODE_COOKIE_KEY,
} from '@/types/displayMode';

export { DISPLAY_MODE_STORAGE_KEY, DISPLAY_MODE_COOKIE_KEY };

type ModeContextValue = {
  mode: DisplayMode;
  setMode: (mode: DisplayMode) => void;
  toggleMode: () => void;
};

export const ModeContext = createContext<ModeContextValue | null>(null);

function applyModeToDOM(mode: DisplayMode) {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.displayMode = mode;
  document.documentElement.dataset.mode = mode;
  if (document.body) {
    document.body.dataset.displayMode = mode;
    document.body.dataset.mode = mode;
  }
}

function setStorageAndCookie(newMode: DisplayMode) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DISPLAY_MODE_STORAGE_KEY, newMode);
  } catch {
    // Storage access may be restricted (e.g. private browsing or disabled storage)
  }
  try {
    document.cookie = `${DISPLAY_MODE_COOKIE_KEY}=${newMode}; path=/; max-age=31536000; samesite=lax`;
  } catch {
    // Cookie access may be restricted
  }
}

const DISPLAY_MODE_EVENT = 'animestop-display-mode-change';

export function ModeProvider({
  children,
  initialMode = 'anime',
}: {
  children: ReactNode;
  initialMode?: DisplayMode;
}) {
  // In-memory fallback ensuring state and DOM updates succeed even if storage writes fail
  const memoryModeRef = useRef<DisplayMode | null>(null);

  const subscribe = useCallback((callback: () => void) => {
    const handleStorageChange = () => {
      // If external storage changes from another window, clear local memory override
      memoryModeRef.current = null;
      callback();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(DISPLAY_MODE_EVENT, callback);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(DISPLAY_MODE_EVENT, callback);
    };
  }, []);

  const getSnapshot = useCallback((): DisplayMode => {
    if (memoryModeRef.current !== null) {
      return memoryModeRef.current;
    }
    try {
      const stored = localStorage.getItem(DISPLAY_MODE_STORAGE_KEY);
      if (stored === 'anime' || stored === 'manga') {
        return stored;
      }
      return initialMode;
    } catch {
      return initialMode;
    }
  }, [initialMode]);

  const getServerSnapshot = useCallback((): DisplayMode => {
    return initialMode;
  }, [initialMode]);

  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Synchronize DOM attributes and ensure storage/cookie match current mode
  useEffect(() => {
    applyModeToDOM(mode);
    setStorageAndCookie(mode);
  }, [mode]);

  const setMode = useCallback((newMode: DisplayMode) => {
    memoryModeRef.current = newMode;
    setStorageAndCookie(newMode);
    applyModeToDOM(newMode);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(DISPLAY_MODE_EVENT, { detail: newMode }));
    }
  }, []);

  const toggleMode = useCallback(() => {
    setMode(mode === 'anime' ? 'manga' : 'anime');
  }, [mode, setMode]);

  return (
    <ModeContext.Provider value={{ mode, setMode, toggleMode }}>
      {children}
    </ModeContext.Provider>
  );
}
