// Client-side search history utilities
// (Demo auth functions removed - now using Firebase authentication)

const SEARCH_KEY = 'animestop-demo-searches';

export type SearchEntry = { query: string; at: string };

export function getSearchHistory(): SearchEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SEARCH_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SearchEntry[];
  } catch {
    return [];
  }
}

export function addSearchQuery(query: string) {
  if (typeof window === 'undefined') return;
  try {
    const list = getSearchHistory();
    const entry = { query, at: new Date().toISOString() };
    list.unshift(entry);
    // keep recent 50
    const trimmed = list.slice(0, 50);
    localStorage.setItem(SEARCH_KEY, JSON.stringify(trimmed));
    // notify listeners
    try { window.dispatchEvent(new CustomEvent('animestop:search', { detail: entry })); } catch {}
  } catch {
    // noop
  }
}

export function clearSearchHistory() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SEARCH_KEY);
}
