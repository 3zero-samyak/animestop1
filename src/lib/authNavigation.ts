const AUTH_RETURN_TO_KEY = 'animestop-auth-return-to';
const AUTH_TOAST_KEY = 'animestop-auth-toast';
const AUTH_TOAST_EVENT = 'animestop:auth-toast';

export type AuthToastKind = 'success' | 'verified';

export type AuthToastMessage = {
  kind: AuthToastKind;
  message: string;
};

export function isSafeInternalDestination(value: string | null | undefined): value is string {
  return !!value && value.startsWith('/') && !value.startsWith('//');
}

export function getSafeReturnTo(value: string | null | undefined, fallback = '/account') {
  return isSafeInternalDestination(value) ? value : fallback;
}

export function buildCurrentRelativeUrl(pathname: string, search?: string | null, hash?: string | null) {
  const safePath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${safePath}${search || ''}${hash || ''}`;
}

export function persistAuthReturnTo(value: string) {
  if (typeof window === 'undefined' || !isSafeInternalDestination(value)) {
    return;
  }

  window.sessionStorage.setItem(AUTH_RETURN_TO_KEY, value);
}

export function readAuthReturnTo() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.sessionStorage.getItem(AUTH_RETURN_TO_KEY);
}

export function consumeAuthReturnTo(fallback = '/account') {
  if (typeof window === 'undefined') {
    return fallback;
  }

  const stored = readAuthReturnTo();
  window.sessionStorage.removeItem(AUTH_RETURN_TO_KEY);
  return getSafeReturnTo(stored, fallback);
}

export function persistAuthToast(toast: AuthToastMessage) {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.setItem(AUTH_TOAST_KEY, JSON.stringify(toast));
  window.dispatchEvent(new CustomEvent(AUTH_TOAST_EVENT, { detail: toast }));
}

export function consumeAuthToast(): AuthToastMessage | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.sessionStorage.getItem(AUTH_TOAST_KEY);
  if (!raw) {
    return null;
  }

  window.sessionStorage.removeItem(AUTH_TOAST_KEY);

  try {
    const parsed = JSON.parse(raw) as AuthToastMessage;
    if (!parsed?.message || (parsed.kind !== 'success' && parsed.kind !== 'verified')) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function subscribeToAuthToast(listener: (toast: AuthToastMessage) => void) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handler = (event: Event) => {
    const detail = (event as CustomEvent<AuthToastMessage>).detail;
    if (!detail?.message) {
      return;
    }

    listener(detail);
  };

  window.addEventListener(AUTH_TOAST_EVENT, handler as EventListener);
  return () => window.removeEventListener(AUTH_TOAST_EVENT, handler as EventListener);
}
