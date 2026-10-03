'use client';

import { createContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { DisplayMode } from '@/types/displayMode';

export const DISPLAY_MODE_STORAGE_KEY = 'animestop-display-mode';
export const DISPLAY_MODE_COOKIE_KEY = 'animestop-display-mode';

type ModeContextValue = {
  mode: DisplayMode;
  setMode: (mode: DisplayMode) => void;
  toggleMode: () => void;
};

export const ModeContext = createContext<ModeContextValue | null>(null);

function normalizeMode(value: string | null | undefined): DisplayMode {
  return value === 'manga' ? 'manga' : 'anime';
}

export function ModeProvider({
  children,
  initialMode = 'anime',
}: {
  children: ReactNode;
  initialMode?: DisplayMode;
}) {
  const [mode, setModeState] = useState<DisplayMode>(initialMode);

  useEffect(() => {
    try {
      const storedMode = normalizeMode(localStorage.getItem(DISPLAY_MODE_STORAGE_KEY));
      const nextMode = storedMode === mode ? mode : storedMode;
      document.documentElement.dataset.displayMode = nextMode;
      localStorage.setItem(DISPLAY_MODE_STORAGE_KEY, nextMode);
      document.cookie = `${DISPLAY_MODE_COOKIE_KEY}=${nextMode}; path=/; max-age=31536000; samesite=lax`;
    } catch {
      document.documentElement.dataset.displayMode = mode;
    }
  }, [mode]);

  const setMode = useCallback((newMode: DisplayMode) => {
    setModeState(newMode);
    document.documentElement.dataset.displayMode = newMode;
    try {
      localStorage.setItem(DISPLAY_MODE_STORAGE_KEY, newMode);
      document.cookie = `${DISPLAY_MODE_COOKIE_KEY}=${newMode}; path=/; max-age=31536000; samesite=lax`;
    } catch {}
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
