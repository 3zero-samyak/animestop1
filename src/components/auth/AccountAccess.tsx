'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function AccountAccess({ onOpenSignIn, onOpenCreate }: { onOpenSignIn: () => void; onOpenCreate: () => void; }) {
  const router = useRouter();

  return (
    <section className="account-access">
      <h2 className="account-access-title">Account Access</h2>

      <div className="account-access-actions">
        <button
          type="button"
          className="account-access-button"
          onClick={() => router.push('/')}
        >
          Continue without sign in
        </button>

        <button
          type="button"
          className="account-access-button"
          onClick={onOpenSignIn}
        >
          Sign in
        </button>

        <button
          type="button"
          className="account-access-button"
          onClick={onOpenCreate}
        >
          Create account
        </button>
      </div>
    </section>
  );
}
