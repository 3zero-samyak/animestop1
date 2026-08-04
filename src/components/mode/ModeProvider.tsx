'use client';

import { createContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { DisplayMode } from '@/types/displayMode';

const STORAGE_KEY = 'animestop-display-mode';

type ModeContextValue = {
  mode: DisplayMode;
  setMode: (mode: DisplayMode) => void;
  toggleMode: () => void;
};

export const ModeContext = createContext<ModeContextValue | null>(null);

function getInitialMode(): DisplayMode {
  if (typeof window === 'undefined') return 'anime';
  
  const stored = localStorage.getItem(STORAGE_KEY);
  return (stored === 'manga' || stored === 'anime') ? stored : 'anime';
}

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<DisplayMode>(getInitialMode);

  useEffect(() => {
    // Sync root attribute on mount
    document.documentElement.dataset.displayMode = mode;
  }, [mode]);

  const setMode = useCallback((newMode: DisplayMode) => {
    setModeState(newMode);
    document.documentElement.dataset.displayMode = newMode;
    localStorage.setItem(STORAGE_KEY, newMode);
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
