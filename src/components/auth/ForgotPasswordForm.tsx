'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // frontend-only confirmation
    setSent(true);
  };

  return (
    <div className="auth-form-shell">
      <h2 className="account-access-title">Forgot Password</h2>

      {sent ? (
        <div className="auth-info">If an account exists for this email, a reset link would be sent.</div>
      ) : (
        <form onSubmit={handleSubmit} aria-live="polite">
          <label htmlFor="email">Email <span aria-hidden="true">*</span></label>
          <input id="email" name="email" type="email" autoComplete="email" required className="auth-input" value={email} onChange={(e) => setEmail(e.target.value)} />

          <div className="auth-actions">
            <button type="submit" className="account-access-button">Send Reset Link</button>
            <button type="button" className="account-access-button" onClick={() => router.push('/login?view=signin')}>Back to Sign In</button>
          </div>
        </form>
      )}
    </div>
  );
}
