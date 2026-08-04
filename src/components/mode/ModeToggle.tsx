'use client';

import { useDisplayMode } from '@/hooks/useDisplayMode';
import ModeIcon from './ModeIcon';

export default function ModeToggle() {
  const { mode, toggleMode } = useDisplayMode();

  return (
    <>
      <button
        type="button"
        className="mode-toggle"
        role="switch"
        aria-checked={mode === 'manga'}
        aria-label={mode === 'anime' ? 'Switch to Manga Mode' : 'Switch to Anime Mode'}
        title={mode === 'anime' ? 'Switch to Manga Mode' : 'Switch to Anime Mode'}
        onClick={toggleMode}
      >
        <span className="mode-toggle-track">
          <span className="mode-toggle-thumb">
            <ModeIcon mode={mode} />
          </span>
        </span>
      </button>
      
      <p className="sr-only" aria-live="polite">
        {mode === 'anime' ? 'Anime Mode enabled' : 'Manga Mode enabled'}
      </p>
    </>
  );
}
