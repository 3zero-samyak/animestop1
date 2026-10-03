'use client';

import React from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { consumeAuthToast, subscribeToAuthToast, type AuthToastMessage } from '@/lib/authNavigation';

export default function AuthToastHost() {
  const [toast, setToast] = React.useState<AuthToastMessage | null>(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    return consumeAuthToast();
  });

  React.useEffect(() => subscribeToAuthToast((nextToast) => {
    window.setTimeout(() => setToast(nextToast), 0);
  }), []);

  React.useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => setToast(null), toast.kind === 'verified' ? 4000 : 3600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  if (!toast) {
    return null;
  }

  return (
    <div className="auth-toast" role="status" aria-live="polite">
      <div className="auth-toast-body">
        <span className="auth-toast-icon" aria-hidden="true">
          <CheckCircle2 size={18} strokeWidth={2.25} />
        </span>
        <p className="auth-toast-message">{toast.message}</p>
        <button
          type="button"
          className="auth-toast-dismiss"
          onClick={() => setToast(null)}
          aria-label="Dismiss notification"
        >
          <X size={16} strokeWidth={2.25} />
        </button>
      </div>
    </div>
  );
}
