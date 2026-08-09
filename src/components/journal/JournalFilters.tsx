'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function JournalFilters({ sort, onSort }: { sort: string; onSort: (s: string)=>void }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!menuRef.current || !triggerRef.current) return;
      if (!menuRef.current.contains(t) && !triggerRef.current.contains(t)) setOpen(false);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('click', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const select = (value: string) => {
    onSort(value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div className="journal-sort-row" role="group" aria-label="Sort journals">
      <label className="journal-sort-label" id="journal-sort-label">Sort by:</label>

      <div className="journal-sort-wrapper">
        <button
          ref={triggerRef}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-labelledby="journal-sort-label"
          className="journal-sort-trigger journal-interactive"
          onClick={() => setOpen((s)=>!s)}
        >
          <span>{sort === 'oldest' ? 'Oldest' : 'Latest'}</span>
          <svg className="journal-sort-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {open && (
          <ul ref={menuRef} role="listbox" aria-labelledby="journal-sort-label" tabIndex={-1} className="journal-sort-menu">
            <li role="option" aria-selected={sort === 'latest'} tabIndex={0} className="journal-sort-option" onClick={()=>select('latest')}>Latest</li>
            <li role="option" aria-selected={sort === 'oldest'} tabIndex={0} className="journal-sort-option" onClick={()=>select('oldest')}>Oldest</li>
          </ul>
        )}
      </div>
    </div>
  );
}
